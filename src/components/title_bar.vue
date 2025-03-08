<template>
  <div class="header">
    <div class="head_img">
      <img src="/icon.svg" alt="" width="40px">
      <div class="head_label">AnimeHelper</div>
    </div>

    <div class="menus" v-if="store().token.length!=0">
      <Button label="列表" variant="text" severity="secondary" @click="toRoute('/list')" :disabled="route.path=='/list'" icon="pi pi-list"/>
      <Button label="每日放送" variant="text"severity="secondary" @click="toRoute('/calendar')" :disabled="route.path=='/calendar'" icon="pi pi-calendar"/>
      <Button label="所有" variant="text" severity="secondary" @click="toRoute('/all')" :disabled="route.path=='/all'" icon="pi pi-server"/>
      <Button label="下载器" variant="text" severity="secondary" @click="toRoute('/downloader')" :disabled="route.path=='/downloader'" icon="pi pi-download"/>
    </div>
    <div class="signout_area">
      <Button icon="pi pi-sign-out" class="signout" variant="text" severity="danger" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import store from '../store';
import { Button } from 'primevue';
import { useRoute, useRouter } from 'vue-router';

const route=useRoute();
const router=useRouter();

const toRoute=(path: string)=>{
  router.push(path);
}

</script>

<style scoped>
.p-button:disabled{
  color: rgb(180, 180, 180) !important;
}
.menus{
  display: flex;
  align-items: center;
}
.signout_area{
  display: flex;
  width: 180px;
}
.signout{
  margin-right: 20px;
  margin-left: auto;
}
.head_label{
  margin-left: 15px;
  font-size: 18px;
}
.header{
  width: 100vw;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  z-index: 10;
  position: sticky;
  justify-content: space-between;
  user-select: none;
  height: 60px;
}
.head_img{
  margin-left: 30px;
  width: 180px;
  display: flex;
  align-items: center;
}
</style>