// pages/player/index.js
import {getSongUrl, getLyric} from '../../api/player'
const app = getApp()
let timeId ='' //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    player: null,
    playerList: [],
    songId: '',
    song: [],
    lyric: [],
    currentLyric: '',
    currentIndex: 0,
    title: '',
    singer: '',
    coverImgUrl: '',
    slider: 0,
    isHidden: false,
    popupShow: false,
    currTime: 0,
    currFormatTime: '00:00',
    totalFormatTime: '00:00',
    home: ''
  },
  play(id){
    const param = {id: id}
    getSongUrl(param).then(res =>{
      if(res.code === 200){
        this.setData({
          song: res.data[0].url
        })
        this.data.player.title = this.data.title
        this.data.player.singer = this.data.singer
        this.data.player.coverImgUrl = this.data.coverImgUrl
        this.data.player.src = this.data.song
        //把数据给首页迷你播放器
        const tmp = {
          id: this.data.songId,
          title: this.data.title,
          singer: this.data.singer,
          coverImgUrl: this.data.coverImgUrl
        }
        app.globalData.data = {
          'currSong': Object.assign({},tmp)
        }
      }
    })
    this.data.player.play()
    this.getLyric(this.data.songId)
    this.playProgress()
    this.onStop()
    this.onPlay()
    this.onEnded()
  },
  //歌曲停止后
  onStop(){
    this.data.player.onStop(()=>{
      this.setData({
        isHidden: !this.data.isHidden
      })
      app.globalData.data = {
        'currSong': {}
      }
    })
  },
  //歌曲播放中
  onPlay(){
    //获得总时长
    this.data.player.onPlay(()=>{
      this.setData({
        totalFormatTime: this.formatTime(this.data.player.duration)
      })
    })
  },
  //设置当前播放歌曲
  setCurrSong(index){
    this.setData({
      songId: this.data.playerList[index].id,
      title: this.data.playerList[index].title,
      singer: this.data.playerList[index].singer,
      coverImgUrl: this.data.playerList[index].coverImgUrl
    })
    //把数据给首页迷你播放器
    const tmp = {
      id: this.data.playerList[index].id,
      title: this.data.playerList[index].title,
      singer: this.data.playerList[index].singer,
      coverImgUrl: this.data.playerList[index].coverImgUrl
    }
    app.globalData.data = {
      'currSong': Object.assign({},tmp)
    }
  },
  //歌曲播放完后
  onEnded(){
    this.data.player.onEnded(()=>{
      let index = this.getCurrentSongIndex()
      if(index+1 < this.data.playerList.length){
        index++
        this.setCurrSong(index)
      }else{
        index = 0
        this.setCurrSong(index)
      }
      this.play(this.data.songId)
    })
  },
  //获取歌词
  getLyric(id){
    const param = {id: id}
    getLyric(param).then(res =>{
      if(res.code === 200){
        this.setData({
          lyric: this.parseLyric(res.lrc.lyric)
        })
      }
    })
  },
  parseLyric(lyric) {
    let lines = lyric.split('\n');
    //let pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
    let result = [];
    // while (!pattern.test(lines[0])) {
    //   lines = lines.slice(1);
    // }
    lines[lines.length - 1].length === 0 && lines.pop();
    for (let data of lines) {
      let index = data.indexOf(']');
      let time = data.substring(0, index + 1);
      let value = data.substring(index + 1);
      let timeString = time.substring(1, time.length - 2);
      let timeArr = timeString.split(':');
      result.push([parseInt(timeArr[0], 10) * 60 + parseFloat(timeArr[1]), value]);
    }
    result.sort(function(a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //格式化歌曲时长，以及当前时间
  formatTime(time){
    let tmpmin = parseInt(time / 60).toString()
    let tmpsec = parseInt(time % 60).toString()
    let min = tmpmin.length === 1 ? '0'+ tmpmin : tmpmin 
    let sec = tmpsec.length === 1 ? '0'+ tmpsec : tmpsec
    return (min +':'+ sec)
  },
  //已启动后
  player(){
    if(this.data.isHidden === false){
      this.data.player.pause()
      this.setData({
        isHidden: true
      })
    }else{
      //如果手动中止背景音乐，则重新给src
      if(this.data.player.src === ''){
        this.play(this.data.songId)
      }
      this.data.player.play()
      this.setData({
        isHidden: false
      })
    }
  },
  //展示播放进度
  playProgress(){
    this.data.player.onTimeUpdate(()=>{
      const slider = (100/this.data.player.duration)*this.data.player.currentTime
      this.setData({
        slider: slider
      })
      this.setData({
        currTime: this.data.player.currentTime,
        currFormatTime: this.formatTime(this.data.player.currentTime)
      })
    })
  },
  //设置歌词
  setLyric(){
    timeId = setInterval(()=>{
      for(let i=0;i< this.data.lyric.length -1; i++){
        if(this.data.isHidden) return
        if(this.data.lyric[i][0] - 1 < this.data.player.currentTime && this.data.player.currentTime < this.data.lyric[i+1][0] -1){
          this.setData({
            currentLyric: this.data.lyric[i][1]
          })
        }
      }
    },500)
  },
  //拖动进度条后同步更新背景音乐当前播放时间
  drag(e){
    setTimeout(()=>{
      const playbar = e.detail.value
      const currentTime = playbar * (this.data.player.duration / 100)
      this.data.player.seek(currentTime)
    })
  },
  //点击进度条后同步更新背景音乐当前播放时间
  progressChange(e){
    setTimeout(()=>{
      const playbar = e.detail
      const currentTime = playbar * (this.data.player.duration / 100)
      this.data.player.seek(currentTime)
    })
  },
  clickList(){
    this.setData({
      popupShow: !this.data.popupShow
    })
  },
  //点击弹出层的遮罩层时关闭弹出层
  onOverlay(){
    this.setData({
      popupShow: !this.data.popupShow
    })
  },
  //点击切换歌曲
  swicthSong(e){
    if(e.currentTarget.dataset.name === 'forward'){
      //如果暂停状态切换歌曲，则改变按钮状态为正在播放
      if(this.data.isHidden === true){
        this.setData({
          isHidden: false
        })
      }
      let index = this.getCurrentSongIndex()
      if(index < this.data.playerList.length - 1){
        index++
        this.setCurrSong(index)
      }else{
        index = 0
        this.setCurrSong(index)
      }
      this.play(this.data.songId)
    }else{
      if(this.data.isHidden === true){
        this.setData({
          isHidden: false
        })
      }
      let index = this.getCurrentSongIndex()
      if(index > 0){
        index--
        this.setCurrSong(index)
      }else{
        index = this.data.playerList.length - 1
        this.setCurrSong(index)
      }
      this.play(this.data.songId)
    }
  },
  //获取当前播放歌曲的index
  getCurrentSongIndex(){
    let songIndex = 0
    for(let i=0; i< this.data.playerList.length;i++){
      if(this.data.songId == this.data.playerList[i].id){
        songIndex = i
      }
    }
    return songIndex
  },
  // watch:{
  //   currTime:function(newValue){
  //     //console.log(newValue); // name改变时，调用该方法输出新值。
  //     for(let i=0;i< this.data.lyric.length -1; i++){
  //       if(this.data.isHidden) return
  //       if(this.data.lyric[i][0] < this.data.player.currentTime && this.data.player.currentTime < this.data.lyric[i+1][0]){
  //         console.log('进来了')
  //         this.setData({
  //           currentLyric: this.data.lyric[i][1]
  //         })
  //         console.log(this.data.currentLyric)
  //       }
  //     }
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保持屏幕常亮 true / false
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    // 设置监听器，监听数据变化
    // getApp().setWatcher(this);
    //获取手机高度
    this.setData({
      height: wx.getSystemInfoSync().windowHeight + 'px',
      player: wx.getBackgroundAudioManager()
    })
    //接收歌曲的专辑封面，url，等,非播放状态下,从迷你播放器进入播放器内
    if(options.from && options.from === 'home'){
      if(this.data.player.paused){
        //如果暂时则先恢复进度条，当前播放时间等
        const slider = (100/this.data.player.duration)*this.data.player.currentTime
        this.setData({
          slider: slider,
          currFormatTime: this.formatTime(this.data.player.currentTime),
          isHidden: !this.data.isHidden
        })
      }
      this.setData({
        home: options.from,
        songId: options.songId,
        playerList: app.globalData.playerList
      })
      //一定先给playlist与songId,不然无法拿到index
      let index = this.getCurrentSongIndex()
      this.setData({
        songId: this.data.playerList[index].id,
        title: this.data.playerList[index].title,
        singer: this.data.playerList[index].singer,
        coverImgUrl: this.data.playerList[index].coverImgUrl
      })
      this.playProgress()
      this.getLyric(this.data.songId)
      this.onEnded()
      this.onStop()
      this.setData({
        totalFormatTime: this.formatTime(this.data.player.duration)
      })
    }else{
      const playerList = app.globalData.playerList
      this.setData({
        playerList: app.globalData.playerList,
        songId: playerList[0].id,
        title: playerList[0].title,
        singer: playerList[0].singer,
        coverImgUrl: playerList[0].coverImgUrl
      })
      this.play(this.data.songId)
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
    this.setLyric()
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
    //销毁定时器
    clearInterval(timeId)
    // 去除屏幕常亮 true / false
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
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