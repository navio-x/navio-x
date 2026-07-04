<template>
    <div class="h-full bg-transparent text-white">
        <div v-if="$store.state.active_wallet && !ready" class="flex flex-col items-center justify-center h-full pb-16 px-6">
            <div class="flex items-center justify-center w-20 h-20 rounded-full glass-card mb-6">
                <svg class="w-10 h-10 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
            </div>
            <h2 class="text-lg font-semibold text-white mb-2">Loading Staking Data</h2>
            <p class="text-sm text-white/80 text-center max-w-xs">Fetching transaction history from the wallet. This may take a moment.</p>
        </div>
        <div v-else-if="$store.state.active_wallet && ready">

            <!-- Intro (compact) -->
            <div class="px-3 pt-3 pb-3">
                <div class="flex items-start gap-2 px-3 py-2 rounded-lg glass-card">
                    <svg class="flex-shrink-0 w-4 h-4 mt-0.5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p class="text-sm text-gray-200">Minimum 10,000 NAV required. Newly staked coins become eligible after 100 blocks.</p>
                </div>
            </div>

            <!-- Pending staked commitment balance (info only) -->
            <div v-if="pendingStakedBalance" class="px-3 pb-3">
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg glass-card">
                    <svg class="flex-shrink-0 w-4 h-4 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p class="text-sm text-gray-200">
                        <span class="text-white/90 font-semibold">{{ formatNumbers(pendingStakedBalance) }} NAV</span>
                        <span class="text-white/60"> pending staked commitment (awaiting confirmation).</span>
                    </p>
                </div>
            </div>

            <!-- No commitment guidance -->
            <div v-if="!staked_commitments || Object.keys(staked_commitments).length === 0" class="px-3 pb-3">
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg glass-card">
                    <svg class="flex-shrink-0 w-4 h-4 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p class="text-sm text-gray-200">No active staking commitment yet. Lock coins in the section below, then click Start Staking — a new commitment can take a few minutes to become active.</p>
                </div>
            </div>

            <!-- Status row: button | commitments | staker status -->
            <div class="flex items-stretch gap-3 px-3 pb-3">

                <!-- Start / Stop button -->
                <button v-if="!$store.state.is_staking_active" v-on:click="start_staking()"
                    :title="isManualConnection ? 'Manual connection detected — click for instructions' : ''"
                    :class="isManualConnection
                        ? 'text-blue-400/50 bg-blue-500/5 border-blue-500/15 cursor-not-allowed'
                        : 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-300'"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border rounded-lg focus:outline-none whitespace-nowrap transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                    Start Staking
                </button>
                <button v-if="$store.state.is_staking_active" v-on:click="stop_staking()"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 hover:text-red-300 focus:outline-none whitespace-nowrap transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
                    </svg>
                    Stop Staking
                </button>

                <!-- Commitments -->
                <div class="flex-1 flex items-center flex-wrap gap-2 px-3 py-2 rounded-lg glass-card min-w-0">
                    <template v-if="staked_commitments && Object.keys(staked_commitments).length > 0">
                        <div v-for="(commitment, index) in staked_commitments" :key="index"
                            class="inline-flex items-center gap-1.5 text-sm font-medium bg-purple-500/20 border border-purple-500/30 rounded-full px-2.5 py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-purple-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            {{ commitment.amount }} NAV
                        </div>
                    </template>
                    <span v-else class="text-sm text-white/70">No commitment found.</span>
                </div>

                <!-- Staker status -->
                <div class="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass-card whitespace-nowrap"
                    :class="$store.state.is_staking_active ? 'text-green-400' : 'text-orange-400'">
                    <span class="w-2 h-2 rounded-full flex-shrink-0"
                        :class="$store.state.is_staking_active ? 'bg-green-400 animate-pulse' : 'bg-orange-400'"></span>
                    <span class="text-sm font-medium">
                        {{ $store.state.is_staking_active ? `Running · ${$store.state.staker_wallet}` : 'Not running' }}
                    </span>
                    <span v-if="$store.state.is_staking_active && $store.state.staking_auto_started"
                        class="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-violet-300 bg-violet-500/15 border border-violet-500/30 rounded-full px-2 py-0.5 ml-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Auto Started
                    </span>
                </div>

            </div>

