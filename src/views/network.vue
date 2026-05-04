<template>
  <section class="min-h-screen bg-transparent flex flex-col items-center justify-center px-6 py-12 pt-[calc(48px+2rem)]">
    <img src="../assets/logo.svg" class="w-36 mb-10" alt="Navio" />

    <h1 class="text-3xl font-extrabold text-white mb-2 text-center">Select Network</h1>
    <p class="text-white/50 text-sm mb-10 text-center max-w-sm">
      Choose the Navio network you want to connect to. You can change this later from the setup screen.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
      <button
        v-for="net in networks"
        :key="net.name"
        @click="select(net)"
        class="group relative flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-all focus:outline-none"
        :class="selected && selected.name === net.name
          ? 'bg-violet-500/15 border-violet-500 ring-1 ring-violet-500/50'
          : 'glass-card hover:border-white/20'"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border"
              :class="net.name === 'mainnet' ? 'bg-green-900/40 border-green-700' : 'bg-yellow-900/40 border-yellow-700'">
              <!-- Mainnet: shield-check -->
              <svg v-if="net.name === 'mainnet'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <!-- Testnet: beaker -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-yellow-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 0 1 .45 1.317C20.25 17.733 19.228 19 17.818 19H6.182c-1.41 0-2.432-1.267-2.432-2.583 0-.48.157-.937.45-1.317L9.75 8.25" />
              </svg>
            </div>
            <div>
              <p class="text-base font-semibold text-white">{{ net.label }}</p>
              <p class="text-xs text-white/50">Port {{ net.port }}</p>
            </div>
          </div>
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            :class="selected && selected.name === net.name ? 'border-violet-500 bg-violet-500' : 'border-white/20'">
            <svg v-if="selected && selected.name === net.name" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-white">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-white/35 leading-relaxed">{{ net.description }}</p>
      </button>
    </div>

    <div class="flex gap-3 mt-10">
      <button
        @click="$emit('back')"
        class="px-5 py-2.5 text-sm font-medium glass-btn-secondary rounded-lg transition"
      >
        Back
      </button>
      <button
        :disabled="!selected"
        @click="confirm"
        class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition inline-flex items-center gap-2"
      >
        Continue
        <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NetworkSelector',
  props: {
    networks: { type: Array, required: true },
    current:  { type: String, default: 'mainnet' }
  },
  emits: ['select', 'back'],
  data() {
    return {
      selected: null
    }
  },
  mounted() {
    this.selected = this.networks.find(n => n.name === this.current) || this.networks[0];
  },
  methods: {
    select(net) {
      this.selected = net;
    },
    confirm() {
      if (this.selected) this.$emit('select', this.selected);
    }
  }
}
</script>
