var gpio = require("pi-gpio");

var io = require('socket.io-client');
var socket = io.connect("http://slushasaservice.azurewebsites.net",{reconnect:true});

socket.on("connect", function(socket){
   socket.on("event",function(data){
       
   });
});

console.log("started");
gpio.open(7,"output",function(err){
	console.log("opened");
    gpio.write(7,1,function(){
		console.log("1");
       setTimeout(function(){
       gpio.write(7,0, function(){
		console.log("0");
       gpio.close(7);
	   console.log("closed");
       });
	},1000);
       });
});
