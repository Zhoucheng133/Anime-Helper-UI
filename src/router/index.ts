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
      component: ()=>import("../pages/_blank.vue")
    },
    {
      path: "/login",
      component: ()=>import("../pages/login.vue")
    },
    {
      path: "/register",
      component: ()=>import("../pages/register.vue")
    }
  ]
})

export default router;