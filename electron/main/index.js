import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
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
    var daemonStderrLines=[];
    var daemonStopExpected=false;
    var daemonLogDir=null;

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
        height: 740,
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
      daemonStopExpected = true;
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
  daemonStopExpected = true;
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

ipcMain.handle('update-startup-wallets', (_, { logpath, walletName, action }) => {
  try {
    const dir = path.dirname(logpath);
    const settingsPath = path.join(dir, 'settings.json');
    let settings = { wallet: [] };
    if (fs.existsSync(settingsPath)) {
      try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch (e) {}
    }
    if (!Array.isArray(settings.wallet)) settings.wallet = [];
    if (action === 'add') {
      if (!settings.wallet.includes(walletName)) settings.wallet.push(walletName);
    } else if (action === 'remove') {
      settings.wallet = settings.wallet.filter(w => w !== walletName);
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4), 'utf8');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-process-variables', async (_, folderPath) => {
  return {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    v8: process.versions.v8
  }
});

const GITHUB_RELEASES_API = 'https://api.github.com/repos/nav-io/navio-core/releases';

function archTokens(platform, arch) {
  if (platform === 'win32') return ['win64', 'x86_64-w64'];
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

function matchesGitHubAsset(name, platform, arch) {
  if (!/^navio-/.test(name)) return false;
  if (/\.(asc|sig|sha256|sha256sum|txt)$/i.test(name)) return false;
  if (platform === 'win32' && !/\.zip$/i.test(name)) return false;
  if (platform !== 'win32' && !/\.tar\.gz$/i.test(name)) return false;
  const tokens = archTokens(platform, arch);
  if (!tokens.length) return false;
  return tokens.some(t => name.toLowerCase().includes(t.toLowerCase()));
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'M';
  if (bytes >= 1024) return Math.round(bytes / 1024) + 'K';
  return bytes + 'B';
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'navio-x' }
    };
    https.get(url, opts, (res) => {
      if (res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => { data += c; });
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

// Extracts a comparable [major, minor, patch, rc] tuple from a release tag, e.g.
// "v0.1rc36" -> [0, 1, 0, 36], "v0.1-rc31" -> [0, 1, 0, 31]. Final releases (no "rcN"
// suffix) get rc=Infinity so they outrank any rc of the same major.minor.patch.
// Returns null for tags with no parseable version (e.g. "nightly") - those never
// win the "latest" comparison since asset upload timestamps can be unreliable
// (re-uploads, mislabeled tags, etc. can make an older build look freshly uploaded).
function parseVersionRank(tag) {
  if (!tag) return null;
  const m = tag.match(/(\d+)\.(\d+)(?:\.(\d+))?(?:[-]?rc(\d+))?/i);
  if (!m) return null;
  return [
    parseInt(m[1], 10),
    parseInt(m[2], 10),
    m[3] ? parseInt(m[3], 10) : 0,
    m[4] ? parseInt(m[4], 10) : Infinity
  ];
}

function compareVersionRank(a, b) {
  for (let i = 0; i < 4; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

async function listGitHubReleases(platform, arch) {
  const releases = await fetchJSON(`${GITHUB_RELEASES_API}?per_page=20`);
  const result = [];
  for (const release of releases) {
    const assets = (release.assets || []).filter(a => matchesGitHubAsset(a.name, platform, arch));
    if (!assets.length) continue;
    // Rolling tags (e.g. "nightly") accumulate every historical build as a separate asset.
    // Only surface the most recently uploaded asset per release/tag.
    const asset = assets.reduce((newest, a) =>
      new Date(a.created_at) > new Date(newest.created_at) ? a : newest
    );
    result.push({
      name: asset.name,
      tag: release.tag_name,
      date: asset.created_at,
      dateRaw: asset.created_at || '',
      size: formatSize(asset.size),
      url: asset.browser_download_url,
      tagUrl: release.html_url,
      notes: release.body || '',
      versionRank: parseVersionRank(release.tag_name)
    });
  }
  result.sort((a, b) => new Date(b.date) - new Date(a.date));

  let latest = null;
  for (const entry of result) {
    if (!entry.versionRank) continue;
    if (!latest || compareVersionRank(entry.versionRank, latest.versionRank) > 0) latest = entry;
  }
  for (const entry of result) {
    entry.latest = entry === latest;
    delete entry.versionRank;
  }

  return result;
}

function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    function doGet(currentUrl) {
      const mod = currentUrl.startsWith('https:') ? https : http;
      mod.get(currentUrl, (response) => {
        const status = response.statusCode;
        if (status === 301 || status === 302 || status === 307 || status === 308) {
          response.resume();
          const location = response.headers.location;
          if (!location) return reject(new Error('Redirect with no Location header'));
          doGet(location);
          return;
        }
        if (status && status >= 400) {
          response.resume();
          reject({ response: { status }, message: `HTTP ${status}` });
          return;
        }
        const file = fs.createWriteStream(dest);
        const total = parseInt(response.headers['content-length'], 10);
        let downloaded = 0;
        response.pipe(file);
        response.on('data', (chunk) => {
          downloaded += chunk.length;
          if (onProgress && total) {
            onProgress(Math.round((downloaded / total) * 100));
          }
        });
        file.on('finish', () => file.close(resolve));
        file.on('error', (err) => {
          try { fs.unlinkSync(dest); } catch (e) {}
          reject(err);
        });
      }).on('error', reject);
    }
    doGet(url);
  });
}

async function downloadAndExtract(url, filename) {
  const fileInfo = { filename, platform: os.platform(), arch: os.arch() };
  win.webContents.send('download-file', fileInfo);

  const savePath = path.join(app.getPath('downloads'), filename);

  await downloadFile(url, savePath, (progress) => {
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

  try {
    const options = await listGitHubReleases(platform, arch);
    if (options.length > 0) {
      win.webContents.send('download-select-binary', { platform, arch, options });
    } else {
      win.webContents.send('download-error', 'No compatible binaries found in GitHub releases for this platform.');
    }
  } catch (error) {
    const errorMessage = formatDownloadError(error, GITHUB_RELEASES_API);
    console.error("GitHub releases fetch error:", errorMessage);
    win.webContents.send('download-error', errorMessage);
  }
  return null;
});

ipcMain.handle('download-binary', async (_, payload) => {
  if (!payload || typeof payload !== 'object' || !payload.url || !payload.name) {
    win.webContents.send('download-error', 'Invalid download request.');
    return null;
  }
  const { url, name } = payload;
  try {
    return await downloadAndExtract(url, name);
  } catch (error) {
    const errorMessage = formatDownloadError(error, url);
    console.error("Download error:", errorMessage);
    win.webContents.send('download-error', errorMessage);
    return null;
  }
});

ipcMain.handle('list-binaries', async () => {
  const platform = os.platform();
  const arch = os.arch();
  try {
    const options = await listGitHubReleases(platform, arch);
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

  const addnode = network === 'testnet' ? 'testnet-navio.nav.community' : 'blocks.nav.io';

  const parameters = [
    ...(network !== 'mainnet' ? [`--${network}`] : []),
    '--printtoconsole',
    '--walletcrosschain',
    '-rpcworkqueue=64',
    `-rpcuser=${rpcuser}`,
    `-rpcpassword=${rpcpassword}`,
    '-txindex=1',
    `-addnode=${addnode}`,
    '-debug=1'
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
      if (code !== 0 && code !== null && !daemonStopExpected) {
        const stderrText = daemonStderrLines.slice(-80).join('').trim();
        const detail = `Exit code: ${code}` + (stderrText ? `\n\nLast output:\n${stderrText.slice(-3000)}` : '');
        const binDir = path.join(app.getPath('userData'), 'bin');
        const logDir = daemonLogDir || app.getPath('userData');
        win?.hide();
        let clicked;
        do {
          clicked = dialog.showMessageBoxSync({
            type: 'error',
            title: 'Navio Daemon Crashed',
            message: 'The Navio daemon exited unexpectedly.',
            detail,
            buttons: ['Open Binary Folder', 'Open Log Folder', 'Close Navio X'],
            defaultId: 2,
            cancelId: 2,
          });
          if (clicked === 0) shell.openPath(binDir);
          if (clicked === 1) shell.openPath(logDir);
        } while (clicked !== 2);
      }
      app.quit();
      process.exit(code ?? 0);
    });

    proc.stdout.on('data', (data) => {
      const out = data.toString();
      console.log('*', out);

      const walletDirMatch = out.match(/Using wallet directory (.+)/);
      if (walletDirMatch) daemonLogDir = walletDirMatch[1].trim();

      if (out.includes('Starting HTTP server')) {
        daemonBinaryStarted = true;
        win.webContents.send('is-daemon-started', { started: true, network, rpcuser, rpcpassword });
      }
    });

    proc.stderr.on('data', (data) => {
      const err = data.toString();
      daemonStderrLines.push(err);
      if (daemonStderrLines.length > 200) daemonStderrLines.shift();
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
