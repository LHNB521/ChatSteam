
var that
Page({
  data: {
    nameid:'',
    jobid:'',
    use: [],
    text:[],
    newslist: [{
      speaker: '客服',
      id:'',
      content: '欢迎'
    }],
  },

  onLoad: function () {
    that=this
    this.start();
    var id=dd.getStorageSync({key:'id'})
    var name1=id.data.Name
    var job1=id.data.Jobid
    //console.log(name1)
    this.setData({
      nameid:name1,
      jobid:job1
    })
    console.log(this.data.nameid)
    // if (dd.getStorageSync({ key: 'chat' }).data == '') {
    //   dd.showToast({
    //     content: '没有聊天记录',
    //   })
    // } else {
    //   this.setData({
    //     newslist: dd.getStorageSync({ key: 'chat' }).data
    //   })
    // };
  },


  /*socket链接走起--*/
  start: function () {
    /*链接服务器*/
    dd.connectSocket({
      url: 'ws://localhost:3000'
    });
    dd.onSocketOpen(function (res) {
      console.log('WebSocket 连接已打开！');
    });
    dd.onSocketError(function (res) {
      console.log('WebSocket 连接打开失败，请检查！');
    });
    /*接受消息*/
    dd.onSocketMessage(function (res) {
      //console.log('收到服务器内容：' + res.data)
      that.receive(res.data);
    })
  },
  receive: function (e) {
    console.log(e)
    var message=JSON.parse(e)
    //console.log(message)
    var obj={}
    obj.speaker = message.speaker
    obj.id=""
    obj.content = message.content
    let newslist = that.data.newslist
    newslist.push(obj)
    that.setData({ newslist })
    //console.log(this.data.newslist)
    dd.setStorageSync({
      key: 'key',
      data: this.data.newslist
    });
  },


  //获取输入框的内容
  userInput: function (e) {
    this.setData({
      use: e.detail.value,
    });
  },

  //事件处理函数
  send: function () {
    if (this.data.use == "") {
      dd.showToast({
        content: '消息不能为空哦',
      })
    } else {
      var obj={}
      obj.speaker=this.data.nameid
      obj.id=this.data.jobid
      obj.content=this.data.use
      let newslist=that.data.newslist;
      newslist.push(obj)
      that.setData({ newslist })
      //console.log(this.data.newslist)

      var newsjson = JSON.stringify(obj)
      dd.sendSocketMessage({
        data: newsjson, // 需要发送的内容
        success: (res) => {
          dd.setStorageSync({
            key: 'key',
            data: this.data.newslist
          });
        },
      });
      
      this.setData({
        use: ''
      });
    }
  },


})