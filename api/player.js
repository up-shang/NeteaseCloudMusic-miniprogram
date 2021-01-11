import request from '../utils/request'
//获取歌曲mp3 url
export function getSongUrl(data){
  return request({
    url: '/song/url',
    method: 'get',
    data: data
  })
}
//获取歌词
export function getLyric(data){
  return request({
    url: '/lyric',
    method: 'get',
    data: data
  })
}