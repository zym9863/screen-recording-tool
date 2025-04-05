// 时间轴裁剪功能相关代码

// 初始化变量
let startTrimTime = 0;
let endTrimTime = 0;
let isDraggingStartHandle = false;
let isDraggingEndHandle = false;
let videoTotalDuration = 0;
let currentTrimType = 'time'; // 'time' 或 'area'

// 获取DOM元素函数 - 在初始化时调用
function initTimeTrim() {
    // 获取DOM元素
    const preview = document.getElementById('preview');
    const timeTrimContainer = document.getElementById('timeTrimContainer');
    const timeSliderTrack = document.getElementById('timeSliderTrack');
    const timeSliderProgress = document.getElementById('timeSliderProgress');
    const startTimeHandle = document.getElementById('startTimeHandle');
    const endTimeHandle = document.getElementById('endTimeHandle');
    const startTimeDisplay = document.getElementById('startTimeDisplay');
    const endTimeDisplay = document.getElementById('endTimeDisplay');
    const totalTimeDisplay = document.getElementById('totalTimeDisplay');
    const applyTimeTrimBtn = document.getElementById('applyTimeTrimBtn');
    const cancelTimeTrimBtn = document.getElementById('cancelTimeTrimBtn');
    const trimTypeOptions = document.querySelectorAll('.trim-type-option');
    
    // 视频加载完成后获取总时长
    preview.addEventListener('loadedmetadata', () => {
        // 确保视频已经完全加载并且duration是有效值
        if (preview.readyState >= 1 && !isNaN(preview.duration) && isFinite(preview.duration)) {
            videoTotalDuration = preview.duration;
            endTrimTime = preview.duration;
            updateTimeDisplay();
        }
    });
    
    // 视频数据加载完成后再次检查时长
    preview.addEventListener('loadeddata', () => {
        if (!isNaN(preview.duration) && isFinite(preview.duration)) {
            videoTotalDuration = preview.duration;
            endTrimTime = preview.duration;
            updateTimeDisplay();
        }
    });
    
    // 切换裁剪类型
    trimTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            switchTrimType(type);
        });
    });
    
    // 开始时间点拖动事件
    startTimeHandle.addEventListener('mousedown', (e) => {
        isDraggingStartHandle = true;
        e.preventDefault();
    });
    
    // 结束时间点拖动事件
    endTimeHandle.addEventListener('mousedown', (e) => {
        isDraggingEndHandle = true;
        e.preventDefault();
    });
    
    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingStartHandle && !isDraggingEndHandle) return;
        
        const trackRect = timeSliderTrack.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - trackRect.left) / trackRect.width));
        
        if (isDraggingStartHandle) {
            // 确保开始时间不超过结束时间
            startTrimTime = Math.min(percentage * videoTotalDuration, endTrimTime);
            updateTimeDisplay();
        } else if (isDraggingEndHandle) {
            // 确保结束时间不小于开始时间
            endTrimTime = Math.max(percentage * videoTotalDuration, startTrimTime);
            updateTimeDisplay();
        }
    });
    
    // 鼠标松开事件
    document.addEventListener('mouseup', () => {
        if (isDraggingStartHandle || isDraggingEndHandle) {
            isDraggingStartHandle = false;
            isDraggingEndHandle = false;
        }
    });
    
    // 应用时间裁剪按钮点击事件
    applyTimeTrimBtn.addEventListener('click', () => {
        applyTimeTrim();
    });
    
    // 取消时间裁剪按钮点击事件
    cancelTimeTrimBtn.addEventListener('click', () => {
        timeTrimContainer.style.display = 'none';
    });
}

