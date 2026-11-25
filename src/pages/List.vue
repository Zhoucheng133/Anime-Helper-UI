<template>
  <div class="page">
    <div class="tool_bar">
      <div class="tool_bar_left">
        <Button v-if="mobile" size="small" @click="toggleMenu" icon="pi pi-plus" style="width: 35px;" />
        <Button v-else label="添加" size="small" @click="toggleMenu" style="width: 60px;" />
        <Menu ref="addmenuRef" id="overlay_menu" :model="addMenu" :popup="true" />

        <Select size="small" v-model="list.selectedFilter" :options="list.filters" scroll-height="20rem" optionLabel="name" @change="filterChanged" style="width: 120px;" />
        <Select size="small" v-if="list.selectedFilter.name=='更新周'" v-model="list.selectedWeekday" :options="list.weekdays" scroll-height="20rem" style="width: 120px;" optionLabel="name" @change="filterChanged"/>
      </div>

      <div class="tool_bar_right" :class="{ 'search_active': list.selectedFilter.name=='Search' || list.selectedFilter.code=='search' }">
        <InputText size="small" style="width: 100%;" v-if="list.selectedFilter.name=='搜索'" v-model="list.searchKeyWord" @change="list.getList()" @keyup.enter="searchHandler" ref="searchInputRef" placeholder="输入关键字搜索..." />
        <Button v-if="list.selectedFilter.code!='search'" variant="text" size="small" @click="refreshList" style="width: 35px; height: 35px;" icon="pi pi-refresh" v-tooltip.left="'刷新'" />
        <Button variant="text" size="small" @click="toggleSort" style="width: 35px; height: 35px;" icon="pi pi-sort-alt" v-tooltip.left="'排序方式'" />
        <Menu ref="sortmenuRef" id="sort_menu" :model="sortMenu" :popup="true" />
      </div>
    </div>
    <div class="list_card" v-if="list.list.length!=0 && loading==false">
      <div v-for="item in list.list" :key="item.id" class="list_item" :class="{ 'list_item_desktop': !mobile }">
        <div class="item_header" :class="{ 'item_header_desktop': !mobile }">
          <div class="item_title" @click="showInfo(item, $event)" v-tooltip.top="{ value: item.title, showDelay: 500, }">
            {{ item.title }}
          </div>
          <div class="item_meta">
            <div class="status_tag" :class="list.onUpudate(item) ? 'updating' : 'done'">
              {{ statusText(item) }}
            </div>
            <div class="episode_text">
              共{{ item.episode }}集<template v-if="list.onUpudate(item)"> · 已更新{{ list.analyseEpisode(item) }}集</template>
            </div>
          </div>
        </div>
        <div class="progress_header">
          <div>观看进度</div>
          <div>{{ item.now }} / {{ list.analyseEpisode(item) }}</div>
        </div>
        <div class="progress_area">
          <ProgressBar :class="percent(item)==100 ? 'finished':'progress'" :value="percent(item)" :showValue="false" />
          <div class="counter">
            <Button severity="secondary" size="small" @click="list.minus(item)" :disabled="item.now<=0" icon="pi pi-minus" style="font-size: 12px;"></Button>
            <div class="episode_count">{{ item.now }}集</div>
            <Button severity="secondary" size="small" @click="list.add(item)" :disabled="item.now>=list.analyseEpisode(item)" style="font-size: 12px;" icon="pi pi-plus"></Button>
          </div>
        </div>
        <div class="item_actions">
          <ButtonGroup>
            <Button severity="secondary" variant="text" v-tooltip.top="'编辑'" @click="editRef.showEditHandler(item)" icon="pi pi-pen-to-square" size="small" style="font-size: 12px;"></Button>
            <Button severity="secondary" variant="text" v-tooltip.top="'添加到下载列表'" @click="downloaderRef.showAddHandler(item.title)" icon="pi pi-download" size="small" style="font-size: 12px;"></Button>
            <Button v-if="mobile" class="bgm_button" :class="{ 'bgm_button_unbound': item.bgmId.length==0 }" :severity="item.bgmId.length==0 ? 'secondary' : 'primary'" variant="text"
              v-tooltip.top="item.bgmId.length==0 ? '绑定Bangumi' : '查看Bangumi条目'" @click="openBgm(item, $event)"
              :icon="item.bgmId.length==0 ? 'pi pi-link' : 'pi pi-external-link'" size="small" style="font-size: 12px;"></Button>
            <Button severity="danger" variant="text" v-tooltip.top="'删除'" @click="list.deleteItem($event, item)" icon="pi pi-trash" size="small" style="font-size: 12px;"></Button>
          </ButtonGroup>
          <Button v-if="!mobile" class="bgm_button" :class="{ 'bgm_button_unbound': item.bgmId.length==0 }" :severity="item.bgmId.length==0 ? 'secondary' : 'primary'" variant="text"
            v-tooltip.top="item.bgmId.length==0 ? '绑定Bangumi' : '查看Bangumi条目'" @click="openBgm(item, $event)"
            :icon="item.bgmId.length==0 ? 'pi pi-link' : 'pi pi-external-link'" size="small"></Button>
        </div>
      </div>
      <Paginator v-if="mobile" :rows="20" :totalRecords="list.length" @update:first="paginatorChange" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" :first="list.offset"
        currentPageReportTemplate="第 {currentPage} 页 | 共 {totalPages} 页" />
      <Paginator v-else :rows="20" :totalRecords="list.length" @update:first="paginatorChange" :first="list.offset" ></Paginator>
    </div>
    <div v-else-if="list.list.length==0 && loading==false" class="empty">
      <div class="empty_list">
        <i class="pi pi-ban" style="margin-right: 5px;" />
        <div>列表为空</div>
      </div>
      <div class="add_tip">
        <div>在此页面点击</div>
        <Tag>添加</Tag>
        <div>或者在</div>
        <Tag>每日放送</Tag>
        <div>页面中点击正在连载的动画</div>
      </div>
      <div class="add_tip">
        <div>你也可以在</div>
        <Tag>添加</Tag>
        <div>旁的下拉菜单中修改筛选方式</div>
      </div>
    </div>
    <Add ref="addRef" />
    <Edit ref="editRef"/>
    <AddDownloader ref="downloaderRef"/>
    <BgmSearch ref="bgmSearchRef"/>
    <Info ref="infoRef" />
    <Bind ref="bindRef" />
  </div>
