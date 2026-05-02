<template>
  <div class="page">
    <div class="tool_bar">
      <Button label="添加" size="small" @click="toggleMenu" />
      <Menu ref="addmenuRef" id="overlay_menu" :model="addMenu" :popup="true" />
      <Select size="small" v-model="list.selectedFilter" :options="list.filters" scroll-height="20rem" optionLabel="name" @change="list.getList()" />
      <InputText size="small" style="width: 100%" v-if="list.selectedFilter.name=='搜索'" v-model="list.searchKeyWord" @change="list.getList()" @keyup.enter="searchHandler" />
      <div v-if="list.selectedFilter.name=='更新周'">
        <Select size="small" v-model="list.selectedWeekday" :options="list.weekdays" scroll-height="20rem" style="width: 120px;" optionLabel="name" @change="list.getList()"/>
      </div>
      <div v-else></div>
    </div>
    <div class="card" v-if="list.list.length!=0 && loading==false">
      <DataTable :value="list.list" stripedRows tableStyle="table-layout: fixed; width: 100%" v-model:expandedRows="expandedRows" dataKey="id">
        <Column expander style="width: 25px" v-if="mobile" />
        <Column field="title" header="标题" style="overflow: hidden;">
          <template #body="slotProps">
            <div class="item_title" :style="{width: mobile ? '100%' : 'fit-content'}" @click="mobile ? toggleExpansion(slotProps.data) : showInfo(slotProps.data, $event)" v-tooltip.top="{ value: slotProps.data.title, showDelay: 500, }">
              {{ slotProps.data.title }}
            </div>
          </template>
        </Column>
        <Column header="状态" style="width: 90px;" v-if="!mobile">
          <template #body="slotProps">
            <div class="update_tag tag" v-if="list.onUpudate(slotProps.data)">更新中</div>
            <div class="done_tag tag" v-else>已完结</div>
          </template>
        </Column>
        <Column header="集数" style="width: 60px;" v-if="!mobile">
          <template #body="slotProps">
            <div class="ep">
              {{ slotProps.data.episode }}
            </div>
          </template>
        </Column>
        <Column header="更新周" style="width: 90px;" v-if="!mobile">
          <template #body="slotProps">
            <div class="weekday_tag weekday_tag_now" v-if="list.getWeekday(slotProps.data.time) === list.getWeekday(Date.now())" >{{ list.getWeekday(slotProps.data.time) }}</div>
            <div class="weekday_tag" v-else>{{ list.getWeekday(slotProps.data.time) }}</div>
          </template>
        </Column>
        <Column header="进度" style="width: 200px;" v-if="!mobile">
          <template #body="slotProps">
            <div class="progress_area">
              <ProgressBar :class="percent(slotProps)==100 ? 'finished':'progress'" :value="list.calProgress(slotProps.data)" style="height: 18px" :showValue="false"/>
                <div class="progress_label">
                  <div>{{ slotProps.data.now }} / {{ list.analyseEpisode(slotProps.data) }}</div>
                </div>
                <div class="progress_label white_label" :style="{
                  'clip-path': `polygon(0 0, ${percent(slotProps)}% 0, ${percent(slotProps)}% 100%, 0% 100%)`
                }">
                  <div>{{ slotProps.data.now }} / {{ list.analyseEpisode(slotProps.data) }}</div>
                </div>
            </div>
          </template>
        </Column>
        <Column header="操作" style="width: 210px;" v-if="!mobile">
          <template #body="slotProps">
            <ButtonGroup>
              <Button severity="secondary" size="small" @click="editRef.showEditHandler(slotProps.data)"><i class="pi pi-pen-to-square" style="font-size: 12px;" /></Button>
              <Button severity="secondary" size="small" @click="list.minus(slotProps.data)" :disabled="slotProps.data.now<=0" ><i class="pi pi-minus" style="font-size: 12px;" /></Button>
              <Button severity="secondary" size="small" @click="list.add(slotProps.data)" :disabled="slotProps.data.now>=list.analyseEpisode(slotProps.data)"><i class="pi pi-plus" style="font-size: 12px;"/></Button>
              <Button severity="secondary" size="small" style="font-size: 12px;" @click="downloaderRef.showAddHandler(slotProps.data.title)">添加到</Button>
              <Button severity="secondary" size="small" @click="list.deleteItem($event, slotProps.data)"><i class="pi pi-trash" style="font-size: 12px;"/></Button>
            </ButtonGroup>
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="p-4">
            <div class="expanded_detail">
              <div class="title">标题</div>
              <div>{{ slotProps.data.title }}</div>
              <div class="title">状态</div>
              <div>
                <div class="update_tag tag" v-if="list.onUpudate(slotProps.data)">更新中</div>
                <div class="done_tag tag" v-else>已完结</div>
              </div>
              <div class="title">集数</div>
              <div>{{ slotProps.data.episode }}</div>
              <div class="title">更新周</div>
              <div>
                <div class="weekday_tag weekday_tag_now" v-if="list.getWeekday(slotProps.data.time) === list.getWeekday(Date.now())" >{{ list.getWeekday(slotProps.data.time) }}</div>
                <div class="weekday_tag" v-else>{{ list.getWeekday(slotProps.data.time) }}</div>
              </div>
              <div class="title">进度</div>
              <div>
                <div class="progress_area">
                  <ProgressBar :class="percent(slotProps)==100 ? 'finished':'progress'" :value="list.calProgress(slotProps.data)" style="height: 18px" :showValue="false"/>
                    <div class="progress_label">
                      <div>{{ slotProps.data.now }} / {{ list.analyseEpisode(slotProps.data) }}</div>
                    </div>
                    <div class="progress_label white_label" :style="{
                      'clip-path': `polygon(0 0, ${percent(slotProps)}% 0, ${percent(slotProps)}% 100%, 0% 100%)`
                    }">
                      <div>{{ slotProps.data.now }} / {{ list.analyseEpisode(slotProps.data) }}</div>
                    </div>
                </div>
              </div>
              <div class="title">操作</div>
              <div>
                <ButtonGroup>
                  <Button severity="secondary" size="small" @click="editRef.showEditHandler(slotProps.data)"><i class="pi pi-pen-to-square" style="font-size: 12px;" /></Button>
                  <Button severity="secondary" size="small" @click="list.minus(slotProps.data)" :disabled="slotProps.data.now<=0" ><i class="pi pi-minus" style="font-size: 12px;" /></Button>
                  <Button severity="secondary" size="small" @click="list.add(slotProps.data)" :disabled="slotProps.data.now>=list.analyseEpisode(slotProps.data)"><i class="pi pi-plus" style="font-size: 12px;"/></Button>
                  <Button severity="secondary" size="small" style="font-size: 12px;" @click="downloaderRef.showAddHandler(slotProps.data.title)">添加到</Button>
                  <Button severity="secondary" size="small" @click="list.deleteItem($event, slotProps.data)"><i class="pi pi-trash" style="font-size: 12px;"/></Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
      <Paginator :rows="20" :totalRecords="list.length" @update:first="paginatorChange" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="第 {currentPage} 页 | 共 {totalPages} 页" />
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
import { Button, Menu, Select, InputText, DataTable, Column, Paginator, ProgressBar, ButtonGroup, Tag, useConfirm } from 'primevue';
import listStore, { type ListItem } from '../store/list';
import Add from '../components/list/add.vue';
import Edit from "../components/list/edit.vue";
import AddDownloader from '../components/list/add_downloader.vue';
import BgmSearch from '../components/list/bgm_search.vue';
import { onMounted, ref } from 'vue';
import Info from '../components/list/info.vue';
import Bind from '../components/list/bind.vue';
import Store from '../store';
import { storeToRefs } from 'pinia';

