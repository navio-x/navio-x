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
                <textarea v-model="address" id="hs-feedback-post-comment-textarea-1" rows="3"
                class="py-3 px-4 block w-full border-zinc-200 rounded-lg text-sm dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 border-zinc-700 dark:text-zinc-400 text-zinc-400"></textarea>
              </div>
            </div>
            <div>
              <label for="hs-feedback-post-comment-name-1" class="block mb-2 text-sm font-medium dark:text-white">Amount</label>
              <input v-model="amount" type="number" id="hs-feedback-post-comment-name-1"
              class="py-3 px-4 block w-full border-zinc-200 rounded-lg text-sm dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 border-zinc-700 dark:text-zinc-400 text-zinc-400">
            </div>
            <div class="mt-5">
              <button :disabled="!address || !amount" @click="submit"
              class="px-5 py-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            &nbsp;Send
          </button>
        </div>
      </div>
    </div>
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
