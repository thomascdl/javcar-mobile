<template>
  <div id="player">
    <div id="control">
      <div id="play-pause" v-show="state.controlBtnShow">
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
          <svg-icon icon-class="loading" />
        </div>
      </div>
      <div id="control-bar">
        <div id="current-time">{{ video.currentTime }}</div>

        <div id="progress" ref="progressBar">
          <div class="buffered" :style="{ width: videoMetadata + '%' }"></div>
          <div
            class="video-ball"
            :style="{ left: playProgress + '%' }"
            @touchstart="sliderStart"
            @touchmove="sliderMove"
            @touchend="sliderEnd"
          >
            <div></div>
          </div>
          <div
            class="played"
            ref="playedBar"
            :style="{ width: playProgress + '%' }"
          ></div>
        </div>

        <div id="total-time">{{ video.totalTime }}</div>
        <div id="full-screen">
          <svg-icon
            style="font-size: 18px;color: white"
            icon-class="exitfull"
          />
          <svg-icon
            style="font-size: 18px;color: white"
            icon-class="fullscreen"
          />
        </div>
      </div>
    </div>
    <video
      src="https://h5player.bytedance.com/video/mp4/xgplayer-demo-360p.mp4"
      id="video"
      style="width:100%;height:250px;object-fit:fill"
      poster="https://photo.mac69.com/180205/18020526/a9yPQozt0g.jpg"
    />
  </div>
</template>

<script>
const waitForLoad = (video, cb) => {
  const interval = setInterval(() => {
    if (video.readyState >= 3) {
      clearInterval(interval);
      cb();
    }
  }, 100);
};

export default {
  name: "my-video-2",
  data() {
    return {
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
      imgSrc: {
        pauseImg: require("assets/video/content_btn_pause.svg"),
        playImg: require("assets/video/content_btn_play.svg"),
        progressImg: require("assets/video/content_ic_tutu.svg"),
        increaseImg: require("assets/video/content_ic_increase.svg")
      },
      // 播放状态控制
      state: {
        controlBtnShow: true, // 播放按钮
        controlBarShow: false, // 控制条
        fullScreen: false,
        playing: false,
        isLoading: false,
        isEnd: false,
        isError: false
      }
    };
  },
  methods: {
    init() {
      const video = document.getElementById("video");
      this.video = video;
      // Wait for the video to load
      waitForLoad(video, () => {
        // We can't call video.play directly, because it can only be initiated by a user gesture
        alert(`The video is loaded, you can click "Play"`);
      });

      // Implement the custom controls
      const playButton = document.getElementById("play-pause");
      const fullScreenButton = document.getElementById("full-screen");

      const seekBar = document.getElementById("seek-bar");

      playButton.addEventListener("click", function() {
        if (video.paused === true) {
          video.play();
        } else {
          video.pause();
        }
      });
      fullScreenButton.addEventListener("click", function() {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
          video.mozRequestFullScreen(); // Firefox
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen(); // Chrome and Safari
        }
      });
      seekBar.addEventListener("change", function() {
        video.currentTime = video.duration * (seekBar.value / 100);
      });
      video.addEventListener("timeupdate", function() {
        seekBar.value = (100 / video.duration) * video.currentTime;
      });
      seekBar.addEventListener("mousedown", function() {
        video.pause();
      });
      seekBar.addEventListener("mouseup", function() {
        video.play();
      });
    }
  },
  mounted() {
    this.init();
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
#video-controls {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
}
#play-pause {
  width: 58px;
  height: 58px;
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
#control-bar {
  width: 100%;
  position: absolute;
  bottom: 8px;
  height: 26px;
  display: flex;
  align-items: center;
}
#seek-bar {
  width: 60%;
}
</style>
