<script setup>
    import { Vue } from 'vue'
    const isWeb = !!import.meta.env.VITE_WEB
</script>

<template>
    <TitleBar v-if="!isWeb" :network="state === 'ready' ? chain : null" />

    <section
    class="h-screen bg-transparent flex items-center justify-center"
    :class="{ 'pt-9': !isWeb }"
    v-show="state === 'welcome'"
    >
    <div class="px-6 mx-auto max-w-screen-md text-center">

        <!-- Illustration -->
        <div class="flex justify-center mb-6">
         <img
         src="./assets/navio-x.png"
         alt="Navio X"
         class="
         w-[256px]
         h-[256px]
         object-contain
         select-none
         pointer-events-none
         "
         >

     </div>

     <!-- Title -->
     <h1
     class="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl text-white brand"
     >
     Navio X
 </h1>

 <!-- Subtitle -->
 <p class="text-lg text-gray-300">
  Secure desktop wallet for the Navio network
</p>

<!-- Mini description -->
<p class="mt-2 mb-8 text-sm text-gray-300">
  Runs locally on your computer. No cloud services. No user accounts.
</p>

<!-- Single Action -->
<div class="flex justify-center">
  <button
  @click="get_started()"
  class="inline-flex justify-center items-center px-7 py-3 text-base font-medium
  text-white rounded-lg bg-blue-600 hover:bg-blue-700
  focus:ring-4 focus:ring-blue-500/40 transition"
  >
  Continue
  <svg
  class="w-3.5 h-3.5 ml-2"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 14 10"
  >
  <path
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  d="M1 5h12m0 0L9 1m4 4L9 9"
  />
</svg>
</button>
</div>
</div>
</section>

<section class="h-screen bg-transparent flex items-center justify-center" :class="{ 'pt-9': !isWeb }" v-show="state=='connection_error'">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 flex flex-col justify-center items-center h-full w-full">
        <div class="flex justify-center items-center">
            <img src="./assets/nav_illustraion_01.png" style="width:300px;height:auto;">
        </div>
        <h1 class="mt-5 mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl dark:text-white brand">Navio X</h1>
        <p class="mb-8 text-lg font-normal text-gray-300 sm:px-16 lg:px-48 dark:text-gray-200">Connection error</p>
        <p class="mt-5 mb-8 text-sm font-normal text-gray-300 sm:px-16 lg:px-48 dark:text-gray-300">Unable to connect to Navio daemon. Please make sure that the Navio daemon is running and the RPC connection information (rpcuser & rpcpassword) matches the information you entered. Below you can find the command line required to run the Navio daemon.</p>
        <code class="mt-10 p-5 text-sm border text-white glass-card rounded-lg">screen ./naviod --printtoconsole --walletcrosschain -rpcuser=<span class="text-blue-500"><code>username</code></span> -rpcpassword=<span class="text-blue-500"><code>password</code></span></code>
        <div class="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
            <button v-on:click="state='setup'" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                Connect
                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </button>
            <button v-on:click="downloadBinaries()" :disabled="is_fetching_releases" class="inline-flex justify-center items-center ml-5 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 disabled:opacity-60 disabled:cursor-not-allowed">
                {{ is_fetching_releases ? 'Checking GitHub releases…' : 'Download binaries' }}
                <svg v-if="!is_fetching_releases" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 ms-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
              </svg>
              <svg v-else class="w-3.5 h-3.5 ms-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
          </button>
      </div>
  </div>
</section>
<section class="h-screen bg-transparent" :class="{ 'pt-9': !isWeb }" v-show="state=='download_progress'">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 flex flex-col justify-center items-center h-full w-full">
      <div class="sm:px-16 lg:px-48 mx-auto max-w-screen-xl text-center lg:py-16 flex flex-col justify-center items-center h-full w-full">
        <!-- From Uiverse.io by Z4drus --> 
        <div class="container">
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
      </div>
      <div class="w-full flex justify-between mt-20">
          <span class="text-base font-medium text-white/90">Downloading binary files for <b>{{friendly_platform(fileinfo.platform)}} {{fileinfo.arch}}</b> from GitHub releases</span>
          <span id="progress-text" class="text-sm font-medium text-white/90">0%</span>
      </div>
      <div class="w-full bg-white/[0.16] rounded-full h-2">
          <div id="progress-bar" class="h-2 rounded-full transition-all" style="width: 0%; background: linear-gradient(90deg, #7c3aed, #3b82f6);"></div>
      </div>
  </div>
</div>
</section>

