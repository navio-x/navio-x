<script setup>
    import { Vue } from 'vue'
</script>

<template>
    <section
    class="h-screen bg-transparent flex items-center justify-center"
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
<p class="mt-2 mb-8 text-sm text-gray-500">
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

<section class="h-screen bg-transparent flex items-center justify-center" v-show="state=='connection_error'">
<div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 flex flex-col justify-center items-center h-full w-full">
    <div class="flex justify-center items-center">
        <img src="./assets/nav_illustraion_01.png" style="width:300px;height:auto;">
    </div>
    <h1 class="mt-5 mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl dark:text-white brand">Navio X</h1>
    <p class="mb-8 text-lg font-normal text-gray-500 sm:px-16 lg:px-48 dark:text-gray-400">Connection error</p>
    <p class="mt-5 mb-8 text-sm font-normal text-gray-500 sm:px-16 lg:px-48 dark:text-gray-300">Unable to connect to Navio daemon. Please make sure that the Navio daemon is running and the RPC connection information (rpcuser & rpcpassword) matches the information you entered. Below you can find the command line required to run the Navio daemon.</p>
    <code class="mt-10 p-5 text-sm border text-white glass-card rounded-lg">screen ./naviod --testnet --printtoconsole --walletcrosschain -rpcuser=<span class="text-blue-500"><code>username</code></span> -rpcpassword=<span class="text-blue-500"><code>password</code></span></code>
    <div class="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
        <button v-on:click="state='setup'" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            Connect
            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
        <button v-on:click="downloadBinaries()" class="inline-flex justify-center items-center ml-5 py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            Download binaries
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 ms-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
          </svg>
      </button>
  </div>
</div>
</section>
<section class="h-screen bg-transparent" v-show="state=='download_progress'">
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
          <span class="text-base font-medium text-blue-700 dark:text-white">Downloading latest binary files for <b>{{fileinfo.platform}}</b> from https://releases.nav.io</span>
          <span id="progress-text" class="text-sm font-medium text-blue-700 dark:text-white">0%</span>
      </div>
      <div class="w-full bg-white/[0.08] rounded-full h-2">
          <div id="progress-bar" class="h-2 rounded-full transition-all" style="width: 0%; background: linear-gradient(90deg, #7c3aed, #3b82f6);"></div>
      </div>
  </div>
</div>
</section>
<section class="h-full w-full bg-transparent" v-show="state=='agreement'">
    <div class="py-8 p-10 mx-auto max-w-screen-xl lg:py-16">
        <p class="mt-5 mb-4 text-4xl font-extrabold tracking-tight leading-none text-white">License Agreement</p>
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
    <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 mt-10">
        <button v-on:click="accept_agreement()" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            I Agreee
            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
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
v-show="state=='select_daemon_method'"
>
<div class="mb-10 flex justify-center">
    <img src="./assets/setup.svg" class="w-[64px] md:w-[128px] lg:w-[256px] h-auto" />
</div>

<div class="px-4 max-w-screen-xl text-center">
    <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white brand">
      Choose a method
  </h1>

  <p class="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-gray-400">
      You can download the official Navio binaries, or manually start the Navio daemon and connect to it.
  </p>

  <div class="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-5">
      <button
      @click="state='setup'"
      class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
      >
      Manual Node Connection
      <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
  </button>

  <button
  @click="downloadBinaries()"
  class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
  >
  Download Official Navio Binaries
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
  stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 ms-2">
  <path stroke-linecap="round" stroke-linejoin="round"
  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"/>
</svg>
</button>
</div>
</div>
</section>

