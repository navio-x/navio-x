<template>
  <div class="h-full w-full bg-transparent text-white overflow-auto scroll-smooth">
    <div class="px-4 pt-4 pb-2">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-white">Trade</h1>
          <p class="text-xs text-white/50 mt-0.5">Peer-to-peer atomic swaps over the encrypted <span class="font-mono">p2pmsg</span> network (navio-core <span class="font-mono">p2pmsg</span> module RPCs).</p>
        </div>
        <div v-if="info.enabled" class="flex items-center gap-2 rounded-xl border border-emerald-500/25 px-3 py-2" style="background: linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.07) 100%); backdrop-filter: blur(12px);">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></span>
          <span class="text-xs font-medium text-emerald-300">Subsystem enabled</span>
          <span class="text-xs text-white/40">·</span>
          <span class="text-xs text-white/60">{{ info.relay_capable_peers || 0 }} relay peer{{ info.relay_capable_peers === 1 ? '' : 's' }}</span>
        </div>
        <div v-else class="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 bg-white/5">
          <span class="w-1.5 h-1.5 rounded-full bg-white/25"></span>
          <span class="text-xs text-white/50">Subsystem status unknown</span>
        </div>
      </div>

      <div v-if="infoChecked && !info.enabled" class="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-amber-400 mt-0.5 shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <span class="text-xs text-amber-300">The encrypted p2p messaging subsystem is disabled on this node. Swap, RFQ and aggregation RPCs below will return errors until <span class="font-mono">p2pmsg</span> is enabled on the connected <span class="font-mono">naviod</span>.</span>
      </div>

      <div v-if="info.enabled" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="relative overflow-hidden rounded-xl border border-white/[0.10] px-4 py-3" style="background: linear-gradient(160deg, rgba(34,26,68,0.5) 0%, rgba(22,28,58,0.5) 100%); backdrop-filter: blur(12px);">
          <div class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Identity Pubkey</div>
          <div class="text-xs font-mono text-white/75 break-all">{{ info.identity_pubkey }}</div>
        </div>
        <div class="relative overflow-hidden rounded-xl border border-white/[0.10] px-4 py-3" style="background: linear-gradient(160deg, rgba(34,26,68,0.5) 0%, rgba(22,28,58,0.5) 100%); backdrop-filter: blur(12px);">
          <div class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">Inbox Pubkey (prekey)</div>
          <div class="text-xs font-mono text-white/75 break-all">{{ info.inbox_pubkey }}</div>
        </div>
      </div>

      <!-- Quick nav -->
      <div class="mt-4 flex flex-wrap gap-1.5">
        <a v-for="g in groups" :key="g.id" :href="'#'+g.id"
          class="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10 transition-colors">
          {{ g.title }}
        </a>
      </div>
    </div>

    <div class="px-4 pb-6 space-y-6">
      <section v-for="g in groups" :key="g.id" :id="g.id" class="scroll-mt-4">
        <div class="mb-2">
          <h2 class="text-sm font-semibold text-white/85">{{ g.title }}</h2>
          <p class="text-xs text-white/45">{{ g.description }}</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div v-for="m in g.methods" :key="m.name"
            class="relative overflow-hidden rounded-xl border border-white/[0.10] p-4 flex flex-col"
            style="background: linear-gradient(160deg, rgba(34,26,68,0.55) 0%, rgba(22,28,58,0.55) 100%); backdrop-filter: blur(12px);">

            <div class="flex items-start justify-between gap-2 mb-1">
              <span class="font-mono text-sm font-semibold text-white">{{ m.name }}</span>
              <span v-if="m.debug" class="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 uppercase tracking-wide">debug</span>
            </div>
            <p class="text-xs text-white/50 mb-3 leading-relaxed">{{ m.description }}</p>

            <!-- Methods that take parameters: configure & run via modal -->
            <template v-if="m.args.length">
              <div class="mt-auto flex items-center gap-2 flex-wrap">
                <button type="button" @click="openMethodModal(m)"
                  class="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85"
                  style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
                  Configure &amp; Run
                </button>
                <button v-if="state[m.name].result !== undefined || state[m.name].error" type="button"
                  @click="openMethodModal(m)"
                  class="py-1.5 px-3 text-xs font-medium rounded-lg glass-btn-secondary focus:outline-none">
                  View last result
                </button>
              </div>
              <div v-if="state[m.name].error" class="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2 break-words line-clamp-2">
                {{ state[m.name].error }}
              </div>
              <div v-else-if="state[m.name].result !== undefined" class="mt-3 text-[11px] font-mono text-emerald-300/80 line-clamp-2 break-words">
                {{ formatResult(state[m.name].result) }}
              </div>
            </template>

            <!-- Parameterless methods: run inline, auto-refresh the safe read-only ones -->
            <template v-else>
              <div class="mt-auto flex items-center gap-2">
                <button type="button" @click="runMethod(m)" :disabled="state[m.name].loading"
                  class="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
                  style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
                  <svg v-if="state[m.name].loading" class="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ state[m.name].loading ? 'Running…' : 'Run' }}
                </button>
                <button v-if="state[m.name].result !== undefined || state[m.name].error" type="button"
                  @click="resetMethod(m)"
                  class="py-1.5 px-3 text-xs font-medium rounded-lg glass-btn-secondary focus:outline-none">
                  Clear
                </button>
                <span v-if="m.pollable" class="inline-flex items-center gap-1 text-[10px] text-emerald-300/70 ml-auto shrink-0" title="Auto-refreshes every 5 seconds">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  live · 5s
                </span>
              </div>

              <div v-if="state[m.name].error" class="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2 break-words">
                {{ state[m.name].error }}
              </div>
              <div v-if="state[m.name].result !== undefined && !state[m.name].error" class="mt-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] uppercase tracking-widest text-white/35">Result</span>
                  <button type="button" @click="copyResult(m)" class="text-[10px] text-white/40 hover:text-white/70 focus:outline-none">copy</button>
                </div>
                <pre class="text-[11px] font-mono text-emerald-300 bg-black/20 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-words">{{ formatResult(state[m.name].result) }}</pre>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>

    <!-- ═══════════════ Configure & Run Modal (parameterized RPCs) ═══════════════ -->
    <div v-if="activeMethod" @keydown.esc="closeMethodModal" tabindex="0"
      class="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="closeMethodModal">
      <div class="relative w-full max-w-lg max-h-full my-8 sm:my-0 rounded-xl shadow-2xl glass-modal">
        <div class="flex items-start justify-between gap-3 p-5 border-b border-white/[0.18]">
          <div class="min-w-0">
            <h3 class="text-base font-semibold text-white font-mono truncate">{{ activeMethod.name }}</h3>
            <p class="text-xs text-white/50 mt-1 leading-relaxed">{{ activeMethod.description }}</p>
          </div>
          <button type="button" @click="closeMethodModal" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 shrink-0 inline-flex items-center transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-5 space-y-3.5 max-h-[60vh] overflow-y-auto">
          <div v-for="a in activeMethod.args" :key="a.key">
            <div class="flex items-center justify-between mb-1">
              <label class="text-[11px] font-medium text-white/70">{{ a.label }}</label>
              <button v-if="a.type !== 'bool' && lastValues[a.key]" type="button"
                @click="state[activeMethod.name].values[a.key] = lastValues[a.key]"
                class="text-[10px] text-violet-300 hover:text-violet-200 transition-colors focus:outline-none">
                use last {{ a.key }}
              </button>
            </div>
            <label v-if="a.type === 'bool'" class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="state[activeMethod.name].values[a.key]" class="w-4 h-4 rounded accent-violet-500 bg-white/10 border border-white/20">
              <span class="text-xs text-white/55">{{ a.help }}</span>
            </label>
            <input v-else
              :type="a.type === 'num' ? 'number' : 'text'"
              :step="a.type === 'num' ? 'any' : undefined"
              v-model="state[activeMethod.name].values[a.key]"
              :placeholder="a.placeholder"
              class="glass-input text-xs block w-full p-2 rounded-lg font-mono">

            <!-- Quick token select, backed by the Assets page's token list -->
            <div v-if="a.token" class="mt-1.5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] text-white/40">Quick select from your assets</span>
                <button type="button" @click="loadTokens" class="text-[10px] text-violet-300 hover:text-violet-200 focus:outline-none" :disabled="tokenLoading">
                  {{ tokenLoading ? 'loading…' : 'refresh' }}
                </button>
              </div>
              <div class="flex flex-wrap gap-1 max-h-20 overflow-y-auto rounded-lg border border-white/10 bg-black/15 p-1.5">
                <button type="button" @click="state[activeMethod.name].values[a.key] = ''"
                  class="text-[10px] px-2 py-1 rounded-full border transition-colors"
                  :class="!state[activeMethod.name].values[a.key] ? 'bg-violet-500/25 text-violet-200 border-violet-400/40' : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'">
                  NAV (native)
                </button>
                <button type="button" v-for="t in tokenOptions" :key="t.tokenId"
                  @click="state[activeMethod.name].values[a.key] = t.tokenId"
                  :title="t.tokenId"
                  class="text-[10px] px-2 py-1 rounded-full border transition-colors font-mono"
                  :class="state[activeMethod.name].values[a.key] === t.tokenId ? 'bg-violet-500/25 text-violet-200 border-violet-400/40' : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'">
                  {{ t.name || shortHex(t.tokenId) }}
                </button>
                <span v-if="!tokenOptions.length && !tokenLoading" class="text-[10px] text-white/30 px-1 py-1">No tokens found — create one on the Assets page.</span>
              </div>
            </div>
          </div>

          <div v-if="state[activeMethod.name].error" class="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2 break-words">
            {{ state[activeMethod.name].error }}
          </div>
          <div v-if="state[activeMethod.name].result !== undefined && !state[activeMethod.name].error">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] uppercase tracking-widest text-white/35">Result</span>
              <button type="button" @click="copyResult(activeMethod)" class="text-[10px] text-white/40 hover:text-white/70 focus:outline-none">copy</button>
            </div>
            <pre class="text-[11px] font-mono text-emerald-300 bg-black/20 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-words max-h-56 overflow-y-auto">{{ formatResult(state[activeMethod.name].result) }}</pre>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
          <button v-if="state[activeMethod.name].result !== undefined || state[activeMethod.name].error" type="button"
            @click="resetMethod(activeMethod)"
            class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">
            Clear
          </button>
          <button type="button" @click="closeMethodModal" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Close</button>
          <button type="button" @click="runMethod(activeMethod)" :disabled="state[activeMethod.name].loading"
            class="inline-flex items-center gap-1.5 py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
            style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
            <svg v-if="state[activeMethod.name].loading" class="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ state[activeMethod.name].loading ? 'Running…' : 'Run' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import '@sweetalert2/theme-dark/dark.scss';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
})

