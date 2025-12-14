<template>
  <div class="page">
    <div class="topbar">
      <InputGroup>
        <InputText v-model="searchKey" :fluid="true" placeholder="在这里搜索关键字" @keydown.enter="()=>searchHandler()"/>
        <Button @click="()=>searchHandler()">搜索</Button>
      </InputGroup>
    </div>
    <div v-if="result.length!=0">
      <DataTable :value="result">
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
    <div v-else class="empty">
      <div class="add_tip">
        <div>输入搜索关键词然后点击</div>
        <Tag>搜索</Tag>
        <div>按钮</div>
      </div>
    </div>
    <Loading ref="loadingRef" />
    <Add ref="addRef"/>
    <Copy ref="copyRef"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { InputText, InputGroup, DataTable, Column, Button, ButtonGroup, useConfirm, useToast, Tag } from 'primevue';
import type { DownloadItem } from '../store/recent';
import dayjs from 'dayjs';
import recent from '../store/recent';
import hostname from '../env/hostname';
import axios from 'axios';
import store from '../store';
import Add from '../components/recent/add.vue';
import Copy from '../components/recent/copy.vue';
import Loading from '../components/loading.vue';
const loadingRef=ref();
const confirm=useConfirm();
const addRef=ref();
const toast=useToast();

document.title="AnimeHelper | 搜索";

const searchKey = ref("");

const result = ref<DownloadItem[]>([]);

const searchHandler=async (retry=false)=>{
  loadingRef.value.loadingHandler(true, "搜索关键词...");
  const {data: response}=await axios.get(`${hostname}/api/search/${searchKey.value}`, {
    headers: {
      token: store().token,
    }
  });
  if(response.ok){
    result.value=response.msg;
  }else if(response.msg=="令牌已过期"){
    if(!retry && await store().refreshToken()){
      searchHandler(true);
      return;
    }
  }else{
    toast.add({ severity: 'error', summary: '搜索失败', detail: response.msg, life: 3000 });
  }
  loadingRef.value.loadingHandler(false, "获取最近更新列表");
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
    accept: () => recent().download(url),
  });
}

const copyRef=ref();
const copyHandler=(val: DownloadItem)=>{
  copyRef.value.visible=true;
  copyRef.value.url=val.url;
  copyRef.value.magnet=val.magnet;
}


</script>

<style scoped>
.topbar{
  margin-top: 10px;
  width: 100%;
}
.empty{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100vh - 60px - 45px - 50px);
}
.add_tip{
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>