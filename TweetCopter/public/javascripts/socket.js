var socket = io.connect('http://localhost:3000');
socket.on('tweet', function (data) {
    console.log(data);
    //socket.emit('my other event', { my: 'data' });
});