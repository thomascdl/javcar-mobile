<template>
  <div ref="player" class="player">
    <div class="control">
      <div class="play-pause" @click="playOrPause" v-show="state.playBtnShow">
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
      <div class="control-bar">
        <span id="current-time" class="time">{{
          video.currentTime | formatTime
        }}</span>
        <van-slider
          class="progress-bar"
          v-model="value"
          button-size="13px"
          @input="currentTimeChange"
          @change="moveProgress"
          @drag-start="touchstart"
          @drag-end="touchend"
        />
        <span id="total-time" class="time">{{
          video.totalTime | formatTime
        }}</span>
        <div class="full-screen" @click="fullscreen">
          <svg-icon
            v-if="video.fullScreen"
            style="font-size: 18px;color: white"
            icon-class="exitFullscreen"
          />
          <svg-icon
            v-else
            style="font-size: 18px;color: white"
            icon-class="fullscreen"
          />
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
      @canplay="init"
      @canplaythrough="state.isLoading = false"
      @waiting="state.isLoading = true"
      @playing="playing"
    />
  </div>
</template>

<script>
export default {
  name: "my-video-2",
  data() {
    return {
      value: 0,
      // video控制显示设置
      video: {
        currentTime: "00:00", // 进度时间
        totalTime: "00:00" // 总时间
      },
      imgSrc: {
        pauseImg: require("assets/video/content_btn_pause.svg"),
        playImg: require("assets/video/content_btn_play.svg"),
        progressImg: require("assets/video/content_ic_tutu.svg"),
        increaseImg: require("assets/video/content_ic_increase.svg")
      },
      // 播放状态控制
      state: {
        playBtnShow: true, // 播放按钮
        controlBarShow: false, // 控制条
        fullScreen: false,
        playing: false,
        isLoading: false,
        isEnd: false,
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
  methods: {
    playing() {
      this.state.isLoading = false;
      this.state.playing = true;
    },
    init() {
      this.video.totalTime = this.$refs.video.duration;
    },
    timeupdate() {
      this.value =
        (100 / this.$refs.video.duration) * this.$refs.video.currentTime;
      this.video.currentTime = this.$refs.video.currentTime;
    },
    touchstart() {
      this.$refs.video.pause();
    },
    touchend() {
      this.$refs.video.play();
    },
    currentTimeChange(value) {
      this.video.currentTime = value / (100 / this.$refs.video.duration)
    },
    moveProgress() {
      this.$refs.video.currentTime =
        this.$refs.video.duration * (this.value / 100);
    },
    fullscreen() {
      if (!this.state.fullScreen) {
        this.state.fullScreen = true;
        window.plus.screen.lockOrientation("landscape-primary");
        setTimeout(() => {
          this.$refs.player.requestFullscreen();
        }, 100);
      } else {
        this.state.fullScreen = false;
        window.plus.screen.lockOrientation("portrait-primary");
        setTimeout(() => {
          document.exitFullscreen();
        }, 100);
      }
    },
    playOrPause() {
      if (this.state.playing === true) {
        this.$refs.video.pause();
        this.state.playing = false;
      } else {
        this.$refs.video.play();
        this.state.playing = true;
      }
    }
  }
};
</script>

<style scoped>
.player {
  width: 100%;
  height: 250px;
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
  bottom: 8px;
  left: 50%;
  transform: translate(-50%);
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.progress-bar {
  width: 65%;
}
.time {
  color: white;
  font-size: 13px;
}
.full-screen {
  position: relative;
  top: 1px;
}
</style>
