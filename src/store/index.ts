import { defineStore } from "pinia";
import hostname from "../env/hostname";
import axios from "axios";
import { ref } from "vue";
import { useToast } from "primevue";
import { useRouter } from "vue-router";

export default defineStore("main", ()=>{
  const token=ref("");

  const toast=useToast();
  const router=useRouter();

  const refreshToken=async ()=>{
    const {data: response}=await axios.post(`${hostname}/api/refresh`);
    if(response.ok){
      token.value=response.data.token;
    }else{
      toast.add({ severity: 'error', summary: '身份验证过期', detail: response.msg, life: 3000 });
      localStorage.clear();
      router.replace("/login");
    }
  }

  return {
    token,
    refreshToken,
  };
})