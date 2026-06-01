<template>
  <!-- QR Modal -->
  <div id="modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-sm max-h-full">
      <div class="relative rounded-xl shadow-2xl glass-modal">
        <div class="flex items-center justify-between p-4 border-b border-white/[0.18]">
          <h3 class="text-base font-semibold text-white">QR Code</h3>
          <button v-on:click="hide()" type="button" class="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <div class="p-6 flex flex-col items-center gap-4">
          <div id="canvas"></div>
          <p class="font-mono text-xs text-white/80 text-center break-all leading-relaxed">{{ qr_address }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Page -->
  <div class="h-full bg-transparent text-white">
    <div v-if="$store.state.active_wallet">

      <!-- Header -->
      <div class="px-4 py-3">
        <button v-on:click="generate_new_address()" type="button"
          class="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-semibold text-white rounded-lg focus:outline-none transition-opacity hover:opacity-85" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Address
        </button>
      </div>

      <!-- Address list -->
      <div class="px-4 pb-4 overflow-auto">
        <div v-if="all_addresses && Object.keys(all_addresses).length > 0" class="flex flex-col gap-2">
          <div
            v-for="address in all_addresses"
            :key="address.address"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.16] glass-card hover:border-white/10 hover:bg-white/[0.10] transition-all">

            <!-- Address info -->
            <div class="flex-1 min-w-0">
              <span class="font-mono text-sm text-white/90 block" :title="address.address">
                {{ truncateAddress(address.address) }}
              </span>
              <span v-if="address.label" class="text-xs text-indigo-400 mt-0.5 block">
                {{ address.label }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <button @click.stop="docopy(address.address)" type="button" title="Copy"
                class="inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg text-white bg-white/10 hover:bg-purple-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </button>
              <button @click.stop="show(address.address)" type="button" title="QR Code"
                class="inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg text-white bg-white/10 hover:bg-purple-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="empty-state">
          <div class="empty-icon-ring">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="empty-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
            </svg>
          </div>
          <h2 class="empty-title">No Addresses Yet</h2>
          <p class="empty-desc">
            Generate your first receive address using the<br>
            <span class="empty-highlight">New Address</span> button above.
          </p>
        </div>
      </div>
    </div>
    <NoWalletSelected v-else />
  </div>
</template>

<script>
    import QRCodeStyling from "qr-code-styling";
    import Swal from 'sweetalert2';
    import '@sweetalert2/theme-dark/dark.scss';
    import NoWalletSelected from '../components/NoWalletSelected.vue';
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    })
    export default {
        components: { NoWalletSelected },
        data() {
            return {
                all_addresses: undefined,
                qr_address: undefined,
                modal: undefined,
                prefix: 'nav:'
            }
        },
        methods: {
            truncateAddress(addr) {
                if (!addr || addr.length <= 24) return addr;
                return addr.slice(0, 10) + '···' + addr.slice(-10);
            },
            docopy(t) {
                this.$copyText(t);
                Toast.fire({
                    theme: 'dark',
                    icon: 'success',
                    title: 'Copied',
                });
            },
            list_all_addresses() {
                let vm = this;
                this.client.command([{ method: "listreceivedbyaddress", parameters: [0, true] }]).then((r) => {
                    if (r[0].name == "RpcError" || r[0].code) {
                        console.log("RpcError", r);
                    } else {
                        vm.all_addresses = r[0];
                    }
                });
            },
            generate_new_address() {
                let vm = this;
                this.client.command([{ method: "getnewaddress", parameters: { "label": "", "address_type": "blsct" } }]).then((r) => {
                    if (r[0].name == "RpcError" || r[0].code) {
                        Swal.fire({ theme: 'dark', title: 'Error!', text: r[0].message, icon: 'error', confirmButtonText: 'OK' });
                    } else {
                        vm.list_all_addresses();
                        Swal.fire({ theme: 'dark', title: 'Success!', text: "New address successfully generated.", icon: 'success', confirmButtonText: 'OK' });
                    }
                });
            },
            generate_block(n) {
                let vm = this;
                this.client.command([{ method: "generatetoblsctaddress", parameters: { "nblocks": n, "address": vm.active_address } }]).then((r) => {
                    if (r[0].name == "RpcError" || r[0].code) {
                        Swal.fire({ theme: 'dark', title: 'Error!', text: r[0].message, icon: 'error', confirmButtonText: 'OK' });
                    } else {
                        vm.list_all_addresses();
                        Swal.fire({ theme: 'dark', title: 'Success!', text: "New block successfully generated.", icon: 'success', confirmButtonText: 'OK' });
                    }
                });
            },
            show(address) {
                const qrCode = new QRCodeStyling({
                    width: 280,
                    height: 280,
                    type: "svg",
                    data: this.prefix + address,
                    image: "https://raw.githubusercontent.com/anquii/navcoin-assets/main/xnav/xnav-logo-border.svg",
                    dotsOptions: { color: "#4267b2", type: "rounded" },
                    backgroundOptions: { color: "#e9ebee" },
                    imageOptions: { crossOrigin: "anonymous", margin: 20 }
                });
                document.getElementById("canvas").innerHTML = "";
                qrCode.append(document.getElementById("canvas"));
                this.qr_address = address;
                this.modal.show();
            },
            hide() {
                this.modal.hide();
            }
        },
        mounted() {
            this.list_all_addresses();
            initFlowbite();
            this.modal = new Modal(document.querySelector('#modal'), {
                backdropClasses: 'bg-transparent/50 dark:bg-transparent/80 fixed inset-0 z-40'
            });
        }
    }
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
  color: rgba(255, 255, 255, 0.97);
  margin-bottom: 0.5rem;
}
.empty-desc {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.70);
  line-height: 1.65;
  max-width: 260px;
}
.empty-highlight {
  color: rgba(167, 139, 250, 0.85);
  font-weight: 500;
}
</style>