// Metadata mirrors src/rpc/p2pmsg.cpp in the navio-core `p2pmsg` branch
// (RegisterP2PMsgRPCCommands) so every RPC the module exposes has a form here.
// `pollable: true` marks read-only, side-effect-free zero-arg RPCs that are
// safe to auto-refresh; mutating zero-arg RPCs (rotatep2pmsginbox) and
// one-shot queue-draining RPCs (listpendingcandidaterequests) are excluded.
// `token: true` on an arg wires it to the Assets-page token quick-picker.
const GROUPS = [
  {
    id: 'subsystem',
    title: 'Subsystem',
    description: 'Status and identity of the encrypted p2pmsg transport on this node.',
    methods: [
      {
        name: 'getp2pmsginfo',
        description: "Return state of the encrypted p2p messaging subsystem (debug).",
        debug: true,
        args: [],
      },
      {
        name: 'rotatep2pmsginbox',
        description: "Rotate the inbox prekey now (manual privacy reset). Node identity is unchanged; the previous prekey stays decryptable briefly so in-flight messages aren't lost.",
        debug: true,
        args: [],
      },
      {
        name: 'sendp2pping',
        description: 'Encrypt a PING to the given inbox pubkey and broadcast it over p2pmsg (debug).',
        debug: true,
        args: [
          { key: 'inbox_pubkey', label: 'inbox_pubkey', type: 'hex', placeholder: 'recipient inbox pubkey (hex), from getp2pmsginfo' },
          { key: 'stem', label: 'stem', type: 'bool', default: true, help: 'send via the Dandelion stem variant' },
        ],
      },
    ],
  },
  {
    id: 'swap-intents',
    title: 'Swap Intents',
    description: "Local, never-gossiped willingness to fill matching RFQ requests.",
    methods: [
      {
        name: 'setswapintent',
        description: 'Configure a local swap intent: offer to pay out token_in for token_out.',
        debug: false,
        args: [
          { key: 'token_in', label: 'token_in', type: 'hex', token: true, placeholder: 'token maker pays out (hex, empty = NAV)' },
          { key: 'token_out', label: 'token_out', type: 'hex', token: true, placeholder: 'token maker wants (hex, empty = NAV)' },
          { key: 'min_size', label: 'min_size', type: 'num', placeholder: 'minimum fill size' },
          { key: 'max_size', label: 'max_size', type: 'num', placeholder: 'maximum fill size' },
          { key: 'price_min', label: 'price_min', type: 'num', placeholder: 'minimum price, scaled by 1e8' },
          { key: 'expiry', label: 'expiry', type: 'num', placeholder: 'unix time the intent expires' },
        ],
      },
      {
        name: 'listswapintents',
        description: 'List all local swap intents.',
        debug: false,
        args: [],
        pollable: true,
      },
      {
        name: 'clearswapintent',
        description: 'Remove a local swap intent by id.',
        debug: false,
        args: [
          { key: 'intent_id', label: 'intent_id', type: 'num', placeholder: 'the intent id' },
        ],
      },
    ],
  },
  {
    id: 'standing-orders',
    title: 'Standing Orders',
    description: 'Orders published to the network so peers can answer RFQs on your behalf while you are offline.',
    methods: [
      {
        name: 'sendorder',
        description: "Publish an externally built standing swap order: your signed unbalanced half-transaction offering offer_amount of offer_token for want_amount of want_token. Cached locally and broadcast as ORDER_ANN.",
        debug: false,
        args: [
          { key: 'half_tx_hex', label: 'half_tx_hex', type: 'hex', placeholder: "maker's signed unbalanced half-transaction" },
          { key: 'offer_token', label: 'offer_token', type: 'hex', token: true, placeholder: 'token offered (hex, empty = NAV)' },
          { key: 'offer_amount', label: 'offer_amount', type: 'num', placeholder: 'units of offer_token delivered' },
          { key: 'want_token', label: 'want_token', type: 'hex', token: true, placeholder: 'token wanted (hex, empty = NAV)' },
          { key: 'want_amount', label: 'want_amount', type: 'num', placeholder: 'units of want_token charged' },
          { key: 'expiry', label: 'expiry', type: 'num', placeholder: 'unix time order expires (capped to 14 days)' },
        ],
      },
      {
        name: 'listorders',
        description: 'Report the standing-order cache state (debug).',
        debug: false,
        args: [],
        pollable: true,
      },
    ],
  },
  {
    id: 'rfq',
    title: 'Request for Quote (RFQ)',
    description: 'Open a request, collect encrypted maker quotes, then combine and broadcast the swap.',
    methods: [
      {
        name: 'requestquote',
        description: 'Open an RFQ: collect maker quotes to buy size of buy_token paying with sell_token. Returns a uuid + the session pubkey makers encrypt their quotes to.',
        debug: false,
        args: [
          { key: 'buy_token', label: 'buy_token', type: 'hex', token: true, placeholder: 'token to receive (hex, empty = NAV)' },
          { key: 'sell_token', label: 'sell_token', type: 'hex', token: true, placeholder: 'token to pay with (hex, empty = NAV)' },
          { key: 'size', label: 'size', type: 'num', placeholder: 'amount of buy_token wanted' },
          { key: 'expiry', label: 'expiry', type: 'num', placeholder: 'unix time the collection window closes' },
        ],
      },
      {
        name: 'listrfqs',
        description: 'List open RFQ request uuids.',
        debug: false,
        args: [],
        pollable: true,
      },
      {
        name: 'listquotes',
        description: 'List quotes collected for an open RFQ, ranked cheapest-price first.',
        debug: false,
        args: [
          { key: 'uuid', label: 'uuid', type: 'hex', placeholder: 'the request uuid' },
          { key: 'min_fill_ratio', label: 'min_fill_ratio', type: 'num', default: 1, placeholder: 'drop quotes filling less than this fraction of size' },
        ],
      },
      {
        name: 'acceptquote',
        description: "Combine the taker's signed half-transaction with a collected maker quote's half and broadcast the resulting swap.",
        debug: false,
        args: [
          { key: 'uuid', label: 'uuid', type: 'hex', placeholder: 'the request uuid' },
          { key: 'quote_id', label: 'quote_id', type: 'hex', placeholder: 'the chosen quote id' },
          { key: 'taker_half_hex', label: 'taker_half_hex', type: 'hex', placeholder: "the taker's signed half" },
        ],
      },
      {
        name: 'cancelrfq',
        description: 'Cancel an open RFQ, discarding its collected quotes.',
        debug: false,
        args: [
          { key: 'uuid', label: 'uuid', type: 'hex', placeholder: 'the request uuid' },
        ],
      },
      {
        name: 'listpendingquoterequests',
        description: "List inbound RFQ requests that matched one of this node's local swap intents and are awaiting a reply (see sendquote).",
        debug: false,
        args: [],
        pollable: true,
      },
      {
        name: 'sendquote',
        description: "Send an externally built maker quote for an RFQ request over p2pmsg: wraps half_tx_hex and the economic terms, authenticates, encrypts to reply_key and broadcasts. Consumes any matching pending request.",
        debug: false,
        args: [
          { key: 'uuid', label: 'uuid', type: 'hex', placeholder: 'RFQ request uuid being answered' },
          { key: 'reply_key', label: 'reply_key', type: 'hex', placeholder: "requester's reply session pubkey" },
          { key: 'half_tx_hex', label: 'half_tx_hex', type: 'hex', placeholder: "maker's signed unbalanced half-transaction" },
          { key: 'buy_token', label: 'buy_token', type: 'hex', token: true, placeholder: 'token delivered to taker (hex, empty = NAV)' },
          { key: 'sell_token', label: 'sell_token', type: 'hex', token: true, placeholder: 'token charged to taker (hex, empty = NAV)' },
          { key: 'fill', label: 'fill', type: 'num', placeholder: 'units of buy_token delivered' },
          { key: 'sell_cost', label: 'sell_cost', type: 'num', placeholder: 'units of sell_token charged' },
          { key: 'order_expiry', label: 'order_expiry', type: 'num', placeholder: 'unix time the quote expires' },
        ],
      },
      {
        name: 'addrfqquote',
        description: 'Inject a maker quote for an open RFQ (debug). Normally quotes arrive encrypted over the network.',
        debug: true,
        args: [
          { key: 'uuid', label: 'uuid', type: 'hex', placeholder: 'the request uuid' },
          { key: 'quote_id', label: 'quote_id', type: 'hex', placeholder: 'unique quote id' },
          { key: 'fill', label: 'fill', type: 'num', placeholder: 'units of buy token offered' },
          { key: 'sell_cost', label: 'sell_cost', type: 'num', placeholder: 'units of sell token charged' },
          { key: 'half_tx_hex', label: 'half_tx_hex', type: 'hex', placeholder: "maker's half-transaction" },
          { key: 'order_expiry', label: 'order_expiry', type: 'num', default: 0, placeholder: 'quote expiry' },
        ],
      },
    ],
  },
  {
    id: 'aggregation',
    title: 'Aggregation',
    description: 'Fee-0 cover candidates that get merged into a wallet-built BLSCT half-transaction for privacy.',
    methods: [
      {
        name: 'getaggregationhint',
        description: 'Return the parameters a wallet needs to size an aggregated send: candidates available and the per-candidate fee to add.',
        debug: false,
        args: [],
        pollable: true,
      },
      {
        name: 'getp2pmsgaggregate',
        description: 'Aggregate a wallet-built BLSCT half-transaction with up to max_candidates fee-0 cover candidates from the pool, then broadcast it.',
        debug: false,
        args: [
          { key: 'hexstring', label: 'hexstring', type: 'hex', placeholder: "wallet's signed own half-transaction" },
          { key: 'max_candidates', label: 'max_candidates', type: 'num', default: 16, placeholder: 'maximum cover candidates to merge' },
        ],
      },
      {
        name: 'listpendingcandidaterequests',
        description: 'Fetch and remove (one-shot) queued candidate pull requests received via AGG_ANN. Answer each with sendcandidate.',
        debug: false,
        args: [
          { key: 'max', label: 'max', type: 'num', default: 16, placeholder: 'maximum requests to claim' },
        ],
      },
      {
        name: 'addaggregationcandidate',
        description: 'Inject a fee-0 cover candidate half-transaction into the local pool (debug).',
        debug: true,
        args: [
          { key: 'hexstring', label: 'hexstring', type: 'hex', placeholder: 'the candidate half-transaction' },
        ],
      },
      {
        name: 'sendcandidate',
        description: 'Encrypt a cover candidate half-transaction to reply_pubkey and send it as CANDIDATE_TX over p2pmsg (debug).',
        debug: true,
        args: [
          { key: 'reply_pubkey', label: 'reply_pubkey', type: 'hex', placeholder: "requester's reply session pubkey (from its AGG_ANN pull request)" },
          { key: 'tx_hex', label: 'tx_hex', type: 'hex', placeholder: 'the candidate half-transaction' },
          { key: 'stem', label: 'stem', type: 'bool', default: true, help: 'send via the Dandelion stem variant' },
        ],
      },
    ],
  },
];

