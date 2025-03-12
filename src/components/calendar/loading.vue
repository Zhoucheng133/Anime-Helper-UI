<template>
  <Dialog v-model:visible="showLoading" modal header="添加到列表..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false"s>
    <div>正在加载番剧信息...</div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from 'primevue';
import { ref } from 'vue';

const showLoading=ref(false);
const loadingHandler=(show: boolean)=>{
  showLoading.value=show;
}

defineExpose({loadingHandler});

</script>