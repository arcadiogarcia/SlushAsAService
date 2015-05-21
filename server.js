var http = require('http');
var io = require('socket.io');

var server = http.createServer(function(req,res){
	res.writeHead(404,{'Content-Type':'text/html'});
	res.end('Ooops you shouldnt be here...');
});

server.listen(8080);
io = io.listen(server);

io.sockets.on('connection', function(socket){
	console.log("Client disconnected");
	socket.on('event', function (data) { 
		switch(data.action){
			case "start":
				console.log("Start order:");
				console.log(data);
				socket.broadcast.emit('event', data); 
			break;
			case "stop":
				console.log("Stop order:");
				console.log(data);
				socket.broadcast.emit('event', data); 
			break;
			case "status":
				console.log("Raspberry status:");
				console.log(data);
				socket.broadcast.emit('event', data); 
			break;
		}
	});
	socket.on('disconnect',function(){
		console.log("Client disconnected");
	});
});