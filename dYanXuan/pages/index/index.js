//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNav: ['首页', '冬日特惠', '圣诞限定', '大柑推荐'],
    navIndex:0,
    pageSize:3,
    pno:0,
    notMore:false,
    recommend:[],
    imgList:[],
    nav:[],
    loading:{
      title:"正在努力加载...."
    }
    
  },
  goTo(e){
    let that = this;
    var i = e.target.dataset.index;
    that.setData({
      navIndex:i
    })
  },
  getIndexImg(){
    wx.request({
      url: 'http://localhost:8080/index',
      success:res=>{
        this.setData({
          imgList:res.data.imgList,
          nav:res.data.nav
        })
      }
    })
  },
  getMore(){
    //获取推荐商品信息
    let that = this;
    var pno = that.data.pno + 1;
    var pageSize = that.data.pageSize;
    wx.request({
      url: 'http://localhost:8080/getRecommend',
      data:{pno,pageSize},
      success:res=>{
        var recommend = that.data.recommend;
        if(res.data.code==2){
          that.setData({
            notMore:true
          })
        }else{
          that.setData({
            recommend:recommend.concat(res.data.data.recommend),
            pno:pno
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getIndexImg();
    that.getMore();
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
    let that= this;
    if(!that.data.notMore){
      that.getMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})