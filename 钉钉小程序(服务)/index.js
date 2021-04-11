const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
    port: 3000
});
wss.on('connection', function (ws) {

    console.log(`1个已连接`);
    // console.log(ws.readyState);
    
    ws.on('message', function (message) {
        console.log(message)
        wss.clients.forEach(function (client) {
            /*发送全部*/
            // if (client.readyState === WebSocket.OPEN) {
            //     console.log(client.readyState)
            //     client.send(message);
            // }

            /*除了自己发送全部*/
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
          });

        // var messagejson=JSON.parse(message)//json转化JavaScript
        // if(messagejson.speaker=="客服"){
        //     console.log('客服说: '+message)
            
        // }else{
        //     console.log('用户说：'+message)
        //     ws.send(message)
        // }
        
    });
});
console.log('正在监听 3000...');

