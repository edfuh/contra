/*jshint
 browser:true,
 white:true
*/
/*!
* contra.js
* Ed Fuhrken
* https://github.com/edfuh/contra
* License MIT
*/
(function (w, d) {
    var fns = [],
        fn,
        // up up down down left right left right b a
        code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        step = 0,
        // Touch enabled
        isT = !!('ontouchstart' in w),
        evtLstr = 'addEventListener',
        almostThere = false,
        curX,
        curY,
        iX,
        iY,
        btnHolder,
        btnA,
        btnB;

    function reset() {
        almostThere = false;
        step = 0;
        isT && hideButtons();
    }

    function complete() {
        while (fn = fns.shift()) {
            fn();
        }
    }

    function addEvent(event, fn) {
        !!d[evtLstr] ?
            d[evtLstr](event, fn, 0) :
            d.attachEvent('on' + event, fn);
    }

    function stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function childOf(element, parent) {
        while (element = element.parentNode) {
            if (element === parent) {
                return true;
            }
        }
        return false;
    }

    function createElement(el) {
        return d.createElement(el);
    }

    function onKey(e) {
        var key = e.which || e.keyCode;

        if (key === code[step]) {
            step++;
            if (step >= code.length) {
                complete();
                reset();
            }
        } else {
            reset();
        }
    }

    function btnClick(e) {
        stopEvent(e);
        curY = curX = iX = iY = 0;

        var letter = this.id.split('-')[1],
            key;

        if (letter === 'a') {
            key = 65;
        } else if (letter === 'b') {
            key = 66;
        }

        onKey({
            which : key
        });
    }

    function hideButtons() {
        btnHolder.className = 'contra-hidden';
    }

    function showButtons() {
        btnHolder = createElement('div');
        btnA = createElement('button');
        btnB = createElement('button');
        btnHolder.id = 'contracode-controller';
        btnA.id = 'contracode-a';
        btnB.id = 'contracode-b';
        btnA.innerHTML = 'A';
        btnB.innerHTML = 'B';
        btnHolder.style.cssText = [
            'position:absolute',
            'top:0',
            'left:0',
            'right:0',
            'bottom:0'
        ].join(';');

        btnHolder.className = 'contra-visible';

        btnHolder.appendChild(btnB);
        btnHolder.appendChild(btnA);
        d.body.appendChild(btnHolder);
    }

    function onTouchStart(e) {
        //stopEvent(e);

        if (e.touches.length) {
            var t = e.touches[e.touches.length - 1];
            curX = 0;
            curY = 0;
            iX = t.pageX;
            iY = t.pageY;
        }
    }

    function onTouchMove(e) {
        //stopEvent(e);
        if (e.touches.length) {
            var t = e.touches[e.touches.length - 1];
            curX = t.pageX;
            curY = t.pageY;
        }
    }

    function onTouchEnd(e) {

        if (almostThere) {
            // if target is one of our buttons, or the textnode inside it,
            // make that button the target
            var tg = e.target === btnA || childOf(e.target, btnA) ? btnA :
                     e.target === btnB || childOf(e.target, btnB) ? btnB :
                     false;
            // if target is not any of those, you lose
            if (tg) {
                btnClick.call(tg, e);
            } else {
                reset();
            }
        } else {

            var math = Math,
                abs = math.abs,
                h = curX - iX,
                v = curY - iY,
                absH = abs(h),
                absV = abs(v),
                key = null;

            if (math.max(absH, absV) === absH) {
                if (h > 0) {
                    //right
                    key = 39;
                } else {
                    //left
                    key = 37;
                }
            } else {
                if (v > 0) {
                    //down
                    key = 40;
                } else {
                    //up
                    key = 38;
                }
            }

            onKey({
                which : key
            });

            // are we there yet?
            if (step === code.length - 2) {
                almostThere = true;
                showButtons();
            }
        }
    }

    addEvent('keyup', onKey);
    if (isT) {
        addEvent('touchstart', onTouchStart);
        addEvent('touchmove', onTouchMove);
        addEvent('touchend', onTouchEnd);
    }

    // make'r global
    w.contra = function (c) {
        fns.push(c);
    };
}(this, document));