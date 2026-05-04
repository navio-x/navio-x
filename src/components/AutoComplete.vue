<template>
  <div class="autocomplete shadow w-full text-white">
    <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
      <li class="p-3 loading" v-if="isLoading">
        Loading results...
      </li>
      <li v-else v-for="(result, i) in results" :key="i" @click="setResult(result)" class="autocomplete-result p-3" :class="{ 'is-active': i === arrowCounter }">
        {{ result }}
      </li>
    </ul>
    <div class="input-wrapper">
      <input
        ref="input"
        autofocus class="glass-input h-10 w-full rounded leading-tight focus:outline-none"
        type="text" :placeholder="placeholder"
        @input="onChange"
        v-model="search"
        @keydown.down.prevent="onArrowDown"
        @keydown.up.prevent="onArrowUp"
        @keydown.enter="onEnter"
        @keydown.tab.prevent="onTab"
        @contextmenu.prevent="openContextMenu"
      />
      <span v-if="historyIndex >= 0" class="history-badge">
        {{ historyIndex + 1 }}/{{ history.length }}
      </span>
    </div>
    <div v-if="contextMenu.visible" class="input-context-menu" :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
      <ul>
        <li @mousedown.prevent="cutText">Cut</li>
        <li @mousedown.prevent="copyText">Copy</li>
        <li @mousedown.prevent="pasteText">Paste</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Autocomplete',
    props: {
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        isLoading: false,
        arrowCounter: -1,
        placeholder: "Type 'help' to see available methods.",
        history: [],
        historyIndex: -1,
        contextMenu: { visible: false, x: 0, y: 0 },
      };
    },
    watch: {
      items: function (value, oldValue) {
        if (value.length !== oldValue.length) {
          this.results = value;
          this.isLoading = false;
        }
      },
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside);
      document.addEventListener('keydown', this.handleGlobalKeydown);
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside);
      document.removeEventListener('keydown', this.handleGlobalKeydown);
    },
    methods: {
      setResult(result) {
        this.search = result;
        this.isOpen = false;
        this.arrowCounter = -1;
        this.historyIndex = -1;
        this.$emit('selected', result);
      },
      addToHistory(cmd) {
        if (cmd && cmd.trim()) {
          if (this.history[0] !== cmd) {
            this.history.unshift(cmd);
            if (this.history.length > 100) this.history.pop();
          }
        }
        this.historyIndex = -1;
      },
      filterResults() {
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        });
      },
      onChange() {
        this.placeholder = '';
        this.historyIndex = -1;
        this.$emit('input', this.search);
        this.$emit('selected', this.search);

        if (this.isAsync) {
          this.isLoading = true;
        } else {
          this.filterResults();
          this.isOpen = true;
        }
      },
      handleClickOutside(event) {
        if (!this.$el.contains(event.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
          this.contextMenu.visible = false;
        }
      },
      handleGlobalKeydown(event) {
        if (event.ctrlKey && event.key === 'l') {
          event.preventDefault();
          this.$emit('clear');
        }
      },
      openContextMenu(event) {
        this.contextMenu = { visible: true, x: event.clientX, y: event.clientY };
        this.$nextTick(() => {
          const menu = this.$el.querySelector('.input-context-menu');
          if (!menu) return;
          const rect = menu.getBoundingClientRect();
          const x = event.clientX + rect.width > window.innerWidth ? event.clientX - rect.width : event.clientX;
          const y = event.clientY + rect.height > window.innerHeight ? event.clientY - rect.height : event.clientY;
          this.contextMenu = { visible: true, x, y };
        });
      },
      cutText() {
        const input = this.$refs.input;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start === end) return;
        const selected = this.search.substring(start, end);
        navigator.clipboard.writeText(selected);
        this.search = this.search.substring(0, start) + this.search.substring(end);
        this.$emit('selected', this.search);
        this.contextMenu.visible = false;
        this.$nextTick(() => input.setSelectionRange(start, start));
      },
      copyText() {
        const input = this.$refs.input;
        const selected = this.search.substring(input.selectionStart, input.selectionEnd);
        if (selected) navigator.clipboard.writeText(selected);
        this.contextMenu.visible = false;
      },
      pasteText() {
        const input = this.$refs.input;
        navigator.clipboard.readText().then((text) => {
          const start = input.selectionStart;
          const end = input.selectionEnd;
          this.search = this.search.substring(0, start) + text + this.search.substring(end);
          this.$emit('selected', this.search);
          this.$nextTick(() => input.setSelectionRange(start + text.length, start + text.length));
        });
        this.contextMenu.visible = false;
      },
      onArrowDown() {
        if (this.isOpen) {
          if (this.arrowCounter < this.results.length - 1) {
            this.arrowCounter++;
          }
        } else if (this.historyIndex > 0) {
          this.historyIndex--;
          this.search = this.history[this.historyIndex];
          this.$emit('selected', this.search);
        } else if (this.historyIndex === 0) {
          this.historyIndex = -1;
          this.search = '';
          this.$emit('selected', '');
        }
      },
      onArrowUp() {
        if (this.isOpen) {
          if (this.arrowCounter > 0) {
            this.arrowCounter--;
          }
        } else if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.search = this.history[this.historyIndex];
          this.$emit('selected', this.search);
        }
      },
      onEnter() {
        if (this.isOpen && this.arrowCounter >= 0) {
          this.setResult(this.results[this.arrowCounter]);
        } else {
          this.$emit('submit', this.search);
        }
      },
      onTab() {
        if (this.results.length > 0) {
          this.setResult(this.results[0]);
        }
      },
    },
  };
</script>

<style>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
    position: absolute;
    top: -245px;
    padding: 0;
    margin: 0;
    height: 235px;
    width: 100%;
    overflow: auto;
    background: rgba(17, 10, 35, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 0.5rem;
    color: white;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    cursor: pointer;
  }

  .autocomplete-result:hover,
  .autocomplete-result.is-active {
    background: rgba(139, 92, 246, 0.15);
  }

  .input-wrapper {
    position: relative;
  }

  .history-badge {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: rgba(139, 92, 246, 0.9);
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 9999px;
    padding: 1px 7px;
    pointer-events: none;
    user-select: none;
  }

  .input-context-menu {
    position: fixed;
    z-index: 1000;
    background: rgba(17, 10, 35, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 0.5rem;
    min-width: 120px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  .input-context-menu ul {
    list-style: none;
    margin: 0;
    padding: 4px 0;
  }

  .input-context-menu li {
    padding: 8px 16px;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    user-select: none;
  }

  .input-context-menu li:hover {
    background: rgba(139, 92, 246, 0.15);
  }
</style>
