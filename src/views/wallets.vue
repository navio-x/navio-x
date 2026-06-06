<template>
  <div id="modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-xl shadow-2xl glass-modal">
        <!-- Modal header -->
        <div class="flex items-start justify-between px-6 py-5 border-b border-white/[0.10] rounded-t" style="background: linear-gradient(90deg, rgba(124,58,237,0.10) 0%, rgba(59,130,246,0.05) 100%);">
          <h3 class="text-lg font-semibold tracking-tight text-white">
            Create Wallet
          </h3>
          <button id="closeButton" type="button" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div class="flex">
            <div class="flex items-center h-5">
              <input id="helper-radio-1" aria-describedby="helper-radio-text" type="radio" value="1" v-model="wallet_type_id" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div class="ms-2 text-md">
              <label for="helper-radio-1" class="font-medium text-white">Create wallet</label>
              <p class="text-md font-normal text-white/65">Create new empty wallet</p>
            </div>
            <div class="flex items-center h-5">
              <input id="helper-radio-2" aria-describedby="helper-radio-text" type="radio" value="2" v-model="wallet_type_id" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div class="ms-2 text-md">
              <label for="helper-radio-2" class="font-medium text-white">Import Wallet</label>
              <p class="text-md font-normal text-white/65">Import existing wallet with seed phrase or audit key</p>
            </div>
          </div>

          <div>
            <label for="wallet_name" class="block mb-2 text-sm font-medium dark:text-white text-white">Wallet Name</label>
            <input type="text" autofocus id="wallet_name" v-model="new_wallet_name" class="glass-input text-sm block w-full p-2.5">
          </div>
          <div v-if="wallet_type_id==2">
            <label for="import_seed_phrase" class="block mb-2 text-sm font-medium dark:text-white text-white">Wallet Seed Phrase or Audit Key</label>
            <input type="text" autofocus id="import_seed_phrase" v-model="import_seed_phrase" class="glass-input text-sm block w-full p-2.5">
          </div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" true-value="1" false-value="0" v-model="wallet_load_on_startup" class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-white dark:text-white">Load wallet on startup</span>
          </label>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center px-6 py-4 space-x-3 border-t border-white/[0.08] rounded-b">
          <button :disabled="new_wallet_name==''" type="button" id="confirmButton" class="text-white font-semibold rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">Create</button>

        </div>
      </div>
    </div>
  </div>

  <div id="modal-1" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-xl shadow-2xl glass-modal">
        <!-- Modal header -->
        <div class="flex items-start justify-between px-6 py-5 border-b border-white/[0.10] rounded-t" style="background: linear-gradient(90deg, rgba(124,58,237,0.10) 0%, rgba(59,130,246,0.05) 100%);">
          <h3 class="text-lg font-semibold tracking-tight text-white">
            Wallet Seed
          </h3>
          <button id="closeButton-1" data-modal-hide="modal" type="button" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div class="flex justify-center">
            <img class="h-auto max-w-[240px] rounded-lg" src="../assets/seed-phrase.png" alt="Seed Phrase">
          </div>
          <p class="font-medium text-white/85">A seed is a unique phrase that is generated for your wallet, and you can back up this seed and restore it to your wallet in the future. Keep the following seed phrase safe and do not share it with anyone.</p>
          <div class="rounded-lg p-3 border border-white/[0.16]" style="background: rgba(255,255,255,0.06);">
            <pre class="block text-sm font-mono text-white whitespace-pre-wrap break-all">{{blsctseed}}</pre>
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center px-6 py-4 space-x-3 border-t border-white/[0.08] rounded-b">
          <button type="button" id="confirmButton-1" data-modal-hide="modal" class="text-white font-semibold rounded-lg text-sm px-5 py-2.5 text-center transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">Copy</button>

        </div>
      </div>
    </div>
  </div>
  
  <div id="modal-2" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-xl shadow-2xl glass-modal">
        <!-- Modal header -->
        <div class="flex items-start justify-between px-6 py-5 border-b border-white/[0.10] rounded-t" style="background: linear-gradient(90deg, rgba(124,58,237,0.10) 0%, rgba(59,130,246,0.05) 100%);">
          <h3 class="text-lg font-semibold tracking-tight text-white">
            Audit Key
          </h3>
          <button id="closeButton-2" data-modal-hide="modal" type="button" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div class="flex justify-center">
            <img class="h-auto max-w-[240px] rounded-lg" src="../assets/audit-key.jpg" alt="Audit Key">
          </div>
          <p class="font-medium text-white/85">Transactions made in your wallet can only be viewed by you. The audit key allows your transaction history in the wallet to be shared with 3rd parties. The 3rd party cannot perform any transactions related to your wallet.</p>
          <div class="rounded-lg p-3 border border-white/[0.16]" style="background: rgba(255,255,255,0.06);">
            <div class="text-sm font-mono text-white" style="width:100%;height:auto;display:inline-block;overflow-wrap: break-word;">{{blsctauditkey}}</div>
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center px-6 py-4 space-x-3 border-t border-white/[0.08] rounded-b">
          <button type="button" id="confirmButton-2" data-modal-hide="modal" class="text-white font-semibold rounded-lg text-sm px-5 py-2.5 text-center transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">Copy</button>

        </div>
      </div>
    </div>
  </div>

  <!-- Rescan Modal (Vue-native) -->
  <transition name="fade">
    <div v-if="showRescanModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="relative rounded-xl shadow-2xl glass-modal w-full max-w-lg mx-4 overflow-hidden">
        <div class="flex items-start justify-between px-6 py-5 border-b border-white/[0.10]" style="background: linear-gradient(90deg, rgba(124,58,237,0.10) 0%, rgba(59,130,246,0.05) 100%);">
          <h3 class="text-lg font-semibold tracking-tight text-white">Rescan Blockchain</h3>
          <button @click="showRescanModal = false" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <p class="text-sm text-white/60">Rescan the local blockchain for wallet related transactions.</p>
          <div>
            <label class="block mb-2 text-sm font-medium text-white/80">Start Height</label>
            <input type="number" v-model="scan_start_height" class="glass-input text-sm block w-full p-2.5">
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-white/80">Stop Height</label>
            <input type="number" v-model="scan_stop_height" class="glass-input text-sm block w-full p-2.5">
          </div>
        </div>
        <div class="flex gap-3 px-6 py-4 border-t border-white/[0.08]">
          <button @click="showRescanModal = false" class="flex-1 px-4 py-2.5 rounded-lg text-sm glass-btn-secondary transition duration-200">Cancel</button>
          <button @click="rescanblockchain(); showRescanModal = false" :disabled="scan_start_height === ''" class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">Rescan</button>
        </div>
      </div>
    </div>
  </transition>
  <div class="h-full w-full text-white bg-transparent">
    <div class="flex items-center gap-2 px-4 pt-3 mb-5">
      <button id="button" type="button" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Wallet
      </button>
      <template v-if="all_wallets && all_wallets.wallets && all_wallets.wallets.length > 0">
        <button v-on:click="getblsctseed()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg glass-btn-secondary focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
          Wallet Seed
        </button>
        <button v-on:click="getblsctauditkey()" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg glass-btn-secondary focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Audit Key
        </button>
        <button @click="openRescanModal" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg glass-btn-secondary focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Rescan
        </button>
        <button v-if="is_wallet_loaded && wallet_info && (wallet_info.scanning === true || typeof wallet_info.scanning === 'object')" @click="abortrescan" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
          </svg>
          Abort Rescan
        </button>
      </template>
    </div>
