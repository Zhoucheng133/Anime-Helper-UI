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
</script>