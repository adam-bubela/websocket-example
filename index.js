var 
    app = require('express')()
    express = require('express'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,
    users = [];

app.use(express.static('public'));

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', (socket)=>{

  socket.on('chat message', (msg) => io.emit('chat message', msg));
  
  socket.on('mousemove',(msg) => {
    for(let index in users)
        if(users[index].nick == msg.nick){
          users[index].pageX = msg.pageX;
          users[index].pageY = msg.pageY; 
        }
    io.emit('mousemove', users);
  });

  socket.on('adduser',(msg)=>{
    users.push(msg);
    io.emit('chat message', `<span>-- User <b>${msg.nick}</b> joined chat --</span>`);
  });
    
  socket.on('removeuser',(nick)=>{
      for(let index in users)
          if(users[index].nick == nick){
            users.splice(index,1);
            console.log('to delete:',users[index], nick);
            io.emit('removeuser', nick);
            io.emit('chat message', `<span>-- User <b>${nick}</b> left chat --</span>`);
            return;
          } 
  });

});

http.listen(port, ()=>console.log('listening on *:' + port));

