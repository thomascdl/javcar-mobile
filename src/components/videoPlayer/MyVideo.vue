<template>
  <div class="player">
    <video
      id="myVideo"
      style="width:100%;height: 250px;object-fit:fill"
      poster="https://photo.mac69.com/180205/18020526/a9yPQozt0g.jpg"
      controls
      preload="metadata"
      controlsList="nodownload"
    >
      <source
        src="https://h5player.bytedance.com/video/mp4/xgplayer-demo-360p.mp4"
        type="video/mp4"
      />
    </video>
  </div>
</template>

<script>
export default {
  name: "MyVideo",
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
video::-webkit-media-controls-mute-button {
  display: none !important;
}
</style>
