const mutations = {
  clearLoginStatus(state) {
    state.isLogin = false;
    state.currentUser = "guest";
    state.userId = null;
    state.token = "";
  },
  initLoginStatus(state) {
    state.isLogin = true;
    state.currentUser = localStorage.getItem("user");
    state.token = localStorage.getItem("token");
    state.userId = parseInt(localStorage.getItem("userId"));
  },
  changeInput(state, payload) {
    state.input = payload;
  },
  changeIndex(state, payload) {
    state.playIndex = payload;
  }
};

export default mutations;
