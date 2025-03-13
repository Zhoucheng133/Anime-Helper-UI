<template>
  <div class="page">
    <DataTable :value="all().list">
      <Column field="title" header="标题">
        <template #body="slotProps">
          <div class="title">
            {{ slotProps.data.title }}
          </div>
        </template>
      </Column>
      <Column header="操作" style="min-width: 150px;">
        <template #body="slotProps">
          <ButtonGroup>
            <Button severity="secondary" label="添加至" size="small" style="font-size: 12px;" />
            <Button severity="secondary" size="small" ><i class="pi pi-download" style="font-size: 12px;"></i></Button>
          </ButtonGroup>
        </template>
      </Column>
    </DataTable>
  </div>
  <Loading ref="loadingRef" />
</template>

<script lang="ts" setup >
import { DataTable, Column, Button, ButtonGroup } from 'primevue';
import all from '../store/all';
import { onMounted, ref } from 'vue';
import Loading from '../components/loading.vue';
const loadingRef=ref();

document.title="AnimeHelper | 所有";

onMounted(async ()=>{
  loadingRef.value.loadingHandler(true, "获取所有列表");
  await all().getList();
  loadingRef.value.loadingHandler(false, "获取所有列表");
})

</script>

<style scoped>
.title{
  width: 800px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>