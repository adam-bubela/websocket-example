var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = [];

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  
    socket.on('mousemove',function(msg){
      for(let user in users){
        if(users[user].nick == msg.nick){
          users[user].pageX = msg.pageX;
          users[user].pageY = msg.pageY; 
        }
      }
      io.emit(`mousemove`, users);
    });

  socket.on('adduser',function(msg){
    users.push(msg); 
  });
    
  socket.on('removeuser',function(nick){
      for(let index in users){
        if(users[index].nick == nick){
          users.splice(index,1);
          console.log('to delete:',users[index], nick);
          io.emit('removeuser', nick);
          return;
        }
      }
  });
});



http.listen(port, function(){
  console.log('listening on *:' + port);
});
