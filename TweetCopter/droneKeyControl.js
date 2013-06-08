exports.connectDrone = function (drone, droneCommandQueue, sockets) {
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
                    break;
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
                    drone.takeoff(onHover);
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
                case '?':
                    sockets.emit('draw');
                    break;
                case '!':
                    sockets.emit('draw');
                    var cmd = droneCommandQueue.execute();
                    if (cmd) {
                        sockets.emit('dronecmd', cmd);
                    }
                    break;
                default:
                    console.log('pressed ' + char);
            }
        }
    });


    function onHover() {
        //drone.land();
        return false;//must return falsy value
    }

}