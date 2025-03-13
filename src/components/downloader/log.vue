<template>
  <Dialog v-model:visible="showLog" modal header="日志" :style="{ width: '40rem' }" :draggable="false" class="select-none" :closable="true">
    <div class="mb-5">
      <div class="item" v-for="(item, index) in logs" :key="index" v-tooltip.bottom="item.msg">
        <div class="item_tag">
          <div class="tag tag_success" v-if="item.ok">OK</div>
          <div class="tag tag_err" v-else>ERR</div>
        </div>
        <div class="item_msg">{{ item.msg }}</div>
        <div class="item_time">{{ convertTime(item.time) }}</div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Dialog, useToast } from 'primevue';
import axios from 'axios';
import hostname from '../../env/hostname';
import store from '../../store';
import dayjs from 'dayjs';
const toast=useToast();

const showLog=ref(false);

let convertTime=(time: number)=>{
  return dayjs(time).format("YYYY-MM-DD HH:mm");
}

interface Log{
  ok: boolean,
  msg: string,
  time: number
}
const logs=ref<Log[]>([]);

const showLogHandler=async ()=>{
  showLog.value=true;
  const {data: response}=await axios.get(`${hostname}/api/download/log`, {
    headers: {
      token: store().token,
    }
  })
  if(response.ok){
    logs.value=response.msg.reverse() as Log[];
  }else{
    toast.add({ severity: 'error', summary: '获取日志失败', detail: response.msg, life: 3000 });
  }
}

defineExpose({showLogHandler})

</script>

<style scoped>
.item_tag{
  display: flex;
  align-items: center;
}
.tag{
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  height: 20px;
  border-radius: 10px;
}
.tag_err{
  background-color: #fee2e2;
  color: #b91c1c;
}
.tag_success{
  background-color: #dcfce7;
  color: #15803d;
}
.item_msg{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item{
  display: grid;
  grid-template-columns: 50px auto 150px;
  gap: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>