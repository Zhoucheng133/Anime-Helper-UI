<template>
  <div class="page">
    <Accordion :multiple="true" :value="[0, 1, 2, 3, 4, 5, 6]">
      <AccordionPanel v-for="(values, index) in calendarList" :key="index" :value="index">
        <AccordionHeader>{{ list().weekdays[index==0 ? 6 : index-1].name }}</AccordionHeader>
        <AccordionContent>
          <Tag rounded v-for="(item, index) in values" :key="index" :value="item.title" :class="item.added ? 'select-none m-1' : 'select-none m-1 cursor-pointer'" :severity="item.added ? 'warn' : 'secondary'" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent, Tag } from 'primevue';
import { onMounted, ref } from 'vue';
import hostname from '../env/hostname';
import store from '../store';
import list from '../store/list';

interface CalendarItem{
  title: string,
  id: string,
  added: boolean,
}

const calendarList=ref<[CalendarItem[]]>();

onMounted(async ()=>{
  const {data: response}=await axios.get(`${hostname}/api/calendar/get`, {
    headers: {
      token: store().token
    }
  })
  if(response.ok){
    calendarList.value=response.msg;
  }
})
</script>