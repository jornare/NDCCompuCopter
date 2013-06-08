var copterAnimations = copterAnimations || {};

// to make sure KO has rendered our users, set timeout
(function () { 

    copterAnimations.endCompetition = function () {
        setTimeout(function () {    
            $('#users').hide();
            $('#winner').show();
        }, 5000);
    };
    copterAnimations.resetCompetition = function () {
        $('#users').show();
        $('#winner').hide();
    };

    copterAnimations.fadeInElement = function (elem) {
        if (elem.nodeType === 1) $(elem).fadeIn('500');
    }
})();