//const { Menu, app, BrowserWindow, ipcMain, dialog,  Tray } = require('electron')
var win;
function ventanaFaltas(){
   console.log('entra')


    //  const win = new BrowserWindow({
    //       width: 800,
    //       height: 600
    //     })
      
    //     win.loadFile('importaExcel.html')


    //window.open("importaExcel.html", "_blank", "top=500,left=200,frame=false,nodeIntegration=no");
  
  
   
    const { BrowserWindow } = require('electron')
    const win = new BrowserWindow({ })
    win.once('ready-to-show', () => {
      win.show()
    })
      

        // const win = new BrowserWindow({
        //   width: 800,
        //   height: 600,
        //   webPreferences: {
        //     nodeIntegration: true, 
        //     contextIsolation: false 
        //   }
        // })
      
        // win.loadFile('index.html')
      
    }