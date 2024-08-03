<template>
  <div id="modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-700 border-zinc-700">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            Create Wallet
          </h3>
          <button id="closeButton" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div>
            <label for="wallet_name" class="block mb-2 text-sm font-medium dark:text-white text-white">Wallet name</label>
            <input type="text" autofocus id="wallet_name" v-model="new_wallet_name" class="bg-zinc-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-zinc-700 rounded-b dark:border-zinc-700">
          <button :disabled="new_wallet_name==''" type="button" id="confirmButton" data-modal-hide="modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-800">Create</button>

        </div>
      </div>
    </div>
  </div>
  <div>


    <div class="h-screen w-full text-white bg-zinc-900">
      <div class="w-full mb-5">
        <h3 class="p-4">Wallets</h3>
        <button id="button" data-modal-toggle="modal" data-modal-target="modal" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>&nbsp;Create Wallet</button>
        </div>

        <div class="p-4 overflow-auto text-white">

<!--<div class="w-48 text-white dark:text-white" v-if="loaded_wallets&&Object.keys(loaded_wallets).length>0">
<p>Loaded wallet : {{Object.keys(loaded_wallets).length}}</p>
<button v-for="wallet in loaded_wallets" type="button" class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 bg-zinc-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
</svg>
&nbsp;{{wallet}}
</button>
</div>
<div v-else>
<p>No wallet loaded.</p>
</div>!-->

<p v-if="all_wallets&&Object.keys(all_wallets.wallets).length>0">Click on the wallet you want to load or unload</p>
<div class="w-48 mt-3 space-y-3 ftext-white dark:text-white" v-if="all_wallets&&Object.keys(all_wallets.wallets).length>0">
  <!--<p>All wallets : {{Object.keys(all_wallets.wallets).length}}</p>!-->
  <label class="w-full relative inline-flex items-center cursor-pointer" v-for="wallet in all_wallets.wallets">
    <input type="checkbox" id="wallet_name" value="" class="sr-only peer" v-model="wallet.checked" v-on:change="manage_wallet(wallet)">
    <div class="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 border-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    <span class="ms-3 text-sm font-medium dark:text-gray-300 text-gray-300">{{wallet.name}}</span>
  </label>

  <h3 class="mb-4 font-semibold dark:text-white text-white">Change Active Wallet : </h3>
  <div class="flex" v-for="wallet in all_wallets.wallets">
    <input type="radio" name="hs-default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-800 dark:bg-gray-800 dark:border-gray-700 border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" :id="'lr_'+wallet.name" v-bind:value="wallet.name" v-model="active_wallet" v-on:change="set_active_wallet(wallet)">
    <label :for="'lr_'+wallet.name" class="text-sm ms-2 dark:text-gray-400 text-gray-400">{{wallet.name}}</label>
  </div>


</div>
<div v-else class="dark:text-gray-400 text-gray-400">
  <p>No available wallet found.</p>
</div>

</div>
</div>
</div>

</template>

<script>
  import { initFlowbite } from 'flowbite';
  import Swal from 'sweetalert2';
  import '@sweetalert2/theme-dark/dark.scss';
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
    })
  export default {
    data() {
      return {
        loaded_wallets:undefined,
        new_wallet_name: undefined,
        all_wallets: undefined,
        active_wallet: undefined
      }
    },
    methods:{
      set_active_wallet:function(wallet)
      {
        this.active_wallet=wallet.name;
        this.client.wallet=wallet.name;
        this.$store.commit('set_active_wallet',wallet.name);
        console.log(this.client);
      },
      listwallets:function()
      {
        let vm=this;
        this.client.command('listwallets').then((r) =>
        {
          vm.loaded_wallets=r;
          console.log("All wallets");
          console.log(vm.all_wallets);
          console.log("Loaded wallets");
          console.log(vm.loaded_wallets);
          if (vm.loaded_wallets.length==0)
          {
            Toast.fire({
                icon: 'info',
                title: 'There is no active wallet!',
            });
            this.active_wallet=undefined;
            this.$store.commit('set_active_wallet',undefined);
          }
          vm.all_wallets.wallets.forEach((wallet) =>
          {
            console.log(wallet.name);
            console.log("is wallet loaded -> " + wallet.name + " : " + vm.loaded_wallets.includes(wallet.name));
            if (vm.loaded_wallets.includes(wallet.name)) wallet.checked=true;
          });
        });
      },
      listwalletdir:function()
      {
        let vm=this;
        this.client.command('listwalletdir').then((r) =>
        {
          vm.all_wallets=r;
          vm.listwallets();
        });
      },
      manage_wallet:function(wallet)
      {
        let vm=this;
        if (wallet.checked)
        {
          this.client.command([{ method: "loadwallet", parameters: [wallet.name] }]).then((r) => 
          {
            console.log("loading wallet -> " + wallet.name);
            console.log(r);
            vm.listwallets();
            if (!this.active_wallet)
            {
              vm.set_active_wallet(wallet);
            }
          });
        }
        else if (!wallet.checked)
        {
          let vm=this;
          if (this.$store.state.active_wallet==wallet.name && this.$store.state.active_wallet.is_staking_active)
          {
            console.log("Stopping staking process...");
            ipcRenderer.invoke('stop-staker', this.$store.state.staker_pid);
          }
          this.client.command([{ method: "unloadwallet", parameters: [wallet.name] }]).then((r) => 
          {
            console.log("unloading wallet -> " + wallet.name);
            console.log(r);
            vm.listwallets();
          });
        }
      },
      create_wallet:function()
      {
        let vm=this;
        console.log("Creating wallet :" + this.new_wallet_name);
        this.client.command([{ method: "createwallet", parameters: {"wallet_name":this.new_wallet_name,"blsct":true} }]).then((r) => 
        {
          vm.new_wallet_name="";
          console.log(r);
          if (r[0].name=="RpcError")
          {
            console.log("RpcError");
            Swal.fire({
              title: 'Error!',
              text: r[0].message,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
          else
          {
           vm.listwalletdir();
           Swal.fire({
            title: 'Success!',
            text: "Wallet '" + r[0].name + "' successfully created.",
            icon: 'success',
            confirmButtonText: 'OK'
          })
         }
       });
      }
    },
    mounted() {
      this.active_wallet=this.client.wallet;
      this.listwalletdir();
      initFlowbite();
      const $buttonElement = document.querySelector('#button');
      const $modalElement = document.querySelector('#modal');
      const $confirmButton = document.querySelector('#confirmButton');
      const $closeButton = document.querySelector('#closeButton');

      const modalOptions = {
        backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
      }

      if ($modalElement)
      {
        const modal = new Modal($modalElement, modalOptions);
        $buttonElement.addEventListener('click', () => {
          modal.toggle();
          document.getElementById("wallet_name").focus();
        });
        $confirmButton.addEventListener('click', () => 
        {
          modal.hide();
          if (this.new_wallet_name)
          {
            console.log("hide");
            console.log("creating wallet -> " + this.new_wallet_name);
            this.create_wallet();
          }
        });
        $closeButton.addEventListener('click', () => {
          modal.hide();
          this.new_wallet_name="";
        });
      }
    }
  }
</script>

