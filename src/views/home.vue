<template>
	<div class="h-full bg-transparent text-white overflow-auto">
		<template v-if="$store.state.active_wallet">
			<div>
				<!-- Balance Cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
					<!-- Available -->
					<div class="relative overflow-hidden rounded-xl p-6 border border-blue-500/20"
					style="background: linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.08) 100%); backdrop-filter: blur(12px);">
					<div class="pointer-events-none absolute -top-6 -right-6 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl"></div>
					<div class="text-xs font-semibold uppercase tracking-widest text-blue-400/70 mb-2">Available Balance</div>
					<template v-if="dataLoading">
						<div class="skeleton h-8 w-36 rounded-md mb-4"></div>
						<div class="space-y-2 border-t border-white/[0.18] pt-4">
							<div class="flex justify-between text-sm items-center">
								<span class="text-white/65">Pending</span>
								<div class="skeleton h-4 w-16 rounded"></div>
							</div>
							<div class="flex justify-between text-sm items-center">
								<span class="text-white/65" title="Immature staking coins will mature after 100 blocks.">Immature</span>
								<div class="skeleton h-4 w-16 rounded"></div>
							</div>
							<div class="flex justify-between text-sm items-center border-t border-white/[0.18] pt-2">
								<span class="text-white/80 font-medium">Total</span>
								<div class="skeleton h-4 w-20 rounded"></div>
							</div>
						</div>
					</template>
					<template v-else>
						<div class="text-3xl font-bold bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 text-transparent mb-4">
							{{formatNumbers(balance.mine.trusted)}} <span class="text-lg">NAV</span>
						</div>
						<div class="space-y-2 border-t border-white/[0.18] pt-4">
							<div class="flex justify-between text-sm">
								<span class="text-white/65">Pending</span>
								<span class="text-white/90">{{formatNumbers(balance.mine.untrusted_pending)}} NAV</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-white/65" title="Immature staking coins will mature after 100 blocks.">Immature</span>
								<span class="text-white/90">{{formatNumbers(balance.mine.immature)}} NAV</span>
							</div>
							<div class="flex justify-between text-sm border-t border-white/[0.18] pt-2">
								<span class="text-white/80 font-medium">Total</span>
								<span class="text-white font-semibold">{{formatNumbers(getTotal(balance))}} NAV</span>
							</div>
						</div>
					</template>
				</div>

				<!-- Private Staking -->
				<div class="relative overflow-hidden rounded-xl p-6 border border-violet-500/20"
				style="background: linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(219,39,119,0.07) 100%); backdrop-filter: blur(12px);">
				<div class="pointer-events-none absolute -top-6 -right-6 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl"></div>
				<div class="text-xs font-semibold uppercase tracking-widest text-violet-400/70 mb-2">Private Staking</div>
				<template v-if="dataLoading">
					<div class="skeleton h-8 w-36 rounded-md mb-4"></div>
					<div class="space-y-2 border-t border-white/[0.18] pt-4">
						<div class="flex justify-between text-sm items-center">
							<span class="text-white/65">Pending</span>
							<div class="skeleton h-4 w-16 rounded"></div>
						</div>
						<div class="flex justify-between text-sm items-center">
							<span class="text-white/65">24H</span>
							<div class="skeleton h-4 w-14 rounded"></div>
						</div>
						<div class="flex justify-between text-sm items-center">
							<span class="text-white/65">7D</span>
							<div class="skeleton h-4 w-14 rounded"></div>
						</div>
						<div class="flex justify-between text-sm items-center">
							<span class="text-white/65">30D</span>
							<div class="skeleton h-4 w-14 rounded"></div>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="text-3xl font-bold bg-clip-text bg-gradient-to-br from-violet-300 to-fuchsia-500 text-transparent mb-4">
						{{formatNumbers(balance.mine.staked_commitment_balance)}} <span class="text-lg">NAV</span>
					</div>
					<div class="space-y-2 border-t border-white/[0.18] pt-4">
						<div class="flex justify-between text-sm">
							<span class="text-white/65">Pending</span>
							<span class="text-white/90">{{formatNumbers(balance.mine.pending_staked_commitment_balance)}} NAV</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/65">24H</span>
							<span :class="generateSums.day > 0 ? 'text-green-400 font-medium' : 'text-white/90'">
								{{ generateSums.day > 0 ? '+' : '' }}{{ generateSums.day }} NAV
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/65">7D</span>
							<span :class="generateSums.week > 0 ? 'text-green-400 font-medium' : 'text-white/90'">
								{{ generateSums.week > 0 ? '+' : '' }}{{ generateSums.week }} NAV
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/65">30D</span>
							<span :class="generateSums.month > 0 ? 'text-green-400 font-medium' : 'text-white/90'">
								{{ generateSums.month > 0 ? '+' : '' }}{{ generateSums.month }} NAV
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/65">1 Year</span>
							<span :class="generateSums.year > 0 ? 'text-green-400 font-medium' : 'text-white/90'">
								{{ generateSums.year > 0 ? '+' : '' }}{{ generateSums.year }} NAV
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/65">ALL</span>
							<span :class="generateSums.all > 0 ? 'text-green-400 font-medium' : 'text-white/90'">
								{{ generateSums.all > 0 ? '+' : '' }}{{ generateSums.all }} NAV
							</span>
						</div>
					</div>
				</template>
			</div>
		</div>

		<!-- Recent Transactions -->
		<div class="px-6 pb-6">
			<div class="relative overflow-hidden rounded-xl border border-white/[0.16]"
			style="background: linear-gradient(160deg, rgba(34,26,68,0.7) 0%, rgba(22,28,58,0.7) 100%); backdrop-filter: blur(12px);">
			<!-- header -->
			<div class="flex items-center justify-between gap-2 px-6 py-4 border-b border-white/[0.16]">
				<div class="flex items-center gap-2">
					<div class="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-violet-400">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
					</div>
					<h2 class="text-sm font-semibold text-white">Recent Transactions</h2>
				</div>
				<router-link to="/history" class="text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors">Show All</router-link>
			</div>

			<div v-if="txsLoading" class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-white/[0.10]" style="background: rgba(255,255,255,0.04);">
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Type</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Amount</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Memo</th>
									<!--
									<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">To</th>
								<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Comment</th>
							-->
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40 whitespace-nowrap">Time</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Block</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Address</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Label</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Fee</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="n in 5" :key="n" class="border-b border-white/[0.14] last:border-0">
							<td class="px-4 py-3"><div class="skeleton h-4 w-16 rounded"></div></td>
							<td class="px-4 py-3"><div class="skeleton h-3.5 w-16 rounded"></div></td>
							<td class="px-4 py-3"><div class="skeleton h-4 w-20 rounded"></div></td>
									<!--
									<td class="px-4 py-3"><div class="skeleton h-4 w-16 rounded"></div></td>
									<td class="px-4 py-3"><div class="skeleton h-4 w-16 rounded"></div></td>
							-->
							<td class="px-4 py-3"><div class="skeleton h-3.5 w-14 rounded"></div></td>
							<td class="px-4 py-3"><div class="skeleton h-4 w-10 rounded"></div></td>
							<td class="px-4 py-3"><div class="skeleton h-3.5 w-16 rounded"></div></td>
							<td class="px-4 py-3"><div class="skeleton h-4 w-12 rounded"></div></td>
							<td class="px-4 py-3"><div class="skeleton h-3.5 w-10 rounded"></div></td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-else-if="recentTxs.length > 0" class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-white/[0.10]" style="background: rgba(255,255,255,0.04);">
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Type</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Amount</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Memo</th>
									<!--
									<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">To</th>
								<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Comment</th>
							-->
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40 whitespace-nowrap">Time</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Block</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Address</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Label</th>
							<th class="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-white/40">Fee</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(tx, index) in recentTxs" :key="index" class="border-b border-white/[0.14] last:border-0 hover:bg-violet-500/[0.05] transition-colors">
							<td class="px-4 py-3">
								<div class="flex items-center gap-1.5">
									<svg v-if="tx.category=='receive'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-emerald-400 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
									</svg>
									<svg v-else-if="tx.category=='send'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-red-400 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
									</svg>
									<svg v-else-if="tx.category=='generate'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-violet-400 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
									</svg>
									<svg v-else-if="tx.category=='stake'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-blue-400 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
									</svg>
									<svg v-else-if="tx.category=='orphan'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
									</svg>
									<svg v-else-if="tx.category=='immature'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-amber-400 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
									</svg>
									<svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-white/50 shrink-0">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
									</svg>
									<span :class="{
										'text-emerald-400': tx.category=='receive',
										'text-red-400': tx.category=='send',
										'text-violet-400': tx.category=='generate',
										'text-blue-400': tx.category=='stake',
										'text-gray-400': tx.category=='orphan',
										'text-amber-400': tx.category=='immature',
										'text-white/70': !['receive','send','generate','stake','orphan','immature'].includes(tx.category)
									}" class="text-xs capitalize">{{tx.category}}</span>
								</div>
							</td>
							<td class="px-4 py-3">
								<span :class="tx.amount > 0 ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
									{{ tx.amount > 0 ? '+' : '−' }}{{ formatNav(tx.amount) }} NAV
								</span>
							</td>
							<td class="px-4 py-3 max-w-[10rem]">
								<span v-if="tx.memo" class="text-xs text-white/65 italic truncate block" :title="tx.memo">{{tx.memo}}</span>
								<span v-else class="text-xs text-white/30">—</span>
							</td>
									<!--
									<td class="px-4 py-3 max-w-[8rem]">
										<span v-if="tx.to" class="text-xs text-white/65 truncate block" :title="tx.to">{{tx.to}}</span>
										<span v-else class="text-xs text-white/30">—</span>
									</td>
									<td class="px-4 py-3 max-w-[8rem]">
									</td>
							-->
							<td class="px-4 py-3 whitespace-nowrap">
								<span class="text-xs text-white/60" :title="format(tx.time,'DD.MM.YY HH:mm:ss')">{{timeAgo(tx.time)}}</span>
							</td>
							<td class="px-4 py-3">
								<span v-if="tx.blockheight" class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-medium px-2 py-0.5 rounded">{{tx.blockheight}}</span>
							</td>
							<td class="px-4 py-3">
								<span v-if="tx.address" class="text-xs text-white/60 font-mono">
									{{tx.address.substring(0,6)}}…{{tx.address.slice(-6)}}
								</span>
							</td>
							<td class="px-4 py-3">
								<span v-if="tx.label" class="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">{{tx.label}}</span>
							</td>
							<td class="px-4 py-3 whitespace-nowrap">
								<span v-if="tx.fee !== undefined && tx.fee !== 0" class="text-xs text-orange-300/80 font-medium" :title="'Fee: ' + Math.abs(tx.fee) + ' NAV'">
									{{ formatNav(tx.fee) }} NAV
								</span>
								<span v-else class="text-xs text-white/80">—</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-else class="flex flex-col items-center justify-center py-12 px-6">
				<div class="flex items-center justify-center w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-violet-400/60">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
				</div>
				<p class="text-sm font-medium text-white mb-1">No Transactions Yet</p>
				<p class="text-xs text-white/65 text-center max-w-xs">Your recent transactions will appear here once you send or receive NAV.</p>
			</div>
		</div>
	</div>
