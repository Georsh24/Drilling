const { Menu, app, BrowserWindow, ipcMain, dialog, shell, Tray } = require('electron')
const mydb = require("./database")
const menu = require('./menu')

require('electron-reload')(__dirname);
let tray = null
var win;
function createWindow() {
    win = new BrowserWindow({ width: 1400, height: 1000, webPreferences: { nodeIntegration: true, contextIsolation: false }, icon: "sne.png" })
    win.loadFile("index.html")
    var appIcon = new Tray('sne.png')
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: function async() {
                win.show()
                win.reload()
            },
        },
        {
            label: 'Quit', click: function () {
                // app.isQuiting = true.
                app.quit()
            }
        }
    ])

    appIcon.setContextMenu(contextMenu)
    win.on('close', () => {
        win = null
    })
    win.on('minimize', () => {
        //     preventDefault(),
        setTimeout(() => {
            win.hide()
        }, 2000);

    })

    win.on('show', () => {
        //appIcon.setHighlightMode('always')
    })
}
app.whenReady().then(createWindow, mydb)
Menu.setApplicationMenu(menu)


app.on('ready', () => {
    const fs = require('fs');
    const dir2 = 'C:\\Datos';
    const dir3 = './db';
    setTimeout(() => {
        mydb.create_db()
    }, 1000);
    //   mydb.create_db()
    while (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2);
    }
    while (!fs.existsSync(dir3)) {
        fs.mkdirSync(dir3);
    }

    ipcMain.on('item-send-empleado', (event, data) => {
        mydb.item_all_empleados()
    })
    ipcMain.on('qnasTodas', (event, data) => {
        mydb.allQnas()
    })
    ipcMain.on('open-ventanaFaltas', (event, data) => {
console.log('entra ipc')
  winFaltas = new BrowserWindow({ width: 1400, height: 1000, webPreferences: { nodeIntegration: true, contextIsolation: false }, icon: "sne.png" })
    winFaltas.loadFile("importarExcel.html")
    //var appIcon = new Tray('sne.png')
    })
})