<section class="h-screen bg-transparent" v-show="state=='setup'">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a class="flex items-center ps-2.5" style="margin-bottom:24px;">
         <img src="./assets/logo.svg" style="width:192px;" alt="Navio"/>
     </a>
     <div class="w-full rounded-xl border md:mt-0 sm:max-w-md xl:p-0" style="background: linear-gradient(160deg, rgba(17,10,35,0.95) 0%, rgba(10,14,30,0.95) 100%); border-color: rgba(255,255,255,0.08); backdrop-filter: blur(16px);">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-white">
              Setup
          </h1>
          <p class="dark:text-white text-white">Enter the RPC connection details you specified when starting the Navio daemon.</p>
          <div class="space-y-4 md:space-y-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-white">Network</label>
                <div class="flex gap-4">
                  <label v-for="net in networks" :key="net.name" class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="network" :value="net.name" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2">
                    <span class="text-sm text-white">{{ net.label }}</span>
                    <span class="text-xs text-zinc-400">({{ net.port }})</span>
                  </label>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full group">
                  <label for="host" class="block mb-2 text-sm font-medium dark:text-white text-white">Host</label>
                  <input type="text" v-model="host" id="host" class="glass-input block w-full p-2.5 sm:text-sm rounded-lg" placeholder="" required="">
              </div>
              <div class="relative z-0 w-full group">

                  <label for="port" class="block mb-2 text-sm font-medium dark:text-white text-white">Port</label>
                  <input type="text" v-model="port" id="port" class="glass-input block w-full p-2.5 sm:text-sm rounded-lg" placeholder="" required="">
              </div>
          </div>
          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full group">
              <label for="username" class="block mb-2 text-sm font-medium dark:text-white text-white">Username</label>
              <input type="text" v-model="username" id="username" class="glass-input block w-full p-2.5 sm:text-sm rounded-lg" placeholder="" required="">
          </div>
          <div class="relative z-0 w-full group">
              <label for="password" class="block mb-2 text-sm font-medium dark:text-white text-white">Password</label>
              <input type="password" v-model="password" id="password" placeholder="" class="glass-input block w-full p-2.5 sm:text-sm rounded-lg" required="">
          </div>
      </div>
      <div class="flex items-center justify-between">
          <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="remember" v-model="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 rounded accent-violet-500 bg-white/10 border border-white/20">
            </div>
            <div class="ml-3 text-sm">
                <label for="remember" class="dark:text-white text-white">Remember me</label>
            </div>
        </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="auto_login" v-model="auto_login" aria-describedby="auto_login" type="checkbox" class="w-4 h-4 rounded accent-violet-500 bg-white/10 border border-white/20">
        </div>
        <div class="ml-3 text-sm">
            <label for="auto_login" class="dark:text-white text-white">Auto login</label>
        </div>
    </div>
</div>
<button :disabled="!username||!password" v-on:click="connect()" class="w-full text-white bg-primary-600 disabled:bg-blue-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Connect</button>
<button v-on:click="select_daemon_method()" class="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center glass-btn-secondary focus:outline-none">Back</button>
</div>
</div>
</div>
</div>
</section>

