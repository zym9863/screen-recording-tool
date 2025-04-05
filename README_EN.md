# Screen Recording Tool

English | [中文](./README.md)

A desktop screen recording application based on Electron, providing a simple and easy-to-use interface, supporting recording of windows or full screen.

## Features

- **Multiple Recording Modes**: Support for recording the entire screen or a single window
- **Resolution Selection**: Offers multiple recording resolution options (e.g., original, 1080p, 720p) to balance clarity and performance
- **Video Cropping**: Support for cropping the recorded video area and trimming video timeline
- **Real-time Preview**: Immediately preview the recorded content after recording
- **Local Saving**: Save the recorded content as MP4 format, using `ffmpeg` for H.264 encoding and optimization to improve mobile device compatibility
- **Chunked Recording**: Uses a chunked recording mechanism to improve stability for long recordings, automatically merging chunks at the end
- **Recording Timer**: Display the current recording duration
- **Modern Interface**: Clean and beautiful UI design providing a smooth user experience

## Installation Steps

### Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm (v6.0.0 or higher recommended)

### Install Dependencies

```bash
# After cloning the repository, enter the project directory
npm install
```

### Run the Application

```bash
npm start
```

### Build the Application

```bash
npm run build
```

After building, you can find the installation package for your platform in the `dist` directory.

## User Guide

1. **Launch the Application**: After running the application, you will see the main interface, including three buttons: "Screen Recording", "Crop Video", and "Download Recording".

2. **Start Recording**:
   - Click the "Screen Recording" button
   - Select the window or screen to record in the popup window
   - After confirming your selection, recording begins
   - You can see the recording duration during the process

3. **Stop Recording**:
   - During recording, the "Screen Recording" button will turn red
   - Click the button again to stop recording
   - The recorded content will be displayed in the preview area

4. **Video Cropping**:
   - After recording, click the "Crop Video" button
   - Choose cropping method: "Area Crop" or "Time Trim"
   - Area Crop: Select the video area you want to keep by dragging in the preview area
   - Time Trim: Drag the start and end markers on the timeline to select the video segment you want to keep
   - Click "Apply Crop" to confirm or "Cancel Crop" to discard changes

5. **Save the Recording**:
   - Click the "Download Recording" button
   - Select the save location and filename in the popup dialog
   - Choose the save format (MP4 or WebM)

## Technology Stack

- Electron: Cross-platform desktop application framework
- HTML/CSS/JavaScript: Frontend interface
- MediaRecorder API: Implement screen recording functionality
- @electron/remote: Inter-process communication between main and renderer processes
- Node.js `fs`: File system operations
- `@ffmpeg-installer/ffmpeg` & `fluent-ffmpeg`: Used for video processing (cropping and encoding optimization)
