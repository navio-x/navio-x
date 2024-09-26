<template>
  <div id="modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-700 border-zinc-700">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            Create Wallet
          </h3>
          <button id="closeButton" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
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
              <label for="helper-radio-1" class="font-medium text-white dark:text-white">Create wallet</label>
              <p id="helper-radio-text" class="text-md font-normal text-gray-500 dark:text-gray-600">Create new empty wallet</p>
            </div>
            <div class="flex items-center h-5">
              <input id="helper-radio-2" aria-describedby="helper-radio-text" type="radio" value="2" v-model="wallet_type_id" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div class="ms-2 text-md">
              <label for="helper-radio-2" class="font-medium text-white dark:text-white">Import Wallet</label>
              <p id="helper-radio-text" class="text-md font-normal text-gray-500 dark:text-gray-600">Import existing wallet with seed phrase or audit key</p>
            </div>
          </div>

          <div>
            <label for="wallet_name" class="block mb-2 text-sm font-medium dark:text-white text-white">Wallet Name</label>
            <input type="text" autofocus id="wallet_name" v-model="new_wallet_name" class="bg-zinc-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
          <div v-if="wallet_type_id==2">
            <label for="import_seed_phrase" class="block mb-2 text-sm font-medium dark:text-white text-white">Wallet Seed Phrase or Audit Key</label>
            <input type="text" autofocus id="import_seed_phrase" v-model="import_seed_phrase" class="bg-zinc-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" true-value="1" false-value="0" v-model="wallet_load_on_startup" class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-white dark:text-white">Load wallet on startup</span>
          </label>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-zinc-700 rounded-b dark:border-zinc-700">
          <button :disabled="new_wallet_name==''" type="button" id="confirmButton" data-modal-hide="modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-800">Create</button>

        </div>
      </div>
    </div>
  </div>

  <div id="modal-1" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-700 border-zinc-700">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            Wallet Seed
          </h3>
          <button id="closeButton-1" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <center>
            <img class="h-auto max-w-lg rounded-lg" src="../assets/seed-phrase.png" alt="Seed Phrase">
          </center>
          <p class="font-medium dark:text-white text-white">A seed is a unique phrase that is generated for your wallet, and you can back up this seed and restore it to your wallet in the future. Keep the following seed phrase safe and do not share it with anyone.</p>
          <div>
            <pre class="block mb-2 text-sm font-medium dark:text-white text-white">{{blsctseed}}</pre>
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-zinc-700 rounded-b dark:border-zinc-700">
          <button type="button" id="confirmButton-1" data-modal-hide="modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-800">Copy</button>

        </div>
      </div>
    </div>
  </div>
  
  <div id="modal-2" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-700 border-zinc-700">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            Audit Key
          </h3>
          <button id="closeButton-2" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <center>
            <img class="h-auto max-w-lg rounded-lg" src="../assets/audit-key.jpg" alt="Audit Key">
          </center>
          <p class="font-medium dark:text-white text-white">Transactions made in your wallet can only be viewed by you. The audit key allows your transaction history in the wallet to be shared with 3rd parties. The 3rd party cannot perform any transactions related to your wallet.</p>
          <div>
            <div class="mb-2 text-sm font-medium dark:text-white text-white" style="width:100%;height:auto;display:inline-block;overflow-wrap: break-word;">{{blsctauditkey}}</div>
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-zinc-700 rounded-b dark:border-zinc-700">
          <button type="button" id="confirmButton-2" data-modal-hide="modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-800">Copy</button>

        </div>
      </div>
    </div>
  </div>

  <div id="modal-3" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow dark:bg-zinc-800 bg-zinc-800">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-zinc-700 border-zinc-700">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">
            Rescan Blockchain
          </h3>
          <button id="closeButton-3" data-modal-hide="modal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <p class="font-medium dark:text-white text-white">Rescan the local blockchain for wallet related transactions.</p>
          <div>
            <label for="scan_start_height" class="block mb-2 text-sm font-medium dark:text-white text-white">Start Height</label>
            <input type="number" autofocus id="scan_start_height" v-model="scan_start_height" class="bg-zinc-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
          <div>
            <label for="scan_stop_height" class="block mb-2 text-sm font-medium dark:text-white text-white">Stop Height</label>
            <input type="number" autofocus id="scan_stop_height" v-model="scan_stop_height" class="bg-zinc-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-zinc-700 rounded-b dark:border-zinc-700">
          <button :disabled="scan_start_height==''" type="button" id="confirmButton-3" data-modal-hide="modal" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-800">Rescan</button>

        </div>
      </div>
    </div>
  </div>
  <div class="h-full w-full text-white bg-zinc-900">
    <div class="w-full mb-5">
      <h3 class="p-4">Wallets</h3>
      <button id="button" data-modal-toggle="modal" data-modal-target="modal" type="button" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>&nbsp;Create Wallet
      </button>
      <button v-on:click="getblsctseed()" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
      </svg>
      &nbsp;Wallet Seed
    </button>
    <button v-on:click="getblsctauditkey()" class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
    &nbsp;Audit Key
  </button>
  <button id="button-rescan-blockchain"  class="inline-flex justify-center items-center ml-4 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
  &nbsp;Rescan Blockchain
</button>
</div>
<div class="w-full p-4 bg-zinc-900">
  <h3>Wallet Info</h3>
  <div class="flex mt-5" v-if="is_wallet_loaded&&wallet_info">
    <div>
      <span v-if="wallet_info.private_keys_enabled" class="inline-flex justify-center items-center bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
      </svg>
    &nbsp;Private Keys Enabled</span>
    <span v-else class="inline-flex justify-center items-center bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
  &nbsp;Private Keys Disabled</span>
