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
    console.log({
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      v8: process.versions.v8
    });
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
    var daemonBinaryStarted=false;
    var daemonProcess=null;
    var daemonPID=undefined;
    var stakerPID=undefined;

function getNetwork() {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.network) return config.network;
    }
  } catch (e) {}
  return 'mainnet';
}

function getSetupComplete() {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return !!config.setupComplete;
    }
  } catch (e) {}
  return false;
}

function setSetupComplete(value) {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    let config = {};
    try {
      if (fs.existsSync(configPath)) config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {}
    config.setupComplete = value;
    fs.writeFileSync(configPath, JSON.stringify(config), 'utf8');
  } catch (e) {}
}
    async function createWindow() {
      win = new BrowserWindow({
        title: 'Navio X',
        width: 1100,
        height: 790,
        center: true,
        backgroundColor: '#0d071c',
        transparent: false,
        frame: false,
        show: true,
        hasShadow: true,
        resizable: true,
        vibrancy: process.platform === 'darwin' ? 'ultra-dark' : undefined,
        icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
          preload,
          nodeIntegration: true,
          contextIsolation: false,
        },
      })

      win.on('maximize',   () => win?.webContents.send('window-maximized'));
      win.on('unmaximize', () => win?.webContents.send('window-unmaximized'));

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

  win.webContents.on('did-finish-load', () =>
  {
    if (getSetupComplete()) {
      startDaemon();
    } else {
      win.webContents.send('is-daemon-started', {
        started: false,
        network: getNetwork(),
        rpcuser,
        rpcpassword
      });
    }
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

ipcMain.handle('window-minimize',      () => win?.minimize());
ipcMain.handle('window-maximize',      () => { win?.isMaximized() ? win.unmaximize() : win?.maximize(); });
ipcMain.handle('window-close',         () => win?.close());
ipcMain.handle('window-is-maximized',  () => win?.isMaximized() ?? false);

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

ipcMain.handle('set-setup-complete', () => setSetupComplete(true));
ipcMain.handle('clear-setup-complete', () => setSetupComplete(false));

ipcMain.handle('check-binary-exists', () => {
  const filenames = { win32: 'naviod.exe', linux: 'naviod', darwin: 'naviod' };
  const binDir = path.join(app.getPath('userData'), 'bin');
  const binaryName = filenames[process.platform];
  if (!binaryName) return false;
  return fs.existsSync(path.join(binDir, binaryName));
});

ipcMain.handle('save-network', (_, networkName) => {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    let config = {};
    try {
      if (fs.existsSync(configPath)) config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {}
    config.network = networkName;
    fs.writeFileSync(configPath, JSON.stringify(config), 'utf8');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('start-staker', (_, network, wallet, rpcuser, rpcpassword) => {
  startStaker(network,wallet,rpcuser,rpcpassword);
})

ipcMain.handle('stop-staker', (_, pid) => {
  if (pid) stopStaker(pid);
})

ipcMain.handle('force-quit', () => {
  if (daemonProcess) {
    try { daemonProcess.kill(); } catch (e) { console.error('force-quit kill error:', e); }
    daemonProcess = null;
  }
  daemonBinaryStarted = false;
  app.quit();
  process.exit(0);
})

ipcMain.handle('shell-open-item', (_, path) => {
  shell.showItemInFolder(`${path}`);
})

ipcMain.handle('shell-open-folder', async (_, folderPath) => {
  return await shell.openPath(folderPath);
});

ipcMain.handle('get-process-variables', async (_, folderPath) => {
  return {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      v8: process.versions.v8
    }
});

const RELEASES_BASE_URL = 'https://releases.nav.io/';

function getLatestFilename(platform) {
  if (platform === 'win32') return 'navio-latest-win64.zip';
  if (platform === 'darwin') return 'navio-latest-x86_64-apple-darwin.tar.gz';
  if (platform === 'linux') return 'navio-latest-x86_64-linux-gnu.tar.gz';
  return null;
}

function archTokens(platform, arch) {
  if (platform === 'win32') return ['win64'];
  if (platform === 'darwin') {
    if (arch === 'arm64') return ['arm64-apple-darwin'];
    if (arch === 'x64') return ['x86_64-apple-darwin'];
    return ['x86_64-apple-darwin'];
  }
  if (platform === 'linux') {
    if (arch === 'x64') return ['x86_64-linux-gnu'];
    if (arch === 'arm64') return ['aarch64-linux-gnu'];
    if (arch === 'arm') return ['arm-linux-gnueabihf'];
    if (arch === 'ppc64') {
      return os.endianness() === 'LE'
        ? ['powerpc64le-linux-gnu']
        : ['powerpc64-linux-gnu'];
    }
    if (arch === 'riscv64') return ['riscv64-linux-gnu'];
  }
  return [];
}

function matchesPlatform(filename, platform, arch) {
  if (!/^navio-/.test(filename)) return false;
  if (/\.(asc|sig)$/i.test(filename)) return false;
  const tokens = archTokens(platform, arch);
  if (!tokens.length) return false;
  if (platform === 'win32') {
    return tokens.some(t => filename.toLowerCase().endsWith(`-${t}.zip`));
  }
  return tokens.some(t => filename.toLowerCase().endsWith(`-${t}.tar.gz`));
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
      let data = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseListingDate(s) {
  if (!s) return null;
  const m = s.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!m) return null;
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const mi = months[m[2]];
  if (mi === undefined) return null;
  const d = new Date(Date.UTC(+m[3], mi, +m[1], +m[4], +m[5]));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

async function listAvailableBinaries(platform, arch) {
  const html = await fetchText(RELEASES_BASE_URL);
  const seen = new Map();
  const regex = /href="([^"?][^"]*)"[^<]*<\/a>(?:\s+(\d{2}-[A-Za-z]{3}-\d{4}\s+\d{2}:\d{2}))?(?:\s+([\d.]+[KMG]?|\-))?/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const name = decodeURIComponent(m[1].split('/').pop());
    if (!matchesPlatform(name, platform, arch)) continue;
    if (seen.has(name)) continue;
    seen.set(name, {
      name,
      date: parseListingDate(m[2]),
      dateRaw: m[2] || '',
      size: m[3] || ''
    });
  }
  return Array.from(seen.values()).sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    return b.name.localeCompare(a.name);
  });
}

function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        const status = response.statusCode;
        file.close(() => {
          try { fs.unlinkSync(dest); } catch (e) {}
          reject({ response: { status }, message: `HTTP ${status}` });
        });
        return;
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

async function downloadAndExtract(filename) {
  const fileInfo = { filename, platform: os.platform() };
  win.webContents.send('download-file', fileInfo);

  const fullUrl = `${RELEASES_BASE_URL}${filename}`;
  const savePath = path.join(app.getPath('downloads'), path.basename(filename));

  await downloadFile(fullUrl, savePath, (progress) => {
    console.log("Progress:" + progress);
    win.webContents.send('download-progress', progress);
  });

  const extractPath = path.join(app.getPath('userData'), 'bin');
  await fs.promises.mkdir(extractPath, { recursive: true });

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
}

function formatDownloadError(error, url) {
  if (error && error.code === 'ENOTFOUND') return 'Could not connect to url : ' + url;
  if (error && error.response && error.response.status === 404) return 'File not found (404) : ' + url;
  if (error && error.response && error.response.status === 403) return 'Access forbidden (403) : ' + url;
  if (error && error.code === 'ECONNREFUSED') return 'Connection refused.';
  if (error && error.message) return error.message;
  return 'An error occurred.';
}

ipcMain.handle('download-latest', async () => {
  const platform = os.platform();
  const arch = os.arch();
  console.log("Platform:" + platform + " Arch:" + arch);

  const filename = getLatestFilename(platform);

  if (!filename) {
    win.webContents.send('download-error', "No file suitable for the platform was found.");
    return null;
  }

  const fullUrl = `${RELEASES_BASE_URL}${filename}`;

  try {
    return await downloadAndExtract(filename);
  } catch (error) {
    const status = error && error.response && error.response.status;
    const missing = status === 404 || status === 403;
    if (missing) {
      console.log(`Latest binary unavailable (HTTP ${status}), listing alternatives...`);
      try {
        const options = await listAvailableBinaries(platform, arch);
        if (options.length > 0) {
          win.webContents.send('download-select-binary', { platform, arch, options });
          return null;
        }
        win.webContents.send('download-error', 'No compatible binaries found on ' + RELEASES_BASE_URL);
        return null;
      } catch (listErr) {
        console.error('Listing failed:', listErr);
        win.webContents.send('download-error', 'Latest binary not available and listing alternatives failed: ' + listErr.message);
        return null;
      }
    }

    const errorMessage = formatDownloadError(error, fullUrl);
    console.error("Download error:", errorMessage);
    win.webContents.send('download-error', errorMessage);
    return null;
  }
});

ipcMain.handle('download-binary', async (_, filename) => {
  if (!filename || typeof filename !== 'string') {
    win.webContents.send('download-error', 'Invalid filename.');
    return null;
  }
  const fullUrl = `${RELEASES_BASE_URL}${filename}`;
  try {
    return await downloadAndExtract(filename);
  } catch (error) {
    const errorMessage = formatDownloadError(error, fullUrl);
    console.error("Download error:", errorMessage);
    win.webContents.send('download-error', errorMessage);
    return null;
  }
});

ipcMain.handle('list-binaries', async () => {
  const platform = os.platform();
  const arch = os.arch();
  try {
    const options = await listAvailableBinaries(platform, arch);
    return { success: true, platform, arch, options };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

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
  const network = getNetwork();
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

  const addnode = network === 'testnet' ? 'testnet-navio.nav.community' : 'mainnet-navio.nav.community';

  const parameters = [
    ...(network !== 'mainnet' ? [`--${network}`] : []),
    '--printtoconsole',
    '--walletcrosschain',
    '-rpcworkqueue=64',
    `-rpcuser=${rpcuser}`,
    `-rpcpassword=${rpcpassword}`,
    '-txindex=1',
    `-addnode=${addnode}`,
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
    daemonProcess = proc;

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
