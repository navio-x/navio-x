import { createApp } from 'vue'
import { createStore } from 'vuex'
import './index.css'
import router from './router' 
import App from './App.vue'
import './samples/node-api'
import 'flowbite/dist/flowbite.js'
import 'flowbite-vue'
import VueApexCharts from "vue3-apexcharts";
import VueClipboard from 'vue-clipboard2';

// Create a new store instance.
const store = createStore({
  state () {
    return {
      active_wallet: undefined,
      staker_wallet: undefined,
      is_staking_active: false,
      is_daemon_auto_started:false,
      network:undefined,
      rpcuser:undefined,
      rpcpassword:undefined,
      staker_pid:undefined
    }
  },
  mutations: {
    set_active_wallet (state,payload)
    {
      state.active_wallet=payload;
    },
    set_staking_active (state,payload)
    {
      state.is_staking_active=payload;
    },
    set_daemon_auto_started (state,payload)
    {
      state.is_daemon_auto_started=payload;
    },
    set_network (state,payload)
    {
      state.network=payload;
    },
    set_rpcuser (state,payload)
    {
      state.rpcuser=payload;
    },
    set_rpcpassword (state,payload)
    {
      state.rpcpassword=payload;
    },
    set_staker_pid (state,payload)
    {
      state.staker_pid=payload;
    },
    set_staker_wallet (state,payload)
    {
      state.staker_wallet=payload;
    }
  }
})

let Client = require('bitcoin-core');
let app=createApp(App);
app.use(router)
   .use(VueApexCharts)
   .use(store)
   .use(VueClipboard)
   .mount('#app')
   .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
 