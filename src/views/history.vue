<template>
    <div class="h-full bg-transparent text-white">
        <div v-if="$store.state.active_wallet && ready">
            <div class="p-4">
                <h3>Transaction History</h3>
                <p class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="txs && Object.keys(txs).length > 0">{{ Object.keys(txs).length }} Transactions</p>
            </div>

            <!-- Filters -->
            <div class="p-4 flex items-center gap-4 flex-wrap">
                <div>
                    <label for="categoryFilter" class="block mb-2 text-sm font-medium text-white">Filter by Category</label>
                    <select
                    id="categoryFilter"
                    v-model="selectedCategory"
                    class="glass-input text-sm block w-64 p-2.5"
                    >
                    <option value="">All Categories</option>
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>

            <div>
                <label for="startDate" class="block mb-2 text-sm font-medium text-white">Start Date</label>
                <input type="date" id="startDate" v-model="startDate" class="glass-input text-sm p-2.5 w-40 [&::-webkit-calendar-picker-indicator]:invert">
            </div>

            <div>
                <label for="endDate" class="block mb-2 text-sm font-medium text-white">End Date</label>
                <input type="date" id="endDate" v-model="endDate" class="glass-input text-sm p-2.5 w-40 [&::-webkit-calendar-picker-indicator]:invert">
            </div>

            <div>
                <label for="quickRange" class="block mb-2 text-sm font-medium text-white">Quick Range</label>
                <select
                id="quickRange"
                @change="applyQuickRange($event.target.value)"
                class="glass-input text-sm p-2.5 w-40"
                >
                <option value="">Select</option>
                <option value="today">Today</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
            </select>
        </div>

        <button
        @click="resetFilters"
        class="mt-7 inline-flex items-center px-3 py-2 text-sm font-medium text-white glass-btn-secondary rounded-lg focus:outline-none"
        >
        Clear Filters
    </button>

    <button
    @click="exportToCSV"
    class="mt-7 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-500"
    >
    Export CSV
</button>
</div>

<div class="px-4 pb-2 text-sm text-gray-300">
    Filtered: {{ filteredTxs.length }} records
</div>

<!-- Table -->
<div class="p-4 overflow-auto bg-transparent text-white">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-if="txs && Object.keys(txs).length > 0">
        <table class="w-full text-sm text-left rtl:text-right dark:text-gray-400 text-gray-400">
            <thead class="text-xs uppercase glass-card dark:text-gray-400 text-gray-400 border-b border-white/[0.06]">
                <tr>
                    <th class="px-3 py-3">Generated</th>
                    <th class="px-3 py-3">Height</th>
                    <th class="px-3 py-3">Confirmations</th>
                    <th class="px-3 py-3"></th>
                    <th class="px-3 py-3">Type</th>
                    <th class="px-3 py-3">Category</th>
                    <th class="px-3 py-3">Amount</th>
                    <th class="px-3 py-3">Date</th>
                    <th class="px-3 py-3">Address</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tx in filteredTxs" :key="tx.txid" class="border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                    <td><center>{{ tx.generated }}</center></td>
                    <td><center>{{ tx.blockheight }}</center></td>
                    <td><center>{{ tx.confirmations }}</center></td>
                    <td>                                                
                        <svg v-if="tx.category == 'receive'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                        </svg>
                        <svg v-if="tx.category == 'generate'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-violet-400">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <svg v-if="tx.category == 'send'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>
                </td>
                <td>
                    {{ tx.label }}
                </td>
                <td><center>{{ tx.category }}</center></td>
                <td><center>{{ tx.amount }}</center></td>
                <td><center>{{ new Date(tx.time * 1000).toLocaleString('sv-SE').replace('T', ' ') }}</center></td>
                <td>
                    <span v-if="tx.address">{{ tx.address.substring(0, 5) }}...{{ tx.address.slice(-5) }}</span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div v-else class="empty-state">
  <div class="empty-icon-ring">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="empty-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  </div>
  <h2 class="empty-title">No Transactions Found</h2>
  <p class="empty-desc">
    No transactions match your current filters,<br>or this wallet has no transaction history yet.
  </p>
</div>
</div>
</div>
<NoWalletSelected v-else />
</div>
</template>

<script>
    import NoWalletSelected from '../components/NoWalletSelected.vue';
    export default {
        components: { NoWalletSelected },
        data() {
            return {
                txs: [],
                ready: false,
                selectedCategory: "",
                startDate: "",
                endDate: ""
            };
        },
        computed: {
            uniqueCategories() {
                const cats = this.txs.map(tx => tx.category);
                return [...new Set(cats)];
            },
            filteredTxs() {
                return this.txs.filter(tx => {
                    const matchesCategory = this.selectedCategory ? tx.category === this.selectedCategory : true;
                    const txTime = new Date(tx.time * 1000);
                    const matchesStart = this.startDate ? txTime >= new Date(this.startDate) : true;
                    const matchesEnd = this.endDate ? txTime <= new Date(this.endDate + 'T23:59:59') : true;
                    return matchesCategory && matchesStart && matchesEnd;
                });
            }
        },
        methods: {
            listtransactions() {
                this.client.command([{ method: "listtransactions", parameters: ["*", 100000] }]).then((r) => {
                    if (r[0].name === "RpcError" || r[0].code) {
                        this.ready = true;
                        console.log("RpcError", r);
                    } else {
                        this.txs = r[0].reverse();
                        this.ready = true;
                    }
                });
            },
            resetFilters() {
                this.selectedCategory = "";
                this.startDate = "";
                this.endDate = "";
            },
            applyQuickRange(value) {
                const today = new Date();
                if (value === 'today') {
                    const dateStr = today.toISOString().split('T')[0];
                    this.startDate = dateStr;
                    this.endDate = dateStr;
                } else if (value === '7') {
                    const past = new Date();
                    past.setDate(today.getDate() - 6);
                    this.startDate = past.toISOString().split('T')[0];
                    this.endDate = today.toISOString().split('T')[0];
                } else if (value === '30') {
                    const past = new Date();
                    past.setDate(today.getDate() - 29);
                    this.startDate = past.toISOString().split('T')[0];
                    this.endDate = today.toISOString().split('T')[0];
                }
            },
            exportToCSV() {
                const header = ['Generated', 'Height', 'Confirmations', 'Type', 'Category', 'Amount', 'Date', 'Address'];
                const rows = this.filteredTxs.map(tx => [
                    tx.generated,
                    tx.blockheight,
                    tx.confirmations,
                    tx.label || '',
                    tx.category,
                    tx.amount,
                    new Date(tx.time * 1000).toLocaleString('sv-SE').replace('T', ' '),
                    tx.address || ''
                ]);
                const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.setAttribute("download", "transactions.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
        mounted() {
            this.listtransactions();
        }
    };
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  text-align: center;
}
.empty-icon-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 0 28px rgba(139, 92, 246, 0.1);
  margin-bottom: 1.25rem;
}
.empty-icon {
  width: 30px;
  height: 30px;
  color: rgba(139, 92, 246, 0.65);
}
.empty-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 0.5rem;
}
.empty-desc {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.65;
  max-width: 280px;
}
</style>
