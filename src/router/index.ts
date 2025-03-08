import {createRouter, createWebHistory} from "vue-router";

const router=createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "主页",
      path: "/list",
      component: ()=>import("../pages/list.vue")
    },
  ]
})

export default router;