</div>
</template>

<NoWalletSelected v-else />
</div>
</template>

<script>
	import moment from 'moment';
	import sb from 'satoshi-bitcoin';
	import { computed } from 'vue';
	import NoWalletSelected from '../components/NoWalletSelected.vue';

	export default {
		components: { NoWalletSelected },
		data() {
			return {
				balance:undefined,
				txs: [],
				alltxs:[],
				loading: true,
				txsLoading: true
			}
		},
		computed: {
			dataLoading() {
				return this.loading || !this.balance;
			},
			recentTxs() {
				return this.txs.slice(0, 5);
			},
			generateSums() {
				const now = Math.floor(Date.now() / 1000);
				const oneDay = 60 * 60 * 24;
				const oneWeek = oneDay * 7;
				const oneMonth = oneDay * 30;
				const oneYear = oneDay * 365;

				let result = {
					day: 0,
					week: 0,
					month: 0,
					year: 0,
					all: 0
				};

				this.alltxs.forEach(tx => {
					if (tx.category === 'generate') {
						const diff = now - tx.time;
						result.all += tx.amount;
						if (diff <= oneYear) {
							result.year += tx.amount;
							if (diff <= oneMonth) {
								result.month += tx.amount;
								if (diff <= oneWeek) {
									result.week += tx.amount;
									if (diff <= oneDay) {
										result.day += tx.amount;
									}
								}
							}
						}
					}
				});

				return result;
			}
		},
		methods:
		{
			getTotal: function(balance)
			{
				return sb.toBitcoin(sb.toSatoshi(balance.mine.trusted)+sb.toSatoshi(balance.mine.untrusted_pending)+sb.toSatoshi(balance.mine.immature)+sb.toSatoshi(balance.mine.staked_commitment_balance));
			},
			format: function(n,f)
			{
				if (n) return moment.unix(n).format(f); else return "";
			},
			timeAgo: function(timestamp) {
				if (!timestamp) return "";
				const diff = Math.floor(Date.now() / 1000) - timestamp;
				if (diff < 60) {
					return diff + 's ago';
				} else if (diff < 3600) {
					const m = Math.floor(diff / 60);
					return m + 'm ago';
				} else if (diff < 86400) {
					const h = Math.floor(diff / 3600);
					const m = Math.floor((diff % 3600) / 60);
					return m > 0 ? h + 'h ' + m + 'm ago' : h + 'h ago';
				} else if (diff < 2592000) {
					const d = Math.floor(diff / 86400);
					return d + 'd ago';
				} else {
					const mo = Math.floor(diff / 2592000);
					return mo + 'M ago';
				}
			},
			toNav: function(n)
			{
				if (n) return sb.toBitcoin(n);
			},
			toNavoshi: function(n)
			{
				if (n) return sb.toSatoshi(n);
			},
			formatNav(n) {
				const fixed = parseFloat(Math.abs(n).toFixed(4)).toString();
				const [int, dec] = fixed.split('.');
				const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				return dec ? intFmt + '.' + dec : intFmt;
			},
			formatNumber: n => {
				if (!n) return "0";
				return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
			},
			formatNumbers: function(n) {
				if (n==undefined) return;
				n=parseFloat(n.toString());
				var parts = n.toString().split(".");
				return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
			},
			numberWithCommas: n => {
				if (!n) {
					return "0.00"
				}
				n = (Math.round(n * 100) / 100).toFixed(2);
				var parts = n.toString().split(".");
				return (
					parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
					(parts[1] ? "." + parts[1] : "")
					);
			},
			getbalance: function()
			{
				let vm=this;
				vm.client.getBalances().then((r) =>
				{
					vm.balance=r;
					vm.loading=false;
				})
				.catch((r) =>
				{
					console.log(r);
					vm.loading=false;
				});
			},
			listtransactions: function()
			{
				let vm=this;
				console.log("listtransactions");
				// naviod runs on localhost and often answers within a few ms, faster
				// than the browser's next paint — without a floor the skeleton and
				// loaded renders land in the same frame and never becomes visible.
				const loadStart = Date.now();
				const minLoadingMs = 400;
				const finish = () => {
					const wait = Math.max(0, minLoadingMs - (Date.now() - loadStart));
					setTimeout(() => { vm.txsLoading = false; }, wait);
				};
				vm.client.command([{ method: "listtransactions", parameters: [] }]).then((r) =>
				{
					if (r[0].name=="RpcError"||r[0].code)
					{
						console.log("RpcError");
						console.log(r);
					}
					else
					{
						vm.txs=r[0].reverse();
					}
					finish();
				})
				.catch((r) =>
				{
					console.log(r);
					finish();
				});
			},
			listalltransactions: function()
			{
				let vm=this;
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
						vm.alltxs=r[0];
					}
				});
			}
		},
		mounted() {
			this.getbalance();	
			this.listtransactions();
			this.listalltransactions();
			this.timer = setInterval(() => 
			{
				this.getbalance();
				this.listtransactions();
				this.listalltransactions();
			},
			10000);
		},
		beforeUnmount()
		{
			clearInterval(this.timer);
		}
	}
