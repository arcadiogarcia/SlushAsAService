var gpio = require("pi-gpio");

var io = require('socket.io-client');
var socket = io.connect("http://slushasaservice.azurewebsites.net",{reconnect:true});

var intervalHolder;

function output(value, callback){
    gpio.open(7,"output",function(err){
            gpio.write(7,value,function(){
                console.log("Pin 7 set to "+value);
                gpio.close(7);
                if(callback){
                    callback();
                }
            });
    });
}

   socket.on("event",function(data){
       switch(data.action){
			case "start":
                console.log("Start signal:");
                console.log(data);
				output(1,function(){
                          clearTimeout(intervalHolder);
                          intervalHolder = setTimeout(function(){
                                output(0);
                                socket.broadcast.emit('event', {"action":"status","status":"stop"}); 
                          },data.time*60*1000);
                 });
                 socket.emit('event', {"action":"status","status":"start","time":data.time}); 
			break;
			case "stop":
                console.log("Stop signal:");
                console.log(data);
                clearTimeout(intervalHolder);
				output(0);
				socket.emit('event', {"action":"status","status":"stop"}); 
			break;
       }
   });