document.title="AnimeHelper | 列表";

const loading=ref(true);
const confirm = useConfirm();
const list=listStore();
const addmenuRef=ref();
const bgmSearchRef=ref();
const infoRef=ref();
const bindRef=ref();
const store=Store();
const mobile=storeToRefs(store).mobile;
const expandedRows = ref<Record<string, boolean>>({});

function toggleExpansion(data: ListItem){
  const id = data.id;
  if (expandedRows.value[id]) {
    const { [id]: _, ...rest } = expandedRows.value;
    expandedRows.value = rest;
  } else {
    expandedRows.value = { ...expandedRows.value, [id]: true };
  }
}

function searchHandler(){
  document.activeElement instanceof HTMLElement &&
  document.activeElement.blur();
}

function showInfo(data: ListItem, event: any, ){
  if(data.bgmId.length!=0){
    infoRef.value.showInfoHanlder(data.bgmId, false, data.id);
    return;
  }

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

const toggleMenu=(event: any)=>{
  addmenuRef.value.toggle(event);
}

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

const percent=(slotProps: any)=>{
  return list.calProgress(slotProps.data);
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

<style>
.finished > .p-progressbar-value{
  background-color: hsl(145.96000000000004 79.46% 43.92% / 1);
}
</style>

<style scoped>
.expanded_detail{
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  row-gap: 15px;
  column-gap: 20px;
}
.ep{
  padding-left: 6px;
}
.white_label{
  color: white;
  transition: all .4s ease-in-out;
}
.progress_area{
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  position: relative;
}
.progress_label{
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  user-select: none;
}
.done_tag{
  color: #475569;
  background-color: #f1f5f9;
}
.update_tag{
  color: #15803d;
  background-color: #dcfce7;
}
.tag{
  font-size: 12px;
  user-select: none;
  border-radius: 14px;
  width: 54px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.weekday_tag{
  border: 2px solid lightgrey;
  border-radius: 14px;
  width: 54px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-sizing: border-box;
}
.weekday_tag_now{
  background-color: var(--p-button-primary-background);
  border: 2px solid var(--p-button-primary-background);
  color: white;
}
.item_title{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.tool_bar{
  margin-top: 10px;
  height: 35px;
  display: grid;
  grid-template-columns: 60px 120px auto;
  gap: 10px;
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