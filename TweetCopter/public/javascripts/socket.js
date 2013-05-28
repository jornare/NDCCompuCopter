var socket = io.connect('http://localhost:3000');
socket.on('tweet', function (data) {
    console.log(data);
    window.vm.addTweet(data);
    //socket.emit('my other event', { my: 'data' });
});


var viewModel = function () {
    var self = this;
    this.lastTweet = ko.observable();
    this.tweets = ko.observableArray();
    this.users = ko.observableArray();

    this.addTweet = function (tweet) {
        self.tweets.push(tweet);
        self.lastTweet(tweet);
        self.addUser(tweet.user);
    };

    this.addUser = function (user) {
        self.users.push(user);

    };
};
window.vm = new viewModel();



$(document).ready(function () {

    ko.applyBindings(window.vm);
    new NodecopterStream(document.getElementById("droneStream"));
});