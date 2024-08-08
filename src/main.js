const Buttons_Contaienr = document.getElementById('commands-container');
const Input_View = document.getElementById('input-view').firstElementChild;
const History_View = document.getElementById('answer-view').firstElementChild;

const PI = Math.PI;
let stored = null;
let number = [];
let operator = null;

let process = {
  firstNumeric: null,
  operator: null,
  secondNumeric: null,
};

Buttons_Contaienr.addEventListener('click', btnContainer);

function btnContainer(event) {
  let numericValue;

  switch (event.target.className) {
    case 'number':
      if (process.operator === null) {
        registerUserDigit('firstNumeric', event, numericValue);
      } else if (process.operator !== null) {
        Input_View.textContent = '';
        registerUserDigit('secondNumberic', event, numericValue);
      }
      break;

    case 'operator':
      manageOperations();

      operator = event.target.textContent;
      process.operator = operator;
      showOperationProcess();

      number = [];
      break;

    case 'equal':
      manageOperations();
      break;

    case 'ac':
      cleanFields();
      break;
  }
}

//********************************************************************************************* */
function cleanFields() {
  number = [];
  process.firstNumeric = null;
  process.secondNumeric = null;
  process.operator = null;
  Input_View.textContent = '';
  History_View.textContent = 'Type something...';
}

function showOperationProcess() {
  History_View.textContent = ' ';
  if (process.secondNumeric === null) {
    History_View.textContent = `${process.firstNumeric} ${process.operator}`;
  } else {
    History_View.textContent = `${process.firstNumeric} ${process.operator} ${process.secondNumeric}`;
  }
}

function registerUserDigit(numberTurn, event, currentUserDigit) {
  number.push(event.target.textContent);
  currentUserDigit = number.join('');

  if (event.target.id === 'pi') {
    process[numberTurn] = PI;
  } else {
    process[numberTurn] = Number.parseFloat(currentUserDigit);
  }

  Input_View.textContent = currentUserDigit;

  currentUserDigit = null;
}
function manageOperations() {
  if (process.secondNumeric !== null) {
    showOperationProcess();

    switch (process.operator) {
      case '+':
        Input_View.textContent = doOperation(
          sum,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '-':
        Input_View.textContent = doOperation(
          substract,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '*':
        Input_View.textContent = doOperation(
          multiply,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '/':
        Input_View.textContent = doOperation(
          divide,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '^':
        Input_View.textContent = doOperation(
          power,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;
    }
  }
}

//*************Operations

function sum(first, second) {
  stored = first + second;
  process.firstNumeric = stored;
  process.secondNumeric = null;
  return stored;
}

function substract(first, second) {
  stored = first - second;
  process.firstNumeric = stored;
  process.secondNumeric = null;
  return stored;
}

function multiply(first, second) {
  stored = first * second;
  process.firstNumeric = stored;
  process.secondNumeric = null;
  return stored;
}

function divide(first, second) {
  if (second != 0) {
    stored = first / second;
    process.firstNumeric = stored;
    process.secondNumeric = null;
    return stored;
  }
}

function power(number, powerOf) {
  stored = 1;
  for (let i = 0; i < powerOf; i++) {
    stored *= number;
  }

  process.firstNumeric = stored;
  process.secondNumeric = null;
  return stored;
}

function doOperation(operation, first, second) {
  return operation(first, second);
}
