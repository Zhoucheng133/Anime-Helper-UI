<template>
  <Dialog v-model:visible="showDialog" modal header="从Bangumi中添加..." :draggable="false" class="select-none bgm_search_dialog_content" :closable="true">
    <div class="flex items-center gap-2 mb-4">
      <InputText size="small" id="title" class="flex-auto" autocomplete="off" v-model="title" placeholder="搜索标题" @keyup.enter="searchBangumi(title)" />
      <Button size="small" @click="searchBangumi(title)" :disabled="loaading">搜索</Button>
    </div>
    <div>
      <DataTable :value="ls" v-if="ls.length!=0" class="mb-5">
        <Column field="title" header="标题" style="min-width: 280px;">
          <template #body="slotProps">
            <div class="item_title">{{ slotProps.data.title }}</div>
          </template>
        </Column>
        <Column header="集数" style="min-width: 60px;">
          <template #body="slotProps">
            <div class="ep">
              {{ slotProps.data.episode }}
            </div>
          </template>
        </Column>
        <Column header="操作" style="min-width: 70px;">
          <template #body="slotProps">
            <Button severity="secondary" size="small" @click="addHandler(slotProps.data)" :disabled="loaading || slotProps.data.episode==0">添加</Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Dialog, Button, InputText, Column, DataTable } from 'primevue';
import { ref } from 'vue';
import hostname from '../../env/hostname';
import { useToast } from "primevue/usetoast";
import store from '../../store';
import list from '../../store/list';

const toast = useToast();

const loaading=ref(false);

interface BangumiItem{
  id: number,
  title: string,
  episode: number,
}

const ls=ref<BangumiItem[]>([]);

const showDialog=ref(false);
const title=ref('');

async function searchBangumi(keyword: string, retry=false){

  if(keyword.length==0){
    toast.add({ severity: 'error', summary: '搜索失败', detail: '关键字不能为空', life: 3000 });
    return;
  }

  let rlt=await axios.get(`${hostname}/api/list/bgm/search/${keyword}`, {
    headers: {
      token: store().token,
    }
  });
  if(rlt.data.ok){
    ls.value=rlt.data.msg;
  }else if(rlt.data.msg=="令牌已过期"){
    if(!retry && await store().refreshToken()){
      return searchBangumi(keyword, true);
    }
  }else{
    toast.add({ severity: 'error', summary: '搜索失败', detail: rlt.data.msg, life: 3000 });
  }
}

const addHandler=async (item: BangumiItem, retry=false)=>{
  let rlt=await axios.get(`${hostname}/api/list/bgm/updates/${item.id.toString()}`, {
    headers: {
      token: store().token,
    }
  });
  if(rlt.data.ok){
    await list().addItem(item.title, item.episode>rlt.data.msg.updates, item.episode, 0, rlt.data.msg.updates, rlt.data.msg.day)
    showDialog.value=false;
  }else if(rlt.data.msg=="令牌已过期"){
    if(!retry && await store().refreshToken()){
      return addHandler(item, true);
    }
  }else{
    toast.add({ severity: 'error', summary: '搜索失败', detail: rlt.data.msg, life: 3000 });
  }
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
.item_title{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ep{
  padding-left: 6px;
}
</style>