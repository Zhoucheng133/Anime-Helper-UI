import { defineStore } from "pinia";
import { ref } from "vue";
import hostname from "../env/hostname";
import axios from "axios";
import store from ".";
import { useToast } from "primevue";
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();

export interface AllItem{
  time: number,
  title: string,
  url: string,
  length: number,
  magnet: string
}

export default defineStore("all", ()=>{
  const toast=useToast();
  const list=ref<AllItem[]>([]);

  const getList=async (type: string, retry=false)=>{
    const {data: response}=await axios.get(`${hostname}/api/all/get`, {
      headers: {
        token: store().token,
      },
      params: {
        type: type,
      }
    })
    if(response.ok){
      const data=response.msg as AllItem[];
      list.value=data;
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        getList(type, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '请求失败', detail: response.msg, life: 3000 });
    }
  }

  const download=async (url: string, retry=false)=>{
    const {data: response}=await axios.post(`${hostname}/api/all/download`, {
      link: url,
    },  {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      toast.add({ severity: 'success', summary: '下载成功', detail: "已添加到下载队列", life: 3000 });
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        download(url, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '下载失败', detail: response.msg, life: 3000 });
    }
  }

  const copy=(url: string)=>{
    toClipboard(url);
    toast.add({ severity: 'success', summary: '复制成功', detail: "已复制链接到剪贴板", life: 3000 });
  }

  return {
    download,
    list,
    getList,
    copy
  }
})