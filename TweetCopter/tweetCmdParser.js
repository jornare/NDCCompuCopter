
/**
 * Tweet command parser
 * Module dependencies.
 */

var animations = ['phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 'yawShake',
'yawDance', 'phiDance', 'thetaDance', 'vzDance', 'wave', 'phiThetaMixed',
'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'];

var ledAnimations = ['blinkGreenRed', 'blinkGreen', 'blinkRed', 'blinkOrange', 'snakeGreenRed',
'fire', 'standard', 'red', 'green', 'redSnake', 'blank', 'rightMissile',
'leftMissile', 'doubleMissile', 'frontLeftGreenOthersRed',
'frontRightGreenOthersRed', 'rearRightGreenOthersRed',
'rearLeftGreenOthersRed', 'leftGreenRightRed', 'leftRedRightGreen',
'blinkStandard'];

var shortCmds = ['greenRed', 'flip', 'dance', 'wave'];

var shortCmdObjects = {
	greenRed: { animateLeds: { animation: 'blinkGreenRed', hz: 5, duration: 2}},
	flip: { animate: { animation: 'flipLeft', duration: 2000}},
	dance: { animate: { animation: 'vzDance', duration: 2000}},
	wave:  { animate: { animation: 'wave', duration: 2000}}
};

var numberValidator = function(number, min, max, defaultVal) {
	if (typeof number === 'number') {
 		if (number < min || number > max) {
 		    number = defaultVal;
 		}
 	} else {
	    number = defaultVal;
 	}

 	return number;
}

var cmdValidator = function(cmd) {
	var animation;
 	if (cmd.animateLeds) {
 		animation = cmd.animateLeds.animation;
 		if (ledAnimations.indexOf(animation) < 0) {
 			return null;
 		}

 		cmd.animateLeds.hz = numberValidator(cmd.animateLeds.hz, 1, 20, 4);
 		cmd.animateLeds.duration = numberValidator(cmd.animateLeds.duration, 1, 5, 2);
 	} else
 	if (cmd.animate) {
 		animation = cmd.animate.animation;
 		if (animations.indexOf(animation) < 0) {
 			return null;
 		}

 		cmd.animate.duration = numberValidator(cmd.animate.duration, 1000, 5000, 2000);
 	}

 	return cmd;
 };

var parseJsonCmd = function(text) {
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

var parseShortCmd = function(text) {
	for (var i in shortCmds) {
		var shortCmd = shortCmds[i];
		var pos = text.indexOf(shortCmd);
		if (pos >= 0) {
			return shortCmdObjects[shortCmd];
		}
	}

	return null;
};

exports.parseTweetCmd = function(tweet){
	// return { animateLeds: { animation: 'blinkGreenRed', hz: 5, duration: 2}};

	var text = tweet.text;
	var cmd = parseJsonCmd(text);

	if (cmd === null) {
		cmd = parseShortCmd(text);
	}

	return cmd;
};
