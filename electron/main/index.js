import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const https = require('https');
const decompress = require('decompress');
const os = require('os');

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
    //const rpcuser="x";
    //const rpcpassword="y";
    const network="testnet";
    var daemonBinaryStarted=false;
    var daemonPID=undefined;
    var stakerPID=undefined;
    async function createWindow() {
      win = new BrowserWindow({
        title: 'Main window',
        width:1100,
        height:760,
        backgroundColor: '#121212',
        transparent: false,
        frame: true,
        show: false,
        hasShadow: true,
        resizable: true,
    vibrancy: process.platform === 'darwin' ? 'ultra-dark' : undefined, // Sadece macOS için
    backgroundColor: '#00000000', // Şeffaflık
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

win.once('ready-to-show', () => {
  win.show();
});

  // Windows özel Acrylic efekt (bazı sürümlerde çalışır)
      if (process.platform === 'win32') {
        try {
      win.setVibrancy('acrylic'); // Electron >=20'de bazı sürümlerde destekli
    } catch (e) {
      console.log('Windows vibrancy not supported:', e.message);
    }
  }
  win.setMenu(null);
      //win.webContents.openDevTools();
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    //win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.on('close', e =>
  {
    console.log("on-close");
    console.log("is daemon binary started :" + daemonBinaryStarted);
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

ipcMain.handle('get-bin-dir', () => {
  return path.join(app.getPath('userData'), 'bin');
});

ipcMain.handle('remove-bin-dir', async () => {
  const fs = require('fs');
  const path = require('path');
  const { app } = require('electron');

  const binDir = path.join(app.getPath('userData'), 'bin');

  try {
    if (fs.existsSync(binDir)) {
      fs.rmSync(binDir, { recursive: true, force: true });
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('start-daemon', (_) => {
  startDaemon();
})

ipcMain.handle('start-staker', (_, network, wallet, rpcuser, rpcpassword) => {
  startStaker(network,wallet,rpcuser,rpcpassword);
})

ipcMain.handle('stop-staker', (_, pid) => {
  if (pid) stopStaker(pid);
})

ipcMain.handle('shell-open-item', (_, path) => {
  shell.showItemInFolder(`${path}`);
})

ipcMain.handle('shell-open-folder', async (_, folderPath) => {
  return await shell.openPath(folderPath);
});

ipcMain.handle('download-latest', async () => {
  const platform = os.platform(); // 'win32', 'darwin', 'linux'
  console.log("Platform:"+platform);

  let filename;
  if (platform === "win32") filename = "navio-latest-win64.zip";
  if (platform === "darwin") filename = "navio-latest-x86_64-apple-darwin.tar.gz";
  if (platform === "linux") filename = "navio-latest-x86_64-linux-gnu.tar.gz";
  
  const fileInfo = {
    filename: filename,
    platform: platform
  };

  win.webContents.send('download-file', fileInfo);

  if (!filename)
  {
    win.webContents.send('download-error', "No file suitable for the platform was found.");
    return;
  }

  const fullUrl = `https://releases.nav.io/${filename}`;
  const savePath = path.join(app.getPath('downloads'), path.basename(filename));

  try {
    // 1. Dosyayı indir
    await downloadFile(fullUrl, savePath, (progress) => {
      console.log("Progress:" + progress);
      win.webContents.send('download-progress', progress);
    });

    // 2. Klasörü oluştur
    const extractPath = path.join(app.getPath('userData'), 'bin');

    await fs.promises.mkdir(extractPath, { recursive: true });

    // 3. Arşivi aç
    await decompress(savePath, extractPath, {
      filter: file => file.path.includes('/bin/') || file.path.startsWith('bin/'),
      map: file => {
        const parts = file.path.split('/');
        const binIndex = parts.indexOf('bin');
        if (binIndex !== -1) {
          file.path = parts.slice(binIndex + 1).join('/');
        }
        return file;
      }
    });

    return extractPath;

  } catch (error) {
    let errorMessage = 'An error occurred.';

    if (error.code === 'ENOTFOUND') {
      errorMessage = 'Could not connect to url : ' + fullUrl;
    } else if (error.response && error.response.status === 404) {
      errorMessage = 'File not found (404) : ' +  fullUrl;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Download error:", errorMessage);
    win.webContents.send('download-error', errorMessage);
    return null;
  }
});


function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      if (response.statusCode === 404) {
        return reject({ response: { status: 404 } });
      }

      const total = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;

      response.pipe(file);

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (onProgress && total) {
          const percent = Math.round((downloaded / total) * 100);
          onProgress(percent);
        }
      });

      file.on('finish', () => {
        file.close(resolve);
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

/*const childWindow = new BrowserWindow({
  webPreferences: {
    preload,
    nodeIntegration: true,
    contextIsolation: false,
  },
})
childWindow.loadURL(`${arg}`);*/


function startDaemon()
{
  const filenames = {
    win32: 'naviod.exe',
    linux: 'naviod',
    darwin: 'naviod'
  };
  const binDir = path.join(app.getPath('userData'), 'bin');
  const binaryName = filenames[process.platform];
  if (!binaryName) {
    console.error('Unsupported platform:', process.platform);
    return;
  }
  const executablePath = path.join(binDir, binaryName);

  console.log('Starting daemon...');
  console.log("Platform : "+process.platform);
  console.log("Architecture : "+process.arch);
  console.log("App Path : "+app.getAppPath());
  console.log("Bin directory : " + binDir);
  console.log("Executable path : " + executablePath);
  fs.mkdirSync(binDir, { recursive: true });

  if (!fs.existsSync(executablePath))
  {
    console.error('Daemon binary not found:', executablePath);

    daemonBinaryStarted = false;

    win.webContents.send('is-daemon-started', {
      started: false,
      error: 'binary_not_found',
      path: executablePath,
      network,
      rpcuser,
      rpcpassword
    });
    return;
  }
  else
  {
    console.error('Daemon binary found:', executablePath);
  }

  const parameters = [
    `--${network}`,
    '--printtoconsole',
    '--walletcrosschain',
    '-rpcworkqueue=64',
    `-rpcuser=${rpcuser}`,
    `-rpcpassword=${rpcpassword}`,
    '-txindex=1',
    '-addnode=testnet-navio.nav.community',
    '-debug=1',
    '-debugexclude=libevent',
    '-debugexclude=http',
    '-debugexclude=rpc',
    '-debugexclude=leveldb',
    '-debugexclude=bench',
    '-debugexclude=net',
    '-debugexclude=addrman'
  ];
  console.log("Daemon Parameters : [" + parameters + "]");

  const spawnOptions = {
    cwd: binDir,
    env: process.env,
    shell: false,
    windowsVerbatimArguments: process.platform === 'win32'
  };

  const startProcess = () => {
    console.log('Executable:', executablePath);
    console.log('Params:', parameters.join(' '));

    const proc = spawn(executablePath, parameters, spawnOptions);

    proc.on('error', (err) => {
      daemonBinaryStarted = false;
      console.error('Daemon start failed:', err);
      win.webContents.send('is-daemon-started', { started: false, network, rpcuser, rpcpassword });
    });

    proc.on('exit', (code) => {
      daemonBinaryStarted = false;
      console.log('Daemon exited with code:', code);
      app.quit();
      process.exit(0);
    });

    proc.stdout.on('data', (data) => {
      const out = data.toString();
      console.log('*', out);

      if (out.includes('Starting HTTP server')) {
        daemonBinaryStarted = true;
        win.webContents.send('is-daemon-started', { started: true, network, rpcuser, rpcpassword });
      }
    });

    proc.stderr.on('data', (data) => {
      const err = data.toString();
      if (!err.startsWith('Warning')) {
        console.error('stderr:', err);
      }
    });
  };

  // macOS / Linux required chmod
  if (process.platform === 'linux' || process.platform === 'darwin') {
    execFile('chmod', ['+x', executablePath], (err) => {
      if (err) {
        console.error('chmod failed:', err);
        return;
      }
      startProcess();
    });
  } else {
    startProcess();
  }
}

function startDaemon_v1()
{
  console.log("Starting daemon...");
  let bShell=false;
  let binDir = path.join(app.getPath('userData'), 'bin');
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
  var parameters = ["--"+network+" --printtoconsole --walletcrosschain -rpcworkqueue=64 -rpcuser=" + rpcuser + " -rpcpassword=" + rpcpassword + " -txindex=1 -addnode=testnet-navio.nav.community -debug=1 -debugexclude=libevent -debugexclude=http -debugexclude=rpc -debugexclude=leveldb -debugexclude=bench -debugexclude=net -debugexclude=addrman"];
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
            if (code!=127)
            {
              console.log("Daemon stopped. Exit Code : "+code);
              app.quit()
              process.exit(0);
            }
            else
            {
              daemonBinaryStarted=false;
              console.log("Daemon binary not found.");
              win.webContents.send('is-daemon-started',{started:false, network: network,rpcuser:rpcuser,rpcpassword:rpcpassword });
            }
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

function stopStaker(pid)
{
  console.log("Stopping staker. PID : " + pid);
  process.kill(pid, 'SIGTERM');
}

function startStaker(network, wallet, rpcuser, rpcpassword)
{
  console.log("Starting staker...");
  console.log(`${network}`);
  console.log(`${wallet}`);
  console.log(`${rpcuser}`);
  console.log(`${rpcpassword}`);

  let binDir = path.join(app.getPath('userData'), 'bin');
  let bShell = (process.platform !== "win32");

  let filenames = {
    linux: "navio-staker",
    darwin: "navio-staker",
    win32: "navio-staker.exe"
  };

  let executablePath = path.join(binDir, filenames[process.platform]);

  var parameters = [
    "-" + network,
    "-wallet=" + wallet,
    "-rpcuser=" + rpcuser,
    "-rpcpassword=" + rpcpassword
  ];

  console.log("Binary Parameters : [" + parameters + "]");

  const defaults = {
    cwd: binDir,
    env: process.env,
    shell: bShell,
    windowsVerbatimArguments: true
  };

  console.log("Platform : " + process.platform);
  console.log("App Path : " + app.getAppPath());
  console.log("Architecture : " + process.arch);

  var newProcess;

  if (process.platform === "linux" || process.platform === "darwin")
  {
    console.log("Setting staker file as executable " + executablePath);

    execFile("chmod", ["+x", executablePath], defaults, function ()
    {
      newProcess = spawn(executablePath, parameters, defaults);

      newProcess.on('error', (err) => {
        console.log("Failed to start staker->" + executablePath + "->" + err.message);
      });

      if (newProcess.pid)
      {
        win.webContents.send('start-staker-success', newProcess.pid);
        console.log("Staker started. PID:" + newProcess.pid);

        newProcess.on('exit', (code) => {
          newProcess = null;
          win.webContents.send('stop-staker-success');
          console.log("Staker stopped. Exit Code : " + code);
        });

        newProcess.stdout.on('data', (data) => {
          console.log(data.toString());
        });

        newProcess.stderr.on('data', (stderr) => {
          console.log("stderr : " + stderr);
          if (!stderr.toString().startsWith("Warning"))
          {
            console.log("Staker start failed->" + stderr.toString());
          }
        });
      }
      else
      {
        console.log("Staker start failed.");
      }
    });
  }
  else
  {
    console.log(executablePath);

    newProcess = spawn(executablePath, parameters, defaults);

    newProcess.on('error', (err) => {
      console.log('Failed to start staker.' + err.message);
      console.log(err);
    });

    if (newProcess.pid)
    {
      win.webContents.send('start-staker-success', newProcess.pid);
      console.log("Staker started. PID:" + newProcess.pid);

      newProcess.on('exit', (code) => {
        newProcess = null;
        win.webContents.send('stop-staker-success');
        console.log("Staker stopped. Exit Code : " + code);
      });

      newProcess.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      newProcess.stderr.on('data', (stderr) => {
        console.log("stderr : " + stderr);
        if (!stderr.toString().startsWith("Warning"))
        {
          console.log("Staker start failed", stderr.toString());
        }
      });
    }
    else
    {
      console.log("Staker start failed.");
    }
  }
}
