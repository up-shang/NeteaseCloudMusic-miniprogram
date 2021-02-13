import request from '../utils/request'
//手机登录接口
export function login(data) {
  return request({
    url: '/login/cellphone',
    method: 'post',
    data: data
  })
}