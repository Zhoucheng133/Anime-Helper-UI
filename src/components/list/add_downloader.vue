<template>
  <Dialog v-model:visible="showAdd" modal header="添加番剧..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="flex items-center gap-2 mb-4">
      <label for="title" class="font-semibold w-20">标题</label>
      <InputText size="small" id="title" class="flex-auto" autocomplete="off" v-model="title" />
    </div>
    <div class="flex items-center gap-2 mb-4">
      <label for="ass" class="font-semibold w-20">字幕组</label>
      <InputText size="small" id="ass" class="flex-auto" autocomplete="off" v-model="ass"/>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="showAdd = false" size="small"></Button>
      <Button type="button" label="添加" @click="addHandler" size="small"></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Dialog, InputText, Button, useToast } from 'primevue';
import downloader from '../../store/downloader';
const toast=useToast();

const showAdd=ref(false);

const title=ref("");
const ass=ref("");

const addHandler=async ()=>{
  if(title.value.length==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: "标题不能为空", life: 3000 });
    return;
  }else if(ass.value.length==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: "字幕组不能为空", life: 3000 });
    return;
  }
  await downloader().addToList(title.value, ass.value);
  showAdd.value=false;
  title.value="";
  ass.value="";
}

const showAddHandler=(input: string)=>{
  showAdd.value=true;
  title.value=input;
}

defineExpose({showAddHandler})

</script>