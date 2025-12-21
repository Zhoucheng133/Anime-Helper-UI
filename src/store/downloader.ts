import { defineStore } from "pinia";
import { nextTick, ref } from "vue";
import hostname from "../env/hostname";
import axios from "axios";
import store from ".";
import { useToast } from "primevue";
import { nanoid } from "nanoid";

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
  username: string,
  client: string,
  list: DownloaderListType[],
  exclude: DownloaderExcludeType[]
}

export default defineStore("downloader", ()=>{

  const toast=useToast();

  const running=ref(false);

  const rssTypes=ref<RssType[]>([
    {id: "mikan", text: "Mikan"},
    {id: "acgrip", text: "Acgrip"},
    {id: "kisssub", text: "Kisssub"}
  ])
  const rssSelected=ref(rssTypes.value[0]);

  const clientType=ref([
    {id: "aria", text: "Aria"},
    {id: "qbit", text: "qBittorrent"},
  ])
  const clientTypeSelected=ref(clientType.value[0]);

  const username=ref("");

  const freq=ref("15");
  const link=ref("");
  const secret=ref("");
  
  const list=ref<DownloaderListType[]>([]);
  const exclude=ref<DownloaderExcludeType[]>([]);

  const getList=async (retry=false)=>{
    const {data: response}=await axios.get(`${hostname}/api/downloader/get`, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      const data=response.msg as DownloaderDataType;
      running.value=data.running;
      rssSelected.value=data.type=='mikan' ? rssTypes.value[0] : rssSelected.value=data.type=='acgrip' ? rssTypes.value[1] : rssTypes.value[2];
      freq.value=data.freq.toString();
      link.value=data.link;
      secret.value=data.secret;
      list.value=data.list;
      exclude.value=data.exclude;
      clientTypeSelected.value=data.client=='qbit' ? clientType.value[1] : clientType.value[0];
      username.value=data.username;
    }else if(response.msg=="令牌已过期"){
      
      if(!retry && await store().refreshToken()){
        getList(true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '请求失败', detail: response.msg, life: 3000 });
    }
  }

  const save=async (disableToast: boolean=false, retry=false)=>{
    if(link.value.length==0){
      toast.add({ severity: 'error', summary: '更新失败', detail: "链接不能为空", life: 3000 });
      return;
    }else if(secret.value.length==0 && clientTypeSelected.value.id=="qbit"){
      toast.add({ severity: 'error', summary: '更新失败', detail: "密钥不能为空", life: 3000 });
      return;
    }else if(username.value.length==0 && clientTypeSelected.value.id=="qbit"){
      toast.add({ severity: 'error', summary: '更新失败', detail: "用户名不能为空", life: 3000 });
      return;
    }
    const {data: response}=await axios.post(`${hostname}/api/downloader/save`, {
      // link, secret, freq, type, client, username
      data:{
        link: link.value,
        secret: secret.value,
        freq: parseInt(freq.value),
        type: rssSelected.value.id,
        client: clientTypeSelected.value.id,
        username: username.value
      }
    }, {
      headers: {
        token: store().token,
      }
    })
    if(disableToast){
      return;
    }
    if(response.ok){
      toast.add({ severity: 'success', summary: '更新成功', detail: "已更新到数据库", life: 3000 });
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        save(disableToast, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '更新失败', detail: response.msg, life: 3000 });
    }
  }

  const addToList=async (title: string, ass: string, retry=false)=>{
    const {data: response}=await axios.post(`${hostname}/api/downloader/list/add`, {
      data:{
        id: nanoid(),
        title,
        ass,
      }
    }, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      getList();
      toast.add({ severity: 'success', summary: '添加成功', detail: "已更新到数据库", life: 3000 });
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        addToList(title, ass, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '添加失败', detail: response.msg, life: 3000 });
    }
  }

  const delFromList=async (id: string, retry=false)=>{
    const {data: response}=await axios.delete(`${hostname}/api/downloader/list/del/${id}`, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      getList();
      toast.add({ severity: 'success', summary: '删除成功', detail: "已更新到数据库", life: 3000 });
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        delFromList(id, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '删除失败', detail: response.msg, life: 3000 });
    }
  }

  const addToExclude=async (key: string, retry=false)=>{
    const {data: response}=await axios.post(`${hostname}/api/downloader/exclude/add`, {
      data:{
        id: nanoid(),
        key
      }
    }, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      getList();
      toast.add({ severity: 'success', summary: '添加成功', detail: "已更新到数据库", life: 3000 });
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        addToExclude(key, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '添加失败', detail: response.msg, life: 3000 });
    }
  }

  const delFromExclude=async (id: string, retry=false)=>{
    const {data: response}=await axios.delete(`${hostname}/api/downloader/exclude/del/${id}`, {
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      getList();
      toast.add({ severity: 'success', summary: '删除成功', detail: "已更新到数据库", life: 3000 });
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store().refreshToken()){
        delFromExclude(id, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '删除失败', detail: response.msg, life: 3000 });
    }
  }

  const toggleRun=async (toggle: boolean, retry=false)=>{
    if(toggle){
      if(link.value.length==0){
        toast.add({ severity: 'error', summary: '运行失败', detail: "没有配置Aria地址", life: 3000 });
        nextTick(() => {
          running.value = false;
        });
        return;
      }else if(secret.value.length==0){
        toast.add({ severity: 'error', summary: '运行失败', detail: "没有配置Aria密钥", life: 3000 });
        nextTick(() => {
          running.value = false;
        });
        return;
      }else if(list.value.length==0){
        toast.add({ severity: 'error', summary: '运行失败', detail: "番剧列表不能为空", life: 3000 });
        nextTick(() => {
          running.value = false;
        });
        return;
      }
      await save(true);
      const {data: response}=await axios.post(`${hostname}/api/download/run`, {}, {
        headers: {
          token: store().token
        }
      });
      if(!response.ok){
        toast.add({ severity: 'error', summary: '运行失败', detail: response.msg, life: 3000 });
        nextTick(() => {
          running.value = false;
        });
        return;
      }else if(response.msg=="令牌已过期"){
        if(!retry && await store().refreshToken()){
          toggleRun(toggle, true);
          return;
        }
      }
    }else{
      const {data: response}=await axios.post(`${hostname}/api/download/stop`, {}, {
        headers: {
          token: store().token
        }
      });
      if(!response.ok){
        toast.add({ severity: 'error', summary: '运行失败', detail: response.msg, life: 3000 });
        nextTick(() => {
          running.value = true;
        });
        return;
      }else if(response.msg=="令牌已过期"){
        if(!retry && await store().refreshToken()){
          toggleRun(toggle, true);
          return;
        }
      }
    }
  }

  return {
    toggleRun,
    delFromExclude,
    addToExclude,
    delFromList,
    addToList,
    save,
    getList,
    exclude,
    list,
    secret,
    link,
    freq,
    rssTypes,
    rssSelected,
    running,
    clientType,
    clientTypeSelected,
    username
  }
})