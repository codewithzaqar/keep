'use strict'
const app = require('electron').app
const shell = require('electron').shell
const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu
const objectAssign = require('object-assign')
const pkg = require('./package.json')


let mainWindow

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow()
    }
})

app.on('ready', () => {
    mainWindow = createMainWindow()
    createMenu()
})

function createMainWindow() {
    const opts = {
        height: 786,
        width: 1024,
        minWidth: 615,
        icon: `${__dirname}/assets/icon.png`,
        preload: `${__dirname}/browser.js`,
        title: 'Keep',
        titleBarStyle: 'hidden-inset'
    }

    const mainWindow = new BrowserWindow(opts)
    mainWindow.loadURL('https://keep.google.com')
    mainWindow.on('closed', handleClosed)
    return mainWindow
}

function handleClosed() {
    mainWindow = null
}

function createMenu() {
    const template = [
      {
        label: 'Keep',
        submenu: [
          { label: 'Services', role: 'services', submenu: [] },
          { type: 'separator' },
          { label: 'Hide Keep', accelerator: 'Command+H', role: 'hide' },
          { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideothers' },
          { label: 'Show All', role: 'unhide' },
          { type: 'separator' },
          { label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
          { type: 'separator' },
          {
            label: 'Cut',
            accelerator: 'Cmd+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Cmd+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Cmd+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Cmd+A',
            selector: 'selectAll:'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (item, win) => {
              if (win) win.reload();
            }
          },
          {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click: (item, win) => {
              if (win) win.setFullScreen(!win.isFullScreen());
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+Command+I',
            click: (item, win) => {
              if (win) win.webContents.toggleDevTools();
            }
          },
        ]
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
          { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
          { type: 'separator' },
          {
            label: 'Notes',
            accelerator: 'CmdOrCtrl+1',
            click: (item, win) => {
              win.webContents.send('navigate', '')
            },
            type: 'radio',
            checked: true
          },
          {
            label: 'Reminders',
            accelerator: 'CmdOrCtrl+2',
            click: (item, win) => {
              win.webContents.send('navigate', 'reminders')
            },
            type: 'radio'
          },
          {
            label: 'Archive',
            accelerator: 'CmdOrCtrl+3',
            click: (item, win) => {
              win.webContents.send('navigate', 'archive');
            },
            type: 'radio'
          },
          {
            label: 'Trash',
            accelerator: 'CmdOrCtrl+4',
            click: (item, win) => {
              win.webContents.send('navigate', 'trash');
            },
            type: 'radio'
          }
        ]
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'View on GitHub',
            click: () => {
              shell.openExternal('http://github.com/codewithzaqar/keep');
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}