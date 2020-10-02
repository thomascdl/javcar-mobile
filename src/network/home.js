import { request } from "./request";
import qs from "qs";

export function getAllVideos(params) {
  return request({
    url: "/app/video/",
    params: params,
    paramsSerializer: param => {
      return qs.stringify(param, { indices: false });
    }
  });
}
export function getAllVideosOnGenre(params) {
  return request({
    url: "/video/genre/",
    params: params,
    paramsSerializer: param => {
      return qs.stringify(param, { indices: false });
    }
  });
}
export function getAllVideosOnActor(params) {
  return request({
    url: "/video/actor/",
    params: params,
    paramsSerializer: param => {
      return qs.stringify(param, { indices: false });
    }
  });
}
