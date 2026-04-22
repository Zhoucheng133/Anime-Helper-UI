<template>
  <Dialog v-model:visible="showInfo" modal header="番剧信息" :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="cover flex justify-center">
      <img :src="item.image" alt="" width="100" height="141" class="cover_img"></img>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <label for="title" class="font-semibold w-20">标题</label>
      <div id="title">{{ item.title }}</div>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <label for="eps" class="font-semibold w-20">集数</label>
      <div id="eps">{{ item.eps }}</div>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <label for="updates" class="font-semibold w-20">更新至</label>
      <div id="updates">{{ item.updates }}</div>
    </div>
    <div class="flex items-center gap-2 mb-4 mt-4">
      <label for="rate" class="font-semibold w-20">评分</label>
      <div class="rating">
        <Rating id="rate" :modelValue="0" readonly class="rate0" />
        <Rating id="rate" :modelValue="5" readonly class="rate5" :style="{'clip-path': `inset(0 ${rateCompute}% 0 0)`}" />
      </div>
      <div>{{ item.score }} / 10</div>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="showInfo = false" size="small"></Button>
      <Button type="button" label="添加到列表" @click="addHandler" size="small"></Button>
    </div>
  </Dialog>
  <Loading ref="loadingRef" />
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

const toast=useToast();
const loadingRef=ref();
const store=Store();

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
} as BgmItem);

const addHandler=()=>{

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