// ================================================
//  OKEREKE ODICHIMMA JOY — SEN 482 Calculator
//  Unique feature: Simultaneous Equation Solver
//  (Cramer's Rule)
// ================================================

"use strict";

// --------------------------------------------------
// STATE
// --------------------------------------------------
let currentExpression = "";

// --------------------------------------------------
// BASIC CALCULATOR — UI functions
// --------------------------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateDisplay();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function clearResult() {
  currentExpression = "";
  updateDisplay();
}

function updateDisplay() {
  const display = document.getElementById("result");
  if (display) {
    display.value = currentExpression || "0";
  }
}

// --------------------------------------------------
// BASIC CALCULATOR — pure logic (testable)
// --------------------------------------------------

/**
 * Evaluates a simple arithmetic expression string.
 * Supports: numbers, +, -, *, /, decimal points.
 * Returns a number, or "Error" on invalid input.
 *
 * @param {string} expression
 * @returns {number|string}
 */
function calculateExpression(expression) {
  if (typeof expression !== "string" || expression.trim() === "") {
    return "Error";
  }

  // Only allow safe characters: digits, operators, dot, whitespace
  if (!/^[\d\s+\-*/.]+$/.test(expression)) {
    return "Error";
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expression + ")")();
    if (typeof result !== "number" || !isFinite(result) || isNaN(result)) {
      return "Error";
    }
    return result;
  } catch {
    return "Error";
  }
}

function calculateResult() {
  if (!currentExpression) return;
  const result = calculateExpression(currentExpression);
  currentExpression = String(result);
  updateDisplay();
}

// --------------------------------------------------
// SIMULTANEOUS EQUATION SOLVER — pure logic (testable)
// --------------------------------------------------

/**
 * Solves a 2×2 system of linear equations using Cramer's Rule:
 *   a*x + b*y = c
 *   d*x + e*y = f
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} f
 * @returns {{ x: number, y: number }|{ error: string }}
 */
function solveSimultaneous(a, b, c, d, e, f) {
  // Validate all inputs are finite numbers
  const inputs = [a, b, c, d, e, f];
  for (const n of inputs) {
    if (typeof n !== "number" || !isFinite(n)) {
      return { error: "All coefficients must be finite numbers." };
    }
  }

  const det = a * e - b * d;          // determinant of coefficient matrix

  if (det === 0) {
    return { error: "No unique solution — equations are parallel or identical." };
  }

  const x = (c * e - b * f) / det;
  const y = (a * f - c * d) / det;

  return { x, y };
}

// --------------------------------------------------
// SIMULTANEOUS EQUATION SOLVER — UI glue
// --------------------------------------------------
function solveAndDisplay() {
  const ids = ["a", "b", "c", "d", "e", "f"];
  const vals = ids.map((id) => parseFloat(document.getElementById(id).value));

  const resultBox = document.getElementById("solver-result");

  // Check for empty / non-numeric fields
  if (vals.some(isNaN)) {
    resultBox.className = "solver-result error";
    resultBox.textContent = "Please fill in all six coefficient fields.";
    return;
  }

  const [a, b, c, d, e, f] = vals;
  const solution = solveSimultaneous(a, b, c, d, e, f);

  if (solution.error) {
    resultBox.className = "solver-result error";
    resultBox.textContent = solution.error;
  } else {
    const xRounded = Math.round(solution.x * 1e10) / 1e10;
    const yRounded = Math.round(solution.y * 1e10) / 1e10;
    resultBox.className = "solver-result success";
    resultBox.textContent = `x = ${xRounded},  y = ${yRounded}`;
  }
}

// --------------------------------------------------
// MODULE EXPORT — lets Jest import without a browser
// --------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateExpression, solveSimultaneous };
}
