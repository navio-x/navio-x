<template>
  <div class="h-full flex items-center justify-center bg-transparent text-white">
    <div class="w-full max-w-xl px-6 py-8 text-center">

      <img class="mx-auto" src="../assets/navio-x.png" style="width:108px;" alt="Navio-X Wallet"/>
      <h1 class="mt-8 text-2xl font-extrabold tracking-tight text-white">Navio X Wallet</h1>
      <p class="mt-4 text-sm font-normal text-white/50 leading-relaxed">
        Navio X Wallet is an open-source, cross-platform desktop wallet built to securely interact with the Navio blockchain.
      </p>
      <p class="mt-2 text-sm font-normal text-white/40 leading-relaxed">
        The project is driven by Navio community developers and contributors. Join our Discord server to get support, share feedback, and follow development updates.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a target="_blank" href="https://navio-x.github.io/" class="about-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Official Website
        </a>
        <a target="_blank" href="https://github.com/navio-x/navio-x" class="about-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          GitHub Repo
        </a>
        <a target="_blank" href="https://discord.gg/9P52VBSt44" class="about-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Join Discord
        </a>
      </div>

      <div class="mt-8">
        <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left">
          <div class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Runtime</div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-lg bg-black/20 p-3 border border-white/5">
              <div class="text-white/40 text-xs">Electron</div>
              <div class="mt-1 font-mono text-white/80">{{ versions.electron || '-' }}</div>
            </div>
            <div class="rounded-lg bg-black/20 p-3 border border-white/5">
              <div class="text-white/40 text-xs">Node.js</div>
              <div class="mt-1 font-mono text-white/80">{{ versions.node || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';

  export default {
    name: 'RuntimeVersions',

    data() {
      return {
        versions: {
          electron: '',
          node: '',
          chrome: '',
          v8: '',
        },
      };
    },

    mounted() {
      ipcRenderer
      .invoke('get-process-variables')
      .then((response) => {
        if (response)
        {
          this.versions.electron  = response.electron || '';
          this.versions.node      = response.node || '';
          this.versions.chrome  = response.chrome || '';
          this.versions.v8        = response.v8 || '';
        }
      })
      .catch((err) => {
        console.error('Failed to get process variables:', err);
      });
    },
  };
</script>

<style scoped>
.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.about-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
  color: #fff;
}
</style>