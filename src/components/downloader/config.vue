<template>
  <Dialog v-model:visible="showConfig" modal header="配置下载器" :style="{ width: '25rem' }" :draggable="false" class="select-none" :closable="false">
    <div class="mb-5">
      <div class="flex items-center m-3">
        <div class="label">RSS来源</div>
        <Select size="small" :options="downloader().rssTypes" v-model="downloader().rssSelected" optionLabel="text" />
      </div>
      <div class="flex items-center m-3">
        <div class="label">更新频率</div>
        <div class="flex items-center gap-3">
          <InputText size="small" v-model="downloader().freq" type="number" min="10" max="1440"/>
          <div>分钟</div>
        </div>
      </div>
      <div class="flex items-center m-3">
        <div class="label">下载器</div>
        <Select size="small" :options="downloader().clientType" v-model="downloader().clientTypeSelected" optionLabel="text" />
      </div>
      <div class="flex items-center m-3">
        <div class="label">{{ downloader().clientTypeSelected.id=='aria' ? "Aria2 地址" : "服务器地址" }}</div>
        <InputText size="small" placeholder="http(s)://" :fluid="true" v-model="downloader().link" />
      </div>
      <div class="flex items-center m-3" v-if="downloader().clientTypeSelected.id=='qbit'">
        <div class="label">用户名</div>
        <InputText size="small" :fluid="true" v-model="downloader().username"/>
      </div>
      <div class="flex items-center m-3">
        <div class="label">{{ downloader().clientTypeSelected.id=='aria' ? "Aria2 密钥" : "密码" }}</div>
        <Password size="small" v-model="downloader().secret" :feedback="false" toggleMask :fluid="true" style="width: 100%;"/>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="取消" severity="secondary" @click="showConfig = false" size="small"></Button>
      <Button type="button" label="完成" @click="configHandler" size="small"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, Button, InputText, Select, Password} from 'primevue';
import downloader from '../../store/downloader';

const showConfig=ref(false)

const configHandler=()=>{
  downloader().save();
  showConfig.value=false;
}

const showConfigHandler=()=>{
  downloader().getList()
  showConfig.value=true;
}

defineExpose({showConfigHandler})

</script>

<style scoped>
.label{
  width: 90px;
  flex-shrink: 0;
}
</style>