// 切换裁剪类型
function switchTrimType(type) {
    currentTrimType = type;
    const cropContainer = document.getElementById('cropContainer');
    const timeTrimContainer = document.getElementById('timeTrimContainer');
    const trimTypeOptions = document.querySelectorAll('.trim-type-option');
    
    // 更新选项样式
    trimTypeOptions.forEach(option => {
        if (option.getAttribute('data-type') === type) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 显示对应的裁剪界面
    if (type === 'area') {
        cropContainer.style.display = 'block';
        timeTrimContainer.style.display = 'none';
    } else {
        cropContainer.style.display = 'none';
        timeTrimContainer.style.display = 'block';
    }
}

// 更新时间显示
function updateTimeDisplay() {
    const startTimeDisplay = document.getElementById('startTimeDisplay');
    const endTimeDisplay = document.getElementById('endTimeDisplay');
    const totalTimeDisplay = document.getElementById('totalTimeDisplay');
    const timeSliderProgress = document.getElementById('timeSliderProgress');
    const startTimeHandle = document.getElementById('startTimeHandle');
    const endTimeHandle = document.getElementById('endTimeHandle');
    
    // 更新时间显示
    startTimeDisplay.textContent = formatTime(startTrimTime);
    endTimeDisplay.textContent = formatTime(endTrimTime);
    totalTimeDisplay.textContent = formatTime(videoTotalDuration);
    
    // 更新进度条和手柄位置
    const startPercentage = (startTrimTime / videoTotalDuration) * 100;
    const endPercentage = (endTrimTime / videoTotalDuration) * 100;
    
    startTimeHandle.style.left = `${startPercentage}%`;
    endTimeHandle.style.left = `${endPercentage}%`;
    timeSliderProgress.style.left = `${startPercentage}%`;
    timeSliderProgress.style.width = `${endPercentage - startPercentage}%`;
}

// 格式化时间为 MM:SS.ms 格式
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 100);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// 应用时间裁剪
function applyTimeTrim() {
    const preview = document.getElementById('preview');
    const timeTrimContainer = document.getElementById('timeTrimContainer');
    
    // 显示加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1001;
    `;
    
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        width: 300px;
        height: 8px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        margin-top: 16px;
        overflow: hidden;
        position: relative;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 0%;
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 4px;
        transition: width 0.3s ease;
    `;
    
    const progressText = document.createElement('div');
    progressText.style.cssText = `
        margin-top: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
    `;
    progressText.textContent = '准备处理视频...';
    
    progressContainer.appendChild(progressBar);
    loadingIndicator.innerHTML = `<div style="font-weight: 500; font-size: 18px; margin-bottom: 8px;">正在处理视频</div>`;
    loadingIndicator.appendChild(progressContainer);
    loadingIndicator.appendChild(progressText);
    document.body.appendChild(loadingIndicator);
    
    // 使用 FFmpeg 进行视频时间裁剪
    if (window.originalVideoBlob) {
        // 创建临时文件路径
        const fs = require('fs');
        const path = require('path');
        const os = require('os');
        const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
        const ffmpeg = require('fluent-ffmpeg');
        
        // 设置ffmpeg路径
        let ffmpegPathFixed = ffmpegPath;
        if (ffmpegPathFixed.includes('app.asar')) {
            ffmpegPathFixed = ffmpegPathFixed.replace('app.asar', 'app.asar.unpacked');
        }
        ffmpeg.setFfmpegPath(ffmpegPathFixed);
        
        // 创建临时文件路径
        const tempDir = os.tmpdir();
        const tempInputPath = path.join(tempDir, `temp-input-${Date.now()}.webm`);
        const tempOutputPath = path.join(tempDir, `temp-output-${Date.now()}.mp4`);
        
        // 将blob写入临时文件
        const reader = new FileReader();
        
        reader.onload = () => {
            const buffer = Buffer.from(reader.result);
            
            // 写入临时输入文件
            fs.writeFile(tempInputPath, buffer, async (err) => {
                if (err) {
                    document.body.removeChild(loadingIndicator);
                    console.error('保存临时文件失败:', err);
                    showErrorToast('裁剪失败: ' + err.message);
                    return;
                }
                
                try {
                    // 计算裁剪参数（秒为单位）
                    const startSeconds = startTrimTime;
                    const duration = endTrimTime - startTrimTime;
                    
                    // 使用ffmpeg裁剪视频
                    await new Promise((resolve, reject) => {
                        let lastProgress = 0;
                        
                        ffmpeg(tempInputPath)
                            .setStartTime(startSeconds)
                            .setDuration(duration)
                            .outputOptions([
                                '-c:v libx264',
                                '-preset ultrafast', // 使用最快的编码预设
                                '-crf 23', // 平衡质量和文件大小
                                '-pix_fmt yuv420p',
                                '-movflags +faststart'
                            ])
                            .output(tempOutputPath)
                            .on('progress', (progress) => {
                                // 更新进度条，避免过于频繁的更新
                                if (progress.percent && progress.percent > lastProgress + 1) {
                                    lastProgress = progress.percent;
                                    progressBar.style.width = `${Math.min(95, progress.percent)}%`;
                                    progressText.textContent = `处理中: ${Math.round(progress.percent)}%`;
                                }
                            })
                            .on('end', () => {
                                progressBar.style.width = '100%';
                                progressText.textContent = '处理完成，准备播放...';
                                resolve();
                            })
                            .on('error', (err) => {
                                console.error('视频裁剪失败:', err);
                                reject(err);
                            })
                            .run();
                    });
                    
                    // 读取处理后的视频文件
                    const outputBuffer = fs.readFileSync(tempOutputPath);
                    const blob = new Blob([outputBuffer], { type: 'video/mp4' });
                    const url = URL.createObjectURL(blob);
                    
                    // 更新预览视频
                    preview.src = url;
                    
                    // 确保视频加载完成后显示
                    preview.onloadeddata = () => {
                        // 移除加载指示器
                        document.body.removeChild(loadingIndicator);
                        
                        // 显示视频
                        preview.style.display = 'block';
                        placeholder.style.display = 'none';
                        
                        // 更新下载按钮的blob数据
                        downloadBtn.blob = blob;
                        
                        // 隐藏裁剪容器
                        timeTrimContainer.style.display = 'none';
                        
                        // 显示成功提示
                        showSuccessToast('视频时间裁剪成功');
                    };
                    
                    // 处理视频加载错误
                    preview.onerror = () => {
                        document.body.removeChild(loadingIndicator);
                        showErrorToast('视频裁剪失败: 无法加载处理后的视频');
                        console.error('视频加载失败:', preview.error);
                        
                        // 恢复原始视频
                        if (window.originalVideoBlob) {
                            preview.src = URL.createObjectURL(window.originalVideoBlob);
                        }
                    };
                    
                    // 清理临时文件
                    try {
                        fs.unlinkSync(tempInputPath);
                        fs.unlinkSync(tempOutputPath);
                    } catch (cleanupErr) {
                        console.warn('清理临时文件失败:', cleanupErr);
                    }
                    
                } catch (error) {
                    document.body.removeChild(loadingIndicator);
                    console.error('视频裁剪失败:', error);
                    showErrorToast('视频裁剪失败: ' + error.message);
                    
                    // 恢复原始视频
                    if (window.originalVideoBlob) {
                        preview.src = URL.createObjectURL(window.originalVideoBlob);
                    }
                    
                    // 尝试清理临时文件
                    try {
                        fs.unlinkSync(tempInputPath);
                        if (fs.existsSync(tempOutputPath)) {
                            fs.unlinkSync(tempOutputPath);
                        }
                    } catch (cleanupErr) {
                        console.warn('清理临时文件失败:', cleanupErr);
                    }
                }
            });
        };
        
        reader.onerror = (error) => {
            document.body.removeChild(loadingIndicator);
            console.error('读取文件失败:', error);
            showErrorToast('读取文件失败: ' + error.message);
        };
        
        reader.readAsArrayBuffer(window.originalVideoBlob);
    } else {
        document.body.removeChild(loadingIndicator);
        showErrorToast('找不到原始视频数据');
    }
}

// 显示时间裁剪界面
function showTimeTrimUI() {
    const preview = document.getElementById('preview');
    const timeTrimContainer = document.getElementById('timeTrimContainer');
    
    // 确保视频已加载且时长有效
    if (preview.readyState >= 1 && !isNaN(preview.duration) && isFinite(preview.duration)) {
        // 重置时间裁剪范围为整个视频
        startTrimTime = 0;
        endTrimTime = preview.duration;
        videoTotalDuration = preview.duration;
        
        // 显示时间裁剪容器
        timeTrimContainer.style.display = 'block';
        
        // 更新时间显示
        updateTimeDisplay();
        
        // 切换到时间裁剪模式
        switchTrimType('time');
    } else {
        // 如果视频未完全加载，等待加载完成
        const checkVideoLoaded = () => {
            if (preview.readyState >= 1 && !isNaN(preview.duration) && isFinite(preview.duration)) {
                startTrimTime = 0;
                endTrimTime = preview.duration;
                videoTotalDuration = preview.duration;
                
                timeTrimContainer.style.display = 'block';
                updateTimeDisplay();
                switchTrimType('time');
                
                preview.removeEventListener('loadeddata', checkVideoLoaded);
            }
        };
        preview.addEventListener('loadeddata', checkVideoLoaded);
    }
}

// 导出函数供外部调用
window.timeTrim = {
    init: initTimeTrim,
    show: showTimeTrimUI
};