// pages/playlist/index.js
import {hotplaylistSort} from '../../api/playlist'
import {getHotPlaylist} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    hotsort: [],
    playlist: [],
    listQuery:{
      order: 'hot',
      limit: 12,
      offset: 0,
      cat: ''
    }
  },
  //切换tab时
  onTabChange(e){
    switch(e.detail.name){
      case 0:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '华语'
          }
        })
        this.getHotPlaylist()
        break
      case 1:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '流行'
          }
        })
        this.getHotPlaylist()
        break
      case 2:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '摇滚'
          }
        })
        this.getHotPlaylist()
        break
      case 3:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '民谣'
          }
        })
        this.getHotPlaylist()
        break
      case 4:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '电子'
          }
        })
        this.getHotPlaylist()
        break
      case 5:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '另类/独立'
          }
        })
        this.getHotPlaylist()
        break
      case 6:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '轻音乐'
          }
        })
        this.getHotPlaylist()
        break
      case 7:
        this.setData({
          listQuery:{
            order: 'hot',
            limit: 12,
            offset: 0,
            cat: '综艺'
          }
        })
        this.getHotPlaylist()
        break
        case 8:
          this.setData({
            listQuery:{
              order: 'hot',
              limit: 12,
              offset: 0,
              cat: '影视原声'
            }
          })
          this.getHotPlaylist()
          break
        case 9:
          this.setData({
            listQuery:{
              order: 'hot',
              limit: 12,
              offset: 0,
              cat: 'ACG'
            }
          })
          this.getHotPlaylist()
    }
  },
  getHotPlaylistSort(){
    hotplaylistSort().then(res =>{
      if(res.code === 200){
        this.setData({
          hotsort: res.tags
        })
      }
    })
  },
  getHotPlaylist(){
    getHotPlaylist(this.data.listQuery).then(res =>{
      if(res.code === 200){
        this.setData({
          playlist: res.playlists
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getHotPlaylistSort()
    this.getHotPlaylist()
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