let ten = 10;
let numberOfSentences = 5;
let miliseconds = 1000;

function generateImplicitText() {
    let words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
    let sentences = [];
    for (let i = 0; i < numberOfSentences; ++i) {
        let numWords = Math.floor(Math.random() * ten) + numberOfSentences;
        let sentenceWords = [];
        for (let j = 0; j < numWords; ++j) {
            let randomWordIndex = Math.floor(Math.random() * words.length);
            sentenceWords.push(words[randomWordIndex]);
        }
        let singleSentence = sentenceWords.join(' ') + '. ';
        sentences.push(singleSentence.charAt(0).toUpperCase() + singleSentence.slice(1));
    }
    return sentences;
}

let originalText;
let originalTextElement = document.getElementById('originaltext');
let originalTextlength;
let originalTextWordsArray = [];

function getOriginalText() {
    originalText = originalTextElement.value;
    originalTextlength = originalText.length;
    originalTextWordsArray = originalText.split(' ');
}

let typedTextElement = document.getElementById('typedTextElement')
let typedText;
let typedTextWordsArray = [];
let typedTextLength;
let typedTextWordsArrayLength;

function getTypedText() {
    typedText = typedTextElement.value;
    typedTextLength = typedText.length;
    typedTextWordsArray = typedText.split(' ');
    typedTextWordsArrayLength = typedTextWordsArray.length;
}

let mistakes = 0;
let checkedText = ' ';
let typedIndex = 0;
let originalIndex = 0;
let originalWordCount = 0;
let result = document.getElementById('results');

function checkTypedText() {
    let typed = typedTextWordsArray[typedIndex];
    let original = originalTextWordsArray[originalIndex];
    let typedSpan = document.createElement('span');
    if (typed === original) {
        typedSpan.textContent = typed;
        addCorrect(typedSpan);
        addSpace();
    } else if (typed === originalTextWordsArray[originalIndex + 1]) {
        let missing = 1;
        let length = original.length;
        let skippedWord = document.createElement('span');
        skippedWord.textContent = original + ' ';
        addIncorrect(skippedWord);
        ++originalIndex;
        typedSpan.textContent = typed;
        addCorrect(typedSpan);
        addSpace();
        missing += missing * length;
        mistakes += missing;
    } else {
        addSpace();
        let wrong = typed.split('');
        let letter = original.split('');
        colorText(wrong, letter);
        addSpace();
    }
    ++typedIndex;
    ++originalIndex;
    calculateAccuracy();
    calculateSpeed();
}

function colorText(wrong, letter) {
    let y = 0;
    let maxLength = Math.max(wrong.length, letter.length);
    for (let x = 0; x < maxLength; ++x) {
        let typedSpan = document.createElement('span');
        if (letter[x] === wrong[y]) {
            typedSpan.textContent = wrong[y];
            addCorrect(typedSpan);
            ++y;
        } else if (letter[x] === wrong[y + 1]) { // extra letter
            typedSpan.textContent = wrong[y];
            addIncorrect(typedSpan);
            ++y;
            --x;
            ++mistakes;
        } else if (letter[x + 1] === wrong[y]) { // missing letter
            typedSpan.textContent = letter[x];
            addMissing(typedSpan);
            ++mistakes;
        } else if (letter[x + 1] === wrong[y + 1]) { // replaced letter
            typedSpan.textContent = wrong[y];
            addIncorrect(typedSpan);
            ++y;
            ++mistakes;
        } else {
            typedSpan.textContent = wrong[x];
            addIncorrect(typedSpan);
            ++y;
            ++mistakes;
        }
    }
}

function addCorrect(typedSpan) {
    typedSpan.classList.add('correct');
    result.appendChild(typedSpan);
}

function addIncorrect(typedSpan) {
    typedSpan.classList.add('incorrect');
    result.appendChild(typedSpan);
}

function addMissing(typedSpan) {
    typedSpan.classList.add('missing');
    result.appendChild(typedSpan);
}

function addSpace() {
    let space = document.createTextNode(' ');
    result.appendChild(space);
}

let accuracyLevel;
let scoreArea = document.getElementById('accuracy');


function calculateAccuracy() {
    accuracyLevel = Math.floor(((typedTextLength - mistakes) / typedTextLength) * 100) + "%";
    scoreArea.textContent = accuracyLevel;
}

let speed;
let speedArea = document.getElementById('speed');

function calculateSpeed(typed) {
    speed = typedTextWordsArrayLength;
    speedArea.textContent = mistakes + ' ' + typedTextLength;
}

let seconds = 60;
let stopWatch = document.getElementById('stopwatch');

function runTime() {
    if (seconds > 0) {
        --seconds;
        stopWatch.innerHTML = seconds;
    } else {
        timeUp();
    }
}

let timeUpSection = document.getElementById('timeUpSection');

function timeUp() {
    timeUpSection.classList.remove('hidden');
}

let pressedKeys = {};
let implicitText = '';

originalTextElement.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && originalTextElement.value === '') {
        implicitText = generateImplicitText();
        originalTextElement.value = implicitText.join('\n');
        setInterval(runTime, miliseconds);
        e.preventDefault();
    } else if (e.key === 'Enter' && originalTextElement.value != '') {
        getOriginalText();
        e.preventDefault();
        document.getElementById('typedTextElement').focus();
        setInterval(runTime, miliseconds);
        pressedKeys = false;
    }
});

typedTextElement.addEventListener('keydown', function(event) {
    if (!pressedKeys[event.key] && seconds > 0) {
        getTypedText();
        if (event.key === ' ' || event.key === 'Enter') {
            checkTypedText();
        }
        pressedKeys[event.key] = true;
    }
});

typedTextElement.addEventListener('key', function(event) {
    pressedKeys[event.key] = false;
});

function adjustInputWidth(input) {
    input.style.width = input.scrollWidth + 'px';
}
