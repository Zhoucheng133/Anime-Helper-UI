<template>
  <Dialog v-model:visible="showAdd" modal header="添加到列表..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="flex items-center gap-2 mb-4">
      <Checkbox v-model="update" binary/>
      <div @click="update=!update">当前在更新</div>
    </div>
    <div class="flex items-center gap-2 mb-4">
      <div class="font-semibold w-20">标题</div>
      <InputText size="small" class="flex-auto" autocomplete="off" v-model="title" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <div class="font-semibold w-20">集数</div>
      <InputText type="number" size="small" class="flex-auto" autocomplete="off" v-model="episode" min="1" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <div class="font-semibold w-20">观看至</div>
      <InputText type="number" size="small" class="flex-auto" autocomplete="off" v-model="watchTo" min="0" :max="update ? updateTo : episode" />
    </div>
    <div class="flex items-center gap-2 mb-4" v-if="update">
      <div class="font-semibold w-20">更新至</div>
      <InputText type="number" size="small" class="flex-auto" autocomplete="off" v-model="updateTo" min="1" :max="episode" />
    </div>
    <div class="flex items-center gap-2 mb-4" v-if="update">
      <div class="font-semibold w-20">更新周</div>
       <Select size="small" v-model="updateWeekday" :options="list.weekdays" scroll-height="20rem" optionLabel="name" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="showAdd = false" size="small"></Button>
      <Button type="button" label="添加" @click="addHandler" size="small"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { Dialog, InputText, Button, Checkbox, Select } from 'primevue';
import { ref } from 'vue';
import listStore from '../../store/list';
import calendar from '../../store/calendar';
import type { BgmItem } from '../../types/bgm';

const list=listStore();

const showAdd=ref(false);
const updateWeekday=ref(list.weekdays[0]);

const title=ref("");
const update=ref(true);
const episode=ref("");
const watchTo=ref("0");
const updateTo=ref("0");

const id=ref("");

const showAddHandler=async (item: BgmItem, weekday: number)=>{
  title.value=item.title;
  episode.value=item.eps.toString();
  updateTo.value=item.updates.toString();
  id.value=item.id;
  updateWeekday.value=list.weekdays[weekday==0 ? 6 : weekday-1];

  if(item.updates>=item.eps){
    update.value=false;
    updateTo.value="0";
  }

  showAdd.value=true;
}

const addHandler=async ()=>{
  if(!list.formChecker(title.value, update.value, episode.value, watchTo.value, updateTo.value)){
    return;
  }

  const ok=await list.addItem(title.value, update.value,parseInt(episode.value), parseInt(watchTo.value), parseInt(updateTo.value), updateWeekday.value.code, id.value.toString());
  if(ok){
    calendar().getList();
    showAdd.value=false;
  }
}

defineExpose({showAddHandler})

</script>