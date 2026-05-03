<template>
  <div class="header">
    <div class="head_img" @click="showAbout">
      <img src="/icon.svg" alt="" width="40px" draggable="false">
      <div class="head_label">AnimeHelper</div>
    </div>
    <div class="menus" v-if="!(store.token.length==0) && !mobile">
      <Button label="列表" variant="text" severity="secondary" @click="toRoute('/list')" :disabled="route.path=='/list'" icon="pi pi-list"/>
      <Button label="每日放送" variant="text"severity="secondary" @click="toRoute('/calendar')" :disabled="route.path=='/calendar'" icon="pi pi-calendar"/>
      <Button label="最近更新" variant="text" severity="secondary" @click="toRoute('/recent')" :disabled="route.path=='/recent'" icon="pi pi-server"/>
      <Button label="搜索" variant="text" severity="secondary" @click="toRoute('/search')" :disabled="route.path=='/search'" icon="pi pi-search"/>
      <Button label="下载器" variant="text" severity="secondary" @click="toRoute('/downloader')" :disabled="route.path=='/downloader'" icon="pi pi-download"/>
    </div>
    <div class="signout_area">
      <Button :icon="!darkMode ? 'pi pi-sun' : 'pi pi-moon'" class="darkmode" variant="text" v-if="!(store.token.length==0)"  @click="darkModeHandler"/>
      <Button icon="pi pi-user" class="signout" variant="text" v-if="!(store.token.length==0) && !mobile" @click="userHandler" />
      <Button icon="pi pi-bars" class="signout" variant="text" v-if="!(store.token.length==0) && mobile" @click="menuHandler" />
      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
      <Menu ref="desktopMenu" :model="desktopMenuItems" :popup="true"></Menu>
      <Menu ref="darkModeMenu" :model="darkModeMenuItems" :popup="true"></Menu>
    </div>
    <About ref="aboutRef" />
  </div>
</template>

<script lang="ts" setup>
import Store, { Display } from '../store';
import { Button, Menu } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import About from './about.vue';
import { storeToRefs } from 'pinia';

const route=useRoute();
const router=useRouter();
const store=Store();

const { mobile, darkMode }=storeToRefs(store);

const aboutRef=ref();
const darkModeMenu=ref();

function darkModeHandler(event: any){
  darkModeMenu.value.toggle(event);
}

const showAbout=()=>{
  aboutRef.value.showAboutHandler();
}

function userHandler(event: any){
  desktopMenu.value.toggle(event);
}

const darkModeMenuItems=ref([
  {
    label: "显示",
    items: [
      {
        label: '跟随系统',
        icon: 'pi pi-sparkles',
        command: ()=>{
          store.setDisplayMode(Display.auto);
        }
      },
      {
        label: '浅色',
        icon: 'pi pi-sun',
        command: ()=>{
          store.setDisplayMode(Display.light);
        }
      },
      {
        label: '深色',
        icon: 'pi pi-moon',
        command: ()=>{
          store.setDisplayMode(Display.dark);
        }
      },
    ]
  }
])

const desktopMenuItems=ref([
  {
    label: '用户',
    items: [
      {
        label: '修改密码',
        icon: 'pi pi-key',
        command: ()=>toRoute('/change-password')
      },
      {
        label: '注销',
        icon: 'pi pi-sign-out',
        command: ()=>{
          localStorage.clear();
          window.location.href="/login";
        }
      }
    ]
  }
])

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
        label: '修改密码',
        icon: 'pi pi-key',
        command: ()=>toRoute('/change-password')
      },
      {
        label: '注销',
        icon: 'pi pi-sign-out',
        command: ()=>{
          localStorage.clear();
          window.location.href="/login";
        }
      }
    ]
  }
])

const toRoute=(path: string)=>{
  router.push(path);
}

const menu = ref();
const desktopMenu = ref();

function menuHandler(event: any){
  menu.value.toggle(event);
}

function calWidth(){
  if(window.innerWidth<900){
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
  justify-content: flex-end;
}
.signout{
  margin-right: 20px;
  margin-left: 10px;
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

.helper-page-dark .header{
  background-color: #1f1f1f;
  border-bottom: 2px solid black;
}
.head_img{
  margin-left: 30px;
  width: 180px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>