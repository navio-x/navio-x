const PROXY = (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:7777') + '/rpc';

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
    return fetch(PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RPC-Host':   this.host,
        'X-RPC-Port':   String(this.port),
        'X-RPC-User':   this.username,
        'X-RPC-Pass':   this.password,
        ...(this.wallet ? { 'X-RPC-Wallet': this.wallet } : {}),
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id:      Date.now(),
        method:  method.toLowerCase(),
        params:  params ?? [],
      }),
    })
    .then(r => r.json())
    .then(data => {
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
