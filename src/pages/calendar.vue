<template>
  <div class="page">
    <Accordion :multiple="true" :value="[0, 1, 2, 3, 4, 5, 6]">
      <AccordionPanel v-for="(values, index) in calendar().list" :key="index" :value="index">
        <AccordionHeader>{{ list().weekdays[index==0 ? 6 : index-1].name }}</AccordionHeader>
        <AccordionContent>
          <Tag rounded v-for="(item, _) in values" :key="item.id" :value="item.title" :class="item.added ? 'select-none m-1' : 'select-none m-1 cursor-pointer'" :severity="calendar().added(item.title) ? 'warn' : 'secondary'" @click="showAdd(item, index)" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <Add ref="addRef" />
  </div>
</template>

<script lang="ts" setup>
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent, Tag } from 'primevue';
import { onMounted, ref } from 'vue';
import list from '../store/list';
import Add from '../components/calendar/add.vue';
import type { CalendarItem } from '../store/calendar';
import calendar from '../store/calendar';

document.title="AnimeHelper | 每日放送";

const addRef=ref();

const showAdd=(item: CalendarItem, weekday: number)=>{
  if(!item.added){
    addRef.value.showAddHandler(item, weekday);
  }
}

onMounted(async ()=>{
  await calendar().getList();
  if(list().list.length==0){
    await list().getList();
  }
})
</script>