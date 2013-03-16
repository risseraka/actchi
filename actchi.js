function forEach(arr, func) {
    var i, j;

    for (i = 0, j = arr.length; i < j; i += 1) {
        func(arr[i], i, arr);
    }
}

console.log(wonita);

function createCanvas(id) {
    var canvas = document.getElementById(id);

    return canvas;
}

function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function getCanvasData(canvas, context) {
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

var canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d');

function listenToAnswer(group, curRowIndex) {
    var pinyin = group.pinyin,
        meaning = group.meaning,
        answer = group.answer;

    pinyin.addEventListener(
        'keypress',
        function waitingForAnswer(e) {
            if (
                e.keyCode > 47 &&
                e.keyCode < 57
            ) {
                pinyin.removeEventListener('keypress', waitingForAnswer);
            } else if (
                e.keyCode < 65 &&
                e.keyCode > 92
            ) {
                e.returnValue = false;
                return false;
            } else {
                return false;
            }

            var tone = String.fromCharCode(e.keyCode);
            tone === '0' && (tone = '5');
            var userAnswer = pinyin.value + tone,
                row = group.row,
                correct = row[2] === userAnswer;

            if (correct === true) {
                console.log('OK');
                pinyin.style.background = 'lightGreen';
            } else {
                console.log('NOPE');
                pinyin.style.background = '#FF8888';
            }
            meaning.innerText = row[3].split('/').join('; ');
            answer.innerText = row[2];
            answer.style.display = 'inline';

            if (
                correct === true &&
                curRows.length > 1 &&
                curRowIndex < curRows.length - 1
            ) {
                curRowIndex += 1;
                listenToAnswer(groups[curRowIndex], curRowIndex);
            } else {
                if (correct === false) {
                    var next = curRowIndex + 1;

                    while (next < groups.length) {
                        group = groups[next];
                        row = group.row;
                        group.answer.innerText = row[2];
                        group.answer.style.display = 'inline';
                        group.meaning.innerText = row[3].split('/').join('; ');

                        next += 1;
                    }
                }

                pinyin.addEventListener(
                    'keypress',
                    function waitingForNext(e) {
                        e.returnValue = false;

                        if (e.keyCode === 32) {
                            pinyin.removeEventListener('keypress', waitingForNext);

                            current = current === index.length - 1 ? 0 : current + 1;

                            init();
                        }
                    },
                    false
                );
            }
        },
        false
    );
    pinyin.focus();
}

function drawChar(context, car, color, next) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = '100px Microsoft Yahei';
    context.fillStyle = color;
    context.fillText(car, 0, 80);

    next(context);
}

function displayChar(car) {
    drawChar(context, car, '#f00', function () {});
}

//displayChar(wonita[0]);

var current = 0,
    index = '的一是人在不有中上了來大到這為過以個而也可時就於生出成得下後會要之對多自都年無我然如他當前地能說心所現但去們意發家實因事經和開與只已日同分最此方面著起想間重天情種行外十其好從子作動些小那看用正三還道再理長國知高明又進相更兩麼本沒卻法定樣使者力才二由或等點見全至果真代問何學關美世新處入並感應很身次受幾頭向常內體少必結難化度文主回活許性變被平近將把像今氣及己四表原位望目立風界滿公什物解總直名加太則先未民手光接合比走言提機深話視做別';

var groups = document.getElementsByClassName('group');
forEach(
    groups,
    function (group) {
        group.pinyin = group.getElementsByClassName('pinyin')[0];
        group.meaning = group.getElementsByClassName('meaning')[0];
        group.answer = group.getElementsByClassName('answer')[0];
    }
);

function lookup(car) {
    var results = [];

    wonita.reduce(
        function (results, el) {
            if (
                el[0] === car ||
                el[1] === car
            ) {
                results.push(el);
            }
            return results;
        },
        results
    );
    return results;    
}

var curChar, curRows;

function init() {
    curChar = index[current];
    curRows = lookup(curChar).sort(
        function (a, b) {
            return Math.random() - Math.random();
        }
    );

    var length = curRows.length;

    forEach(
        groups,
        function (group) {
            group.style.display = '';
        }
    );

    displayChar(curRows[0][1]);

    curRows.forEach(
        function (el, i) {
            var group = groups[i],
                pinyin = group.pinyin,
                meaning = group.meaning,
                answer = group.answer;

            pinyin.value = '';
            pinyin.style.background = '';
            answer.innerText = '';
            
            group.style.display = 'block';
            group.row = el;

            if (length > 1) {
                meaning.innerText =
                    el[3].split('/').join('; ');
            } else {
                meaning.innerText = '';
            }
        }
    );

    listenToAnswer(groups[0], 0);
}

window.onload = init;