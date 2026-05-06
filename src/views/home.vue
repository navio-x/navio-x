<template>
	<div class="h-full bg-transparent text-white overflow-auto">
		<div v-if="loading" class="flex flex-col items-center justify-center h-full pb-16 px-6">
			<div class="flex items-center justify-center w-20 h-20 rounded-full glass-card mb-6">
				<svg class="w-10 h-10 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
				</svg>
			</div>
			<h2 class="text-lg font-semibold text-white mb-2">Loading Wallet</h2>
			<p class="text-sm text-white/50 text-center max-w-xs">Blockchain is syncing and wallet data is being loaded. This may take a moment.</p>
		</div>
		<div v-else-if="balance">
			<!-- Balance Cards -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
				<!-- Available -->
				<div class="relative overflow-hidden rounded-xl p-6 border border-blue-500/20"
					style="background: linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.08) 100%); backdrop-filter: blur(12px);">
					<div class="pointer-events-none absolute -top-6 -right-6 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl"></div>
					<div class="text-xs font-semibold uppercase tracking-widest text-blue-400/70 mb-2">Available Balance</div>
					<div class="text-3xl font-bold bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 text-transparent mb-4">
						{{formatNumbers(balance.mine.trusted)}} <span class="text-lg">NAV</span>
					</div>
					<div class="space-y-2 border-t border-white/[0.08] pt-4">
						<div class="flex justify-between text-sm">
							<span class="text-white/35">Pending</span>
							<span class="text-white/70">{{formatNumbers(balance.mine.untrusted_pending)}} NAV</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/35" title="Immature staking coins will mature after 100 blocks.">Immature</span>
							<span class="text-white/70">{{formatNumbers(balance.mine.immature)}} NAV</span>
						</div>
						<div class="flex justify-between text-sm border-t border-white/[0.08] pt-2">
							<span class="text-white/50 font-medium">Total</span>
							<span class="text-white font-semibold">{{formatNumbers(getTotal(balance))}} NAV</span>
						</div>
					</div>
				</div>

				<!-- Private Staking -->
				<div class="relative overflow-hidden rounded-xl p-6 border border-violet-500/20"
					style="background: linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(219,39,119,0.07) 100%); backdrop-filter: blur(12px);">
					<div class="pointer-events-none absolute -top-6 -right-6 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl"></div>
					<div class="text-xs font-semibold uppercase tracking-widest text-violet-400/70 mb-2">Private Staking</div>
					<div class="text-3xl font-bold bg-clip-text bg-gradient-to-br from-violet-300 to-fuchsia-500 text-transparent mb-4">
						{{formatNumbers(balance.mine.staked_commitment_balance)}} <span class="text-lg">NAV</span>
					</div>
					<div class="space-y-2 border-t border-white/[0.08] pt-4">
						<div class="flex justify-between text-sm">
							<span class="text-white/35">24H</span>
							<span :class="generateSums.day > 0 ? 'text-green-400 font-medium' : 'text-white/70'">
								{{ generateSums.day > 0 ? '+' : '' }}{{ generateSums.day }} NAV
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/35">7D</span>
							<span :class="generateSums.week > 0 ? 'text-green-400 font-medium' : 'text-white/70'">
								{{ generateSums.week > 0 ? '+' : '' }}{{ generateSums.week }} NAV
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-white/35">30D</span>
							<span :class="generateSums.month > 0 ? 'text-green-400 font-medium' : 'text-white/70'">
								{{ generateSums.month > 0 ? '+' : '' }}{{ generateSums.month }} NAV
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Transactions -->
			<div class="px-6 pb-6">
				<div class="relative overflow-hidden rounded-xl border border-white/[0.07]"
					style="background: linear-gradient(160deg, rgba(17,10,35,0.7) 0%, rgba(10,14,30,0.7) 100%); backdrop-filter: blur(12px);">
					<!-- header -->
					<div class="flex items-center gap-2 px-6 py-4 border-b border-white/[0.07]">
						<div class="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-violet-400">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
						</div>
						<h2 class="text-sm font-semibold text-white">Recent Transactions</h2>
					</div>

					<div v-if="txs.length > 0" class="overflow-x-auto">
						<table class="w-full text-sm">
							<tbody>
								<tr v-for="(tx, index) in txs" :key="index" class="border-b border-white/[0.05] last:border-0 hover:bg-violet-500/[0.05] transition-colors">
									<td class="px-4 py-3 whitespace-nowrap">
										<span class="text-xs text-white/30" :title="format(tx.time,'DD.MM.YY HH:mm:ss')">{{timeAgo(tx.time)}}</span>
									</td>
									<td class="px-4 py-3">
										<span v-if="tx.blockheight" class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-medium px-2 py-0.5 rounded">{{tx.blockheight}}</span>
									</td>
									<td class="px-4 py-3">
										<span v-if="tx.label" class="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">{{tx.label}}</span>
									</td>
									<td class="px-4 py-3">
										<div class="flex items-center gap-1.5">
											<svg v-if="tx.category=='receive'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-green-400 shrink-0">
												<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
											</svg>
											<svg v-else-if="tx.category=='send'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-red-400 shrink-0">
												<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
											</svg>
											<svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-violet-400 shrink-0">
												<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
											</svg>
											<span class="text-xs text-white/40 capitalize">{{tx.category}}</span>
										</div>
									</td>
									<td class="px-4 py-3">
										<span :class="tx.amount > 0 ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
											{{tx.amount > 0 ? '+' + tx.amount : tx.amount}} NAV
										</span>
									</td>
									<td class="px-4 py-3">
										<span v-if="tx.address" class="text-xs text-white/30 font-mono">
											{{tx.address.substring(0,6)}}…{{tx.address.slice(-6)}}
										</span>
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
						<p class="text-xs text-white/35 text-center max-w-xs">Your recent transactions will appear here once you send or receive NAV.</p>
					</div>
				</div>
			</div>
		</div>

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
				loading: true
			}
		},
		computed: {
			generateSums() {
				const now = Math.floor(Date.now() / 1000);
				const oneDay = 60 * 60 * 24;
				const oneWeek = oneDay * 7;
				const oneMonth = oneDay * 30;

				let result = {
					day: 0,
					week: 0,
					month: 0
				};

				this.alltxs.forEach(tx => {
					if (tx.category === 'generate') {
						const diff = now - tx.time;
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
					const hStr = h + ' hour' + (h > 1 ? 's' : '');
					return m > 0 ? hStr + ' ' + m + ' minute' + (m > 1 ? 's' : '') + ' ago' : hStr + ' ago';
				} else {
					const d = Math.floor(diff / 86400);
					return d + ' day' + (d > 1 ? 's' : '') + ' ago';
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
			5000);
		},
		beforeUnmount()
		{
			clearInterval(this.timer);
		}
	}
</script>
<style>
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
