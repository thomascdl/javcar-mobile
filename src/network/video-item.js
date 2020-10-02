import { request } from './request'

export function startPlay(url, id) {
  return request({
    url: '/video/play/',
    method: 'post',
    data: { url: url, id: id }
  })
}

export function likeTheVideo(userId, videoId, like) {
  return request({
    url: '/video/score/',
    method: 'post',
    data: { userId: userId, videoId: videoId, like: like }
  })
}

export function scoreTheVideo(userId, videoId, score) {
  return request({
    url: '/video/score/',
    method: 'post',
    data: { userId: userId, videoId: videoId, score: score }
  })
}
