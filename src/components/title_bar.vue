<template>
  <div class="header">
    <div class="head_img">
      <img src="/icon.svg" alt="" width="40px">
      <div class="head_label">AnimeHelper</div>
    </div>

    <div class="menus" v-if="store().token.length!=0">
      菜单!
    </div>

  </div>
</template>

<script lang="ts" setup>
import store from '../store';
</script>

<style scoped>
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
  display: flex;
  align-items: center;
}
</style>