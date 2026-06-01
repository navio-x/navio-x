<template>
  <div class="h-full bg-transparent text-white overflow-auto">
    <div class="w-full p-4 space-y-4 bg-transparent">

      <!-- Debug -->
      <div class="w-full p-5 glass-card rounded-xl">
        <h5 class="mb-1 text-base font-semibold text-white">Debug</h5>
        <p class="mb-3 text-sm text-white/60">View Navio logs.</p>
        <div v-if="rpcinfo && rpcinfo.logpath">
          <p class="text-xs text-white/50 mb-3 font-mono">{{ rpcinfo.logpath }}</p>
          <button v-on:click="open_log_file()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg glass-btn-secondary focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Open Log File
          </button>
        </div>
      </div>

      <!-- Navio Binaries -->
      <div class="w-full p-5 glass-card rounded-xl">
        <h5 class="mb-1 text-base font-semibold text-white">Navio Binaries</h5>
        <p class="mb-3 text-sm text-white/60">View the binary files required for Navio to run.</p>
        <div v-if="binDir">
          <p class="text-xs text-white/50 mb-3 font-mono">{{ binDir }}</p>
          <div class="flex items-center gap-2">
            <button v-on:click="open_bin_directory()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg glass-btn-secondary focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
              </svg>
              Open Folder
            </button>
            <button v-on:click="remove_bin_directory()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg bg-red-600/80 hover:bg-red-600 focus:outline-none transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Remove Binaries
            </button>
          </div>
        </div>
      </div>

      <!-- Network -->
      <div class="w-full p-5 glass-card rounded-xl">
        <h5 class="mb-1 text-base font-semibold text-white">Network</h5>
        <p class="mb-4 text-sm text-white/60">Switch between Mainnet and Testnet. The app will close and must be relaunched after changing.</p>
        <div class="flex gap-5 mb-4">
          <label v-for="net in networks" :key="net.name" class="flex items-center gap-3 cursor-pointer">
            <input type="radio" v-model="selectedNetwork" :value="net.name"
              class="w-4 h-4 text-violet-500 bg-gray-700 border-gray-600 focus:ring-violet-500 focus:ring-2">
            <div>
              <span class="text-sm font-medium text-white">{{ net.label }}</span>
              <span class="ml-2 text-xs text-zinc-400">(port {{ net.port }})</span>
              <span v-if="net.name === currentNetwork" class="ml-2 text-xs text-emerald-400 font-semibold">current</span>
            </div>
          </label>
        </div>
        <button :disabled="selectedNetwork === currentNetwork" v-on:click="switch_network()"
          class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none transition">
          Switch Network
        </button>
      </div>

      <!-- Clear Settings -->
      <div class="w-full p-5 glass-card rounded-xl">
        <h5 class="mb-1 text-base font-semibold text-white">Clear Settings</h5>
        <p class="mb-3 text-sm text-white/60">Reset all saved Navio X application preferences.</p>
        <button v-on:click="clear()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg glass-btn-secondary focus:outline-none">
          Clear
        </button>
      </div>

      <!-- Stop Daemon -->
      <div class="w-full p-5 glass-card rounded-xl">
        <h5 class="mb-1 text-base font-semibold text-white">Stop Navio Daemon</h5>
        <p class="mb-3 text-sm text-white/60">Stops the background daemon. Wallets will be unavailable until the daemon is restarted.</p>
        <button v-on:click="stop_daemon()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg bg-orange-600/80 hover:bg-orange-600 focus:outline-none transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
          </svg>
          Stop Daemon
        </button>
      </div>

    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import Swal from 'sweetalert2';
  import '@sweetalert2/theme-dark/dark.scss';
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })
  export default {
    data() {
      const networks = [
        { name: 'mainnet', label: 'Mainnet', port: 48471 },
        { name: 'testnet', label: 'Testnet', port: 33677 },
      ];
      const currentNetwork = localStorage.getItem('network') || 'mainnet';
      return {
        networks,
        currentNetwork,
        selectedNetwork: currentNetwork,
        rpcinfo:undefined,
        binDir:undefined
      }
    },
    methods: {
      switch_network:function()
      {
        const net = this.networks.find(n => n.name === this.selectedNetwork);
        if (!net) return;
        Swal.fire({
          theme:'dark',
          title: 'Switch Network?',
          text: `The application will switch to ${net.label}. The app will now close — please relaunch it manually for the changes to take effect.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2563eb',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Close App',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (!result.isConfirmed) return;
          localStorage.setItem('network', net.name);
          localStorage.setItem('port', net.port);
          localStorage.removeItem('auto_login');
          ipcRenderer.invoke('save-network', net.name);
          this.currentNetwork = net.name;
          this.$store.commit('set_network', net.name);
          this.client.command([{ method: "stop", parameters: [] }]);
        });
      },
      clear:function()
      {
        localStorage.clear();
        ipcRenderer.invoke('clear-setup-complete');
        Toast.fire({
          theme:'dark',
          icon: 'success',
          title: 'Settings cleared',
        });
      },
      stop_daemon:function()
      {
        this.client.command([{ method: "stop", parameters: [] }]).then((r) =>
        {
          Toast.fire({
            theme:'dark',
            icon: 'success',
            title: r,
          });
        });
      },
      open_log_file:function()
      {
        ipcRenderer.invoke('shell-open-item', this.rpcinfo.logpath);
      },
      open_bin_directory:function()
      {
        ipcRenderer.invoke('shell-open-folder', this.binDir);
      },
      remove_bin_directory() {
        Swal.fire({
          theme:'dark',
          title: 'Delete binary files?',
          text: 'This action will permanently remove all binary files required for Navio to run.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc2626',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, delete',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (!result.isConfirmed) return;
          ipcRenderer.invoke('remove-bin-dir').then((response) => {
            if (response && response.success) {
              Swal.fire({
                theme:'dark',
                title: 'Deleted',
                text: 'Binary files have been successfully removed.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
              this.binDir = '';
              return;
            }
            Swal.fire({
              theme:'dark',
              title: 'Error',
              text: response?.error || 'Failed to remove binary files.',
              icon: 'error'
            });
          }).catch((err) => {
            Swal.fire({
              theme:'dark',
              title: 'Error',
              text: err.message || 'An unexpected error occurred.',
              icon: 'error'
            });
          });
        });
      }
    },
    mounted()
    {
      let vm=this;
      ipcRenderer.invoke('get-bin-dir').then((binDir) => {
        if (binDir) this.binDir = binDir;
      });
      this.client.command([{ method: "getrpcinfo" }]).then((r) => {
        vm.rpcinfo = r[0];
      });
    }
  }
</script>
