<template>
  <div class="d_page">
    <div class="flex items-center m-5">
      <div class="label">运行状态</div>
      <div class="flex items-center gap-5">
        <Tag :value="downloader.running ? '运行中' : '等待中'" :severity="downloader.running ? 'success' : 'warn'" />
        <ToggleSwitch v-model="downloader.running" @value-change="downloader.toggleRun" />
      </div>
    </div>
    <div class="flex items-start m-5">
      <div class="label">系统操作</div>
      <div class="operations">
        <ButtonGroup>
          <Button label="显示日志" size="small" severity="secondary" @click="showLog" />
          <Button label="下载器配置" size="small" severity="secondary" @click="showConfig" />
        </ButtonGroup>
        <div class="saverunning">
          <Checkbox v-model="downloader.saverunning" binary inputId="saverunning" @change="setSaveRunning" />
          <label for="saverunning" class="ml-2">启动检查运行状态</label>
        </div>
      </div>
    </div>
    <Accordion :multiple="true" :value="[0, 1]">
      <AccordionPanel :value="0">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-list" style="color: var(--p-primary-color);"></i>
            <div>自动下载列表</div>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <div class="list_toolbar">
            <div class="list_toolbar_title">
              <span>已添加番剧</span>
              <Badge :value="downloader.list.length" severity="secondary" />
            </div>
            <Button size="small" icon="pi pi-plus" label="添加" @click="showAddList" />
          </div>
          <div class="anime_list" v-if="downloader.list.length!=0">
            <div class="anime_item" v-for="item in downloader.list" :key="item.id">
              <span class="anime_title" v-tooltip.top="{ value: item.title, showDelay: 500 }">{{ item.title }}</span>
              <Tag class="anime_ass" :value="item.ass" severity="secondary" />
              <Button
                class="anime_delete"
                icon="pi pi-trash"
                size="small"
                text
                rounded
                severity="danger"
                :aria-label="`删除 ${item.title}`"
                @click="delFromListHandler($event, item)"
              />
            </div>
          </div>
          <div class="list_empty" v-else>
            <i class="pi pi-list" />
            <div>还没有添加需要下载的番剧</div>
            <Button size="small" icon="pi pi-plus" label="添加第一个" @click="showAddList" />
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel :value="1">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-filter" style="color: var(--p-primary-color);"></i>
            <div>排除关键字</div>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <div class="list_toolbar">
            <div class="list_toolbar_title">
              <span>已添加关键字</span>
              <Badge :value="downloader.exclude.length" severity="secondary" />
            </div>
            <Button size="small" icon="pi pi-plus" label="添加" @click="addExclude" />
          </div>
          <div class="exclude_tags" v-if="downloader.exclude.length!=0">
            <div class="exclude_tag" v-for="item in downloader.exclude" :key="item.id">
              <Tag :value="item.key" severity="secondary" />
              <Button
                icon="pi pi-times"
                size="small"
                text
                rounded
                severity="secondary"
                :aria-label="`删除 ${item.key}`"
                @click="delFromExcludeHandler($event, item.id)"
              />
            </div>
          </div>
          <div class="list_empty" v-else>
            <i class="pi pi-filter" />
            <div>还没有添加排除关键字</div>
            <Button size="small" icon="pi pi-plus" label="添加第一个" @click="addExclude" />
          </div>
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
import { ToggleSwitch, Tag, Badge, ButtonGroup, Button, Accordion, AccordionPanel, AccordionHeader, AccordionContent, useConfirm, Checkbox } from 'primevue';
import downloaderStore from '../store/downloader';
import { onMounted, ref } from 'vue';
import AddList from '../components/downloader/AddList.vue';
import AddExclude from '../components/downloader/AddExclude.vue';
import Config from '../components/downloader/Config.vue';
import Log from '../components/downloader/Log.vue';
const confirm = useConfirm();
const addListRef=ref();
const addExcludeRef=ref();
const logRef=ref();
const configRef=ref();
const downloader=downloaderStore();

document.title="AnimeHelper | 下载器";

onMounted(()=>{
  downloader.getList();
})

const showConfig=()=>{
  configRef.value.showConfigHandler();
}

const setSaveRunning=()=>{
  downloader.toggleSaveRunning(downloader.saverunning)
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
    accept: () => downloader.delFromExclude(id),
  });
}

const delFromListHandler=(event: any, item: { id: string, title: string })=>{
  confirm.require({
    target: event.currentTarget,
    message: `确定删除《${item.title}》吗？`,
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
    accept: () => downloader.delFromList(item.id),
  });
}

</script>

<style scoped>
.saverunning{
  display: flex;
  align-items: center;
  user-select: none;
}
.operations{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
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
.list_toolbar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.list_toolbar_title{
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--p-text-muted-color);
}
.anime_list{
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  overflow: hidden;
}
.helper-page-dark .anime_list,
.helper-page-dark .list_empty{
  border-color: var(--p-surface-700);
}
.anime_item{
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  transition: background-color .15s ease;
}
.anime_item + .anime_item{
  border-top: 1px solid var(--p-surface-200);
}
.helper-page-dark .anime_item + .anime_item{
  border-top-color: var(--p-surface-700);
}
.anime_item:hover{
  background: var(--p-surface-50);
}
.helper-page-dark .anime_item:hover{
  background: var(--p-surface-800);
}
.anime_title{
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.anime_ass{
  white-space: nowrap;
}
.anime_delete{
  width: 1.75rem;
  height: 1.75rem;
  opacity: .55;
  transition: opacity .15s ease;
}
.anime_item:hover .anime_delete,
.anime_delete:focus-visible{
  opacity: 1;
}
.list_empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 12px;
  border: 1px dashed var(--p-surface-200);
  border-radius: 10px;
  color: var(--p-text-muted-color);
  font-size: 13px;
}
.list_empty i{
  font-size: 18px;
  color: var(--p-primary-color);
}
.exclude_tags{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0;
}
.exclude_tag{
  display: inline-flex;
  align-items: center;
  padding-right: 4px;
  border-radius: var(--p-tag-border-radius);
  background: var(--p-tag-secondary-background);
  color: var(--p-tag-secondary-color);
}
.exclude_tag :deep(.p-tag){
  background: transparent;
  color: inherit;
  border-radius: var(--p-tag-border-radius) 0 0 var(--p-tag-border-radius);
}
.exclude_tag .p-button{
  width: 1.5rem;
  height: 1.5rem;
}
</style>
