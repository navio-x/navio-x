<script setup>
    import { Vue } from 'vue'
</script>

<template>
    <section class="bg-white h-screen dark:bg-zinc-900 bg-zinc-900" v-show="state=='welcome'">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <div class="flex justify-center items-center">
                <img src="./assets/nav_illustraion_01.png" style="width:400px;height:auto;">
            </div>
            <h1 class="mt-5 mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white text-white brand">Navio X</h1>
            <p class="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400 text-gray-400">Your path to freedom</p>
            <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                <button v-on:click="get_started()" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                    Get started
                    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
            </div>
        </div>
    </section>
    <section class="bg-white h-screen dark:bg-zinc-900 bg-zinc-900" v-show="state=='connection_error'">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <div class="flex justify-center items-center">
                <img src="./assets/nav_illustraion_01.png" style="width:300px;height:auto;">
            </div>
            <h1 class="mt-5 mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl dark:text-white brand">Navio X</h1>
            <p class="mb-8 text-lg font-normal text-gray-500 sm:px-16 lg:px-48 dark:text-gray-400">Connection error</p>
            <p class="mt-5 mb-8 text-sm font-normal text-gray-500 sm:px-16 lg:px-48 dark:text-gray-300">Unable to connect to Navio daemon. Please make sure that the Navio daemon is running and the RPC connection information (rpcuser & rpcpassword) matches the information you entered. Below you can find the command line required to run the Navio daemon.</p>
            <code class="mt-10 p-5 text-sm border text-white dark:text-white bg-zinc-800 border-zinc-700">screen ./naviod --testnet --printtoconsole --walletcrosschain -rpcuser=<span class="text-blue-500"><code>username</code></span> -rpcpassword=<span class="text-blue-500"><code>password</code></span></code>
            <div class="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                <button v-on:click="state='setup'" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                    Connect
                    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
            </div>
        </div>
    </section>
    <section class="h-full w-full dark:bg-zinc-900 bg-zinc-900" v-show="state=='agreement'">
        <div class="py-8 p-10 mx-auto max-w-screen-xl lg:py-16 dark:bg-zinc-900 bg-zinc-900">
            <p class="mt-5 mb-4 text-4xl font-extrabold tracking-tight leading-none dark:text-white text-white">License Agreement</p>
            <div class="w-full h-full dark:bg-zinc-900 bg-zinc-900 dark:text-white text-white">
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

<section class="bg-white h-screen dark:bg-zinc-900 bg-zinc-900 " v-show="state=='setup'">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a class="flex items-center ps-2.5" style="margin-bottom:24px;">
       <img src="./assets/logo.svg" style="width:192px;" alt="Navio"/>
   </a>       
   <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-800 bg-zinc-800 dark:border-zinc-700 border-zinc-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-white">
              Setup
          </h1>
          <p class="dark:text-white text-white">Enter the RPC connection details you specified when starting the Navio daemon.</p>
          <div class="space-y-4 md:space-y-6">
              <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full group">
                  <label for="host" class="block mb-2 text-sm font-medium dark:text-white text-white">Host</label>
                  <input type="text" v-model="host" id="host" class="bg-zinc-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-zinc-900 border-zinc-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="" required="">
              </div>
              <div class="relative z-0 w-full group">

                  <label for="port" class="block mb-2 text-sm font-medium dark:text-white text-white">Port</label>
                  <input type="text" v-model="port" id="port" class="bg-zinc-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-zinc-900 border-zinc-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="" required="">
              </div>
          </div>
          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full group">
              <label for="username" class="block mb-2 text-sm font-medium dark:text-white text-white">Username</label>
              <input type="text" v-model="username" id="username" class="bg-zinc-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-zinc-900 border-zinc-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="" required="">
          </div>
          <div class="relative z-0 w-full group">
              <label for="password" class="block mb-2 text-sm font-medium dark:text-white text-white">Password</label>
              <input type="password" v-model="password" id="password" placeholder="" class="bg-zinc-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-zinc-900 border-zinc-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required="">
          </div>
      </div>
      <div class="flex items-center justify-between">
          <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="remember" v-model="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-zincy-300 rounded bg-zinc-700 focus:ring-3 focus:ring-primary-300 dark:bg-zinc-700 dark:border-zinc-600 border-zinc-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
            </div>
            <div class="ml-3 text-sm">
                <label for="remember" class="dark:text-white text-white">Remember me</label>
            </div>
        </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="auto_login" v-model="auto_login" aria-describedby="auto_login" type="checkbox" class="w-4 h-4 border border-zincy-300 rounded bg-zinc-700 focus:ring-3 focus:ring-primary-300 dark:bg-zinc-700 dark:border-zinc-600 border-zinc-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
        </div>
        <div class="ml-3 text-sm">
            <label for="auto_login" class="dark:text-white text-white">Auto login</label>
        </div>
    </div>
