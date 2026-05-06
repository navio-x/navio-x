<template>
  <div class="h-full bg-transparent text-white">
    <div class="p-4">
      <h3>Settings</h3>
    </div>
    <div class="w-full p-4 bg-transparent">
      <div class="w-full p-6 glass-card rounded-xl">
        <h5 class="mb-2 text-2xl font-bold text-white dark:text-white">Debug</h5>
        <p class="mb-3 font-normal text-gray-400 dark:text-gray-400">View Navio logs.</p>
        <div v-if="rpcinfo.logpath">
          <p>Log Path : {{rpcinfo.logpath}}</p>
          <button v-on:click="open_log_file()" class="mt-5 inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Open Log File
          </button>
        </div>
      </div>

      <div class="w-full p-6 glass-card rounded-xl mt-10">
        <h5 class="mb-2 text-2xl font-bold text-white dark:text-white">Navio Binaries</h5>
        <p class="mb-3 font-normal text-gray-400 dark:text-gray-400">You can view the binary files required for Navio to run.</p>
        <div v-if="binDir">
          <p>Binary Path : {{binDir}}</p>
          <div class="mt-5 flex items-center gap-3">
            <button
            v-on:click="open_bin_directory()"
            class="inline-flex items-center px-3 py-2 text-md font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
            Open Folder
          </button>

          <button
          v-on:click="remove_bin_directory()"
          class="inline-flex items-center px-3 py-2 text-md font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
          Remove Binaries
        </button>
      </div>

    </div>
  </div>

  <div class="w-full p-6 glass-card rounded-xl mt-10">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">Network</h5>
    <p class="mb-4 font-normal text-gray-400 dark:text-gray-400">Switch between Mainnet and Testnet. The application will need to reconnect after changing the network.</p>
    <div class="flex gap-5 mb-5">
      <label v-for="net in networks" :key="net.name" class="flex items-center gap-3 cursor-pointer group">
        <input
          type="radio"
          v-model="selectedNetwork"
          :value="net.name"
          class="w-4 h-4 text-violet-500 bg-gray-700 border-gray-600 focus:ring-violet-500 focus:ring-2"
        >
        <div>
          <span class="text-sm font-medium text-white">{{ net.label }}</span>
          <span class="ml-2 text-xs text-zinc-400">(port {{ net.port }})</span>
          <span v-if="net.name === currentNetwork" class="ml-2 text-xs text-emerald-400 font-semibold">current</span>
        </div>
      </label>
    </div>
    <button
      :disabled="selectedNetwork === currentNetwork"
      v-on:click="switch_network()"
      class="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Switch Network
    </button>
  </div>

  <div class="w-full p-6 glass-card rounded-xl mt-10">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">Clear Settings</h5>
    <p class="mb-3 font-normal text-gray-400 dark:text-gray-400">This option allows you to reset all saved Navio X application preferences.</p>
    <button v-on:click="clear()" class="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Clear
    </button>
  </div>

  <div class="w-full p-6 glass-card rounded-xl mt-10">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">Stop Navio Daemon</h5>
    <p class="mb-3 font-normal text-gray-400 dark:text-gray-400">The Navio daemon, which provides wallet services, continues to run in the background. If this service is stopped, your Navio X wallets will be unavailable until the daemon is restarted.</p>
    <button v-on:click="stop_daemon()" class="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
        console.log("Opening log file '"+this.rpcinfo.logpath+"' ...");
        ipcRenderer.invoke('shell-open-item', this.rpcinfo.logpath);
      },
      open_bin_directory:function()
      {
        console.log("Opening bin directory '"+this.binDir+"' ...");
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
        if (binDir)
        {
          this.binDir=binDir;
          return;
        }
      });
      console.log("Getting rpc info");
      this.client.command([{ method: "getrpcinfo" }]).then((r) => 
      {
        console.log(r[0]);
        vm.rpcinfo=r[0];
      });
    }
  }
</script>