<template>
  <MainArea>
    <template v-slot:center>
      <van-pull-refresh
        v-model="refreshing"
        success-text="刷新成功"
        @refresh="onRefresh"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <VideoCell
            v-for="(item, index) in videoList"
            :key="index"
            :video="item"
            :index="index"
          />
        </van-list>
      </van-pull-refresh>
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
      page: 0,
      pageSize: 20,
      loading: false,
      finished: false,
      refreshing: false,
      isFirst: true
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
    onLoad() {
      if (this.isFirst) {
        this.isFirst = false;
        this.loading = false;
        return;
      }
      this.page++;
      this.getMore({ input: this.$store.state.input, page: this.page });
      if (this.videoCount >= 40) {
        this.finished = true;
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.getInfo(this.$store.state.input);
        this.refreshing = false;
      }, 1000);
    },
    getInfo(query) {
      getAllVideos(query)
        .then(res => {
          this.videoList = res.data;
          this.videoCount = this.pageSize;
          if (!res.userId) {
            this.resetLoginStatus();
          }
        })
        .catch(() => {
          this.videoList = [];
          this.videoCount = 0;
        });
    },
    getMore(query) {
      getAllVideos(query)
        .then(res => {
          this.videoList = this.videoList.concat(res.data);
          this.videoCount += this.pageSize;
          this.loading = false;
          if (!res.userId) {
            this.resetLoginStatus();
          }
        })
        .catch(() => {});
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
