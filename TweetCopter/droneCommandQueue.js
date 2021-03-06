
exports.connectDrone = function (droneInstance) {
    var self = this;
    var drone = droneInstance;
    this.queue = [];
    this.push = function (cmd) {
        self.queue.push(cmd);
    };
    this.execute = function () {
        if (self.queue.length == 0) {
            return null;
        }
        var cmd = self.queue.pop();
        drone.takeoff(function () {
            if (cmd.animateLeds) {
                drone.animateLeds(cmd.animateLeds.animation, cmd.animateLeds.duration, cmd.animateLeds.hz);
                drone.after(3000, function () {
                    drone.stop();
                    drone.land();
                });
            } else {
                drone.animate(cmd.animate.animation, cmd.animate.duration);
                drone.after(5000, function () {
                    drone.stop();
                    drone.land();
                });
            }
            
            return false;
        });
        return cmd;
    };
    return this;
}