</template>

<script lang="ts" setup>
import { Button, Menu, Select, InputText, Paginator, ProgressBar, ButtonGroup, Tag, useConfirm, useToast } from 'primevue';
import listStore, { type ListItem } from '../store/list';
import Add from '../components/list/Add.vue';
import Edit from "../components/list/Edit.vue";
import AddDownloader from '../components/list/AddDownloader.vue';
import BgmSearch from '../components/list/BgmSearch.vue';
import { computed, onMounted, ref } from 'vue';
import Info from '../components/list/Info.vue';
import Bind from '../components/list/Bind.vue';
import Store from '../store';
import { storeToRefs } from 'pinia';

document.title="AnimeHelper | 列表";

const loading=ref(true);
const searchInputRef=ref();
const confirm = useConfirm();
const toast = useToast();
const list=listStore();
const addmenuRef=ref();
const bgmSearchRef=ref();
const infoRef=ref();
const bindRef=ref();
const sortmenuRef=ref();
const store=Store();
const mobile=storeToRefs(store).mobile;
const sort=storeToRefs(list).sort;

const filterChanged=async ()=>{
  list.offset=0;
  await list.getList();
  if(list.selectedFilter.code=='search'){
    const inputEl = searchInputRef.value?.$el ?? searchInputRef.value;
    inputEl.focus();
  }
}

function searchHandler(){
  document.activeElement instanceof HTMLElement &&
  document.activeElement.blur();
}

function requireBind(data: ListItem, event: any){
  confirm.require({
    target: event.currentTarget,
    message: '没有绑定Bangumi信息, 是否要绑定?',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true,
      size: "small"
    },
    acceptProps: {
      size: "small",
      label: '绑定',
    },
    accept: ()=>{
      bindRef.value.bindHandler(data.title, data.id)
    },
  });
}

function showInfo(data: ListItem, event: any, ){
  if(data.bgmId.length!=0){
    infoRef.value.showInfoHanlder(data.bgmId, false, data.id);
    return;
  }
  requireBind(data, event);
}

function openBgm(data: ListItem, event: any){
  if(data.bgmId.length!=0){
    window.open(`https://bgm.tv/subject/${data.bgmId}`, '_blank', 'noopener,noreferrer');
    return;
  }
  requireBind(data, event);
}

function toggleSort(event: any){
  sortmenuRef.value.toggle(event);
}

const refreshList = async () => {
  await list.getList();
  toast.add({ severity: 'success', summary: '刷新成功', detail: '列表已刷新', life: 3000 });
}

const toggleMenu=(event: any)=>{
  addmenuRef.value.toggle(event);
}

