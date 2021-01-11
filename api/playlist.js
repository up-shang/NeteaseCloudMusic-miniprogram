import request from '../utils/request'
//热门歌单分类
export function hotplaylistSort(data){
  return request({
    url: '/playlist/hot',
    method: 'get',
    data: data
  })
}