<section class="min-h-screen bg-transparent flex flex-col items-center justify-center px-4" :class="{ 'pt-9': !isWeb }" v-show="state=='select_binary'">
  <div class="w-full max-w-3xl">
    <div class="flex items-center justify-between gap-4 mb-2">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white brand">Select a Binary</h1>
      <a
        href="https://github.com/nav-io/navio-core"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 border border-white/[0.12] hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
      >
        <svg viewBox="0 0 16 16" class="w-4 h-4" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        GitHub
      </a>
    </div>
    <p class="mb-6 text-gray-200">
      Choose a compatible build from GitHub releases for
      <b class="text-white">{{ friendly_platform(binarySelectionInfo.platform) }} {{ binarySelectionInfo.arch }}</b>.
    </p>

    <div class="rounded-xl overflow-hidden border border-white/[0.10]" style="background: linear-gradient(160deg, rgba(20,14,48,0.97) 0%, rgba(13,17,40,0.97) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
      <div class="max-h-[420px] overflow-y-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr>
              <th class="sticky top-0 z-10 px-4 py-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-white/40" style="background: rgb(20,16,46); border-bottom: 1px solid rgba(255,255,255,0.08);">Version</th>
              <th class="sticky top-0 z-10 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/40" style="background: rgb(20,16,46); border-bottom: 1px solid rgba(255,255,255,0.08);">Filename</th>
              <th class="sticky top-0 z-10 px-4 py-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-white/40" style="background: rgb(20,16,46); border-bottom: 1px solid rgba(255,255,255,0.08);">Date</th>
              <th class="sticky top-0 z-10 px-4 py-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-white/40" style="background: rgb(20,16,46); border-bottom: 1px solid rgba(255,255,255,0.08);">Size</th>
              <th class="sticky top-0 z-10 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-white/40" style="background: rgb(20,16,46); border-bottom: 1px solid rgba(255,255,255,0.08);">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bin in availableBinaries" :key="bin.tag + '-' + bin.name" class="border-t border-white/[0.07] hover:bg-white/[0.04] transition-colors">
              <td class="px-4 py-3 whitespace-nowrap">
                <a
                  v-if="bin.tagUrl"
                  :href="bin.tagUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-block px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                >{{ bin.tag || '—' }}</a>
                <span v-else class="inline-block px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">{{ bin.tag || '—' }}</span>
                <span
                  v-if="bin.latest"
                  class="ml-2 inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-green-500/20 text-green-300 border border-green-500/40 align-middle"
                >latest</span>
              </td>
              <td class="px-4 py-3 font-mono text-white/85 break-all text-sm">{{ bin.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-white/55">{{ format_listing_date(bin) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-white/55">{{ bin.size || '—' }}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <button
                  v-if="bin.notes"
                  @click="show_release_notes(bin)"
                  title="What's changed"
                  class="inline-flex justify-center items-center w-8 h-8 mr-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors align-middle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </button>
                <button
                  @click="select_binary(bin)"
                  class="inline-flex justify-center items-center py-1.5 px-4 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-80 align-middle"
                  style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);"
                >Download</button>
              </td>
            </tr>
            <tr v-if="!availableBinaries.length">
              <td colspan="5" class="px-4 py-6 text-center text-white/50">No compatible binaries found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <button
        @click="state='select_daemon_method'"
        class="py-2 px-5 text-sm font-medium rounded-lg glass-btn-secondary focus:outline-none"
      >Back</button>
    </div>
  </div>
</section>

<section class="h-full w-full bg-transparent overflow-auto" :class="{ 'pt-9': !isWeb }" v-show="state=='agreement'">
    <div class="px-10 pt-6 pb-10 mx-auto max-w-screen-xl">
        <p class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white">License Agreement</p>
        <div class="w-full h-full text-white">
          <p>
            This is a binding Agreement between Navio Developers (“Navio” or “We”) and the person, persons, or entity (“You” or “Your”) using the service, Software, or application (“Software”).
        </p>
        <p class="text-xl font-bold mt-5">
            RIGHTS AND OBLIGATIONS
        </p>
        <p>
            Navio provides the Software solely on the terms and conditions set forth in this Agreement and on the condition that You accept and comply with them. By using the Software You (a) accept this Agreement and agree that You are legally bound by its terms; and (b) represent and warrant that: (i) You are of legal age to enter into a binding agreement; and (ii) if You are a corporation, governmental organization or other legal entity, You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental organization or other legal entity and bind them to these terms.
        </p>
        <p>
            This Software functions as a free, open source, and multi-signature digital wallet. The Software does not constitute an account where We or other third parties serve as financial intermediaries or custodians of Your Navio(s).
        </p>
        <p>
            While the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key pairs, PINs, and any other codes You use to access the Software.
        </p>
        <p>
            IF YOU LOSE ACCESS TO YOUR NAVIO-X WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY NAV YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the Software, employees and affiliates of NAVIO, copyright holders, and NAVIO cannot retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control over the Navio network.
        </p>
        <p class="text-xl font-bold mt-5">
            DISCLAIMER
        </p>
        <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES OF NAVIO, COPYRIGHT HOLDERS, OR NAVIO BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
        <p>
            IN NO EVENT WILL NAVIO OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY TRANSFER, READ OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION OF INCORRECT COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p class="text-xl font-bold mt-5">
            INTELLECTUAL PROPERTY
        </p>
        <p>
            We retain all right, title, and interest in and to the Content and all of Navio’s brands, logos, and trademarks, including, but not limited to, Navio, Navio-X Wallet, and variations of the wording of the aforementioned brands, logos, and trademarks.
        </p>
        <p class="text-xl font-bold mt-5">
            CHOICE OF LAW
        </p>
        <p>
            This Agreement, and its application and interpretation, shall be governed exclusively by the laws of the State of Georgia, without regard to its conflict of law rules. You consent to the exclusive jurisdiction of the federal and state courts located in or near Atlanta, Georgia for any dispute arising under this Agreement.
        </p>
        <p class="text-xl font-bold mt-5">
            SEVERABILITY
        </p>
        <p>
            In the event any court shall declare any section or sections of this Agreement invalid or void, such declaration shall not invalidate the entire Agreement and all other paragraphs of the Agreement shall remain in full force and effect.
        </p>
        <p class="text-xl font-bold mt-5">
            BINDING AGREEMENT
        </p>
        <p>
            The terms and provisions of this Agreement are binding upon Your heirs, successors, assigns, and other representatives. This Agreement may be executed in counterparts, each of which shall be considered to be an original, but both of which constitute the same Agreement.
        </p>
        <p>
            You assume any and all risks associated with the use of the Software. We reserve the right to modify this Agreement from time to time.
        </p>
    </div>
    <div class="flex justify-center mt-8">
        <button v-on:click="accept_agreement()" class="inline-flex items-center gap-2 py-2 px-5 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors">
            I Agree
            <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
    </div>
</div>
</section>

<NetworkSelector
v-show="state=='select_network'"
:networks="networks"
:current="network"
@select="on_network_selected"
@back="state='agreement'"
/>

<section
  class="min-h-screen bg-transparent flex flex-col items-center justify-center"
  :class="{ 'pt-9': !isWeb }"
  v-show="state=='select_daemon_method'"
>
  <div class="mb-8 flex justify-center">
    <img src="./assets/setup.svg" class="w-[72px] h-auto" />
  </div>

  <div class="px-4 max-w-screen-sm w-full text-center">
    <h1 class="mb-3 text-4xl font-extrabold tracking-tight text-white brand">
      Choose a method
    </h1>
    <p class="mb-10 text-base text-gray-300">
      Download the official Navio binaries automatically, or connect to a node you manage yourself.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Download Binaries -->
      <button
        @click="downloadBinaries()"
        :disabled="is_fetching_releases"
        class="glass-card glass-card-hover rounded-xl p-5 text-left flex flex-col items-start gap-3 cursor-pointer transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        style="border-color: rgba(139,92,246,0.40);"
      >
        <div class="flex items-center justify-between w-full">
          <div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);">
            <svg v-if="!is_fetching_releases" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <svg v-else class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
          <span v-if="!is_fetching_releases" class="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Recommended</span>
        </div>
        <div>
          <p class="text-white font-semibold text-sm">{{ is_fetching_releases ? 'Checking GitHub releases…' : 'Download Binaries' }}</p>
          <p class="text-gray-400 text-xs mt-1 leading-relaxed">Automatically fetch the latest official Navio binaries from GitHub releases.</p>
        </div>
      </button>

      <!-- Manual Connection -->
      <button
        @click="state='setup'"
        class="glass-card glass-card-hover rounded-xl p-5 text-left flex flex-col items-start gap-3 cursor-pointer transition-all focus:outline-none"
      >
        <div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white/80">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div>
          <p class="text-white font-semibold text-sm">Manual Connection</p>
          <p class="text-gray-400 text-xs mt-1 leading-relaxed">Connect to a Navio node you started yourself using custom RPC credentials.</p>
        </div>
      </button>
    </div>

    <!-- Open Binaries Folder (secondary) -->
    <div v-if="binDir" class="mt-5 flex justify-center">
      <button
        @click="open_bin_directory()"
        class="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors glass-btn-secondary rounded-lg px-4 py-2 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
        Open Binaries Folder
      </button>
    </div>
  </div>
