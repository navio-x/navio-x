<template>
    <div class="h-full bg-transparent text-white">
        <div v-if="$store.state.active_wallet">
            <div class="w-full mb-1">
              <h3 class="p-4">Staking</h3>
          </div>
          <div class="p-3 w-full">
              <div id="alert-additional-content-5" class="p-4 rounded-lg glass-card" role="alert">
                  <div class="flex items-center">
                    <svg class="flex-shrink-0 w-4 h-4 me-2 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
                  </svg>
                  <span class="sr-only">Info</span>
                  <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">Introduction</h3>
              </div>
              <div class="mt-2 mb-4 text-sm text-gray-300 dark:text-gray-300">
                Earn rewards by staking your coins! To start staking, you need a minimum of 10,000 NAV. The more coins you lock, the higher your potential rewards. Please note that newly staked coins will become mature and eligible for rewards after 100 blocks.
            </div>
        </div>
    </div>
    <div class="grid grid-cols-3 gap-4 p-3">
        <div class="col-span-2">
            <button v-if="!$store.state.is_staking_active" v-on:click="start_staking()" class="inline-flex items-center w-128 px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-5 me-2 -ms-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              Start Staking
          </button>
          <button v-if="$store.state.is_staking_active" v-on:click="stop_staking()" class="inline-flex items-center w-128 px-3 py-2 text-md font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-5 me-2 -ms-1">>
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
          </svg>
          Stop Staking
      </button>
  </div>
  <div class="rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white dark:text-white">
    <div v-if="staked_commitments&&Object.keys(staked_commitments).length>0">
        <div v-for="(commitment,index) in staked_commitments" class="p-3 text-md font-medium dark:text-white text-white inline-flex items-center "> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-5 me-2 ms-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          {{commitment.amount}} NAV Locked
      </div>
  </div>
  <div v-else class="p-3">
    <p>No commitment found.</p>
</div>
</div>
</div>
<div class="p-3">
    <div v-if="$store.state.is_staking_active" class="w-full p-3 mt-3 text-sm text-green-400 rounded-lg glass-card dark:text-green-400" role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <div>
        <span class="font-medium">Staker running for wallet '{{$store.state.staker_wallet}}'...</span>
    </div>
</div>
<div v-else class="w-full p-3 mt-3 text-sm text-orange-400 rounded-lg glass-card dark:text-orange-400" role="alert">
  <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
</svg>
<span class="sr-only">Info</span>
<div>
    <span class="font-medium">Staker not running...</span>
</div>
</div>
</div>

<div class="flex gap-4 p-3">

  <!-- Lock group -->
  <div class="flex-1">
    <label class="stk-label">NAV to Lock</label>
    <div class="stk-row">
      <input v-model="amount_lock" type="number" min="0" placeholder="0.00" class="stk-input">
      <button type="button" :disabled="!amount_lock" @click="lock_coins()" class="stk-btn stk-lock">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        Lock Coins
      </button>
    </div>
  </div>

  <!-- Unlock group -->
  <div class="flex-1">
    <label class="stk-label">NAV to Unlock</label>
    <div class="stk-row">
      <input v-model="amount_unlock" type="number" min="0" placeholder="0.00" class="stk-input">
      <button type="button" :disabled="!amount_unlock" @click="unlock_coins()" class="stk-btn stk-unlock">
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
</template>

<script>
    import { ipcRenderer } from 'electron';
    import ApexCharts from 'apexcharts';
    import Swal from 'sweetalert2';
    import '@sweetalert2/theme-dark/dark.scss';
    import NoWalletSelected from '../components/NoWalletSelected.vue';
    export default {
        components: { NoWalletSelected },
        data() {
            return {
                staked_commitments:undefined,
                amount_lock:0,
                amount_unlock:0,
                options: undefined,
                series: undefined,
                txs:[]
            }
        },
        methods:{
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
                if (vm.$store.state.active_wallet)
                {
                    console.log("Starting staking process...");
                    ipcRenderer.invoke('start-staker', vm.$store.state.network, vm.$store.state.active_wallet,vm.$store.state.rpcuser,vm.$store.state.rpcpassword);
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
            }
        },
        mounted()
        {
            let vm=this;
            let categories = [];
            let rewards= [];

            this.list_staked_commitments();
            console.log("staking rewards");
            console.log("listtransactions");
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
                            foreColor: '#bbbbbb',
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
                        borderColor: '#343434',
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
});

ipcRenderer.on('start-staker-success', (_event, pid) =>
{
    vm.$store.commit('set_staking_active',true);
});
}
}
</script>

<style scoped>
.stk-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
  letter-spacing: 0.03em;
}

.stk-row {
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
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
.stk-input::placeholder { color: rgba(255, 255, 255, 0.22); }
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
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}
.stk-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.stk-btn:not(:disabled):hover { opacity: 0.82; }

.stk-lock   { background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); }
.stk-unlock { background: linear-gradient(135deg, #db2777 0%, #f97316 100%); }
</style>

