<template>
<div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
  <div v-if="$store.state.active_wallet">
    <div class="p-4">
      <h3>Send</h3>
    </div>
    <div class="w-full mx-auto">
      <div class="p-3 mx-auto">
        <div class="relative z-10 bg-white rounded-xl p-4 dark:bg-zinc-800 bg-zinc-800">
          <div class="mb-4 sm:mb-8">
            <label for="hs-feedback-post-comment-textarea-1" class="block mb-2 text-sm font-medium dark:text-white">Address (xNAV)</label>
            <div class="mt-1">
              <textarea v-model="address" id="hs-feedback-post-comment-textarea-1" name="hs-feedback-post-comment-textarea-1" rows="3" class="py-3 px-4 block w-full border-zinc-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 border-zinc-700 dark:text-zinc-400 text-zinc-400" placeholder=""></textarea>
            </div>
          </div>
          <div>
            <label for="hs-feedback-post-comment-name-1" class="block mb-2 text-sm font-medium dark:text-white">Amount</label>
            <input v-model="amount" type="number" id="hs-feedback-post-comment-name-1" class="py-3 px-4 block w-full border-zinc-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 border-zinc-700 dark:text-zinc-400 text-zinc-400" placeholder="">
          </div>
          <div class="mt-5">
            <button :disabled="!address||!amount" v-on:click="submit()" class="px-5 py-3 text-base py-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-zinc-600"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          &nbsp;Send</button>
        </div>
      </div>
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
  import Swal from 'sweetalert2';
  import '@sweetalert2/theme-dark/dark.scss';
  export default {
    data() {
      return {
        address:"",
        amount:""
      }
    },
    methods: {
      submit: function()
      {
        let vm=this;
        console.log(this.address);
        console.log(this.amount);
        this.client.command([{ method: "sendtoblsctaddress", parameters: [this.address,this.amount] }]).then((r) => 
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
           this.address="";
           this.amount="";
           Swal.fire({
            title: 'Success!',
            text: r[0],
            icon: 'success',
            confirmButtonText: 'OK'
          })
         }
       }).catch((r) =>
       {
         Swal.fire({
          title: 'Error!',
          text: r.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
       });
     }
   }
 }
</script>

