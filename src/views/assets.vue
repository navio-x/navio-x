<template>
  <div class="h-full w-full bg-transparent text-white overflow-auto">
    <!-- Header / toolbar -->
    <div class="px-4 pt-4 pb-2">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold text-white">Assets</h1>
          <p class="text-xs text-white/50 mt-0.5">Tokens and NFTs on the Navio BLSCT network.</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" @click="refresh()" :disabled="loading" title="Refresh"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:text-white glass-btn-secondary focus:outline-none disabled:opacity-40">
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button type="button" @click="openCreateToken()"
            class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-semibold rounded-lg glass-btn-secondary focus:outline-none">
            <PhPlus :size="14" weight="bold" />
            Create Token
          </button>
          <button type="button" @click="openCreateNft()"
            class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85"
            style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
            <PhPlus :size="14" weight="bold" />
            Create NFT Collection
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <div class="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button type="button" @click="filter = 'all'"
            class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
            :class="filter === 'all' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'">
            All <span class="text-white/40">({{ visibleAssets.length }})</span>
          </button>
          <button type="button" @click="filter = 'tokens'"
            class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
            :class="filter === 'tokens' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'">
            Tokens <span class="text-white/40">({{ tokenCount }})</span>
          </button>
          <button type="button" @click="filter = 'nfts'"
            class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
            :class="filter === 'nfts' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'">
            NFTs <span class="text-white/40">({{ nftCount }})</span>
          </button>
        </div>
        <label class="inline-flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/70 cursor-pointer select-none">
          <input type="checkbox" v-model="showAllNetwork" class="w-3.5 h-3.5 rounded accent-violet-500 bg-white/10 border border-white/20">
          Show all network assets
        </label>
      </div>
    </div>

    <!-- Asset grid -->
    <div class="px-4 pb-6">
      <div v-if="loading && !assets.length" class="flex flex-col items-center justify-center py-16">
        <svg class="w-6 h-6 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="mt-2 text-xs text-white/50">Loading assets…</span>
      </div>

      <div v-else-if="!filteredAssets.length" class="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <PhCoins :size="24" weight="duotone" class="text-white/30" />
        </div>
        <p class="text-sm text-white/50">{{ emptyMessage }}</p>
        <p v-if="emptyHint" class="text-xs text-white/30 mt-1">{{ emptyHint }}</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div v-for="a in filteredAssets" :key="a.tokenId"
          class="relative overflow-hidden rounded-xl border border-white/[0.10] p-4 flex flex-col"
          style="background: linear-gradient(160deg, rgba(34,26,68,0.55) 0%, rgba(22,28,58,0.55) 100%); backdrop-filter: blur(12px);">

          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-semibold text-white truncate">{{ a.name || shortHex(a.tokenId) }}</span>
              </div>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-[11px] font-mono text-white/40 truncate" :title="a.tokenId">{{ shortHex(a.tokenId) }}</span>
                <button type="button" @click="copy(a.tokenId)" title="Copy token id" class="text-white/30 hover:text-white/70 focus:outline-none shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
              </div>
            </div>
            <span class="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              :class="a.isToken ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25' : 'bg-violet-500/15 text-violet-300 border border-violet-500/25'">
              {{ a.isToken ? 'Token' : 'NFT Collection' }}
            </span>
          </div>

          <div v-if="a.metadata.length" class="flex flex-wrap gap-1 mb-3">
            <span v-for="md in a.metadata" :key="md.key" class="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
              {{ md.key }}: {{ md.value }}
            </span>
          </div>

          <!-- Token stats -->
          <div v-if="a.isToken" class="grid grid-cols-2 gap-2 mb-3">
            <div class="rounded-lg bg-black/20 px-2.5 py-2">
              <div class="text-[10px] uppercase tracking-widest text-white/35">Your balance</div>
              <div class="text-sm font-semibold text-emerald-300 font-mono">{{ formatNum(a.balance) }}</div>
            </div>
            <div class="rounded-lg bg-black/20 px-2.5 py-2">
              <div class="text-[10px] uppercase tracking-widest text-white/35">Supply</div>
              <div class="text-sm font-semibold text-white/80 font-mono">{{ formatNum(a.currentSupplyDisplay) }} / {{ formatNum(a.maxSupplyDisplay) }}</div>
            </div>
          </div>

          <!-- NFT stats -->
          <div v-else class="grid grid-cols-2 gap-2 mb-3">
            <div class="rounded-lg bg-black/20 px-2.5 py-2">
              <div class="text-[10px] uppercase tracking-widest text-white/35">You own</div>
              <div class="text-sm font-semibold text-emerald-300 font-mono">{{ a.ownedNfts.length }}</div>
            </div>
            <div class="rounded-lg bg-black/20 px-2.5 py-2">
              <div class="text-[10px] uppercase tracking-widest text-white/35">Minted</div>
              <div class="text-sm font-semibold text-white/80 font-mono">{{ a.mintedNft.length }} / {{ formatNum(a.maxSupplyDisplay) }}</div>
            </div>
          </div>

          <!-- Owned NFT list -->
          <div v-if="!a.isToken && a.ownedNfts.length" class="mb-3 max-h-28 overflow-y-auto rounded-lg border border-white/10 divide-y divide-white/5">
            <div v-for="nft in a.ownedNfts" :key="nft.index" class="flex items-center justify-between px-2.5 py-1.5">
              <span class="text-[11px] font-mono text-white/60">#{{ nft.index }}</span>
              <button type="button" @click="openSendNft(a, nft)" class="text-[10px] text-violet-300 hover:text-violet-200 focus:outline-none">Send</button>
            </div>
          </div>

          <div class="mt-auto flex items-center gap-2 pt-1">
            <button type="button" @click="a.isToken ? openMintToken(a) : openMintNft(a)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              Mint
            </button>
            <button type="button" @click="a.isToken ? openSendToken(a) : openSendNft(a)"
              class="flex-1 py-1.5 px-3 text-xs font-medium rounded-lg glass-btn-secondary focus:outline-none">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ Create Token Modal ═══════════════ -->
    <div id="modal-create-token" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-lg max-h-full mx-auto mt-10">
        <div class="relative rounded-xl shadow-2xl glass-modal">
          <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
            <h3 class="text-lg font-semibold text-white">Create Token</h3>
            <button type="button" @click="close('createToken')" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
              <PhX :size="18" weight="bold" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block mb-2 text-xs font-medium text-white/80">Metadata</label>
              <div class="space-y-2">
                <div v-for="(row, idx) in createTokenForm.metadataRows" :key="idx" class="flex gap-2">
                  <input type="text" v-model="row.key" placeholder="key (e.g. name)" class="glass-input text-xs block w-2/5 p-2 rounded-lg">
                  <input type="text" v-model="row.value" placeholder="value" class="glass-input text-xs block flex-1 p-2 rounded-lg">
                  <button type="button" @click="removeMetaRow(createTokenForm.metadataRows, idx)" class="text-white/40 hover:text-red-300 px-1 focus:outline-none">
                    <PhX :size="14" weight="bold" />
                  </button>
                </div>
              </div>
              <button type="button" @click="addMetaRow(createTokenForm.metadataRows)" class="mt-2 text-xs text-violet-300 hover:text-violet-200 focus:outline-none">+ Add field</button>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Max supply</label>
              <input type="number" min="0" step="any" v-model="createTokenForm.max_supply" placeholder="e.g. 1000000" class="glass-input text-sm block w-full p-2.5 rounded-lg">
              <p class="mt-1 text-[11px] text-white/40">Total number of tokens that can ever be minted.</p>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
            <button type="button" @click="close('createToken')" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Cancel</button>
            <button type="button" @click="submitCreateToken()" :disabled="busy.createToken"
              class="py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              {{ busy.createToken ? 'Creating…' : 'Create Token' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ Create NFT Collection Modal ═══════════════ -->
    <div id="modal-create-nft" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-lg max-h-full mx-auto mt-10">
        <div class="relative rounded-xl shadow-2xl glass-modal">
          <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
            <h3 class="text-lg font-semibold text-white">Create NFT Collection</h3>
            <button type="button" @click="close('createNft')" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
              <PhX :size="18" weight="bold" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block mb-2 text-xs font-medium text-white/80">Metadata</label>
              <div class="space-y-2">
                <div v-for="(row, idx) in createNftForm.metadataRows" :key="idx" class="flex gap-2">
                  <input type="text" v-model="row.key" placeholder="key (e.g. name)" class="glass-input text-xs block w-2/5 p-2 rounded-lg">
                  <input type="text" v-model="row.value" placeholder="value" class="glass-input text-xs block flex-1 p-2 rounded-lg">
                  <button type="button" @click="removeMetaRow(createNftForm.metadataRows, idx)" class="text-white/40 hover:text-red-300 px-1 focus:outline-none">
                    <PhX :size="14" weight="bold" />
                  </button>
                </div>
              </div>
              <button type="button" @click="addMetaRow(createNftForm.metadataRows)" class="mt-2 text-xs text-violet-300 hover:text-violet-200 focus:outline-none">+ Add field</button>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Collection size</label>
              <input type="number" min="0" step="1" v-model="createNftForm.max_supply" placeholder="e.g. 1000" class="glass-input text-sm block w-full p-2.5 rounded-lg">
              <p class="mt-1 text-[11px] text-white/40">Maximum number of NFTs that can be minted in this collection.</p>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
            <button type="button" @click="close('createNft')" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Cancel</button>
            <button type="button" @click="submitCreateNft()" :disabled="busy.createNft"
              class="py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              {{ busy.createNft ? 'Creating…' : 'Create Collection' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ Mint Token Modal ═══════════════ -->
    <div id="modal-mint-token" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-lg max-h-full mx-auto mt-10">
        <div class="relative rounded-xl shadow-2xl glass-modal">
          <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
            <h3 class="text-lg font-semibold text-white">Mint Token</h3>
            <button type="button" @click="close('mintToken')" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
              <PhX :size="18" weight="bold" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Token</label>
              <div class="text-xs font-mono text-white/70 bg-black/20 rounded-lg px-3 py-2 break-all">{{ mintTokenForm.name ? mintTokenForm.name + ' — ' : '' }}{{ mintTokenForm.token_id }}</div>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Recipient address</label>
              <div v-if="myAddresses.length" class="space-y-1 mb-2 max-h-36 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-1.5">
                <label v-for="addr in myAddresses" :key="addr.address" class="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-white/5 cursor-pointer">
                  <input type="radio" name="mint-token-address" v-model="mintTokenForm.address" :value="addr.address" class="w-3.5 h-3.5 shrink-0 accent-violet-500 bg-white/10 border border-white/20">
                  <span class="min-w-0 flex-1">
                    <span v-if="addr.label" class="block text-xs text-white/85 truncate">{{ addr.label }}</span>
                    <span class="block text-[10px] font-mono text-white/40 truncate">{{ addr.address }}</span>
                  </span>
                </label>
              </div>
              <input type="text" v-model="mintTokenForm.address" placeholder="or paste any BLSCT address" class="glass-input text-xs font-mono block w-full p-2.5 rounded-lg">
              <p class="mt-1 text-[11px] text-white/40">Pick one of your Receive addresses above, or type/paste any BLSCT address.</p>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Amount</label>
              <input type="number" min="0" step="any" v-model="mintTokenForm.amount" placeholder="e.g. 1000" class="glass-input text-sm block w-full p-2.5 rounded-lg">
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
            <button type="button" @click="close('mintToken')" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Cancel</button>
            <button type="button" @click="submitMintToken()" :disabled="busy.mintToken"
              class="py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              {{ busy.mintToken ? 'Minting…' : 'Mint' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ Mint NFT Modal ═══════════════ -->
    <div id="modal-mint-nft" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-lg max-h-full mx-auto mt-10">
        <div class="relative rounded-xl shadow-2xl glass-modal">
          <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
            <h3 class="text-lg font-semibold text-white">Mint NFT</h3>
            <button type="button" @click="close('mintNft')" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
              <PhX :size="18" weight="bold" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Collection</label>
              <div class="text-xs font-mono text-white/70 bg-black/20 rounded-lg px-3 py-2 break-all">{{ mintNftForm.name ? mintNftForm.name + ' — ' : '' }}{{ mintNftForm.token_id }}</div>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">NFT id</label>
              <input type="number" min="0" step="1" v-model="mintNftForm.nft_id" placeholder="e.g. 0" class="glass-input text-sm block w-full p-2.5 rounded-lg">
              <p class="mt-1 text-[11px] text-white/40">Must be unique within this collection.</p>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Recipient address</label>
              <div v-if="myAddresses.length" class="space-y-1 mb-2 max-h-36 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-1.5">
                <label v-for="addr in myAddresses" :key="addr.address" class="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-white/5 cursor-pointer">
                  <input type="radio" name="mint-nft-address" v-model="mintNftForm.address" :value="addr.address" class="w-3.5 h-3.5 shrink-0 accent-violet-500 bg-white/10 border border-white/20">
                  <span class="min-w-0 flex-1">
                    <span v-if="addr.label" class="block text-xs text-white/85 truncate">{{ addr.label }}</span>
                    <span class="block text-[10px] font-mono text-white/40 truncate">{{ addr.address }}</span>
                  </span>
                </label>
              </div>
              <input type="text" v-model="mintNftForm.address" placeholder="or paste any BLSCT address" class="glass-input text-xs font-mono block w-full p-2.5 rounded-lg">
              <p class="mt-1 text-[11px] text-white/40">Pick one of your Receive addresses above, or type/paste any BLSCT address.</p>
            </div>
            <div>
              <label class="block mb-2 text-xs font-medium text-white/80">Metadata</label>
              <div class="space-y-2">
                <div v-for="(row, idx) in mintNftForm.metadataRows" :key="idx" class="flex gap-2">
                  <input type="text" v-model="row.key" placeholder="key (e.g. name)" class="glass-input text-xs block w-2/5 p-2 rounded-lg">
                  <input type="text" v-model="row.value" placeholder="value" class="glass-input text-xs block flex-1 p-2 rounded-lg">
                  <button type="button" @click="removeMetaRow(mintNftForm.metadataRows, idx)" class="text-white/40 hover:text-red-300 px-1 focus:outline-none">
                    <PhX :size="14" weight="bold" />
                  </button>
                </div>
              </div>
              <button type="button" @click="addMetaRow(mintNftForm.metadataRows)" class="mt-2 text-xs text-violet-300 hover:text-violet-200 focus:outline-none">+ Add field</button>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
            <button type="button" @click="close('mintNft')" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Cancel</button>
            <button type="button" @click="submitMintNft()" :disabled="busy.mintNft"
              class="py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              {{ busy.mintNft ? 'Minting…' : 'Mint NFT' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ Send Token Modal ═══════════════ -->
    <div id="modal-send-token" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-lg max-h-full mx-auto mt-10">
        <div class="relative rounded-xl shadow-2xl glass-modal">
          <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
            <h3 class="text-lg font-semibold text-white">Send Token</h3>
            <button type="button" @click="close('sendToken')" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
              <PhX :size="18" weight="bold" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Token</label>
              <div class="text-xs font-mono text-white/70 bg-black/20 rounded-lg px-3 py-2 break-all">{{ sendTokenForm.name ? sendTokenForm.name + ' — ' : '' }}{{ sendTokenForm.token_id }}</div>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Recipient address</label>
              <input type="text" v-model="sendTokenForm.address" placeholder="BLSCT address" class="glass-input text-xs font-mono block w-full p-2.5 rounded-lg">
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Amount</label>
              <input type="number" min="0" step="any" v-model="sendTokenForm.amount" placeholder="e.g. 10" class="glass-input text-sm block w-full p-2.5 rounded-lg">
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Memo <span class="text-white/30">(optional)</span></label>
              <input type="text" v-model="sendTokenForm.memo" placeholder="Visible to the recipient" class="glass-input text-sm block w-full p-2.5 rounded-lg">
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
            <button type="button" @click="close('sendToken')" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Cancel</button>
            <button type="button" @click="submitSendToken()" :disabled="busy.sendToken"
              class="py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              {{ busy.sendToken ? 'Sending…' : 'Send' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ Send NFT Modal ═══════════════ -->
    <div id="modal-send-nft" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-lg max-h-full mx-auto mt-10">
        <div class="relative rounded-xl shadow-2xl glass-modal">
          <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
            <h3 class="text-lg font-semibold text-white">Send NFT</h3>
            <button type="button" @click="close('sendNft')" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
              <PhX :size="18" weight="bold" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Collection</label>
              <div class="text-xs font-mono text-white/70 bg-black/20 rounded-lg px-3 py-2 break-all">{{ sendNftForm.name ? sendNftForm.name + ' — ' : '' }}{{ sendNftForm.token_id }}</div>
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">NFT</label>
              <select v-if="sendNftForm.ownedOptions.length" v-model="sendNftForm.nft_id" class="glass-input text-sm block w-full p-2.5 rounded-lg">
                <option v-for="nft in sendNftForm.ownedOptions" :key="nft.index" :value="nft.index">#{{ nft.index }}</option>
              </select>
              <input v-else type="number" min="0" step="1" v-model="sendNftForm.nft_id" placeholder="nft id" class="glass-input text-sm block w-full p-2.5 rounded-lg">
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Recipient address</label>
              <input type="text" v-model="sendNftForm.address" placeholder="BLSCT address" class="glass-input text-xs font-mono block w-full p-2.5 rounded-lg">
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-white/80">Memo <span class="text-white/30">(optional)</span></label>
              <input type="text" v-model="sendNftForm.memo" placeholder="Visible to the recipient" class="glass-input text-sm block w-full p-2.5 rounded-lg">
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 p-5 border-t border-white/[0.18] rounded-b">
            <button type="button" @click="close('sendNft')" class="py-2 px-4 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none">Cancel</button>
            <button type="button" @click="submitSendNft()" :disabled="busy.sendNft"
              class="py-2 px-4 text-sm font-semibold text-white rounded-lg disabled:opacity-50 focus:outline-none transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
              {{ busy.sendNft ? 'Sending…' : 'Send' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import '@sweetalert2/theme-dark/dark.scss';
import { PhPlus, PhX, PhCoins } from '@phosphor-icons/vue';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
})

