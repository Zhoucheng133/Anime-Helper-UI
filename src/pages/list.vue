<template>
  <div class="page">
    <div class="tool_bar">
      <Button label="添加" size="small" @click="addRef.showAddHandler()" />
      <Select size="small" v-model="list().selectedFilter" :options="list().filters" scroll-height="20rem" optionLabel="name" @change="list().getList()" />
      <InputText size="small" style="width: 100%" v-if="list().selectedFilter.name=='搜索'" v-model="list().searchKeyWord" @change="list().getList()" />
      <div v-if="list().selectedFilter.name=='更新周'">
        <Select size="small" v-model="list().selectedWeekday" :options="list().weekdays" scroll-height="20rem" style="width: 120px;" optionLabel="name" @change="list().getList()"/>
      </div>
      <div v-else></div>
    </div>
    <DataTable :value="list().list">
      <Column field="title" header="标题" style="min-width: 270px;">
        <template #body="slotProps">
          <div class="item_title">{{ slotProps.data.title }}</div>
        </template>
      </Column>
      <Column header="状态" style="min-width: 90px;">
        <template #body="slotProps">
           <div class="update_tag tag" v-if="list().onUpudate(slotProps.data)">更新中</div>
           <div class="done_tag tag" v-else>已完结</div>
        </template>
      </Column>
      <Column header="更新周" style="min-width: 90px;">
        <template #body="slotProps">
          <div class="weekday_tag tag">{{ list().getWeekday(slotProps.data.time) }}</div>
        </template>
        
      </Column>
      <Column header="进度" style="min-width: 230px;">
        <template #body="slotProps">
          <div class="progress_area">
            <ProgressBar :class="list().calProgress(slotProps.data)==100 ? 'finished':''" :value="list().calProgress(slotProps.data)" style="height: 5px" :show-value="false" />
            <div class="progress_label">{{ slotProps.data.now }} / {{ list().analyseEpisode(slotProps.data) }}</div>
          </div>
        </template>
      </Column>
      <Column header="操作" style="min-width: 230px;">
        <template #body="slotProps">
          <ButtonGroup>
            <Button severity="secondary" size="small" @click="editRef.showEditHandler(slotProps.data)"><i class="pi pi-pen-to-square" style="font-size: 12px;" /></Button>
            <Button severity="secondary" size="small" @click="list().minus(slotProps.data)"><i class="pi pi-minus" style="font-size: 12px;"  /></Button>
            <Button severity="secondary" size="small" @click="list().add(slotProps.data)"><i class="pi pi-plus" style="font-size: 12px;"/></Button>
            <Button severity="secondary" size="small" style="font-size: 12px;" @click="downloaderRef.showAddHandler(slotProps.data.title)">添加到</Button>
            <Button severity="secondary" size="small" @click="list().deleteItem($event, slotProps.data)"><i class="pi pi-trash" style="font-size: 12px;"/></Button>
          </ButtonGroup>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows="20" :totalRecords="list().length" @update:first="paginatorChange" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="第 {currentPage} 页 | 共 {totalPages} 页" />
    <Add ref="addRef" />
    <Edit ref="editRef"/>
    <AddDownloader ref="downloaderRef"/>
  </div>
</template>

<script lang="ts" setup>
import { Button, Select, InputText, DataTable, Column, Paginator, ProgressBar, ButtonGroup } from 'primevue';
import list from '../store/list';
import Add from '../components/list/add.vue';
import Edit from "../components/list/edit.vue";
import AddDownloader from '../components/list/add_downloader.vue';
import { ref } from 'vue';

document.title="AnimeHelper | 列表";

list().getList();

const addRef=ref();
const editRef=ref();
const downloaderRef=ref();

function paginatorChange(val: number){
  list().offset=val;
  list().getList();
}
</script>

<style>
.finished > .p-progressbar-value{
  background-color: hsl(145.96000000000004 79.46% 43.92% / 1);
}
</style>

<style scoped>
.progress_area{
  display: grid;
  grid-template-columns: auto 90px;
  align-items: center;
}
.progress_label{
  font-size: 14px;
  user-select: none;
  margin-left: 10px;
  text-align: right;
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
  border-radius: 13px;
  width: 52px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-weight: bold; */
}
.weekday_tag{
  border: 2px solid lightgrey;
  border-radius: 13px;
  width: 52px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item_title{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tool_bar{
  margin-top: 10px;
  height: 35px;
  display: grid;
  grid-template-columns: 60px 120px auto;
  gap: 10px;
}
</style>