import axios from "axios";
import { defineStore } from "pinia";
import hostname from "../env/hostname";
import store from ".";
import { ref } from "vue";
import { useToast } from "primevue";

export interface CalendarItem{
  title: string,
  id: string,
  added: boolean,
}

export default defineStore("calendar", ()=>{

  const list=ref<[CalendarItem[]]>();
  const toast=useToast();

  const getList=async ()=>{
    const {data: response}=await axios.get(`${hostname}/api/calendar/get`, {
      headers: {
        token: store().token
      }
    })
    if(response.ok){
      list.value=response.msg;
    }else{
      toast.add({ severity: 'error', summary: '更新失败', detail: response.msg, life: 3000 });
    }
  }

  return {
    list,
    getList
  }
})