<div class="flex gap-4 p-3">

  <!-- Lock group -->
  <div class="flex-1">
    <label class="stk-label">NAV to Lock</label>
    <div class="stk-row">
      <input v-model="amount_lock" type="number" min="0" placeholder="0.00" class="stk-input">
      <button type="button" :disabled="!amount_lock" @click="requireUnlock(lock_coins)" class="stk-btn stk-lock">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        Lock Coins
      </button>
    </div>
  </div>

  <!-- Unlock group -->
  <div class="flex-1">
    <div class="flex items-center justify-between mb-1.5">
      <label class="stk-label" style="margin-bottom:0">NAV to Unlock</label>
      <button v-if="totalStakedAmount > 0" type="button" @click="amount_unlock = totalStakedAmount"
        class="text-xs text-violet-400 hover:text-violet-300 transition-colors focus:outline-none">
        Use All
      </button>
    </div>
    <div class="stk-row">
      <input v-model="amount_unlock" type="number" min="0" placeholder="0.00" class="stk-input">
      <button type="button" :disabled="!amount_unlock" @click="requireUnlock(unlock_coins)" class="stk-btn stk-unlock">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        Unlock Coins
      </button>
    </div>
  </div>

</div>


<div class="p-5">
    <apexchart class="w-full" height="240" :options="options" :series="series"></apexchart>
</div>
</div>
<NoWalletSelected v-else />
</div>

<WalletUnlock
  v-if="showUnlockModal"
  @unlocked="onWalletUnlocked"
  @cancel="showUnlockModal = false; pendingAction = null"
/>

<transition name="fade" appear>
  <div v-if="showManualStakingModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showManualStakingModal = false">
    <div class="relative text-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl border border-white/[0.18]"
      style="background: linear-gradient(160deg, rgba(40,30,78,0.98) 0%, rgba(24,30,62,0.98) 100%); backdrop-filter: blur(24px);">

      <button @click="showManualStakingModal = false" class="absolute top-3 right-3 text-white/70 hover:text-white/95 transition-colors focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="flex items-center gap-3 mb-4">
        <div class="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style="background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.30);">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3M3.375 4.5h17.25a1.125 1.125 0 0 1 1.125 1.125v13.5a1.125 1.125 0 0 1-1.125 1.125H3.375a1.125 1.125 0 0 1-1.125-1.125V5.625A1.125 1.125 0 0 1 3.375 4.5Z" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold">Manual Staking Required</h2>
          <p class="text-xs text-white/50 mt-0.5">You're connected to a manually started node</p>
        </div>
      </div>

      <p class="text-sm text-white/70 mb-3">
        Navio-X is connected to a daemon you started manually, so staking can't be launched from inside the app.
        Start the staker yourself by running the following command in a terminal on the machine running the daemon
        ({{ isWindows ? 'Windows, Command Prompt or PowerShell' : 'Linux/macOS' }}):
      </p>

      <div class="relative rounded-lg border border-white/[0.15] bg-black/40 pl-3 pr-9 py-2.5 mb-1 font-mono text-xs text-emerald-300 break-all">
        {{ manualStakingCommand }}
        <button @click="copyManualCommand" title="Copy to clipboard"
          class="absolute top-2 right-2 text-white/50 hover:text-white/90 transition-colors focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
        </button>
      </div>
      <p v-if="manualCommandCopied" class="text-xs text-emerald-400 mb-3">Copied to clipboard.</p>

      <p class="text-xs text-white/40 mt-2">
        <template v-if="isWindows">
          This opens the staker in its own window titled <code>navio-staker</code>. Leave that window open — closing it stops the staker.
        </template>
        <template v-else>
          <code>screen</code> keeps the staker running in the background after you close the terminal. Reattach anytime with <code>screen -r navio-staker</code>.
        </template>
      </p>

      <div class="flex gap-3 mt-5">
        <button @click="showManualStakingModal = false"
          class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition duration-200"
          style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
          Got it
        </button>
      </div>

    </div>
  </div>
