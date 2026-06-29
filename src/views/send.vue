<template>
  <div class="h-full bg-transparent text-white overflow-auto">

    <div v-if="$store.state.active_wallet" class="max-w-lg mx-auto px-6 py-8">

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-1">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white">Send NAV</h3>
        </div>
        <p class="text-xs text-white/70 ml-12">Transfer funds to another wallet</p>
      </div>

      <!-- Card -->
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.16] p-6"
        style="background: linear-gradient(160deg, rgba(34,26,68,0.8) 0%, rgba(22,28,58,0.8) 100%); backdrop-filter: blur(16px);">

        <!-- subtle glow -->
        <div class="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl"></div>

        <!-- Address -->
        <div class="mb-5">
          <label class="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            Recipient Address
          </label>
          <textarea
            v-model="address"
            rows="4"
            placeholder="Enter NAV recipient address..."
            class="w-full rounded-xl text-sm font-mono resize-none px-4 py-3 leading-relaxed glass-input"></textarea>
          <p class="mt-1.5 text-xs text-white/55 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            Double-check the address — transactions cannot be reversed.
          </p>
        </div>

        <!-- Divider -->
        <div class="border-t border-white/[0.16] my-5"></div>

        <!-- Amount -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70">
              Amount
            </label>
            <button v-if="balance && balance.mine.trusted > 0" type="button"
              @click="amount = balance.mine.trusted"
              class="text-xs text-violet-400 hover:text-violet-300 transition-colors focus:outline-none">
              Use All ({{ balance.mine.trusted }} NAV)
            </button>
          </div>
          <div class="relative">
            <input
              v-model="amount"
              type="number"
              min="0"
              placeholder="0.00"
              class="w-full rounded-xl text-2xl font-bold px-4 py-4 pr-20 glass-input">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/60 tracking-wider">NAV</span>
          </div>
        </div>

        <!-- Send Button -->
        <button
          :disabled="!address || !amount"
          @click="submit"
          class="w-full py-3.5 rounded-xl text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600 to-violet-600
            hover:from-blue-500 hover:to-violet-500
            hover:shadow-lg hover:shadow-blue-600/25
            hover:-translate-y-[1px]
            active:translate-y-0
            disabled:opacity-30 disabled:pointer-events-none
            transition-all duration-200 ease-out
            flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
          </svg>
          Send
        </button>
      </div>
    </div>

    <NoWalletSelected v-else />

    <!-- Wallet Unlock Modal -->
    <WalletUnlock
      v-if="showUnlockModal"
      @unlocked="showUnlockModal = false; doSend()"
      @cancel="showUnlockModal = false"
    />

    <!-- Modal -->
    <transition name="fade" appear>
      <div v-if="showModal" @keydown.esc="showModal = false" tabindex="0"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="relative text-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/[0.18] transition-all duration-300"
          :class="{ 'scale-100': showModal, 'scale-95': !showModal }"
          style="background: linear-gradient(160deg, rgba(40,30,78,0.98) 0%, rgba(24,30,62,0.98) 100%); backdrop-filter: blur(24px);">

          <!-- glow -->
          <div class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-600/15 rounded-full blur-3xl"></div>

          <!-- Close -->
          <button @click="showModal = false" class="absolute top-3 right-3 text-white/70 hover:text-white/95 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 class="text-lg font-semibold mb-5">Confirm Transaction</h2>

          <div class="space-y-3 mb-6">
            <div class="rounded-xl p-3 border border-white/[0.16]" style="background: rgba(255,255,255,0.10)">
              <p class="text-xs text-white/70 mb-1 uppercase tracking-widest">Recipient</p>
              <p class="text-sm font-mono break-all text-white/95">{{ address }}</p>
            </div>
            <div class="rounded-xl p-3 border border-blue-500/20" style="background: rgba(37,99,235,0.08)">
              <p class="text-xs text-blue-400/60 mb-1 uppercase tracking-widest">Amount</p>
              <p class="text-2xl font-bold text-white">{{ amount }} <span class="text-base text-white/95">NAV</span></p>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="showModal = false"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm glass-btn-secondary transition duration-200">
              Cancel
            </button>
            <button @click="confirmTransaction" :disabled="isLoading"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
              <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
  import NoWalletSelected from '../components/NoWalletSelected.vue';
  import WalletUnlock from '../components/WalletUnlock.vue';

  export default {
    components: { NoWalletSelected, WalletUnlock },
    data() {
      return {
        address: "",
        amount: "",
        showModal: false,
        isLoading: false,
        showUnlockModal: false,
        balance: null
      };
    },
    mounted() {
      window.addEventListener('keydown', this.handleKeydown);
      this.fetchBalance();
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
      handleKeydown(e) {
        if (e.key === 'Escape') this.showModal = false;
      },
      fetchBalance() {
        this.client.getBalances().then(r => { this.balance = r; }).catch(() => {});
      },
      submit() {
        this.showModal = true;
      },
      confirmTransaction() {
        this.isLoading = true;
        this.client.command([{ method: "getwalletinfo" }])
          .then((r) => {
            const info = r[0];
            if (info && 'unlocked_until' in info && info.unlocked_until === 0) {
              this.isLoading = false;
              this.showModal = false;
              this.showUnlockModal = true;
            } else {
              this.doSend();
            }
          })
          .catch(() => {
            this.doSend();
          });
      },
      doSend() {
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
