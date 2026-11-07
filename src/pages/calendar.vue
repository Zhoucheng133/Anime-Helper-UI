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
          <div class="scroll_btn_l">
            <!-- Scroll Left -->
          </div>
          <div class="scroll_btn_r">
            <!-- Scroll Left -->
          </div>
          <div class="content scrollbar-none">
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

const showInfo=(item: CalendarItem, weekday: number)=>{
  infoRef.value.showInfoHanlder(item.id, weekday, false, !item.added);
}

onMounted(async ()=>{
  await calendar().getList();
  loading.value=false;
})
</script >

<style scoped>
:deep(.p-accordioncontent-wrapper) {
  overflow-x: hidden;
}

.scroll_btn_r{
  position: absolute;
  right: 0;
  top: 70.5px;
  transform: translateY(-50%);
  z-index: 10;
}

.scroll_btn_l{
  position: absolute;
  left: 0;
  top: 70.5px;
  transform: translateY(-50%);
  z-index: 10;
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