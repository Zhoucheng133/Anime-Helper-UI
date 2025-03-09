<template>
  <div class="page">
    <div class="tool_bar">
      <Button label="添加" />
      <Select v-model="list().selectedFilter" :options="list().filters" scroll-height="20rem" optionLabel="name" />
      <InputText style="width: 100%;" v-if="list().selectedFilter.name=='搜索'" />
      <div v-if="list().selectedFilter.name=='更新周'">
        <Select v-model="list().selectedWeekday" :options="list().weekdays" scroll-height="20rem" style="width: 120px;" />
      </div>
      <div v-else></div>
    </div>
    <DataTable :value="list().list">
      <Column field="title" header="标题" style="min-width: 270px;">
        <template #body="slotProps">
          <label style="font-size: 15px;">{{ slotProps.data.title }}</label>
        </template>
      </Column>
      <Column header="状态" style="min-width: 80px;"></Column>
      <Column header="更新周" style="min-width: 80px;"></Column>
      <Column header="进度" style="min-width: 200px;"></Column>
      <Column header="操作" style="min-width: 200px;"></Column>
    </DataTable>
    <div style="height: 50px;"></div>    
  </div>
</template>

<script lang="ts" setup>
import { Button, Select, InputText, DataTable, Column } from 'primevue';
import list from '../store/list';

document.title="AnimeHelper | 列表";

list().getList();

</script>

<style scoped>
.tool_bar{
  margin-top: 10px;
  display: grid;
  grid-template-columns: 60px 120px auto;
  gap: 10px;
}
.page{
  width: 1000px;
  margin: auto;
  /* background-color: red; */
}

@media screen and (max-width: 1040px) {
  .page{
    width: calc(100% - 40px);
  }
}
</style>