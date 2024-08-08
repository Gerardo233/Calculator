const Buttons_Contaienr = document.getElementById('commands-container'); //Container of all the buttons
const Input_View = document.getElementById('input-view').firstElementChild; //View of the numbers selected by the user and answers
const History_View = document.getElementById('answer-view').firstElementChild; //View of the process of the operation

const PI = Math.PI; //Pi value constant
var numericValue = null; //Variable to store the value of the number selected by the user
let stored = null; //Variable to store the value of the previously operations answer
let number = []; //Variable to store each digit. Then this will be used to get the elements and join them as a single number

//Object who has the control of the process of the operations
let process = {
  firstNumeric: null, //The first number typed by the user
  operator: null, //The operator chosen by the user
  secondNumeric: null, //The second number typed
  operators_accepted: ['+', '-', '*', '/', '^'], //To know the operations available
  control_operatos: ['='], //keys which are not for the process of the operations
};

Buttons_Contaienr.addEventListener('click', btnContainer); //Event added to the container of buttons
window.addEventListener('keypress', keyPressReaction); //Event added to the window to listen for keypresses

//Function for the window addEvenListener
function keyPressReaction(event) {
  //1. To know when a number key is pressed
  if (event.key >= 0 && event.key <= 9) {
    handleNumericInput(event, numericValue, registerUserDigit);
  }

  //Evaluate if the key matches an operator available from the object who stores this information
  process.operators_accepted.map((item) => {
    //It ensures to not store the "=" as the operator for the action to be performed
    if (event.key === item && item !== '=') {
      manageOperations(); //Manage the operation to be performed (this is here in case the user does not press the "=" key and just keeps pressing numbers and operators to get results)

      operator = event.key; //Store the symbol ("+", "-", "*", "/" or "^")
      process.operator = operator; //Store the operator in the object
      showOperationProcess(); //It shows the proccess in History_View

      number = []; //It empties the number array
    }
  });

  //If the key pressed is "=" || "Enter"
  if (event.key === '=' || event.key === 'Enter') {
    event.preventDefault(); // Prevent the default browser action
    manageOperations(); //Manage the operation to be performed
  }

  //To know if the key pressed is "Delete"
  if (event.key === 'Delete') {
    handleNumericInput(event, numericValue, del);
  }
}

function btnContainer(event) {
  // Determine the action based on the class of the clicked element.
  switch (event.target.className) {
    case 'number':
      // Handle numeric input ).
      handleNumericInput(event, numericValue, registerUserDigit);
      break;

    case 'operator':
      // Execute the current operation, if any, and set the new operator.
      manageOperations();
      operator = event.target.textContent; // Store the operator clicked by the user.
      process.operator = operator;
      showOperationProcess(); // Update the display with the operation.

      number = []; // Reset the numeric input array for the next number.
      break;

    case 'equal':
      // Finalize the calculation and show the result.
      manageOperations();
      break;

    case 'ac':
      // Clear all fields and reset the calculator.
      cleanFields();
      break;

    case 'del':
      // Handle the deletion of the last digit or input.
      handleNumericInput(event, numericValue, del);
      break;
  }
}

//********************************************************************************************* */
function cleanFields() {
  number = []; //It empties the number array
  process.firstNumeric = null; //Rellocate the default value
  process.secondNumeric = null; //Rellocate the default value
  process.operator = null; //Rellocate the default value
  Input_View.textContent = ''; //Empties the view
  History_View.textContent = 'Type something...';
}

function showOperationProcess() {
  History_View.textContent = ' '; //Before showing the infor, it empties the current info displayed

  //This when the second numeric has not chosen yet
  if (process.secondNumeric === null) {
    //This shows the first number and the operator selected
    History_View.textContent = `${process.firstNumeric} ${process.operator}`;
  } else {
    //When all the elements have been selected (first numeric + operator + second numeric)
    History_View.textContent = `${process.firstNumeric} ${process.operator} ${process.secondNumeric}`;
  }
}

/**
 * Registers the user's digit input from a click or keypress event.
 *
 * @param {*} numberTurn - The current turn in the process (index or identifier for tracking input).
 * @param {*} event - The event object, either a 'click' or 'keypress'.
 * @param {*} currentUserDigit - The digit(s) input by the user, which will be updated and displayed.
 */
