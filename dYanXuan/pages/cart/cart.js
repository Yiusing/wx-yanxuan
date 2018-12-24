// pages/cart/cart.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSel:[],
    isAllSel:false,
    // list:[{price:389}],
    // count:1,
    // isActive:false,
    totalPrice:0,
    pduDetails:[],
    discount:0,
    balancePrice:0
  },
  selectPdu(e){
    let that = this;
    var i = e.target.dataset.currentindex;
    var isSel = that.data.isSel;
    var isAllSel = that.data.isAllSel;    
    if(i==-1){
      //i为-1时控制全选按钮
      for (var z = 0; z < isSel.length; z++) {
        isSel[z] = !isAllSel
      }
      isAllSel = !isAllSel
    } else {
      //i为其他时控制单个商品按钮
      isSel[i] = !isSel[i];
    }
    that.setData({
      isSel,
      isAllSel
    })
    //判断是否全选
    for (var j = 0, sum = 0,sumPrice=0; j < isSel.length; j++) {
      if (isSel[j]) {
        sum++
        //根据已经选择的商品来计算已选商品的总价格
        sumPrice +=that.countRowPrice(j);
      }
    }
    //计算已选商品的总价格
    that.showBalance(sumPrice)
    if (sum === isSel.length) {
      that.setData({
        isAllSel: true
      })
    } else {
      that.setData({
        isAllSel: false
      })
    }    
  },
  addCount(e){
    var id = e.target.dataset.id;
    var pduDetails = this.data.pduDetails;
    var c = pduDetails[id].count;
    c++;
    pduDetails[id].count=c;
    var n = 1;
    this.countTotal(id,n)
    this.setData({
      pduDetails
    })
    
  },
  reduceCount(e){
    var id = e.target.dataset.id;
    var pduDetails = this.data.pduDetails;
    var c = this.data.pduDetails[id].count;
    c--;
    if(c<1)return;
    pduDetails[id].count = c;
    var n = -1 ;
    this.countTotal(id,n)
    this.setData({
      pduDetails
    })
    
  },
  countTotal(id,n){
    var tP = parseFloat(this.data.totalPrice);
    var price = parseFloat(this.data.pduDetails[id].price);
    var disPrice = parseFloat(this.data.pduDetails[id].dicountPrice);
    var discount = parseFloat(this.data.discount);
    var balancePrice = parseFloat(this.data.balancePrice);
    var disSum =0;
    //判断当前价格
    var currentPrice;
    if(disPrice===0){
      currentPrice=price;
    }else{
      //计算优惠价格
      disSum = (price - disPrice)
      currentPrice=disPrice;
    }
    //计算总优惠价格
    discount += parseFloat(disSum * n)
    discount=discount.toFixed(2)
    //计算已选商品总价格
    //判断是否已选
    var isSel = this.data.isSel;
    if (isSel[id]){
      balancePrice += parseFloat(currentPrice * n);
      balancePrice = balancePrice.toFixed(2)
      this.setData({
        balancePrice
      })
    }
    //计算总价格
    tP += parseFloat(currentPrice * n);
    tP = tP.toFixed(2)
    this.setData({
      totalPrice: tP,
      discount
    })
  },
  countRowPrice(id){
    var c = this.data.pduDetails[id].count;
    var price = parseFloat(this.data.pduDetails[id].price);
    var disPrice = parseFloat(this.data.pduDetails[id].dicountPrice);
    var rowPrice =0,currentPrice=0;
    if (disPrice === 0) {
      currentPrice = price;
    } else {
      currentPrice = disPrice;
    }
    rowPrice = currentPrice * c;
    return rowPrice;
  },
  showCart(){
    //根据全局变量保存的信息显示出用户已经添加的商品
    var currentPrice=0,price=0,disPrice=0,sum=0,disSum=0;
    var isSel = this.data.isSel;
    var discount = this.data.discount;
    for (var i = 0;i<app.globalData.pduDetails.length;i++){
      //根据商品数量加入isSel变量的false个数
      isSel[i]=false
      //判断显示的总价格
      if (parseFloat(app.globalData.pduDetails[i].dicountPrice)===0){
        //如果没有特价，则计算原价
        currentPrice = app.globalData.pduDetails[i].price
      }else{
        //若有特价计算已优惠的价钱
        disSum += (app.globalData.pduDetails[i].price - app.globalData.pduDetails[i].dicountPrice) * app.globalData.pduDetails[i].count;
        //否则计算特价
        currentPrice = app.globalData.pduDetails[i].dicountPrice
      }
      sum += currentPrice * app.globalData.pduDetails[i].count
    }
    this.setData({
      pduDetails: app.globalData.pduDetails,
      totalPrice:sum.toFixed(2),
      discount:disSum.toFixed(2)
    })
  },
  balance(){
    wx.showModal({
      title: '提示',
      content: '抱歉，此功能暂未开放',
      showCancel:false,
      confirmText:"好的"
    })
  },
  showBalance(sum){
    sum = sum.toFixed(2)
    this.setData({
      balancePrice:sum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.showCart()
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