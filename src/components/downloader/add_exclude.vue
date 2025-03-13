<template>
  <Dialog v-model:visible="showAdd" modal header="添加一个排除关键字..." :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="flex items-center gap-2 mb-4">
      <label for="title" class="font-semibold w-20">关键字</label>
      <InputText size="small" id="title" class="flex-auto" autocomplete="off" v-model="key" />
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

const key=ref("");

const addHandler=async ()=>{
  if(key.value.length==0){
    toast.add({ severity: 'error', summary: '添加失败', detail: "关键字不能为空", life: 3000 });
    return;
  }
  await downloader().addToExclude(key.value);
  showAdd.value=false;
  key.value="";
}

const showAddHandler=()=>{
  showAdd.value=true;
}

defineExpose({showAddHandler})

</script>