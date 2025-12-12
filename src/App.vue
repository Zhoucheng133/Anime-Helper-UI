<template>
  <TitleBar style="position: sticky; top: 0" />
  <Toast />
  <ConfirmPopup />
  <router-view v-if="!loading"></router-view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import hostname from './env/hostname';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { ConfirmPopup, useToast } from 'primevue';
import TitleBar from './components/title_bar.vue';
import store from './store';

const loading=ref(true);
const router=useRouter();
const toast=useToast();

onMounted(async ()=>{
  loading.value = true;
  try {
    // 检查是否要注册
    const { data: initData } = await axios.get(`${hostname}/api/init`);
    if (initData.msg) {
      router.replace("/register");
      return;
    }

    // 获取本地 token
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // 验证 token
    let authData;
    try {
      const { data } = await axios.get(`${hostname}/api/auth`, {
        headers: { access_token: token }
      });
      authData = data;
    } catch (err: any) {
      toast.add({ severity: 'error', summary: '身份验证失败', detail: err.message || '请求失败', life: 3000 });
      router.replace("/login");
      return;
    }
    
    if (authData.ok) {
      store().token = token;
    } else if (authData.msg === "令牌已过期") {
      await store().refreshToken();
    } else {
      toast.add({ severity: 'error', summary: '身份验证失败', detail: '令牌过期或无效', life: 3000 });
      router.replace("/login");
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: '初始化失败', detail: err.message || '请求失败', life: 3000 });
    router.replace("/login");
  } finally {
    loading.value = false;
  }
})

</script>