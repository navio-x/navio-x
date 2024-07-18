<template>
    <div class="h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
        <div class="p-4">
            <h3>Peers</h3>
            <p>You are currently connected to {{peers.length}} peer(s).</p>
        </div>
        <div class="p-4 overflow-auto dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="peers.length>0">
                <table class="w-full text-sm text-left rtl:text-right dark:text-gray-400 text-gray-400">
                    <thead class="text-xs uppercase bg-zinc-800 dark:bg-zinc-800 dark:text-gray-400 text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Address
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Version
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Starting Height
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Synced Headers
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Synced Blocks
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="peer in peers" class="bg-zinc-800 border-b border-zinc-950 dark:bg-zinc-800 dark:border-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <td class="px-6 py-3">{{peer.id}}</td>
                            <td class="px-6 py-3">
                                <p>{{peer.addr}}</p>
                            </td>
                            <td class="px-6 py-3">{{peer.subver}}</td>
                            <td class="px-6 py-3">{{peer.startingheight}}</td>
                            <td class="px-6 py-3">{{peer.synced_headers}}</td>
                            <td class="px-6 py-3">{{peer.synced_blocks}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No peer found.</p>
            </div>

        </div>
    </div>
</template>

<script>
    import {onActivated, onDeactivated} from "vue";
    export default {
        data() {
          return {
            peers:[],
            intervalId:undefined
        }
    },
    methods: {
        getpeerinfo:function()
        {
            let vm=this;
            this.client.command([{ method: "getpeerinfo"}]).then((r) =>
            {
                console.log("getpeerinfo");
                if (r[0].name=="RpcError"||r[0].code)
                {
                    console.log("RpcError");
                    console.log(r);
                }
                else
                { 
                    console.log(r[0]);
                    vm.peers=r[0];
                }
            });
        }
    },
    mounted() {
        let vm=this;
        this.getpeerinfo();
        this.intervalId = window.setInterval(function()
        {
            vm.getpeerinfo();
        }, 1000);
    },
    unmounted() {
        window.clearInterval(this.intervalId); 
    }
}
</script>

