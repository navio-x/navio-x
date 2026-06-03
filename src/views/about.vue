<template>
  <div class="h-full flex items-center justify-center bg-transparent text-white">
    <div class="w-full max-w-xl px-6 py-8 text-center">

      <img class="mx-auto" src="../assets/navio-x.png" style="width:108px;" alt="Navio-X Wallet"/>
      <h1 class="mt-8 text-2xl font-extrabold tracking-tight text-white">Navio X Wallet</h1>
      <div class="mt-1 flex items-center justify-center gap-2">
        <p class="text-xs font-mono text-white/60">v{{ appVersion }}</p>
        <span v-if="versionStatus === 'loading'" class="version-badge version-badge--loading">Checking...</span>
        <span v-else-if="versionStatus === 'latest'" class="version-badge version-badge--latest">Up to date</span>
        <span v-else-if="versionStatus === 'outdated'" class="version-badge version-badge--outdated">
          Update available → v{{ latestVersion }}
        </span>
      </div>
      <p class="mt-4 text-sm font-normal text-white/80 leading-relaxed">
        Navio X Wallet is an open-source, cross-platform desktop wallet built to securely interact with the Navio blockchain.
      </p>
      <p class="mt-2 text-sm font-normal text-white/70 leading-relaxed">
        The project is driven by Navio community developers and contributors. Join our Discord server to get support, share feedback, and follow development updates.
      </p>

      <a v-if="versionStatus === 'outdated'" target="_blank" href="https://github.com/navio-x/navio-x/releases/latest" class="about-btn-update mt-6 inline-flex">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download v{{ latestVersion }}
      </a>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a target="_blank" href="https://navio-x.github.io/" class="about-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Official Website
        </a>
        <a target="_blank" href="https://github.com/navio-x/navio-x" class="about-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          GitHub Repo
        </a>
        <a target="_blank" href="https://discord.gg/9P52VBSt44" class="about-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Join Discord
        </a>
      </div>


    </div>
  </div>
</template>

<script>
  import { version } from '../../package.json';

  export default {
    name: 'About',
    data() {
      return {
        appVersion: version,
        latestVersion: null,
        versionStatus: 'loading',
      };
    },
    mounted() {
      fetch('https://navio-x.github.io/latest.json')
        .then(r => r.json())
        .then(data => {
          this.latestVersion = data.version;
          this.versionStatus = this.compareVersions(version, data.version) >= 0 ? 'latest' : 'outdated';
        })
        .catch(() => { this.versionStatus = 'error'; });
    },
    methods: {
      compareVersions(a, b) {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
          if ((pa[i] || 0) > (pb[i] || 0)) return 1;
          if ((pa[i] || 0) < (pb[i] || 0)) return -1;
        }
        return 0;
      }
    }
  };
</script>

<style scoped>
.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.20);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.about-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
  color: #fff;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid;
}
.version-badge--loading {
  color: rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
}
.version-badge--latest {
  color: #34d399;
  background: rgba(52,211,153,0.10);
  border-color: rgba(52,211,153,0.25);
}
.version-badge--outdated {
  color: #fbbf24;
  background: rgba(251,191,36,0.10);
  border-color: rgba(251,191,36,0.30);
}

.about-btn-update {
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1200;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 14px rgba(251,191,36,0.30);
}
.about-btn-update:hover {
  opacity: 0.88;
  box-shadow: 0 4px 20px rgba(251,191,36,0.45);
}
</style>