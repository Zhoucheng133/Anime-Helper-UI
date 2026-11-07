<template>
  <div class="page">
    <div v-if="loading" class="empty">
      <div class="add_tip">
        <i class="pi pi-spin pi-spinner" style="font-size: 20px"></i> 
        <div style="margin-left: 10px;">正在加载中...</div>
      </div>
    </div>
    <Accordion :multiple="true" :value="[0, 1, 2, 3, 4, 5, 6]" v-else>
      <AccordionPanel v-for="(values, index) in calendar().list" :key="index" :value="index">
        <AccordionHeader>{{ list().weekdays[index==0 ? 6 : index-1].name }}</AccordionHeader>
        <AccordionContent style="overflow-x: hidden; position: relative;">
          <div class="scroll_btn_l" @click="scroll(index, 'left')">
            <i class="pi pi-chevron-left"></i>
          </div>
          <div class="scroll_btn_r" @click="scroll(index, 'right')">
             <i class="pi pi-chevron-right"></i>
          </div>
          <div :ref="el => { if (el) contentRefs[index] = el as HTMLElement }" class="content scrollbar-none">
            <CalendarCard 
              v-for="(item, _) in values" 
              :key="item.id" 
              :item="item"
              :weekday="index"
              @click="showInfo(item, index)"
            />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <Info ref="infoRef" />
  </div>
</template>

<script lang="ts" setup>
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primevue';
import { onMounted, ref } from 'vue';
import list from '../store/list';
import Info from '../components/calendar/info.vue';
import CalendarCard from '../components/calendar/card.vue';
import type { CalendarItem } from '../store/calendar';
import calendar from '../store/calendar';

document.title="AnimeHelper | 每日放送";
const loading=ref(true);

const infoRef=ref();
const contentRefs = ref<Record<number, HTMLElement>>({});

const showInfo=(item: CalendarItem, weekday: number)=>{
  infoRef.value.showInfoHanlder(item.id, weekday, false, !item.added);
}

const scroll = (index: number, direction: 'left' | 'right') => {
  const el = contentRefs.value[index];
  if (el) {
    const scrollAmount = 400;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};

onMounted(async ()=>{
  await calendar().getList();
  loading.value=false;
})
</script >

<style scoped>
:deep(.p-accordioncontent-wrapper) {
  overflow-x: hidden;
}

.helper-page-dark .scroll_btn_r, .helper-page-dark .scroll_btn_l{
  background-color: rgba(0, 0, 0, 0.6);
}

.scroll_btn_r, .scroll_btn_l{
  position: absolute;
  top: 70.5px;
  transform: translateY(-50%);
  z-index: 10;
  height: 50px;
  width: 30px;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
}

.scroll_btn_r{
  right: 0;
}

.scroll_btn_l{
  left: 0;
}
.content{
  width: 100%;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  gap: 16px;
}
.empty{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -10;
}
.add_tip{
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>