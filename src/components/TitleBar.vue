<template>
  <div class="titlebar" :class="{ 'is-mac': isMac }">

    <!-- macOS: traffic-light controls on the left -->
    <div v-if="isMac" class="controls controls-mac" @dblclick.stop>
      <button @click="closeWindow" class="ctrl-btn ctrl-close" title="Close">
        <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1 1l4 4M5 1L1 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
      <button @click="minimizeWindow" class="ctrl-btn ctrl-minimize" title="Minimize">
        <svg width="6" height="2" viewBox="0 0 6 2"><path d="M0 1h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
      <button @click="maximizeWindow" class="ctrl-btn ctrl-maximize" title="Maximize">
        <svg width="6" height="6" viewBox="0 0 6 6"><rect x="0.5" y="0.5" width="5" height="5" rx="0.5" stroke="currentColor" stroke-width="1.1" fill="none"/></svg>
      </button>
    </div>

    <!-- Drag region: logo + title -->
    <div class="titlebar-drag">
      <img src="../assets/logo.svg" class="titlebar-logo" alt="" draggable="false" style="display:none">
      <span class="titlebar-title">Navio X</span>
      <span v-if="network" class="titlebar-badge" style="display:none">{{ network }}</span>
    </div>

    <!-- Spacer (keeps title centered on Win/Linux) -->
    <div v-if="!isMac" class="titlebar-spacer"></div>

    <!-- Windows / Linux: controls on the right -->
    <div v-if="!isMac" class="controls controls-win" @dblclick.stop>
      <button @click="minimizeWindow" class="ctrl-btn ctrl-minimize" title="Minimize">
        <svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <button @click="maximizeWindow" class="ctrl-btn ctrl-maximize" title="Restore/Maximize">
        <template v-if="maximized">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="2.5" y="0.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M0.5 2.5v7h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          </svg>
        </template>
        <template v-else>
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        </template>
      </button>
      <button @click="closeWindow" class="ctrl-btn ctrl-close" title="Close">
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>

  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'TitleBar',
  props: {
    network: { type: String, default: null },
  },
  data() {
    return {
      isMac: process.platform === 'darwin',
      maximized: false,
    };
  },
  methods: {
    minimizeWindow() { ipcRenderer.invoke('window-minimize'); },
    maximizeWindow() { ipcRenderer.invoke('window-maximize'); },
    closeWindow()    { ipcRenderer.invoke('window-close');    },
  },
  mounted() {
    ipcRenderer.invoke('window-is-maximized').then(v => { this.maximized = !!v; });
    ipcRenderer.on('window-maximized',   () => { this.maximized = true;  });
    ipcRenderer.on('window-unmaximized', () => { this.maximized = false; });
  },
};
</script>

<style scoped>
.titlebar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 36px;
  z-index: 9999;
  display: flex;
  align-items: center;
  -webkit-app-region: drag;
  background: linear-gradient(90deg, rgba(42, 14, 84, 0.98) 0%, rgba(24, 16, 58, 0.98) 40%, rgba(10, 16, 46, 0.98) 100%);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  user-select: none;
}

/* ── Drag / title area ─────────────────────────── */
.titlebar-drag {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  height: 100%;
  flex-shrink: 0;
}

.titlebar-logo {
  width: 15px;
  height: 15px;
  object-fit: contain;
  pointer-events: none;
  opacity: 0.85;
  flex-shrink: 0;
}

.titlebar-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.titlebar-badge {
  font-size: 10px;
  font-weight: 600;
  color: rgba(139, 92, 246, 0.9);
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 4px;
  padding: 1px 6px;
  letter-spacing: 0.04em;
  text-transform: capitalize;
}

.titlebar-spacer { flex: 1; }

/* ── Generic button ────────────────────────────── */
.controls {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
  flex-shrink: 0;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: background 0.13s ease, color 0.13s ease;
  outline: none;
  padding: 0;
  flex-shrink: 0;
}

/* ── Windows / Linux controls ──────────────────── */
.controls-win {
  padding-right: 10px;
  gap: 6px;
}

.controls-win .ctrl-btn {
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
}

.controls-win .ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.13);
  color: rgba(255, 255, 255, 0.9);
}

.controls-win .ctrl-close:hover {
  background: #c42b1c !important;
  color: #fff !important;
}

/* ── macOS traffic-light controls ──────────────── */
.controls-mac {
  padding: 0 16px;
  gap: 7px;
}

.controls-mac .ctrl-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  padding: 0;
  position: relative;
}

.controls-mac .ctrl-close    { background: #ff5f57; box-shadow: 0 0 0 0.5px rgba(255,95,87,0.5); }
.controls-mac .ctrl-minimize { background: #febc2e; box-shadow: 0 0 0 0.5px rgba(254,188,46,0.5); }
.controls-mac .ctrl-maximize { background: #28c840; box-shadow: 0 0 0 0.5px rgba(40,200,64,0.5); }

.controls-mac .ctrl-btn svg {
  position: absolute;
  opacity: 0;
  transition: opacity 0.12s;
}

.controls-mac:hover .ctrl-btn svg { opacity: 1; color: rgba(0,0,0,0.55); }
</style>
