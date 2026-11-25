<template>
  <div class="page">
    <div class="filter_bar">
      <div class="filter_tags">
        <Button rounded v-for="filter in list.filters" :key="filter.code" class="filter_tag" size="small" :label="filter.name"
          :severity="list.selectedFilter.code==filter.code ? 'primary' : 'secondary'" :outlined="list.selectedFilter.code!=filter.code"
          @click="selectFilter(filter)" />
      </div>
      <div class="action_group" :class="{ 'action_group_mobile': mobile }">
        <div class="action_scroll_area">
          <div class="expand_control" :class="{ 'is-expanded': searchExpanded }">
            <Button class="move_icon" rounded variant="text" icon="pi pi-search" v-tooltip.top="'搜索'" @click="toggleSearch" />
            <div class="expand_field search_field" :aria-hidden="!searchExpanded">
              <InputText ref="searchInputRef" size="small" v-model="list.keyword" :tabindex="searchExpanded ? 0 : -1" @keyup.enter="searchHandler" placeholder="关键字搜索..." />
            </div>
          </div>
          <div class="expand_control" :class="{ 'is-expanded': weekdayExpanded }">
            <Button class="move_icon" rounded variant="text" icon="pi pi-calendar" v-tooltip.top="'更新周'" @click="toggleWeekday" />
            <div class="expand_field weekday_field" :aria-hidden="!weekdayExpanded">
              <Select class="weekday_selector" size="small" v-model="list.selectedWeekday" :tabindex="weekdayExpanded ? 0 : -1" :options="weekdayOptions" optionLabel="name" optionValue="code" @change="filterChanged" scroll-height="20rem" />
            </div>
          </div>
          <Button class="action_button" rounded variant="text" icon="pi pi-sort-alt" v-tooltip.top="'排序方式'" @click="toggleSort" />
          <Menu ref="sortmenuRef" id="sort_menu" :model="sortMenu" :popup="true" />
          <Button class="action_button" rounded variant="text" icon="pi pi-refresh" v-tooltip.top="'刷新'" @click="refreshList" />
        </div>
        <div class="add_action">
          <Button size="small" label="添加" icon="pi pi-plus" @click="toggleMenu" />
          <Menu ref="addmenuRef" id="overlay_menu" :model="addMenu" :popup="true" />
        </div>
      </div>
    </div>
    <div v-auto-animate class="list_card" :class="{ 'list_card_desktop': !mobile }" v-if="list.list.length!=0 && loading==false">
      <template v-if="mobile">
        <div v-for="item in list.list" :key="item.id" class="list_item">
          <div class="item_header">
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
              <Button class="bgm_button" :class="{ 'bgm_button_unbound': item.bgmId.length==0 }" :severity="item.bgmId.length==0 ? 'secondary' : 'primary'" variant="text"
                v-tooltip.top="item.bgmId.length==0 ? '绑定Bangumi' : '查看Bangumi条目'" @click="openBgm(item, $event)"
                :icon="item.bgmId.length==0 ? 'pi pi-link' : 'pi pi-external-link'" size="small" style="font-size: 12px;"></Button>
              <Button severity="danger" variant="text" v-tooltip.top="'删除'" @click="list.deleteItem($event, item)" icon="pi pi-trash" size="small" style="font-size: 12px;"></Button>
            </ButtonGroup>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="item in list.list" :key="item.id" class="desktop_list_item">
          <div class="desktop_item_info">
            <div class="desktop_item_title" @click="showInfo(item, $event)" v-tooltip.top="{ value: item.title, showDelay: 500 }">
              {{ item.title }}
            </div>
            <div class="desktop_item_meta">
              <div class="status_tag" :class="list.onUpudate(item) ? 'updating' : 'done'">
                {{ statusText(item) }}
              </div>
              <div class="episode_text">共{{ item.episode }}集</div>
              <div class="episode_text">观看进度 {{ item.now }} / {{ list.analyseEpisode(item) }}</div>
            </div>
          </div>
          <div class="desktop_item_controls">
            <div class="desktop_counter">
              <Button class="desktop_counter_button" severity="secondary" variant="text" v-tooltip.top="'减少一集'" @click="list.minus(item)" :disabled="item.now<=0" icon="pi pi-minus" />
              <div class="desktop_episode_count">{{ item.now }}</div>
              <Button class="desktop_counter_button" severity="secondary" variant="text" v-tooltip.top="'增加一集'" @click="list.add(item)" :disabled="item.now>=list.analyseEpisode(item)" icon="pi pi-plus" />
            </div>
            <div class="desktop_item_actions">
              <Button severity="secondary" variant="text" v-tooltip.top="'编辑'" @click="editRef.showEditHandler(item)" icon="pi pi-pen-to-square" />
              <Button severity="secondary" variant="text" v-tooltip.top="'添加到下载列表'" @click="downloaderRef.showAddHandler(item.title)" icon="pi pi-download" />
              <Button severity="danger" variant="text" v-tooltip.top="'删除'" @click="list.deleteItem($event, item)" icon="pi pi-trash" />
              <Button class="bgm_button" :class="{ 'bgm_button_unbound': item.bgmId.length==0 }" :severity="item.bgmId.length==0 ? 'secondary' : 'primary'" variant="text"
                v-tooltip.top="item.bgmId.length==0 ? '绑定Bangumi' : '查看Bangumi条目'" @click="openBgm(item, $event)"
                :icon="item.bgmId.length==0 ? 'pi pi-link' : 'pi pi-external-link'" />
            </div>
            <ProgressBar class="desktop_progress" :class="percent(item)==100 ? 'finished':'progress'" :value="percent(item)" :showValue="false" />
          </div>
        </div>
      </template>
      <Paginator v-if="mobile" :rows="20" :totalRecords="list.length" @update:first="paginatorChange" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" :first="list.offset"
        currentPageReportTemplate="第 {currentPage} 页 | 共 {totalPages} 页" />
      <Paginator v-else :rows="20" :totalRecords="list.length" @update:first="paginatorChange" :first="list.offset" ></Paginator>
    </div>
    <div v-else-if="list.list.length==0 && loading==false" class="empty">
      <div class="empty_container">
        <i class="pi pi-list" />
        <div>没有添加番剧或者没有筛选的结果</div>
        <div class="flex items-center">
          <div>你可点击</div>
          <Tag size="small" class="ml-1 mr-1">添加</Tag>
          <div>手动添加或者从Bangumi中添加</div>
        </div>
        <div>或者通过顶部工具栏修改筛选条件</div>
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
import { vAutoAnimate } from '@formkit/auto-animate/vue';
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
const searchExpanded=ref(false);
const weekdayExpanded=ref(false);
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
const weekdayOptions=computed(()=>[{ name: '无更新周', code: -1 }, ...list.weekdays]);

