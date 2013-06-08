/**
 * Module dependencies.
 */
var droneIP = '192.168.1.1';
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , arDrone = require('ar-drone')
  , drone = arDrone.createClient({ip:droneIP})
  , cxtwit = require('./cxndctwit')
  , cxtest = require('./cxtest')
  , fs = require('fs')
  , dronestream = require("dronestream")
  , droneTweet = require("./droneTweet").connectDrone(drone);

drone.config('general:navdata_demo', 'FALSE');

//var control = arDrone.createUdpControl();

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);
process.stdin.on('data', function (char) {
    console.log('pressed ' + char);
    if (char == '\3') {
        console.log('\nExiting on Ctrl-C...');
        process.exit();
    } else if (char == 'q') {
        console.log('\nExiting on q...');
        process.exit();
    } else if (char == '\4') {
        console.log('\nCtrl+D');
    } else {
        switch (char) {
            case '8':
                console.log('front');
                drone.front(0.07);
                break;
            case '9':
                console.log('clockwise');
                drone.clockwise(0.1);
                break;
            case '6':
                console.log('right');
                drone.right(0.07);
                break;
            case '2':
                console.log('back');
                drone.back(0.07);
                break;
            case '4':
                console.log('left');
                drone.left(0.07);
                break;
            case '5':
                console.log('stop');
                drone.stop();
            case '7':
                console.log('Cclockwise');
                drone.counterClockwise(0.1);
                break;

/*
                control.ref({ fly: true, emergency: true });
                control.pcmd({});
                control.flush();*/

                break;
            case 't':
                console.log('takeoff');
                drone.takeoff();
                break;
            case 'u':
                console.log('up');
                drone.up(0.1);
                break;
            case 'w':
                drone.animate('wave', 3000);
                break;
            case 'r':
                drone.disableEmergency();
                break;
            case 'c':
                drone.stop();
                drone.calibrate(0);
                break;
            case 'l':
                drone.stop();
                drone.land();
                break;
            default:
                console.log('pressed ' + char);
        }
    }
});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);

var io = require('socket.io').listen(server),
    tweets = [];

io.set('transports', ['xhr-polling']);
io.set('destroy upgrade', false);
io.set('log level', 1);

fs.readFile('tweets.json', function (err, data) {
    if (!err) {
        tweets = cxtest.generateTestUserData(data);
        console.log("tweets ? " + tweets.length);
//        tweets = JSON.parse(data);
    }
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));

});

// receive stream from drone
dronestream.listen(server, { ip: droneIP });

var navDataCount=0;
drone.on('navdata', function (data) {
    navDataCount++;
    if (navDataCount % 10 == 0) {
        io.sockets.emit('navdata', data);
    }
    //console.log(data);
});


cxtwit.cxstream(function(tweet) {
    tweets.push(tweet);
    fs.writeFile("tweets.json", JSON.stringify(tweets), function (err) {
        if (err) {
            console.log(err);
        }
    });
    droneTweet.receive(tweet.text);
    io.sockets.emit('tweet', tweet);
});

io.sockets.on('connection', function (socket) {
    for (var i = 0; i < tweets.length; i++) {
        socket.emit('tweet', tweets[i]);
    }
});