</script>
<style>
	.skeleton {
		display: inline-block;
		background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.15) 37%, rgba(255,255,255,0.06) 63%);
		background-size: 400% 100%;
		animation: skeleton-shimmer 1.4s ease infinite;
	}
	@keyframes skeleton-shimmer {
		0%   { background-position: 100% 50%; }
		100% { background-position: 0 50%; }
	}

	/* 3D tower loader made by: csozi | Website: www.csozi.hu*/

	.loader {
		scale: 1;
		height: 50px;
		width: 40px;
	}

	.box {
		position: relative;
		opacity: 0;
		left: 10px;
	}

	.side-left {
		position: absolute;
		background-color: #286cb5;
		width: 19px;
		height: 5px;
		transform: skew(0deg, -25deg);
		top: 14px;
		left: 10px;
	}

	.side-right {
		position: absolute;
		background-color: #2f85e0;
		width: 19px;
		height: 5px;
		transform: skew(0deg, 25deg);
		top: 14px;
		left: -9px;
	}

	.side-top {
		position: absolute;
		background-color: #5fa8f5;
		width: 20px;
		height: 20px;
		rotate: 45deg;
		transform: skew(-20deg, -20deg);
	}

	.box-1 {
		animation: from-left 4s infinite;
	}

	.box-2 {
		animation: from-right 4s infinite;
		animation-delay: 1s;
	}

	.box-3 {
		animation: from-left 4s infinite;
		animation-delay: 2s;
	}

	.box-4 {
		animation: from-right 4s infinite;
		animation-delay: 3s;
	}

	@keyframes from-left {
		0% {
			z-index: 20;
			opacity: 0;
			translate: -20px -6px;
		}

		20% {
			z-index: 10;
			opacity: 1;
			translate: 0px 0px;
		}

		40% {
			z-index: 9;
			translate: 0px 4px;
		}

		60% {
			z-index: 8;
			translate: 0px 8px;
		}

		80% {
			z-index: 7;
			opacity: 1;
			translate: 0px 12px;
		}

		100% {
			z-index: 5;
			translate: 0px 30px;
			opacity: 0;
		}
	}

	@keyframes from-right {
		0% {
			z-index: 20;
			opacity: 0;
			translate: 20px -6px;
		}

		20% {
			z-index: 10;
			opacity: 1;
			translate: 0px 0px;
		}

		40% {
			z-index: 9;
			translate: 0px 4px;
		}

		60% {
			z-index: 8;
			translate: 0px 8px;
		}

		80% {
			z-index: 7;
			opacity: 1;
			translate: 0px 12px;
		}

		100% {
			z-index: 5;
			translate: 0px 30px;
			opacity: 0;
		}
	}
</style>
