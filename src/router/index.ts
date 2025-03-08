import {createRouter, createWebHistory} from "vue-router";

const router=createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "主页",
      path: "/list",
      component: ()=>import("../pages/list.vue")
    },
    {
      path: "/",
      redirect: "/list"
    },
    {
      path: "/login",
      component: ()=>import("../pages/login.vue")
    },
    {
      path: "/register",
      component: ()=>import("../pages/register.vue")
    },
    {
      path: "/calendar",
      component: ()=>import("../pages/calendar.vue")
    },
    {
      path: "/all",
      component: ()=>import("../pages/all.vue")
    },
    {
      path: "/downloader",
      component: ()=>import("../pages/downloader.vue")
    }
  ]
})

export default router;