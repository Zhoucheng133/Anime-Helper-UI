import {createRouter, createWebHistory} from "vue-router";
import store, { Pages } from "../store";

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

router.beforeEach(async (to, __, next)=>{
  if(to.path=="/login" || to.path=="/register"){
    next();
  }
  let nextPage: Pages=await store().authHandler();
  switch (nextPage) {
    case Pages.login:
      next("/login");
      break;
    case Pages.register:
      next("/register");
      break;
    default:
      next();
      break;
  }
})

export default router;