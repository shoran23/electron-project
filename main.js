const {app, BrowserWindow, Notification, ipcMain, TouchBarOtherItemsProxy} = require('electron')
const path = require('path')
const { withRouter } = require('react-router')
const isDev = !app.isPackaged

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            worldSageExecuteJavaScript: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    })
    win.setTitle(require('./package.json').name)
    win.loadFile('index.html')
    win.maximize()
    //isDev && win.webContents.openDevTools()
}

if(isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
}

app.whenReady().then(createWindow)

ipcMain.on('notify', (e, message) => {
    new Notification({title: 'Notification', body: message}).show()
})

app.on('window-all-closed', ()=> {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('page-title-update', function(e) {
    e.preventDefault()
})

app.on('activate', ()=> {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})