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
  , droneCommandQueue = require("./droneCommandQueue").connectDrone(drone)
  , tweetParser = require("./tweetCmdParser.js");


drone.config('general:navdata_demo', 'FALSE');
drone.isReady = false;

//var control = arDrone.createUdpControl();




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

var keyControl = require("./droneKeyControl").connect(drone, droneCommandQueue, io.sockets);

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
    return;//not yet in use, so disable
    navDataCount++;
    if (navDataCount % 10 == 0) {
        io.sockets.emit('navdata', data);
    }
    //console.log(data);
});



/*
drone.on('altitudeChange', function (altitude) {
    console.log(altitude);

    if (altitude < 1.5 && drone._ref.fly) {
        drone.up(1.0);
    }
    if (altitude > 1.55 ) {
        drone.down(0.01);
    }
});*/


cxtwit.cxstream(function(tweet) {
    tweets.push(tweet);
    fs.writeFile("tweets.json", JSON.stringify(tweets), function (err) {
        if (err) {
            console.log(err);
        }
    });
    io.sockets.emit('tweet', tweet);
    var cmd = tweetParser.parseTweetCmd(tweet);
    if (cmd) {
        cmd.tweetId = tweet.id;
        if (drone.isReady) {
            drone.isReady = false;
            io.sockets.emit('droneIsReady', false);
            droneCommandQueue.push(cmd);
            droneCommandQueue.execute();
            sockets.emit('dronecmd', cmd);
            console.log("Press ! when ready to accept tweet commands");
        }
    }
});

io.sockets.on('connection', function (socket) {
    for (var i = 0; i < tweets.length; i++) {
        socket.emit('tweet', tweets[i]);
    }
});

console.log("Press ! when ready to accept tweet commands");
//drone.config('video:video_channel', 3);