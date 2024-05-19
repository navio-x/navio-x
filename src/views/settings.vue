<template>
  <div class="h-full bg-zinc-900 text-white">
    <div class="p-4">
      <h3>Settings</h3>
    </div>
    <div class="w-full p-4">

      <div class="w-full p-6 bg-zinc-800 border border-zinc-700 rounded-lg shadow dark:bg-zinc-800 dark:border-zinc-700">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">Clear Settings</h5>
        </a>
        <p class="mb-3 font-normal text-gray-400 dark:text-gray-400">Reset your RPC Connection information.</p>
        <button v-on:click="clear()" class="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Clear
        </button>
      </div>

      <div class="w-full p-6 bg-zinc-800 border border-zinc-700 rounded-lg shadow dark:bg-zinc-800 dark:border-zinc-700 mt-10">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">Stop Navio Daemon</h5>
        </a>
        <p class="mb-3 font-normal text-gray-400 dark:text-gray-400">The Navio daemon providing wallet services continues to run in the background. As a result of stopping this service, your Navio X wallets will be unavailable until the service is restarted.</p>
        <button v-on:click="stop_daemon()" class="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Stop Daemon
        </button>
      </div>

    </div>
  </div>
</template>
<script>
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
      return {
      }
    },
    methods: {
      clear:function()
      {
        localStorage.clear();
        Toast.fire({
          icon: 'success',
          title: 'Settings cleared',
        });
      },
      stop_daemon:function()
      {
        this.client.command([{ method: "stop", parameters: [] }]).then((r) =>
        {
          Toast.fire({
            icon: 'success',
            title: r,
          });
        });
      }
    },
    mounted() {
    }
  }
</script>