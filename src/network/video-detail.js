import { request } from './request'

export function getVideoInfo(id) {
  return request({
    url: '/video/' + id + '/'
  })
}

export function getRandomVideo(id) {
  return request({
    url: '/video/relative/' + id + '/'
  })
}
