import axios from "axios";
import Global from "../global/Global";

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: Global.back_url,
    timeout: 5000
  });
  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(
    config => {
      if (localStorage.token) {
        config.headers.Authorization = "jwt " + localStorage.token;
      }
      return config;
    },
    err => {
      console.log(err);
    }
  );

  // 2.2.响应拦截
  instance.interceptors.response.use(
    res => {
      return res.data;
    },
    err => {
      if (err.response.data.code === this.GLOBAL.login_err_code) {
        window.localStorage.setItem("token", "");
        window.localStorage.setItem("user", "guest");
        window.localStorage.setItem("userId", null);
        this.$store.commit("clearLoginStatus");
      }
    }
  );

  // 3.发送真正的网络请求
  return instance(config);
}
