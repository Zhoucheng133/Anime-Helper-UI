import axios from "axios";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import hostname from "../env/hostname";
import Store from ".";
import { useConfirm, useToast } from "primevue";
import { nanoid } from "nanoid";

export interface ListItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number,
  bgmId: string,
}

export default defineStore("list", ()=>{

  const toast=useToast();
  const confirm = useConfirm();
  const store=Store();

  function resetToMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function getTimestampOfFirstEpisode(todayTimestamp: number, releaseDay: number, episodesReleased: number): number {
    const today = resetToMidnight(new Date(todayTimestamp));
    const daysPassed = (episodesReleased - 1) * 7;
    const currentDay = today.getDay();
    const offset = (currentDay - releaseDay + 7) % 7;
    const daysSinceFirstEpisode = daysPassed + offset;
    const firstEpisodeDate = new Date(today.getTime() - daysSinceFirstEpisode * 24 * 60 * 60 * 1000);
    return firstEpisodeDate.getTime();
  }

  function calculateEpisodesReleased(firstEpisodeTimestamp: number): number {
    
    const tmp = new Date();
    const currentDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
    const difference = currentDate.getTime() - firstEpisodeTimestamp;
    const daysPassed=Math.floor(difference / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysPassed / 7);
    return Math.max(weeksPassed, 0) + 1;
  }
  const filters=ref([
    {name: "所有", code: "none"},
    {name: "进行中", code: "progress"},
    {name: "更新中", code: "onUpdate"},
    {name: "已完结", code: "updateDone"},
    {name: "已看完", code: "watchDone"},
    {name: "搜索", code: "search"},
    {name: "更新周", code: "weekday"},
  ])
  const selectedFilter=ref(filters.value[1]);
  const weekdays=ref([
    {name: "星期一", code: 1},
    {name: "星期二", code: 2},
    {name: "星期三", code: 3},
    {name: "星期四", code: 4},
    {name: "星期五", code: 5},
    {name: "星期六", code: 6},
    {name: "星期日", code: 0},
  ])
  const today = new Date().getDay();
  const selectedWeekday=ref(weekdays.value.find(day => day.code === (today || 0))??weekdays.value[0]);
  

  const length=ref(0);

  const searchKeyWord=ref("");

  const offset=ref(0);
  const limit=ref(20);

  const list=ref<ListItem[]>([]);

  async function getList(retry: boolean=false){
    const {data: response}=await axios.get(`${hostname}/api/list/get`, {
      params: {
        offset: offset.value,
        limit: limit.value,
        filter: selectedFilter.value.code,
        param: selectedFilter.value.code=='weekday' ? selectedWeekday.value.code : searchKeyWord.value,
      },
      headers: {
        token: store.token,
      }
    })
    if(response.ok){
      list.value=response.msg.data;
      length.value=response.msg.length;
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store.refreshToken()){
        getList(true);
        return;
      }
    }
  }

  function getWeekday(timestamp: number): string{
    if(timestamp==0){
      return "/"
    }else{
      const date: Date = new Date(timestamp);
      const weekDay: string = date.toLocaleString('zh-CN', { weekday: 'long' });
      return weekDay
    }
  }

  function onUpudate(data: ListItem): boolean{
    if(data.time==0){
      return false;
    }else if(calculateEpisodesReleased(data.time)<data.episode){
      return true;
    }
    return false;
  }

  function analyseEpisode(item: ListItem){
    if(item.time==0){
      return item.episode;
    }
    return calculateEpisodesReleased(item.time)>item.episode?item.episode:calculateEpisodesReleased(item.time);
  }

  function calProgress(item: ListItem){
    return item.now / analyseEpisode(item) * 100;
  }

  watch(searchKeyWord, ()=>{
    if(selectedFilter.value.code=='search'){
      getList();
    }
  })

  async function add(item: ListItem, retry=false){
    if(item.now>=analyseEpisode(item)){
      return;
    }
    const {data: response}=await axios.post(`${hostname}/api/list/edit`, {
      data: {
        ...item,
        now: item.now+1
      }
    }, {
      headers: {
        token: store.token,
      }
    })
    if(response.ok){
      getList();
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store.refreshToken()){
        add(item, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '更新失败', detail: response.msg, life: 3000 });
    }
  }

  async function minus(item: ListItem, retry=false){
    if(item.now<=0){
      return;
    }
    const {data: response}=await axios.post(`${hostname}/api/list/edit`, {
      data: {
        ...item,
        now: item.now-1
      }
    }, {
      headers: {
        token: store.token,
      }
    })
    if(response.ok){
      getList();
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store.refreshToken()){
        minus(item, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '更新失败', detail: response.msg, life: 3000 });
    }
  }

  async function addItem(title: string, update: boolean, episode: number, watchTo: number, updateTo: number, updateWeekday: number, bgmId: string, retry=false): Promise<boolean>{
    const todayTimestamp = Date.now();
    const jsonItem={
      id: nanoid(),
      title: title,
      episode: episode,
      now: watchTo,
      time: update ? getTimestampOfFirstEpisode(todayTimestamp, updateWeekday, updateTo) : 0,
      bgmId: bgmId
    }
    const {data: response}=await axios.post(`${hostname}/api/list/add`, {
      data: jsonItem
    }, {
      headers: {
        token: store.token,
      }
    })
    if(response.ok){
      await getList()
      return true;
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store.refreshToken()){
        return addItem(title, update, episode, watchTo, updateTo, updateWeekday, bgmId, true);
      }
      return false;
    }else{
      toast.add({ severity: 'error', summary: '添加失败', detail: response.msg, life: 3000 });
      return false;
    }
  }

  async function editItem(id: string, title: string, update: boolean, episode: number, watchTo: number, updateTo: number, updateWeekday: number, retry=false){
    const todayTimestamp = Date.now();
    const jsonItem={
      id: id,
      title: title,
      episode: episode,
      now: watchTo,
      time: update ? getTimestampOfFirstEpisode(todayTimestamp, updateWeekday, updateTo) : 0
    }
    const {data: response}=await axios.post(`${hostname}/api/list/edit`, {
      data: jsonItem
    }, {
      headers: {
        token: store.token,
      }
    })
    if(response.ok){
      getList()
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store.refreshToken()){
        editItem(id, title, update, episode, watchTo, updateTo, updateWeekday, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '更新失败', detail: response.msg, life: 3000 });
    }
  }

  async function deleteItemHandler(item: ListItem, retry=false){
    const {data: response}=await axios.delete(`${hostname}/api/list/del/${item.id}`, {
      headers: {
        token: store.token,
      }
    })
    if(response.ok){
      getList();
    }else if(response.msg=="令牌已过期"){
      if(!retry && await store.refreshToken()){
        deleteItemHandler(item, true);
        return;
      }
    }else{
      toast.add({ severity: 'error', summary: '删除失败', detail: response.msg, life: 3000 });
    }
  }

  function deleteItem(event: any, item: ListItem){
    confirm.require({
      target: event.currentTarget,
      position: "bottomleft",
      message: '你确定要删除这项吗',
      rejectProps: {
        label: '取消',
        severity: 'secondary',
        outlined: true,
        size: "small"
      },
      acceptProps: {
        label: '删除',
        severity: "danger",
        size: "small"
      },
      accept: () => deleteItemHandler(item),
      reject: () => {}
    });
  }

  function showError(detail: string) {
    toast.add({ severity: 'error', summary: '添加失败', detail, life: 3000 });
  }

  function formChecker(title: string, update: boolean, episode: string, watchTo: string, updateTo: string): boolean{
    const t = title.trim();
    const totalEp = parseInt(episode);
    const watchedEp = parseInt(watchTo);
    const updatedEp = parseInt(updateTo);

    if (!t) {
      showError('标题不能为空');
      return false;
    }else if (isNaN(totalEp) || totalEp < 1) {
      showError('请输入有效的总集数');
      return false;
    }else if (isNaN(watchedEp) || watchedEp < 0) {
      showError('请输入有效的观看集数');
      return false;
    }

    if (update) {
      if (isNaN(updatedEp)) {
        showError('更新集数不能为空');
        return false;
      }
      if(updatedEp < 1){
        showError('更新集数不能小于1');
        return false;
      }
      if (updatedEp > totalEp) {
        showError('更新集数不能大于总集数');
        return false;
      }
      if (watchedEp > updatedEp) {
        showError('观看集数不能大于更新集数');
        return false;
      }
    } else {
      if (watchedEp > totalEp) {
        showError('观看集数不能大于总集数');
        return false;
      }
    }
    return true;
  }

  return {
    deleteItem,
    editItem,
    addItem,
    getTimestampOfFirstEpisode,
    add,
    minus,
    searchKeyWord,
    calProgress,
    analyseEpisode,
    calculateEpisodesReleased,
    offset,
    getWeekday,
    onUpudate,
    selectedFilter,
    filters,
    selectedWeekday,
    weekdays,
    length,
    list,
    getList,
    formChecker
  };
})