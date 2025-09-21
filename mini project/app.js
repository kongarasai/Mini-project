// ===== Get display element =====
const display = document.getElementById('display');

// Track last input and power mode (for xʸ)
let lastInput = '';
let powerMode = false; // true if waiting for exponent
let baseNumber = null; // store base number for xʸ operation

// ===== Press number button =====
function press(num){
  if(powerMode){
    display.value = '';
    powerMode = false;
  }
  display.value += num;
  lastInput = num;
}

// ===== Press decimal (.) =====
function pressDecimal(){
  const tokens = display.value.split(/[\+\-\*\/\%]/);
  const lastToken = tokens[tokens.length-1];
  if(!lastToken.includes('.')){
    display.value += '.';
    lastInput = '.';
  }
}

// ===== Press operator (+, -, *, /, %) =====
function pressOperator(op){
  if(display.value === '') return;
  const lastChar = display.value.slice(-1);
  if(/[+\-*/.%]/.test(lastChar)){
    display.value = display.value.slice(0,-1) + op;
  } else {
    display.value += op;
  }
  lastInput = op;
}

// ===== Insert π value =====
function pressPi(){
  display.value += Math.PI.toFixed(8);
  lastInput = 'pi';
}

// ===== Toggle sign (+/-) =====
function toggleSign(){
  try {
    const tokens = display.value.split(/([+\-*/%])/);
    let lastToken = tokens.pop();
    if(lastToken === '') return;
    if(lastToken.startsWith('-')) lastToken = lastToken.slice(1);
    else lastToken = '-' + lastToken;
    tokens.push(lastToken);
    display.value = tokens.join('');
  } catch {
    display.value = 'Error';
  }
}

// ===== Apply functions (square, sqrt) =====
function applyFunction(func){
  try {
    const tokens = display.value.split(/([+\-*/%])/);
    let lastToken = tokens.pop();
    let num = parseFloat(lastToken);
    if(isNaN(num)) throw 'Invalid Input';

    switch(func){
      case 'square': num = num**2; break;
      case 'sqrt': 
        if(num < 0) throw 'Invalid Input';
        num = Math.sqrt(num); break;
    }
    tokens.push(num);
    display.value = tokens.join('');
  } catch {
    display.value = 'Error';
  }
}

// ===== Start power operation (xʸ) =====
function startPower(){
  baseNumber = parseFloat(display.value);
  if(isNaN(baseNumber)) return;
  powerMode = true;
  display.value = '';
}

// ===== Backspace (⌫) =====
function backspace(){
  display.value = display.value.slice(0,-1);
}

// ===== Clear display (C) =====
function clearDisplay(){
  display.value = '';
  baseNumber = null;
  powerMode = false;
}

// ===== Calculate result safely =====
function calculate(){
  try{
    if(display.value === '') return;
    let expr = display.value.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    expr = expr.replace(/[\+\-\*\/\%]+$/,'');

    let result;

    if(baseNumber !== null){
      let exponent = parseFloat(display.value);
      if(isNaN(exponent)) throw 'Invalid Input';
      result = baseNumber ** exponent;
      baseNumber = null;
    } else {
      result = Function('"use strict"; return ('+expr+')')();
    }

    if(!isFinite(result)) throw 'Math Error';
    display.value = parseFloat(result.toPrecision(12));
  } catch {
    display.value = 'Error';
  }
}

// ===== Keyboard support =====
document.addEventListener('keydown', e => {
  const key = e.key;
  if(/[0-9]/.test(key)) press(key);
  else if(key==='.') pressDecimal();
  else if(['+','-','*','/','%'].includes(key)) pressOperator(key);
  else if(key==='Enter') calculate();
  else if(key==='Backspace') backspace();
  else if(key==='Escape') clearDisplay();
  else if(key==='s') applyFunction('square');
  else if(key==='r') applyFunction('sqrt');
  else if(key==='p') pressPi();
  else if(key==='^') startPower();
});
