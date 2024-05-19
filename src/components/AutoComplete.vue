<template>
  <div class="autocomplete shadow w-full text-white">
    <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results bg-zinc-900 border border-zinc-800">
      <li class="p-3 loading" v-if="isLoading">
        Loading results...
      </li>
      <li v-else v-for="(result, i) in results" :key="i" @click="setResult(result)" class="autocomplete-result p-3 hover:bg-zinc-800" :class="{ 'is-active': i === arrowCounter }">
        {{ result }}
      </li>
    </ul>  
    <input
      autofocus class="h-10 w-full shadow border border-zinc-800 rounded text-gray-50 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800"
      type="text" :placeholder="placeholder"
      @input="onChange"
      v-model="search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
    />
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
        placeholder:"Type 'help' to see available methods."
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
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    methods: {
      setResult(result) {
        this.search = result;
        this.isOpen = false;
        this.$emit('selected', result);
      },
      filterResults() {
        this.results = this.items.filter((item) =>
        {
          return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        });
      },
      onChange() {
        this.placeholder='';
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
        }
      },
      onArrowDown() {
        if (this.arrowCounter < this.results.length) {
          this.arrowCounter = this.arrowCounter + 1;
        }
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter - 1;
        }
      },
      onEnter() {
        this.search = this.results[this.arrowCounter];
        this.isOpen = false;
        this.arrowCounter = -1;
      },
    },
  };
</script>

<style>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
    position:absolute;
    top:-245px;
    padding: 0;
    margin: 0;
    height: 235px;
    width:100%;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    cursor: pointer;
  }

</style>
