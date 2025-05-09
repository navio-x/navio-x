<template>
	<div class="h-full bg-zinc-900 text-white">
		<div v-if="balance">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 text-lg">
				<div class="grid grid-cols-2 gap-4 p-10">
					<div class="col-span-2 text-3xl text-white">
						<span class="bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 text-transparent">Available</span>
					</div>
					<div class="col-span-2 text-2xl text-white font-bold mt-2">{{formatNumbers(balance.mine.trusted)}}</div>
					<div class="text-gray-500">Pending</div>
					<div class="text-gray-200">{{formatNumbers(balance.mine.untrusted_pending)}}</div>
					<div class="text-gray-500">Immature</div>
					<div class="text-gray-200" title="Immature staking coins will mature after 100 blocks.">{{formatNumbers(balance.mine.immature)}}</div>
					<div class="text-gray-500">Total</div>
					<div class="text-gray-200">{{formatNumbers(getTotal(balance))}}</div>
				</div>
				<div class="grid grid-cols-2 gap-4 p-10 ml-5" v-show="balance">
					<div class="col-span-2 text-4xl text-white inline-flex items-baseline items-center">
						<div class="col-span-2 text-3xl">
							<span class="bg-clip-text bg-gradient-to-br from-orange-400 to-fuchsia-700 text-transparent">Private Staking</span>
						</div>
					</div>
					<div class="col-span-2 text-2xl text-white font-bold mt-2">{{formatNumbers(balance.mine.staked_commitment_balance)}}</div>
					<div class="text-gray-500">24H</div>
					<div class="text-gray-200">{{ generateSums.day }}</div>
					<div class="text-gray-500">7D</div>
					<div class="text-gray-200">{{ generateSums.week }}</div>
					<div class="text-gray-500">30D</div>
					<div class="text-gray-200">{{ generateSums.month }}</div>
				</div>
			</div>
			<div class="mt-1 overflow-auto bg-zinc-900">
				<div class="p-10">
					<div class="col-span-2 text-4xl text-white inline-flex items-baseline items-center">
						<span self-center>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
						</span>
						<h2 class="ml-1 text-xl text-gray-50 self-center">
							Recent Transactions
						</h2>
					</div>
					<table class="bg-zinc-900 border-b border-zinc-800 p-2" v-if="txs.length>0">
						<tr v-for="(tx,index) in txs" class="border-b border-zinc-800">
							<td class="p-3">
								<span class="bg-gray-700 text-gray-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{{format(tx.time,'DD.MM.YY&nbsp;HH:mm:ss')}}</span>
							</td>
							<td class="p-3">
								<span v-if="tx.blockheight" class="bg-yellow-900 text-yellow-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{{tx.blockheight}}</span>
							</td>
							<td class="p-3">
								<span v-if="tx.label" class="bg-blue-900 text-blue-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 whitespace-nowrap">{{tx.label}}</span>
							</td>
							<td class="p-3">
								<span class="bg-gray-700 text-gray-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 whitespace-nowrap">{{tx.category}}</span>

							</td>
							<td class="p-3">
								<svg v-if="tx.category=='receive'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-400">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
								</svg>
								<svg v-if="tx.category=='send'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-400">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
								</svg>
							</td>
							<td class="p-3">
								<span class="bg-indigo-900 text-indigo-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">{{(tx.amount>0?"+"+tx.amount:tx.amount)}}</span>
							</td>
							<td class="p-3">
								<span v-if="tx.address" class="bg-gray-700 text-gray-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{{tx.address.substring(0,5)}}...{{tx.address.slice(-5)}}</span>
							</td>
						</tr>
					</table>
					<div v-else class="dark:text-white text-white">No recent transaction found.</div>
				</div>
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
	import moment from 'moment';
	import sb from 'satoshi-bitcoin';
	import { computed } from 'vue';

	export default {
		data() {
			return {
				balance:undefined,
				txs: [],
				alltxs:[]
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
					//console.log(r);
					vm.balance=r;
				})
				.catch((r) =>
				{
					console.log(r);
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
