<template>
  <div id="modal-add-node" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-2xl max-h-full">
      <div class="relative rounded-xl shadow-2xl glass-modal">
        <div class="flex items-start justify-between p-5 border-b rounded-t border-white/[0.18]">
          <h3 class="text-xl font-semibold lg:text-2xl dark:text-white text-white">Manage Nodes</h3>
          <button id="closeButton" data-modal-hide="modal" type="button" class="text-white/40 hover:text-white/80 bg-transparent rounded-lg p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <p class="font-medium dark:text-white text-white">To connect with a peer, fill out the fields below.</p>
          <div>
            <label for="node_name" class="block mb-2 text-sm font-medium dark:text-white text-white">The address of the peer to connect to</label>
            <input type="text" autofocus id="node_name" v-model="node_name" class="glass-input text-sm block w-full p-2.5">
          </div>
          <div>
            <div class="flex items-center mb-4">
              <input id="add-node-radio-1" type="radio" value="onetry" v-model="node_add_type" name="default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-800 dark:bg-gray-800 dark:border-gray-700 border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
              <label for="add-node-radio-1" class="select-none ms-2 text-sm font-medium text-heading dark:text-white text-white">Try a connection to the node once</label>
            </div>
            <div class="flex items-center mb-4">
              <input id="add-node-radio-2" type="radio" value="add" v-model="node_add_type" name="default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-800 dark:bg-gray-800 dark:border-gray-700 border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
              <label for="add-node-radio-2" class="select-none ms-2 text-sm font-medium text-heading dark:text-white text-white">Add node to the list</label>
            </div>
            <div class="flex items-center">
              <input id="add-node-radio-3" type="radio" value="remove" v-model="node_add_type" name="default-radio" class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-800 dark:bg-gray-800 dark:border-gray-700 border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
              <label for="add-node-radio-3" class="select-none ms-2 text-sm font-medium text-heading dark:text-white text-white">Remove node from the list</label>
            </div>
          </div>
        </div>
        <div class="flex items-center p-6 space-x-2 border-t border-white/[0.18] rounded-b">
          <button :disabled="node_name==''" type="button" id="confirmButton" data-modal-hide="modal" class="text-white font-semibold rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-40 transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">{{(node_add_type=="remove"?"Remove Node":"Add Node")}}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="h-full bg-transparent text-white overflow-auto">
    <!-- Toolbar -->
    <div class="flex items-center gap-3 px-4 pt-3 pb-2">
      <button id="button-add-node" class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
        Manage Nodes
      </button>
      <span class="text-xs text-white/50">{{ peers.length }} peer{{ peers.length !== 1 ? 's' : '' }} connected</span>
    </div>

    <!-- Warning Banner -->
    <div v-if="networkInfo.warnings" class="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-amber-400 mt-0.5 shrink-0">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <span class="text-xs text-amber-300">{{ networkInfo.warnings }}</span>
    </div>

    <!-- Network Info Cards -->
    <div v-if="networkInfo.version" class="px-4 pb-3 space-y-3">
      <!-- Stat row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- Network Status -->
        <div class="relative overflow-hidden rounded-xl p-4 border"
          :class="networkInfo.networkactive ? 'border-emerald-500/25' : 'border-red-500/25'"
          :style="networkInfo.networkactive
            ? 'background: linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.07) 100%); backdrop-filter: blur(12px);'
            : 'background: linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(185,28,28,0.07) 100%); backdrop-filter: blur(12px);'">
          <div class="pointer-events-none absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl"
            :class="networkInfo.networkactive ? 'bg-emerald-500/10' : 'bg-red-500/10'"></div>
          <div class="text-xs font-semibold uppercase tracking-widest mb-2"
            :class="networkInfo.networkactive ? 'text-emerald-400/70' : 'text-red-400/70'">Network</div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full"
              :class="networkInfo.networkactive ? 'bg-emerald-400' : 'bg-red-400'"></span>
            <span class="text-base font-bold text-white">{{ networkInfo.networkactive ? 'Active' : 'Inactive' }}</span>
          </div>
          <div class="mt-1 text-xs text-white/45">Local relay: {{ networkInfo.localrelay ? 'on' : 'off' }}</div>
        </div>

        <!-- Connections -->
        <div class="relative overflow-hidden rounded-xl p-4 border border-blue-500/20"
          style="background: linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.08) 100%); backdrop-filter: blur(12px);">
          <div class="pointer-events-none absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div class="text-xs font-semibold uppercase tracking-widest text-blue-400/70 mb-2">Connections</div>
          <div class="text-2xl font-bold bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 text-transparent">{{ networkInfo.connections }}</div>
          <div class="mt-1 flex gap-2 text-xs text-white/45">
            <span>↓ {{ networkInfo.connections_in }} in</span>
            <span>↑ {{ networkInfo.connections_out }} out</span>
          </div>
        </div>

        <!-- Protocol / Version -->
        <div class="relative overflow-hidden rounded-xl p-4 border border-violet-500/20"
          style="background: linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(219,39,119,0.07) 100%); backdrop-filter: blur(12px);">
          <div class="pointer-events-none absolute -top-4 -right-4 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl"></div>
          <div class="text-xs font-semibold uppercase tracking-widest text-violet-400/70 mb-2">Protocol</div>
          <div class="text-xl font-bold text-white">{{ networkInfo.protocolversion }}</div>
          <div class="mt-1 text-xs text-white/45 truncate" :title="networkInfo.subversion">{{ networkInfo.subversion || ('v' + networkInfo.version) }}</div>
        </div>

        <!-- Relay Fee -->
        <div class="relative overflow-hidden rounded-xl p-4 border border-amber-500/20"
          style="background: linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(217,119,6,0.06) 100%); backdrop-filter: blur(12px);">
          <div class="pointer-events-none absolute -top-4 -right-4 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div class="text-xs font-semibold uppercase tracking-widest text-amber-400/70 mb-2">Relay Fee</div>
          <div class="text-xl font-bold text-white">{{ networkInfo.relayfee }}</div>
          <div class="mt-1 text-xs text-white/45">incr. {{ networkInfo.incrementalfee }} NAV/kB</div>
        </div>
      </div>

      <!-- Networks + Local Addresses row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Network Types -->
        <div class="relative overflow-hidden rounded-xl border border-white/[0.10]"
          style="background: linear-gradient(160deg, rgba(34,26,68,0.65) 0%, rgba(22,28,58,0.65) 100%); backdrop-filter: blur(12px);">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/[0.10]">
            <div class="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/15 border border-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-blue-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-white/80">Network Types</span>
          </div>
          <div class="divide-y divide-white/[0.07]">
            <div v-for="net in networkInfo.networks" :key="net.name"
              class="flex items-center justify-between px-4 py-2.5">
              <span class="text-sm font-medium text-white/70 uppercase tracking-wide">{{ net.name }}</span>
              <div class="flex items-center gap-3">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="net.reachable ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-white/5 text-white/30 border border-white/10'">
                  {{ net.reachable ? 'Reachable' : 'Unreachable' }}
                </span>
                <span v-if="net.limited" class="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Limited</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Local Addresses + Services -->
        <div class="space-y-3">
          <!-- Services -->
          <div class="relative overflow-hidden rounded-xl border border-white/[0.10] px-4 py-3"
            style="background: linear-gradient(160deg, rgba(34,26,68,0.65) 0%, rgba(22,28,58,0.65) 100%); backdrop-filter: blur(12px);">
            <div class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">Local Services</div>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="svc in networkInfo.localservicesnames" :key="svc"
                class="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 font-medium">
                {{ svc }}
              </span>
            </div>
          </div>

          <!-- Local Addresses -->
          <div class="relative overflow-hidden rounded-xl border border-white/[0.10]"
            style="background: linear-gradient(160deg, rgba(34,26,68,0.65) 0%, rgba(22,28,58,0.65) 100%); backdrop-filter: blur(12px);">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/[0.10]">
              <div class="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/15 border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-emerald-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-white/80">Local Addresses</span>
            </div>
            <div v-if="networkInfo.localaddresses && networkInfo.localaddresses.length" class="divide-y divide-white/[0.07]">
              <div v-for="addr in networkInfo.localaddresses" :key="addr.address" class="px-4 py-2.5">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-mono text-white/70 truncate">{{ addr.address }}</span>
                  <span class="shrink-0 text-xs text-white/40">:{{ addr.port }}</span>
                </div>
                <div class="mt-0.5 text-xs text-white/30">score {{ addr.score }}</div>
              </div>
            </div>
            <div v-else class="px-4 py-3 text-xs text-white/30">No local addresses</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Peers Table -->
    <div class="px-4 pb-4">
      <div class="relative overflow-x-auto rounded-xl border border-white/[0.10]"
        style="background: linear-gradient(160deg, rgba(34,26,68,0.5) 0%, rgba(22,28,58,0.5) 100%); backdrop-filter: blur(12px);"
        v-if="peers.length > 0">
        <table class="w-full table-fixed text-sm text-left text-gray-200">
          <colgroup>
            <col class="w-10">
            <col class="w-[28%]">
            <col class="w-[28%]">
            <col class="w-[10%]">
            <col class="w-[10%]">
            <col class="w-[10%]">
            <col class="w-[14%]">
          </colgroup>
          <thead class="text-xs uppercase text-white/40 border-b border-white/[0.10]">
            <tr>
              <th class="px-3 py-3">ID</th>
              <th class="px-3 py-3">Address</th>
              <th class="px-3 py-3">Version</th>
              <th class="px-3 py-3">Height</th>
              <th class="px-3 py-3">Headers</th>
              <th class="px-3 py-3">Blocks</th>
              <th class="px-3 py-3">Type</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[0.06]">
            <tr v-for="peer in peers" :key="peer.id" class="hover:bg-white/[0.04] transition-colors">
              <td class="px-3 py-2.5 text-white/60">{{ peer.id }}</td>
              <td class="px-3 py-2.5 font-mono text-xs text-white/80 truncate" :title="peer.addr">{{ peer.addr }}</td>
              <td class="px-3 py-2.5 text-white/60 text-xs truncate" :title="peer.subver">{{ peer.subver }}</td>
              <td class="px-3 py-2.5 text-white/60 text-xs">{{ peer.startingheight }}</td>
              <td class="px-3 py-2.5 text-white/60 text-xs">{{ peer.synced_headers }}</td>
              <td class="px-3 py-2.5 text-white/60 text-xs">{{ peer.synced_blocks }}</td>
              <td class="px-3 py-2.5">
                <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/15 truncate block text-center">{{ peer.connection_type }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-12 px-6">
        <p class="text-sm text-white/40">No peers connected.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import '@sweetalert2/theme-dark/dark.scss';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
})

