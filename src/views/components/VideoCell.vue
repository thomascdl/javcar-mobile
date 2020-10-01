<template>
  <div class="video-cell">
    <div class="top clearFix">
      <div class="top-left">
        <van-image
          round
          width="2rem"
          height="2rem"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div class="top-right">
        <div class="clearFix">
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
      <MyVideo></MyVideo>
      <div class="play-count"></div>
      <div class="time"></div>
    </div>
    <div class="footer">
      <svg-icon
        :style="{ color: !isLike ? 'red' : '#8a8a8a' }"
        style="border-color:black"
        class="love"
        icon-class="like"
      />
      <svg-icon
        :style="{ color: !isLike ? '#1afa29' : '#8a8a8a' }"
        class="up"
        icon-class="up"
      />
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
const MyVideo = () => import("@/components/videoPlayer/my-video");
export default {
  name: "VideoCell",
  components: {
    MyVideo
  },
  props: {
    video: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isLike: false,
      isUp: false
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.clearFix {
  *zoom: 1;
}
.clearFix:before,
.clearFix:after {
  display: table;
  line-height: 0;
  content: "";
}
.clearFix:after {
  clear: both;
}
.video-cell {
  font-size: 12px;
}
.top {
  padding-top: 2%;
}
.top-left {
  text-align: center;
  width: 13%;
  float: left;
  padding-top: 0.2em;
}
.top-right {
  width: 87%;
  float: left;
  box-sizing: border-box;
  padding-right: 0.5em;
}
.title {
  word-break: normal;
  font-size: 1.2em;
}
.fh {
  font-size: 1.4em;
  float: left;
}
.score {
  float: right;
}
.footer {
  padding: 0.6em;
  display: flex;
  text-align: center;
  justify-content: space-around;
}
.love {
  font-size: 1.5em;
}
.up {
  font-size: 1.5em;
}
.bottom {
  height: 8px;
  background-color: rgba(94, 192, 188, 0.15);
}
</style>