function registerUserDigit(numberTurn, event, currentUserDigit) {
  //If the event is click
  if (event.type === 'click') {
    number.push(event.target.textContent);
    //If the event is a keypress
  } else if (event.type === 'keypress') {
    number.push(event.key);
  }

  currentUserDigit = number.join(''); //This joins the digits fromt the array

  //If the PI key is pressed
  if (event.target.id === 'pi') {
    process[numberTurn] = PI;
  } else {
    //When other key numbers are pressed
    //The value is assigned in (firstNumeric or secondNumeric)
    process[numberTurn] = Number.parseFloat(currentUserDigit);
  }

  //The number is displayed
  Input_View.textContent = currentUserDigit;

  currentUserDigit = null; //The variable is cleaned
}

/**
 * Deletes a character from the input where the user has typed
 * @param {*} numberTurn - first numeric or second numeric
 * @param {*} event - event
 * @param {*} currentUserDigit - variable to store the number gotten from the number array
 */
function del(numberTurn, event, currentUserDigit) {
  //Control if the first number is being typed or the second (I want to be allowed to use this only in these two cases)
  if (process.operator === null || process.secondNumeric !== null) {
    number.pop(); //I remove the last digit pushed in the array
    currentUserDigit = number.join(''); //I joined the elements of the array
    process[numberTurn] = Number.parseFloat(currentUserDigit); //The value is assigned in (firstNumeric or secondNumeric)

    Input_View.textContent = currentUserDigit; //The number is displayed

    currentUserDigit = null; //The variable is cleaned
  }
}

function manageOperations() {
  // Check if the second numeric input has been provided.
  if (process.secondNumeric !== null) {
    // Display the operation process in the interface.
    showOperationProcess();

    // Perform the operation based on the stored operator.
    switch (process.operator) {
      case '+':
        // Perform addition and display the result.
        Input_View.textContent = doOperation(
          sum,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '-':
        // Perform subtraction and display the result.
        Input_View.textContent = doOperation(
          substract,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '*':
        // Perform multiplication and display the result.
        Input_View.textContent = doOperation(
          multiply,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '/':
        // Perform division and display the result.
        Input_View.textContent = doOperation(
          divide,
          process.firstNumeric,
          process.secondNumeric,
        );
        break;

      case '^':
        // Perform exponentiation and display the result.
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
  stored = first + second; //I make the addition of numbers
  process.firstNumeric = stored; //I pass in the process object in firstNumeric the result
  process.secondNumeric = null; // I rellocate to the default value the secondNumeric
  return stored; //The answer is returned
}

function substract(first, second) {
  stored = first - second; //The substracction is made
  process.firstNumeric = stored; //I pass in the process object in firstNumeric the result
  process.secondNumeric = null; // I rellocate to the default value the secondNumeric
  return stored; //The answer is returned
}

function multiply(first, second) {
  stored = first * second; //The multiplication is made
  process.firstNumeric = stored; //I pass in the process object in firstNumeric the result
  process.secondNumeric = null; // I rellocate to the default value the secondNumeric
  return stored; //The answer is returned
}

function divide(first, second) {
  //It enssures to knot divide by zero
  if (second != 0) {
    stored = first / second; //The division is made
    process.firstNumeric = stored; //I pass in the process object in firstNumeric the result
    process.secondNumeric = null; //I rellocate to the default value the secondNumeric
    return stored; //The answer is returned
  }
}

function power(number, powerOf) {
  stored = Math.pow(number, powerOf); //The power is made
  process.firstNumeric = stored; //I pass in the process object in firstNumeric the result
  process.secondNumeric = null; //I rellocate to the default value the secondNumeric
  return stored; //The answer is returned
}

/**
 * Executes a specified operation on two numbers.
 *
 * @param {Function} operation - Function that processes two numbers (callback).
 * @param {number} first - The first number.
 * @param {number} second - The second number.
 * @returns {number} The result of the operation.
 *
 * @example
 * doOperation(
          sum,
          2,
          3,
        ); = 5
 */
function doOperation(operation, first, second) {
  return operation(first, second);
}

/**
 * Handles numeric input by determining whether it's the first or second numeric entry
 * and then calls the specified callback function.
 *
 * @param {Event} event - The event object, typically from a 'click' or 'keypress'.
 * @param {*} currentUserDigit - The current digit(s) entered by the user.
 * @param {Function} callBackFunction - The function to call with the determined numeric input and event details.
 * @returns {*} The result of the callback function, which processes the numeric input.
 */
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
