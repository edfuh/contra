(function(w, d) {
    var fns = [],
        // up up down down left right left right b a
        code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        step = 0,

    execCallbacks = function () {
        var fn;

        while (fn = fns.shift()) {
            fn.call();
        }
    },

    onKey = function (e) {
        var key = e.which || e.keyCode;

        if ( key == code[step] ) {
            step++;
            if (step >= code.length) {
                execCallbacks();
            }
        } else {
            step = 0;
        }
    };

    // if the children use the jQueries
    if (w.jQuery) {
        w.jQuery(d).bind('keyup', onKey);
    } else {
        // implementing IE5.5 event model lolol
        d.onkeyup = onKey;
    }

    // make'r global
    w.contra = function (c) {
        fns.push(c);
    }
})(this, document);