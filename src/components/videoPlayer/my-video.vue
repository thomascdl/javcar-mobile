<template>
  <div ref="player" class="player">
    <div
      class="wrapper"
      :style="{ visibility: state.controlBarShow ? 'visible' : 'hidden' }"
    ></div>
    <!--    <v-touch-->
    <!--      class="touch-area"-->
    <!--      v-bind:enabled="true"-->
    <!--      @touchstart.native="touchScreenStart"-->
    <!--      @panright="touchScreenMove"-->
    <!--      @panleft="touchScreenMove"-->
    <!--      @tap="clickScreen"-->
    <!--    >-->
    <!--    </v-touch>-->
    <div
      class="control"
      @touchstart="touchScreenStart"
      @touchmove="touchScreenMove"
      @click="clickScreen"
    >
      <svg-icon
        v-if="state.fullScreen & state.controlBarShow"
        class="return"
        icon-class="return"
        @click.stop="fullscreen"
      />
      <div
        class="play-pause"
        @click.stop="playOrPause"
        v-show="state.playBtnShow || state.isLoading"
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
        <van-loading color="#fff" size="58px" v-show="state.isLoading" />
      </div>
      <div
        class="control-bar"
        v-show="state.controlBarShow"
        :style="{ fontSize: state.fullScreen ? '15px' : '13px' }"
      >
        <span id="current-time" class="time">{{
          video.currentTime | formatTime
        }}</span>
        <div
          class="progress-bar"
          :style="{ width: state.fullScreen ? '80%' : '65%' }"
        >
          <div class="buffer" :style="{ width: video.buffer + '%' }"></div>
          <van-slider
            v-model="value"
            class="play-progress-bar"
            button-size="13px"
            active-color="red"
            inactive-color="hsla(0,0%,100%,.3)"
            @input="currentTimeChange"
            @change="moveProgress"
            @drag-start="touchSliderStart"
            @drag-end="touchSliderEnd"
          />
        </div>
        <span id="total-time" class="time">{{
          video.totalTime | formatTime
        }}</span>
        <div class="full-screen" @click.stop="fullscreen">
          <svg-icon
            v-if="state.fullScreen"
            class="fullscreen-btn"
            icon-class="exitFull"
          />
          <svg-icon v-else class="fullscreen-btn" icon-class="fullscreen" />
        </div>
      </div>
    </div>

    <video
      ref="video"
      :src="src"
      id="video"
      style="width:100%;height:100%;object-fit:fill"
      :poster="posterSrc"
      @timeupdate="timeupdate"
      @canplay="init"
      @canplaythrough="state.isLoading = false"
      @waiting="state.isLoading = true"
      @playing="playing"
      @progress="progress"
      @ended="videoEnd"
    />
  </div>
</template>