</section>

<section class="h-screen bg-transparent" :class="{ 'pt-9': !isWeb }" v-show="state=='setup'">
  <div class="flex flex-col items-center justify-center px-6 py-4 mx-auto h-full">
    <div class="w-full rounded-xl border sm:max-w-md" style="background: linear-gradient(160deg, rgba(34,26,68,0.95) 0%, rgba(22,28,58,0.95) 100%); border-color: rgba(255,255,255,0.18); backdrop-filter: blur(16px);">
      <div class="p-5 space-y-3">
        <h1 class="text-lg font-bold leading-tight tracking-tight text-white">Manual Connection</h1>
        <p class="text-xs text-white/60">Enter the RPC details you set when starting the Navio daemon.</p>
        <div class="space-y-3">
          <div>
            <label class="block mb-1 text-xs font-medium text-white/80">Network</label>
            <div class="flex gap-4">
              <label v-for="net in networks" :key="net.name" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="network" :value="net.name" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2">
                <span class="text-sm text-white">{{ net.label }}</span>
                <span class="text-xs text-zinc-400">({{ net.port }})</span>
              </label>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="host" class="block mb-1 text-xs font-medium text-white/80">Host</label>
              <input type="text" v-model="host" id="host" class="glass-input block w-full p-2 text-sm rounded-lg" required="">
            </div>
            <div>
              <label for="port" class="block mb-1 text-xs font-medium text-white/80">Port</label>
              <input type="text" v-model="port" id="port" class="glass-input block w-full p-2 text-sm rounded-lg" required="">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="username" class="block mb-1 text-xs font-medium text-white/80">Username</label>
              <input type="text" v-model="username" id="username" class="glass-input block w-full p-2 text-sm rounded-lg" required="">
            </div>
            <div>
              <label for="password" class="block mb-1 text-xs font-medium text-white/80">Password</label>
              <input type="password" v-model="password" id="password" class="glass-input block w-full p-2 text-sm rounded-lg" required="">
            </div>
          </div>
          <div class="flex items-center gap-5">
            <label class="flex items-center gap-2 cursor-pointer">
              <input id="remember" v-model="remember" type="checkbox" class="w-4 h-4 rounded accent-violet-500 bg-white/10 border border-white/20">
              <span class="text-sm text-white">Remember me</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input id="auto_login" v-model="auto_login" type="checkbox" class="w-4 h-4 rounded accent-violet-500 bg-white/10 border border-white/20">
              <span class="text-sm text-white">Auto login</span>
            </label>
          </div>
          <button :disabled="!username||!password" v-on:click="connect()" class="w-full text-white disabled:opacity-40 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-800 focus:outline-none transition">Connect</button>
          <button v-on:click="select_daemon_method()" class="w-full font-medium rounded-lg text-sm px-5 py-2 text-center glass-btn-secondary focus:outline-none">Back</button>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="flex items-center justify-center h-screen bg-transparent" :class="{ 'pt-9': !isWeb }" v-show="state=='connected'">
    <div class="relative p-6 text-center rounded-2xl shadow-2xl sm:p-8 glass-card">
        <div class="w-14 h-14 rounded-full bg-green-900/60 border border-green-500/30 p-2 flex items-center justify-center mx-auto mb-3.5">
            <svg aria-hidden="true" class="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            <span class="sr-only">Success</span>
        </div>
        <p class="mb-4 text-3xl text-white dark:text-white">Congratulations!</p>
        <p class="mb-4 text-lg font-semibold text-white dark:text-white">Successfully connected to Navio daemon.</p>
        <button v-on:click="state='ready'" data-modal-toggle="successModal" type="button" class="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900">
            Continue
        </button>
    </div>
</div>

<div id="nav" v-show="state=='ready'">
  <aside id="default-sidebar" class="fixed left-0 z-40 w-64 flex flex-col sidebar-glass" :class="isWeb ? 'top-0 h-screen' : 'top-9 h-[calc(100vh-36px)]'" aria-label="Sidebar">

    <!-- Ambient glow blobs -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-none">
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-32 -left-8 w-36 h-36 bg-blue-600/15 rounded-full blur-3xl"></div>
  </div>

  <!-- Main nav -->
  <nav class="relative flex-1 overflow-y-auto px-3 pt-4 pb-2">
      <router-link to="/home"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhHouse :size="19" weight="duotone" class="shrink-0" />
        <span>Home</span>
      </router-link>

      <router-link to="/wallets"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhWallet :size="19" weight="duotone" class="shrink-0" />
        <span>Wallets</span>
      </router-link>

      <router-link to="/send"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhPaperPlaneTilt :size="19" weight="duotone" class="shrink-0" />
        <span>Send</span>
      </router-link>

      <router-link to="/receive"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhArrowCircleDown :size="19" weight="duotone" class="shrink-0" />
        <span>Receive</span>
      </router-link>

      <router-link to="/history"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhClockCounterClockwise :size="19" weight="duotone" class="shrink-0" />
        <span>History</span>
      </router-link>

      <router-link to="/staking"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium"
      active-class="nav-item-active">
        <PhDatabase :size="19" weight="duotone" class="shrink-0" />
        <span>Staking</span>
      </router-link>

      <div class="my-3 border-t border-white/[0.14]"></div>
      <p class="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">Tools</p>

      <router-link to="/console"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhTerminalWindow :size="19" weight="duotone" class="shrink-0" />
        <span>Console</span>
      </router-link>

      <router-link to="/settings"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium mb-0.5"
      active-class="nav-item-active">
        <PhGearSix :size="19" weight="duotone" class="shrink-0" />
        <span>Settings</span>
      </router-link>

      <router-link to="/about"
      class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.12] transition-all text-sm font-medium"
      active-class="nav-item-active">
        <PhInfo :size="19" weight="duotone" class="shrink-0" />
        <span>About</span>
      </router-link>
