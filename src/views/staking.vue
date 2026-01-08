<template>
    <div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
        <div v-if="$store.state.active_wallet">
            <div class="w-full mb-1">
              <h3 class="p-4">Staking</h3>
          </div>
          <div class="p-3 w-full">
              <div id="alert-additional-content-5" class="p-4 rounded-lg bg-zinc-800 dark:bg-zinc-800" role="alert">
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
    <div v-if="$store.state.is_staking_active" class="w-full p-3 mt-3 text-sm text-green-400 rounded-lg bg-zinc-800 dark:bg-zinc-800 dark:text-green-400" role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <div>
        <span class="font-medium">Staker running for wallet '{{$store.state.staker_wallet}}'...</span>
    </div>
</div>
<div v-else class="w-full p-3 mt-3 text-sm text-orange-400 rounded-lg bg-zinc-800 dark:bg-zinc-800 dark:text-orange-400" role="alert">
  <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
</svg>
<span class="sr-only">Info</span>
<div>
    <span class="font-medium">Staker not running...</span>
</div>
</div>
</div>

<div class="flex p-3">
    <div class="w-1/2">
      <label for="hs-trailing-button-add-on" class="sr-only">Label</label>
      <div class="flex rounded-lg shadow-sm">
        <input v-model="amount_lock" type="number" min="0" class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 text-zinc-400 border-zinc-700">
        <button type="button" :disabled="!amount_lock" v-on:click="lock_coins()" class="py-3 px-4 text-nowrap whitespace-nowrap inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          &nbsp;Lock coins
      </button>
  </div>
</div>
<div class="w-1/2 ml-5 dark:bg-zinc-800 dark:border-zinc-600 ">
  <label for="hs-trailing-button-add-on" class="sr-only">Label</label>
  <div class="flex rounded-lg shadow-sm">
    <input v-model="amount_unlock" type="number" min="0" class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 text-zinc-400 border-zinc-700">
    <button :disabled="!amount_unlock" type="button" v-on:click="unlock_coins()" class="py-3 px-4 text-nowrap whitespace-nowrap inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
      &nbsp;Unlock coins
  </button>
</div>
</div>
</div>


<div class="p-5 dark:bg-zinc-900 bg-zinc-900">
    <apexchart class="w-full" height="240" :options="options" :series="series"></apexchart>
</div>
</div>
<div class="p-4" v-else>
  <p>No wallet loaded or selected.</p>
  <p>You can create, load and activate a wallet in Wallets page.</p>
  <router-link to="/wallets">
    <a href="" class="mt-5 inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>

    <span class="ms-3">Wallets</span>
</a>
</router-link>
</div>
</div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import ApexCharts from 'apexcharts';
    import Swal from 'sweetalert2';
    import '@sweetalert2/theme-dark/dark.scss';
    export default {
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