export default {
  data() {
    return {
      groups: GROUPS,
      state: {},
      lastValues: {},
      info: {},
      infoChecked: false,
      infoTimer: undefined,
      infoActive: false,
      activeMethodName: null,
      tokenOptions: [],
      tokenLoading: false,
      pollActive: false,
      pollTimer: undefined,
    }
  },
  created() {
    const state = {};
    this.groups.forEach(g => g.methods.forEach(m => {
      const values = {};
      m.args.forEach(a => { values[a.key] = a.type === 'bool' ? !!a.default : (a.default !== undefined ? a.default : ''); });
      state[m.name] = { values, loading: false, result: undefined, error: null };
    }));
    this.state = state;
  },
  computed: {
    activeMethod() {
      if (!this.activeMethodName) return null;
      for (const g of this.groups) {
        const m = g.methods.find(mm => mm.name === this.activeMethodName);
        if (m) return m;
      }
      return null;
    },
    pollableMethods() {
      return this.groups.flatMap(g => g.methods).filter(m => m.pollable);
    },
  },
  methods: {
    coerce(arg, raw) {
      if (arg.type === 'bool') return !!raw;
      if (arg.type === 'num') {
        if (raw === '' || raw === null || raw === undefined) return arg.default !== undefined ? arg.default : 0;
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
      }
      return raw === undefined || raw === null ? '' : String(raw).trim();
    },
    captureAutofill(methodName, res) {
      const directMap = { acceptquote: 'txid', sendquote: 'quote_id', sendorder: 'quote_id', setswapintent: 'intent_id' };
      if (directMap[methodName] && (typeof res === 'string' || typeof res === 'number')) {
        this.lastValues[directMap[methodName]] = String(res);
        return;
      }
      if (methodName === 'listrfqs' && Array.isArray(res) && res.length && typeof res[0] === 'string') {
        this.lastValues['uuid'] = res[0];
      }
      if (methodName === 'listpendingcandidaterequests' && Array.isArray(res) && res.length && typeof res[0] === 'string') {
        this.lastValues['reply_pubkey'] = res[0];
      }
      const keys = ['uuid', 'quote_id', 'reply_key', 'intent_id', 'txid', 'inbox_pubkey', 'reply_pubkey'];
      const scan = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) { obj.forEach(scan); return; }
        keys.forEach(k => { if (obj[k] !== undefined && obj[k] !== null) this.lastValues[k] = String(obj[k]); });
      };
      scan(res);
    },
    runMethod(m) {
      const st = this.state[m.name];
      st.loading = true;
      st.error = null;
      const params = m.args.map(a => this.coerce(a, st.values[a.key]));
      return this.client.command([{ method: m.name, parameters: params }]).then((r) => {
        const res = r[0];
        if (res && typeof res === 'object' && (res.name === 'RpcError' || res.code)) {
          st.error = res.message || JSON.stringify(res);
        } else {
          st.result = res;
          this.captureAutofill(m.name, res);
        }
      }).catch((e) => {
        st.error = (e && e.message) ? e.message : String(e);
      }).finally(() => {
        st.loading = false;
      });
    },
    resetMethod(m) {
      const st = this.state[m.name];
      st.result = undefined;
      st.error = null;
    },
    formatResult(res) {
      if (res === null) return 'null';
      if (typeof res === 'object') return JSON.stringify(res, null, 2);
      return String(res);
    },
    copyResult(m) {
      const text = this.formatResult(this.state[m.name].result);
      navigator.clipboard.writeText(text);
      Toast.fire({ theme: 'dark', icon: 'success', title: 'Copied' });
    },
    openMethodModal(m) {
      this.activeMethodName = m.name;
    },
    closeMethodModal() {
      this.activeMethodName = null;
    },
    shortHex(hex) {
      if (!hex) return '';
      return hex.length > 18 ? hex.slice(0, 10) + '…' + hex.slice(-6) : hex;
    },
    loadTokens() {
      this.tokenLoading = true;
      return this.client.command([{ method: 'listtokens', parameters: [] }]).then((r) => {
        const list = Array.isArray(r[0]) ? r[0] : [];
        this.tokenOptions = list.filter(t => t.type === 'token').map(t => {
          const metadataArr = Array.isArray(t.metadata) ? t.metadata : [];
          const nameEntry = metadataArr.find(md => md.key === 'name');
          return { tokenId: t.tokenId, name: nameEntry ? nameEntry.value : '' };
        });
      }).catch(() => {}).finally(() => { this.tokenLoading = false; });
    },
    pollInfo() {
      return this.client.command([{ method: 'getp2pmsginfo' }]).then((r) => {
        this.infoChecked = true;
        if (r[0] && !r[0].code) this.info = r[0];
      }).catch(() => { this.infoChecked = true; });
    },
    scheduleInfoPoll() {
      this.infoTimer = window.setTimeout(() => {
        if (!this.infoActive) return;
        this.pollInfo().then(() => {
          if (this.infoActive) this.scheduleInfoPoll();
        });
      }, 8000);
    },
    scheduleMethodPoll() {
      this.pollTimer = window.setTimeout(() => {
        if (!this.pollActive) return;
        // Only poll once the p2pmsg subsystem is known to be enabled, so
        // these cards don't spam RPC errors while it's disabled/unknown.
        const run = this.info.enabled ? Promise.all(this.pollableMethods.map(m => this.runMethod(m))) : Promise.resolve();
        run.finally(() => {
          if (this.pollActive) this.scheduleMethodPoll();
        });
      }, 5000);
    },
  },
  mounted() {
    this.infoActive = true;
    this.pollInfo().then(() => {
      if (this.info.enabled) this.pollableMethods.forEach(m => this.runMethod(m));
    });
    this.scheduleInfoPoll();

    this.loadTokens();

    this.pollActive = true;
    this.scheduleMethodPoll();
  },
  unmounted() {
    this.infoActive = false;
    window.clearTimeout(this.infoTimer);
    this.pollActive = false;
    window.clearTimeout(this.pollTimer);
  }
}
</script>
