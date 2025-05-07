<template>
  <div class="body">
    <div class="panel">
      <div class="title">登录</div>
      <div class="sub">Hi, 欢迎回来👋</div>
      <div class="item">
        <div className="label">用户名</div>
        <InputText type="text" v-model="username" style="width: 100%;" @keyup.enter="loginHandler" />
      </div>
      <div class="item">
        <div className="label">密码</div>
        <InputText type="password" v-model="password" style="width: 100%;" @keyup.enter="loginHandler" />
      </div>
      <Button style="margin-top: 30px; width: 100%; margin-bottom: 120px;" @click="loginHandler">登录</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { InputText, Button } from 'primevue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { useRouter } from 'vue-router';
import hostname from '../env/hostname';
import store from '../store';
const toast = useToast();
const router=useRouter();

const username=ref("");
const password=ref("");

document.title="AnimeHelper | 登录";

const loginHandler=async ()=>{
  const {data: response}=await axios.post(`${hostname}/api/login`, {
    username: username.value,
    password: password.value
  })
  if(response.ok){
    localStorage.setItem("token", response.msg);
    store().token=response.msg;
    router.push("/list");
  }else{
    toast.add({ severity: 'error', summary: '登录失败', detail: response.msg, life: 3000 });
  }
}

</script>

<style scoped>
.body{
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
}
.panel{
  width: 400px;
  user-select: none;
}
@media screen and (max-width: 500px) {
  .panel {
    width: calc(100vw - 100px);
  }
}
.title{
  font-weight: bold;
  font-size: 30px;
}
.sub{
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.item{
  margin-top: 20px;
}
.label{
  margin-bottom: 10px;
}
</style>