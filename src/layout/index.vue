<template>
  <div id="layout">
    <div class="top">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        shape="round"
        background="red"
      />
    </div>
    <div class="container">
      <keep-alive><router-view /></keep-alive>
    </div>
    <van-tabbar route active-color="#07c160" inactive-color="#000">
      <van-tabbar-item replace to="/home" icon="home-o">
        影片
      </van-tabbar-item>
      <van-tabbar-item replace to="/about" icon="search">
        收藏
      </van-tabbar-item>
      <van-tabbar-item replace to="/about" icon="search">
        关于
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// const NavBar = () => import("./components/NavBar");
export default {
  name: "Layout",
  components: {},
  data() {
    return {
      active: "home",
      value: ""
    };
  },
  methods: {
  }
};
</script>

<style>
.top {
  top: 0;
  position: fixed;
  width: 100%;
}
.container{
  position: absolute;
  bottom: 50px;
  top: 54px;
  overflow: scroll;
  width: 100%;
}
</style>
