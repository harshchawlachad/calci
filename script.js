class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.memory = 0;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.isNewCalculation = true;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.isNewCalculation) {
            this.currentOperand = number.toString();
            this.isNewCalculation = false;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = `${this.currentOperand} ${this.operation}`;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            case '√':
                computation = Math.sqrt(current);
                break;
            case 'x²':
                computation = Math.pow(current, 2);
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.isNewCalculation = true;
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    addToMemory() {
        this.memory += parseFloat(this.currentOperand) || 0;
    }

    subtractFromMemory() {
        this.memory -= parseFloat(this.currentOperand) || 0;
    }

    recallMemory() {
        this.currentOperand = this.memory.toString();
        this.isNewCalculation = false;
    }

    clearMemory() {
        this.memory = 0;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = this.getDisplayNumber(this.previousOperand);
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-action]');
const operationButtons = document.querySelectorAll('[data-action="+"], [data-action="-"], [data-action="×"], [data-action="÷"], [data-action="%"]');
const equalsButton = document.querySelector('[data-action="="]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const toggleSignButton = document.querySelector('[data-action="+/-"]');
const squareRootButton = document.querySelector('[data-action="√"]');
const squareButton = document.querySelector('[data-action="x²"]');
const memoryAddButton = document.querySelector('[data-action="memory-add"]');
const memorySubtractButton = document.querySelector('[data-action="memory-subtract"]');
const memoryRecallButton = document.querySelector('[data-action="memory-recall"]');
const memoryClearButton = document.querySelector('[data-action="memory-clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const themeToggle = document.getElementById('theme-toggle');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        
        if (!isNaN(action) || action === '.') {
            calculator.appendNumber(action);
            calculator.updateDisplay();
        } else if (action === '+' || action === '-' || action === '×' || action === '÷' || action === '%') {
            calculator.chooseOperation(action);
            calculator.updateDisplay();
        } else if (action === '=') {
            calculator.compute();
            calculator.updateDisplay();
        } else if (action === 'clear') {
            calculator.clear();
            calculator.updateDisplay();
        } else if (action === 'delete') {
            calculator.delete();
            calculator.updateDisplay();
        } else if (action === '+/-') {
            calculator.toggleSign();
            calculator.updateDisplay();
        } else if (action === '√') {
            calculator.chooseOperation('√');
            calculator.compute();
            calculator.updateDisplay();
        } else if (action === 'x²') {
            calculator.chooseOperation('x²');
            calculator.compute();
            calculator.updateDisplay();
        } else if (action === 'memory-add') {
            calculator.addToMemory();
        } else if (action === 'memory-subtract') {
            calculator.subtractFromMemory();
        } else if (action === 'memory-recall') {
            calculator.recallMemory();
            calculator.updateDisplay();
        } else if (action === 'memory-clear') {
            calculator.clearMemory();
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operation = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key;
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (e.key === '%') {
        calculator.chooseOperation('%');
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key === 'm' || e.key === 'M') {
        calculator.addToMemory();
    } else if (e.key === 's' || e.key === 'S') {
        calculator.subtractFromMemory();
    } else if (e.key === 'r' || e.key === 'R') {
        calculator.recallMemory();
        calculator.updateDisplay();
    } else if (e.key === 'c' || e.key === 'C') {
        calculator.clearMemory();
    }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (document.body.getAttribute('data-theme') === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Initialize display
calculator.updateDisplay();