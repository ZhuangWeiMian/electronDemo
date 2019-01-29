const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow () {
  // 创建窗口
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // 加载app的主页面地址
  mainWindow.loadFile('index.html')

  
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// 这个方法在eletron加载完成后调用，创建一个浏览器窗口
app.on('ready', createWindow)

// 所有浏览器窗口关闭的时候离开
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
