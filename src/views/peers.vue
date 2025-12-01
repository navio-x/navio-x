<template>
  <div id="modal-add-node" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-700 border-zinc-700">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            Manage Nodes
        </h3>
        <button id="closeButton" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
        </button>
    </div>
    <!-- Modal body -->
    <div class="p-6 space-y-6">
      <p class="font-medium dark:text-white text-white">To connect with a peer, fill out the fields below.</p>
      <div>
        <label for="node_name" class="block mb-2 text-sm font-medium dark:text-white text-white">The address of the peer to connect to</label>
        <input type="text" autofocus id="node_name" v-model="node_name" class="bg-zinc-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <div>
        <div class="flex items-center mb-4">
            <input id="add-node-radio-1" type="radio" value="onetry" v-model="node_add_type" name="default-radio" class="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none">
            <label for="add-node-radio-1" class="select-none ms-2 text-sm font-medium text-heading dark:text-white text-white">Try a connection to the node once</label>
        </div>
        <div class="flex items-center mb-4">
            <input id="add-node-radio-2" type="radio" value="add" v-model="node_add_type" name="default-radio" class="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none">
            <label for="add-node-radio-2" class="select-none ms-2 text-sm font-medium text-heading dark:text-white text-white">Add node to the list</label>
        </div>
        <div class="flex items-center">
            <input id="add-node-radio-3" type="radio" value="remove" v-model="node_add_type" name="default-radio" class="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none">
            <label for="add-node-radio-3" class="select-none ms-2 text-sm font-medium text-heading dark:text-white text-white">Remove node from the list</label>
        </div>
    </div>

</div>
<!-- Modal footer -->
<div class="flex items-center p-6 space-x-2 border-t border-zinc-700 rounded-b dark:border-zinc-700">
  <button :disabled="node_name==''" type="button" id="confirmButton" data-modal-hide="modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-800">{{(node_add_type=="remove"?"Remove Node":"Add Node")}}</button>

</div>
</div>
</div>
</div>
<div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
    <div class="p-4">
        <h3>Peers</h3>
        <p>You are currently connected to {{peers.length}} peer(s).</p>
        <button id="button-add-node"  class="inline-flex justify-center items-center mt-5 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>

      &nbsp;Manage Nodes
  </button>
</div>
<div class="p-4 overflow-auto dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="peers.length>0">
        <table class="w-full text-sm text-left rtl:text-right dark:text-gray-400 text-gray-400">
            <thead class="text-xs uppercase bg-zinc-800 dark:bg-zinc-800 dark:text-gray-400 text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        ID
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Address
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Version
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Starting Height
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Synced Headers
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Synced Blocks
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="peer in peers" class="bg-zinc-800 border-b border-zinc-950 dark:bg-zinc-800 dark:border-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-900">
                    <td class="px-6 py-3">{{peer.id}}</td>
                    <td class="px-6 py-3">
                        <p>{{peer.addr}}</p>
                    </td>
                    <td class="px-6 py-3">{{peer.subver}}</td>
                    <td class="px-6 py-3">{{peer.startingheight}}</td>
                    <td class="px-6 py-3">{{peer.synced_headers}}</td>
                    <td class="px-6 py-3">{{peer.synced_blocks}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <p>No peer found.</p>
    </div>

</div>
</div>
</template>

<script>
  import Swal from 'sweetalert2';
  import '@sweetalert2/theme-dark/dark.scss';
  import {onActivated, onDeactivated} from "vue";
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
        peers:[],
        intervalId:undefined,
        node_name:'',
        node_add_type:"onetry"
    }
},
methods: {
    getpeerinfo:function()
    {
        let vm=this;
        this.client.command([{ method: "getpeerinfo"}]).then((r) =>
        {
            //console.log("getpeerinfo");
            if (r[0].name=="RpcError"||r[0].code)
            {
                console.log("RpcError");
                console.log(r);
            }
            else
            { 
                //console.log(r[0]);
                vm.peers=r[0];
            }
        });
    }
},
mounted() {
    let vm=this;
    this.getpeerinfo();
    this.intervalId = window.setInterval(function()
    {
        vm.getpeerinfo();
    }, 1000);
    let $buttonElement = document.querySelector('#button-add-node');
    let $modalElement = document.querySelector('#modal-add-node');
    let $confirmButton = document.querySelector('#confirmButton');
    let $closeButton = document.querySelector('#closeButton');
    let modalOptions = {
        backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
    }
    if ($modalElement)
    {
        let modal = new Modal($modalElement, modalOptions);
        $buttonElement.addEventListener('click', () => {
          modal.toggle();
      });
        $confirmButton.addEventListener('click', () => 
        {
            this.client.command([{ method: "addnode", parameters: [this.node_name,this.node_add_type] }]).then((r) => 
            {
              console.log(r);
              if (r[0]&&r[0].code)
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
                Toast.fire({
                  icon: 'success',
                  title: "Success",
              });
            }
        });
            console.log(this.node_name);
            modal.hide();
        });
        $closeButton.addEventListener('click', () => {
          modal.hide();
      });
    }
},
unmounted() {
    window.clearInterval(this.intervalId); 
}
}
</script>

