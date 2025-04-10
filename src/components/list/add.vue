<template>
  <Dialog v-model:visible="showAdd" modal header="添加到列表..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
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
      <Button type="button" label="取消" severity="secondary" @click="showAdd = false" size="small"></Button>
      <Button type="button" label="添加" @click="addHandler" size="small"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, InputText, Button, Checkbox, Select } from 'primevue';
import list from '../../store/list';
import { useToast } from 'primevue';

const showAdd=ref(false);

const toast=useToast();

const title=ref("");
const update=ref(false);
const episode=ref("");
const watchTo=ref("0");
const updateTo=ref("");

const updateWeekday=ref(list().weekdays[0]);

const addHandler=async ()=>{
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
  }else if(update.value && parseInt(updateTo.value)==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: '更新集数不能为0', life: 3000 });
    return;
  }

  await list().addItem(title.value, update.value,parseInt(episode.value), parseInt(watchTo.value), parseInt(updateTo.value), updateWeekday.value.code);

  showAdd.value=false;
  title.value="";
  update.value=false;
  episode.value="";
  watchTo.value="";
  updateTo.value="";
  updateWeekday.value=list().weekdays[0];
}

const showAddHandler=()=>{
  showAdd.value=true;
}

defineExpose({showAddHandler, })

</script>