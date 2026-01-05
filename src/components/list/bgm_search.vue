<template>
  <Dialog v-model:visible="showDialog" modal header="从Bangumi中添加..." :draggable="false" class="select-none bgm_search_dialog_content" :closable="true">
    <div class="flex items-center gap-2 mb-4">
      <InputText size="small" id="title" class="flex-auto" autocomplete="off" v-model="title" />
      <Button size="small" @click="searchBangumi(title)">搜索</Button>
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
            <Button severity="secondary" size="small" @click="addHandler(slotProps.data.id)">添加</Button>
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

const toast = useToast();

interface BangumiItem{
  id: number,
  title: string,
  episode: number,
}

const selectedItem=ref<BangumiItem>();
const ls=ref<BangumiItem[]>([]);

const showDialog=ref(false);
const title=ref('');

async function searchBangumi(keyword: string, retry=false){
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

const addHandler=(id: number)=>{
  console.log(id);
  
  // TODO ?
}

const showDialogHandler=()=>{
  ls.value=[];
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