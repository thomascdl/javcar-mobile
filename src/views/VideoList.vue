<template>
  <MainArea>
    <template v-slot:center>
      <VideoCell
        v-for="(item, index) in videoList"
        :key="index"
        :video="item"
        :index="index"
      />
    </template>
  </MainArea>
</template>

<script>
const MainArea = () => import("./components/MainArea");
const VideoCell = () => import("./components/VideoCell");

import { getAllVideos } from "@/network/home";

export default {
  name: "videoList",
  data() {
    return {
      params: {},
      videoList: [],
      videoCount: 0,
      page: 1
    };
  },
  components: {
    MainArea,
    VideoCell
  },
  created() {
    this.getInfo(this.$store.state.input);
  },
  watch: {
    "$store.state.input": function() {
      this.getInfo({ input: this.$store.state.input });
    }
  },
  methods: {
    getInfo(query) {
      getAllVideos(query)
        .then(res => {
          this.videoList = res.data;
          this.videoCount = res.count;
          if (!res.userId) {
            this.resetLoginStatus();
          }
        })
        .catch(() => {
          this.videoList = [];
          this.videoCount = 0;
        });
    },
    resetLoginStatus() {
      window.localStorage.setItem("token", "");
      window.localStorage.setItem("user", "guest");
      window.localStorage.setItem("userId", null);
      this.$store.commit("clearLoginStatus");
    }
  }
};
</script>

<style scoped></style>
