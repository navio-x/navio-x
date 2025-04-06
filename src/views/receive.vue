<template>
  <div id="modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-800 border-zinc-800">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            QRCode
        </h3>
        <button v-on:click="hide()" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 hover:bg-gray-600 dark:hover:text-white hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
        </button>
    </div>
    <!-- Modal body -->
    <div class="p-6 space-y-6">
      <div>
        <center>
            <div id="canvas"></div>
            <div style="width:320px;height:auto;display:inline-block;overflow-wrap: break-word;">
                <label class="whitespace-pre-wrap text-sm text-gray-400 ms-2 dark:text-gray-400">{{qr_address}}</label>
            </div>
        </center>
    </div>
</div>
</div>
</div>
</div>
<div class="h-full bg-zinc-900 text-white">
    <div v-if="$store.state.active_wallet">
        <div class="w-full mb-5">
          <h3 class="p-4">Receive</h3>
          <button id="button" v-on:click="generate_new_address()" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
          </svg>
      &nbsp;Generate New Address</button>
        <!--<button id="button" v-on:click="generate_block(100)" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
      </svg>
  &nbsp;Generate 100</button>
          <button id="button" v-on:click="generate_block(1)" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
      </svg>
  &nbsp;Generate 1</button>!-->
</div>

<div class="p-4 overflow-auto bg-zinc-900 text-white">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="all_addresses&&Object.keys(all_addresses).length>0">
        <table class="w-full text-sm text-left rtl:text-right dark:text-gray-400 text-gray-400">
            <thead class="text-xs uppercase dark:bg-zinc-800 dark:text-gray-400 bg-zinc-800 text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Address
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Balance
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-on:click="set_active_address(address)" v-for="address in all_addresses" class="bg-zinc-800 border-b border-zinc-950 dark:bg-zinc-800 dark:border-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-900">
                    <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap dark:text-white text-white">
                        <input :ref="'lr_'+address.address" type="radio" name="hs-default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 bg-gray-800 dark:border-gray-700 border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" :id="'lr_'+address.address" v-bind:value="address.address" v-model="active_address">
                    </th>
                    <td class="px-6 py-4" style="width:320px;height:auto;display:inline-block;overflow-wrap: break-word;">
                              <span v-if="address.label" class="inline-flex justify-center items-center bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
    {{address.label}}</span>
                        <label class="whitespace-pre-wrap text-sm text-gray-400 ms-2 dark:text-gray-400">{{address.address}}</label>
                    </td>
                    <td class="px-6 py-4">
                        {{address.amount}} xNAV
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button id="button" v-on:click="docopy(address.address)" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                          </svg>
                      </button>
                      <button id="button" v-on:click="show(address.address)" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                      </svg>
                  </button>
              </td>
          </tr>
      </tbody>
  </table>
</div>
<div v-else>
    <p>No available address found.</p>
</div>
</div>
</div>
<div class="p-4" v-else>
  <p>No wallet loaded or selected.</p>
  <p>You can create, load and activate a wallet in Wallets page.</p>
  <router-link to="/wallets">
    <a href="" class="mt-5 inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>

    <span class="ms-3">Wallets</span>
</a>
</router-link>
</div>
</div>
</template>
<script>
    import QRCodeStyling from "qr-code-styling";
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
                all_addresses:undefined,
                active_address: undefined,
                qr_address:undefined,
                modal:undefined,
                prefix:'navcoin:'
            }
        },
        methods:{
            set_active_address:function(address)
            {
                this.active_address=address.address;
            },
            docopy:function(t)
            {
                this.$copyText(t);
                Toast.fire({
                  icon: 'success',
                  title: 'Copied',
              });
            },
            list_all_addresses:function()
            {
                let vm=this;
                this.client.command([{ method: "listreceivedbyaddress", parameters: [0,true] }]).then((r) =>
                {
                  if (r[0].name=="RpcError"||r[0].code)
                  {
                    console.log("RpcError");
                    console.log(r);
                }
                else
                { 
                    console.log(r[0]);
                    vm.all_addresses=r[0];
                }
            });
            },
            generate_new_address : function()
            {
                let vm=this;
                this.client.command([{ method: "getnewaddress", parameters: {"label":"","address_type":"blsct"} }]).then((r) => 
                {
                    console.log(r);
                    if (r[0].name=="RpcError"||r[0].code)
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
                     vm.list_all_addresses();
                     Swal.fire({
                        title: 'Success!',
                        text: "New address successfully generated.",
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                 }
             });
            },
            generate_block : function(n)
            {
                let vm=this;
                this.client.command([{ method: "generatetoblsctaddress", parameters: {"nblocks":n,"address":vm.active_address} }]).then((r) => 
                {
                    console.log(r);
                    if (r[0].name=="RpcError"||r[0].code)
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
                     vm.list_all_addresses();
                     Swal.fire({
                        title: 'Success!',
                        text: "New block successfully generated.",
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                 }
             });
            },
            show: function(address)
            {
             const qrCode = new QRCodeStyling({
                width: 300,
                height: 300,
                type: "svg",
                data: this.prefix+address,
                image: "https://raw.githubusercontent.com/anquii/navcoin-assets/main/xnav/xnav-logo-border.svg",
                dotsOptions: {
                    color: "#4267b2",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: "#e9ebee",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 20
                }
            });

             document.getElementById("canvas").innerHTML="";
             qrCode.append(document.getElementById("canvas"));

             this.qr_address=address;
             this.modal.show();
         },
         hide: function()
         {
            this.modal.hide();
        }
    },
    mounted() {
        this.list_all_addresses();
        initFlowbite();
        this.modal=new Modal(document.querySelector('#modal'),
        {
            backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
        });
    }
}
</script>

