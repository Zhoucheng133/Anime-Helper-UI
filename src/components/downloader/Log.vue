<template>
  <Dialog v-model:visible="showLog" modal header="日志" :style="{ width: '40rem' }" :draggable="false" class="select-none" :closable="true">
    <div class="mb-5">
      <div class="item" v-for="item in groupedLogs" v-tooltip.bottom="item.msg" v-if="!mobile">
        <div class="item_tag">
          <div class="tag tag_success" v-if="item.ok">OK</div>
          <div class="tag tag_err" v-else>ERR</div>
        </div>
        <div class="item_content_area">
          <div class="item_msg">{{ item.msg }}</div>
          <div class="item_time">
            <div v-if="item.count > 1">{{ convertTime(item.start) }} → {{ convertTime(item.end) }}</div>
            <div v-else>{{ convertTime(item.time) }}</div>
          </div>
        </div>
        <div class="item_count">
          <div class="tag_count" v-if="item.count > 1">x {{ item.count }}</div>
        </div>
      </div>

      <div class="item_m" v-for="item in groupedLogs" v-tooltip.bottom="item.msg" v-else>
        <div class="item_tag">
          <div class="tag tag_success" v-if="item.ok">OK</div>
          <div class="tag tag_err" v-else>ERR</div>
        </div>
        <div class="item_data_m flex-col" style="width: 100%;">
          <div class="item_content_area_m flex items-center justify-between" style="display: flex; align-items: center; justify-content: space-between; gap: 5px;">
            <div class="item_msg_m" style="flex: 1;">{{ item.msg }}</div>
            <div class="item_count_m" v-if="item.count > 1">
              <div class="tag_count">x {{ item.count }}</div>
            </div>
          </div>
          <div class="item_time_m">
            <div class="item_item_long" v-if="item.count > 1">{{ convertTime(item.start) }} → {{ convertTime(item.end) }}</div>
            <div v-else>{{ convertTime(item.time) }}</div>
          </div>
        </div>
      </div>

    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Dialog, useToast } from 'primevue';
import axios from 'axios';
import hostname from '../../env/hostname';
import Store from '../../store';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
const toast=useToast();

const groupedLogs = computed(() => {
  const result = [];

  for (const log of logs.value) {
    const last = result[result.length - 1];

    if (
      last &&
      last.msg === log.msg &&
      last.ok === log.ok
    ) {
      last.end = log.time;
      last.count++;
    } else {
      result.push({
        ...log,
        start: log.time,
        end: log.time,
        count: 1
      });
    }
  }

  return result.reverse();
});

const showLog=ref(false);
const store=Store();
const mobile=storeToRefs(store).mobile;

let convertTime=(time: number)=>{
  return dayjs(time).format("YYYY-MM-DD HH:mm");
}

interface Log{
  ok: boolean,
  msg: string,
  time: number
}
const logs=ref<Log[]>([]);

const showLogHandler=async (retry = false)=>{
  showLog.value=true;
  const {data: response}=await axios.get(`${hostname}/api/download/log`, {
    headers: {
      token: store.token,
    }
  })
  if(response.ok){
    logs.value=response.msg as Log[];
  }else if(response.msg=="令牌已过期"){
    if(!retry && await store.refreshToken()){
      showLogHandler(true);
      return;
    }
  }else{
    toast.add({ severity: 'error', summary: '获取日志失败', detail: response.msg, life: 3000 });
  }
}

defineExpose({showLogHandler})

</script>

<style scoped>
.tag_count{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
}

.helper-page-dark .tag_count{
  background-color: #334155;
  color: #cbd5e1;
}

.item_time{
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.item_time_m{
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.item_content_area{
  min-width: 0;
  overflow: hidden;
}
.item_content_area_m{
  min-width: 0;
  overflow: hidden;
}
.item_count{
  text-align: right;
  font-weight: bold;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}
.item_count_m{
  text-align: right;
  font-weight: bold;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
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

.helper-page-dark .tag_err{
  color: #fee2e2;
  background-color: #b91c1c;
}

.helper-page-dark .tag_success{
  color: #dcfce7;
  background-color: #15803d;
}

.item_msg{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item{
  display: grid;
  grid-template-columns: 50px auto 80px;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.item_m{
  display: grid;
  margin-top: 8px;
  margin-bottom: 8px;
  gap: 5px;
  grid-template-columns: 50px auto;
  overflow: hidden;
  align-items: center;
}
.item_data_m{
  min-width: 0;
}
.item_msg_m, .item_time_m, .item_item_long{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>