<div class="w-full p-4 bg-transparent" v-if="all_wallets && all_wallets.wallets && all_wallets.wallets.length > 0">
  <h3>Wallet Info</h3>
  <div class="flex flex-wrap gap-1.5 mt-4" v-if="is_wallet_loaded&&wallet_info">
    <span v-if="wallet_info.private_keys_enabled" class="inline-flex items-center gap-1 bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-xs font-medium px-2 py-0.5 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>
      Private Keys Enabled
    </span>
    <span v-else class="inline-flex items-center gap-1 bg-yellow-900/60 text-yellow-300 border border-yellow-500/30 text-xs font-medium px-2 py-0.5 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>
      Private Keys Disabled
    </span>

    <template v-if="typeof wallet_info.scanning=='boolean' && wallet_info.scanning">
      <span class="inline-flex items-center gap-1 bg-green-900/60 text-green-300 border border-green-500/30 text-xs font-medium px-2 py-0.5 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        Scanning...
      </span>
    </template>

    <template v-if="typeof wallet_info.scanning=='object'">
      <span class="inline-flex items-center gap-1 bg-blue-900/60 text-blue-300 border border-blue-500/30 text-xs font-medium px-2 py-0.5 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        Scanning...
      </span>
      <span v-if="wallet_info.scanning.duration" class="inline-flex items-center gap-1 bg-green-900/60 text-green-300 border border-green-500/30 text-xs font-medium px-2 py-0.5 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        {{wallet_info.scanning.duration}}s
      </span>
      <span v-if="wallet_info.scanning.progress" class="inline-flex items-center gap-1 bg-yellow-900/60 text-yellow-300 border border-yellow-500/30 text-xs font-medium px-2 py-0.5 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
        {{(wallet_info.scanning.progress*100).toFixed(2)}}%
      </span>
    </template>
  </div>
  <!--<span v-if="wallet_info&&wallet_info.scanning==true" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Scanning...</span>
    <span v-else class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Not scanning</span>!-->
    <!--<pre class="text-white dark:text-white" v-if="is_wallet_loaded&&wallet_info">{{wallet_info}}</pre>!-->
  </div>

  <div class="p-4 overflow-auto text-white bg-transparent">

