<template>
  <MainArea>
    <template v-slot:center>
      <VideoCell></VideoCell>
    </template>
  </MainArea>
</template>

<script>
const MainArea = () => import("./components/MainArea");
const VideoCell = () => import("@/components/VideoCell");
export default {
  name: "videoList",
  data() {
    return {};
  },
  components: {
    MainArea,
    VideoCell
  }
};
</script>

<style scoped></style>
