
/**
 * Tweet command parser
 * Module dependencies.
 */

var ledAnimations = ['blinkGreenRed', 'blinkGreen', 'blinkRed', 'blinkOrange', 'snakeGreenRed',
'fire', 'standard', 'red', 'green', 'redSnake', 'blank', 'rightMissile',
'leftMissile', 'doubleMissile', 'frontLeftGreenOthersRed',
'frontRightGreenOthersRed', 'rearRightGreenOthersRed',
'rearLeftGreenOthersRed', 'leftGreenRightRed', 'leftRedRightGreen',
'blinkStandard'];

// var parse
var cmdValidator = function(cmd) {
 	if (cmd.animateLeds) {
 		var animation = cmd.animateLeds.animation;
 		if (ledAnimations.indexOf(animation) < 0) {
 			return null;
 		}

 		if (!cmd.animateLeds.hz) {
 			cmd.animateLeds.hz = 5;
 		}

 		// , hz, duration)
 	}
 	return cmd;
 };

exports.parseTweetCmd = function(tweet){
	return { animateLeds: { animation: 'blinkGreenRed', hz: 5, duration: 2}};

	var text = tweet.text;
	var cmd = null;

	var startPos = text.indexOf('{');
	var endPos = text.lastIndexOf('}');
	if (startPos < 0 || endPos < 0 || endPos < startPos) {
		return null;
	}

	var jsonString = text.substring(startPos, endPos);
	try {
		cmd = JSON.parse(jsonString);
		cmd = cmdValidator(cmd);
	}
	catch (ex) {
		console.log(ex);
	}

	return cmd;
  });
};
