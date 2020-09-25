<template>
  <div ref="player" class="video-player">
    <!-- 播放器界面; 兼容ios  controls-->
    <div
      class="wrapper"
      :style="{ visibility: state.controlBarShow ? 'visible' : 'hidden' }"
    ></div>
    <video
      ref="video"
      v-if="showVideo"
      style="object-fit:fill"
      preload="auto"
      poster="https://photo.mac69.com/180205/18020526/a9yPQozt0g.jpg"
      :src="src"
      @waiting="handleWaiting"
      @canplaythrough="state.isLoading = false"
      @playing="playing"
      @error="handleError"
    >
      您的浏览器不支持HTML5
    </video>
    <!-- 兼容Android端层级问题, 弹出层被覆盖 -->
    <img
      v-show="!showVideo || state.isEnd"
      class="poster"
      src="https://photo.mac69.com/180205/18020526/a9yPQozt0g.jpg"
      alt
    />
    <!-- 控制窗口 -->
    <div
      class="control"
      v-show="!state.isError"
      ref="control"
      @touchstart="touchEnterVideo"
      @touchend="touchLeaveVideo"
    >
      <!-- 播放 || 暂停 || 加载中-->
      <div
        class="play"
        @touchstart.stop="clickPlayBtn"
        v-show="state.controlBtnShow"
      >
        <img
          v-show="!state.playing && !state.isLoading"
          :src="imgSrc.playImg"
          alt=""
        />
        <img
          v-show="state.playing && !state.isLoading"
          :src="imgSrc.pauseImg"
          alt=""
        />
        <div class="loader" v-show="state.isLoading">
          <div class="loader-inner ball-clip-rotate">
            <div></div>
          </div>
        </div>
      </div>
      <!-- 控制条 -->
      <!-- <div class="control-bar" v-show="state.controlBarShow"> -->
      <div
        class="control-bar"
        :style="{ visibility: state.controlBarShow ? 'visible' : 'hidden' }"
      >
        <span class="time">{{ video.displayTime }}</span>
        <span class="progress" ref="progress">
          <img
            class="progress-btn ignore"
            :style="{
              transform: `translate3d(${video.progress.current}px, 0, 0)`
            }"
            :src="imgSrc.progressImg"
            alt
          />
          <span
            class="progress-loaded"
            :style="{ width: `${video.loaded}%` }"
          />
          <!-- 设置手动移动的进度条 -->
          <span
            class="progress-move"
            @touchmove.stop.prevent="moveIng($event)"
            @touchstart.stop="moveStart($event)"
            @touchend.stop="moveEnd($event)"
          />
        </span>
        <span class="total-time">{{ video.totalTime }}</span>
        <span class="full-screen" @click="fullScreen">
          <img :src="imgSrc.increaseImg" alt />
        </span>
      </div>
    </div>
    <!-- 错误弹窗 -->
    <div class="error" v-show="state.isError">
      <p class="lose">视频加载失败</p>
      <p class="retry" @click="retry">点击重试</p>
    </div>
  </div>
</template>
<script>
import { throttle } from "@/assets/js/tool";

const pad = val => {
  val = Math.floor(val);
  if (val < 10) {
    return "0" + val;
  }
  return val + "";
};
const timeParse = sec => {
  let min = 0;
  min = Math.floor(sec / 60);
  sec = sec - min * 60;
  return pad(min) + ":" + pad(sec);
};

