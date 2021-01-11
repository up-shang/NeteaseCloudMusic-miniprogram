import request from '../utils/request'
//根据歌单ID查询具体歌单信息
export function getPlaylistDetail(data){
  return request({
    url: '/playlist/detail',
    method: 'get',
    data: data
  })
}