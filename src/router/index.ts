import {createRouter, createWebHistory} from "vue-router";
import store, { Pages } from "../store";

const router=createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "主页",
      path: "/list",
      component: ()=>import("../pages/List.vue")
    },
    {
      path: "/",
      redirect: "/list"
    },
    {
      path: "/login",
      component: ()=>import("../pages/Login.vue")
    },
    {
      path: "/register",
      component: ()=>import("../pages/Register.vue")
    },
    {
      path: "/calendar",
      component: ()=>import("../pages/Calendar.vue")
    },
    {
      path: "/recent",
      component: ()=>import("../pages/Recent.vue")
    },
    {
      path: "/downloader",
      component: ()=>import("../pages/Downloader.vue")
    },
    {
      path: "/search",
      component: ()=>import("../pages/Search.vue")
    },
    {
      path: "/change-password",
      component: ()=>import("../pages/ChangePassword.vue")
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/NotFound.vue')
    }
  ]
})

router.beforeEach(async (to, __, next)=>{
  if(to.path=="/login" || to.path=="/register"){
    return next();
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