
/**
 * Module dependencies.
 */

var Twit = require('twit'),
    securityConfig = require('./twitter.security.keys.json');


var twit = new Twit(securityConfig);

exports.cxstream = function (callback) {
    var stream = twit.stream('statuses/filter', { track: '#drone' });

    stream.on('tweet', function (tweet) {
        callback(tweet);
    });
};
