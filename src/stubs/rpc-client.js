import { Capacitor, CapacitorHttp } from '@capacitor/core';

const PROXY = (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:7777') + '/rpc';

// Inside a native shell (Capacitor/Android), requests go through the native
// HTTP bridge instead of the WebView's fetch — that bypasses browser CORS
// entirely, so the naviod host doesn't need to sit behind proxy.js. Outside
// native (plain browser/desktop-web), fall back to the existing fetch+proxy
// relay, which is what makes CORS work there.
const isNative = Capacitor.isNativePlatform();

const RPC_TIMEOUT_MS = 15000;

class WebRPCClient {
  constructor({ host = 'localhost', port = 48471, username = '', password = '', wallet = null } = {}) {
    this.host     = host;
    this.port     = port;
    this.username = username;
    this.password = password;
    this.wallet   = wallet;
    this.methods  = {};
  }

  _call(method, params) {
    const body = {
      jsonrpc: '1.0',
      id:      Date.now(),
      method:  method.toLowerCase(),
      params:  params ?? [],
    };

    // Without a bound here, a stuck naviod (busy rescan, full rpcworkqueue)
    // leaves the request pending forever — the caller's promise never settles,
    // so polling loops pile up more requests on top instead of failing and retrying.
    let request;
    if (isNative) {
      request = CapacitorHttp.post({
        url: `http://${this.host}:${this.port}${this.wallet ? `/wallet/${encodeURIComponent(this.wallet)}` : '/'}`,
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Basic ${btoa(`${this.username}:${this.password}`)}`,
        },
        data: body,
        connectTimeout: RPC_TIMEOUT_MS,
        readTimeout: RPC_TIMEOUT_MS,
      }).then(response => response.data);
    } else {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);
      request = fetch(PROXY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RPC-Host':   this.host,
          'X-RPC-Port':   String(this.port),
          'X-RPC-User':   this.username,
          'X-RPC-Pass':   this.password,
          ...(this.wallet ? { 'X-RPC-Wallet': this.wallet } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }).then(r => r.json()).finally(() => clearTimeout(timer));
    }

    return request.then(data => {
      if (data.error) {
        const err = new Error(data.error.message);
        err.code = data.error.code;
        throw err;
      }
      return data.result;
    });
  }

  command(input) {
    if (typeof input === 'string') return this._call(input);
    // batch array → return array of results matching bitcoin-core behaviour
    return Promise.all(input.map(({ method, parameters }) => this._call(method, parameters)));
  }

  getBalances() {
    return this._call('getbalances');
  }
}

export default WebRPCClient;
