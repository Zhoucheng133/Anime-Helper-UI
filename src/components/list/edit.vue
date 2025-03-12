<template>
  <Dialog v-model:visible="showEdit" modal header="编辑列表项..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="flex items-center gap-2 mb-4">
      <Checkbox v-model="update" inputId="update" binary/>
      <label for="update"> 当前在更新 </label>
    </div>
    <div class="flex items-center gap-2 mb-4">
      <label for="title" class="font-semibold w-20">标题</label>
      <InputText size="small" id="title" class="flex-auto" autocomplete="off" v-model="title" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <label for="episode" class="font-semibold w-20">集数</label>
      <InputText type="number" size="small" id="episode" class="flex-auto" autocomplete="off" v-model="episode" min="1" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <label for="watchTo" class="font-semibold w-20">观看至</label>
      <InputText type="number" size="small" id="watchTo" class="flex-auto" autocomplete="off" v-model="watchTo" min="0" :max="update ? updateTo : episode" />
    </div>
    <div class="flex items-center gap-2 mb-4" v-if="update">
      <label for="updateTo" class="font-semibold w-20">更新至</label>
      <InputText type="number" size="small" id="updateTo" class="flex-auto" autocomplete="off" v-model="updateTo" min="1" :max="episode" />
    </div>
    <div class="flex items-center gap-2 mb-4" v-if="update">
      <label for="updateWeek" class="font-semibold w-20">更新周</label>
       <Select size="small" id="updateWeek" v-model="updateWeekday" :options="list().weekdays" scroll-height="20rem" optionLabel="name" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="showEdit = false" size="small"></Button>
      <Button type="button" label="完成" @click="eidtHandler" size="small"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ListItem } from '../../store/list';
import list from '../../store/list';
import { Dialog, Button, InputText, Checkbox, Select, useToast } from 'primevue';
const toast=useToast();

const id=ref("");

const title=ref("");
const update=ref(false);
const episode=ref("");
const watchTo=ref("");
const updateTo=ref("");

const updateWeekday=ref(list().weekdays[0]);

const showEdit=ref(false);

const toWeekday=(time: number)=>{
  if(time==0){
    return list().weekdays[0];
  }
  const wd = new Date(time).getDay();
  return list().weekdays[wd==0 ? 6 : wd-1];
}

const showEditHandler=(item: ListItem)=>{
  id.value=item.id;
  showEdit.value=true;
  title.value=item.title;
  watchTo.value=item.now.toString();
  update.value=list().calculateEpisodesReleased(item.time)<item.episode;
  updateTo.value=list().analyseEpisode(item).toString();
  episode.value=item.episode.toString();
  updateWeekday.value=toWeekday(item.time);
}

const eidtHandler=async ()=>{
  if(title.value.length==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: '标题不能为空', life: 3000 });
    return;
  }else if(episode.value.length==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: '集数不能为空', life: 3000 });
    return;
  }else if(watchTo.value.length==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: '观看集数不能为空', life: 3000 });
    return;
  }else if(updateTo.value.length==0 && update.value){
    toast.add({ severity: 'error', summary: '添加失败', detail: '观看集数不能为空', life: 3000 });
    return;
  }

  await list().editItem(id.value, title.value, update.value,parseInt(episode.value), parseInt(watchTo.value), parseInt(updateTo.value), updateWeekday.value.code);

  showEdit.value=false;
}

defineExpose({showEditHandler})

</script>