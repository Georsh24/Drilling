const { app, ipcMain, Menu, shell, BrowserWindow, globalShortcut } = require('electron')
const mydb = require("./database")


const template = [
    {
        label: 'Vista',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'close' }
        ]
     },
    //,
    // {
    //     role: 'help',
    //     click: async () => {
    //         const { shell } = require('electron')
    //         //await shell.open('./help.html')
    //         await shell.openPath('help.html')
        
    //     }
    // },
    {
        label: ' Debug',
        submenu: [
            {
                role: 'toggledevtools'
            },
        ]
    }
]


const menu = Menu.buildFromTemplate(template);
module.exports = menu