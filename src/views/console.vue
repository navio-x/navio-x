<template>
  <div class="h-full w-full flex flex-col p-4 bg-transparent">
    <header class="flex h-12 w-full bg-transparent text-white items-center justify-between">
      <h3>Console</h3>
      <span class="text-xs text-gray-500">Ctrl+L to clear</span>
    </header>
    <div id="result" class="flex flex-1 text-white overflow-auto glass-card rounded-xl p-4" @contextmenu.prevent="openContextMenu">
      <div v-html="result" class="scroll-auto scroll-smooth">
      </div>
    </div>
    <div v-if="contextMenu.visible" class="context-menu" :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
      <ul>
        <li @click="copyResult(); contextMenu.visible = false">Copy</li>
        <li @click="selectAll(); contextMenu.visible = false">Select All</li>
        <li class="context-menu-divider"></li>
        <li @click="clearResult(); contextMenu.visible = false">Clear</li>
      </ul>
    </div>
    <footer class="flex bg-transparent mt-3 h-18 w-full">
      <div class="flex w-full rounded-lg shadow-sm">
        <autocomplete ref="autocomplete" class="w-10/12" @selected="cmd = $event" @submit="run()" @clear="clearResult()" :items="items" storage-key="console-cmd-history" />
        <button class="ml-3 h-10 bg-blue-500 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white w-2/12 font-bold rounded focus:outline-none focus:shadow-outline" :disabled="!cmd || !cmd.trim()" v-on:click="run()"><center><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg></center>
      </button>
    </div>
  </footer>
</div>

</template>

