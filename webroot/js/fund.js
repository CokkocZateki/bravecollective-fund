
// --------- STOLE FROM STACKOVERFLOW

function formatCurrency(n, c, d, t) {
    "use strict";
    var s, i, j;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? "." : d;
    t = t === undefined ? "," : t;
    s = n < 0 ? "-" : "";
    i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : " ") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}


function thermometer(goalAmount, progressAmount, animate) {
    "use strict";
    var $thermo = $("#thermometer"),
	$progress = $(".progress", $thermo),
	$goal = $(".goal", $thermo),
	percentageAmount;

    goalAmount = goalAmount || parseFloat( $goal.text() ),
    progressAmount = progressAmount || parseFloat( $progress.text() ),
    percentageAmount =  Math.min( Math.round(progressAmount / goalAmount * 1000) / 10, 100); //make sure we have 1 decimal point

    //let's format the numbers and put them back in the DOM
    $goal.find(".amount").text( "" + formatCurrency( goalAmount ) + " ISK");
    $progress.find(".amount").text( "" + formatCurrency( progressAmount ) + " ISK" );

    //let's set the progress indicator
    $progress.find(".amount").hide();
    if (animate !== false) {
	$progress.animate({
	    "height": percentageAmount + "%"
        }, 1200, function() {
	    $(this).find(".amount").fadeIn(500);
	});
    } else {
	$progress.css({
	    "height": percentageAmount + "%"
	});
	$progress.find(".amount").fadeIn(500);
    }
}

// --------- STOLE FROM STACKOVERFLOW

// ---------------------------------------------------------------

jQuery(document).ready(function() {
    update();
    setInterval(function () {jQuery("time.timeago").timeago();}, 60000 * 1);
    setInterval(function () {update();}, 60000 * 1);
});

function update() {
    $.ajax({
	async: true,
	url: "stats_current.json",
	mimeType: "application/json",
	dataType: 'json',
	error: function(xhr, status, error) {
	},
	success: function(json) {
	    thermometer(200000000000.0, json['balance'] );
	    $('#updated').html("");
	    $('#updated').html("<time class='timeago text-success' datetime='" + json['time'] + "'></time>");
	    jQuery("time.timeago").timeago();
	},
    });
}
