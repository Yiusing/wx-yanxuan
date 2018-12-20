// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems:["为您推荐","冬季专区","爆品专区","新品专区","居家","鞋包配饰","服装","电器","饮食","文具"],
    navIndex:0,
    res:[]
  },
  tapJump(e){
    let that = this;
    var index = e.target.dataset.index;
    that.setData({
      navIndex:index,
    })
 
    
  },
  getDetails(){
    wx.request({
      url: 'http://localhost:8080/category',
      success:res=>{
        console.log(res.data)
        this.setData({
          res:res.data.data.ctgList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetails();
  
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