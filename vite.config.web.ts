import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const stubNodeApi = {
  name: 'stub-node-api',
  load(id: string) {
    if (id.includes('node-api')) return 'export default {}';
  },
};

export default defineConfig({
  base: './',
  plugins: [vue(), stubNodeApi],
  define: {
    'import.meta.env.VITE_WEB': 'true',
    'process.env.BASE_URL': JSON.stringify('./'),
  },
  resolve: {
    alias: {
      'electron':    resolve(__dirname, 'src/stubs/electron.stub.js'),
      'bitcoin-core': resolve(__dirname, 'src/stubs/rpc-client.js'),
    },
  },
  server: {
    proxy: {
      '/rpc': 'http://localhost:7777',
    },
  },
  build: {
    outDir:     'dist-web',
    emptyOutDir: true,
  },
})
