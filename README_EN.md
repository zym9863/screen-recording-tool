# Screen Recording Tool

English | [中文](./README.md)

A desktop screen recording application based on Electron, providing a simple and easy-to-use interface, supporting recording of windows or full screen.

## Features

- **Multiple Recording Modes**: Support for recording the entire screen or a single window
- **Video Cropping**: Support for cropping the recorded video area
- **Real-time Preview**: Immediately preview the recorded content after recording
- **Local Saving**: Save the recorded content as MP4 or WebM video files, optimized MP4 files can be played normally on most mobile devices
- **Recording Timer**: Display the current recording duration
- **High DPI Support**: Adapt to high-resolution screens, solving coordinate inaccuracy issues on high DPI screens
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
   - Select the video area you want to keep by dragging in the preview area
   - Click "Apply Crop" to confirm or "Cancel Crop" to discard changes

5. **Save the Recording**:
   - Click the "Download Recording" button
   - Select the save location and filename in the popup dialog
   - Choose the save format (MP4 or WebM)

## Technology Stack

- Electron: Cross-platform desktop application framework
- HTML/CSS/JavaScript: Frontend interface
- MediaRecorder API: Implement screen recording functionality
- Electron Remote: Inter-process communication