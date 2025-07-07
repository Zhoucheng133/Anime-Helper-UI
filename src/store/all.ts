import { defineStore } from "pinia";
import { ref } from "vue";
import hostname from "../env/hostname";
import axios from "axios";
import store from ".";
import { useToast } from "primevue";

export interface AllItem{
  title: string,
  url: string,
  time: number,
  length: number,
}

export default defineStore("all", ()=>{
  const toast=useToast();
  const list=ref<AllItem[]>([]);

  const getList=async ()=>{
    const {data: response}=await axios.get(`${hostname}/api/all/get`, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      const data=response.msg as AllItem[];
      list.value=data;
    }else{
      toast.add({ severity: 'error', summary: '请求失败', detail: response.msg, life: 3000 });
    }
  }

  const download=async (url: string)=>{
    const {data: response}=await axios.post(`${hostname}/api/all/download`, {
      link: url,
    },  {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      toast.add({ severity: 'success', summary: '下载成功', detail: "已添加到下载队列", life: 3000 });
    }else{
      toast.add({ severity: 'error', summary: '下载失败', detail: response.msg, life: 3000 });
    }
  }

  return {
    download,
    list,
    getList,
  }
})