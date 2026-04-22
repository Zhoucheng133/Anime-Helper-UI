<template>
  <Dialog v-model:visible="showInfo" modal header="番剧信息" :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="cover flex justify-center">
      <img :src="item.image" alt="" width="100" height="141" class="cover_img" :draggable="false"></img>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <div class="font-semibold w-20">标题</div>
      <div>{{ item.title }}</div>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <div class="font-semibold w-20">集数</div>
      <div>{{ item.eps }}</div>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <div class="font-semibold w-20">更新至</div>
      <div>{{ item.updates }}</div>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <div class="font-semibold w-20">评分</div>
      <div class="rating">
        <Rating :modelValue="0" readonly class="rate0" />
        <Rating :modelValue="5" readonly class="rate5" :style="{'clip-path': `inset(0 ${rateCompute}% 0 0)`}" />
      </div>
      <div>{{ item.score }} / 10</div>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="showInfo = false" size="small"></Button>
      <Button type="button" label="添加到列表" @click="addHandler" size="small"></Button>
    </div>
  </Dialog>
  <Loading ref="loadingRef" />
  <Add ref="addRef" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BgmItem } from '../../types/bgm';
import { useToast, Dialog, Button } from 'primevue';
import axios from 'axios';
import hostname from '../../env/hostname';
import Store from '../../store';
import Loading from '../loading.vue';
import Rating from 'primevue/rating';
import Add from './add.vue';

const toast=useToast();
const loadingRef=ref();
const store=Store();

const addRef=ref();

const rateCompute=computed(()=>{
  return 100 - (item.value.score * 10);
})

let weekday=ref<number>(0)
let showInfo=ref(false);
let item=ref<BgmItem>({
  title: '',
  id: '',
  score: 0,
  updates: 0,
  eps: 0,
  image: '',
  weekday: 0,
} as BgmItem);

const addHandler=()=>{
  showInfo.value=false;
  addRef.value.showAddHandler(item.value, weekday.value);
}

const showInfoHanlder=async (id: string, week: number, retry = false)=>{
  loadingRef.value.loadingHandler(true, "加载番剧信息");
  weekday.value=week;
  const {data: response}=await axios.get(`${hostname}/api/calendar/info/${id}`, {
    headers: {
      token: store.token,
    }
  });
  if(response.ok){
    item.value=response.msg as BgmItem;
    showInfo.value=true;
  }else if(response.msg=="令牌已过期"){
    if(!retry && await store.refreshToken()){
      showInfoHanlder(id, week, true);
      return;
    }
  }else{
    toast.add({ severity: 'error', summary: '获取信息失败', detail: response.msg, life: 3000 });
  }
  loadingRef.value.loadingHandler(false, "加载番剧信息");
}

defineExpose({showInfoHanlder})
</script>

<style scoped>
.rating{
  position: relative;
  display: inline-flex;
  align-items: center;
}
.rate5{
  position: absolute;
  top: 0;
  left: 0;
}
</style>