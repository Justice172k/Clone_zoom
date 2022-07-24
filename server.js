const express = require('express');
const { dirname } = require('path');
const { Socket } = require('socket.io');
const app = express()
const server = require("http").Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const port = 3000
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, { debug: true })
app.use(express.static('D:/Zoom Clone/public'))
app.set("view engine", "ejs")

app.use('/peerjs', peerServer)
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

io.on('connection', socket => {
    // receive message from client 
    socket.on('join-room', (Room_Id, userId) => {
        console.log("Room ID " + Room_Id)
        console.log("User ID " + userId)
        socket.join(Room_Id);
        socket.on('ready', () => {
            socket.to(Room_Id).emit('user-connected', userId)
        })
        // socket.to(Room_Id).emit('user-connected', userId)
    })
})


app.get("/:room", (req, res) => {
    res.render('room', { roomId: req.params.room })
})

server.listen(process.env.PORT || 3000)