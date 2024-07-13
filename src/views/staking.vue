<template>
    <div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
        <div class="w-full mb-1">
          <h3 class="p-4">Staking</h3>
      </div>
      <div class="p-3">
          <div id="alert-additional-content-5" class="p-4 border border-zinc-300 rounded-lg bg-zinc-800 border-zinc-600 dark:border-zinc-600 dark:bg-zinc-800" role="alert">
              <div class="flex items-center">
                <svg class="flex-shrink-0 w-4 h-4 me-2 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
              </svg>
              <span class="sr-only">Info</span>
              <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">Introduction</h3>
          </div>
          <div class="mt-2 mb-4 text-sm text-gray-300 dark:text-gray-300">
            You can earn rewards by staking by locking your coins. You must have at least 100 NAV for staking. The rewards you will earn will vary depending on the amount you lock.
        </div>
  <!--<div class="flex">
    <button type="button" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800">
      <svg class="me-2 h-3 w-3 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"></path>
      </svg>
      View more
    </button>
    <button type="button" class="text-gray-800 bg-transparent border border-gray-700 hover:bg-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 dark:text-gray-300 dark:hover:text-white" data-dismiss-target="#alert-additional-content-5" aria-label="Close">
      Dismiss
    </button>
</div>!-->
</div>
</div>
<div class="flex p-3">
    <div class="w-1/2">
      <label for="hs-trailing-button-add-on" class="sr-only">Label</label>
      <div class="flex rounded-lg shadow-sm">
        <input v-model="amount_lock" type="number" min="0" class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-900 bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 text-zinc-400 border-zinc-700">
        <button type="button" v-on:click="lock_coins()" class="py-3 px-4 text-nowrap whitespace-nowrap inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
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
    <button type="button" v-on:click="unlock_coins()" class="py-3 px-4 text-nowrap whitespace-nowrap inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
      &nbsp;Unlock coins
  </button>
</div>
</div>
</div>

<div class="p-4 overflow-auto bg-zinc-900 text-white">
    <div v-if="staked_commitments&&Object.keys(staked_commitments).length>0">
        <h3>Staked Commitments</h3>
        <div v-for="(commitment,index) in staked_commitments" class="bg-zinc-800 border-b mt-5 p-3 border-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-900">
            <span class="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{{index+1}}</span>
            <div class="w-full text-xs text-gray-500 ms-2 dark:text-gray-400">Amount : {{commitment.amount}}</div>
            <div class="w-full text-xs text-gray-500 ms-2 dark:text-gray-400">Commitment : {{commitment.commitment}}</div>
            <div class="w-full text-xs text-gray-500 ms-2 dark:text-gray-400">TX Hash : {{commitment.tx_hash}}</div>
            <div class="w-full text-xs text-gray-500 ms-2 dark:text-gray-400">Value : {{commitment.value}}</div>
            <div class="w-full text-xs text-gray-500 ms-2 dark:text-gray-400">Gamma : {{commitment.gamma}}</div>
        </div>
    </div>
    <div v-else>
        <p>No commitment found.</p>
    </div>
</div>
<div class="p-5 dark:bg-zinc-900 bg-zinc-900">
    <apexchart class="w-full border dark:border-zinc-700 border-zinc-700" height="300" :options="options" :series="series"></apexchart>
</div>
</div>
</template>

<script>
    import ApexCharts from 'apexcharts';
    import Swal from 'sweetalert2';
    import '@sweetalert2/theme-dark/dark.scss';
    export default {
        data() {
            return {
                staked_commitments:undefined,
                amount_lock:0,
                amount_unlock:0,
                options: {
                    chart: {
                        id: 'vuechart-example',
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
                    borderColor: '#232323',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: false
                        }
                    },   
                    yaxis: {
                        lines: {
                            show: false
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
                  categories: ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"],
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

      },
      series: [{
        name: 'Rewards',
        data: [16, 24, 40, 32, 40, 48, 40, 52, 56, 60, 64, 68],
        color: undefined
    }]
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
                title: 'Success!',
                text: "Coins successfully unlocked.",
                icon: 'success',
                confirmButtonText: 'OK'
            })
         }
     });
    },
},
mounted() {
    this.list_staked_commitments();
}
}
</script>

