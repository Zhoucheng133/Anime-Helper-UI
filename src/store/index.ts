import { defineStore } from "pinia";
import hostname from "../env/hostname";
import axios from "axios";
import { ref } from "vue";
import { useToast } from "primevue";

export enum Pages{
  login,
  register,
  other
}

export default defineStore("main", ()=>{
  const token=ref("");

  const toast=useToast();

  async function refreshToken(): Promise<boolean> {
    const {data: response}=await axios.get(`${hostname}/api/refresh`);
    if(response.ok){
      token.value=response.msg;
      localStorage.setItem("token", response.msg);
      return true;
    }else{
      toast.add({ severity: 'error', summary: '身份验证过期', detail: response.msg, life: 3000 });
      localStorage.clear();
      return false;
    }
  }

  async function authHandler(): Promise<Pages>{

    const { data: initData } = await axios.get(`${hostname}/api/init`);
    if(initData.msg){
      return Pages.register;
    }

    const localToken=localStorage.getItem("token");
    if(!localToken){
      return Pages.login;
    }

    const { data: authData } = await axios.get(`${hostname}/api/auth`, {
      headers: { token: localToken }
    });
    
    if(authData.ok){
      token.value=authData.msg;
    }else if (authData.msg === "令牌已过期") {
      if(await refreshToken()){
        return Pages.other;
      }else{
        return Pages.login;
      }
    } else {
      toast.add({ severity: 'error', summary: '身份验证失败', detail: '令牌过期或无效', life: 3000 });
      return Pages.login;
    }

    return Pages.other
  }

  return {
    token,
    refreshToken,
    authHandler,
  };
})