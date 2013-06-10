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

    copterAnimations.animateCompetition = function () {
        $('#drawing').addClass('enabled').show();
        // start animating a roll ... carousel with css3 handling the animation
        var timeCompetition = setInterval(function () {    
            $('div#competitors div.user-image:last').addClass('active').insertBefore('div#competitors div.user-image:first');
        }, 250);   
       // after 10 seconds, we start shrinking our viewport. css3 handles the animation 
        setTimeout(function () {
            $('#drawing').addClass('winner');
        }, 7500);
        // after 15 seconds, we hide all participants and show our winner.
        setTimeout(function () {
            clearInterval(timeCompetition);
            $('#winner div.user-image').addClass('active winner').insertBefore('div#competitors div.user-image:first');
        }, 12500);
    };

    copterAnimations.resetCompetition = function () {
        $('#drawing').removeClass('enabled');
        $('div#competitors div.user-image.active').show();
        $('div#competitors div.user-image:first').appendTo($('#winner'));
        $('div#competitors div.user-image').each(function () {
            $(this).removeClass('active');
        });
        $('#drawing').removeClass('winner expand');
        $('#winner div.user-image.active.winner').removeClass('active winner');
    };

    setTimeout(function () {
        copterAnimations.scrollCompetitors();
    }, 500);
})();