# 屏幕录制工具

[English](./README_EN.md) | 中文

一个基于Electron的桌面屏幕录制应用，提供简洁易用的界面，支持选择窗口或全屏进行录制。

## 功能特点

- **多种录制模式**：支持录制整个屏幕或单个窗口
- **视频裁剪**：支持对录制的视频进行区域裁剪
- **实时预览**：录制完成后可立即预览录制内容
- **本地保存**：将录制内容保存为MP4或WebM格式的视频文件，优化后的MP4文件可在大多数移动设备上正常播放
- **录制计时器**：显示当前录制时长
- **高DPI支持**：适配高分辨率屏幕，解决高DPI屏幕下坐标不准确的问题
- **现代化界面**：采用简洁美观的UI设计，提供流畅的用户体验

## 安装步骤

### 前提条件

- Node.js (推荐v14.0.0或更高版本)
- npm (推荐v6.0.0或更高版本)

### 安装依赖

```bash
# 克隆仓库后，进入项目目录
npm install
```

### 运行应用

```bash
npm start
```

### 构建应用

```bash
npm run build
```

构建完成后，可在`dist`目录找到对应平台的安装包。

## 使用指南

1. **启动应用**：运行应用后，会看到主界面，包含「屏幕录制」、「裁剪视频」和「下载录像」三个按钮。

2. **开始录制**：
   - 点击「屏幕录制」按钮
   - 在弹出的窗口中选择要录制的窗口或屏幕
   - 确认选择后，开始录制
   - 录制过程中可以看到录制时长

3. **停止录制**：
   - 录制过程中，「屏幕录制」按钮会变为红色
   - 再次点击该按钮停止录制
   - 录制内容会在预览区域显示

4. **视频裁剪**：
   - 录制完成后，点击「裁剪视频」按钮
   - 在预览区域通过拖拽选择要保留的视频区域
   - 点击「应用裁剪」确认，或「取消裁剪」放弃更改

5. **保存录像**：
   - 点击「下载录像」按钮
   - 在弹出的对话框中选择保存位置和文件名
   - 选择保存格式（MP4或WebM）

## 技术栈

- Electron：跨平台桌面应用框架
- HTML/CSS/JavaScript：前端界面
- MediaRecorder API：实现屏幕录制功能
- Electron Remote：进程间通信