<script>
export default {
  name: "my-video",
  props: {
    src: {
      type: String,
      default: "https://h5player.bytedance.com/video/mp4/xgplayer-demo-360p.mp4"
    },
    poster: {
      type: String,
      default: "https://photo.mac69.com/180205/18020526/a9yPQozt0g.jpg"
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      posterSrc: "",
      startValue: 0, //每次触屏时的value值
      start: 0, //每次触屏的开始位置
      end: 0, //每次触屏的结束位置
      value: 0,
      // video控制显示设置
      video: {
        currentTime: "00:00", // 进度时间
        totalTime: "00:00", // 总时间
        buffer: 0 //缓存进度
      },
      imgSrc: {
        pauseImg: require("assets/video/content_btn_pause.svg"),
        playImg: require("assets/video/content_btn_play.svg")
      },
      // 播放状态控制
      state: {
        isStarted: false, // 是否已经播放过
        playBtnShow: true, // 播放按钮
        controlBarShow: false, // 控制条
        fullScreen: false,
        playing: false,
        isLoading: false
      }
    };
  },
  filters: {
    formatTime(time) {
      // 预处理
      time = time | 0;
      // 获取时间
      const hour = (time / 3600) | 0;
      let minute = ((time - hour * 3600) / 60) | 0;
      let second = time % 60;
      // 对时间做后处理
      second = second < 10 ? "0" + second.toString() : second;
      minute = minute < 10 ? "0" + minute.toString() : minute;
      if (hour === 0) {
        return `${minute}:${second}`;
      } else {
        return `${hour}:${minute}:${second}`;
      }
    }
  },
  watch: {
    "$store.state.playIndex": function() {
      if (this.$store.state.playIndex !== this.index && this.state.isStarted) {
        this.reset();
        this.$refs.video.load();
      }
    }
  },
  methods: {
    reset() {
      this.video = {
        currentTime: "00:00",
        totalTime: "00:00",
        buffer: 0
      };
      this.startValue = 0;
      this.start = 0;
      this.end = 0;
      this.value = 0;
      this.state = {
        isStarted: false,
        playBtnShow: true,
        controlBarShow: false,
        fullScreen: false,
        playing: false,
        isLoading: false
      };
    },
    videoEnd() {
      if (this.state.fullScreen) {
        window.plus.screen.lockOrientation("portrait-primary");
        setTimeout(() => {
          document.exitFullscreen();
        }, 100);
      }
      this.reset();
      this.$refs.video.load();
    },
    touchScreenStart(e) {
      this.start = e.touches[0].clientX;
      this.startValue = this.value;
    },
    touchScreenMove(e) {
      if (!this.state.isStarted) {
        return;
      }
      const moveRange = (e.touches[0].clientX - this.start) / 5;
      const newValue = (this.startValue + moveRange) | 0;
      this.value = newValue < 100 ? newValue : 100;
      this.video.currentTime = this.$refs.video.currentTime =
        (this.video.totalTime * this.value) / 100;
    },
    clickScreen() {
      if (!this.state.isStarted) {
        return;
      }
      this.state.playBtnShow = !this.state.playBtnShow;
      this.state.controlBarShow = !this.state.controlBarShow;
    },
    progress() {
      setTimeout(() => {
        if (this.$refs.video.buffered.length !== 0) {
          const end = this.$refs.video.buffered.end(0);
          this.video.buffer = ((end / this.video.totalTime) * 100) | 0;
        }
      }, 100);
    },
    playing() {
      this.state.isLoading = false;
      this.state.playing = true;
    },
    init() {
      this.video.totalTime = this.$refs.video.duration;
    },
    currentTimeChange(value) {
      this.video.currentTime = (this.video.totalTime * value) / 100;
    },
    timeupdate() {
      this.value = (100 / this.video.totalTime) * this.$refs.video.currentTime;
      this.video.currentTime = this.$refs.video.currentTime;
    },
    touchSliderStart() {
      this.$refs.video.pause();
    },
    touchSliderEnd() {
      this.$refs.video.play();
    },
    moveProgress(value) {
      this.$refs.video.currentTime = (this.video.totalTime * value) / 100;
    },
    fullscreen() {
      if (!this.state.fullScreen) {
        window.plus.screen.lockOrientation("landscape-primary");
        setTimeout(() => {
          this.$refs.player.requestFullscreen();
          this.state.fullScreen = true;
        }, 100);
      } else {
        window.plus.screen.lockOrientation("portrait-primary");
        setTimeout(() => {
          document.exitFullscreen();
          this.state.fullScreen = false;
        }, 100);
      }
    },
    playOrPause() {
      this.state.isStarted = true;
      if (this.state.playing === true) {
        this.state.playBtnShow = true;
        this.state.controlBarShow = true;
        this.$refs.video.pause();
        this.state.playing = false;
      } else {
        this.state.playBtnShow = false;
        this.state.controlBarShow = false;
        this.$refs.video.play();
        this.$store.commit("changeIndex", this.index);
        this.state.playing = true;
      }
    }
  },
  mounted() {
    // this.width = this.$refs.player.offsetWidth;
    const options = {
      root: document.querySelector(".main-area")
    };
    this.observer = new IntersectionObserver(entries => {
      // console.log(entries[0].isIntersecting);
      if (entries[0].isIntersecting) {
        this.posterSrc = this.poster;
        // console.log(this.index + "进入可视区域");
        // do something
      } else {
        if (this.state.isStarted) {
          this.reset();
          this.$refs.video.load();
        }
        // console.log(this.index + "移出可视区域");
        // do something
      }
    }, options);
    this.observer.observe(this.$refs.video);
  }
};
</script>

<style scoped>
.player {
  width: 100%;
  height: 56vw;
  overflow: hidden;
  position: relative;
}
.control {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
}
.play-pause {
  width: 58px;
  height: 58px;
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.control-bar {
  width: 90%;
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translate(-50%);
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.time {
  color: white;
  font-size: 1em;
}
.progress-bar {
  margin-left: 5px;
}
.full-screen {
  position: relative;
  top: 1px;
}
.fullscreen-btn {
  font-size: 1.38em;
  color: white;
}
.buffer {
  background: hsla(0, 0%, 100%, 0.5);
  height: 2px;
  z-index: 5;
  position: relative;
  top: 1px;
}
.play-progress-bar {
  position: relative;
  bottom: 1px;
}
/deep/ .van-slider__button-wrapper {
  z-index: 10;
}
/deep/ .van-slider__bar {
  z-index: 10;
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
.return {
  position: relative;
  top: 5%;
  left: 5%;
  font-size: 20px;
}
</style>
