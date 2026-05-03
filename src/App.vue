<template>
  <TitleBar style="position: sticky; top: 0" />
  <Toast />
  <ConfirmPopup />
  <router-view></router-view>
</template>

<script lang="ts" setup>
import Toast from 'primevue/toast';
import { ConfirmPopup } from 'primevue';
import TitleBar from './components/title_bar.vue';
import Store from './store';
import { onMounted, onUnmounted } from 'vue';
const store = Store();

const handleThemeChange = (isDarkFromSystem: boolean) => {
  const saved = localStorage.getItem('display');
  if (saved) {
    store.updateUI(saved === 'dark');
  } else {
    store.updateUI(isDarkFromSystem);
  }
};

const themeListener = (e: MediaQueryListEvent) => handleThemeChange(e.matches);

onMounted(() => {
  handleThemeChange(store.darkModeMediaQuery.matches);
  store.darkModeMediaQuery.addEventListener('change', themeListener);
});

onUnmounted(() => {
  store.darkModeMediaQuery.removeEventListener('change', themeListener);
});
</script>