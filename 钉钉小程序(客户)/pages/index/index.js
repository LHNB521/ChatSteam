// import * as didi from 'dingtalk-jsapi';
var jobid;
var that
Page({
  data: {
    message: "进入客服会话",
    text:[{
      name:'',
      id:''
      }],
  },
  onLoad: function () {
    that=this
    dd.getAuthCode({
      success: (res) => {
        var code = res.authCode;
        dd.httpRequest({
          url: "https://oapi.dingtalk.com/gettoken?appkey=dingvoqk27zuwuqfbotk&appsecret=Zse87PEtkLi_J3CXhgXUWfiHZOQYQ9doWVIBKt4RSoldiarEE0m1shDq17ey9Uqy",
          success: function (res) {
            var access_token = res.data.access_token;
            dd.httpRequest({
              url: 'https://oapi.dingtalk.com/user/getuserinfo?access_token=' + access_token + '&code=' + code,
              success: function (res) {
                var userid=res.data.userid;
                dd.httpRequest({
                  url: 'https://oapi.dingtalk.com/user/get?access_token=' + access_token+'&userid=' + userid,
                  success: function (res) {
                    jobid=res.data.jobnumber;
                    name=res.data.name;
                    //console.log(jobid)
                    //console.log(name)
                    dd.setStorageSync({
                      key: 'id',
                      data: {
                        Name: name,
                        Jobid: jobid,
                      }
                    });
                  },
                });
              },
            });
          }
        })
      },
      fail: (err) => {
        dd.alert({ content: JSON.stringify(err) })
      }
    })
    this.welcome();
  },

  welcome: function(e){
    let jsonid=dd.getStorageSync({ key: 'id' });
    var name1=jsonid.data.Name
    var jobid1=jsonid.data.Jobid
    didi.ready(function () {
      didi.device.notification.confirm({
        message: "您的信息将会被记录哦！",
        title: "❤"+"欢迎"+name1+"❤",
        onSuccess: function (result) {
          var obj={}
          obj.name=name1;
          obj.id=jobid1;
          let text=that.data.text;
          text.push(obj)
          that.setData({
            text
          })
          console.log(that.data.text)
        },
        onFail: function (err) { }
      });
    });


    
  },
  
  chat: function (options) {
    dd.redirectTo({
      url: '../chat/chat'
    })
  },
});
