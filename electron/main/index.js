import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
? join(process.env.DIST_ELECTRON, '../public/')
: process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName())

    if (!app.requestSingleInstanceLock()) {
      app.quit()
      process.exit(0)
    }

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

    let win=null;
// Here, you can also use other preload
    const preload = join(__dirname, '../preload/index.js')
    const url = process.env.VITE_DEV_SERVER_URL
    const indexHtml = join(process.env.DIST, 'index.html')

    async function createWindow() {
      win = new BrowserWindow({
        title: 'Main window',
        width:1024,
        height:700,
        icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
          preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
          nodeIntegration: true,
          contextIsolation: false,
        },
      })

  win.setMenu(null);
      //win.webContents.openDevTools();
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
    startProcess();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
      win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

function startProcess()
{
  let bShell=false;
  let binDir=__dirname;
  if (process.platform === 'win32') binDir+="\\";
  if (process.platform === 'darwin') binDir+="/";
  if (process.platform === 'linux') binDir+="/";
  binDir+="bin";
  let daemonPath="";
  let rpcuser="x";
  let coin={
    "daemon_file_linux":"naviod",
    "daemon_file_osx":"naviod",
    "daemon_file_windows":"naviod.exe"
  };
  let daemonBinaryFileName="";
  let executablePath="";
  if (process.platform=="win32")
  {
    executablePath=binDir+"\\"+coin.daemon_file_windows;
    daemonBinaryFileName=coin.daemon_file_windows;
    bShell=false;
  }
  if (process.platform=="linux")
  {
    executablePath=binDir+"/./"+coin.daemon_file_linux;
    daemonBinaryFileName=coin.daemon_file_linux;
    bShell=true;
  }
  if (process.platform=="darwin")
  {
    executablePath=binDir+"/./"+coin.daemon_file_osx;
    daemonBinaryFileName=coin.daemon_file_osx;
    bShell=true;
  }
  let rpcpassword="y";
  var parameters = ["--testnet --printtoconsole --walletcrosschain -rpcuser=" + rpcuser + " -rpcpassword=" + rpcpassword + " -addnode=testnet-navio.nav.community -debug=net"];
  console.log("Daemon Parameters : [" + parameters + "]");
  const defaults = {cwd:binDir,env:process.env,shell:bShell,windowsVerbatimArguments:true};
  console.log("Platform : "+process.platform);
  console.log("App Path : "+app.getAppPath());
  console.log("Architecture : "+process.arch);
  var newProcess;
  if (process.platform=="linux" || process.platform=="darwin")
  {
    if (process.platform=="linux") daemonPath=binDir+"/"+coin.daemon_file_linux;
    if (process.platform=="darwin") daemonPath=binDir+"/"+coin.daemon_file_osx;
    console.log("Setting daemon file as executable " + daemonPath);
    var buttons = ['OK', 'Cancel'];
    var chmodProcess=execFile("chmod +x " + daemonPath, null, defaults, function(err, data)
    {
      newProcess=spawn(executablePath, parameters, defaults, function(err, data)
      {
        if (err)
        {
          console.log(err);
          alert("Daemon start failed->"+executablePath+"->"+err.message);
        }
      });
      newProcess.on('error', (err) => {
        console.log('Failed to start daemon->'+executablePath+"->"+err.message);
        alert('Failed to start daemon->'+executablePath+"->"+err.message);
      });   
      if (newProcess.pid!=undefined)
      {
        console.log("Daemon started. PID:" + newProcess.pid);
        if (!win) createMainWindow();
        newProcess.on('exit', (code) => {
          newProcess=null;
          console.log("Daemon stopped. Exit Code : "+code);
          app.quit()
          process.exit(0)          
        });
        newProcess.stdout.on('data', (data) =>
        {
          console.log(data.toString());
        });
        newProcess.stderr.on("data", function (stderr) {
          console.log("stderr : " + stderr);
          if (!stderr.toString().startsWith("Warning"))
          {
            alert("Daemon start failed->"+stderr.toString());
          }     
        });
      }
      else
      {
        console.log("Daemon start failed.");
      }
    });
  }
  else
  {
    console.log(executablePath);
    newProcess=spawn(coin.daemon_file_windows, parameters, defaults, function(err, data)
    {
      if (err)
      {
        console.log(err);
        alert("Daemon start failed -> "+err.message);
      }
    });
    newProcess.on('error', (err) => {
      console.log('Failed to start daemon.'+err.message);
      alert(err);
    });
    if (newProcess.pid!=undefined)
    {
      console.log("Daemon started. PID:" + newProcess.pid);
      if (!win) createMainWindow();
      newProcess.on('exit', (code) => {
        newProcess=null;
        console.log("Daemon stopped. Exit Code : "+code);
        app.quit()
        process.exit(0)
      });
      newProcess.stdout.on('data', (data) =>
      {
        console.log(data.toString());
      });
      newProcess.stderr.on("data", function (stderr) {
        console.log("stderr : " + stderr);
        if (!stderr.toString().startsWith("Warning"))
        {
          alert("Daemon start failed",stderr.toString());
        }     
      });
    }
    else
    {
      console.log("Daemon start failed.");
    }
  }
}
