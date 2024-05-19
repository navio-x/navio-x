<template>
    <div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
        <div class="p-4">
            <h3>History</h3>
        </div>
        <div class="p-4 overflow-auto dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="txs&&Object.keys(txs).length>0">
                <table class="w-full text-sm text-left rtl:text-right dark:text-gray-400 text-gray-400">
                    <thead class="text-xs uppercase bg-zinc-800 dark:bg-zinc-800 dark:text-gray-400 text-gray-400">
                        <tr>
                           <!--<th scope="col" class="px-6 py-3">
                                &nbsp;
                            </th>!-->
                            <th scope="col" class="px-6 py-3">
                                Generated
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Height
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Confirmations
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Amount
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Address
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tx in txs" class="bg-zinc-800 border-b border-zinc-950 dark:bg-zinc-800 dark:border-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <!--<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" >
                                <input :ref="'lr_'+tx.txid" type="radio" name="hs-default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" :id="'lr_'+tx.txid">
                            </th>!-->
                            <td><center>{{tx.generated}}</center></td>
                            <td><center>{{tx.blockheight}}</center></td>
                            <td><center>{{tx.confirmations}}</center></td>
                            <td>
                                <center>
                                    <svg v-if="tx.category=='receive'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                    </svg>
                                    <svg v-if="tx.category=='send'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                    </svg>
                                </center>
                            </td>
                            <td>
                                <center>{{tx.amount}}</center>
                            </td>
                            <td>
                                <span v-if="tx.address">{{tx.address.substring(0,5)}}...{{tx.address.slice(-5)}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No transaction found.</p>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
          return {
            txs:[],
        }
    },
    methods: {
        listtransactions:function()
        {
            let vm=this;
            this.client.command([{ method: "listtransactions", parameters: ["*", 100000] }]).then((r) =>
            {
              if (r[0].name=="RpcError"||r[0].code)
              {
                console.log("RpcError");
                console.log(r);
            }
            else
            { 
                console.log(r[0]);
                vm.txs=r[0].reverse();
            }
        });
        }
    },
    mounted() {
        this.listtransactions();
    }
}
</script>

