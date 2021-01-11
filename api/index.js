import request from '../utils/request'
export function getPlayList(data){
  return request({
    url: '/playlist/detail',
    method: 'get',
    data: data
  })
}
//获取热门歌单
export function getHotPlaylist(data){
  return request({
    url: '/top/playlist',
    method: 'get',
    data: data
  })
}