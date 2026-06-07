"use strict";

const { calculateExpression, solveSimultaneous } = require("../script.js");

// ================================================
//  BASIC CALCULATOR TESTS
// ================================================

describe("calculateExpression()", () => {

  // --- Addition ---
  test("adds two integers", () => {
    expect(calculateExpression("2+3")).toBe(5);
  });

  test("adds decimals correctly", () => {
    expect(calculateExpression("1.5+2.5")).toBe(4);
  });

  // --- Subtraction ---
  test("subtracts correctly", () => {
    expect(calculateExpression("10-4")).toBe(6);
  });

  test("returns negative when result is negative", () => {
    expect(calculateExpression("3-9")).toBe(-6);
  });

  // --- Multiplication ---
  test("multiplies correctly", () => {
    expect(calculateExpression("6*7")).toBe(42);
  });

  test("multiplies by zero", () => {
    expect(calculateExpression("99*0")).toBe(0);
  });

  // --- Division ---
  test("divides correctly", () => {
    expect(calculateExpression("20/4")).toBe(5);
  });

  test("returns Error on division by zero", () => {
    expect(calculateExpression("5/0")).toBe("Error");
  });

  // --- Decimal ---
  test("handles decimal input", () => {
    expect(calculateExpression("0.1+0.2")).toBeCloseTo(0.3);
  });

  // --- Edge cases ---
  test("returns Error for empty string", () => {
    expect(calculateExpression("")).toBe("Error");
  });

  test("returns Error for letters", () => {
    expect(calculateExpression("abc")).toBe("Error");
  });

  test("returns Error for letter-based input", () => {
    expect(calculateExpression("2+x")).toBe("Error");
  });
});

// ================================================
//  SIMULTANEOUS EQUATION SOLVER TESTS
// ================================================

describe("solveSimultaneous()", () => {

  // --- Happy path ---
  test("solves a standard 2x2 system", () => {
    // 2x + 3y = 8
    // 5x +  y = 7
    const result = solveSimultaneous(2, 3, 8, 5, 1, 7);
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(2);
  });

  test("solves when x is negative", () => {
    //  x + 2y =  4
    // 3x +  y = -3
    const result = solveSimultaneous(1, 2, 4, 3, 1, -3);
    expect(result.x).toBeCloseTo(-2);
    expect(result.y).toBeCloseTo(3);
  });

  test("solves when coefficients include negatives", () => {
    // -x + y = 2
    //  x + y = 4
    const result = solveSimultaneous(-1, 1, 2, 1, 1, 4);
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(3);
  });

  test("solves when solution contains decimals", () => {
    // 2x + 4y = 5
    // 3x -  y = 1
    const result = solveSimultaneous(2, 4, 5, 3, -1, 1);
    expect(result.x).toBeCloseTo(0.6428, 3);
    expect(result.y).toBeCloseTo(0.9286, 3);
  });

  test("solves when both answers are zero", () => {
    // x + y = 0
    // x - y = 0
    const result = solveSimultaneous(1, 1, 0, 1, -1, 0);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
  });

  // --- Error cases ---
  test("returns error when determinant is zero (parallel lines)", () => {
    // 2x + 4y = 6
    // x  + 2y = 3  (same line, infinite solutions)
    const result = solveSimultaneous(2, 4, 6, 1, 2, 3);
    expect(result.error).toBeDefined();
  });

  test("returns error for non-finite coefficient", () => {
    const result = solveSimultaneous(Infinity, 1, 2, 3, 4, 5);
    expect(result.error).toBeDefined();
  });

  test("returns error for NaN coefficient", () => {
    const result = solveSimultaneous(NaN, 1, 2, 3, 4, 5);
    expect(result.error).toBeDefined();
  });

  test("returns object with x and y keys on success", () => {
    const result = solveSimultaneous(1, 0, 3, 0, 1, 5);
    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");
  });
});
