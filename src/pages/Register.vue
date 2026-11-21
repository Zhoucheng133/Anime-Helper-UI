<template>
  <div class="body">
    <div class="panel">
      <div class="title">注册</div>
      <div class="sub">Hi, 从这里开始吧 👋</div>
      <div class="item">
        <div className="label">用户名</div>
        <InputText type="text" v-model="username" style="width: 100%;" @keyup.enter="registerHandler" />
      </div>
      <div class="item">
        <div className="label">密码</div>
        <Password type="password" v-model="password" style="width: 100%;" @keyup.enter="registerHandler" fluid toggleMask :feedback="false"  />
      </div>
      <div class="item">
        <div className="label">重复密码</div>
        <Password type="password" v-model="rePassword" style="width: 100%;" @keyup.enter="registerHandler" fluid toggleMask :feedback="false"  />
      </div>
      <Button style="margin-top: 30px; width: 100%; margin-bottom: 120px;" @click="registerHandler">注册</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { InputText, Button, Password } from 'primevue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { useRouter } from 'vue-router';
import hostname from '../env/hostname';
const toast = useToast();
const router=useRouter();

const username=ref("");
const password=ref("");
const rePassword=ref("");

document.title="AnimeHelper | 注册"

const registerHandler=async ()=>{
  if(username.value.length==0){
    toast.add({ severity: 'error', summary: '注册失败', detail: '用户名不能为空', life: 3000 });
    return;
  }else if(password.value.length==0){
    toast.add({ severity: 'error', summary: '注册失败', detail: '密码不能为空', life: 3000 });
    return;
  }else if(rePassword.value.length==0){
    toast.add({ severity: 'error', summary: '注册失败', detail: '重复密码不能为空', life: 3000 });
    return;
  }else if(password.value!=rePassword.value){
    toast.add({ severity: 'error', summary: '注册失败', detail: '两次密码输入不一致', life: 3000 });
    return;
  }

  const {data: response}=await axios.post(`${hostname}/api/register`, {
    username: username.value,
    password: password.value
  })
  if(response.ok){
    toast.add({ severity: 'success', summary: '注册成功', detail: '正在跳转到登录', life: 3000 });
    router.replace("/login");
  }else{
    toast.add({ severity: 'error', summary: '注册失败', detail: response.msg, life: 3000 });
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
  /* border: 1px solid lightgrey; */
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