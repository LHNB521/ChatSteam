var message = {
    speaker: "客服",
    id: "",
    content:""
};
var speaker='',id='',content='';
const ws = new WebSocket('ws://localhost:3000');
/**
 * 链接websocket并发送和监听
 */
function connect(){
    ws.onopen = function () {
        console.log(`已打开链接`)
    }

    ws.onclose=function(){
        console.log("链接已关闭...");
        connect();
    }

    //接受函数
    function jieshou(){
        ws.onmessage = function(res){
            //消息渲染到页面上
            showMessage(res.data);
        }
    };
    jieshou();
}
connect();//创建链接实例

/**
 * 接受消息渲染消息函数
 */
function showMessage(str) {
    var speaker0=JSON.parse(str).speaker;//发言者
    var content0=JSON.parse(str).content;//发言内容
    var div = document.createElement('div');//创建一个div
    var chat = document.getElementById('chat');

    div.innerHTML = speaker0+"说："+content0;   //显示
    chat.appendChild(div);//在chat中显示这个div
}

/**
 * 获取input框的输入值函数
 * 点击发送事件
 */
function send(){
    document.getElementById('send').onclick = function(){

        var text=document.getElementById('text').value;
        message.speaker="客服";
        message.content=text;//输入内容
        var messagejson=JSON.stringify(message);
        console.log(messagejson);
        ws.send(messagejson);
        showMessage(messagejson);
    }
}
send();

    