const sortMenu=computed(()=>{
  return [{
    label: '排序方式',
    items: [
      {
        label: '标题A-Z',
        icon: sort.value == "az" ? 'pi pi-check' : "",
        command: ()=>{
          sort.value="az";
          filterChanged();
        }
      },
      {
        label: '标题Z-A',
        icon: sort.value == "za" ? 'pi pi-check' : "",
        command: ()=>{
          sort.value="za";
          filterChanged();
        }
      },
      {
        label: '新添加在前',
        icon: sort.value == "add_new_old" ? 'pi pi-check' : "",
        command: ()=>{
          sort.value="add_new_old";
          filterChanged();
        }
      },
      {
        label: '新添加在后',
        icon: sort.value == "add_old_new" ? 'pi pi-check' : "",
        command: ()=>{
          sort.value="add_old_new";
          filterChanged();
        }
      },
      {
        label: '已完结在前',
        icon: sort.value == "update_end" ? 'pi pi-check' : "",
        command: ()=>{
          sort.value="update_end";
          filterChanged();
        }
      },
      {
        label: '已完结在后',
        icon: sort.value == "update_first" ? 'pi pi-check' : "",
        command: ()=>{
          sort.value="update_first";
          filterChanged();
        }
      },
    ]
  }];
})

const addMenu=ref([
  {
    label: '添加',
    items: [
      {
        label: '手动添加',
        icon: 'pi pi-plus',
        command: ()=>{
          addRef.value.showAddHandler();
        }
      },
      {
        label: '从Bangumi添加',
        icon: 'pi pi-globe',
        command: ()=>{
          bgmSearchRef.value.showDialogHandler();
        }
      }
    ]
  }
]);

function statusText(item: ListItem): string{
  if(!list.onUpudate(item)){
    return '已完结';
  }
  return `${list.getWeekday(item.time).replace('星期', '周')}更新`;
}

const percent=(item: ListItem)=>{
  return list.calProgress(item);
}

onMounted(async ()=>{
  await list.getList();
  loading.value=false;
})

const addRef=ref();
const editRef=ref();
const downloaderRef=ref();

function paginatorChange(val: number){
  list.offset=val;
  list.getList();
}
</script>

<style scoped>
:deep(.pi-external-link){
  font-size: 12px;
}

:deep(.p-progressbar){
  height: 7px;
}

.list_card{
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list_item{
  padding: 12px 16px;
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  background: var(--p-surface-0);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  grid-template-areas:
    "header header"
    "progress_header progress_header"
    "progress progress"
    "actions counter";
  column-gap: 10px;
}

.list_item_desktop{
  grid-template-areas:
    "header header"
    "progress_header counter"
    "progress counter"
    "actions counter";
  column-gap: 16px;
}

.helper-page-dark .list_item{
  border-color: var(--p-surface-700);
  background: var(--p-surface-900);
}

.item_header{
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.item_header_desktop{
  justify-content: space-between;
}

.item_header_desktop .item_title{
  width: auto;
}

.item_header_desktop .item_meta{
  width: auto;
  gap: 16px;
}

.item_title{
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  font-weight: 500;
}

.item_meta{
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
}

.episode_text{
  font-size: 12px;
  color: var(--p-text-muted-color);
  white-space: nowrap;
}

.status_tag{
  font-size: 12px;
  user-select: none;
  border-radius: 14px;
  padding: 0 10px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.status_tag.updating{
  color: #15803d;
  background-color: #dcfce7;
}

.status_tag.done{
  color: #475569;
  background-color: #f1f5f9;
}

.helper-page-dark .status_tag.updating{
  background-color: #15803d;
  color: #dcfce7;
}

.helper-page-dark .status_tag.done{
  background-color: #475569;
  color: #f1f5f9;
}

.progress_header{
  grid-area: progress_header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 12px;
  color: var(--p-text-muted-color);
}

.progress_area{
  grid-area: progress;
  display: contents;
}

.progress_area :deep(.p-progressbar){
  grid-area: progress;
  min-width: 0;
  margin-top: 6px;
}

.list_item_desktop .counter{
  margin-top: 0;
  align-self: center;
}

.bgm_button_unbound{
  opacity: 0.55;
}

:deep(.finished > .p-progressbar-value){
  background-color: hsl(145.96000000000004 79.46% 43.92% / 1);
}

:deep(.helper-page-dark .finished > .p-progressbar-value){
  background-color: #15803d;
}

:deep(.helper-page-dark .progress > .p-progressbar-value){
  background-color: var(--p-primary-600);
}

.item_actions{
  grid-area: actions;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.counter{
  grid-area: counter;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  width: 160px;
  flex: 0 0 160px;
  margin-top: 12px;
}

.episode_count{
  min-width: 56px;
  text-align: center;
  font-size: 12px;
  user-select: none;
}

.tool_bar{
  margin-top: 10px;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.tool_bar_left{
  display: flex;
  align-items: center;
  gap: 10px;
}
.tool_bar_right{
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}
.tool_bar_right.search_active{
  max-width: none;
}
@media screen and (max-width: 900px) {
  .tool_bar {
    height: auto;
    flex-wrap: wrap;
  }
  .tool_bar_right {
    width: 100%;
    justify-content: flex-start;
  }
  .item_header {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
  .item_actions {
    flex-wrap: wrap;
  }
}
.empty{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  z-index: -10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.empty_list{
  display: flex;
  align-items: center;
}
.add_tip{
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