</div>
<button :disabled="!username||!password" v-on:click="connect()" class="w-full text-white bg-primary-600 disabled:bg-blue-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Connect</button>
</div>
</div>
</div>
</div>
</section>

<div class="flex items-center justify-center h-screen dark:bg-zinc-900 bg-zinc-900" v-show="state=='connected'">
    <div class="relative p-4 text-center rounded-lg shadow sm:p-5 dark:bg-zinc-800 bg-zinc-800">
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
  <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
     <div class="h-full px-3 py-4 overflow-y-auto bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-900">
      <a class="flex items-center ps-2.5" style="margin-top:15px;margin-bottom:30px;">
       <img src="./assets/logo.svg" style="width:128px;" alt="Navio Logo"/>
       <!--<span class="ml-3 self-center text-xl font-semibold whitespace-nowrap dark:text-white">Navio</span>!-->
   </a>       
   <ul class="space-y-2 text-md">
       <li>
           <router-link to="/home">
            <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>

              <span class="ms-3">Home</span>
          </a>
      </router-link>
  </li>
  <li>
   <router-link to="/wallets">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>

      <span class="ms-3">Wallets</span>
  </a>
</router-link>
</li>
<li>
   <router-link to="/send">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <span class="ms-3">Send</span>
  </a>
</router-link>
</li>
<li>
   <router-link to="/receive">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span class="ms-3">Receive</span>
  </a>
</router-link>
</li>           
<li>
   <router-link to="/history">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
      <span class="ms-3">History</span>
  </a>
</router-link>
</li>
<li>
   <router-link to="/staking">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>

      <span class="ms-3">Staking</span>
  </a>
</router-link>
</li>
</ul>
<ul class="mt-2 space-y-2 text-md border-t border-zinc-700 dark:border-zinc-700">
  <li style="display:none">
   <router-link to="/help">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288" />
      </svg>

      <span class="ms-3">Help</span>
  </a>
</router-link>
</li> 

<li>
   <router-link to="/console">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>

      <span class="ms-3">Console</span>
  </a>
</router-link>
</li> 

<li>
   <router-link to="/settings">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
      <span class="ms-3">Settings</span>
  </a>
</router-link>
</li> 

<li>
   <router-link to="/about">
    <a href="" class="flex items-center p-2 rounded-lg dark:text-white text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 group focus:bg-zinc-900 focus:ring focus:ring-zinc-900 focus-within:ring-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
</svg>

      <span class="ms-3">About</span>
  </a>
</router-link>
</li> 

</ul>



<div class="relative h-32 w-full" v-if="chain">
  <div class="flex items-center p-2 mt-3 space-x-4 justify-self-end">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-500">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
  <div class="w-16">
    <span title="Active Wallet" class="text-xs dark:text-white text-white whitespace-nowrap" v-if="client">{{($store.state.active_wallet?$store.state.active_wallet:"No active wallet")}}</span>
    <span class="flex items-center space-x-1 text-xs dark:text-gray-400 text-gray-400 whitespace-nowrap">
        {{(blocks==headers?"Synced":"Syncing...")}}
    </span>
</div>

</div>

<div class="flex items-center p-2 space-x-4" title="Current block height">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-500">
      <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>

  <div class="w-16">
    <span title="Active Chain" class="flex items-center space-x-1 text-xs dark:text-gray-400 text-white whitespace-nowrap">
        {{chain}}
    </span>
    <span title="Current Block Number/Latest Block Number" class="flex items-center space-x-1 text-xs dark:text-gray-400 text-gray-400 whitespace-nowrap">
        {{blocks}}/{{headers}}
    </span>
</div>
</div>

<div class="w-full flex items-center p-2 space-x-4" title="Network Details">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
  </svg>

  <div class="w-16" :title="'Protocol version : '+networkinfo.protocolversion">
    <router-link to="/peers">
        <span class="flex items-center space-x-1 text-xs dark:text-gray-400 text-white whitespace-nowrap">
            {{networkinfo.connections?networkinfo.connections+" Connection":"No connection"}}
        </span>
        <span v-if="networkinfo.version" class="flex items-center space-x-1 text-xs dark:text-gray-400 text-gray-400">
            v{{networkinfo.version}}
        </span>
    </router-link>
