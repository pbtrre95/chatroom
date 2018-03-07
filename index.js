// express.js
var app = require('express')();
//server setup
var server = require('http').Server(app);
//socket.io
var io = require('socket.io')(server);
//port number
var port = 3000;
//zero users
var i = 0;
//default avatar
var avatars = 'https://image.flaticon.com/icons/svg/180/180644.svg';

//connection noted in console
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

//index route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
//sales route
app.get('/sales', (req, res) => {
    res.sendFile(__dirname + '/public/sales.html');
});
//marketing route
app.get('/marketing', (req, res) => {
    res.sendFile(__dirname + '/public/marketing.html');
});
//human resources route
app.get('/hr', (req, res) => {
    res.sendFile(__dirname + '/public/hr.html');
});
//IT route
app.get('/it', (req, res) => {
    res.sendFile(__dirname + '/public/it.html');
});
//engineering route
app.get('/engineering', (req, res) => {
    res.sendFile(__dirname + '/public/engineering.html');
});
//supply chain route
app.get('/supply', (req, res) => {
    res.sendFile(__dirname + '/public/supply.html');
});
//group name of routes
var departments = io.of('/departments');
//roomClean will become a cleaned up name of room for messages
var roomClean;
//as a client connects, perform the following functions
departments.on('connection', (socket) => {
    //if there is only one user, begin the id process again
    if (io.engine.clientsCount == 1) {
        i = 0;
    }
    //as user joins a room
    socket.on('join', function(data) {
        i++;
        socket.join(data.room);
        socket.id = 'User'+i;
        
        if (data.room == 'it') {
            roomClean = 'the IT'
        }
        if (data.room == 'hr') {
            roomClean = 'the HR'
        }
        if (data.room == 'sales') {
            roomClean = 'the sales'
        }
        if (data.room == 'marketing') {
            roomClean = 'the marketing'
        }
        if (data.room == 'supply') {
            roomClean = 'the supply chain'
        }
        if (data.room == 'engineering') {
            roomClean = 'the engineering'
        }
        departments.in(data.room).emit('join-message', {
            message: `${socket.id} joined ${roomClean} room!`,
            colour: socket.colours,
            avatar: avatars
        })
    });
    //as user changes avatar
    socket.on('avatar', function(data) {
        socket.avatars = data.avt;
        departments.in(data.room).emit('avatar-message', {
            message: `${socket.id} changed their avatar to `,
            user: data.user,
            avatar: socket.avatars,
            colour: socket.colours
        }) 
    });
    //as user changes username
    socket.on('username', function(data) {
        if (socket.avatars) { 
            data.avt = socket.avatars;
        }
        else {
            data.avt = avatars;
        }
        departments.in(data.room).emit('username-message', {
            message: `${socket.id} changed their name to ${data.usr}`,
            user: data.user,
            avatar: data.avt,
            colour: socket.colours
        })
        socket.username = data.usr; 
    });
    //as user changes text colour
    socket.on('colour', (data) => {
        socket.colours = data.clr;
    });
    //as user sends a message
    socket.on('message', function(data) {
        if (socket.username) {
            data.usr = socket.username;
        }
        else {
            data.usr = socket.id;
        }
        if (socket.avatars) { 
            data.avt = socket.avatars;
        }
        else {
            data.avt = avatars;
        }
        departments.in(data.room).emit('message', {
           message: data.msg, 
           user: data.usr,
           avatar: data.avt,
           colour: socket.colours
        });
    });
    //as user disconnects
    socket.on('disconnect', (data) => {
        if (socket.username) {
            usr = socket.username;
        }
        else {
            usr = socket.id;
        }
        if (socket.avatars) { 
            avt = socket.avatars;
        }
        else {
            avt = avatars;
        }
        departments.emit('dmessage', {
            message: `${usr} Disconnected`,
            avatar: avt,
            colour: socket.colours
        }
    )})
});