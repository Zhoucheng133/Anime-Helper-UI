<template>
  <Dialog v-model:visible="showLoading" modal :header="title" :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div>正在加载中...</div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from 'primevue';
import { ref } from 'vue';

const showLoading=ref(false);
const title=ref("");

const loadingHandler=(show: boolean, label: string)=>{
  title.value=label;
  showLoading.value=show;
}

defineExpose({loadingHandler});

</script>