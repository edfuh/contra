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
        almostThere = false,
        currTouch,
        curX,
        curY,
        iX,
        iY,
        // strings that are used more than once, so we can milk every byte out of the compiler
        sAddEventListener = 'addEventListener',
        sTouches = 'touches',
        sLength = 'length',
        sButton = 'button',
        sAppendChild = 'appendChild',
        sCreateElement = 'createElement',
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
        !!d[sAddEventListener] ?
            d[sAddEventListener](event, fn, 0) :
            d.attachEvent('on' + event, fn);
    }

    function childOf(element, parent) {
        while (element = element.parentNode) {
            if (element === parent) {
                return true;
            }
        }
        return false;
    }

    function onKey(e) {
        var key = e.which || e.keyCode;

        if (key === code[step]) {
            step++;
            if (step >= code[sLength]) {
                complete();
                reset();
            }
        } else {
            reset();
        }
    }

    function btnClick(e) {
        e.preventDefault();
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
        if (typeof btnHolder === 'undefined') {
            btnHolder = d[sCreateElement]('div');
            btnA = d[sCreateElement](sButton);
            btnB = d[sCreateElement](sButton);
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

            btnHolder[sAppendChild](btnB);
            btnHolder[sAppendChild](btnA);
            d.body[sAppendChild](btnHolder);
        }

        btnHolder.className = 'contra-visible';
    }

    function onTouchStart(e) {
        if (e[sTouches][sLength]) {
            // I know this is hideous but im optimizing so stfu
            currTouch = e[sTouches][e[sTouches][sLength] - 1];
            curX = 0;
            curY = 0;
            iX = currTouch.pageX;
            iY = currTouch.pageY;
        }
    }

    function onTouchMove(e) {
        if (e[sTouches][sLength]) {
            // yup still hideous
            currTouch = e[sTouches][e[sTouches][sLength] - 1];
            curX = currTouch.pageX;
            curY = currTouch.pageY;
        }
    }

    function onTouchEnd(e) {

        if (almostThere) {
            // if target is one of our buttons, or the textnode inside it,
            // make that button the target
            var eTarget = e.target,
                tg = eTarget === btnA || childOf(eTarget, btnA) ? btnA :
                     eTarget === btnB || childOf(eTarget, btnB) ? btnB :
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
                // horizontal distance traveled
                h = curX - iX,
                // vertical distance traveled
                v = curY - iY,
                absH = abs(h),
                absV = abs(v),
                key;

            // if the difference between initial X and current X is more than
            // the difference between initial Y and current Y, swipeis horizontal
            // and vice-versa
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
            if (step === code[sLength] - 2) {
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