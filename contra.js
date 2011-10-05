/*!
* contra.js
* Ed Fuhrken
* https://github.com/edfuh/contra
* License MIT
*/
(function(w, d) {
    var fns = [],
        key,
        fn,
        // up up down down left right left right b a
        code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        step = 0,
        evtLstr = 'addEventListener',
        kyUp = 'keyup';

    function complete() {
        while (fn = fns.shift()) {
            fn();
        }
    }

    function onKey(e) {
        key = e.which || e.keyCode;

        if (key == code[step]) {
            step++;
            if (step >= code.length) {
                complete();
                step = 0;
            }
        } else {
            step = 0;
        }
    }

    !!d[evtLstr] ?
        d[evtLstr](kyUp, onKey, 0) :
        d.attachEvent('on' + kyUp, onKey);

    // make'r global
    w.contra = function (c) {
        fns.push(c);
    }
})(this, document);