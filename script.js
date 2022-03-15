function enterSymbol(symbol) {
  expression = expression.toString();
  const isOperator = /[\/\*\+\-\.]/g;
  const lastSymbol = expression.substr(-1, 1);
  if (symbol.match(isOperator) && lastSymbol.match(isOperator)) return;

  if (expression === '0' && !symbol.match(isOperator)) {
    uploadDisplay(symbol);
    return;
  }

  uploadDisplay(expression + symbol.toString());
}

function uploadDisplay(newExpression) {
  expression = newExpression;
  displayText.textContent = expression;
  resizeText();
}

function uploadHistory(expression, answer) {
  const block = document.createElement('p');
  if (expression == answer) return;
  block.textContent = expression + '=' + answer;
  history.appendChild(block);
}

function resizeText() {
  const calcWidth = parseInt(getComputedStyle(calc).width) - 30;
  let width = parseInt(getComputedStyle(displayText).width);
  let fontSize = parseInt(getComputedStyle(displayText).fontSize);

  while (width > calcWidth) {
    displayText.style.fontSize = fontSize - 1 + 'px';
    width = parseInt(getComputedStyle(displayText).width);
    fontSize = parseInt(getComputedStyle(displayText).fontSize);
  }
}

function showResult() {
  const answer = Math.round(eval(expression) * 100000) / 100000;
  if (answer === Infinity || isNaN(answer)) {
    uploadDisplay('Good Bye!');
    wrap.classList.add('disappear');
    return;
  }
  uploadHistory(expression, answer);
  uploadDisplay(answer.toString());
}

function deleteLast() {
  if (expression.toString().length === 1) {
    uploadDisplay('0');
    return;
  }

  uploadDisplay(expression.slice(0, -1));
}

function negate() {
  if (expression.substr(0, 1) == '-') {
    uploadDisplay(expression.substr(1))
    return;
  }

  uploadDisplay('-' + expression);
}

function clearScreen() {
  uploadDisplay('0');
  displayText.style.fontSize = '40px';
}

const wrap = document.querySelector('.wrap');
const calc = document.querySelector('.calc');
const displayText = document.querySelector('p');
const inputButtons = Array.from(document.querySelectorAll('button:not(.special)'));
const history = document.querySelector('.history');

const equal = document.querySelector("#equal");
const clear = document.querySelector("#clear");
const backspace = document.querySelector("#backspace");
const plusMinus = document.querySelector("#negate");
const clearHistory = document.querySelector(".clearHistory");

let expression = '0';
uploadDisplay(expression);

inputButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    const char = e.target.getAttribute('data-char');
    enterSymbol(char);
  })
})
equal.addEventListener('click', showResult);
clear.addEventListener('click', clearScreen);
backspace.addEventListener('click', deleteLast);
plusMinus.addEventListener('click', negate);
clearHistory.addEventListener('click', function() {
  const points = Array.from(history.querySelectorAll('p'));
  points.forEach(point => {
    history.removeChild(point);
  })
})


window.addEventListener('keydown', function(e) {
  const button = document.querySelector(`[data-key="${e.keyCode}"]`);
  if (!button) return;

  button.classList.add('clicked');
  switch (e.keyCode) {
    case 13:
      showResult();
      return;
      break;
    case 8:
      deleteLast();
      return;
      break;
    case 192:
      negate();
      return;
      break;
    case 67:
      clearScreen();
      return;
      break;
  };

  const char = button.getAttribute('data-char');
  enterSymbol(char);
})

window.addEventListener('keyup', function(e) {
  const button = document.querySelector(`[data-key="${e.keyCode}"]`);
  if (!button) return;
  button.classList.remove('clicked');
})
