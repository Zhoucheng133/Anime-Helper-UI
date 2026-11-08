<template>
  <div class="relative rounded overflow-hidden" :style="{ width: width, height: height }">
    <Skeleton v-if="loading && !hasError && src" :width="width" :height="height" class="absolute inset-0" />
    
    <div v-if="hasError || !src" class="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 p-1 text-center" :draggable="false">
      <i class="pi pi-image" :style="{ fontSize: iconSize }"></i>
      <span v-if="showText" class="text-[9px] line-clamp-2 mt-1">暂无封面</span>
    </div>

    <img 
      v-if="src"
      v-show="!hasError"
      :src="src" 
      :alt="title" 
      :style="{ width: width, height: height }"
      class="object-cover"
      @load="loading = false"
      @error="hasError = true; loading = false"
      :draggable="false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Skeleton } from 'primevue';

const props = withDefaults(defineProps<{
  src?: string;
  title?: string;
  width?: string;
  height?: string;
  showText?: boolean;
  iconSize?: string;
}>(), {
  src: '',
  title: '',
  width: '50px',
  height: '70.7px',
  showText: false,
  iconSize: '20px',
});

const loading = ref(true);
const hasError = ref(false);

watch(() => props.src, () => {
  loading.value = true;
  hasError.value = false;
});
</script>
