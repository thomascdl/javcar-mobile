<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    // 初始化登录状态
    if (localStorage.getItem("token")) {
      this.$store.commit("initLoginStatus");
    }
  }
};
</script>
