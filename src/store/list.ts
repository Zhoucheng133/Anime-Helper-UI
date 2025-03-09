import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import hostname from "../env/hostname";
import store from ".";

interface ListType{
  id: string,
  title: string,
  episode: number,
  now: number,
  time: number,
}

export default defineStore("list", ()=>{

  // const filters=ref(["所有", "进行中", "更新中", "已完结", "已看完", "搜索", "更新周"]);
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
  const selectedWeekday=ref("星期一");
  const weekdays=ref(["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"])
  const length=ref(0);

  const offset=ref(0);
  const limit=ref(20);

  const list=ref<ListType[]>([]);
  const getList=async ()=>{
    const {data: response}=await axios.get(`${hostname}/api/list/get`, {
      params: {
        offset: offset.value,
        limit: limit.value,
        filter: selectedFilter.value.code,
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

  return {
    selectedFilter,
    filters,
    selectedWeekday,
    weekdays,
    length,
    list,
    getList,
  };
})