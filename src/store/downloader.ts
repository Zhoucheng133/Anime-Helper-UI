import { defineStore } from "pinia";
import { ref } from "vue";

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
  list: DownloaderListType[],
  exclude: DownloaderExcludeType[]
}

export default defineStore("downloader", ()=>{
  const running=ref(false);

  const rssTypes=ref<RssType[]>([
    {id: "mikan", text: "Mikan"},
    {id: "acgrip", text: "Acgrip"},
  ])
  const rssSelected=rssTypes.value[0];

  const req=ref("15");
  const link=ref("");
  const secret=ref("");

  const list=ref<DownloaderListType[]>([]);
  const exclude=ref<DownloaderExcludeType[]>([]);

  return {
    exclude,
    list,
    secret,
    link,
    req,
    rssTypes,
    rssSelected,
    running,
  }
})