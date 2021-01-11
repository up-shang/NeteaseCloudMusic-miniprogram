import request from '../utils/request'
//获取MV
export function getVideo(data){
  return request({
    url: '/mv/all',
    method: 'get',
    data: data
  })
}
//获取mv视频url
export function getVideoUrl(data){
  return request({
    url: '/mv/url',
    method: 'get',
    data: data
  })
}