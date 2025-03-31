# Screen Recording Tool

English | [中文](./README.md)

A desktop screen recording application based on Electron, providing a simple and easy-to-use interface, supporting recording of selected windows, full screen, or custom areas.

## Features

- **Multiple Recording Modes**: Support for recording the entire screen, a single window, or a custom area
- **Custom Area Selection**: Precisely select the screen area to be recorded through drag and drop
- **Real-time Preview**: Immediately preview the recorded content after recording
- **Local Saving**: Save the recorded content as MP4 or WebM video files
- **Recording Timer**: Display the current recording duration
- **High DPI Support**: Adapt to high-resolution screens, solving coordinate inaccuracy issues on high DPI screens

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

1. **Launch the Application**: After running the application, you will see the main interface, including two buttons: "Select Area to Record" and "Download Recording".

2. **Start Recording**:
   - Click the "Select Area to Record" button
   - Select the window or screen to record in the popup window
   - You can also select "Custom Area" and choose a specific area through drag and drop
   - After confirming your selection, recording begins

3. **Stop Recording**:
   - During recording, the "Select Area to Record" button will turn red
   - Click the button again to stop recording
   - The recorded content will be displayed in the preview area

4. **Save the Recording**:
   - Click the "Download Recording" button
   - Select the save location and filename in the popup dialog
   - Choose the save format (MP4 or WebM)

## Technology Stack

- Electron: Cross-platform desktop application framework
- HTML/CSS/JavaScript: Frontend interface
- MediaRecorder API: Implement screen recording functionality
- Electron Remote: Inter-process communication