/**
 * Module dependencies.
 */

var ce = require('cloneextend');


/**
 * @param sData json-string. Expects an array with a single "template" tweet
 * @return array of fake tweets
 */
exports.generateTestUserData = function (sData) {
    var oTemplate = JSON.parse(sData)[0], // See comment above --^
        aTweets = [],
        i = 1;
    console.log("template: " + oTemplate);
	for (; i <= 22; i++) {
        (function(i) {
            aTweets.push(applyTemplate(oTemplate, i));
        })(i);
    }
    return aTweets;
}


function applyTemplate(oTemplate, iNum) {
    var clone = ce.clone(oTemplate);
    clone.user.screen_name = "test" + iNum;
    clone.user.name = clone.user.name.replace("x", iNum);
    clone.user.profile_image_url = clone.user.profile_image_url.replace("x", iNum);
    clone.text = clone.text.replace("x", "testbruker #" + iNum);
//    console.log("deep clone ? " + (clone.user !== oTemplate.user));
    return clone;
}