export default {
  name: "t-video",
  props: {
    src: {
      type: String,
      required: true
    },
    showVideo: {
      // 兼容android弹出层
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      playsinline: true,
      imgSrc: {
        pauseImg: require("assets/video/content_btn_pause.svg"),
        playImg: require("assets/video/content_btn_play.svg"),
        progressImg: require("assets/video/content_ic_tutu.svg"),
        increaseImg: require("assets/video/content_ic_increase.svg")
      },
      // video元素
      $video: null,
      // 视频容器元素
      player: {
        $player: null,
        pos: null
      },
      // progress进度条元素
      progressBar: {
        $progress: null, // 进度条DOM对象
        pos: null
      },
      // video控制显示设置
      video: {
        loaded: 0, // 缓存长度
        displayTime: "00:00", // 进度时间
        totalTime: "00:00", // 总时间
        progress: {
          width: 0, // 进度条长度
          current: 0 // 进度条当前位置
        }
      },
      // 定时器
      hideTimer: null,
      // 播放状态控制
      state: {
        controlBtnShow: true, // 播放按钮
        controlBarShow: false, // 控制条
        fullScreen: false,
        playing: false,
        isLoading: false,
        isEnd: false,
        isError: false
      },
      // 首次触摸
      isFirstTouch: true,
      // 暂停状态触摸
      isPauseTouch: false
    };
  },
  methods: {
    playing() {
      this.state.isLoading = false;
      this.state.controlBtnShow = false;
      this.state.playing = true;
    },
    init() {
      // 初始化video,获取video元素
      this.$video = this.$el.getElementsByTagName("video")[0];
      this.initPlayer();
    },
    // 初始化播放器容器, 获取video-player元素
    // getBoundingClientRect()以client可视区的左上角为基点进行位置计算
    initPlayer() {
      // 播放器位置
      this.player.$player = this.$el;
      this.progressBar.$progress = this.$el.getElementsByClassName(
        "progress"
      )[0];
      this.player.pos = this.$el.getBoundingClientRect();
      this.progressBar.pos = this.progressBar.$progress.getBoundingClientRect();
      this.video.progress.width = Math.round(
        this.progressBar.$progress.getBoundingClientRect().width
      );
    },
    // 点击播放 & 暂停按钮
    clickPlayBtn() {
      if (this.state.isLoading) return;
      this.isFirstTouch = false;
      this.state.playing = !this.state.playing;
      this.state.isEnd = false;
      if (this.$video) {
        // 播放状态
        if (this.state.playing) {
          try {
            this.$video.play();
            this.isPauseTouch = false;
            // 监听缓存进度
            this.$video.addEventListener("progress", () => {
              this.getLoadTime();
            });
            // 监听播放进度
            this.$video.addEventListener(
              "timeupdate",
              throttle(this.getPlayTime, 100, 1)
            );
            // 监听结束
            this.$video.addEventListener("ended", () => {
              // 重置状态
              this.state.playing = false;
              this.state.isEnd = true;
              this.state.controlBtnShow = true;
              this.video.displayTime = "00:00";
              this.video.progress.current = 0;
              this.$video.currentTime = 0;
              // this.src = this.src;
            });
          } catch (e) {
            // 捕获url异常出现的错误
          }
        }
        // 停止状态
        else {
          this.isPauseTouch = true;
          this.$video.pause();
        }
      }
    },
    // 触碰播放区
    touchEnterVideo() {
      if (this.isFirstTouch) return;
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      this.state.controlBtnShow = true;
      this.state.controlBarShow = true;
    },
    // 离开播放区
    touchLeaveVideo() {
      if (this.isFirstTouch) return;
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }
      // 暂停触摸, 不隐藏
      if (this.isPauseTouch) {
        this.state.controlBtnShow = true;
        this.state.controlBarShow = true;
      } else {
        this.hideTimer = setTimeout(() => {
          this.state.controlBarShow = false;
          // 加载中只显示loading
          this.state.controlBtnShow = this.state.isLoading;
          this.hideTimer = null;
        }, 3000);
      }
    },
    // 等待数据加载
    handleWaiting() {
      this.state.controlBtnShow = true;
      this.state.isLoading = true;
    },
    // 数据加载出错
    handleError() {
      this.state.isError = true;
    },
    // 点击重新加载
    retry() {
      this.state.isError = false;
      this.init();
    },
    // 获取播放时间
    getPlayTime() {
      const percent = this.$video.currentTime / this.$video.duration;
      this.video.progress.current = Math.round(
        this.video.progress.width * percent
      );
      // 赋值时长
      this.video.totalTime = timeParse(this.$video.duration);
      this.video.displayTime = timeParse(this.$video.currentTime);
    },
    // 获取缓存时间
    getLoadTime() {
      // console.log('缓存了...',this.$video.buffered.end(0));
      this.video.loaded =
        (this.$video.buffered.end(0) / this.$video.duration) * 100;
    },
    // 手动调节播放进度
    moveStart(e) {
      console.log(e);
    },
    moveIng(e) {
      // console.log("触摸中...");
      this.video.progress.current =
        e.targetTouches[0].pageX - this.progressBar.pos.left;
      let percent = this.video.progress.current / this.video.progress.width;
      this.$video.duration && this.setPlayTime(percent, this.$video.duration);
    },
    moveEnd(e) {
      // console.log("触摸结束...");
      this.video.progress.current =
        e.changedTouches[0].pageX - this.progressBar.pos.left;
      // 这里的offsetX都是正数
      let percent = this.video.progress.current / this.video.progress.width;
      this.$video.duration && this.setPlayTime(percent, this.$video.duration);
    },
    // 设置手动播放时间
    setPlayTime(percent, totalTime) {
      this.$video.currentTime = Math.floor(percent * totalTime);
    },
    // 设置全屏
    fullScreen() {
      if (!this.state.fullScreen) {
        this.state.fullScreen = true;
        window.plus.screen.lockOrientation("landscape-primary");
        setTimeout(() => {
          this.$refs.player.requestFullscreen();
        }, 100);
        setTimeout(() => {
          this.initPlayer();
        }, 300);
      } else {
        this.state.fullScreen = false;
        window.plus.screen.lockOrientation("portrait-primary");
        setTimeout(() => {
          document.exitFullscreen();
        }, 100);
        setTimeout(() => {
          this.initPlayer();
        }, 300);
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 20);
    // document.addEventListener("fullscreenchange", function() {
    //   const el = document.fullscreenElement; //获取全屏元素
    //   if (el) {
    //     // window.plus.screen.lockOrientation("landscape-primary");
    //   } else {
    //     // window.plus.screen.unlockOrientation();
    //     window.plus.screen.lockOrientation("portrait-primary")
    //   }
    // });
  },
  beforeDestroy() {}
};
</script>
<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  width: 58px;
  height: 58px;
  background: rgba(15, 16, 17, 0.3);
  border-radius: 50%;
  position: relative;
  .ball-clip-rotate {
    position: absolute;
    width: 30px;
    height: 32px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    > div {
      border-radius: 100%;
      animation-fill-mode: both;
      border: 2px solid #fff;
      border-bottom-color: transparent;
      height: 26px;
      width: 26px;
      background: transparent !important;
      animation: rotate 0.75s 0s linear infinite;
    }
  }
}
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  background-image: -moz-linear-gradient(
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.36) 20%,
    transparent 36%,
    transparent 70%,
    rgba(0, 0, 0, 0.24) 77%,
    rgba(0, 0, 0, 0.36) 83%,
    rgba(0, 0, 0, 0.6)
  );
  background-image: linear-gradient(
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.3) 10%,
    rgba(0, 0, 0, 0.1) 20%,
    transparent 50%,
    transparent 70%,
    rgba(0, 0, 0, 0.1) 80%,
    rgba(0, 0, 0, 0.3) 90%,
    rgba(0, 0, 0, 0.5)
  );
}
.video-player {
  width: 100%;
  height: 223px;
  overflow: hidden;
  position: relative;
  // 封面
  .poster {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  video {
    /*border-radius: 10px 10px 0 0;*/
    width: 100%;
    height: 100%;
  }
  // 控制层
  .control {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
    background-color: transparent;
    .play {
      width: 58px;
      height: 58px;
      position: absolute;
      z-index: 3;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-bar {
      width: 80%;
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      height: 26px;
      display: flex;
      align-items: center;
      span {
        font-size: 12px;
        color: #fff;
        font-weight: 500;
        white-space: nowrap;
      }

      .progress {
        position: relative;
        margin: 0 8px;
        /*width: 203px;*/
        width: 100%;
        height: 2px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 2px;
        .progress-move {
          width: 100%;
          height: 26px;
          position: absolute;
          z-index: 100;
          left: 0;
          top: 0;
          transform: translateY(-50%);
          background-color: transparent;
        }
        .progress-btn {
          position: absolute;
          left: -10px;
          top: -16px;
          transition: all 16ms;
        }
        // 不会被转义
        .ignore {
          width: 18px;
          height: 18px;
        }
        .progress-loaded {
          background-color: #fff;
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          border-radius: 2px;
          transition: all 16ms;
        }
      }
      .full-screen {
        width: 26px;
        height: 26px;
        margin-left: 8px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  // 错误层
  .error {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.84);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    .lose {
      text-align: center;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 23px;
      margin-top: 63px;
      margin-bottom: 40px;
    }
    .retry {
      margin: 0 auto;
      text-align: center;
      line-height: 38px;
      width: 101px;
      height: 38px;
      background: rgba(255, 255, 255, 1);
      border-radius: 19px;
      font-size: 15px;
      color: #008eff;
    }
  }
}
/*video::-webkit-media-controls {*/
/*  display: none !important;*/
/*}*/
</style>
