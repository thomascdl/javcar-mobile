<template>
  <div class="video">
    <div class="top clearfix">
      <div class="top-left">
        <van-image
          round
          width="2rem"
          height="2rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div class="top-right">
        <div class="clearfix">
          <span class="fh">ABP-103</span>
          <span class="score">评分</span>
        </div>
        <div class="title">
          text text text text text text text text text
          你哈你哈你哈你哈你哈你哈你哈你哈你哈你哈
        </div>
      </div>
    </div>
    <div class="video-area">
      <div class="play-button"></div>
      <div class="play-count"></div>
      <div class="time"></div>
    </div>
    <div class="footer">
      <span class="love"></span>
      <span class="up"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoCell",
  components: {},
  data() {
    return {};
  }
};
</script>

<style scoped>
.clearfix {
  *zoom: 1;
}
.clearfix:before,
.clearfix:after {
  display: table;
  line-height: 0;
  content: "";
}
.clearfix:after {
  clear: both;
}
.top {
  padding-top: 1rem;
}
.top-left {
  text-align: center;
  width: 13%;
  float: left;
  padding-top: 0.2rem;
}
.top-right {
  width: 87%;
  float: left;
  box-sizing: border-box;
  padding-right: 0.5rem;
}
.title {
  word-break: normal;
}
.fh{
  float: left;
}
.score{
  float: right;
}
</style>
