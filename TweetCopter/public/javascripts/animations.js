var copterAnimations = copterAnimations || {};

// to make sure KO has rendered our users, set timeout
(function () { 

    copterAnimations.endCompetition = function (winner, competitors) {
        setTimeout(function () {    
            $('#users').hide();
            $('#winner').show();
        }, 5000)
    }
    copterAnimations.resetCompetition = function (winner, competitors) {
        setTimeout(function () {    
            $('#users').show();
            $('#winner').hide();
        }, 5000)
    }
})();