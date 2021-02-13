// pages/profile/index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  watchBack: function (value) { //这里的value 就是 app.js 中返回整个 globalData
    this.setData({
      userInfo: value.userInfo
    });
  },
  //获取手机相册照片后，上传图片到服务器
  showPic() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res => {
        wx.showLoading({
          title: '正在上传中',
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        //获取图片
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: (res => {
            const imgWidth = res.width
            //通过临时文件路径获取二进制文件给服务端上传文件
            wx.uploadFile({
              url: 'http://82.156.71.207:3000/avatar/upload', //服务器API接口路径 
              filePath: tempFilePaths[0], //要上传文件资源的路径 String类型 
              name: 'imgFile', //服务端文件属性名称
              header: {
                "Content-Type": "multipart/form-data"
              },
              formData: {
                cookie: app.globalData.cookie, //cookie
                imgSize: imgWidth,
                timestamp: Date.now()
              },
              success: ((res) => {
                if (res.statusCode === 200) {
                  if (app.globalData.userInfo) {
                    const tmp = app.globalData.userInfo
                    tmp.avatarUrl = JSON.parse(res.data).data.url
                    app.globalData.data = {
                      'userInfo': Object.assign({}, tmp)
                    }
                  }
                  wx.hideLoading()
                }
              })
            })
          })
        })

      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //启用监听回调，监听全局变量中currSong的变化，变化后，改变子页面的currSong
    getApp().watch(this.watchBack)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
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