<div class="flex items-center justify-center h-screen bg-transparent" v-show="state=='connected'">
    <div class="relative p-6 text-center rounded-2xl shadow-2xl sm:p-8 glass-card">
        <div class="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
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
  <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen flex flex-col sidebar-glass" aria-label="Sidebar">

    <!-- Ambient glow blobs -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-none">
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-32 -left-8 w-36 h-36 bg-blue-600/15 rounded-full blur-3xl"></div>
    </div>

    <!-- Logo -->
    <div class="relative px-5 pt-6 pb-5 shrink-0">
      <img src="./assets/logo.svg" class="w-24" alt="Navio Logo"/>
    </div>

    <!-- Main nav -->
    <nav class="relative flex-1 overflow-y-auto px-3 pb-2">
      <p class="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/20">Wallet</p>

      <router-link to="/home"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>Home</span>
      </router-link>

      <router-link to="/wallets"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
        <span>Wallets</span>
      </router-link>

      <router-link to="/send"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <span>Send</span>
      </router-link>

      <router-link to="/receive"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Receive</span>
      </router-link>

      <router-link to="/history"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span>History</span>
      </router-link>

      <router-link to="/staking"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
        <span>Staking</span>
      </router-link>

      <div class="my-3 border-t border-white/[0.06]"></div>
      <p class="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/20">Tools</p>

      <router-link to="/console"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span>Console</span>
      </router-link>

      <router-link to="/settings"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium mb-0.5"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
        </svg>
        <span>Settings</span>
      </router-link>

      <router-link to="/about"
        class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium"
        active-class="nav-item-active !text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] h-[18px] shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
        <span>About</span>
      </router-link>
    </nav>

    <!-- Status card -->
    <div class="relative px-3 py-4 border-t border-white/[0.06] shrink-0">
      <div v-if="chain" class="status-glass rounded-xl px-3 py-3 space-y-2.5">
        <div class="flex items-center gap-2 min-w-0">
          <span :class="$store.state.active_wallet ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-white/20'" class="w-1.5 h-1.5 rounded-full shrink-0 transition-all"></span>
          <span class="text-xs text-white/70 truncate font-medium">{{ $store.state.active_wallet || 'No wallet selected' }}</span>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] text-white/30">{{ blocks == headers ? 'Synced' : 'Syncing...' }}</span>
            <span :class="blocks == headers ? 'text-emerald-400' : 'text-violet-400'" class="text-[11px] font-semibold">{{ get_sync_percent() }}%</span>
          </div>
          <div class="bg-white/[0.08] rounded-full h-1">
            <div class="h-1 rounded-full transition-all duration-500 progress-gradient" :style="{ width: get_sync_percent() + '%' }"></div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-white/25 capitalize font-medium">{{ chain }}</span>
          <router-link to="/peers" class="text-[11px] text-white/40 hover:text-white/80 transition-colors" :title="'Protocol: ' + networkinfo.protocolversion">
            {{ networkinfo.connections ? networkinfo.connections + ' peer' + (networkinfo.connections > 1 ? 's' : '') : 'No peers' }}
          </router-link>
        </div>
        <div class="border-t border-white/[0.06] pt-2 flex items-center justify-between">
          <span class="text-[11px] text-white/25">Blocks</span>
          <span class="text-[11px] font-mono">
            <span class="text-white/50">{{ blocks.toLocaleString() }}</span>
            <span class="text-white/20 mx-1">/</span>
            <span :class="blocks == headers ? 'text-emerald-400/70' : 'text-violet-400/70'">{{ headers.toLocaleString() }}</span>
          </span>
        </div>
      </div>
      <div v-else class="flex items-center gap-2.5 px-1 py-2">
        <svg class="w-4 h-4 text-violet-400 animate-spin shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="text-xs text-white/40">Initializing...</span>
      </div>
    </div>

  </aside>

<div class="sm:ml-64 h-screen">
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
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
    })
    export default {
      components: { NetworkSelector },
      data() {
        const networks = [
          { name: 'mainnet', label: 'Mainnet', port: 48471, description: 'The live Navio network. Transactions here use real NAV with real value.' },
          { name: 'testnet', label: 'Testnet', port: 33677, description: 'Development and testing network. Use this to try features without risking real NAV.' },
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
          fileinfo:{},
      }
  },
  watch: {
    network(val) {
      const found = this.networks.find(n => n.name === val);
      if (found) this.port = found.port;
    }
  },
  methods: {
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
        this.state = 'select_daemon_method';
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
    downloadBinaries: function() {
        this.state="download_progress";
        this.is_downloading=true;
        ipcRenderer.invoke('download-latest').then((extractPath) => {
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
            wallet:'wallet_1'
        });
        console.log(this.client);
        this.client.command([{ method: "getwalletinfo" }]).then((r) => 
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
    ipcRenderer.on('download-file', (e, fileinfo) => {
        this.fileinfo=fileinfo;
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
                this.state="select_daemon_method";
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
        Swal.fire({
            theme:'dark',
            title: 'Download Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
        })
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
}
}
</script>
<style scoped>

.sidebar-glass {
  background: linear-gradient(160deg, rgba(17, 10, 35, 0.97) 0%, rgba(10, 14, 30, 0.97) 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
