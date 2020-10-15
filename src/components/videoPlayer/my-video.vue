<template>
  <div ref="player" class="player">
    <div
      class="wrapper"
      :style="{ visibility: controlBarShow ? 'visible' : 'hidden' }"
    ></div>
    <div
      class="control"
      @touchstart="touchScreenStart"
      @touchmove="touchScreenMove"
      @touchend="touchScreenEnd"
      @click.stop="clickScreen"
    >
      <svg-icon
        v-if="state.fullScreen & controlBarShow"
        class="return"
        icon-class="return"
        @click.stop="fullscreen"
      />
      <div
        class="play-pause"
        @click.stop="playOrPause"
        v-show="playBtnShow || state.isLoading"
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
        v-show="controlBarShow"
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
            :max="maxValue"
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
      src="https://h5player.bytedance.com/video/mp4/xgplayer-demo-360p.mp4"
      id="video"
      style="width:100%;height:100%;object-fit:fill"
      poster="https://photo.mac69.com/180205/18020526/a9yPQozt0g.jpg"
      @timeupdate="timeupdate"
      @canplay="initVideo"
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
      value: 0,
      maxValue: 1000,
      posterSrc: "",
      controlBarShow: false,
      playBtnShow: true,
      imgSrc: {
        pauseImg: require("assets/video/content_btn_pause.svg"),
        playImg: require("assets/video/content_btn_play.svg")
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
        this.reload(100);
      }
    },
    controlBarShow: function() {
      if (this.controlBarShow && this.state.playing) {
        this.closeControlBar(4000)
      } else {
        clearTimeout(this.ct);
      }
    }
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
      this.video = {
        currentTime: "00:00",
        totalTime: "00:00",
        buffer: 0
      };
      this.moveStep = 0;
      this.moveTo = null;
      this.startX = 0;
      this.startY = 0;
      this.value = 0;
      this.controlBarShow = false;
      this.playBtnShow = true;
      this.state = {
        isStarted: false,
        fullScreen: false,
        playing: false,
        isLoading: false
      };
    },
    reload(delay) {
      setTimeout(() => {
        this.reset();
        this.$refs.video.load();
        this.$refs.video.poster = "";
        this.$refs.video.poster = this.poster;
      }, delay);
    },
    initWidth() {
      this.moveStep = (this.$refs.player.offsetWidth * 0.01) | 0;
    },
    exitFull(delay) {
      window.plus.screen.lockOrientation("portrait-primary");
      setTimeout(() => {
        document.exitFullscreen();
        this.state.fullScreen = false;
        this.initWidth();
      }, delay);
    },
    enterFull(delay) {
      window.plus.screen.lockOrientation("landscape-primary");
      setTimeout(() => {
        this.$refs.player.requestFullscreen();
        this.state.fullScreen = true;
        this.initWidth();
      }, delay);
    },
    videoEnd() {
      if (this.state.fullScreen) {
        this.exitFull(100);
      }
      this.reload(100);
    },
    touchScreenStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.startTime = this.video.currentTime;
    },
    touchScreenEnd() {
      if (this.moveTo === "left") {
        this.$refs.video.currentTime = this.video.currentTime;
      }
      this.moveTo = null;
    },
    touchScreenMove(e) {
      if (!this.state.isStarted || this.moveTo === "up") {
        return;
      }
      const deltaX = e.touches[0].clientX - this.startX;
      const deltaY = e.touches[0].clientY - this.startY;
      if (!this.moveTo) {
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          this.moveTo = "up";
          return;
        } else {
          this.moveTo = "left";
        }
      }
      const movePercent = deltaX / this.moveStep;
      const newTine = this.startTime + movePercent;
      this.video.currentTime =
        newTine < this.video.totalTime ? newTine : this.video.totalTime;
      this.video.currentTime = newTine > 0 ? newTine : 0;
      setTimeout(() => {
        this.value =
          ((this.video.currentTime / this.video.totalTime) * this.maxValue) | 0;
      }, 50);
    },
    // touchScreenMove(e) {
    //   if (!this.state.isStarted) {
    //     return;
    //   }
    //   const movePercent = (e.touches[0].clientX - this.startX) / this.moveStep;
    //   // console.log(movePercent);
    //   if (Math.abs(movePercent) < 8 && !this.state.fullScreen) {
    //     return;
    //   }
    //   const newValue =
    //     (this.startValue + movePercent * 0.4 * this.valuePerSecond) | 0;
    //   this.value = newValue < this.maxValue ? newValue : this.maxValue;
    //   this.value = newValue > 0 ? newValue : 0;
    //   this.video.currentTime = this.$refs.video.currentTime =
    //     (this.video.totalTime * this.value) / this.maxValue;
    // },
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
    initVideo() {
      console.log("loaded");
      this.video.totalTime = this.$refs.video.duration;
    },
    timeupdate() {
      if (this.moveTo === "left") {
        return;
      }
      this.value =
        (this.maxValue / this.video.totalTime) * this.$refs.video.currentTime;
      this.video.currentTime = this.$refs.video.currentTime;
    },
    touchSliderStart() {
      this.$refs.video.pause();
    },
    touchSliderEnd() {
      this.$refs.video.play();
    },
    currentTimeChange(value) {
      this.video.currentTime = (this.video.totalTime * value) / this.maxValue;
    },
    moveProgress(value) {
      this.$refs.video.currentTime =
        (this.video.totalTime * value) / this.maxValue;
    },
    fullscreen() {
      if (!this.state.fullScreen) {
        this.enterFull(100);
      } else {
        this.exitFull(100);
      }
    },
    closeControlBar(delay) {
      clearTimeout(this.ct);
      this.ct = setTimeout(() => {
        console.log("close");
        this.playBtnShow = false;
        this.controlBarShow = false;
      }, delay);
    },
    playOrPause() {
      if (this.state.playing === true) {
        clearTimeout(this.ct);
        this.$refs.video.pause();
        this.state.playing = false;
      } else {
        this.playBtnShow = this.state.isStarted === true;
        this.closeControlBar(4000)
        this.$refs.video.play();
        this.$store.commit("changeIndex", this.index);
        this.state.playing = true;
      }
      this.state.isStarted = true;
    },
    clickScreen() {
      if (!this.state.isStarted) {
        return;
      }
      this.playBtnShow = !this.playBtnShow;
      this.controlBarShow = !this.controlBarShow;
    }
    // playOrPause() {
    //   this.state.isStarted = true;
    //   if (this.state.playing === true) {
    //     this.playBtnShow = true;
    //     this.controlBarShow = true;
    //     this.$refs.video.pause();
    //     this.state.playing = false;
    //   } else {
    //     this.playBtnShow = false;
    //     this.controlBarShow = false;
    //     this.$refs.video.play();
    //     this.$store.commit("changeIndex", this.index);
    //     this.state.playing = true;
    //   }
    // }
  },
  mounted() {
    this.moveStep = (this.$refs.player.offsetWidth * 0.01) | 0;
    const options = {
      root: document.querySelector(".main-area")
    };
    this.observer = new IntersectionObserver(entries => {
      if (this.state.fullScreen) {
        return;
      }
      // console.log(entries[0].isIntersecting);
      if (entries[0].isIntersecting) {
        this.posterSrc = this.poster;
        // console.log(this.index + "进入可视区域");
      } else {
        if (this.state.isStarted) {
          this.reload(100);
        }
        // console.log(this.index + "移出可视区域");
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
  z-index: 3;
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
