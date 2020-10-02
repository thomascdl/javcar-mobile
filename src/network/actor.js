import { request } from './request'

export function getActorInfo(page) {
  return request({
    url: '/actor/',
    params: { page: page }
  })
}