const filterChanged=async ()=>{
  list.offset=0;
  await list.getList();
}

const selectFilter=async (filter: { name: string, code: string })=>{
  list.selectedFilter=filter;
  await filterChanged();
}

function toggleSearch(){
  searchExpanded.value=!searchExpanded.value;
  if(!searchExpanded.value){
    list.keyword="";
  }
}

function toggleWeekday(){
  weekdayExpanded.value=!weekdayExpanded.value;
  if(weekdayExpanded.value){
    list.selectedWeekday=new Date().getDay();
  }else{
    list.selectedWeekday='';
  }
  filterChanged();
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
.expand_control{
  display: flex;
  align-items: center;
}

.expand_field{
  display: flex;
  align-items: center;
  width: 0;
  margin-left: 0;
  overflow: hidden;
  pointer-events: none;
  transition: width 200ms cubic-bezier(0.2, 0.8, 0.2, 1), margin-left 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.search_field :deep(.p-inputtext),
.weekday_field :deep(.p-select){
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 120ms ease, transform 120ms ease;
}

.search_field :deep(.p-inputtext){
  width: 180px;
}

.expand_control.is-expanded .search_field{
  width: 180px;
}

.expand_control.is-expanded .weekday_field{
  width: 120px;
}

.expand_control.is-expanded .expand_field{
  margin-left: 10px;
  pointer-events: auto;
}

.expand_control.is-expanded .expand_field :deep(.p-inputtext),
.expand_control.is-expanded .expand_field :deep(.p-select){
  opacity: 1;
  transform: translateX(0);
  transition-delay: 200ms;
}
.filter_tags>*{
  flex-shrink: 0
}

.weekday_selector{
  width: 120px;
}

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

.list_card_desktop{
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--p-surface-200);
  border-radius: 24px;
  background: var(--p-surface-0);
}

.helper-page-dark .list_card_desktop{
  border-color: var(--p-surface-700);
  background: var(--p-surface-900);
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

.desktop_list_item{
  display: grid;
  grid-template-columns: minmax(0, 1fr) 424px;
  align-items: center;
  gap: 32px;
  min-height: 164px;
  padding: 28px 24px;
}

.desktop_list_item + .desktop_list_item{
  border-top: 1px solid var(--p-surface-200);
}

.helper-page-dark .desktop_list_item + .desktop_list_item{
  border-color: var(--p-surface-700);
}

.desktop_item_info{
  min-width: 0;
}

.desktop_item_title{
  overflow: hidden;
  color: var(--p-text-color);
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.desktop_item_meta{
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
  min-width: 0;
}

.desktop_item_meta .episode_text{
  font-size: 1rem;
}

.desktop_item_controls{
  display: grid;
  grid-template-columns: 208px minmax(0, 1fr);
  grid-template-areas:
    "counter actions"
    "progress .";
  column-gap: 20px;
  row-gap: 8px;
  width: 424px;
}

.desktop_counter{
  grid-area: counter;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.desktop_counter :deep(.p-button),
.desktop_item_actions :deep(.p-button){
  width: 40px;
  height: 40px;
  padding: 0;
}

.desktop_episode_count{
  min-width: 48px;
  color: var(--p-text-color);
  font-size: 1.85rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  user-select: none;
}

.desktop_item_actions{
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.desktop_item_actions :deep(.pi-external-link){
  font-size: 16px;
}

.desktop_progress{
  grid-area: progress;
  align-self: start;
  margin-top: 2px;
}

.filter_bar{
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter_tags{
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.action_group{
  display: flex;
  align-items: center;
  gap: 12px;
}

.action_scroll_area,
.add_action{
  display: flex;
  align-items: center;
  gap: 12px;
}

.add_action{
  flex: 0 0 auto;
}

.action_group_mobile{
  flex: 0 0 100%;
  max-width: 100%;
  overflow: hidden;
}

.action_group_mobile .action_scroll_area{
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.filter_tags::-webkit-scrollbar,
.action_group_mobile .action_scroll_area::-webkit-scrollbar{
  display: none;
}

.action_group_mobile .action_scroll_area>*{
  flex: 0 0 auto;
}

@media screen and (max-width: 900px) {
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
.empty_container{
  padding: 32px 12px;
  border: 1px dashed var(--p-surface-200);
  border-radius: 10px;
  color: var(--p-text-muted-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.empty_container i{
  font-size: 20px;
  flex-wrap: wrap;
  color: var(--p-primary-color);
}
.add_tip{
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
