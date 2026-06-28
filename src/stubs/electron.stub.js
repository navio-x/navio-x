export const ipcRenderer = {
  invoke: () => Promise.resolve(null),

  on(channel, handler) {
    if (channel === 'is-daemon-started') {
      // Trigger init logic with started=false so the web app proceeds to setup
      setTimeout(() => handler(null, { started: false }), 0);
    }
  },

  removeListener:    () => {},
  removeAllListeners:() => {},
  send:              () => {},
};

export default { ipcRenderer };
