var socket = io.connect('http://localhost:3000');
socket.on('tweet', function (data) {
    console.log(data);
    window.vm.addTweet(data);
    //socket.emit('my other event', { my: 'data' });
});

/*example navdata
{ header: 1432778632,
    droneState:
    { flying: 0,
        videoEnabled: 0,
        visionEnabled: 1,
        controlAlgorithm: 0,
        altitudeControlAlgorithm: 1,
        startButtonState: 0,
        controlCommandAck: 1,
        cameraReady: 1,
        travellingEnabled: 0,
        usbReady: 0,
        navdataDemo: 1,
        navdataBootstrap: 0,
        motorProblem: 0,
        communicationLost: 0,
        softwareFault: 0,
        lowBattery: 1,
        userEmergencyLanding: 0,
        timerElapsed: 1,
        MagnometerNeedsCalibration: 0,
        anglesOutOfRange: 0,
        tooMuchWind: 0,
        ultrasonicSensorDeaf: 0,
        cutoutDetected: 0,
        picVersionNumberOk: 1,
        atCodecThreadOn: 1,
        navdataThreadOn: 1,
        videoThreadOn: 1,
        acquisitionThreadOn: 1,
        controlWatchdogDelay: 0,
        adcWatchdogDelay: 0,
        comWatchdogProblem: 0,
        emergencyLanding: 1 },
    sequenceNumber: 28162,
    visionFlag: 1,
    demo:
    { controlState: 'CTRL_DEFAULT',
        flyState: 'FLYING_OK',
        batteryPercentage: 0,
        rotation:
        { frontBack: 13.047,
            pitch: 13.047,
            theta: 13.047,
            y: 13.047,
            leftRight: -9.598,
            roll: -9.598,
            phi: -9.598,
            x: -9.598,
            clockwise: 175.413,
            yaw: 175.413,
            psi: 175.413,
            z: 175.413 },
        frontBackDegrees: 13.047,
        leftRightDegrees: -9.598,
        clockwiseDegrees: 175.413,
        altitude: 0,
        altitudeMeters: 0,
        velocity: { x: 0, y: 0, z: 0 },
        xVelocity: 0,
        yVelocity: 0,
        zVelocity: 0,
        frameIndex: 0,
        detection: { camera: [Object], tagIndex: 0 },
        drone: { camera: [Object] } },
    visionDetect:
        { nbDetected: 0,
            type: [ 0, 0, 0, 0 ],
            xc: [ 0, 0, 0, 0 ],
            yc: [ 0, 0, 0, 0 ],
            width: [ 0, 0, 0, 0 ],
            height: [ 0, 0, 0, 0 ],
            dist: [ 0, 0, 0, 0 ],
            orientationAngle: [ 0, 0, 0, 0 ],
            rotation: [ [Object], [Object], [Object], [Object] ],
            translation: [ [Object], [Object], [Object], [Object] ],
            cameraSource: [ 0, 0, 0, 0 ] } }
            */
socket.on('navdata', function (data) {
   // window.vm.

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
