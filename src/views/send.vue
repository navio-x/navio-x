<template>
  <div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
<div v-if="$store.state.active_wallet"
     class="max-w-2xl mx-auto p-6">


  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h3 class="text-xl font-semibold text-white">Send</h3>
      <p class="text-xs text-zinc-400">
        Transfer funds to another wallet
      </p>
    </div>
  </div>

  <!-- Card -->
  <div
    class="relative bg-gradient-to-br from-zinc-900 to-zinc-800
    rounded-2xl p-5 border border-white/5">

    <!-- Address -->
    <div class="mb-6">
      <label class="block mb-2 text-sm font-medium text-white">
        Recipient Address (NAV)
      </label>

      <div class="relative">
        <span class="absolute left-3 top-3.5 text-zinc-500">
          🔗
        </span>

        <textarea
          v-model="address"
          rows="3"
          placeholder="Enter recipient address"
          class="pl-10 py-3 px-4 w-full rounded-xl text-sm
          bg-zinc-900 border border-zinc-700 text-zinc-300
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          resize-none"></textarea>
      </div>

      <p class="mt-1 text-xs text-zinc-500">
        Double-check the address. Transactions cannot be reversed.
      </p>
    </div>

    <!-- Amount -->
    <div class="mb-6">
      <label class="block mb-2 text-sm font-medium text-white">
        Amount
      </label>

      <div class="relative">
        <input
          v-model="amount"
          type="number"
          min="0"
          placeholder="0.00"
          class="py-4 px-4 pr-16 w-full rounded-xl
          text-lg font-semibold
          bg-zinc-900 border border-zinc-700 text-white
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

        <span class="absolute right-4 top-4 text-lg text-zinc-400">
          xNAV
        </span>
      </div>
    </div>

    <!-- Send Button -->
<button
  :disabled="!address || !amount"
  @click="submit"
  class="
    w-full py-4 rounded-xl
    text-md font-semibold text-white

    /* Primary */
    bg-blue-600

    /* Hover */
    hover:bg-blue-500
    hover:shadow-lg hover:shadow-blue-600/30
    hover:-translate-y-[1px]

    /* Active */
    active:bg-blue-700
    active:translate-y-0
    active:shadow-blue-600/10

    /* Focus */
    focus:outline-none
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    focus:ring-offset-zinc-900

    /* Disabled */
    disabled:opacity-40
    disabled:pointer-events-none
    disabled:shadow-none

    transition-all duration-200 ease-out
    flex items-center justify-center gap-2
  "
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke-width="1.5"
       stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12
             59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
  </svg>

  Send
</button>

  </div>
</div>


<div class="p-4" v-else>
  <p>No wallet loaded or selected.</p>
  <p>You can create, load and activate a wallet in Wallets page.</p>
  <router-link to="/wallets">
    <a class="mt-5 inline-flex items-center px-3 py-2 text-md font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
      stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round"
      d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
    <span class="ms-3">Wallets</span>
  </a>
</router-link>
</div>

<!-- Modal -->
<transition name="fade" appear>
  <div v-if="showModal" @keydown.esc="showModal = false" tabindex="0"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
  <div
  class="relative bg-zinc-800 text-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl transform transition-all duration-300 scale-95"
  :class="{ 'scale-100': showModal }">
  <!-- Close button -->
  <button @click="showModal = false"
  class="absolute top-2 right-2 text-white hover:text-zinc-400 focus:outline-none">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
  viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  d="M6 18L18 6M6 6l12 12" />
</svg>
</button>
<h2 class="text-xl font-semibold mb-4">Confirm Transaction</h2>
<p class="mb-2"><strong>Address:</strong></p>
<p class="mb-2 break-words text-sm text-zinc-300">{{ address }}</p>
<p class="mb-4"><strong>Amount:</strong> {{ amount }} NAV</p>
<div class="flex justify-end space-x-3 mt-6">
  <button @click="showModal = false"
  class="px-4 py-2 rounded-lg bg-zinc-600 hover:bg-zinc-700 transition duration-200">
  Cancel
</button>
<button @click="confirmTransaction" :disabled="isLoading"
class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 flex items-center justify-center min-w-[100px]">
<svg v-if="isLoading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
fill="none" viewBox="0 0 24 24">
<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
<path class="opacity-75" fill="currentColor"
d="M4 12a8 8 0 018-8v8z" />
</svg>
<span v-if="!isLoading">Confirm</span>
</button>
</div>
</div>
</div>
</transition>
</div>
</template>

<script>
  import Swal from 'sweetalert2';
  import '@sweetalert2/theme-dark/dark.scss';

  export default {
    data() {
      return {
        address: "",
        amount: "",
        showModal: false,
        isLoading: false
      };
    },
    mounted() {
      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
      handleKeydown(e) {
        if (e.key === 'Escape') this.showModal = false;
      },
      submit() {
        this.showModal = true;
      },
      confirmTransaction() {
        this.isLoading = true;
        this.client.command([{ method: "validateaddress", parameters: [this.address] }])
        .then((r) => {
          let result=r[0];
          if (result.isvalid && result.isblsct)
          {
            this.client.command([{ method: "sendtoblsctaddress", parameters: [this.address, this.amount] }])
            .then((r) => {
              this.isLoading = false;
              if (r[0].name === "RpcError" || r[0].code) {
                Swal.fire({
                  theme:'dark',
                  title: 'Error!',
                  text: r[0].message,
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              } else {
                this.address = "";
                this.amount = "";
                this.showModal = false;
                Swal.fire({
                  theme:'dark',
                  title: 'Success!',
                  text: r[0],
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
              }
            })
            .catch((err) => {
              this.isLoading = false;
              Swal.fire({
                theme:'dark',
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            });
          }
          else
          {
            this.isLoading = false;
            this.showModal = false;            
            Swal.fire({
              theme:'dark',
              title: 'Address Validation Error',
              text: "Invalid or non-BLSCT address. Double-check the address and try again.",
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          Swal.fire({
            theme:'dark',
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });

      }
    }
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    transform: scale(1);
  }
</style>
