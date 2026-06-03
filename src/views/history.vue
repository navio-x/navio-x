<template>
  <div class="h-full flex flex-col bg-transparent text-white overflow-hidden">
    <div v-if="$store.state.active_wallet && ready" class="flex flex-col h-full min-h-0">

      <!-- ── Filter bar ── -->
      <div class="px-4 py-3 shrink-0 border-b border-white/10">
        <div class="flex items-center gap-2 flex-wrap">

          <select v-model="selectedCategory" class="hst-filter">
            <option value="">All types</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <input type="date" v-model="startDate" class="hst-filter [&::-webkit-calendar-picker-indicator]:invert" title="Start date">
          <input type="date" v-model="endDate"   class="hst-filter [&::-webkit-calendar-picker-indicator]:invert" title="End date">

          <div class="flex gap-1">
            <button @click="applyQuickRange('today')" class="hst-range-pill">Today</button>
            <button @click="applyQuickRange('7')"     class="hst-range-pill">7d</button>
            <button @click="applyQuickRange('30')"    class="hst-range-pill">30d</button>
          </div>

          <button v-if="selectedCategory || startDate || endDate" @click="resetFilters" class="hst-clear-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
            Clear
          </button>

          <span class="ml-auto text-[11px] text-white/55">{{ filteredTxs.length }} results</span>
          <button @click="exportToCSV" class="hst-export-btn shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <!-- ── Table ── -->
      <template v-if="filteredTxs.length">
        <!-- Fixed header — outside scroll container -->
        <div class="px-6 pt-3 shrink-0">
          <table class="w-full table-fixed border-separate [border-spacing:0]">
            <colgroup>
              <col style="width:13%">
              <col style="width:21%">
              <col style="width:16%">
              <col style="width:14%">
              <col style="width:10%">
              <col style="width:12%">
              <col style="width:14%">
            </colgroup>
            <thead>
              <tr class="hst-thead-row">
                <th class="hst-th text-left">Type</th>
                <th class="hst-th text-left">Date</th>
                <th class="hst-th text-right">Amount</th>
                <th class="hst-th text-right">Fee</th>
                <th class="hst-th text-right">Conf.</th>
                <th class="hst-th text-right">Block</th>
                <th class="hst-th text-right">Address</th>
              </tr>
            </thead>
          </table>
        </div>

        <!-- Scrollable body -->
        <div class="flex-1 overflow-auto px-6 pb-4 min-h-0">
          <table class="w-full table-fixed border-separate [border-spacing:0]">
            <colgroup>
              <col style="width:13%">
              <col style="width:21%">
              <col style="width:16%">
              <col style="width:14%">
              <col style="width:10%">
              <col style="width:12%">
              <col style="width:14%">
            </colgroup>
            <tbody>
              <tr v-for="tx in paginatedTxs" :key="tx.txid + tx.time" class="hst-row">

                <!-- Type badge -->
                <td class="hst-td">
                  <span :class="['hst-badge', `hst-badge--${tx.category}`]">
                    <svg v-if="tx.category === 'receive'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
                    </svg>
                    <svg v-else-if="tx.category === 'send'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    {{ tx.category }}
                  </span>
                </td>

                <!-- Date -->
                <td class="hst-td hst-td--muted text-sm whitespace-nowrap">
                  {{ formatDate(tx.time) }}
                </td>

                <!-- Amount -->
                <td class="hst-td text-right whitespace-nowrap">
                  <span :class="['hst-amount', tx.category === 'send' ? 'hst-amount--out' : 'hst-amount--in']">
                    {{ tx.category === 'send' ? '−' : '+' }}{{ formatNav(tx.amount) }}
                  </span>
                  <span class="text-[11px] text-white/55 ml-1">NAV</span>
                </td>

                <!-- Fee -->
                <td class="hst-td text-right whitespace-nowrap">
                  <span v-if="tx.fee !== undefined && tx.fee !== 0" class="hst-fee">
                    {{ formatNav(tx.fee) }}
                  </span>
                  <span v-else class="text-white/50 text-xs">—</span>
                  <span v-if="tx.fee !== undefined && tx.fee !== 0" class="text-[11px] text-white/55 ml-1">NAV</span>
                </td>

                <!-- Confirmations -->
                <td class="hst-td text-right">
                  <span :class="['hst-conf', tx.confirmations >= 6 ? 'hst-conf--ok' : 'hst-conf--pending']">
                    {{ tx.confirmations > 999 ? '999+' : tx.confirmations }}
                  </span>
                </td>

                <!-- Block height -->
                <td class="hst-td hst-td--muted text-right font-mono text-xs">
                  {{ tx.blockheight || '—' }}
                </td>

                <!-- Address -->
                <td class="hst-td text-right">
                  <span v-if="tx.address" class="font-mono text-xs text-white/65">
                    {{ tx.address.substring(0, 6) }}…{{ tx.address.slice(-4) }}
                  </span>
                  <span v-else class="text-white/50 text-xs">—</span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-2.5 shrink-0 border-t border-white/10 flex items-center justify-between">
          <button @click="currentPage--" :disabled="currentPage === 1" class="hst-page-btn">← Prev</button>
          <span class="text-[12px] text-white/55">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="hst-page-btn">Next →</button>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="flex-1 overflow-auto px-6 pt-3 pb-4 min-h-0">
        <div class="empty-state">
          <div class="empty-icon-ring">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="empty-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 class="empty-title">No Transactions Found</h2>
          <p class="empty-desc">
            No transactions match your current filters,<br>or this wallet has no history yet.
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
                endDate: "",
                currentPage: 1,
                pageSize: 10
            };
        },
        computed: {
            uniqueCategories() {
                return [...new Set(this.txs.map(tx => tx.category))];
            },
            filteredTxs() {
                return this.txs.filter(tx => {
                    const matchesCategory = this.selectedCategory ? tx.category === this.selectedCategory : true;
                    const txTime = new Date(tx.time * 1000);
                    const matchesStart = this.startDate ? txTime >= new Date(this.startDate) : true;
                    const matchesEnd = this.endDate ? txTime <= new Date(this.endDate + 'T23:59:59') : true;
                    return matchesCategory && matchesStart && matchesEnd;
                });
            },
            totalPages() {
                return Math.max(1, Math.ceil(this.filteredTxs.length / this.pageSize));
            },
            paginatedTxs() {
                const start = (this.currentPage - 1) * this.pageSize;
                return this.filteredTxs.slice(start, start + this.pageSize);
            }
        },
        watch: {
            filteredTxs() { this.currentPage = 1; }
        },
        methods: {
            formatDate(ts) {
                return new Date(ts * 1000).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            },
            formatNav(n) {
                const fixed = parseFloat(Math.abs(n).toFixed(4)).toString();
                const [int, dec] = fixed.split('.');
                const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return dec ? intFmt + '.' + dec : intFmt;
            },
            listtransactions() {
                this.client.command([{ method: "listtransactions", parameters: ["*", 100000] }]).then((r) => {
                    if (r[0].name === "RpcError" || r[0].code) {
                        this.ready = true;
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
                    const d = today.toISOString().split('T')[0];
                    this.startDate = d; this.endDate = d;
                } else {
                    const days = parseInt(value);
                    const past = new Date();
                    past.setDate(today.getDate() - days + 1);
                    this.startDate = past.toISOString().split('T')[0];
                    this.endDate   = today.toISOString().split('T')[0];
                }
            },
            exportToCSV() {
                const header = ['Category', 'Amount', 'Fee', 'Date', 'Confirmations', 'Block', 'Address'];
                const rows = this.filteredTxs.map(tx => [
                    tx.category,
                    tx.amount,
                    tx.fee !== undefined ? tx.fee : '',
                    this.formatDate(tx.time),
                    tx.confirmations,
                    tx.blockheight || '',
                    tx.address || ''
                ]);
                const csv = [header, ...rows].map(r => r.join(",")).join("\n");
                const link = document.createElement("a");
                link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
                link.setAttribute("download", "transactions.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
        mounted() { this.listtransactions(); }
    };
</script>

<style scoped>
/* ── Filter controls ──────────────────────────── */
.hst-filter {
  height: 32px;
  padding: 0 10px;
  font-size: 12px;
  color: rgba(255,255,255,0.95);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.20);
  border-radius: 7px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 0.15s;
}
.hst-filter:focus { border-color: rgba(167,139,250,0.75); }
select.hst-filter {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='rgba(255,255,255,0.65)' d='M5 7L1 3h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 26px;
}
select.hst-filter option { background: #1f1840; color: rgba(255,255,255,0.98); }

.hst-range-pill {
  height: 32px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.hst-range-pill:hover {
  background: rgba(167,139,250,0.22);
  border-color: rgba(167,139,250,0.45);
  color: rgba(255,255,255,0.98);
}

.hst-clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.70);
  background: transparent;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 7px;
  cursor: pointer;
  transition: color 0.13s, border-color 0.13s;
}
.hst-clear-btn:hover { color: rgba(255,255,255,0.95); border-color: rgba(255,255,255,0.30); }

.hst-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.13s, color 0.13s;
}
.hst-export-btn:hover { background: rgba(255,255,255,0.18); color: rgba(255,255,255,0.98); }

/* ── Table ────────────────────────────────────── */
.hst-thead-row {
  background: rgba(20, 15, 48, 0.90);
  border-bottom: 1px solid rgba(255,255,255,0.16);
}
.hst-th {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 8px 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.60);
  white-space: nowrap;
  background: rgb(20, 15, 48);
}

.hst-row {
  transition: background 0.12s;
}
.hst-row:hover td { background: rgba(255,255,255,0.07); }

.hst-td {
  padding: 10px 12px;
  font-size: 13px;
  color: rgba(255,255,255,0.93);
  vertical-align: middle;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}
.hst-row:last-child .hst-td { border-bottom: none; }
.hst-td--muted { color: rgba(255,255,255,0.65); }

/* Category badge */
.hst-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 5px;
  text-transform: capitalize;
  white-space: nowrap;
}
.hst-badge--receive  { background: rgba(52,211,153,0.1);  color: #34d399; }
.hst-badge--send     { background: rgba(248,113,113,0.1); color: #f87171; }
.hst-badge--generate { background: rgba(167,139,250,0.12); color: #a78bfa; }
.hst-badge--stake    { background: rgba(96,165,250,0.1);  color: #60a5fa; }

/* Amount */
.hst-amount {
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.hst-amount--in  { color: #34d399; }
.hst-amount--out { color: #f87171; }

/* Fee */
.hst-fee {
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: rgba(251,146,60,0.8);
}

/* Confirmations */
.hst-conf {
  display: inline-block;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}
.hst-conf--ok      { background: rgba(52,211,153,0.18);  color: rgba(52,211,153,0.98); }
.hst-conf--pending { background: rgba(251,191,36,0.18);  color: rgba(251,191,36,0.98); }

/* ── Pagination ───────────────────────────────── */
.hst-page-btn {
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.hst-page-btn:hover:not(:disabled) {
  background: rgba(167,139,250,0.22);
  border-color: rgba(167,139,250,0.45);
  color: rgba(255,255,255,0.98);
}
.hst-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Empty state ──────────────────────────────── */
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
  background: rgba(139,92,246,0.08);
  border: 1px solid rgba(139,92,246,0.2);
  box-shadow: 0 0 28px rgba(139,92,246,0.1);
  margin-bottom: 1.25rem;
}
.empty-icon  { width: 30px; height: 30px; color: rgba(167,139,250,0.85); }
.empty-title { font-size: 0.9375rem; font-weight: 600; color: rgba(255,255,255,0.97); margin-bottom: 0.5rem; }
.empty-desc  { font-size: 0.8125rem; color: rgba(255,255,255,0.70); line-height: 1.65; max-width: 280px; }
</style>
