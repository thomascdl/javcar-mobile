import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    input: "",
    currentUser: "guest",
    userId: null,
    isLogin: false,
    token: "",
    playIndex: -1
  },
  mutations,
  getters,
  actions,
  modules: {}
});
