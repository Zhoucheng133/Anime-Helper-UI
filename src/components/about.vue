<template>
  <Dialog v-model:visible="showAbout" modal header="关于" :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="true">
    <div class="content">
      <img src="/icon.svg" alt="" width="100px">
      <div class="title">Anime Helper</div>
      <div class="version">v{{ version }}</div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Dialog } from 'primevue';
import { onMounted, ref } from 'vue';
import hostname from '../env/hostname';

const showAbout=ref(false);
const version=ref("");

const showAboutHandler=()=>{
  showAbout.value=true;
}

defineExpose({showAboutHandler});

onMounted(async ()=>{
  const response=await axios.get(`${hostname}/api/version`);
  version.value=response.data;
})

</script>

<style scoped>
.version{
  color: rgb(120, 120, 120);
}
.title{
  font-size: 1.5rem;
}
.content{
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>