<template>
  <div class="page">
    <DataTable :value="all().list">
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
              <div class="select-none text-gray-400 text-xs ml-8">
                {{ formatBytes(slotProps.data.length) }}
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column header="操作" style="min-width: 150px;">
        <template #body="slotProps">
          <ButtonGroup>
            <Button severity="secondary" icon="pi pi-clipboard" size="small" style="font-size: 12px;" @click="copyLink(slotProps.data as AllItem)" />
            <Button severity="secondary" label="添加至" size="small" style="font-size: 12px;" @click="addRef.showAddHandler(slotProps.data.title)" />
            <Button severity="secondary" size="small" @click="downloadHandler($event, slotProps.data.url)" ><i class="pi pi-download" style="font-size: 12px;"></i></Button>
          </ButtonGroup>
        </template>
      </Column>
    </DataTable>
  </div>
  <Loading ref="loadingRef" />
  <Add ref="addRef"/>
</template>

<script lang="ts" setup >
import { DataTable, Column, Button, ButtonGroup, useConfirm } from 'primevue';
import all, { type AllItem } from '../store/all';
import { onMounted, ref } from 'vue';
import Loading from '../components/loading.vue';
import Add from '../components/all/add.vue';
import dayjs from 'dayjs';
const loadingRef=ref();
const confirm=useConfirm();
const addRef=ref();

document.title="AnimeHelper | 所有";

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  const formatted = parseFloat(value.toFixed(2)).toString();

  return `${formatted} ${sizes[i]}`;
}

onMounted(async ()=>{
  loadingRef.value.loadingHandler(true, "获取所有列表");
  await all().getList();
  loadingRef.value.loadingHandler(false, "获取所有列表");
})

const copyLink=(item: AllItem)=>{
  // toClipboard(item.url);
  all().copy(item.url);
}

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
    accept: () => all().download(url),
  });
}

</script>

<style scoped>
.title{
  width: 800px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>