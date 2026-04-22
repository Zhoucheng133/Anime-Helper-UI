<template>
  <Dialog v-model:visible="showAdd" modal header="添加到列表..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="flex items-center gap-2 mb-4">
      <Checkbox v-model="update" inputId="update" binary/>
      <div> 当前在更新 </div>
    </div>
    <div class="flex items-center gap-2 mb-4">
      <div class="font-semibold w-20">标题</div>
      <InputText size="small" id="title" class="flex-auto" autocomplete="off" v-model="title" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <div class="font-semibold w-20">集数</div>
      <InputText type="number" size="small" id="episode" class="flex-auto" autocomplete="off" v-model="episode" min="1" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <div class="font-semibold w-20">观看至</div>
      <InputText type="number" size="small" id="watchTo" class="flex-auto" autocomplete="off" v-model="watchTo" min="0" :max="update ? updateTo : episode" />
    </div>
    <div class="flex items-center gap-2 mb-4" v-if="update">
      <div class="font-semibold w-20">更新至</div>
      <InputText type="number" size="small" id="updateTo" class="flex-auto" autocomplete="off" v-model="updateTo" min="1" :max="episode" />
    </div>
    <div class="flex items-center gap-2 mb-4" v-if="update">
      <div class="font-semibold w-20">更新周</div>
       <Select size="small" id="updateWeek" v-model="updateWeekday" :options="list.weekdays" scroll-height="20rem" optionLabel="name" />
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
import listStore from '../../store/list';

const list=listStore();

const showAdd=ref(false);

const title=ref("");
const update=ref(false);
const episode=ref("");
const watchTo=ref("0");
const updateTo=ref("");

const updateWeekday=ref(list.weekdays[0]);

const addHandler=async ()=>{
  if(!list.formChecker(title.value, update.value, episode.value, watchTo.value, updateTo.value)){
    return;
  }

  const ok=await list.addItem(title.value, update.value,parseInt(episode.value), parseInt(watchTo.value), parseInt(updateTo.value), updateWeekday.value.code, "");

  if(ok){
    showAdd.value=false;
    title.value="";
    update.value=false;
    episode.value="";
    watchTo.value="0";
    updateTo.value="";
    updateWeekday.value=list.weekdays[0];
  }
}

const showAddHandler=()=>{
  showAdd.value=true;
}

defineExpose({showAddHandler, })

</script>