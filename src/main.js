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
      active_wallet: 0
    }
  },
  mutations: {
    set_active_wallet (state,payload)
    {
      state.active_wallet=payload;
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
 