<template>
  <Dialog v-model:visible="showDialog" modal header="从Bangumi中添加..." :draggable="false" class="bgm_search_dialog_content" :closable="true">
    <div class="flex items-center gap-2 mb-4">
      <InputText size="small" class="flex-auto" autocomplete="off" v-model="title" placeholder="搜索标题" @keyup.enter="searchBangumi(title)" />
      <Button size="small" @click="searchBangumi(title)" :disabled="loading">搜索</Button>
    </div>
    <div>
      <DataTable :value="ls" v-if="ls.length!=0" class="mb-5" stripedRows>
        <Column field="title" header="封面" style="min-width: 70px;">
          <template #body="slotProps">
            <img :src="slotProps.data.image" height="70.7" width="50" :draggable="false" />
          </template>
        </Column>
        <Column field="title" header="标题" style="min-width: 280px;">
          <template #body="slotProps">
            <div class="item_title">{{ slotProps.data.title }}</div>
          </template>
        </Column>
        <Column header="集数" style="min-width: 60px;">
          <template #body="slotProps">
            <div class="ep select-none">
              {{ slotProps.data.eps==0 ? '?' : slotProps.data.eps }}
            </div>
          </template>
        </Column>
        <Column header="操作" style="min-width: 140px;" class="select-none">
          <template #body="slotProps">
            <Button severity="secondary" size="small" @click="infoHandler(slotProps.data)" :disabled="loading">查看</Button>
            <Button size="small" @click="showAdd(slotProps.data.id)" :disabled="loading" class="ml-2">添加</Button>
          </template>
        </Column>
      </DataTable>
      <div v-else-if="loading" class="loading">
        <i class="pi pi-spin pi-spinner" style="font-size: 20px"></i> 
      </div>
    </div>
  </Dialog>
  <Info ref="infoRef" @show-add="showAddFromInfo" />
  <Add ref="addRef"/>
  <Loading ref="loadingRef" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Dialog, Button, InputText, Column, DataTable } from 'primevue';
import { ref } from 'vue';
import hostname from '../../env/hostname';
import { useToast } from "primevue/usetoast";
import Store from '../../store';
import Info from './info.vue';
import type { BgmItem } from '../../types/bgm';
import Add from '../calendar/add.vue';
import Loading from '../loading.vue';

const toast = useToast();
const infoRef=ref();
const loadingRef=ref();
const addRef=ref();
const store=Store();

const loading=ref(false);

interface BangumiItem{
  id: number,
  title: string,
  episode: number,
}

const ls=ref<BangumiItem[]>([]);

const showDialog=ref(false);
const title=ref('');

function infoHandler(item: BangumiItem){
  infoRef.value.showInfoHanlder(item.id, 0);
}

async function searchBangumi(keyword: string, retry=false){

  if(keyword.length==0){
    toast.add({ severity: 'error', summary: '搜索失败', detail: '关键字不能为空', life: 3000 });
    return;
  }

  loading.value=true;

  document.activeElement instanceof HTMLElement &&
  document.activeElement.blur();

  let rlt=await axios.get(`${hostname}/api/list/bgm/search/${keyword}`, {
    headers: {
      token: store.token,
    }
  });
  if(rlt.data.ok){
    ls.value=rlt.data.msg;
  }else if(rlt.data.msg=="令牌已过期"){
    if(!retry && await store.refreshToken()){
      return searchBangumi(keyword, true);
    }
  }else{
    toast.add({ severity: 'error', summary: '搜索失败', detail: rlt.data.msg, life: 3000 });
  }
  loading.value=false;
}

const showAdd=async (id: string, retry=false)=>{ 
  loadingRef.value.loadingHandler(true, "加载集数信息");

  let rlt=await axios.get(`${hostname}/api/list/bgm/updates/${id.toString()}`, {
    headers: {
      token: store.token,
    }
  })

  loadingRef.value.loadingHandler(false, "加载集数信息");
  
  if(rlt.data.ok){
    const data=rlt.data.msg as BgmItem;
    addRef.value.showAddHandler(data, data.weekday);
    showDialog.value=false;
  }else if(rlt.data.msg=="令牌已过期"){
    if(!retry && await store.refreshToken()){
      return showAdd(id, true);
    }
  }else{
    toast.add({ severity: 'error', summary: '搜索失败', detail: rlt.data.msg, life: 3000 });
  }
}

const showAddFromInfo=async (item: BgmItem)=>{
  addRef.value.showAddHandler(item, item.weekday);
  showDialog.value=false;
}

const showDialogHandler=()=>{
  ls.value=[];
  title.value='';
  showDialog.value=true;
}

defineExpose({showDialogHandler})

</script>

<style>
.bgm_search_dialog_content{
  width: 40rem;
}
@media screen and (max-width: 40rem){
  .bgm_search_dialog_content{
    width: 100%;
  }
}
</style>

<style scoped>
.loading{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
.item_title{
  width: 260px;
}
.ep{
  padding-left: 6px;
}
</style>