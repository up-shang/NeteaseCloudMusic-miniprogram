import {
  getPlayList,getHotPlaylist
} from '../../api/index'
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    active: 0,
    audioImg: '../../static/audio-active.png',
    videoImg: '../../static/video.png',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    upImgUrl: '',
    upListForHome: [],
    newImgUrl: '',
    newListForHome: [],
    originalImgUrl: '',
    originalListForHome: [],
    hotList: [],
    hotListForHome: [],
    listQuery:{
      order: 'hot',
      limit: 20,
      offset: 0
    },
    currSong: {},
    isPause: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  watchBack: function (value) {  //这里的value 就是 app.js 中返回整个 globalData
    this.setData({
      currSong: value.currSong
    });
  },
  onLoad: function () {
    this.getHotList()
    this.getUpList()
    this.getNewList()
    this.getOriginalList()
    //启用监听回调，监听全局变量中currSong的变化，变化后，改变子页面的currSong
    getApp().watch(this.watchBack)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //已启动后
  play(){
    if(wx.getBackgroundAudioManager().paused){
      this.setData({
        isPause: false
      })
      wx.getBackgroundAudioManager().play()
    }else{
      wx.getBackgroundAudioManager().pause()
      this.setData({
        isPause: true
      })
    }
  },
  //转到player页面
  toPlayer(){
    wx.navigateTo({
      url: '../../pages/player/index?songId='+this.data.currSong.id +'&from='+'home'
    })
  },
  onShow(){
    //如果停止则改变迷你播放器按钮状态
    wx.getBackgroundAudioManager().onStop(()=>{
      this.setData({
        isPause: true,
        currSong: {}
      })
      app.globalData.currSong = {}
    })
    if(wx.getBackgroundAudioManager().paused === undefined){
      this.setData({
        currSong: {}
      })
      return
    }
    //如果播放器已暂停，改变按钮状态后直接return
    if(wx.getBackgroundAudioManager().paused){
      this.setData({
        isPause: true,
        currSong: app.globalData.currSong
      })
      return
    }
    this.setData({
      isPause: false,
      currSong: app.globalData.currSong
    })
  },
  onTabbarChange(event){
    if(event.detail === 1){
      this.setData({
        audioImg: '../../static/audio.png',
        videoImg: '../../static/video-active.png'
      })
      wx.redirectTo({
        url: '../video/index',
      })
    }else{
      this.setData({
        audioImg: '../../static/audio-active.png',
        videoImg: '../../static/video.png'
      })
      wx.redirectTo({
        url: './index',
      })
    }
    this.setData({ active: event.detail });
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取热门歌单
  getHotList(){
    getHotPlaylist(this.data.listQuery).then(res =>{
      if(res.code === 200){
        this.setData({
          hotList: res.playlists,
          hotListForHome: res.playlists.slice(0,5)
        })
      }
    })
  },
  //加载更多歌单
  clickMore(){
    wx.navigateTo({
      url: '../../pages/playlist/index',
    })
  },
  //点击首页热门歌单列表
  clickHomePlaylist(e){
    wx.navigateTo({
      url: '../../pages/playlistDetail/index?id='+e.currentTarget.dataset.id,
    })
  },
  //获得飙升榜歌单详情
  getUpList() {
    const param = {
      id: '19723756'
    }
    getPlayList(param).then(res => {
      if (res.code === 200) {
        this.setData({
          upImgUrl: res.playlist.coverImgUrl,
          upListForHome: res.playlist.tracks.slice(0, 3)
        })
      }
    })
  },
  //获得新歌榜歌单详情
  getNewList() {
    const param = {
      id: '3779629'
    }
    getPlayList(param).then(res => {
      if (res.code === 200) {
        this.setData({
          newImgUrl: res.playlist.coverImgUrl,
          newListForHome: res.playlist.tracks.slice(0, 3)
        })
      }
    })
  },
  //获得原创榜歌单详情
  getOriginalList() {
    const param = {
      id: '2884035'
    }
    getPlayList(param).then(res => {
      if (res.code === 200) {
        this.setData({
          originalImgUrl: res.playlist.coverImgUrl,
          originalListForHome: res.playlist.tracks.slice(0, 3)
        })
      }
    })
  },
  //点击首页榜单时
  clickRankList(e){
    switch(e.currentTarget.dataset.id){
      case '19723756':
        wx.navigateTo({
          url: '../../pages/playlistDetail/index?id=19723756',
        })
        break
      case '3779629':
        wx.navigateTo({
          url: '../../pages/playlistDetail/index?id=3779629',
        })
        break
      case '2884035':
        wx.navigateTo({
          url: '../../pages/playlistDetail/index?id=2884035',
        })
    }
  },
  //点击搜索框跳转到搜索详情页
  clickSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  }
})