</div>
</div>
    <div class="flex ml-3 mr-3 justify-between mb-1">
      <span class="text-base font-medium text-blue-700 dark:text-white"></span>
      <span class="text-sm font-medium text-white dark:text-white">{{get_sync_percent()}}%</span>
  </div>
  <div class="ml-3 mr-3 bg-gray-700 rounded-full h-1 dark:bg-gray-700">
    <div class="bg-blue-600 h-1 rounded-full" :style="{ width: get_sync_percent() + '%' }"></div>
  </div>
</div>
<div class="relative h-32 w-32" v-else>
    <div class="flex items-center p-2 mt-3 space-x-4 justify-self-end">
        <div class="loader-container">
          <div class="loader"></div>
      </div>
      <div class="w-32">
        <span class="text-sm dark:text-white text-white whitespace-nowrap" v-if="client">Initializing...</span>
    </div>
</div>
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
          app:null,
          state: "",
          username:"",
          password:"",
          host:"localhost",
          port:33577,
          network:"testnet",
          blocks:0,
          headers:0,
          chain:undefined,
          networkinfo:{},
          remember:false,
          auto_login:false
      }
  },
  methods: {
    get_started: function() {
        this.state='agreement';
    },
    get_sync_percent: function() {
        return (this.blocks?parseFloat((this.blocks*100)/this.headers).toFixed(2):0);
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
            this.state='setup';
        }
    },
    getBlockChainInfo: function() {
        const batch = [{ method: "getblockchaininfo" }];
        let vm=this;
        this.client.command(batch).then((r) => 
        {
            vm.chain=r[0].chain;
            vm.blocks=r[0].blocks;
            vm.headers=r[0].headers;
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
        let vm=this;
        if (vm.$store.state.active_wallet)
        {
            console.log("Stopping staking process...");
            ipcRenderer.invoke('stop-staker', vm.$store.state.staker_pid);
        }
        else
        {
            Swal.fire({
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
                icon: 'info',
                title: r[0].message,
            });
          }
          else
          {
              Toast.fire({
                icon: 'success',
                title: r,
            });
          }
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
            this.client.command([{ method: "getwalletinfo" }]).then((r) => 
            {
                if (this.remember)
                {
                    localStorage.setItem('host', this.host);
                    localStorage.setItem('port', this.port);
                    localStorage.setItem('username', this.username);
                    localStorage.setItem('password', this.password);
                    if (this.auto_login) localStorage.setItem('auto_login', true);
                }
                else
                {
                    localStorage.removeItem('host', this.host);
                    localStorage.removeItem('port', this.port);
                    localStorage.removeItem('username', this.username);
                    localStorage.removeItem('password', this.password);
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
                        this.state='connected';
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
    ipcRenderer.on('is-daemon-started', (_event, data) =>
    {
        console.log("is-daemon-started");
        console.log(data);
        this.$store.commit('set_daemon_auto_started',data.started);
        if (data.started)
        {
          Toast.fire({
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
        this.host=(localStorage.getItem("host")?localStorage.getItem("host"):"localhost");
        this.port=(localStorage.getItem("port")?localStorage.getItem("port"):"33477");
        this.username=localStorage.getItem("username");
        this.password=localStorage.getItem("password");
        if (localStorage.getItem("auto_login"))
        {
            this.auto_login=true;
            this.connect();
        }
        else
        {
            this.state='setup';
        }
    }
    else
    {
        if (data.started) this.connect();
        this.state="welcome";
    }
    console.log(this.client);
})
    ipcRenderer.on('stop-daemon', (_event, value) =>
    {
        console.log("stop-daemon");
        this.stop_staking();
        this.stop_daemon();
    })
    ipcRenderer.on('start-staker-success', (_event, pid) =>
    {
        this.$store.commit('set_staker_wallet',this.$store.state.active_wallet);
        this.$store.commit('set_staker_pid',pid);
        Toast.fire({
            icon: 'success',
            title: "Staker successfully started for wallet '"+this.$store.state.active_wallet+"'. PID : " + pid
        });
    })
    ipcRenderer.on('stop-staker-success', (_event, pid) =>
    {
        this.$store.commit('set_staker_pid',undefined);
        this.$store.commit('set_staking_active',false);
        Toast.fire({
            icon: 'success',
            title: "Staker successfully stopped for wallet '"+this.$store.state.staker_wallet + "'"
        });
    })
}
}
</script>
<style scoped>

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

</style>
