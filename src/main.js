const Buttons_Contaienr = document.getElementById('commands-container');
const Input_View = document.getElementById('input-view').firstElementChild;
const History_View = document.getElementById('answer-view').firstElementChild;

const PI = Math.PI;
var numericValue = null;
let stored = null;
let number = [];

let process = {
  firstNumeric: null,
  operator: null,
  secondNumeric: null,
  operators_accepted: ['+', '-', '*', '/', '^'],
  control_operatos: ['='],
};

Buttons_Contaienr.addEventListener('click', btnContainer);
window.addEventListener('keypress', keyPressReaction);

function keyPressReaction(event) {
  console.log(event.key);

  if (event.key >= 0 && event.key <= 9) {
    handleNumericInput(event, numericValue, registerUserDigit);
  }

  process.operators_accepted.map((item) => {
    if (event.key === item && item !== '=') {
      manageOperations();
      operator = event.key;
      process.operator = operator;
      showOperationProcess();

      number = [];
    }
  });

  if (event.key === '=' || event.key === 'Enter') {
    event.preventDefault(); // Prevent the default browser action
    manageOperations();
  }

  if (event.key === 'Delete') {
    handleNumericInput(event, numericValue, del);
  }
}

function btnContainer(event) {
  switch (event.target.className) {
    case 'number':
      handleNumericInput(event, numericValue, registerUserDigit);
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

    case 'del':
      handleNumericInput(event, numericValue, del);
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
  if (event.type === 'click') {
    number.push(event.target.textContent);
  } else if (event.type === 'keypress') {
    number.push(event.key);
  }

  currentUserDigit = number.join('');

  if (event.target.id === 'pi') {
    process[numberTurn] = PI;
  } else {
    process[numberTurn] = Number.parseFloat(currentUserDigit);
  }

  Input_View.textContent = currentUserDigit;

  currentUserDigit = null;
}

function del(numberTurn, event, currentUserDigit) {
  if (process.operator === null || process.secondNumeric !== null) {
    number.pop();
    currentUserDigit = number.join('');
    process[numberTurn] = Number.parseFloat(currentUserDigit);

    Input_View.textContent = currentUserDigit;

    currentUserDigit = null;
  }
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
  stored = Math.pow(number, powerOf);
  process.firstNumeric = stored;
  process.secondNumeric = null;
  return stored;
}

function doOperation(operation, first, second) {
  return operation(first, second);
}

function handleNumericInput(event, currentUserDigit, callBackFunction) {
  let numberTurn = null;
  if (process.operator === null) {
    numberTurn = 'firstNumeric';
    return callBackFunction(numberTurn, event, currentUserDigit);
  } else {
    numberTurn = 'secondNumeric';
    return callBackFunction(numberTurn, event, currentUserDigit);
  }
}
