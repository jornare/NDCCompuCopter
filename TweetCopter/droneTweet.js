var async = require("async");

// queue will only perform one command at a time
var commandQueue = async.queue(function(task, callback) {
    callback();
}, 1);

exports.connectDrone = function(droneInstance) {
    var drone = droneInstance;

    var commands = {
        "takeoff" : function() { drone.takeoff(); },
        "land" : function() { drone.land(); }
    }

    this.receive = function(text) {
        commandQueue.push({}, function() {
            console.log("text: " + text)
            var commandKeys = Object.keys(commands);

            // test all commands against text
            for(var i=0; i<commandKeys.length; i++) {
                if (text.indexOf(commandKeys[i]) >= 0) {
                    console.log(commands[commandKeys[i]]);
                    break;
                }
            }
        });
    }

    return this;
}

