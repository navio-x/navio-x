<template>
  <div class="h-full bg-transparent text-white overflow-auto">

    <div v-if="$store.state.active_wallet" class="max-w-lg mx-auto px-6 py-8">

      <!-- Header -->
      <div class="mb-5">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white">Send NAV</h3>
        </div>
      </div>

      <!-- Card -->
      <div class="relative overflow-hidden rounded-2xl border border-white/[0.16] p-5"
        style="background: linear-gradient(160deg, rgba(34,26,68,0.8) 0%, rgba(22,28,58,0.8) 100%); backdrop-filter: blur(16px);">

        <!-- subtle glow -->
        <div class="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl"></div>

        <!-- Address -->
        <div class="mb-4">
          <label class="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
            Recipient Address
          </label>
          <textarea
            v-model="address"
            rows="4"
            placeholder="Enter NAV recipient address..."
            title="Double-check the address — transactions cannot be reversed."
            class="w-full rounded-xl text-sm font-mono resize-none px-4 py-3 leading-relaxed glass-input"></textarea>
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-semibold uppercase tracking-widest text-white/70">Amount</label>
            <button v-if="balance && balance.mine.trusted > 0" type="button"
              @click="amount = balance.mine.trusted"
              class="text-[11px] text-violet-400 hover:text-violet-300 transition-colors focus:outline-none">
              Use All ({{ balance.mine.trusted }} NAV)
            </button>
          </div>
          <div class="relative">
            <input
              v-model="amount"
              type="number"
              min="0"
              placeholder="0.00"
              class="w-full rounded-xl text-lg font-bold px-3 py-2.5 pr-12 glass-input">
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/60 tracking-wider">NAV</span>
          </div>
        </div>

        <!-- Memo -->
        <div class="mb-4">
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/70">
            Memo <span class="normal-case font-normal text-white/40">(optional)</span>
          </label>
          <input
            v-model="memo"
            type="text"
            maxlength="255"
            placeholder="What's this transaction for?"
            title="Sent on-chain as a BLSCT memo — the recipient can read this."
            class="w-full rounded-xl text-sm px-3 py-2.5 glass-input">
          <p class="mt-1.5 text-xs text-white/55">Visible to the recipient.</p>
        </div>

        <!-- Comment To: disabled for now, RPC doesn't seem to persist/return this
             (gettransaction shows no comment_to/to field). Re-enable once confirmed
             working against the daemon.
        <div class="mb-4">
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/70">
            Comment To <span class="normal-case font-normal text-white/40">(optional)</span>
          </label>
          <input
            v-model="commentTo"
            type="text"
            maxlength="255"
            placeholder="Who is this going to?"
            title="Stored only in your wallet, not on-chain."
            class="w-full rounded-xl text-sm px-3 py-2.5 glass-input">
          <p class="mt-1.5 text-xs text-white/55">Only you can see this — kept in your wallet, not sent anywhere.</p>
        </div>
        -->

        <!-- Comment (private note): disabled for now
        <div class="mb-4">
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/70">
            Comment <span class="normal-case font-normal text-white/40">(optional)</span>
          </label>
          <input
            v-model="comment"
            type="text"
            maxlength="255"
            placeholder="A private note for yourself..."
            title="Only visible to you, stored locally in this app."
            class="w-full rounded-xl text-sm px-3 py-2.5 glass-input">
          <p class="mt-1.5 text-xs text-white/55">Only you can see this — kept locally in this app, never sent anywhere.</p>
        </div>
        -->

        <!-- 
        <div class="mb-5 flex items-center justify-between gap-3">
          <label class="text-xs font-semibold uppercase tracking-widest text-white/70"
            title="Recipient receives the amount minus the network fee, instead of the full amount.">
            Subtract Fee From Amount
          </label>
          <label class="inline-flex items-center cursor-pointer flex-shrink-0">
            <input type="checkbox" v-model="subtractFeeFromAmount" class="sr-only peer">
            <div class="relative w-10 h-5 rounded-full border border-white/20 transition-colors duration-200
                        bg-white/10 peer-checked:bg-violet-600 peer-checked:border-violet-500
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow
                        after:transition-transform after:duration-200
                        peer-checked:after:translate-x-[18px]"></div>
          </label>
        </div>
        !-->

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
              <p v-if="subtractFeeFromAmount" class="text-xs text-amber-400/90 mt-1">Fee will be subtracted from this amount</p>
            </div>
            <div v-if="memo" class="rounded-xl p-3 border border-white/[0.16]" style="background: rgba(255,255,255,0.10)">
              <p class="text-xs text-white/70 mb-1 uppercase tracking-widest">Memo</p>
              <p class="text-sm text-white/95 break-words">{{ memo }}</p>
            </div>
            <!--
            <div v-if="commentTo" class="rounded-xl p-3 border border-white/[0.16]" style="background: rgba(255,255,255,0.10)">
              <p class="text-xs text-white/70 mb-1 uppercase tracking-widest">Comment To</p>
              <p class="text-sm text-white/95 break-words">{{ commentTo }}</p>
            </div>
            <div v-if="comment" class="rounded-xl p-3 border border-white/[0.16]" style="background: rgba(255,255,255,0.10)">
              <p class="text-xs text-white/70 mb-1 uppercase tracking-widest">Comment (private)</p>
              <p class="text-sm text-white/95 break-words">{{ comment }}</p>
            </div>
            -->
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
  import { setTxComment } from '../utils/txComments';

  export default {
    components: { NoWalletSelected, WalletUnlock },
    data() {
      return {
        address: "",
        amount: "",
        memo: "",
        // commentTo: "",
        // comment: "",
        subtractFeeFromAmount: false,
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
            this.client.command([{ method: "sendtoaddress", parameters: {
              address: this.address,
              amount: this.amount,
              comment: this.memo || "",
              // comment: this.comment || "",
              // comment_to: this.commentTo || "",
              subtractfeefromamount: this.subtractFeeFromAmount
            } }])
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
                // if (this.comment) setTxComment(r[0], this.comment);
                this.address = "";
                this.amount = "";
                this.memo = "";
                // this.commentTo = "";
                // this.comment = "";
                this.subtractFeeFromAmount = false;
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
