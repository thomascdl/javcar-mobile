<template>
  <div id="layout">
    <keep-alive><router-view /></keep-alive>
    <van-tabbar route active-color="#07c160" inactive-color="#000">
      <van-tabbar-item replace to="/video" icon="home-o">
        影片
      </van-tabbar-item>
      <van-tabbar-item replace to="/actor" icon="search">
        演员
      </van-tabbar-item>
      <van-tabbar-item replace to="/about" icon="search">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout"
};
</script>
