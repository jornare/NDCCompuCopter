
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

var numberValidator = function(number, min, max, default) {
	if (typeof number === 'number') {
 		if (number < min) || number > max) {
 			number = default;
 		}
 	} else {
 		number = default;
 	}

 	return number;
}

var cmdValidator = function(cmd) {
 	if (cmd.animateLeds) {
 		var animation = cmd.animateLeds.animation;
 		if (ledAnimations.indexOf(animation) < 0) {
 			return null;
 		}

 		cmd.animateLeds.hz = numberValidator(cmd.animateLeds.hz, 1, 20, 4);
 		cmd.animateLeds.duration = numberValidator(cmd.animateLeds.duration, 1, 5, 2);
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
};