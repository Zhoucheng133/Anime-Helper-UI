<template>
  <Dialog v-model:visible="showDialog" modal header="从Bangumi中绑定..." :draggable="false" class="bgm_search_dialog_content" :closable="true">
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
        <Column header="操作" style="min-width: 70px;" class="select-none">
          <template #body="slotProps">
            <Button size="small" @click="bind(slotProps.data)">绑定</Button>
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
import List from '../../store/list';

const toast = useToast();
const addRef=ref();
const store=Store();
const list=List();

const loading=ref(false);

interface BangumiItem{
  id: number,
  title: string,
  episode: number,
}

const ls=ref<BangumiItem[]>([]);

const showDialog=ref(false);
const title=ref('');

async function bind(data: BangumiItem){
  const rlt=await list.bind(listId.value, data.id.toString());
  if(rlt){
    toast.add({ severity: 'success', summary: '绑定成功', detail: `已绑定 ${data.title}`, life: 3000 });
    showDialog.value=false;
  }
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

const showAddFromInfo=async (item: BgmItem)=>{
  addRef.value.showAddHandler(item, item.weekday);
  showDialog.value=false;
}

let listId=ref('');

const bindHandler=(keyword: string, id: string)=>{
  ls.value=[];
  title.value=keyword;
  showDialog.value=true;
  listId.value=id;
  searchBangumi(keyword);
}

defineExpose({bindHandler})

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