var copterAnimations = copterAnimations || {};

// to make sure KO has rendered our users, set timeout
(function () { 

    copterAnimations.scrollCompetitors = function () {
        setInterval(function () {
            // if we have under 9 participants, don't trigger.
            if ($("div#users div.user-image").length > 9)
                // change last participant with first ... carousel
                $('div#users div.user-image:last').insertBefore('div#users div.user-image:first');
        }, 2500);

    };

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

    setTimeout(function () {
        copterAnimations.scrollCompetitors();
    }, 500);
})();