window.onbeforeunload = function (e) {
    var WARNEY = "Unsaved progress may be lost!";

    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
	e.returnValue = WARNEY;
    }

    // For Safari
    return WARNEY;
};
