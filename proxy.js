#!/usr/bin/env node
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '7777', 10);
const DIST = path.join(__dirname, 'dist-web');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
};

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, X-RPC-Host, X-RPC-Port, X-RPC-User, X-RPC-Pass, X-RPC-Wallet');
}

function serveStatic(res, urlPath) {
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath)) filePath = path.join(DIST, 'index.html');
  const ext  = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', mime);
  res.writeHead(200);
  res.end(fs.readFileSync(filePath));
}

function proxyRPC(req, res) {
  const rpcHost   = req.headers['x-rpc-host']   || 'localhost';
  const rpcPort   = parseInt(req.headers['x-rpc-port'] || '48471', 10);
  const rpcUser   = req.headers['x-rpc-user']   || '';
  const rpcPass   = req.headers['x-rpc-pass']   || '';
  const rpcWallet = req.headers['x-rpc-wallet'] || '';
  const rpcPath   = rpcWallet ? `/wallet/${encodeURIComponent(rpcWallet)}` : '/';

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const auth = Buffer.from(`${rpcUser}:${rpcPass}`).toString('base64');
    const opts = {
      hostname: rpcHost,
      port:     rpcPort,
      path:     rpcPath,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Basic ${auth}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    let responded = false;

    const proxyReq = http.request(opts, proxyRes => {
      let data = '';
      proxyRes.on('data', chunk => { data += chunk; });
      proxyRes.on('end', () => {
        if (responded) return;
        responded = true;
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(proxyRes.statusCode);
        res.end(data);
      });
    });

    // A stuck naviod (busy rescan, full rpcworkqueue) would otherwise hold this
    // socket open indefinitely, so bound it and fail fast instead of hanging.
    proxyReq.setTimeout(20000, () => {
      proxyReq.destroy(new Error('naviod RPC request timed out'));
    });

    proxyReq.on('error', e => {
      if (responded) return;
      responded = true;
      res.writeHead(502);
      res.end(JSON.stringify({ error: { code: -1, message: e.message } }));
    });

    // If the browser gave up on us (e.g. its own fetch timeout aborted),
    // don't keep the upstream request occupying a naviod rpcworkqueue slot.
    res.on('close', () => {
      if (!responded) proxyReq.destroy();
    });

    proxyReq.write(body);
    proxyReq.end();
  });
}

const server = http.createServer((req, res) => {
  setCORS(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/rpc')) {
    proxyRPC(req, res);
    return;
  }

  serveStatic(res, req.url.split('?')[0]);
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n  Port ${PORT} already in use. Run: kill $(lsof -ti :${PORT})\n`);
    process.exit(1);
  } else {
    throw e;
  }
});

server.listen(PORT, () => {
  console.log(`\n  Navio-X Web`);
  console.log(`  Local: http://localhost:${PORT}\n`);
});
