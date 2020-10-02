<template>
  <div class="up-area">
    <div class="top">
      <slot name="top">
        <van-search
          v-model="input"
          placeholder="请输入搜索关键词"
          shape="round"
          background="red"
          @search="submit"
        />
      </slot>
    </div>
    <div class="main-area">
      <slot name="center" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MainArea",
  data() {
    return {
      input: ""
    };
  },
  methods: {
    submit() {
      this.$store.commit("changeInput", this.input);
    }
  }
};
</script>

<style scoped>
.up-area {
  position: absolute;
  top: 0;
  bottom: 50px;
  width: 100%;
}
.top {
  top: 0;
  position: fixed;
  width: 100%;
}
.main-area {
  position: absolute;
  bottom: 0;
  top: 54px;
  overflow: scroll;
  width: 100%;
}
</style>
