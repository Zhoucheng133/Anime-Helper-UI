<template>
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

const loading=ref(true);
const router=useRouter();
const toast=useToast();

onMounted(async ()=>{
  const {data: response}=await axios.get(`${hostname}/api/init`);
  if(response.msg){
    loading.value=false;
    router.push("/register")
  }else{
    const token=localStorage.getItem("token");
    if(token==null){
      loading.value=false;
      router.push("/login")
    }else{
      const {data: response}=await axios.get(`${hostname}/api/auth`, {
        headers: {
          token,
        }
      });
      loading.value=false;
      if(response.ok){
        router.push("/list");
      }else{
        toast.add({ severity: 'error', summary: '身份验证失败', detail: '令牌过期或无效', life: 3000 });
        router.push("/login")
      }
    }
  }
})

</script>