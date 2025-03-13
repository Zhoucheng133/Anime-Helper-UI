<template>
  <div class="d_page">
    <div class="flex items-center m-5">
      <div class="label">运行状态</div>
      <div class="flex items-center gap-5">
        <Tag :value="downloader().running ? '运行中' : '等待中'" :severity="downloader().running ? 'success' : 'warn'" />
        <ToggleSwitch v-model="downloader().running" />
      </div>
    </div>
    <div class="flex items-center m-5">
      <div class="label">系统操作</div>
      <ButtonGroup>
        <Button label="显示日志" size="small" severity="secondary" />
        <Button label="保存表单" size="small" severity="secondary" @click="downloader().save()" />
      </ButtonGroup>
    </div>
    <div class="flex items-center m-5">
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
    </div>
    <Accordion :multiple="true" :value="[0, 1]">
      <AccordionPanel :value="0">
        <AccordionHeader>番剧列表</AccordionHeader>
        <AccordionContent>
          <Button size="small">添加</Button>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel :value="1">
        <AccordionHeader>排除关键字</AccordionHeader>
        <AccordionContent>
          <Button size="small">添加</Button>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { ToggleSwitch, Tag, ButtonGroup, Button, Select, InputText, Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primevue';
import downloader from '../store/downloader';
import { onMounted } from 'vue';

onMounted(()=>{
  downloader().getList();
})

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