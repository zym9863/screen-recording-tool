const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initialize, enable } = require('@electron/remote/main');
const electron = require('electron');

initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: true,
      spellcheck: false,
      additionalArguments: ['--enable-features=SharedArrayBuffer']
    }
  });

  // 设置权限
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['media', 'clipboard-read', 'clipboard-write'];
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });

  // 启用剪贴板权限
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    return ['clipboard-read', 'clipboard-write'].includes(permission);
  });

  enable(mainWindow.webContents);
  mainWindow.loadFile('index.html');
}

// 自定义区域录制功能已移除

// 自定义区域录制功能相关的IPC监听已移除

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});