</nav>

<!-- Status card -->
<div class="relative px-3 py-4 border-t border-white/[0.14] shrink-0">
  <div v-if="chain" class="status-glass rounded-xl px-3 py-3 space-y-2.5">
    <div class="flex items-center gap-2 min-w-0">
      <span :class="$store.state.active_wallet ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-white/20'" class="w-1.5 h-1.5 rounded-full shrink-0 transition-all"></span>
      <span class="text-xs text-white/90 truncate font-medium">{{ $store.state.active_wallet || 'No wallet selected' }}</span>
  </div>
  <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[11px] text-white/60">{{ blocks == headers ? 'Synced' : 'Syncing...' }}</span>
        <span :class="blocks == headers ? 'text-emerald-400' : 'text-violet-400'" class="text-[11px] font-semibold">{{ get_sync_percent() }}%</span>
    </div>
    <div class="bg-white/[0.16] rounded-full h-1">
        <div class="h-1 rounded-full transition-all duration-500 progress-gradient" :style="{ width: get_sync_percent() + '%' }"></div>
    </div>
</div>
<div class="flex items-center justify-between">
  <span class="text-[11px] text-white/55 capitalize font-medium">{{ chain }}</span>
  <router-link to="/peers" class="text-[11px] text-white/90 hover:text-white/80 transition-colors" :title="'Protocol: ' + networkinfo.protocolversion">
    {{ networkinfo.connections ? networkinfo.connections + ' peer' + (networkinfo.connections > 1 ? 's' : '') : 'No peers' }}
</router-link>
</div>
<div class="border-t border-white/[0.14] pt-2 flex items-center justify-between">
  <span class="text-[11px] text-white/55">Blocks</span>
  <span class="text-[11px] font-mono">
    <span class="text-white/80">{{ blocks.toLocaleString() }}</span>
    <span class="text-white/45 mx-1">/</span>
    <span :class="blocks == headers ? 'text-emerald-400/70' : 'text-violet-400/70'">{{ headers.toLocaleString() }}</span>
</span>
</div>
</div>
<div v-else class="flex items-center gap-2.5 px-1 py-2">
    <svg class="w-4 h-4 text-violet-400 animate-spin shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  <span class="text-xs text-white/90">Initializing...</span>
</div>
</div>

</aside>

<div class="sm:ml-64" :class="isWeb ? 'h-screen' : 'h-[calc(100vh-36px)] mt-9'">
  <router-view />
</div>
</div>


