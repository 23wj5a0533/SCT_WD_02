// Get references to DOM elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator-button');

// Calculator state variables
let currentInput = '0'; // Stores the number currently being entered
let firstOperand = null; // Stores the first number in an operation
let operator = null; // Stores the selected operator (+, -, *, /)
let waitingForSecondOperand = false; // Flag to indicate if the next input should start a new number

/**
 * Updates the calculator display.
 */
function updateDisplay() {
    display.textContent = currentInput;
}

/**
 * Handles number button clicks.
 * @param {string} number - The number string (e.g., '7', '0').
 */
function inputNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        // Prevent multiple leading zeros
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

/**
 * Handles decimal point button click.
 */
function inputDecimal() {
    // If waiting for a second operand, start a new number with "0."
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    // Add decimal only if it's not already present
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

/**
 * Handles operator button clicks.
 * @param {string} nextOperator - The operator string (e.g., '+', '-').
 */
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // If an operator has already been selected and we're waiting for a second operand,
    // update the operator without performing a calculation.
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    // If firstOperand is null, set the current input as the first operand
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // If an operator exists, perform the calculation
        const result = operate(firstOperand, inputValue, operator);
        currentInput = String(result); // Update display with result
        firstOperand = result; // Set result as the new first operand for chaining operations
    }

    waitingForSecondOperand = true; // Next number input will be a new operand
    operator = nextOperator; // Store the new operator
    updateDisplay();
}

/**
 * Performs the arithmetic operation.
 * @param {number} num1 - The first number.
 * @param {number} num2 - The second number.
 * @param {string} op - The operator ('+', '-', '*', '/').
 * @returns {number} The result of the operation.
 */
function operate(num1, num2, op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            // Handle division by zero
            if (num2 === 0) {
                return 'Error'; // Display error for division by zero
            }
            return num1 / num2;
        default:
            return num2; // Should not happen
    }
}

/**
 * Resets the calculator to its initial state.
 */
function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Add event listeners to all calculator buttons
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const { type, value } = event.target.dataset;

        switch (type) {
            case 'number':
                inputNumber(value);
                break;
            case 'operator':
                handleOperator(value);
                break;
            case 'decimal':
                inputDecimal();
                break;
            case 'clear':
                resetCalculator();
                break;
            case 'equals':
                // If there's an operator and a first operand, perform the final calculation
                if (operator && firstOperand !== null) {
                    const inputValue = parseFloat(currentInput);
                    const result = operate(firstOperand, inputValue, operator);
                    currentInput = String(result);
                    firstOperand = null; // Reset for a new calculation
                    operator = null;
                    waitingForSecondOperand = true; // Next number input will start fresh
                    updateDisplay();
                }
                break;
        }
    });
});

// Initial display update when the page loads
document.addEventListener('DOMContentLoaded', updateDisplay);