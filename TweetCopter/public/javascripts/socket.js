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
      tweet.formattedDate = ko.computed(function () {
        var current = new Date(this.created_at);
        console.log(current);

        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][current.getMonth()];
        var day = current.getDay().toString();
        var hours = current.getHours().toString();
        if (hours.length == 1) hours = "0" + hours;
        var minutes = current.getMinutes().toString();
        if (minutes.length == 1) minutes = "0" + minutes;

        return month + " " + day + ", " + hours + ":" + minutes;
      }, tweet);
      self.tweets.unshift(tweet); // prepends new tweets instead of appending; new ones at top of the page
      self.lastTweet(tweet);
      self.addUser(tweet.user);
    };

    this.addUser = function (user) {
        var users = self.users();
        var found = false;
        for (var key in users) {
          if (users[key].screen_name === user.screen_name)
            found = true;
        }
        if (!found) self.users.push(user);
    };
};
window.vm = new viewModel();



$(document).ready(function () {

    ko.applyBindings(window.vm);
    new NodecopterStream(document.getElementById("droneStream"));
});
