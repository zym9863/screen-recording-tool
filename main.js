const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { initialize, enable } = require('@electron/remote/main');
const electron = require('electron');

initialize();

let mainWindow;
let regionSelectWindow;

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

// 创建区域选择窗口
function createRegionSelectWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  regionSelectWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  enable(regionSelectWindow.webContents);
  regionSelectWindow.loadFile('region-select.html');
  
  // 区域选择窗口关闭时的处理
  regionSelectWindow.on('closed', () => {
    regionSelectWindow = null;
  });

  return regionSelectWindow;
}

// 监听IPC消息
ipcMain.on('start-region-select', () => {
  if (!regionSelectWindow) {
    createRegionSelectWindow();
  }
});

ipcMain.on('region-selected', (event, region) => {
  if (mainWindow) {
    mainWindow.webContents.send('region-data', region);
  }
  
  if (regionSelectWindow) {
    regionSelectWindow.close();
  }
});

ipcMain.on('cancel-region-select', () => {
  if (regionSelectWindow) {
    regionSelectWindow.close();
  }
});

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