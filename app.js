const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = []; //用来保存所有的用户信息  
let usersNum = 0;

app.get('/', function(req, res) {
		res.sendFile(__dirname + '/login.html');
});

// io.on('connection', function(socket) {
// 		socket.broadcast.emit('hi');
// });

io.on('connection', function(socket) {
	usersNum++;
	console.log(`当前有${usersNum}个用户连接上服务器了`);
	socket.on("login", function(msg) {
			// msg.id = socket.id;
		users.push({  
            username: msg.username,  
            message: []  
        }); 
		console.log('id: ', socket.id);

		socket.emit('loginok', msg)
	})

	//io.emit，他是真正的广播到所有浏览器
	//socket.broadcast.emit则不会广播到自己的浏览器
	socket.on("sendMessage", function(data) {
		for(let _user of users){
			if(_user.username === data.username){
				_user.message.push(data.message);
				io.emit('receiveMessage', data);
				break;
			}
		}
	})

	socket.on('disconnect', () => { //注意，该事件不需要自定义触发器，系统会自动调用
		usersNum--;
		console.log(`当前有${usersNum}个用户连接上服务器了`);
	});	
});



//断开连接后做的事情  


http.listen(3000, function() {
		console.log('listening on *:3000');
});