<!--<div class="w-48 text-white dark:text-white" v-if="loaded_wallets&&Object.keys(loaded_wallets).length>0">
<p>Loaded wallet : {{Object.keys(loaded_wallets).length}}</p>
<button v-for="wallet in loaded_wallets" type="button" class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-white/[0.18] bg-white/[0.12] hover:bg-white/[0.18] text-white transition-colors">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
</svg>
&nbsp;{{wallet}}
</button>
</div>
<div v-else>
<p>No wallet loaded.</p>
</div>!-->

<div class="mt-1 space-y-4 text-white bg-transparent" v-if="all_wallets&&Object.keys(all_wallets.wallets).length>0">
  <div>
    <p class="text-xs text-white/50 mb-2">Toggle to load or unload a wallet</p>
    <div class="space-y-2">
      <label class="relative inline-flex items-center cursor-pointer" v-for="wallet in all_wallets.wallets">
        <input type="checkbox" id="wallet_name" value="" class="sr-only peer" v-model="wallet.checked" v-on:change="manage_wallet(wallet)">
        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span class="ms-2 text-sm text-white/80">{{wallet.name}}</span>
      </label>
    </div>
  </div>

  <div>
    <p class="text-xs text-white/50 mb-2">Active wallet</p>
    <div class="space-y-1.5">
      <label class="flex items-center gap-2 cursor-pointer" v-for="wallet in all_wallets.wallets">
        <input type="radio" name="hs-default-radio" class="shrink-0 border-gray-600 rounded-full text-blue-600 focus:ring-blue-500 bg-gray-800 checked:bg-blue-500 checked:border-blue-500" :id="'lr_'+wallet.name" v-bind:value="wallet.name" v-model="active_wallet" v-on:change="set_active_wallet(wallet)">
        <span :for="'lr_'+wallet.name" class="text-sm text-white/80">{{wallet.name}}</span>
      </label>
    </div>
  </div>
</div>
<div v-else class="flex flex-col items-center justify-center py-16 px-6">
  <div class="flex items-center justify-center w-20 h-20 rounded-full glass-card mb-6">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-white/70">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
    </svg>
  </div>
  <h2 class="text-lg font-semibold text-white mb-2">No Wallets Found</h2>
  <p class="text-sm text-white/70 text-center max-w-xs">You haven't created any wallets yet. Click <span class="text-white font-medium">Create Wallet</span> to get started.</p>
</div>

</div>
</div>

</template>

