import axios from "axios";
import { defineStore } from "pinia";
import hostname from "../env/hostname";
import store from ".";
import { ref } from "vue";

export interface CalendarItem{
  title: string,
  id: string,
  added: boolean,
}

export default defineStore("calendar", ()=>{

  const list=ref<[CalendarItem[]]>();

  const getList=async ()=>{
    const {data: response}=await axios.get(`${hostname}/api/calendar/get`, {
      headers: {
        token: store().token
      }
    })
    if(response.ok){
      list.value=response.msg;
    }
  }

  return {
    list,
    getList
  }
})