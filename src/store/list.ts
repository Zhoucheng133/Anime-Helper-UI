import axios from "axios";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import hostname from "../env/hostname";
import store from ".";

export interface ListType{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number,
}

export default defineStore("list", ()=>{
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
  const selectedWeekday=ref(weekdays.value[0]);

  const length=ref(0);

  const searchKeyWord=ref("");

  const offset=ref(0);
  const limit=ref(20);

  const list=ref<ListType[]>([]);
  async function getList(){
    const {data: response}=await axios.get(`${hostname}/api/list/get`, {
      params: {
        offset: offset.value,
        limit: limit.value,
        filter: selectedFilter.value.code,
        param: selectedFilter.value.code=='weekday' ? selectedWeekday.value.code : searchKeyWord.value,
      },
      headers: {
        token: store().token,
      }
    })
    if(response.ok){
      list.value=response.msg.data;
      length.value=response.msg.length;
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

  function onUpudate(data: ListType): boolean{
    if(data.time==0){
      return false;
    }else if(calculateEpisodesReleased(data.time)<data.episode){
      return true;
    }
    return false;
  }

  function analyseEpisode(item: ListType){
    if(item.time==0){
      return item.episode;
    }
    return calculateEpisodesReleased(item.time)>item.episode?item.episode:calculateEpisodesReleased(item.time);
  }

  function calProgress(item: ListType){
    return item.now / analyseEpisode(item) * 100;
  }

  watch(searchKeyWord, ()=>{
    if(selectedFilter.value.code=='search'){
      getList();
    }
  })

  return {
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
  };
})