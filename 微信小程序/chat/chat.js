//index.js
//获取应用实例
const app = getApp()
var that
Page({
    data: {
      nameid:'',                  //临时名字
      jobid:'',                  //工作
      use: [],                  //临时小程序端话
      text:[],                 //显示页面
      img0:'',                //临时图片
      newslist: [{           //消息对象发送给服务器
        speaker: '客服',
        recipient: '客服',
        id:'',
        content: '欢迎',
        img:'',
        login:"true"
      }],
  },
 

  /*周期函数*/
  onLoad: function (a){
    var name1 = [];
    that = this
    that.setData({           //获取A页面的输入的名字
      nameid: a.id
    })
    var name1=[]
    var a = wx.getStorageSync('name')
    /*贮存名字*/
    for (var x in a) {
      if(this.data.nameid!=a[x]){
        name1.push(a[x])
      }
    }
    /*判断是否有聊天记录*/
    for (var x in a) {
      if (a[x] == this.data.nameid) {
        if (wx.getStorageSync(this.data.nameid) == '') {
          wx.showToast({
            title: '没有聊天记录',
          })
        } else {
          this.setData({
            newslist: wx.getStorageSync(this.data.nameid)
          })
        };
      }
    }
    name1.push(this.data.nameid)
    wx.setStorageSync("name",name1)
    
    var name={
      title:"唯一id",
      id:this.data.nameid,
      login:true
    }
    var nameJson=JSON.stringify(name)
    console.log(nameJson)
    this.socketstart(nameJson);          //链接
    this.pageScrollToBottom();
  },



  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },


  socketstart: function (e) {
    /*链接服务器*/
    wx.connectSocket({
      url: 'ws://localhost:3001',
      success (res) {
      }
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket 连接已打开！');

      wx.sendSocketMessage({
        data: e,             // 需要发送的内容
      });
      console.log(e)
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket 连接打开失败，请检查！');
    });

    /*接受消息*/
    wx.onSocketMessage(function (res) {
      that.receive(res.data);
    }),
    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！')
      wx.sendSocketMessage({
        data: e,             // 需要发送的内容
      });
    })
  },
  /*接受消息函数*/
  receive: function (e) {
    var message=JSON.parse(e)
    
    if(message.recipient==this.data.nameid){
      var obj={}
      obj.speaker = message.speaker
      obj.content = message.content
      if(message.img!=undefined){
        obj.img = message.img
      }else{
        obj.img = []
      }
      let newslist = that.data.newslist
      newslist.push(obj)
      that.setData({ newslist })
      wx.setStorageSync(this.data.nameid, this.data.newslist)
    }
  },
 
 //排队提醒
  receive2: function (d) {
    var a = d.indexOf(this.data.name);
    if (a != 0) {
      var obj = {}
      obj.speaker = "server"
      obj.content = "前方排队" + 1 + "人";
      let txt = that.data.txt
      txt.push(obj)
      that.setData({
        txt
      })
    }
  },
//接受在线用户数组
 receive3:function(d){
    wx.setStorageSync('haha', d)
 },


  //获取输入框的内容
  userInput: function (e) {
    this.setData({
      use: e.detail.value,
    });
  },
  emoj: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        // var a=tempFilePaths.endWith(".jpg")
        // var b=tempFilePaths.endWith(".png")
        // if(a==true||b==true){
          that.setData({
            img0: 'data:image/jpg;base64,'+wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
          });
        // }else{
        //   console.log("不是图片")
        // }

      }
    })
  },
 
  //事件处理函数
  send: function () {
    if (this.data.use == ""&&this.data.img0 == "") {
      wx.showToast({
        title: '消息不能为空哦',
      })
    } else {
      var obj={}
      obj.speaker=this.data.nameid
      obj.id=this.data.nameid
      obj.content=this.data.use
      obj.img=this.data.img0
      obj.login=false
      obj.recipient="客服"
      let newslist=that.data.newslist;
      newslist.push(obj)
      that.setData({ newslist })
      console.log(this.data.newslist)
      var newsjson = JSON.stringify(obj)
      wx.sendSocketMessage({
        data: newsjson,             // 需要发送的内容
        success: (res) => {
          wx.setStorageSync(this.data.nameid, this.data.newslist)
        },
      });
      this.setData({
        use: '',
        img0:''
      });
  }
},
  
  // 用户点击右上角分享
  onShareAppMessage: function () {

  },
  onShow:function(){
    wx.hideHomeButton({
      success:function(){
        console.log("OK")
      }
    })
  },
})