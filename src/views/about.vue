<template>
  <div class="h-full bg-zinc-900 text-white">
    <div class="h-full p-4 overflow-auto bg-zinc-900 text-center text-white">
      <img class="mx-auto" src="../assets/navio-x.png" style="width:128px;" alt="Navio-X Wallet"/>
      <h1 class="mt-10 text-2xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white">Navio X Wallet</h1>
      <p class="mt-5 max-w-lg mx-auto text-lg font-normal text-gray-500 dark:text-gray-400">
        Navio X Wallet is an open-source, cross-platform desktop wallet built to securely interact with the Navio blockchain.
      </p>
      <p class="mt-3 max-w-lg mx-auto text-md font-normal text-gray-500 dark:text-gray-400">
        The project is driven by Navio community developers and contributors. Join our Discord server to get support, share feedback, and follow development updates.
      </p>
      <div class="mt-10">
        <a target="_blank" href="https://navio-x.github.io/" type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 me-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        Visit Official Web Site
      </a>

      <a target="_blank" href="https://github.com/navio-x/navio-x" type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 me-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      Visit Github Repo
    </a>

    <a target="_blank" href="https://discord.gg/9ZfzyEGK" type="button"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 me-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
    Join Discord Server
  </a>
</div>

<div class="mt-8 max-w-xl mx-auto">
  <div class="rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-white">Runtime Versions</div>
      <div class="text-xs text-gray-400">Detected from Electron</div>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-lg bg-black/20 p-3 border border-white/5">
        <div class="text-gray-400">Electron</div>
        <div class="mt-1 font-mono text-white">{{ versions.electron || '-' }}</div>
      </div>

      <div class="rounded-lg bg-black/20 p-3 border border-white/5">
        <div class="text-gray-400">Node.js</div>
        <div class="mt-1 font-mono text-white">{{ versions.node || '-' }}</div>
      </div>

      <div class="rounded-lg bg-black/20 p-3 border border-white/5">
        <div class="text-gray-400">Chromium</div>
        <div class="mt-1 font-mono text-white">{{ versions.chrome || '-' }}</div>
      </div>

      <div class="rounded-lg bg-black/20 p-3 border border-white/5">
        <div class="text-gray-400">V8</div>
        <div class="mt-1 font-mono text-white">{{ versions.v8 || '-' }}</div>
      </div>
    </div>

    <div v-if="!versions.electron" class="mt-3 text-xs text-amber-300/90">
      Versions are not available (preload bridge not found).
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