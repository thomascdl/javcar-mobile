import { request } from './request'

export function loginAction(params) {
  return request({
    url: '/login/',
    data: params,
    method: 'post'
  })
}