<script>
  import Swal from 'sweetalert2';
  import Autocomplete from '../components/AutoComplete.vue';
  import '@sweetalert2/theme-dark/dark.scss';

  export default {
   components: {
    autocomplete: Autocomplete
  },
  data() {
    return {
      result: this.$store.state.console_log,
      cmd:undefined,
      items:['help','getblockchaininfo'],
      contextMenu: { visible: false, x: 0, y: 0 }
    }
  },
  methods:{
    clearResult:function() {
      this.result='';
      this.$store.commit('set_console_log', '');
    },
    copyResult:function() {
      const text = window.getSelection().toString();
      if (text) navigator.clipboard.writeText(text);
    },
    selectAll:function() {
      const el = document.getElementById('result');
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    openContextMenu:function(event) {
      this.contextMenu = { visible: true, x: event.clientX, y: event.clientY };
      this.$nextTick(() => {
        const menu = this.$el.querySelector('.context-menu');
        if (!menu) return;
        const rect = menu.getBoundingClientRect();
        const x = event.clientX + rect.width > window.innerWidth ? event.clientX - rect.width : event.clientX;
        const y = event.clientY + rect.height > window.innerHeight ? event.clientY - rect.height : event.clientY;
        this.contextMenu = { visible: true, x, y };
      });
    },
    closeContextMenu:function() {
      this.contextMenu.visible = false;
    },
    scrollToBottom:function() {
      const element = document.getElementById("result");
      element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
    },
    add_to_log:function(s,t)
    {
      const now = new Date();
      const day = now.getDay(); // returns a number representing the day of the week, starting with 0 for Sunday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      let color="";
      if (t=="command")
      {
        color="text-blue-500";
        this.result+=`<pre class='${color}'><span class='text-gray-200'>${hours}:${minutes}:${seconds}</span>&nbsp;${s}</pre>`;
      }
      if (t=="output")
      {
        color="text-gray-200";
        this.result+=`<pre class='${color}'>${s}</pre>`;
      }
      this.$store.commit('set_console_log', this.result);
      setTimeout(this.scrollToBottom, 10);
    },
    run:function()
    {
      var strcmd=this.cmd;
      var methodname="";
      var params=[];
      strcmd=this.commandArgs2Array(strcmd);
      console.log(strcmd);
      for(var i=0; i<strcmd.length; i++)
      {
        if (i==0) methodname=strcmd[i];
        var mystring=strcmd[i];
        mystring=mystring.replace(/^"(.*)"$/, '$1');
        var matches = mystring.match(/\[(.*?)\]/);
        if (matches)
        {
          var submatch = matches[1];
          var sp = submatch.split(',');
          var array=[];
          sp.forEach(element => { 
            var s=element;
            s=s.replace(/^"(.*)"$/, '$1');
            array.push(s);
          }); 
          if (i!=0) params.push(array);
          console.log(array);
          console.log(submatch + " is array");
        }
        else if (strcmd[i]=="true" || strcmd[i]=="false")
        {
          console.log(strcmd[i]+ " is bool");
          if (i!=0)
          {
            if (strcmd[i]=="true") params.push(true);
            if (strcmd[i]=="false") params.push(false);
          }
        }
        else if (this.isNumeric(strcmd[i]))
        {
          console.log(strcmd[i]+ " is numeric");
          if (i!=0) params.push(parseInt(strcmd[i]));
        }
        else if (this.isJsonString(strcmd[i]))
        {
          console.log(strcmd[i]+ " is json");
          if (i!=0) params.push(JSON.parse(strcmd[i]));
        }
        else if (!matches && isNaN(strcmd[i]))
        {
          console.log(strcmd[i]+ " is string");
          var s=strcmd[i];
          s=s.replace(/^"(.*)"$/, '$1');
          if (i!=0) params.push(s);
        }
        else
        {
          console.log(strcmd[i]+ " is unknown");
          if (i!=0) params.push(strcmd[i]);
        }
      }
      console.log("method="+methodname);
      console.log(params);
      console.log("stringified params="+JSON.stringify(params));
      const batch = [{ method: methodname, parameters: params }]
      this.add_to_log(this.cmd,"command");
      let vm=this;
      this.client.command(batch).then((retval) => 
      {
        if (typeof retval[0]=="object")
        {
          vm.add_to_log(JSON.stringify(retval[0], null, 2),"output");
        }
        else
        {
          vm.add_to_log(retval[0],"output");
        }
      }).catch((r) =>
      {
       Swal.fire({
        theme:'dark',
        title: 'Error!',
        text: JSON.stringify(r),
        icon: 'error',
        confirmButtonText: 'OK'
      })
     });
      this.$refs.autocomplete.addToHistory(this.cmd);
      this.cmd="";
      this.$refs.autocomplete.setResult("");
    },
    isJsonString:function(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    isNumeric:function(value) {
      return /^-?\d+$/.test(value);
    },
    jsonPretty:function(value)
    {
      let json = JSON.stringify(JSON.parse(value), null, 2);
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function(match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    },
    commandArgs2Array:function(text)
    {
      const re = /^"[^"]*"$/; // Check if argument is surrounded with double-quotes
      const re2 = /^([^"]|[^"].*?[^"])$/; // Check if argument is NOT surrounded with double-quotes

      let arr = [];
      let argPart = null;

      text && text.split(" ").forEach(function(arg) {
        if ((re.test(arg) || re2.test(arg)) && !argPart) {
          arr.push(arg);
        } else {
          argPart = argPart ? argPart + " " + arg : arg;
          // If part is complete (ends with a double quote), we can add it to the array
          if (/"$/.test(argPart)) {
            arr.push(argPart);
            argPart = null;
          }
        }
      });

      return arr;
    }
  },
  mounted() {
    this.items=Object.keys(this.client.methods);
    this.items.push("sendtoblsctaddress","generatetoblsctaddress","getblsctauditkey","getblsctseed","stakelock","stakeunlock","listtokens","createnft","createtoken","getnftbalance","gettokenbalance","mintnft","minttoken","sendnfttoblsctaddress","sendtokentoblsctaddress");
    document.addEventListener('click', this.closeContextMenu);
    if (this.result) this.$nextTick(() => {
      const el = document.getElementById('result');
      el.scrollTop = el.scrollHeight;
    });
  },
  destroyed() {
    document.removeEventListener('click', this.closeContextMenu);
  }
}
</script>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  background: rgba(17, 10, 35, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 0.5rem;
  min-width: 140px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.context-menu li {
  padding: 8px 16px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
}

.context-menu li:hover {
  background: rgba(139, 92, 246, 0.15);
}

.context-menu-divider {
  height: 1px !important;
  padding: 0 !important;
  background: rgba(255, 255, 255, 0.08) !important;
  cursor: default !important;
  margin: 4px 0;
}

.context-menu-divider:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

#result::-webkit-scrollbar-corner {
  background: transparent;
}
</style>