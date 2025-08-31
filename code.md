# 代码审查报告（screen-recording-tool）

更新时间：2025-08-31

## 架构与运行路径概览

- 技术栈：Electron（主进程 `main.js` + 渲染进程 `index.html` 内联脚本）、HTML/CSS/JS、`@electron/remote`、MediaRecorder、`@ffmpeg-installer/ffmpeg` + `fluent-ffmpeg`。
- 启动：`npm start` -> electron 启动 `main.js` -> 创建 `BrowserWindow` 加载 `index.html`。
- 录制：渲染进程用 `desktopCapturer` 枚举源 -> `getUserMedia`（带 `chromeMediaSource` 约束）采集 -> `MediaRecorder` 分段（30s）录制 -> 结束后在前端合并 Blob 预览 -> 通过 FFmpeg 转码/裁剪并保存。
- 构建：`electron-builder`，Windows 目标 NSIS，Electron 下载源走镜像。

## 亮点

- UI 友好：分辨率选择、录制中指示、计时器、进度条与 Toast 提示，整体交互清晰。
- 功能覆盖：
  - 屏幕/窗口录制 + 可选系统音频；
  - 时间裁剪与区域裁剪（FFmpeg 处理，含 asar 路径修正）；
  - 分段录制策略，有助于长时录制的稳定性；
  - 下载前进行 H.264 + faststart 优化以提升兼容性。
- 打包经验：对 asar 场景的 ffmpeg 路径处理较完整。

## 主要问题与优先级

- P0 安全与稳定
  1) 渲染进程开启 `nodeIntegration: true`、`contextIsolation: false`、启用 remote（`enableRemoteModule: true`）——存在高风险注入/RCE面风险；`@electron/remote` 亦已不推荐。
  2) Windows 默认文件名不合法：`new Date().toISOString()` 会包含冒号（:），在 `showSaveDialog` 的 `defaultPath` 上会导致保存失败。
  3) 分段合并方式有风险：使用简单 Blob 拼接生成 WebM，容器索引可能不正确，跨播放器/浏览器兼容性不稳（索引/时间戳重置）。

- P1 兼容与体验
  4) `MediaRecorder` 指定 `mimeType: video/webm;codecs=h264` 兼容性存疑，多数场景推荐 VP8/VP9；虽有降级但需要明确策略与告警。
  5) 权限/失败兜底不足：`getUserMedia`/设备缺失/权限拒绝/音频设备不可用时的提示与恢复流程缺失。
  6) 资源释放：未 `URL.revokeObjectURL`，`window.originalVideoBlob` 长驻内存，大文件会放大泄漏风险。
  7) Toast 工具函数在 `index.html` 出现重复定义，易混淆与维护困难。

- P2 工程化与可维护性
  8) 旧式 `mandatory` 约束写法（`chromeMediaSourceId`）可保留但建议兼容更现代的 API（如 `getDisplayMedia` 在 Electron 的可用性评估）。
  9) 无类型/测试/CI 质量门：缺少 Lint、格式化、单测/端测与基本冒烟。
  10) 许可与元数据：`package.json` license `ISC` 与仓库 `LICENSE` 内容可能不一致，需统一。

## 关键文件与定位

- `main.js`：窗口安全策略过宽（nodeIntegration/contextIsolation/remote）。
- `index.html`：
  - 文件名：`downloadBtn` 保存时使用 `new Date().toISOString()` 作为默认文件名（包含冒号）。
  - 分段与合并：`BLOCK_DURATION = 30000`，`mergeBlobs` 直接拼接 `Uint8Array`；
  - Toast 定义重复；未 `revokeObjectURL`。
- `time-trim.js`：FFmpeg 裁剪/转码流程基本可用，但同样依赖渲染进程 `require`，未来硬化后需迁移至主进程/预加载桥接。

## 改进建议（带执行要点）

- P0：渲染进程安全加固
  - 关闭 `nodeIntegration`，开启 `contextIsolation`；移除 `@electron/remote`，改用 `contextBridge + ipcRenderer` 与主进程通信（文件系统、对话框、FFmpeg 调用统一在主进程执行）。
  - 建立最小可用 API：保存文件、打开保存对话框、调用 FFmpeg（或使用子进程/worker）。

- P0：文件名合法化（Windows）
  - 将默认文件名改为 `screen-recording-YYYYMMDD-HHMMSS.mp4`，移除非法字符：\/:*?"<>|。

- P0：分段录制合并的正确性
  - 方案A（推荐）录制一次不中断，使用 `mediaRecorder.start(timeslice)` 周期触发 `dataavailable` 获取小块，最终合成仍是同一轨道流；
  - 方案B 使用 FFmpeg 在本地对多段 WebM 进行 concat（需先转为同编码/容器，或走 `ffmpeg -f concat -safe 0 -i list.txt -c copy` 流程）。

- P1：兼容策略与降级提示
  - 首选 `video/webm;codecs=vp9` 或 `vp8`，若不支持再降级；当回落到默认编码时，明确在 UI 提示“使用兼容编码，文件体积可能增大”。

- P1：资源管理
  - 统一管理 ObjectURL 与 Blob 生命周期：切换预览、完成保存/裁剪后及时 `URL.revokeObjectURL`；大文件 Blob 在不再需要时置空。

- P1：错误处理与可观测性
  - 为 `getUserMedia`、`MediaRecorder`、`ffmpeg`（进程/路径/权限）增加用户友好错误提示与日志；
  - 为裁剪/转码失败时提供“保存原始 WebM”的兜底路径（已有，需完善 UI 提示与文件命名）。

- P2：工程化
  - 增加 ESLint + Prettier、`npm run lint`；
  - 引入简单的冒烟测试（录制5秒->合成->转码->存在性校验）；
  - README 增加已知问题与常见故障排查（显卡驱动、权限、设备不可用等）。

## 风险与测试建议

- 长时录制：>1小时的内存与磁盘占用、FFmpeg 处理耗时与临时盘空间不足。
- 编码兼容：不同显卡/驱动下的 `MediaRecorder` 编码支持差异；H.264 in WebM 的兼容性。
- 多显示器/DPI：区域裁剪时 CSS 像素与视频像素的映射偏差（当前用比例，较稳但需在缩放场景回归）。
- 音频：仅系统音频，缺少麦克风/混音选择；无音频设备/被占用时的提示。

建议最小测试集：
- Windows 10/11 下 720p/1080p 录制 2 分钟，开启/关闭音频各一次；
- 分段合并开启，预览与导出两个流程；
- 时间裁剪与区域裁剪各 1 次，验证首帧/末帧；
- 保存对话框默认文件名合法性；
- 打包版（nsis 安装后）验证 ffmpeg 路径与权限。

## 质量门禁现状（快速体检）
- Build：未验证本地构建；依赖版本偏旧（Electron 25）。
- Lint/Typecheck：未配置。
- Unit/E2E：未配置。
- 简烟测试：建议补充脚本与说明。

## 后续路线（建议顺序）
1) 安全基线：预加载隔离 + 移除 remote；
2) 文件名与资源释放修复；
3) 分段合并正确性改造（优先 A 方案）；
4) 编码兼容与降级提示；
5) 工程化与测试补齐；
6) 版本升级与发布流水线验证。