</transition>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import ApexCharts from 'apexcharts';
    import Swal from 'sweetalert2';
    import '@sweetalert2/theme-dark/dark.scss';
    import NoWalletSelected from '../components/NoWalletSelected.vue';
    import WalletUnlock from '../components/WalletUnlock.vue';
    export default {
        components: { NoWalletSelected, WalletUnlock },
        data() {
            return {
                staked_commitments:undefined,
                amount_lock:0,
                amount_unlock:0,
                options: undefined,
                series: undefined,
                txs:[],
                ready: false,
                showUnlockModal: false,
                pendingAction: null,
                showManualStakingModal: false,
                manualCommandCopied: false,
                balance: undefined,
                binDir: ''
            }
        },
        computed: {
            totalStakedAmount() {
                if (!this.staked_commitments) return 0;
                return Object.values(this.staked_commitments).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
            },
            isManualConnection() {
                return !this.$store.state.is_daemon_auto_started;
            },
            isWindows() {
                return process.platform === 'win32';
            },
            manualStakingCommand() {
                let vm=this;
                const dir = vm.binDir || '<navio-x bin folder>';
                const networkFlag = vm.$store.state.network === 'testnet' ? `-${vm.$store.state.network} ` : '';
                const args = `${networkFlag}-wallet=${vm.$store.state.active_wallet} -rpcuser=${vm.$store.state.rpcuser} -rpcpassword=${vm.$store.state.rpcpassword}`;
                if (vm.isWindows) {
                    return `cd /d "${dir}" && start "navio-staker" navio-staker.exe ${args}`;
                }
                return `cd "${dir}" && screen -S navio-staker ./navio-staker ${args}`;
            },
            pendingStakedBalance() {
                if (!this.balance || !this.balance.mine) return 0;
                return parseFloat(this.balance.mine.pending_staked_commitment_balance) || 0;
            }
        },
        methods:{
            requireUnlock(action) {
                this.client.command([{ method: 'getwalletinfo' }]).then((r) => {
                    const info = r[0];
                    if (info && 'unlocked_until' in info && info.unlocked_until === 0) {
                        this.pendingAction = action;
                        this.showUnlockModal = true;
                    } else {
                        action();
                    }
                }).catch(() => action());
            },
            onWalletUnlocked(passphrase) {
                this.showUnlockModal = false;
                if (this.pendingAction) {
                    this.pendingAction(passphrase);
                    this.pendingAction = null;
                }
            },
            list_staked_commitments:function()
            {
                let vm=this;
                this.client.command([{ method: "liststakedcommitments"}]).then((r) =>
                {
                  if (r[0].name=="RpcError"||r[0].code)
                  {
                    console.log("RpcError");
                    console.log(r);
                }
                else
                { 
                    console.log(r[0]);
                    vm.staked_commitments=r[0];
                }
            });
            },
            start_staking : function()
            {
                let vm=this;
                if (vm.isManualConnection)
                {
                    vm.showManualStakingModal = true;
                    return;
                }
                if (vm.$store.state.active_wallet)
                {
                    vm.requireUnlock((passphrase) => vm.doStartStaking(passphrase));
                }
                else
                {
                    Swal.fire({
                        theme:'dark',
                        title: 'Staking',
                        text: "Please select a wallet for start staking process.",
                        icon: 'info',
                        confirmButtonText: 'OK'
                    })
                }
            },
            doStartStaking : function(passphrase)
            {
                let vm=this;
                console.log("Starting staking process...");
                vm.$store.commit('set_staking_auto_started', false);
                ipcRenderer.invoke('start-staker', vm.$store.state.network, vm.$store.state.active_wallet, vm.$store.state.rpcuser, vm.$store.state.rpcpassword, passphrase);
            },
            copyManualCommand : function()
            {
                let vm=this;
                navigator.clipboard.writeText(vm.manualStakingCommand).then(() => {
                    vm.manualCommandCopied = true;
                    setTimeout(() => { vm.manualCommandCopied = false; }, 2000);
                });
            },
            formatNumbers : function(n)
            {
                if (n==undefined) return;
                n=parseFloat(n.toString());
                var parts = n.toString().split(".");
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            },
            getbalance : function()
            {
                let vm=this;
                vm.client.getBalances().then((r) => { vm.balance=r; })
                    .catch((r) => { console.log(r); });
            },
            stop_staking : function()
            {
                let vm=this;
                if (vm.$store.state.active_wallet)
                {
                    console.log("Stopping staking process...");
                    ipcRenderer.invoke('stop-staker', vm.$store.state.staker_pid);
                }
                else
                {
                    Swal.fire({
                        theme:'dark',
                        title: 'Staking',
                        text: "Staking not started.",
                        icon: 'info',
                        confirmButtonText: 'OK'
                    })
                }
            },
            lock_coins : function()
            {
                let vm=this;
                this.client.command([{ method: "stakelock", parameters: {"amount":vm.amount_lock} }]).then((r) => 
                {
                    console.log(r);
                    if (r[0].name=="RpcError"||r[0].code)
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
                       vm.amount_lock=0;
                       vm.list_staked_commitments();
                       Swal.fire({
                        theme:'dark',
                        title: 'Success!',
                        text: "Coins successfully locked.",
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                   }
               });
            },
            unlock_coins : function()
            {
                let vm=this;
                this.client.command([{ method: "stakeunlock", parameters: {"amount":vm.amount_unlock} }]).then((r) => 
                {
                    console.log(r);
                    if (r[0].name=="RpcError"||r[0].code)
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
                       vm.list_staked_commitments();
                       Swal.fire({
                        theme:'dark',
                        title: 'Success!',
                        text: "Coins successfully unlocked.",
                        icon: 'success',
                        confirmButtonText: 'OK'
                    })
                   }
               });
            },
            list_transactions()
            {
            let vm=this;
            let categories = [];
            let rewards= [];

            this.ready = false;
            vm.client.command([{ method: "listtransactions", parameters: ["*", 100000] }]).then((r) =>
            {
                if (r[0].name=="RpcError"||r[0].code)
                {
                    console.log("RpcError");
                    console.log(r);
                }
                else
                {
                    vm.txs=r[0];
                    const now = new Date();
                    const oneDayMs = 1000 * 60 * 60 * 24;

                    const result = Array.from({ length: 15 }, (_, i) => {
                      const date = new Date(now.getTime() - oneDayMs * (14 - i));
                      const isoDate = date.toISOString().split('T')[0];
                      const shortDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

                      return {
                        date: isoDate,
                        shortDate: shortDate,
                        total: 0
                    };
                });

                    const nowEpoch = Math.floor(now.getTime() / 1000);

                    vm.txs.forEach(tx => {
                      if (tx.category === 'generate') {
                        const dayDiff = Math.floor((nowEpoch - tx.time) / (60 * 60 * 24));
                        if (dayDiff >= 0 && dayDiff < 15) {
                          result[14 - dayDiff].total += tx.amount;
                      }
                  }
              });
                    console.log(result);
                    result.forEach(day => {
                        console.log(`Date: ${day.date} - Rewards : ${day.total}`);
                        categories.push(day.shortDate);
                        rewards.push(day.total);

                    });
                    vm.options={
                        chart: {
                            id: 'staking-chart',
                            type:'area',
                            foreColor: 'rgba(255,255,255,0.45)',
                            toolbar: {
                                show: false,
                                tools: {
                                  download: false
                              }
                          },
                      },
                      tooltip: {
                        theme: "dark"
                    },
                    grid: {
                        show: true,
                        borderColor: 'rgba(255,255,255,0.07)',
                        strokeDashArray: 0,
                        position: 'back',
                        xaxis: {
                            lines: {
                                show: true
                            }
                        },   
                        yaxis: {
                            lines: {
                                show: true
                            }
                        },  
                        row: {
                            colors: undefined,
                            opacity: 0.5
                        },  
                        column: {
                            colors: undefined,
                            opacity: 0.5
                        },  
                        padding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },  
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shade: "dark",
                            shadeIntensity: 0.5,
                            type: "vertical",
                            opacityFrom: 0.1,
                            opacityTo: 1,
                            colorStops: [
                                {
                                  offset: 0,
                                  color: "#008FFB",
                                  opacity: 0.1
                              },
                              {
                                  offset: 100,
                                  color: "#008FFB",
                                  opacity: 0.3
                              }
                          ]
                      }
                  },
                  xaxis: {
                      categories: categories,
                      color: undefined
                  },
                  dataLabels: {
                      enabled: false,
                      enabledOnSeries: undefined,
                      formatter: function (val, opts) {
                          return val
                      },
                      textAnchor: 'middle',
                      distributed: false,
                      offsetX: 0,
                      offsetY: 0,
                      style: {
                          fontSize: '14px',
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          fontWeight: 'bold',
                          colors: [undefined]
                      },
                      background: {
                        enabled: false,
                        foreColor: undefined,
                        padding: 4,
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: '#232323',
                        opacity: 0.9,
                        dropShadow: {
                          enabled: false,
                          top: 1,
                          left: 1,
                          blur: 1,
                          color: '#000',
                          opacity: 0.45
                      }
                  },
                  dropShadow: {
                      enabled: false,
                      top: 1,
                      left: 1,
                      blur: 1,
                      color: '#000',
                      opacity: 0.45
                  }
              }
          };
          vm.series=[{
            name: 'Rewards',
            data: rewards,
            color: undefined
        }];
    }
    vm.ready = true;
}).catch((r) => {
    console.log(r);
    vm.ready = true;
});
            }
        },
        mounted()
        {
            let vm=this;

            this.list_staked_commitments();
            this.getbalance();
            this.balanceTimer = setInterval(() => { this.getbalance(); }, 5000);
            ipcRenderer.invoke('get-bin-dir').then((dir) => { vm.binDir = dir; });
            this.list_transactions();
        },
        beforeUnmount()
        {
            clearInterval(this.balanceTimer);
        }
}
</script>

<style scoped>
.stk-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 6px;
  letter-spacing: 0.03em;
}

.stk-row {
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.20);
  border-radius: 0.5rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.10);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.stk-row:focus-within {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}

.stk-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  padding: 0.65rem 0.875rem;
  font-size: 0.875rem;
}
.stk-input::placeholder { color: rgba(255, 255, 255, 0.55); }
.stk-input::-webkit-inner-spin-button,
.stk-input::-webkit-outer-spin-button { -webkit-appearance: none; }

.stk-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.65rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.18);
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}
.stk-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.stk-btn:not(:disabled):hover { opacity: 0.82; }

.stk-lock   { background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); }
.stk-unlock { background: linear-gradient(135deg, #db2777 0%, #f97316 100%); }
</style>

