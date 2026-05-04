<template>
  <div class="nws-wrap">
    <div class="nws-icon-ring">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="nws-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
      </svg>
    </div>
    <h2 class="nws-title">No Wallet Selected</h2>
    <p class="nws-desc">
      You need to load and activate a wallet to use this page.<br>Create or import one from the Wallets page.
    </p>
    <router-link to="/wallets" class="nws-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
      </svg>
      Go to Wallets
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NoWalletSelected'
}
</script>

<style scoped>
.nws-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4rem 1.5rem;
  text-align: center;
}

.nws-icon-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 0 28px rgba(139, 92, 246, 0.12);
  margin-bottom: 1.5rem;
}

.nws-icon {
  width: 32px;
  height: 32px;
  color: rgba(139, 92, 246, 0.7);
}

.nws-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.6rem;
}

.nws-desc {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.6;
  max-width: 280px;
  margin-bottom: 1.75rem;
}

.nws-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0.55rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.28);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.nws-btn:hover {
  background: rgba(139, 92, 246, 0.22);
  border-color: rgba(139, 92, 246, 0.5);
  color: #fff;
}
</style>
