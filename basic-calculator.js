let operand1 = "";
let operand2 = "";
let operation = "";
let postEquals = false;
let inActiveOperation = false;
let backspaceValid = true;
let percentValid = true;
let display = document.querySelector('#display');

function operate (operator, a, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '–':
      return a - b;
    case '×':
      return a * b
    case '/':
      if (b === 0) {
        return "ERROR";
      }
      return a / b;
    default:
      console.log("The operate() function has failed");
  }
}

const numbers = Array.from(document.querySelectorAll('.numeric'));
numbers.forEach((button) => {
  button.addEventListener('click', () => {
    if (!postEquals) {
      if (display.textContent === operand1) {
        display.textContent = button.textContent;
      } else if (display.textContent === "ERROR" || display.textContent === "TOO LARGE") {
        clearAll();
        display.textContent = button.textContent;
      } else {
        if (display.textContent.length < 11) {
        display.textContent += button.textContent;
        }
      }
    }
  });
});

function countDecimal (text) {
  return (text.match(/\./g) || []).length;
}

const decimalButton = document.querySelector('#decimal'); 
decimalButton.addEventListener('click', () => {
  const decimalCount = countDecimal(display.textContent);
  if (display.textContent === operand1) {
    display.textContent = decimalButton.textContent;
  } else if (decimalCount === 0) {
    if (display.textContent === "ERROR" || display.textContent === "TOO LARGE") {
      clearAll();
      display.textContent = decimalButton.textContent;
    } else {
      if (display.textContent.length < 11) {
       display.textContent += decimalButton.textContent;
      }
    }
  }
});

const backspaceButton = document.querySelector('#erase');
backspaceButton.addEventListener('click', () => {
  if (backspaceValid) {
    display.textContent = display.textContent.slice(0,-1);
  }
});

function clearAll () {
  display.textContent = "";
  operand1 = "";
  operand2 = "";
  operation = "";
  postEquals = false;
  backspaceValid = true;
  inActiveOperation = false;
  percentValid = true;
}

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', clearAll)

const operationButtons = Array.from(document.querySelectorAll('.operation'));
operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (display.textContent != "ERROR" && display.textContent != "TOO LARGE") {
      postEquals = false;
      inActiveOperation = true;
      backspaceValid = true;
      percentValid = true;
      operand1 = display.textContent;
      operation = button.textContent;
    }
  });
});

const equalsButton = document.querySelector('#equals');
equalsButton.addEventListener('click', () => {
  if (inActiveOperation) {
    operand2 = display.textContent;
    result = operate(operation, Number(operand1), Number(operand2));
    display.textContent = formatOutput(result);
    operand1 = "";
    operand2 = "";
    operation = "";
    postEquals = true;
    inActiveOperation = false;
    backspaceValid = false;
    percentValid = true;
  }
}); 

function formatOutput(number) {
  if (isNaN(number)) {
    return "ERROR";
  }
  string = String(number);
  if (string.length <= 11) {
    return string;
  } else if (countDecimal(string) === 0 || digitsBeforeDecimal(number) >= 11) {
    return "TOO LARGE";
  } else {
    return roundPrecisely(number, 9);
  }
}

function digitsBeforeDecimal(number) {
  number = String(number);
  let digits = 0;
  for (let i = 0; i < number.length; i++) {
    if (number[i] === ".") {return digits;}
    digits++;
  }
  return digits;
}

function roundPrecisely(number, accuracy) {
  return Number(Math.round(number + 'e' + accuracy) + 'e-' + accuracy);
}

const percentButton = document.querySelector('#percent');
percentButton.addEventListener('click', () => {
  if (display.textContent !== "" && percentValid) {
    percentResult = operate('/', Number(display.textContent), 100);
    display.textContent = formatOutput(percentResult);
    percentValid = false;
  }
});

const plusminusButton = document.querySelector('#plusminus');
plusminusButton.addEventListener('click', () => {
  if (display.textContent !== "") {
    plusminusResult = operate('×', Number(display.textContent), -1);
    display.textContent = formatOutput(plusminusResult);
  }
});

window.addEventListener('keydown', (event) => {
  const key = document.querySelector(`button[data-key='${event.keyCode}']`);
  key.click();
});