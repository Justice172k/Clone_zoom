const socket = io('/')

const videoGrid = document.getElementById('video-grid')
// const PORT = process.env.PORT || 3000;
// console.log('port in script file' + PORT)
const peer = new Peer(undefined,
    {
        path: '/peerjs',
        host: '/',
        port: '443'

    });
let myVideoStream
const myVideo = document.createElement('video')
myVideo.muted = true


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
    console.log("chua vao");
    console.log(myVideo)

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    });

    socket.emit('ready')
    socket.on('user-connected', (userId) => {
        console.log("id khach" + userId)
        connectedToNewUser(userId, stream)
    })
})

peer.on('open', id => {
    console.log("id chu" + id)
    socket.emit('join-room', Room_Id, id)
})

const connectedToNewUser = (userId, stream) => {

    let call = peer.call(userId, stream)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        console.log(userVideoStream)
        addVideoStream(video, userVideoStream)
    })
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    console.log("da vao")
    console.log(stream)
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}


