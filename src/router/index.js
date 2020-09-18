import Vue from "vue";
import VueRouter from "vue-router";

const Layout = () => import("@/layout");
const Home = () => import("@/views/Home");
const About = () => import("@/views/About");
Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "home"
  },
  {
    path: "/",
    redirect: "home",
    component: Layout,
    children: [
      {
        path: "home",
        name: "home",
        component: Home
      },
      {
        path: "about",
        name: "about",
        component: About
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
