import { defineStore } from "pinia";
import { ref } from "vue";
import hostname from "../env/hostname";
import axios from "axios";
import store from ".";
import { useToast } from "primevue";

interface RssType{
  id: string,
  text: string,
}

interface DownloaderListType{
  id: string,
  title: string,
  ass: string
}

interface DownloaderExcludeType{
  id: string,
  key: string,
}

interface DownloaderDataType{
  link: string,
  secret: string,
  freq: number,
  type: string,
  running: boolean,
  list: DownloaderListType[],
  exclude: DownloaderExcludeType[]
}

export default defineStore("downloader", ()=>{

  const toast=useToast();

  const running=ref(false);

  const rssTypes=ref<RssType[]>([
    {id: "mikan", text: "Mikan"},
    {id: "acgrip", text: "Acgrip"},
  ])
  const rssSelected=ref(rssTypes.value[0]);

  const freq=ref("15");
  const link=ref("");
  const secret=ref("");
  
  const list=ref<DownloaderListType[]>([]);
  const exclude=ref<DownloaderExcludeType[]>([]);

  const getList=async ()=>{
    const {data: response}=await axios.get(`${hostname}/api/downloader/get`, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      const data=response.msg as DownloaderDataType;
      running.value=data.running;
      rssSelected.value=data.type=='mikan' ? rssTypes.value[0] : rssTypes.value[1];
      freq.value=data.freq.toString();
      link.value=data.link;
      secret.value=data.secret;
      list.value=data.list;
      exclude.value=data.exclude;
    }else{
      toast.add({ severity: 'error', summary: '更新失败', detail: response.msg, life: 3000 });
    }
  }

  return {
    getList,
    exclude,
    list,
    secret,
    link,
    freq,
    rssTypes,
    rssSelected,
    running,
  }
})