<template>
  <div class="page">
    <div class="topbar">
      <Select size="small" :options="typeOptions" v-model="type" optionLabel="name" option-value="code" :fluid="false" @change="load"/>
      <InputText size="small" v-model="searchKey"/>
    </div>
    <DataTable :value="searchRecnt">
      <Column field="title" header="标题">
        <template #body="slotProps">
          <div class="title_area">
            <div class="title">
              {{ slotProps.data.title }}
            </div>
            <div class="flex">
              <div class="select-none text-gray-400 text-xs">
                {{ dayjs(slotProps.data.time).format("YYYY-MM-DD HH:mm") }}
              </div>
              <div class="select-none text-gray-400 text-xs ml-8" v-if="type!='kisssub'" >
                {{ formatBytes(slotProps.data.length) }}
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column header="操作" style="min-width: 150px;">
        <template #body="slotProps">
          <ButtonGroup>
            <Button severity="secondary" icon="pi pi-link" size="small" style="font-size: 12px;" @click="copyHandler(slotProps.data as DownloadItem)" />
            <Button severity="secondary" label="添加至" size="small" style="font-size: 12px;" @click="addRef.showAddHandler(slotProps.data.title)" />
            <Button severity="secondary" size="small" @click="downloadHandler($event, slotProps.data.url)" ><i class="pi pi-download" style="font-size: 12px;"></i></Button>
          </ButtonGroup>
        </template>
      </Column>
    </DataTable>
  </div>
  <Loading ref="loadingRef" />
  <Add ref="addRef"/>
  <Copy ref="copyRef"/>
</template>

<script lang="ts" setup >
import { DataTable, Column, Button, ButtonGroup, useConfirm, InputText, Select } from 'primevue';
import recent, { type DownloadItem } from '../store/recent';
import { computed, onMounted, ref } from 'vue';
import Loading from '../components/loading.vue';
import Add from '../components/recent/add.vue';
import Copy from '../components/recent/copy.vue';
import dayjs from 'dayjs';
const loadingRef=ref();
const confirm=useConfirm();
const addRef=ref();
const searchKey=ref("");

document.title="AnimeHelper | 最近更新";

const type=ref("kisssub");
const typeOptions=[
  {name: "Kisssub", code: "kisssub"},
  {name: "Mikan", code: "mikan"}
]

const searchRecnt=computed(()=>{
  if(searchKey.value==""){
    return recent().list;
  }
  return recent().list.filter((item: DownloadItem)=>{
    return item.title.includes(searchKey.value);
  });
});

async function load(){
  loadingRef.value.loadingHandler(true, "获取最近更新列表");
  await recent().getList(type.value);
  loadingRef.value.loadingHandler(false, "获取最近更新列表");
}

const copyRef=ref();
const copyHandler=(val: DownloadItem)=>{
  copyRef.value.visible=true;
  copyRef.value.url=val.url;
  copyRef.value.magnet=val.magnet;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  const formatted = parseFloat(value.toFixed(2)).toString();

  return `${formatted} ${sizes[i]}`;
}

onMounted(async ()=>{
  load();
})

const downloadHandler=(event: any, url: string)=>{
  confirm.require({
    target: event.currentTarget,
    message: '你确定要下载它吗',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true,
      size: "small"
    },
    acceptProps: {
      size: "small",
      label: '下载',
    },
    accept: () => recent().download(url),
  });
}

</script>

<style scoped>
.topbar{
  margin-top: 10px;
  display: grid;
  grid-template-columns: 150px auto;
  gap: 10px;
}
.title{
  width: 800px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>