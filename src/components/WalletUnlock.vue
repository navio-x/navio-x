<template>
  <transition name="fade" appear>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="relative text-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-white/[0.18]"
        style="background: linear-gradient(160deg, rgba(40,30,78,0.98) 0%, rgba(24,30,62,0.98) 100%); backdrop-filter: blur(24px);">

        <div class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-600/15 rounded-full blur-3xl"></div>

        <button @click="$emit('cancel')" class="absolute top-3 right-3 text-white/70 hover:text-white/95 transition-colors focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-center gap-3 mb-5">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style="background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.30);">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-violet-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold">Unlock Wallet</h2>
            <p class="text-xs text-white/50 mt-0.5">Enter your passphrase to proceed</p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-1.5 text-xs font-medium text-white/60">Passphrase</label>
          <div class="relative">
            <input
              ref="passphraseInput"
              :type="showPass ? 'text' : 'password'"
              v-model="passphrase"
              @keydown.enter="submit"
              class="glass-input text-sm block w-full p-2.5 pr-10"
              placeholder="Wallet passphrase"
              autocomplete="off">
            <button type="button" @click="showPass = !showPass"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors focus:outline-none">
              <svg v-if="!showPass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
          <p class="mt-2 text-xs text-white/40 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Wallet will remain unlocked for {{ timeoutLabel }}.
        </p>
        <div v-if="warning" class="mt-2 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs text-amber-300 border border-amber-500/25" style="background: rgba(245,158,11,0.08);">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 shrink-0 mt-0.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          {{ warning }}
        </div>
        <p v-if="error" class="mt-2 text-xs text-red-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {{ error }}
          </p>
        </div>

        <div class="flex gap-3">
          <button @click="$emit('cancel')"
            class="flex-1 px-4 py-2.5 rounded-xl text-sm glass-btn-secondary transition duration-200">
            Cancel
          </button>
          <button @click="submit" :disabled="!passphrase || loading"
            class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
            style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span v-if="!loading">Unlock</span>
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  emits: ['unlocked', 'cancel'],
  props: {
    timeout: { type: Number, default: 60 },
    warning: { type: String, default: '' }
  },
  data() {
    return {
      passphrase: '',
      showPass: false,
      loading: false,
      error: ''
    };
  },
  computed: {
    timeoutLabel() {
      if (this.timeout < 60) return this.timeout + ' seconds';
      if (this.timeout < 3600) return Math.round(this.timeout / 60) + ' minutes';
      return Math.round(this.timeout / 3600) + ' hour(s)';
    }
  },
  mounted() {
    this.$nextTick(() => this.$refs.passphraseInput?.focus());
  },
  methods: {
    async submit() {
      if (!this.passphrase || this.loading) return;
      this.loading = true;
      this.error = '';
      try {
        const r = await this.client.command([{ method: 'walletpassphrase', parameters: [this.passphrase, this.timeout] }]);
        if (r[0] && r[0].code) {
          this.error = r[0].message;
        } else {
          this.passphrase = '';
          this.$emit('unlocked');
        }
      } catch (err) {
        this.error = err.message || 'Failed to unlock wallet';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.97); }
</style>
