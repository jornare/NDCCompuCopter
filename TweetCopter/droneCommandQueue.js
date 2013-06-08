
exports.connectDrone = function (droneInstance) {
    var self = this;
    var drone = droneInstance;
    this.queue = [];
    this.push = function (cmd) {
        self.queue.push(cmd);
    };
    this.execute = function () {
        var cmd = self.queue.pop();
        drone.takeoff(function () {
            if (cmd.animateLeds) {
                drone.animateLed(cmd.animateLeds.animation, cmd.animateLeds.duration, cmd.animateLeds.hz);
                drone.after(3000, function () {
                    drone.stop();
                    drone.land();
                });
            } else {
                drone.animate(cmd.animation, cmd.duration);
                drone.after(5000, function () {
                    drone.stop();
                    drone.land();
                });
            }
            
            return false;
        });
    };




    return this;
}