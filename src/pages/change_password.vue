<template>
  <div class="body">
    <div class="panel">
      <div class="title">修改密码</div>
      <div class="sub">修改当前用户密码 🔑</div>
      <div class="item">
        <div className="label">原密码</div>
        <Password type="password" v-model="password" style="width: 100%;" @keyup.enter="changeHandler" :feedback="false" fluid toggleMask />
      </div>
      <div class="item">
        <div className="label">新密码</div>
        <Password type="password" v-model="newPassword" style="width: 100%;" @keyup.enter="changeHandler" :feedback="false" fluid toggleMask />
      </div>
      <div class="item">
        <div className="label">重复新密码</div>
        <Password type="password" v-model="reNewPassword" style="width: 100%;" @keyup.enter="changeHandler" :feedback="false" fluid toggleMask />
      </div>
      <Button style="margin-top: 30px; width: 100%; margin-bottom: 120px;" @click="changeHandler">修改</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Password, Button } from 'primevue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { useRouter } from 'vue-router';
import hostname from '../env/hostname';
import store from '../store';
const toast = useToast();
const router=useRouter();

let password=ref("");
let newPassword=ref("");
let reNewPassword=ref("");

document.title="AnimeHelper | 修改密码";

async function changeHandler(){
  if(password.value==""){
    toast.add({ severity: 'error', summary: '修改失败', detail: "请输入原密码", life: 3000 });
    return;
  }else if(newPassword.value==""){
    toast.add({ severity: 'error', summary: '修改失败', detail: "请输入新密码", life: 3000 });
    return;
  }else if(reNewPassword.value==""){
    toast.add({ severity: 'error', summary: '修改失败', detail: "请输入重复新密码", life: 3000 });
    return;
  }else if(newPassword.value!=reNewPassword.value){
    toast.add({ severity: 'error', summary: '修改失败', detail: "新密码与重复新密码不一致", life: 3000 });
    return;
  }
  const {data: response}=await axios.post(`${hostname}/api/changePassword`, {
    password: password.value,
    newPassword: newPassword.value
  }, {
    headers: {
      token: store().token
    }
  })
  if(!response.ok){
    toast.add({ severity: 'error', summary: '修改失败', detail: response.msg, life: 3000 });
  }else{
    localStorage.clear();
    toast.add({ severity: 'success', summary: '修改成功', detail: response.msg, life: 3000 });
    router.push("/login");
  }
}
</script>

<style scoped>
.panel{
  width: 400px;
  user-select: none;
}
@media screen and (max-width: 500px) {
  .panel {
    width: calc(100vw - 100px);
  }
}
.body{
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
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