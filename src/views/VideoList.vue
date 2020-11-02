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
      videoList: [],
      videoCount: 0,
      page: 0,
      pageSize: 10,
      loading: false,
      finished: false,
      refreshing: false
    };
  },
  components: {
    MainArea,
    VideoCell
  },
  watch: {
    "$store.state.input": function() {
      this.refreshing = true;
      this.onRefresh();
    }
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.videoList = [];
          this.videoCount = 0;
          this.page = 0;
          this.refreshing = false;
        }
        this.page++;
        this.getMore({
          input: this.$store.state.input,
          page: this.page,
          limit: this.pageSize
        });
      }, 2000);
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    getMore(query) {
      getAllVideos(query)
        .then(res => {
          this.videoList = this.videoList.concat(res.data);
          this.videoCount += this.pageSize;
          setTimeout(() => {
            this.loading = false;
            if (this.videoCount >= 30) {
              this.finished = true;
            }
          }, 100);
          if (!res.userId) {
            this.resetLoginStatus();
          }
        })
        .catch(() => {
          this.loading = false;
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
