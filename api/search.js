import request from '../utils/request'
export function search(data){
  return request({
    url: '/cloudsearch',
    method: 'get',
    data: data
  })
}