export default {
  data() {
    return {
      peers: [],
      networkInfo: {},
      intervalId: undefined,
      node_name: '',
      node_add_type: 'onetry',
    }
  },
  methods: {
    getpeerinfo() {
      this.client.command([{ method: 'getpeerinfo' }]).then((r) => {
        if (r[0] && (r[0].name === 'RpcError' || r[0].code)) {
          console.log('getpeerinfo RpcError', r);
        } else {
          this.peers = r[0];
        }
      });
    },
    getnetworkinfo() {
      this.client.command([{ method: 'getnetworkinfo' }]).then((r) => {
        if (r[0] && (r[0].name === 'RpcError' || r[0].code)) {
          console.log('getnetworkinfo RpcError', r);
        } else {
          this.networkInfo = r[0];
        }
      });
    },
  },
  mounted() {
    this.getpeerinfo();
    this.getnetworkinfo();
    this.intervalId = window.setInterval(() => {
      this.getpeerinfo();
      this.getnetworkinfo();
    }, 5000);

    let $buttonElement = document.querySelector('#button-add-node');
    let $modalElement = document.querySelector('#modal-add-node');
    let $confirmButton = document.querySelector('#confirmButton');
    let $closeButton = document.querySelector('#closeButton');
    let modalOptions = { backdropClasses: 'bg-black/60 backdrop-blur-sm fixed inset-0 z-40' }

    if ($modalElement) {
      let modal = new Modal($modalElement, modalOptions);
      $buttonElement.addEventListener('click', () => modal.toggle());
      $confirmButton.addEventListener('click', () => {
        this.client.command([{ method: 'addnode', parameters: [this.node_name, this.node_add_type] }]).then((r) => {
          if (r[0] && r[0].code) {
            Swal.fire({ theme: 'dark', title: 'Error!', text: r[0].message, icon: 'error', confirmButtonText: 'OK' });
          } else {
            Toast.fire({ theme: 'dark', icon: 'success', title: 'Success' });
          }
        });
        modal.hide();
      });
      $closeButton.addEventListener('click', () => modal.hide());
    }
  },
  unmounted() {
    window.clearInterval(this.intervalId);
  }
}
</script>
