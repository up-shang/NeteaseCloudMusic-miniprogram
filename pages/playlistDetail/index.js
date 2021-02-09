// pages/playlistDetail/index.js
import {
  getPlaylistDetail
} from '../../api/playlistDetail'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: [],
    songsImg: '',
    songsText: '',
    songsDesc: '',
    songsTotal: 0
  },
  //获取歌单详情列表
  getPlaylistDetail(id) {
    const param = {
      id: id
    }
    getPlaylistDetail(param).then(res => {
      if (res.code === 200) {
        console.log(res)
        this.setData({
          songs: res.playlist.tracks,
          songsImg: res.playlist.coverImgUrl,
          songsText: res.playlist.name,
          songsDesc: res.playlist.description.substr(0, 15)
        })
        this.setData({
          songsTotal: this.data.songs.length
        })
      }
    })
  },
  //播放歌曲
  play(e) {
    const tmp = {
      id: e.currentTarget.dataset.id,
      title: e.currentTarget.dataset.name,
      singer: e.currentTarget.dataset.singer,
      coverImgUrl: e.currentTarget.dataset.image
    }
    getApp().globalData.playerList.unshift(tmp)
    wx.navigateTo({
      url: '../../pages/player/index'
    })
  },
  //一键添加全部歌单歌曲
  addToPlaylists() {
    const addSong = []
    this.data.songs.forEach(item => {
      let tmp = {
        id: item.id,
        title: item.name,
        singer: item.ar[0].name,
        coverImgUrl: item.al.picUrl
      }
      addSong.push(tmp)
    })
    getApp().globalData.playerList.unshift(...addSong)
    wx.navigateTo({
      url: '../../pages/player/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaylistDetail(options.id)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})