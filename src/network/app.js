import { request } from "./request";

export function checkToken() {
  return request({
    url: "/checkToken/",
    data: "",
    method: "post"
  });
}
