import { defineStore } from "pinia";
import { ref } from "vue";
import hostname from "../env/hostname";
import axios from "axios";
import store from ".";
import { useToast } from "primevue";
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();

export interface DownloadItem{
  time: number,
  title: string,
  url: string,
  length: number,
  magnet: string
}

export default defineStore("recent", ()=>{
  const toast=useToast();
  const list=ref<DownloadItem[]>([]);

  const getList=async (type: string, retry=false)=>{
    const {data: response}=await axios.get(`${hostname}/api/recent/get`, {
      headers: {
        token: store().token,
      },
      params: {
        type: type,
      }
    })
    if(response.ok){
      const data=response.msg as DownloadItem[];
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
    const {data: response}=await axios.post(`${hostname}/api/recent/download`, {
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