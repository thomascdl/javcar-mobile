import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vant from "vant";
import "vant/lib/index.css";
import VConsole from "vconsole";
Vue.prototype.$vconsole = new VConsole();

import "@/icons"; // icon
Vue.use(Vant);

Vue.config.productionTip = false;

import VueTouch from "vue-touch";
Vue.use(VueTouch);

import global from "@/global/Global";
Vue.prototype.GLOBAL = global;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
