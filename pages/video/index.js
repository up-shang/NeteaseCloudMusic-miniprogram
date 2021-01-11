// pages/video/index.js
import {getVideo, getVideoUrl} from '../../api/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    currentPage: 1,
    active: 1,
    audioImg: '../../static/audio.png',
    videoImg: '../../static/video-active.png',
    listQuery: {
      order: '最新',
      area:'港台',
      limit: 20,
      offset: 0
    }
  },
  //获得MV信息
  getVideo(){
    getVideo(this.data.listQuery).then(res =>{
      if(res.code === 200){
        const tmp = res.data.map(item =>{
          if(item.name.length > 20){
            item.name = item.name.substr(0,36)+'...'
          }
          return item
        })
        this.setData({
          videoList: tmp
        })
      }
    })
  },
  //获取mv播放url
  getVideoUrl(id){
    const param = {id: id}
    getVideoUrl(param).then(res =>{
      if(res.code === 200){
        this.setData({
          url: res.data.url
        })
      }
    })
  },
  //播放视频
  async play(e){
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    const param = {id: id}
    await getVideoUrl(param).then(res =>{
      if(res.code === 200){
        getApp().globalData.videoUrl = res.data.url
      }
    })
    //跳转播放器页面
    wx.navigateTo({
      url: '../videoDetail/index?title='+name,
    })
  },
  //切换tabbar时触发
  onTabbarChange(event){
    if(event.detail === 1){
      console.log('进入1')
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
        url: '../index/index',
      })
    }
    this.setData({ active: event.detail });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.currentPage
    page++
    this.setData({
      currentPage: page
    })
    this.setData({
      listQuery: {
        order: '最新',
        area:'港台',
        limit: 20,
        offset: (this.data.currentPage - 1) * 20
      }
    })
    getVideo(this.data.listQuery).then(res =>{
      if(res.code === 200){
        const tmp = res.data.map(item =>{
          if(item.name.length > 20){
            item.name = item.name.substr(0,36)+'...'
          }
          return item
        })
        const tmpList = this.data.videoList
        tmpList.push(...tmp)
        this.setData({
          videoList: tmpList
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})