<template>
  <div class="header">
    <div class="head_img" @click="showAbout">
      <img src="/icon.svg" alt="" width="40px" draggable="false">
      <div class="head_label">AnimeHelper</div>
    </div>
    <div class="menus" v-if="!(store().token.length==0) && !mobile">
      <Button label="列表" variant="text" severity="secondary" @click="toRoute('/list')" :disabled="route.path=='/list'" icon="pi pi-list"/>
      <Button label="每日放送" variant="text"severity="secondary" @click="toRoute('/calendar')" :disabled="route.path=='/calendar'" icon="pi pi-calendar"/>
      <Button label="最近更新" variant="text" severity="secondary" @click="toRoute('/recent')" :disabled="route.path=='/recent'" icon="pi pi-server"/>
      <Button label="搜索" variant="text" severity="secondary" @click="toRoute('/search')" :disabled="route.path=='/search'" icon="pi pi-search"/>
      <Button label="下载器" variant="text" severity="secondary" @click="toRoute('/downloader')" :disabled="route.path=='/downloader'" icon="pi pi-download"/>
    </div>
    <div class="signout_area">
      <Button icon="pi pi-sign-out" class="signout" variant="text" severity="danger" v-if="!(store().token.length==0) && !mobile" @click="logoutHandler($event)" />
      <Button icon="pi pi-bars" class="signout" variant="text" v-if="!(store().token.length==0) && mobile" @click="menuHandler" />
      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
    </div>
    <About ref="aboutRef" />
  </div>
</template>

<script lang="ts" setup>
import store from '../store';
import { Button, Menu, useConfirm } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import About from './about.vue';

const route=useRoute();
const router=useRouter();

const aboutRef=ref();

const showAbout=()=>{
  aboutRef.value.showAboutHandler();
}

const menuItems=ref([
  {
    label: '菜单',
    items: [
      {
        label: '列表',
        icon: 'pi pi-list',
        command: ()=>toRoute('/list')
      },
      {
        label: '每日放送',
        icon: 'pi pi-calendar',
        command: ()=>toRoute('/calendar')
      },
      {
        label: '最近更新',
        icon: 'pi pi-server',
        command: ()=>toRoute('/recent')
      },
      {
        label: '搜索',
        icon: 'pi pi-search',
        command: ()=>toRoute('/search')
      },
      {
        label: '下载器',
        icon: 'pi pi-download',
        command: ()=>toRoute('/downloader')
      }
    ]
  },
  {
    items: [
      {
        label: '注销',
        icon: 'pi pi-sign-out',
        command: ()=>{
          localStorage.clear();
          window.location.href="/";
        }
      }
    ]
  }
])

const mobile=ref(false);

const toRoute=(path: string)=>{
  router.push(path);
}

const menu = ref();
function menuHandler(event: any){
  menu.value.toggle(event);
}
const confirm = useConfirm();

function logoutHandler(event: any){
  confirm.require({
    target: event.currentTarget,
    message: '你确定要注销吗?',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true,
      size: "small"
    },
    acceptProps: {
      label: '注销',
      size: "small",
      severity: 'danger',
    },
    accept: () => {
      localStorage.clear();
      window.location.href="/";
    },
    reject: () => {}
  });
}

function calWidth(){
  if(window.innerWidth<800){
    mobile.value=true;
  }else{
    mobile.value=false;
  }
}

onMounted(()=>{
  calWidth();
  window.onresize=()=>calWidth();
})

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
  justify-content: space-between;
  user-select: none;
  height: 60px;
  background-color: white;
}
.head_img{
  margin-left: 30px;
  width: 180px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>