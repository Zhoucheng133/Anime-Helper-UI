<template>
  <div class="d_page">
    <div class="flex items-center m-5">
      <div class="label">运行状态</div>
      <div class="flex items-center gap-5">
        <Tag :value="downloader().running ? '运行中' : '等待中'" :severity="downloader().running ? 'success' : 'warn'" />
        <ToggleSwitch v-model="downloader().running" @value-change="downloader().toggleRun" />
      </div>
    </div>
    <div class="flex items-center m-5">
      <div class="label">系统操作</div>
      <ButtonGroup>
        <Button label="下载器配置" size="small" severity="secondary" @click="showConfig" />
        <Button label="显示日志" size="small" severity="secondary" @click="showLog" />
        <Button label="保存表单" size="small" severity="secondary" @click="downloader().save()" />
      </ButtonGroup>
    </div>
    <!-- <div class="flex items-center m-5">
      <div class="label">RSS来源</div>
      <Select size="small" :options="downloader().rssTypes" v-model="downloader().rssSelected" optionLabel="text"  style="width: 120px;" />
    </div>
    <div class="flex items-center m-5">
      <div class="label">更新频率</div>
      <div class="flex items-center gap-3">
        <InputText size="small" v-model="downloader().freq" style="width: 100px;" type="number" min="10" max="1440"/>
        <div>分钟</div>
      </div>
    </div>
    <div class="flex items-center m-5">
      <div class="label">Aria2 地址</div>
      <InputText size="small" placeholder="http(s)://" :fluid="true" v-model="downloader().link" />
    </div>
    <div class="flex items-center m-5">
      <div class="label">Aria2 密钥</div>
      <InputText size="small" :fluid="true" v-model="downloader().secret" type="password" />
    </div> -->
    <Accordion :multiple="true" :value="[0, 1]">
      <AccordionPanel :value="0">
        <AccordionHeader>番剧列表</AccordionHeader>
        <AccordionContent>
          <Button size="small" @click="showAddList">添加</Button>
          <DataTable :value="downloader().list">
            <Column field="title" header="标题"></Column>
            <Column field="ass" header="字幕组"></Column>
            <Column header="操作">
              <template #body="slotProps">
                <Button size="small" label="删除" severity="danger" variant="text" @click="delFromListHandler($event, slotProps.data.id)" />
              </template>
            </Column>
          </DataTable>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel :value="1">
        <AccordionHeader>排除关键字</AccordionHeader>
        <AccordionContent>
          <Button size="small" @click="addExclude">添加</Button>
          <DataTable :value="downloader().exclude">
            <Column field="key" header="关键字"></Column>
            <Column header="操作">
              <template #body="slotProps">
                <Button size="small" label="删除" severity="danger" variant="text" @click="delFromExcludeHandler($event, slotProps.data.id)" />
              </template>
            </Column>
          </DataTable>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <AddList ref="addListRef" />
    <AddExclude ref="addExcludeRef" />
    <Log ref="logRef" />
    <Config ref="configRef" />
  </div>
</template>

<script setup lang="ts">
import { ToggleSwitch, Tag, ButtonGroup, Button, Select, InputText, Accordion, AccordionPanel, AccordionHeader, AccordionContent, DataTable, Column, useConfirm } from 'primevue';
import downloader from '../store/downloader';
import { onMounted, ref } from 'vue';
import AddList from '../components/downloader/add_list.vue';
import AddExclude from '../components/downloader/add_exclude.vue';
import Config from '../components/downloader/config.vue';
import Log from '../components/downloader/log.vue';
const confirm = useConfirm();
const addListRef=ref();
const addExcludeRef=ref();
const logRef=ref();
const configRef=ref();

document.title="AnimeHelper | 下载器";

onMounted(()=>{
  downloader().getList();
})

const showConfig=()=>{
  configRef.value.showConfigHandler();
}

const showLog=()=>{
  logRef.value.showLogHandler();
}

const addExclude=()=>{
  addExcludeRef.value.showAddHandler();
}

const showAddList=()=>{
  addListRef.value.showAddHandler();
}

const delFromExcludeHandler=(event: any, id: string)=>{
  confirm.require({
    target: event.currentTarget,
    message: '你确定要删除这个它吗',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true,
      size: "small"
    },
    acceptProps: {
      size: "small",
      label: '删除',
      severity: "danger"
    },
    accept: () => downloader().delFromExclude(id),
  });
}

const delFromListHandler=(event: any, id: string)=>{
  confirm.require({
    target: event.currentTarget,
    message: '你确定要删除这个它吗',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true,
      size: "small"
    },
    acceptProps: {
      size: "small",
      label: '删除',
      severity: "danger"
    },
    accept: () => downloader().delFromList(id),
  });
}

</script>

<style scoped>
.label{
  width: 100px;
  flex-shrink: 0;
}
.d_page{
  margin: auto;
  width: 800px;
  padding-top: 10px;
  padding-bottom: 10px;
}

@media screen and (max-width: 840px) {
  .d_page{
    width: calc(100% - 40px);
  }
}
</style>