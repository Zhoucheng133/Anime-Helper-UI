<template>
  <div 
    class="flex flex-col items-center cursor-pointer select-none shrink-0 w-25 group"
    @click="$emit('click')"
  >
    <div class="relative w-25 h-35.25 rounded overflow-hidden shadow">
      <Skeleton v-if="loading && !hasError && item.image" width="100px" height="141px" class="absolute inset-0" />
      
      <div v-if="hasError || !item.image" class="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 p-2 text-center">
        <i class="pi pi-image text-2xl mb-1"></i>
        <span class="text-[10px] line-clamp-2">暂无封面</span>
      </div>

      <!-- Actual Image -->
      <img 
        v-if="item.image"
        v-show="!hasError"
        :src="item.image" 
        :alt="item.title" 
        class="w-25 h-35.25 object-cover"
        @load="loading = false"
        @error="hasError = true; loading = false"
        :draggable="false" 
      />

      <div v-if="item.added" class="absolute inset-0 border-2 border-amber-400 rounded pointer-events-none"></div>
    </div>
    <span class="text-xs text-center mt-2 line-clamp-2 w-full px-0.5" :title="item.title">{{ item.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Skeleton } from 'primevue';
import type { CalendarItem } from '../../store/calendar';

const props = defineProps<{
  item: CalendarItem;
  weekday: number;
}>();

defineEmits(['click']);

const loading = ref(true);
const hasError = ref(false);

watch(() => props.item.image, () => {
  loading.value = true;
  hasError.value = false;
});
</script>
