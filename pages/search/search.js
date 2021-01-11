//api
import {search} from '../../api/search'
const app = getApp()
Page({
  data: {
    searchInfo: '',
    songs: [],
    songsTotal: 0, //当前已加载歌曲
    visable: true,
    focus: true,
    currentPage: 1,
    total: 0,
    listQuery: {
      keywords : '',
      limit: 20,
      offset: 0
    },
    songUrl: '',
    searchList: [],
    deleteVisable: true
  },
  onLoad(){
    //如果缓存中有数据，则赋值给搜索数组
    if(wx.getStorageSync('search')){
      this.setData({
        searchList: wx.getStorageSync('search'),
        deleteVisable: false
      })
    }
  },
  //查询搜索的歌曲信息列表
  onSearch(){
    const tmp = this.data.searchInfo
    this.setData({
      currentPage: 1
    })
    this.setData({
      listQuery: {
        keywords: tmp,
        limit: 20,
        offset: 0
      }
    })
    search(this.data.listQuery).then(res =>{
      if(res.code === 200){
        this.setData({
          songs : res.result.songs,
          total: res.result.songCount,
          songsTotal: res.result.songs.length
        })
        if(this.data.songs.length > 0){
          this.setData({
            visable : false
          })
        }
        //将搜索历史写入本地缓存
        if(this.data.searchList.length > 0){
          //如果搜索内容相同，直接返回
          if(this.data.searchList.indexOf(this.data.searchInfo) !== -1){
            return
          }
          let tmp = this.data.searchList
          tmp.push(this.data.searchInfo) 
          this.setData({
            searchList: tmp
          })
          wx.setStorageSync('search', this.data.searchList)
        }else{ 
          this.setData({
            searchList: [this.data.searchInfo],
            deleteVisable: false
          })
          wx.setStorageSync('search', this.data.searchList)
        }  
      }
    })
  },
  onChange(e){
    this.setData({
      searchInfo : e.detail
    })
  },
  //清空搜索框时隐藏数据列表
  onClear(){
    this.setData({
      songs: [],
      visable: true
    })
  },
  //上拉加载更多歌曲信息
  onReachBottom(){
    if(this.data.songs.length >= this.data.total){
      wx.showToast({
        title: '已加载完毕',
        duration: 1000
      })
      return
    }
    let page = this.data.currentPage
    page++
    this.setData({
      currentPage: page
    })
    const tmp = this.data.searchInfo
    this.setData({
      listQuery: {
        keywords: tmp,
        limit: 20,
        offset: (this.data.currentPage - 1) * 20
      }
    })
    search(this.data.listQuery).then(res =>{
      if(res.code === 200){
        const tmpSongList = this.data.songs
        tmpSongList.push(...res.result.songs)
        this.setData({
          songs : tmpSongList,
          songsTotal: this.data.songs.length
        })
      }
    })
  },
  //播放歌曲
  play(e){
    const tmp ={
      id: e.currentTarget.dataset.id,
      title: e.currentTarget.dataset.name,
      singer: e.currentTarget.dataset.singer,
      coverImgUrl: e.currentTarget.dataset.image
    }
    app.globalData.playerList.unshift(tmp)
    wx.navigateTo({
      url: '../../pages/player/index'
    })
  },
  //一键添加全部歌单歌曲
  addToPlaylists(){
    const addSong = []
    this.data.songs.forEach(item =>{
      let tmp = {id: item.id,title:item.name,singer: item.ar[0].name,coverImgUrl:item.al.picUrl}
      addSong.push(tmp)
    })
    getApp().globalData.playerList.unshift(...addSong)
    wx.navigateTo({
      url: '../../pages/player/index'
    })
  },
  //点击清除搜索历史
  clickDeleteIcon(){
    if(wx.getStorageSync('search')){
      wx.removeStorageSync('search')
      this.setData({
        searchList: [],
        deleteVisable: true
      })
    }
  },
  //点击标签时搜索标签项
  clickTag(e){
    const tmp = e.currentTarget.dataset.name
    this.setData({
      listQuery: {
        keywords: tmp,
        limit: 20,
        offset: 0
      }
    })
    search(this.data.listQuery).then(res =>{
      if(res.code === 200){
        this.setData({
          currentPage: 1,
          songs : res.result.songs,
          songsTotal: res.result.songs.length,
          total: res.result.songCount,
          visable: false,
          searchInfo: e.currentTarget.dataset.name
        })
      }
    })
  }
})
