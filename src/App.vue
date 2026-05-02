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

import { onMounted } from 'vue';

onMounted(() => {
  const html: any = document.querySelector('html');
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = (isDark: any) => {
    if (isDark) {
      html.classList.add('my-app-dark');
    } else {
      html.classList.remove('my-app-dark');
    }
  };

  applyTheme(darkModeMediaQuery.matches);
  darkModeMediaQuery.addEventListener('change', (e) => applyTheme(e.matches));
});
</script>