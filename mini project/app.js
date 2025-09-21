// ---------------- Get Display Element ----------------
const display = document.getElementById("display");
let current = ""; // Stores the current input/expression

// ---------------- Update Display ----------------
function updateDisplay() {
  display.textContent = current || "0"; // Show 0 if empty
}

// ---------------- Factorial Function ----------------
function factorial(n) {
  n = Number(n);
  if (!Number.isInteger(n) || n < 0) return NaN; // Only non-negative integers
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// ---------------- Evaluate Expression ----------------
function evaluateExpression(expr) {
  // Replace calculator symbols with JS equivalents
  expr = expr
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/−/g, "-")
    .replace(/π/g, Math.PI)
    .replace(/x²/g, "**2")
    .replace(/√([0-9.]+)/g, "Math.sqrt($1)")
    .replace(/([0-9.]+)%/g, "($1/100)");

  // Handle xʸ (power)
  while (expr.includes("xʸ")) {
    const parts = expr.split("xʸ");
    expr = `Math.pow(${parts[0]},${parts[1]})`;
  }

  // Replace math functions with JS Math methods
  expr = expr
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10("); // log base 10

  // Convert degrees to radians for trig functions
  expr = expr.replace(/Math\.sin\(([^)]+)\)/g, "Math.sin($1*Math.PI/180)")
             .replace(/Math\.cos\(([^)]+)\)/g, "Math.cos($1*Math.PI/180)")
             .replace(/Math\.tan\(([^)]+)\)/g, "Math.tan($1*Math.PI/180)");

  // Handle factorial
  expr = expr.replace(/([0-9]+)!/g, "factorial($1)");

  // Evaluate the final expression
  return eval(expr);
}

// ---------------- Button Click Handling ----------------
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (value === "AC") {
      current = ""; // Clear everything
    } else if (value === "⌫") {
      current = current.slice(0, -1); // Backspace
    } else if (value === "=") {
      try {
        current = evaluateExpression(current).toString(); // Calculate result
      } catch {
        current = "Error"; // Invalid expressions
      }
    } else if (value === "±") {
      // Toggle positive/negative
      current = current.startsWith("-") ? current.slice(1) : "-" + current;
    } else if (["sin","cos","tan","log"].includes(value)) {
      current += value + "("; // Add function with parenthesis
    } else if (value === "!") {
      current += "!"; // Factorial
    } else {
      current += value; // Numbers, operators, parentheses
    }

    updateDisplay(); // Refresh display after each click
  });
});

// ---------------- Initialize Display ----------------
updateDisplay();