<script>
  import { initFlowbite } from 'flowbite';
  import Swal from 'sweetalert2';
  import '@sweetalert2/theme-dark/dark.scss';
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  })
  export default {
    data() {
      return {
        loaded_wallets:undefined,
        new_wallet_name: undefined,
        all_wallets: undefined,
        active_wallet: undefined,
        wallet_info:undefined,
        is_wallet_loaded:false,
        blsctseed:'',
        blsctauditkey:'',
        wallet_type_id:1,
        import_seed_phrase:'',
        wallet_load_on_startup:1,
        scan_start_height:0,
        scan_stop_height:0,
        showRescanModal: false
      }
    },
    methods:{
      set_active_wallet:function(wallet)
      {
        this.active_wallet=wallet.name;
        this.client.wallet=wallet.name;
        this.$store.commit('set_active_wallet',wallet.name);
        console.log(this.client);
      },
      listwallets:function()
      {
        let vm=this;
        this.client.command('listwallets').then((r) =>
        {
          vm.loaded_wallets=r;
          console.log("All wallets");
          console.log(vm.all_wallets);
          console.log("Loaded wallets");
          console.log(vm.loaded_wallets);
          if (vm.loaded_wallets.length==0)
          {
            Toast.fire({
              theme:'dark',
              icon: 'info',
              title: 'There is no active wallet!',
            });
            this.active_wallet=undefined;
            this.$store.commit('set_active_wallet',undefined);
          }
          vm.all_wallets.wallets.forEach((wallet) =>
          {
            console.log(wallet.name);
            console.log("is wallet loaded -> " + wallet.name + " : " + vm.loaded_wallets.includes(wallet.name));
            if (vm.loaded_wallets.includes(wallet.name)) wallet.checked=true;
          });
        });
      },
      listwalletdir:function()
      {
        let vm=this;
        this.client.command('listwalletdir').then((r) =>
        {
          vm.all_wallets=r;
          vm.listwallets();
        });
      },
      getwalletinfo:function()
      {
        let vm=this;
        this.client.command('getwalletinfo').then((r) =>
        {
          vm.is_wallet_loaded=true;
          vm.wallet_info=r;
        })
        .catch((r) =>
        {
          vm.is_wallet_loaded=false;
          vm.wallet_info=undefined;
          console.log(r);
        });
      },
      manage_wallet:function(wallet)
      {
        let vm=this;
        if (wallet.checked)
        {
          this.client.command([{ method: "loadwallet", parameters: [wallet.name] }]).then((r) => 
          {
            console.log("loading wallet -> " + wallet.name);
            console.log(r);
            vm.listwallets();
            if (!this.active_wallet)
            {
              vm.set_active_wallet(wallet);
            }
          });
        }
        else if (!wallet.checked)
        {
          let vm=this;
          if (this.$store.state.active_wallet==wallet.name && this.$store.state.active_wallet.is_staking_active)
          {
            console.log("Stopping staking process...");
            ipcRenderer.invoke('stop-staker', this.$store.state.staker_pid);
          }
          this.client.command([{ method: "unloadwallet", parameters: [wallet.name] }]).then((r) => 
          {
            console.log("unloading wallet -> " + wallet.name);
            console.log(r);
            vm.listwallets();
          });
        }
      },
      abortrescan: function() {
        this.client.command([{ method: "abortrescan" }]).then((r) => {
          if (r[0] === true) {
            Toast.fire({
              theme: 'dark',
              icon: 'success',
              title: 'Rescan aborted',
            });
          } else {
            Toast.fire({
              theme: 'dark',
              icon: 'info',
              title: 'No active rescan to abort',
            });
          }
        }).catch(() => {
          Toast.fire({
            theme: 'dark',
            icon: 'error',
            title: 'Failed to abort rescan',
          });
        });
      },
      openRescanModal: function() {
        this.showRescanModal = true;
        this.client.command([{ method: "getblockcount" }]).then((r) => {
          if (r[0] && typeof r[0] === 'number') {
            this.scan_stop_height = r[0];
          }
        });
      },
      rescanblockchain:function()
      {
        let vm=this;
        this.client.command([{ method: "rescanblockchain", parameters: {"start_height":vm.scan_start_height,"stop_height":vm.scan_stop_height} }]).then((r) => 
        {
          if (r[0].code)
          {
            console.log("RpcError");
            Swal.fire({
              theme:'dark',
              title: 'Error!',
              text: r[0].message,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
          else
          {
            Toast.fire({
              theme:'dark',
              icon: 'success',
              title: "Blockchain rescan completed",
            });
          }
        });
      },
      getblsctseed:function()
      {
        let vm=this;
        this.client.command([{ method: "getblsctseed", parameters: {} }]).then((r) => 
        {
          if (r[0].code)
          {
            console.log("RpcError");
            Swal.fire({
              theme:'dark',
              title: 'Error!',
              text: r[0].message,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
          else
          {
            vm.blsctseed=r[0];
            let $modalElement = document.querySelector('#modal-1');
            let $confirmButton = document.querySelector('#confirmButton-1');
            let $closeButton = document.querySelector('#closeButton-1');
            let modalOptions = {
              backdropClasses: 'bg-black/60 backdrop-blur-sm fixed inset-0 z-40'
            }
            if ($modalElement)
            {
              let modal = new Modal($modalElement, modalOptions);
              modal.toggle();
              $confirmButton.addEventListener('click', () => 
              {
                this.$copyText(vm.blsctseed);
                Toast.fire({
                  theme:'dark',
                  icon: 'success',
                  title: 'Copied',
                });
                modal.hide();
              });
              $closeButton.addEventListener('click', () => {
                modal.hide();
              });
            }
          }
        });
      },
      getblsctauditkey:function()
      {
        let vm=this;
        this.client.command([{ method: "getblsctauditkey", parameters: {} }]).then((r) => 
        {
          if (r[0].code)
          {
            console.log("RpcError");
            Swal.fire({
              theme:'dark',
              title: 'Error!',
              text: r[0].message,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
          else
          {
            vm.blsctauditkey=r[0];
            let $modalElement = document.querySelector('#modal-2');
            let $confirmButton = document.querySelector('#confirmButton-2');
            let $closeButton = document.querySelector('#closeButton-2');
            let modalOptions = {
              backdropClasses: 'bg-black/60 backdrop-blur-sm fixed inset-0 z-40'
            }
            if ($modalElement)
            {
              let modal = new Modal($modalElement, modalOptions);
              modal.toggle();
              $confirmButton.addEventListener('click', () => 
              {
                this.$copyText(vm.blsctauditkey);
                Toast.fire({
                  theme:'dark',
                  icon: 'success',
                  title: 'Copied',
                });
                modal.hide();
              });
              $closeButton.addEventListener('click', () => {
                modal.hide();
              });
            }
          }
        });
      },
      create_wallet:function()
      {
        let vm=this;
        console.log("Creating wallet :" + this.new_wallet_name);
        console.log("Seed :" + this.import_seed_phrase);
        const isFirstWallet = !vm.all_wallets || Object.keys(vm.all_wallets.wallets).length === 0;
        let parameters={};
        if (this.wallet_type_id==1) parameters={"wallet_name":this.new_wallet_name,"blsct":true,load_on_startup:(vm.wallet_load_on_startup=="1"?true:false)};
        if (this.wallet_type_id==2) parameters={"wallet_name":this.new_wallet_name,"blsct":true,"seed":this.import_seed_phrase,load_on_startup:(vm.wallet_load_on_startup=="1"?true:false)};
        this.client.command([{ method: "createwallet", parameters: parameters }]).then((r) =>
        {
          vm.new_wallet_name="";
          console.log(r);
          if (r[0].code)
          {
            console.log("RpcError");
            Swal.fire({
              theme:'dark',
              title: 'Error!',
              text: r[0].message,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
          else
          {
           if (isFirstWallet)
           {
             vm.set_active_wallet({ name: r[0].name });
           }
           vm.listwalletdir();
           Swal.fire({
            theme:'dark',
            title: 'Success!',
            text: "Wallet '" + r[0].name + "' successfully created.",
            icon: 'success',
            confirmButtonText: 'OK'
          })
         }
       });
      }
    },
    mounted() {
      this.active_wallet=this.client.wallet;
      this.listwalletdir();
      this.getwalletinfo();
      this.timer = setInterval(() => 
      {
        this.getwalletinfo();
      },
      1000);
      initFlowbite();
      const $buttonElement = document.querySelector('#button');
      const $modalElement = document.querySelector('#modal');
      const $confirmButton = document.querySelector('#confirmButton');
      const $closeButton = document.querySelector('#closeButton');

      const modalOptions = {
        backdropClasses: 'bg-black/60 backdrop-blur-sm fixed inset-0 z-40',
        closable: false
      }

      if ($modalElement)
      {
        const modal = new Modal($modalElement, modalOptions);
        $buttonElement.addEventListener('click', () => {
          modal.toggle();
          document.getElementById("wallet_name").focus();
        });
        $confirmButton.addEventListener('click', () => 
        {
          modal.hide();
          if (this.new_wallet_name)
          {
            console.log("hide");
            console.log("creating wallet -> " + this.new_wallet_name);
            this.create_wallet();
          }
        });
        $closeButton.addEventListener('click', () => {
          modal.hide();
          this.new_wallet_name="";
        });
      }

    },
    beforeUnmount()
    {
      clearInterval(this.timer);
    }
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.97); }
</style>
