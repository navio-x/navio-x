import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
const crypto = require('crypto');
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
    const randomBytes=crypto.randomBytes(256);
    const rpcuser=crypto.createHash('sha256').update(randomBytes, 'utf8').digest('hex');
    const rpcpassword=crypto.createHash('md5').update(randomBytes, 'utf8').digest('hex');
    const network="testnet";
    var daemonBinaryStarted=false;
    async function createWindow() {
      win = new BrowserWindow({
        title: 'Main window',
        width:1100,
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
  }

  win.on('close', e =>
  {
    console.log("on-close");
    console.log("daemon binary started :" + daemonBinaryStarted);
    if (daemonBinaryStarted)
    {
      console.log("stop-daemon fired");
      e.preventDefault();
      win.webContents.send('stop-daemon',5);
    }
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () =>
  {
    startDaemon();
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

app.on('before-quit', (event) => {
  if (daemonBinaryStarted)
  {
    console.log("before-quit")
    event.preventDefault();
  }
})

app.on('will-quit', (event) => {
  if (daemonBinaryStarted)
  {
    console.log("will-quit")
    event.preventDefault();
  }
})

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

ipcMain.handle('start-staker', (_, network, wallet, rpcuser, rpcpassword) => {
  startStaker(network,wallet,rpcuser,rpcpassword);
  /*const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  childWindow.loadURL(`${arg}`);*/
})

ipcMain.handle('shell-open-item', (_, path) => {
  shell.showItemInFolder(`${path}`);
})

function startDaemon()
{
  let bShell=false;
  let binDir=__dirname;
  if (process.platform === 'win32') binDir+="\\";
  if (process.platform === 'darwin') binDir+="/";
  if (process.platform === 'linux') binDir+="/";
  binDir+="bin";
  let binaryPath="";
  let coin={
    "f_linux":"naviod",
    "f_osx":"naviod",
    "f_windows":"naviod.exe"
  };
  let binaryFileName="";
  let executablePath="";
  if (process.platform=="win32")
  {
    executablePath=binDir+"\\"+coin.f_windows;
    binaryFileName=coin.f_windows;
    bShell=false;
  }
  if (process.platform=="linux")
  {
    executablePath=binDir+"/./"+coin.f_linux;
    binaryFileName=coin.f_linux;
    bShell=true;
  }
  if (process.platform=="darwin")
  {
    executablePath=binDir+"/./"+coin.f_osx;
    binaryFileName=coin.f_osx;
    bShell=true;
  }
  const substr = 'Starting HTTP server';
  const defaults = {cwd:binDir,env:process.env,shell:bShell,windowsVerbatimArguments:true};
  var parameters = ["--"+network+" --printtoconsole --walletcrosschain -rpcuser=" + rpcuser + " -rpcpassword=" + rpcpassword + " -addnode=testnet-navio.nav.community -debugexclude=libevent"];
  console.log("Daemon Parameters : [" + parameters + "]");
  console.log("Platform : "+process.platform);
  console.log("Architecture : "+process.arch);
  console.log("App Path : "+app.getAppPath());
  var newProcess;
  if (process.platform=="linux" || process.platform=="darwin")
  {
    if (process.platform=="linux") binaryPath=binDir+"/"+coin.f_linux;
    if (process.platform=="darwin") binaryPath=binDir+"/"+coin.f_osx;
    console.log("Setting daemon file as executable " + binaryPath);
    var chmodProcess=execFile("chmod +x " + binaryPath, null, defaults, function(err, data)
    {
      newProcess=spawn(executablePath, parameters, defaults, function(err, data)
      {
        if (err)
        {
          daemonBinaryStarted=false;
          console.log(err);
          console.log("Failed to start daemon->"+executablePath+"->"+err.message);
        }
      });
      newProcess.on('error', (err) => {
        daemonBinaryStarted=false;
        console.log('Failed to start daemon->'+executablePath+"->"+err.message);
        win.webContents.send('is-daemon-started',{started:false, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
      });   
      if (newProcess.pid!=undefined)
      {
        daemonBinaryStarted=true;
        console.log("Daemon started. PID:" + newProcess.pid);
        newProcess.on('exit', (code) => {
          if (daemonBinaryStarted)
          {
            newProcess=null;
            console.log("Daemon stopped. Exit Code : "+code);
            app.quit()
            process.exit(0);
          }
        });
        newProcess.stdout.on('data', (data) =>
        {
          console.log("*" + data.toString());
          if (data.toString().includes(substr))
          {
            console.log("is-daemon-started fired");
            win.webContents.send('is-daemon-started',{started:true, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
          }
        });
        newProcess.stderr.on("data", function (stderr) {
          console.log("stderr : " + stderr);
          if (!stderr.toString().startsWith("Warning"))
          {
            console.log(stderr.toString());
          }    
        });
      }
      else
      {
        daemonBinaryStarted=false;
        win.webContents.send('is-daemon-started',{started:false, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
        console.log("Failed to start daemon.");
      }
    });
  }
  else
  {
    console.log(executablePath);
    newProcess=spawn(coin.f_windows, parameters, defaults, function(err, data)
    {
      if (err)
      {
        daemonBinaryStarted=false;
        win.webContents.send('is-daemon-started',{started:false, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
        console.log(err);
        console.log("Failed to start daemon->"+err.message);
      }
    });
    newProcess.on('error', (err) => {
      daemonBinaryStarted=false;
      win.webContents.send('is-daemon-started',{started:false, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
      console.log('Failed to start daemon->'+err.message);
      console.log(err);
    });
    if (newProcess.pid!=undefined)
    {
      daemonBinaryStarted=true;
      win.webContents.send('is-daemon-started',{started:true, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
      console.log("Daemon started. PID:" + newProcess.pid);
      newProcess.on('exit', (code) => {
        daemonBinaryStarted=false;
        newProcess=null;
        console.log("Daemon stopped. Exit Code : "+code);
        app.quit()
        process.exit(0)
      });
      newProcess.stdout.on('data', (data) =>
      {
        console.log("*" + data.toString());
        if (data.toString().includes(substr))
        {
          console.log("is-daemon-started fired");
          win.webContents.send('is-daemon-started',{started:true, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
        }        
      });
      newProcess.stderr.on("data", function (stderr) {
        console.log("stderr : " + stderr);
        if (!stderr.toString().startsWith("Warning"))
        {
          console.log(stderr.toString());
        }     
      });
    }
    else
    {
      daemonBinaryStarted=false;
      win.webContents.send('is-daemon-started',{started:false, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
      console.log("Failed to start daemon.");
    }
  }
}

function startStaker(network,wallet,rpcuser,rpcpassword)
{
  console.log("Starting staker...");
  console.log(`${network}`);
  console.log(`${wallet}`);
  console.log(`${rpcuser}`);
  console.log(`${rpcpassword}`);
  let bShell=false;
  let binDir=__dirname;
  if (process.platform === 'win32') binDir+="\\";
  if (process.platform === 'darwin') binDir+="/";
  if (process.platform === 'linux') binDir+="/";
  binDir+="bin";
  let binaryPath="";
  let coin={
    "f_linux":"navio-staker",
    "f_osx":"navio-staker",
    "f_windows":"navio-staker.exe"
  };
  let binaryFileName="";
  let executablePath="";
  if (process.platform=="win32")
  {
    executablePath=binDir+"\\"+coin.f_windows;
    binaryFileName=coin.f_windows;
    bShell=false;
  }
  if (process.platform=="linux")
  {
    executablePath=binDir+"/./"+coin.f_linux;
    binaryFileName=coin.f_linux;
    bShell=true;
  }
  if (process.platform=="darwin")
  {
    executablePath=binDir+"/./"+coin.f_osx;
    binaryFileName=coin.f_osx;
    bShell=true;
  }
  var parameters = ["-"+network+" -wallet="+wallet+" -rpcuser="+rpcuser+" -rpcpassword="+rpcpassword];
  console.log("Binary Parameters : [" + parameters + "]");
  const defaults = {cwd:binDir,env:process.env,shell:bShell,windowsVerbatimArguments:true};
  console.log("Platform : "+process.platform);
  console.log("App Path : "+app.getAppPath());
  console.log("Architecture : "+process.arch);
  var newProcess;
  if (process.platform=="linux" || process.platform=="darwin")
  {
    if (process.platform=="linux") binaryPath=binDir+"/"+coin.f_linux;
    if (process.platform=="darwin") binaryPath=binDir+"/"+coin.f_osx;
    console.log("Setting binary file as executable " + binaryPath);
    var buttons = ['OK', 'Cancel'];
    var chmodProcess=execFile("chmod +x " + binaryPath, null, defaults, function(err, data)
    {
      newProcess=spawn(executablePath, parameters, defaults, function(err, data)
      {
        if (err)
        {
          console.log(err);
          console.log("Binary start failed->"+executablePath+"->"+err.message);
        }
      });
      newProcess.on('error', (err) => {
        console.log('Failed to start binary->'+executablePath+"->"+err.message);
      });   
      if (newProcess.pid!=undefined)
      {
        win.webContents.send('start-staker-success',newProcess.pid);
        console.log("Binary started. PID:" + newProcess.pid);
        newProcess.on('exit', (code) => {
          newProcess=null;
          console.log("Binary stopped. Exit Code : "+code);
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
            console.log("Binary start failed->"+stderr.toString());
          }     
        });
      }
      else
      {
        console.log("Binary start failed.");
      }
    });
  }
  else
  {
    console.log(executablePath);
    newProcess=spawn(coin.f_windows, parameters, defaults, function(err, data)
    {
      if (err)
      {
        console.log(err);
        console.log("Binary start failed -> "+err.message);
      }
    });
    newProcess.on('error', (err) => {
      console.log('Failed to start Binary.'+err.message);
      console.log(err);
    });
    if (newProcess.pid!=undefined)
    {
      win.webContents.send('start-staker-success',newProcess.pid);
      console.log("Binary started. PID:" + newProcess.pid);
      newProcess.on('exit', (code) => {
        newProcess=null;
        console.log("Binary stopped. Exit Code : "+code);
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
          console.log("Binary start failed",stderr.toString());
        }     
      });
    }
    else
    {
      console.log("Binary start failed.");
    }
  }
}