// token amounts returned by gettokenbalance/getblsctbalance are already
// human-decimal (ValueFromAmount); maxSupply/currentSupply from
// listtokens/gettoken are raw satoshi-scaled integers for TOKEN entries
// (see CreateTokenOrNft / TokenToUniValue in navio-core), but a literal
// item count for NFT collections.
const COIN = 1e8;

export default {
  components: { PhPlus, PhX, PhCoins },
  data() {
    return {
      filter: 'all',
      showAllNetwork: false,
      loading: false,
      assets: [],
      myAddresses: [],
      myCreatedIds: new Set(),
      busy: { createToken: false, createNft: false, mintToken: false, mintNft: false, sendToken: false, sendNft: false },

      createTokenForm: { metadataRows: [{ key: 'name', value: '' }], max_supply: '' },
      createNftForm: { metadataRows: [{ key: 'name', value: '' }], max_supply: '' },
      mintTokenForm: { token_id: '', name: '', address: '', amount: '' },
      mintNftForm: { token_id: '', name: '', nft_id: '', address: '', metadataRows: [{ key: 'name', value: '' }] },
      sendTokenForm: { token_id: '', name: '', address: '', amount: '', memo: '' },
      sendNftForm: { token_id: '', name: '', nft_id: '', address: '', memo: '', ownedOptions: [] },
    }
  },
  computed: {
    // Assets this wallet actually created and/or currently holds. navio-core
    // doesn't expose an "ismine"/creator RPC for tokens (ownership is only
    // checked as a side effect inside minttoken/mintnft), so this combines
    // the closest reliable signals: a held balance/NFT, plus ids this app
    // itself remembered right after a successful createtoken/createnft call.
    myAssets() {
      return this.assets.filter(a => a.balance > 0 || a.ownedNfts.length > 0 || this.myCreatedIds.has(a.tokenId));
    },
    visibleAssets() {
      return this.showAllNetwork ? this.assets : this.myAssets;
    },
    filteredAssets() {
      if (this.filter === 'tokens') return this.visibleAssets.filter(a => a.isToken);
      if (this.filter === 'nfts') return this.visibleAssets.filter(a => !a.isToken);
      return this.visibleAssets;
    },
    tokenCount() { return this.visibleAssets.filter(a => a.isToken).length; },
    nftCount() { return this.visibleAssets.filter(a => !a.isToken).length; },
    emptyMessage() {
      if (!this.assets.length) return 'No tokens or NFTs found on this network yet.';
      if (!this.showAllNetwork && !this.myAssets.length) return "You haven't created or received any tokens or NFTs in this wallet yet.";
      return 'No assets match this filter.';
    },
    emptyHint() {
      if (!this.assets.length) return 'Create a token or an NFT collection to get started.';
      if (!this.showAllNetwork && !this.myAssets.length) return 'Create one above, or turn on "Show all network assets" to browse everything on the network.';
      return '';
    },
  },
  methods: {
    shortHex(hex) {
      if (!hex) return '';
      return hex.length > 18 ? hex.slice(0, 10) + '…' + hex.slice(-6) : hex;
    },
    formatNum(n) {
      if (n === undefined || n === null || Number.isNaN(n)) return '0';
      return Number(n).toLocaleString(undefined, { maximumFractionDigits: 8 });
    },
    copy(text) {
      navigator.clipboard.writeText(text);
      Toast.fire({ theme: 'dark', icon: 'success', title: 'Copied' });
    },
    notifyError(msg) {
      Swal.fire({ theme: 'dark', title: 'Error!', text: msg || 'Something went wrong', icon: 'error', confirmButtonText: 'OK' });
    },
    toastSuccess(title) {
      Toast.fire({ theme: 'dark', icon: 'success', title });
    },
    callRpc(method, params) {
      return this.client.command([{ method, parameters: params }]).then((r) => {
        const res = r[0];
        if (res && typeof res === 'object' && (res.name === 'RpcError' || res.code)) {
          throw new Error(res.message || JSON.stringify(res));
        }
        return res;
      });
    },
    rowsToMetadata(rows) {
      const obj = {};
      rows.forEach(r => { if (r.key && r.key.trim()) obj[r.key.trim()] = r.value; });
      return obj;
    },
    addMetaRow(rows) { rows.push({ key: '', value: '' }); },
    removeMetaRow(rows, idx) { rows.splice(idx, 1); },

    baseAsset(t) {
      const isToken = t.type === 'token';
      const metadataArr = Array.isArray(t.metadata) ? t.metadata : [];
      const nameEntry = metadataArr.find(m => m.key === 'name');
      return {
        tokenId: t.tokenId,
        publicKey: t.publicKey,
        type: t.type,
        isToken,
        name: nameEntry ? nameEntry.value : '',
        metadata: metadataArr.filter(m => m.key !== 'name'),
        maxSupplyDisplay: isToken ? (t.maxSupply || 0) / COIN : (t.maxSupply || 0),
        currentSupplyDisplay: isToken ? (t.currentSupply || 0) / COIN : 0,
        mintedNft: Array.isArray(t.mintedNft) ? t.mintedNft : [],
        balance: 0,
        ownedNfts: [],
      };
    },
    enrichAsset(t) {
      const asset = this.baseAsset(t);
      if (asset.isToken) {
        return this.callRpc('gettokenbalance', [asset.tokenId, '*', 0])
          .then((bal) => { asset.balance = Number(bal) || 0; return asset; })
          .catch(() => asset);
      }
      return this.callRpc('getnftbalance', [asset.tokenId, '*', 0])
        .then((owned) => { asset.ownedNfts = Array.isArray(owned) ? owned : []; return asset; })
        .catch(() => asset);
    },
    loadAssets() {
      this.loading = true;
      return this.callRpc('listtokens', [])
        .then((list) => {
          const items = Array.isArray(list) ? list : [];
          return Promise.all(items.map(t => this.enrichAsset(t)));
        })
        .then((assets) => { this.assets = assets; })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.loading = false; });
    },
    refresh() { this.loadAssets(); },
    createdIdsStorageKey() {
      return `assets_created_${this.$store.state.active_wallet || 'default'}`;
    },
    loadCreatedIds() {
      try {
        const raw = localStorage.getItem(this.createdIdsStorageKey());
        const arr = raw ? JSON.parse(raw) : [];
        this.myCreatedIds = new Set(Array.isArray(arr) ? arr : []);
      } catch (e) {
        this.myCreatedIds = new Set();
      }
    },
    rememberCreated(tokenId) {
      if (!tokenId) return;
      this.myCreatedIds.add(tokenId);
      try {
        localStorage.setItem(this.createdIdsStorageKey(), JSON.stringify([...this.myCreatedIds]));
      } catch (e) {}
    },
    loadMyAddresses() {
      return this.callRpc('listreceivedbyaddress', [0, true])
        .then((list) => { this.myAddresses = Array.isArray(list) ? list : []; })
        .catch(() => {});
    },

    open(name) { if (this.modals && this.modals[name]) this.modals[name].show(); },
    close(name) { if (this.modals && this.modals[name]) this.modals[name].hide(); },

    openCreateToken() {
      this.createTokenForm = { metadataRows: [{ key: 'name', value: '' }], max_supply: '' };
      this.open('createToken');
    },
    openCreateNft() {
      this.createNftForm = { metadataRows: [{ key: 'name', value: '' }], max_supply: '' };
      this.open('createNft');
    },
    openMintToken(asset) {
      this.mintTokenForm = { token_id: asset.tokenId, name: asset.name, address: '', amount: '' };
      this.open('mintToken');
    },
    openMintNft(asset) {
      this.mintNftForm = { token_id: asset.tokenId, name: asset.name, nft_id: '', address: '', metadataRows: [{ key: 'name', value: '' }] };
      this.open('mintNft');
    },
    openSendToken(asset) {
      this.sendTokenForm = { token_id: asset.tokenId, name: asset.name, address: '', amount: '', memo: '' };
      this.open('sendToken');
    },
    openSendNft(asset, nft) {
      this.sendNftForm = {
        token_id: asset.tokenId,
        name: asset.name,
        nft_id: nft ? nft.index : (asset.ownedNfts[0] ? asset.ownedNfts[0].index : ''),
        address: '',
        memo: '',
        ownedOptions: asset.ownedNfts || [],
      };
      this.open('sendNft');
    },

    submitCreateToken() {
      const metadata = this.rowsToMetadata(this.createTokenForm.metadataRows);
      const max = Number(this.createTokenForm.max_supply);
      if (!max || max <= 0) return this.notifyError('Enter a valid max supply.');
      this.busy.createToken = true;
      this.callRpc('createtoken', [metadata, max])
        .then((res) => { this.rememberCreated(res && res.tokenId); this.toastSuccess('Token created'); this.close('createToken'); this.loadAssets(); })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.busy.createToken = false; });
    },
    submitCreateNft() {
      const metadata = this.rowsToMetadata(this.createNftForm.metadataRows);
      const max = Number(this.createNftForm.max_supply);
      if (!max || max <= 0) return this.notifyError('Enter a valid collection size.');
      this.busy.createNft = true;
      this.callRpc('createnft', [metadata, max])
        .then((res) => { this.rememberCreated(res && res.tokenId); this.toastSuccess('NFT collection created'); this.close('createNft'); this.loadAssets(); })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.busy.createNft = false; });
    },
    submitMintToken() {
      const f = this.mintTokenForm;
      if (!f.address) return this.notifyError('Recipient address is required.');
      const amount = Number(f.amount);
      if (!amount || amount <= 0) return this.notifyError('Enter a valid amount.');
      this.busy.mintToken = true;
      this.callRpc('minttoken', [f.token_id, f.address, amount])
        .then(() => { this.toastSuccess('Token minted'); this.close('mintToken'); this.loadAssets(); })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.busy.mintToken = false; });
    },
    submitMintNft() {
      const f = this.mintNftForm;
      if (f.nft_id === '' || f.nft_id === null || f.nft_id === undefined) return this.notifyError('NFT id is required.');
      if (!f.address) return this.notifyError('Recipient address is required.');
      const metadata = this.rowsToMetadata(f.metadataRows);
      this.busy.mintNft = true;
      this.callRpc('mintnft', [f.token_id, Number(f.nft_id), f.address, metadata])
        .then(() => { this.toastSuccess('NFT minted'); this.close('mintNft'); this.loadAssets(); })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.busy.mintNft = false; });
    },
    submitSendToken() {
      const f = this.sendTokenForm;
      if (!f.address) return this.notifyError('Recipient address is required.');
      const amount = Number(f.amount);
      if (!amount || amount <= 0) return this.notifyError('Enter a valid amount.');
      this.busy.sendToken = true;
      this.callRpc('sendtokentoblsctaddress', [f.token_id, f.address, amount, f.memo || '', false])
        .then(() => { this.toastSuccess('Token sent'); this.close('sendToken'); this.loadAssets(); })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.busy.sendToken = false; });
    },
    submitSendNft() {
      const f = this.sendNftForm;
      if (f.nft_id === '' || f.nft_id === null || f.nft_id === undefined) return this.notifyError('Select an NFT.');
      if (!f.address) return this.notifyError('Recipient address is required.');
      this.busy.sendNft = true;
      this.callRpc('sendnfttoblsctaddress', [f.token_id, Number(f.nft_id), f.address, f.memo || '', false])
        .then(() => { this.toastSuccess('NFT sent'); this.close('sendNft'); this.loadAssets(); })
        .catch((e) => this.notifyError(e.message))
        .finally(() => { this.busy.sendNft = false; });
    },
  },
  mounted() {
    this.modals = {};
    const opts = { backdropClasses: 'bg-black/60 backdrop-blur-sm fixed inset-0 z-40' };
    const ids = {
      createToken: 'modal-create-token',
      createNft: 'modal-create-nft',
      mintToken: 'modal-mint-token',
      mintNft: 'modal-mint-nft',
      sendToken: 'modal-send-token',
      sendNft: 'modal-send-nft',
    };
    Object.entries(ids).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) this.modals[key] = new Modal(el, opts);
    });
    this.loadCreatedIds();
    this.loadAssets();
    this.loadMyAddresses();
  },
}
</script>
