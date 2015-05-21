var gpio = require("pi-gpio");

var io = require('socket.io-client');
var socket = io.connect("http://slushasaservice.azurewebsites.net",{reconnect:true});

var intervalHolder;

function output(value, callback){
    gpio.open(7,"output",function(err){
            gpio.write(7,value,function(){
                gpio.close(7);
                if(callback){
                    callback();
                }
            });
    });
}

socket.on("connect", function(socket){
   socket.on("event",function(data){
       switch(data.action){
			case "start":
				output(1,function(){
                          clearTimeout(intervalHolder);
                          intervalHolder = setTimeout(function(){
                                output(0);
                                socket.broadcast.emit('event', {"action":"status","status":"stop"}); 
                          },data.time*60*1000);
                 });
                 socket.broadcast.emit('event', {"action":"status","status":"start","time":data.time}); 
			break;
			case "stop":
                clearTimeout(intervalHolder);
				output(0);
				socket.broadcast.emit('event', {"action":"status","status":"stop"}); 
			break;
       }
   });
});
