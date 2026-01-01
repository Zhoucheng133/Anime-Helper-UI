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
    <div class="table" v-if="list().list.length!=0 && loading==false">
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
        <Column header="集数" style="min-width: 60px;">
          <template #body="slotProps">
            <div class="ep">
              {{ slotProps.data.episode }}
            </div>
          </template>
        </Column>
        <Column header="更新周" style="min-width: 90px;">
          <template #body="slotProps">
            <div class="weekday_tag tag">{{ list().getWeekday(slotProps.data.time) }}</div>
          </template>
        </Column>
        <Column header="进度" style="min-width: 200px;">
          <template #body="slotProps">
            <div class="progress_area">
              <ProgressBar :class="percent(slotProps)==100 ? 'finished':'progress'" :value="list().calProgress(slotProps.data)" style="height: 18px" :showValue="false"/>
                <div class="progress_label">
                  <div>{{ slotProps.data.now }} / {{ list().analyseEpisode(slotProps.data) }}</div>
                </div>
                <div class="progress_label white_label" :style="{
                  'clip-path': `polygon(0 0, ${percent(slotProps)}% 0, ${percent(slotProps)}% 100%, 0% 100%)`
                }">
                  <div>{{ slotProps.data.now }} / {{ list().analyseEpisode(slotProps.data) }}</div>
                </div>
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
    </div>
    <div v-else-if="list().list.length==0 && loading==false" class="empty">
      <div class="empty_list">
        <i class="pi pi-ban" style="margin-right: 5px;" />
        <div>列表为空</div>
      </div>
      <div class="add_tip">
        <div>在此页面点击</div>
        <Tag>添加</Tag>
        <div>或者在</div>
        <Tag>每日放送</Tag>
        <div>页面中添加正在连载的动画</div>
      </div>
    </div>
    <Add ref="addRef" />
    <Edit ref="editRef"/>
    <AddDownloader ref="downloaderRef"/>
  </div>
</template>

<script lang="ts" setup>
import { Button, Select, InputText, DataTable, Column, Paginator, ProgressBar, ButtonGroup, Tag } from 'primevue';
import list from '../store/list';
import Add from '../components/list/add.vue';
import Edit from "../components/list/edit.vue";
import AddDownloader from '../components/list/add_downloader.vue';
import { onMounted, ref } from 'vue';

document.title="AnimeHelper | 列表";

const loading=ref(true);

const percent=(slotProps: any)=>{
  return list().calProgress(slotProps.data);
}

onMounted(async ()=>{
  await list().getList();
  loading.value=false;
})

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
  border-radius: 13px;
  width: 52px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
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
}
</style>