import Vue from "vue";
import VueRouter from "vue-router";

const Layout = () => import("@/layout");
const VideoList = () => import("@/views/VideoList");
const About = () => import("@/views/About");
const Actor = () => import("@/views/Actor");
Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "video"
  },
  {
    path: "/",
    redirect: "video",
    component: Layout,
    children: [
      {
        path: "video",
        name: "video",
        component: VideoList
      },
      {
        path: "about",
        name: "about",
        component: About
      },
      {
        path: "actor",
        name: "actor",
        component: Actor
      }
    ]
  }
];

const router = new VueRouter({
  // mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