</template>
<script>
    import { ipcRenderer } from 'electron';
    import { getCurrentInstance } from 'vue';
    import Swal from 'sweetalert2';
    import '@sweetalert2/theme-dark/dark.scss';
    import Client from 'bitcoin-core';
    import NetworkSelector from './views/network.vue';
    import TitleBar from './components/TitleBar.vue';
    import {
        PhHouse, PhWallet, PhPaperPlaneTilt, PhArrowCircleDown,
        PhClockCounterClockwise, PhDatabase, PhTerminalWindow,
        PhGearSix, PhInfo
    } from '@phosphor-icons/vue';
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
    })
    export default {
      components: {
          NetworkSelector, TitleBar,
          PhHouse, PhWallet, PhPaperPlaneTilt, PhArrowCircleDown,
          PhClockCounterClockwise, PhDatabase, PhTerminalWindow,
          PhGearSix, PhInfo
      },
      data() {
        const networks = [
          { name: 'mainnet', label: 'Mainnet', port: 48471, communityNode: 'mainnet-navio.nav.community', description: 'The live Navio network. Transactions here use real NAV with real value.' },
          { name: 'testnet', label: 'Testnet', port: 33677, communityNode: 'testnet-navio.nav.community', description: 'Development and testing network. Use this to try features without risking real NAV.' },
      ];
      const savedNetwork = localStorage.getItem('network') || 'mainnet';
      const savedPort    = localStorage.getItem('port')    || (networks.find(n => n.name === savedNetwork)?.port ?? 48471);
      return {
          networks,
          app:null,
          state: "",
          username:"",
          password:"",
          host: localStorage.getItem('host') || "localhost",
          port: savedPort,
          network: savedNetwork,
          blocks:0,
          headers:0,
          chain:undefined,
          networkinfo:{},
          remember:false,
          auto_login:false,
          is_downloading:false,
          is_fetching_releases:false,
          fileinfo:{},
          availableBinaries: [],
          binarySelectionInfo: { platform: '', arch: '' },
          binDir: null,
      }
  },
  watch: {
    network(val) {
      const found = this.networks.find(n => n.name === val);
      if (found) this.port = found.port;
    },
    '$store.state.active_wallet'(val) {
      if (this.client) this.client.wallet = val;
    }
  },
methods: {
    friendly_platform: function(p) {
        const names = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' };
        return names[p] || p;
    },
    open_bin_directory: function() {
        ipcRenderer.invoke('shell-open-folder', this.binDir);
    },
    get_started: function() {
        this.state='agreement';
    },
    get_sync_percent: function() {
        return (this.blocks?parseFloat((this.blocks*100)/this.headers).toFixed(2):0);
    },
    select_daemon_method: function() {
        this.state='select_daemon_method';
    },
    accept_agreement: function() {
        localStorage.setItem('agreement_accepted', 1);
        if (this.$store.state.is_daemon_auto_started)
        {
            this.remember=true;
            this.auto_login=true;
            this.connect();
        }
        else
        {
            this.state='select_network';
        }
    },
    on_network_selected: function(net) {
        this.network = net.name;
        this.port    = net.port;
        localStorage.setItem('network', net.name);
        ipcRenderer.invoke('save-network', net.name);
        this.state = import.meta.env.VITE_WEB ? 'setup' : 'select_daemon_method';
    },
    getBlockChainInfo: function() {
        const batch = [{ method: "getblockchaininfo" }];
        let vm=this;
        this.client.command(batch).then((r) => 
        {
            vm.chain=r[0].chain;
            vm.blocks=r[0].blocks;
            vm.headers=r[0].headers;
            if (!vm.$store.state.active_wallet)
            {
                console.log("Listing wallets...");
                this.client.command([{ method: "listwallets" }]).then((r) => 
                {
                    console.log(r);
                    console.log("Loaded wallets : " + r.length);
                    if (r.length==1)
                    {
                        console.log("1 Wallet loaded, activating wallet '" + r[0][0] + "'");
                        vm.client.wallet=r[0][0];
                        vm.$store.commit('set_active_wallet',r[0][0]);
                    }
                });
            }
            //console.log(r);
        }).catch((r) =>
        {
            console.log(r);
        });
    },
    getNetworkInfo: function() {
        const batch = [{ method: "getnetworkinfo" }];
        let vm=this;
        this.client.command(batch).then((r) => 
        {
            vm.networkinfo=r[0];
            //console.log(r);
        }).catch((r) =>
        {
            console.log(r);
        });
    },
    stop_staking : function()
    {
        if (this.state !== 'ready') return;
        let vm=this;
        if (vm.$store.state.active_wallet)
        {
            console.log("Stopping staking process...");
            ipcRenderer.invoke('stop-staker', vm.$store.state.staker_pid);
        }
        else
        {
            Swal.fire({
                theme:'dark',
                title: 'Staking',
                text: "Staking not started.",
                icon: 'info',
                confirmButtonText: 'OK'
            })
        }
    },
    stop_daemon:function()
    {
        this.client.command([{ method: "stop", parameters: [] }]).then((r) =>
        {
            console.log(r);
            if (r[0].code)
            {
              Toast.fire({
                theme:'dark',
                icon: 'info',
                title: r[0].message,
            });
          }
          else
          {
              Toast.fire({
                theme:'dark',
                icon: 'success',
                title: r,
            });
          }
      });
    },
    format_listing_date: function(bin) {
        if (bin && bin.date) {
            try {
                const d = new Date(bin.date);
                if (!isNaN(d.getTime())) {
                    return d.toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                    });
                }
            } catch (e) {}
        }
        return (bin && bin.dateRaw) || '—';
    },
    format_release_notes: function(notes) {
        if (!notes) return '<p style="opacity:0.6;margin:0;">No release notes available.</p>';
        const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const inline = (s) => escapeHtml(s)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:#a78bfa;text-decoration:underline;">$1</a>');

        const lines = notes.replace(/\r\n/g, '\n').split('\n');
        let html = '';
        let inList = false;
        for (const raw of lines) {
            const line = raw.trim();
            const bullet = line.match(/^[*-]\s+(.*)$/);
            const heading = line.match(/^(#{1,6})\s+(.*)$/);
            if (bullet) {
                if (!inList) { html += '<ul style="margin:0.3em 0;padding-left:1.2em;">'; inList = true; }
                html += '<li style="margin:0.15em 0;">' + inline(bullet[1]) + '</li>';
                continue;
            }
            if (inList) { html += '</ul>'; inList = false; }
            if (!line) continue;
            html += heading
                ? '<h4 style="margin:0.6em 0 0.3em;font-weight:600;">' + inline(heading[2]) + '</h4>'
                : '<p style="margin:0.3em 0;">' + inline(line) + '</p>';
        }
        if (inList) html += '</ul>';
        return '<div style="text-align:left;max-height:55vh;overflow-y:auto;padding-right:4px;">' + html + '</div>';
    },
    show_release_notes: function(bin) {
        Swal.fire({
            theme: 'dark',
            title: bin.tag || 'Release notes',
            html: this.format_release_notes(bin.notes),
            width: 640,
            confirmButtonText: 'Close'
        });
    },
    select_binary: function(bin) {
        if (!bin || !bin.url) return;
        ipcRenderer.invoke('download-binary', { url: bin.url, name: bin.name }).then((extractPath) => {
            if (!extractPath) {
                this.is_downloading = false;
                return;
            }
            const bar = document.getElementById('progress-bar');
            const txt = document.getElementById('progress-text');
            if (bar) bar.style.width = '100%';
            if (txt) txt.textContent = '100%';
            Toast.fire({ theme:'dark', icon:'success', title: 'Binaries ready' });
            ipcRenderer.invoke('start-daemon').catch((err) => alert('Error: ' + err.message));
        }).catch((err) => {
            this.is_downloading = false;
            alert('Error: ' + err.message);
        });
    },
    downloadBinaries: function() {
        this.is_fetching_releases = true;
        ipcRenderer.invoke('check-binary-exists').then((exists) => {
            if (exists) {
                ipcRenderer.invoke('start-daemon').then((data) => {
                    console.log("start-daemon (existing binary): " + data);
                }).catch((err) => {
                    alert('Error: ' + err.message);
                }).finally(() => {
                    this.is_fetching_releases = false;
                });
                return;
            }
            ipcRenderer.invoke('download-latest').then((extractPath) => {
                this.is_fetching_releases = false;
                if (!extractPath)
                {
                    this.is_downloading=false;
                    return;
                }
                document.getElementById('progress-bar').style.width = '100%';
                document.getElementById('progress-text').textContent = '100%';
                console.log("Binaries extracted to : " + extractPath);
                Toast.fire({
                    theme:'dark',
                    icon: 'success',
                    title: "Binaries ready",
                });
                ipcRenderer.invoke('start-daemon').then((data) =>
                {
                 console.log("start-daemon"+data);
             }).catch((err) => {
                alert('Error: ' + err.message);
            });
         }).catch((err) => {
            this.is_fetching_releases = false;
            alert('Error: ' + err.message);
        });
        }).catch((err) => {
            this.is_fetching_releases = false;
            alert('Error: ' + err.message);
        });
 },
 connect: function() {
    let vm=this;
    if(this.username&&this.password)
    {
        this.app.appContext.app.config.globalProperties.client=new Client(
        {
            host:this.host,
            port: this.port,
            username:this.username,
            password:this.password,
            wallet: this.$store.state.active_wallet || undefined,
        });
        const _navioWalletMethods = [
            'sendtoblsctaddress', 'getwalletinfo', 'walletpassphrase', 'walletlock',
            'stakelock', 'stakeunlock', 'createwallet', 'loadwallet', 'unloadwallet',
            'rescanblockchain', 'abortrescan', 'getblsctseed', 'getblsctauditkey',
            'dumpmnemonic', 'liststakedcommitments', 'listtransactions', 'getbalances',
            'listwallets', 'validateaddress',
        ];
        _navioWalletMethods.forEach(method => {
            if (!this.client.methods[method]) {
                this.client.methods[method] = { features: { multiwallet: { supported: true } } };
            }
        });
        console.log(this.client);
        this.client.command([{ method: "getblockchaininfo" }]).then((r) =>
        {
            if (this.remember)
            {
                localStorage.setItem('host', this.host);
                localStorage.setItem('port', this.port);
                localStorage.setItem('network', this.network);
                localStorage.setItem('username', this.username);
                localStorage.setItem('password', this.password);
                if (this.auto_login) localStorage.setItem('auto_login', true);
            }
            else
            {
                localStorage.removeItem('host');
                localStorage.removeItem('port');
                localStorage.removeItem('network');
                localStorage.removeItem('username');
                localStorage.removeItem('password');
            }
            console.log(r);
            if (this.auto_login)
            {
                this.state="ready";
            }
            else
            {
                if (localStorage.getItem("agreement_accepted"))
                {
                    this.state='ready';
                }
                else
                {
                    this.state="welcome";
                }
            }
            this.$router.push({ path: '/home' })
            let vm=this;
            vm.$store.commit('set_network',vm.network);
            vm.$store.commit('set_rpcuser',vm.username);
            vm.$store.commit('set_rpcpassword',vm.password);
            var intervalId = window.setInterval(function()
            {
                vm.getBlockChainInfo();
                vm.getNetworkInfo();
            }, 1000);
        }).catch((r) =>
        {
            this.state='connection_error';
            Swal.fire({
                theme:'dark',
                title: 'Connection Error',
                text: r.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        });
    }
}
},
mounted()
{
    console.log("App mounted");
    this.app=getCurrentInstance();
    ipcRenderer.invoke('get-bin-dir').then((dir) => { if (dir) this.binDir = dir; });
    ipcRenderer.on('download-file', (e, fileinfo) => {
        this.fileinfo = fileinfo;
        this.is_downloading = true;
        this.state = 'download_progress';
        this.$nextTick(() => {
            const bar = document.getElementById('progress-bar');
            const txt = document.getElementById('progress-text');
            if (bar) bar.style.width = '0%';
            if (txt) txt.textContent = '0%';
        });
    });

    ipcRenderer.on('download-progress', (e, progress) => {
        console.log("Download progres:"+progress);
        const percentage = Math.floor(progress);
        document.getElementById('progress-bar').style.width = percentage + '%';
        document.getElementById('progress-text').textContent  = percentage + '%';
    });

    ipcRenderer.on('is-daemon-started', (_event, data) =>
    {
        console.log("is-daemon-started");
        console.log(data);
        this.$store.commit('set_daemon_auto_started',data.started);
        if (data.started)
        {
          ipcRenderer.invoke('set-setup-complete');
          Toast.fire({
            theme:'dark',
            icon: 'success',
            title: "Daemon successfully started"
        });
          console.log("Daemon auto started.");
          this.$store.commit('set_network',data.network);
          this.$store.commit('set_rpc_user',data.rpcuser);
          this.$store.commit('set_rpc_password',data.rpcpassword);
          this.username=data.rpcuser;
          this.password=data.rpcpassword;
          localStorage.setItem('username', data.rpcuser);
          localStorage.setItem('password', data.rpcpassword);
      }
      else
      {
        console.log("Daemon not auto started.");
    }
    if (localStorage.getItem("agreement_accepted"))
    {
        this.remember=true;
        this.host    = localStorage.getItem('host')    || 'localhost';
        this.network = localStorage.getItem('network') || 'testnet';
        this.port    = localStorage.getItem('port')    || (this.networks.find(n => n.name === this.network)?.port ?? 33677);
        this.username= localStorage.getItem('username');
        this.password= localStorage.getItem('password');
        if (localStorage.getItem("auto_login"))
        {
            this.auto_login=true;
            this.connect();
        }
        else if (!localStorage.getItem("network"))
        {
            this.state="select_network";
        }
        else
        {
            if (!data.started)
            {
                this.state = import.meta.env.VITE_WEB ? 'setup' : 'select_daemon_method';
            }
            else
            {
                this.connect();
            }
        }
    }
    else
    {
        this.state="welcome";
    }
    console.log(this.client);
})
    ipcRenderer.on('download-error', (event, errorMessage) => {
        this.is_downloading=false;
        this.is_fetching_releases=false;
        Swal.fire({
            theme:'dark',
            title: 'Download Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    });

    ipcRenderer.on('download-select-binary', (event, payload) => {
        const { platform, arch, options } = payload || {};
        this.binarySelectionInfo = { platform: platform || '', arch: arch || '' };
        this.availableBinaries = Array.isArray(options) ? options : [];
        this.is_downloading = false;
        this.is_fetching_releases = false;
        this.state = 'select_binary';
    });
    ipcRenderer.on('stop-daemon', (_event, value) =>
    {
        console.log("stop-daemon");
        if (this.state !== 'ready') {
            ipcRenderer.invoke('force-quit');
            return;
        }
        this.stop_staking();
        this.stop_daemon();
    })
    ipcRenderer.on('start-staker-success', (_event, pid) =>
    {
        this.$store.commit('set_staker_wallet',this.$store.state.active_wallet);
        this.$store.commit('set_staker_pid',pid);
        Toast.fire({
            theme:'dark',
            icon: 'success',
            title: "Staker successfully started for wallet '"+this.$store.state.active_wallet+"'. PID : " + pid
        });
    })
    ipcRenderer.on('stop-staker-success', (_event, pid) =>
    {
        this.$store.commit('set_staker_pid',undefined);
        this.$store.commit('set_staking_active',false);
        Toast.fire({
            theme:'dark',
            icon: 'success',
            title: "Staker successfully stopped for wallet '"+this.$store.state.staker_wallet + "'"
        });
    })
    ipcRenderer.on('start-staker-error', (_event, error) =>
    {
        this.$store.commit('set_staker_pid',undefined);
        this.$store.commit('set_staking_active',false);
        let detail=error && error.message ? error.message : 'Unknown error.';
        let code=error && (error.code !== undefined && error.code !== null) ? error.code : (error && error.signal ? error.signal : undefined);
        Swal.fire({
            theme:'dark',
            title: 'Staking Error',
            text: (code !== undefined ? "Error " + code + ": " : "") + detail,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    })
}
}
</script>
<style>
/* Push SweetAlert2 toasts below the custom titlebar */
.swal2-container.swal2-top-end,
.swal2-container.swal2-top-right,
.swal2-container.swal2-top-start,
.swal2-container.swal2-top-left,
.swal2-container.swal2-top {
  top: 36px !important;
}

/* Toast theme */
.swal2-popup.swal2-toast {
  background: linear-gradient(160deg, rgba(40, 30, 78, 0.97) 0%, rgba(24, 30, 62, 0.97) 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45) !important;
}

.swal2-popup.swal2-toast .swal2-title {
  color: rgba(255, 255, 255, 0.96) !important;
  font-size: 13px !important;
}

.swal2-popup.swal2-toast .swal2-timer-progress-bar {
  background: linear-gradient(90deg, #7c3aed, #3b82f6) !important;
}

/* Toast icon renkleri */
.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring { border-color: rgba(52, 211, 153, 0.3) !important; }
.swal2-popup.swal2-toast .swal2-icon.swal2-success [class^='swal2-success-line'] { background-color: #34d399 !important; }
.swal2-popup.swal2-toast .swal2-icon.swal2-error   { border-color: rgba(248, 113, 113, 0.4) !important; color: #f87171 !important; }
.swal2-popup.swal2-toast .swal2-icon.swal2-warning { border-color: rgba(251, 191, 36,  0.4) !important; color: #fbbf24 !important; }
.swal2-popup.swal2-toast .swal2-icon.swal2-info    { border-color: rgba(96,  165, 250, 0.4) !important; color: #60a5fa !important; }

/* ── Modal (Swal.fire) theme ───────────────────────────────────── */

/* Backdrop */
.swal2-container:not(.swal2-top-end):not(.swal2-top-right):not(.swal2-top-start):not(.swal2-top-left):not(.swal2-top) {
  background: rgba(5, 3, 15, 0.72) !important;
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
}

/* Popup box */
.swal2-popup:not(.swal2-toast) {
  background: linear-gradient(160deg, rgba(40, 30, 78, 0.98) 0%, rgba(24, 30, 62, 0.98) 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.18) !important;
  border-radius: 16px !important;
}

/* Title */
.swal2-popup:not(.swal2-toast) .swal2-title {
  color: rgba(255, 255, 255, 0.98) !important;
  font-size: 1.15rem !important;
  font-weight: 600 !important;
}

/* Body text */
.swal2-popup:not(.swal2-toast) .swal2-html-container,
.swal2-popup:not(.swal2-toast) .swal2-content {
  color: rgba(255, 255, 255, 0.82) !important;
  font-size: 0.9rem !important;
}

/* Confirm button → violet→blue gradient */
.swal2-popup:not(.swal2-toast) .swal2-confirm {
  background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%) !important;
  border: none !important;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35) !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  border-radius: 8px !important;
  padding: 0.6rem 1.4rem !important;
  color: #fff !important;
  transition: opacity 0.15s ease !important;
}
.swal2-popup:not(.swal2-toast) .swal2-confirm:hover { opacity: 0.85 !important; }
.swal2-popup:not(.swal2-toast) .swal2-confirm:focus { box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.4) !important; }

/* Cancel / Deny button → glass secondary */
.swal2-popup:not(.swal2-toast) .swal2-cancel,
.swal2-popup:not(.swal2-toast) .swal2-deny {
  background: rgba(255, 255, 255, 0.14) !important;
  border: 1px solid rgba(255, 255, 255, 0.20) !important;
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  border-radius: 8px !important;
  padding: 0.6rem 1.4rem !important;
  transition: background 0.15s ease !important;
}
.swal2-popup:not(.swal2-toast) .swal2-cancel:hover,
.swal2-popup:not(.swal2-toast) .swal2-deny:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #fff !important;
}

/* Actions area gap */
.swal2-popup:not(.swal2-toast) .swal2-actions { gap: 10px !important; }

/* Icon renkleri */
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-success { border-color: rgba(52, 211, 153, 0.35) !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-success .swal2-success-ring { border-color: rgba(52, 211, 153, 0.25) !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-success [class^='swal2-success-line'] { background: #34d399 !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-error   { border-color: rgba(248, 113, 113, 0.4) !important; color: #f87171 !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-error [class^='swal2-x-mark-line'] { background: #f87171 !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-warning { border-color: rgba(251, 191, 36, 0.4) !important; color: #fbbf24 !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-info    { border-color: rgba(96, 165, 250, 0.4) !important; color: #60a5fa !important; }
.swal2-popup:not(.swal2-toast) .swal2-icon.swal2-question { border-color: rgba(139, 92, 246, 0.4) !important; color: #a78bfa !important; }
</style>

<style scoped>

    .sidebar-glass {
      background: linear-gradient(160deg, rgba(34, 26, 68, 0.96) 0%, rgba(22, 28, 58, 0.96) 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
  }

  .nav-item {
      border: 1px solid transparent;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .nav-item-active {
      position: relative;
      background: linear-gradient(90deg, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.10) 100%) !important;
      border-color: rgba(139, 92, 246, 0.25) !important;
      color: #c4b5fd !important;
  }
  .nav-item-active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 55%;
      background: linear-gradient(to bottom, #a78bfa, #60a5fa);
      border-radius: 0 3px 3px 0;
      box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
  }

  .status-glass {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
  }

  .progress-gradient {
      background: linear-gradient(90deg, #7c3aed, #3b82f6);
  }


  .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .loader {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
      0% {
        transform: rotate(0deg);
        box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.4);
    }

    50% {
        transform: rotate(180deg);
        box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.4);
    }

    100% {
        transform: rotate(360deg);
        box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.4);
    }
}

.pl,
.pl__worm {
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.pl {
  animation-name: bump9;
  animation-timing-function: linear;
  width: 8em;
  height: 8em;
}

.pl__ring {
  stroke: hsla(var(--hue),10%,10%,0.1);
  transition: stroke 0.3s;
}

.pl__worm {
  animation-name: worm9;
  animation-timing-function: cubic-bezier(0.42,0.17,0.75,0.83);
}

/* Animations */
@keyframes bump9 {
  from,
  42%,
  46%,
  51%,
  55%,
  59%,
  63%,
  67%,
  71%,
  74%,
  78%,
  81%,
  85%,
  88%,
  92%,
  to {
    transform: translate(0,0);
}

44% {
    transform: translate(1.33%,6.75%);
}

53% {
    transform: translate(-16.67%,-0.54%);
}

61% {
    transform: translate(3.66%,-2.46%);
}

69% {
    transform: translate(-0.59%,15.27%);
}

76% {
    transform: translate(-1.92%,-4.68%);
}

83% {
    transform: translate(9.38%,0.96%);
}

90% {
    transform: translate(-4.55%,1.98%);
}
}

@keyframes worm9 {
  from {
    stroke-dashoffset: 10;
}

25% {
    stroke-dashoffset: 295;
}

to {
    stroke-dashoffset: 1165;
}
}
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 100;
  src: url('./assets/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58m-wi40.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 100;
  src: url('./assets/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58i-wi40.woff2') format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 100;
  src: url('./assets/fonts/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58a-wg.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

body,p,td,tr,th,a,pre,div,span
{
    font-family:'Quicksand';
}
.brand
{
    font-family:'Quicksand';
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* From Uiverse.io by Z4drus */ 
.container {
  --uib-size: 150px;
  --uib-speed: 2.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: var(--uib-size);
  width: var(--uib-size);
}

.slice {
  position: relative;
  height: calc(var(--uib-size) / 6);
  width: 100%;
}

.slice::before,
.slice::after {
  --uib-a: calc(var(--uib-speed) / -2);
  --uib-b: calc(var(--uib-speed) / -6);
  content: "";
  position: absolute;
  top: 0;
  left: calc(50% - var(--uib-size) / 12);
  height: 100%;
  width: calc(100% / 6);
  border-radius: 50%;
  background-color: var(--uib-color);
  flex-shrink: 0;
  animation: orbit var(--uib-speed) linear infinite;
  transition: background-color 0.3s ease;
}

.slice:nth-child(1)::after {
  animation-delay: var(--uib-a);
}

.slice:nth-child(2)::before {
  animation-delay: var(--uib-b);
}

.slice:nth-child(2)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b));
}

.slice:nth-child(3)::before {
  animation-delay: calc(var(--uib-b) * 2);
}

.slice:nth-child(3)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 2);
}

.slice:nth-child(4)::before {
  animation-delay: calc(var(--uib-b) * 3);
}

.slice:nth-child(4)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 3);
}

.slice:nth-child(5)::before {
  animation-delay: calc(var(--uib-b) * 4);
}

.slice:nth-child(5)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 4);
}

.slice:nth-child(6)::before {
  animation-delay: calc(var(--uib-b) * 5);
}

.slice:nth-child(6)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 5);
}

@keyframes orbit {
  0% {
    transform: translateX(calc(var(--uib-size) * 0.25)) scale(0.73684);
    opacity: 0.65;
}

5% {
    transform: translateX(calc(var(--uib-size) * 0.235)) scale(0.684208);
    opacity: 0.58;
}

10% {
    transform: translateX(calc(var(--uib-size) * 0.182)) scale(0.631576);
    opacity: 0.51;
}

15% {
    transform: translateX(calc(var(--uib-size) * 0.129)) scale(0.578944);
    opacity: 0.44;
}

20% {
    transform: translateX(calc(var(--uib-size) * 0.076)) scale(0.526312);
    opacity: 0.37;
}

25% {
    transform: translateX(0%) scale(0.47368);
    opacity: 0.3;
}

30% {
    transform: translateX(calc(var(--uib-size) * -0.076)) scale(0.526312);
    opacity: 0.37;
}

35% {
    transform: translateX(calc(var(--uib-size) * -0.129)) scale(0.578944);
    opacity: 0.44;
}

40% {
    transform: translateX(calc(var(--uib-size) * -0.182)) scale(0.631576);
    opacity: 0.51;
}

45% {
    transform: translateX(calc(var(--uib-size) * -0.235)) scale(0.684208);
    opacity: 0.58;
}

50% {
    transform: translateX(calc(var(--uib-size) * -0.25)) scale(0.73684);
    opacity: 0.65;
}

55% {
    transform: translateX(calc(var(--uib-size) * -0.235)) scale(0.789472);
    opacity: 0.72;
}

60% {
    transform: translateX(calc(var(--uib-size) * -0.182)) scale(0.842104);
    opacity: 0.79;
}

65% {
    transform: translateX(calc(var(--uib-size) * -0.129)) scale(0.894736);
    opacity: 0.86;
}

70% {
    transform: translateX(calc(var(--uib-size) * -0.076)) scale(0.947368);
    opacity: 0.93;
}

75% {
    transform: translateX(0%) scale(1);
    opacity: 1;
}

80% {
    transform: translateX(calc(var(--uib-size) * 0.076)) scale(0.947368);
    opacity: 0.93;
}

85% {
    transform: translateX(calc(var(--uib-size) * 0.129)) scale(0.894736);
    opacity: 0.86;
}

90% {
    transform: translateX(calc(var(--uib-size) * 0.182)) scale(0.842104);
    opacity: 0.79;
}

95% {
    transform: translateX(calc(var(--uib-size) * 0.235)) scale(0.789472);
    opacity: 0.72;
}

100% {
    transform: translateX(calc(var(--uib-size) * 0.25)) scale(0.73684);
    opacity: 0.65;
}
}

.slice:nth-child(1)::before,
.slice:nth-child(1)::after {
  background-color: #334dff;
}

.slice:nth-child(2)::before,
.slice:nth-child(2)::after {
  background-color: #333eff;
}

.slice:nth-child(3)::before,
.slice:nth-child(3)::after {
  background-color: #3334ff;
}

.slice:nth-child(4)::before,
.slice:nth-child(4)::after {
  background-color: #4433ff;
}

.slice:nth-child(5)::before,
.slice:nth-child(5)::after {
  background-color: #6633ff;
}

.slice:nth-child(6)::before,
.slice:nth-child(6)::after {
  background-color: #9933ff;
}


</style>
