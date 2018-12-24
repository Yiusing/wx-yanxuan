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
    },
    // isActive: [],
    // count:1,
    showCart:false,
    pduDetails:[],
    specCurIndex:[]
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
      url: 'http://172.20.10.13:8080/index',
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
      url: 'http://172.20.10.13:8080/getRecommend',
      data:{pno,pageSize},
      success:res=>{
        var data = res.data.data.recommend;
        var recommend = that.data.recommend;
        console.log(data)
        if(res.data.code==2){
          that.setData({
            notMore:true
          })
        }else{
          var specCurIndex=that.data.specCurIndex;
          var isActive = that.data.isActive;
          for (var i = 0; i < data.length;i++){
            for(var j=0;j<data[i].product.length;j++){
              specCurIndex.push(0)
            }
          }
          that.setData({
            recommend: recommend.concat(data),
            pno,
            specCurIndex
          })
        }
      }
    })
  },
  addCount(e) {
    //添加商品数量
    var pduDetails = this.data.pduDetails;
    var c = pduDetails.count;
    c++;
    pduDetails.count = c;
    this.setData({
      pduDetails
    })
  },
  reduceCount(e) {
    //减少商品数量
    var pduDetails = this.data.pduDetails;
    var c = pduDetails.count;
    c--;
    if (c < 1) return;
    pduDetails.count = c;
    this.setData({
      pduDetails
    })
  },
  showBmCart(e){
    //获取对应商品的id
    var pid = e.target.dataset.pid;
    //发送请求获取对应pid的商品信息
    var showCart = this.data.showCart;
    var pduDetails = this.data.pduDetails;
    wx.request({
      url: 'http://172.20.10.13:8080/getPduDetails',
      data:{pid},
      success:res=>{
        this.setData({
          pduDetails:res.data.data[0]
        })
      }
    })
    this.setData({
      showCart: true
    })
  },
  hideMask(){
    this.setData({
      showCart: false
    })
  },
  activeSpec(e){
    var index = e.target.dataset.index;
    var specCurIndex = this.data.specCurIndex;
    var pid = parseInt(this.data.pduDetails.pid)
    specCurIndex[pid-1]=index;
    if(index===undefined)return;
    this.setData({
      specCurIndex
    })
  },
  putCart() {
    //图片 title 规格 价格 数量
    var that = this;
    //获取当前所选的规格
    var specCurIndex = that.data.specCurIndex;
    //获取当前商品详情
    var pduDetails = that.data.pduDetails;
    if(pduDetails.spec===undefined){
      wx.showToast({
        title: '添加失败~',
        icon:"none",
        duration:1000,
        success(){
          that.setData({
            showCart: false
          })
          setTimeout(function(){
            wx.hideToast()
          },1000)       
        }
      })
      return;
    }
    //设置默认发送商品信息
    var pduList = {
      img_url:"",
      title:"",
      dicountPrice:0,
      price:0,
      spec: { title: "", details:""},
      count:1
    };
    //设置添加的商品信息并且保存在全局变量pduDetails中
    pduList.pid = pduDetails.pid;
    pduList.img_url = pduDetails.img_url;
    pduList.title = pduDetails.title;
    pduList.dicountPrice = pduDetails.dicountPrice;
    pduList.price = pduDetails.price;
    pduList.spec.title = pduDetails.spec.title
    pduList.spec.details = pduDetails.spec.details[specCurIndex[pduDetails.pid - 1]];
    //获取当前数量
    var count = that.data.pduDetails.count;
    //判断全局变量中是否已经存在同商品同规格的商品
    var global = app.globalData.pduDetails
    if(global.length<1){
      pduList.count = count;
      global.push(pduList)
    }else{
      var hasSame=false;
      for(var i=0;i<global.length;i++){
        //若购物车已经存在相同规格和相同id的商品，则改为修改数量，若不存在则添加
        if (pduDetails.pid == global[i].pid && pduDetails.spec.details[specCurIndex[[pduDetails.pid - 1]]] == global[i].spec.details){ 
          pduList.count=count+global[i].count
          //替换数量
          global[i]=pduList;
          hasSame=true;
          break;
        }
      }
      if(!hasSame){      
        pduList.count = count;
        //添加商品到购物车
        global.push(pduList)
      }
    }
    wx.showToast({
      title: '已加入购物车~!',
      icon:"none",
      duration:1000,
      success(){
        that.setData({
          showCart: false
        })
        setTimeout(function(){
          wx.hideToast();
        },1000)
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