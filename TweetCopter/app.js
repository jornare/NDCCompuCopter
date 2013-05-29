
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , arDrone = require('ar-drone')
  , drone  = arDrone.createClient()
  , cxtwit = require('./cxndctwit')
  , cxtest = require('./cxtest')
  , fs = require('fs')
  , dronestream = require("dronestream")
  , droneTweet = require("./droneTweet").connectDrone(drone);

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
dronestream.listen(server);

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