</div>
<div v-if="typeof wallet_info.scanning=='boolean'">
  <span v-if="wallet_info.scanning" class="inline-flex justify-center items-center bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
&nbsp;Scanning...</span>
<span v-else class="inline-flex justify-center items-center bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>&nbsp;Not scanning</span>
</div>
<div v-if="typeof wallet_info.scanning=='object'">
  <span class="inline-flex justify-center items-center bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>&nbsp;Scanning...</span>
  <span v-if="wallet_info.scanning.duration" class="inline-flex justify-center items-center bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
&nbsp;{{wallet_info.scanning.duration}} seconds</span>
</div>
</div>
  <!--<span v-if="wallet_info&&wallet_info.scanning==true" class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Scanning...</span>
    <span v-else class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Not scanning</span>!-->
    <!--<pre class="text-white dark:text-white" v-if="is_wallet_loaded&&wallet_info">{{wallet_info}}</pre>!-->
  </div>

  <div class="p-4 overflow-auto text-white bg-zinc-900">

<!--<div class="w-48 text-white dark:text-white" v-if="loaded_wallets&&Object.keys(loaded_wallets).length>0">
<p>Loaded wallet : {{Object.keys(loaded_wallets).length}}</p>
<button v-for="wallet in loaded_wallets" type="button" class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 bg-zinc-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
</svg>
&nbsp;{{wallet}}
</button>
</div>
<div v-else>
<p>No wallet loaded.</p>
</div>!-->

<p v-if="all_wallets&&Object.keys(all_wallets.wallets).length>0">Click on the wallet you want to load or unload</p>
<div class="w-48 mt-3 space-y-3 text-white dark:text-white bg-zinc-900" v-if="all_wallets&&Object.keys(all_wallets.wallets).length>0">
  <!--<p>All wallets : {{Object.keys(all_wallets.wallets).length}}</p>!-->
  <label class="w-full relative inline-flex items-center cursor-pointer" v-for="wallet in all_wallets.wallets">
    <input type="checkbox" id="wallet_name" value="" class="sr-only peer" v-model="wallet.checked" v-on:change="manage_wallet(wallet)">
    <div class="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 border-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    <span class="ms-3 text-sm font-medium dark:text-gray-300 text-gray-300">{{wallet.name}}</span>
  </label>

  <h3 class="mb-4 font-semibold dark:text-white text-white">Change Active Wallet : </h3>
  <div class="flex" v-for="wallet in all_wallets.wallets">
    <input type="radio" name="hs-default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-800 dark:bg-gray-800 dark:border-gray-700 border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" :id="'lr_'+wallet.name" v-bind:value="wallet.name" v-model="active_wallet" v-on:change="set_active_wallet(wallet)">
    <label :for="'lr_'+wallet.name" class="text-sm ms-2 dark:text-gray-400 text-gray-400">{{wallet.name}}</label>
  </div>


</div>
<div v-else class="dark:text-gray-400 text-gray-400 bg-zinc-900">
  <p>No available wallet found.</p>
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
        scan_stop_height:0
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
        });;
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
      rescanblockchain:function()
      {
        let vm=this;
        this.client.command([{ method: "rescanblockchain", parameters: {"start_height":vm.scan_start_height,"stop_height":vm.scan_stop_height} }]).then((r) => 
        {
          if (r[0].code)
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
            Toast.fire({
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
              backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
            }
            if ($modalElement)
            {
              let modal = new Modal($modalElement, modalOptions);
              modal.toggle();
              $confirmButton.addEventListener('click', () => 
              {
                this.$copyText(vm.blsctseed);
                Toast.fire({
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
              backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
            }
            if ($modalElement)
            {
              let modal = new Modal($modalElement, modalOptions);
              modal.toggle();
              $confirmButton.addEventListener('click', () => 
              {
                this.$copyText(vm.blsctauditkey);
                Toast.fire({
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
              title: 'Error!',
              text: r[0].message,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
          else
          {
           vm.listwalletdir();
           Swal.fire({
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
      5000);
      initFlowbite();
      const $buttonElement = document.querySelector('#button');
      const $modalElement = document.querySelector('#modal');
      const $confirmButton = document.querySelector('#confirmButton');
      const $closeButton = document.querySelector('#closeButton');

      const modalOptions = {
        backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
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
      let $buttonElement3 = document.querySelector('#button-rescan-blockchain');
      let $modalElement3 = document.querySelector('#modal-3');
      let $confirmButton3 = document.querySelector('#confirmButton-3');
      let $closeButton3 = document.querySelector('#closeButton-3');
      let modalOptions3 = {
        backdropClasses: 'bg-zinc-900/50 dark:bg-zinc-900/80 fixed inset-0 z-40'
      }
      if ($modalElement3)
      {
        let modal3 = new Modal($modalElement3, modalOptions3);
        $buttonElement3.addEventListener('click', () => {
          modal3.toggle();
        });
        $confirmButton3.addEventListener('click', () => 
        {
          console.log(this.scan_start_height);
          console.log(this.scan_stop_height);
          this.rescanblockchain();
          modal3.hide();
        });
        $closeButton3.addEventListener('click', () => {
          modal3.hide();
        });
      }

    },
    beforeUnmount()
    {
      clearInterval(this.timer);
    }
  }
</script>

