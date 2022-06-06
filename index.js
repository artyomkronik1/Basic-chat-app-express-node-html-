const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;


server.listen(port, () => {
    console.log("Server is listening");
});





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/friends', (req, res) => {
    res.sendFile(__dirname + '/public/friends.html');
});
app.get('/family', (req, res) => {
    res.sendFile(__dirname + '/public/family.html');
});

const tech = io.of('/tech');

tech.on('connection', (socket) => {

    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', 'New user joined');
    });

    socket.on('message', (data) => {
        tech.in(data.room).emit('message', data.msg);
    });

    io.on('disconnect', () => {
        tech.emit('message', 'User disconnect');
    });

});