/**
 * Automated Test Suite for JavaScript Practical Learning Lab & Smart Inventory Analytics
 * Uses Node.js built-in test runner (`node:test`) and `node:assert/strict`.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  runAssignment1,
  calculateTip,
  evaluateGrade,
  runAssignment4,
  calculateStandardArea,
  calculateArrowArea,
  runAssignment5,
  runAssignment6,
  assignment1Expected,
  assignment2Expected,
  assignment3Expected,
  assignment4Expected,
  assignment5Expected,
  assignment6Expected
} = require('../js/assignments.js');

const {
  categorizeProduct,
  InventoryManager,
  capstoneExpectedOutput
} = require('../js/inventory.js');

const { Runner } = require('../js/execution-engine.js');

describe('Assignment 1: Variables and Data Types', () => {
  test('returns expected variable values and runtime types', () => {
    const res = runAssignment1();
    assert.equal(res.variables.name, "Alice");
    assert.equal(res.types.nameType, "string");

    assert.equal(res.variables.age, 25);
    assert.equal(res.types.ageType, "number");

    assert.equal(res.variables.isEmployed, true);
    assert.equal(res.types.isEmployedType, "boolean");

    assert.deepEqual(res.variables.skills, ["HTML", "CSS", "JavaScript"]);
    assert.equal(res.types.skillsType, "object");
  });

  test('formats expected output string correctly', () => {
    const res = runAssignment1();
    assert.equal(res.output.trim(), assignment1Expected.trim());
  });
});

describe('Assignment 2: Operators and Input Handling', () => {
  test('correctly calculates tip and total for valid numbers', () => {
    const res = calculateTip(100, 15);
    assert.equal(res.subtotal, 100);
    assert.equal(res.tipPercent, 15);
    assert.equal(res.tip, 15);
    assert.equal(res.total, 115);
    assert.equal(res.output.trim(), assignment2Expected.trim());
  });

  test('correctly handles decimal calculations', () => {
    const res = calculateTip("50.50", "20");
    assert.equal(res.tip, 10.1);
    assert.equal(res.total, 60.6);
  });

  test('rejects blank inputs', () => {
    assert.throws(() => calculateTip("", 15), /blank/i);
    assert.throws(() => calculateTip(100, ""), /blank/i);
  });

  test('rejects non-numeric inputs', () => {
    assert.throws(() => calculateTip("abc", 15), /numeric/i);
    assert.throws(() => calculateTip(100, "xyz"), /numeric/i);
  });

  test('rejects negative subtotal', () => {
    assert.throws(() => calculateTip(-50, 15), /negative/i);
  });

  test('rejects invalid tip percentages (< 0 or > 100)', () => {
    assert.throws(() => calculateTip(100, -5), /between 0% and 100%/i);
    assert.throws(() => calculateTip(100, 105), /between 0% and 100%/i);
  });
});

describe('Assignment 3: Conditional Statements (Grades)', () => {
  test('computes letter grade and pass/fail for tested boundaries', () => {
    // Score 100 -> A, Passed
    const r100 = evaluateGrade(100);
    assert.equal(r100.grade, 'A');
    assert.equal(r100.status, 'Passed');

    // Score 85 -> B, Passed (Section 6 expected demo)
    const r85 = evaluateGrade(85);
    assert.equal(r85.grade, 'B');
    assert.equal(r85.status, 'Passed');
    assert.equal(r85.output.trim(), assignment3Expected.trim());

    // Score 60 -> D, Passed
    const r60 = evaluateGrade(60);
    assert.equal(r60.grade, 'D');
    assert.equal(r60.status, 'Passed');

    // Score 40 -> F, Failed
    const r40 = evaluateGrade(40);
    assert.equal(r40.grade, 'F');
    assert.equal(r40.status, 'Failed');
  });

  test('rejects invalid scores (-1 and 101, non-numeric, blank)', () => {
    assert.throws(() => evaluateGrade(-1), /Invalid score/i);
    assert.throws(() => evaluateGrade(101), /Invalid score/i);
    assert.throws(() => evaluateGrade("invalid"), /valid number/i);
    assert.throws(() => evaluateGrade(""), /blank/i);
  });
});

describe('Assignment 4: Loops and Flow Control', () => {
  test('generates 5 multiplication table from 1 to 5', () => {
    const res = runAssignment4();
    assert.deepEqual(res.multiplicationResult, [5, 10, 15, 20, 25]);
  });

  test('finds first number > 10 divisible by 6 using break', () => {
    const res = runAssignment4();
    assert.equal(res.foundNumber, 12);
  });

  test('ensures loop termination and continue statement execution', () => {
    const res = runAssignment4();
    assert.equal(res.output.trim(), assignment4Expected.trim());
    assert.match(res.output, /Remaining Number: 1/);
    assert.match(res.output, /Remaining Number: 2/);
    assert.doesNotMatch(res.output, /Remaining Number: 3/); // 3 skipped via continue
    assert.match(res.output, /Remaining Number: 4/);
    assert.match(res.output, /Remaining Number: 5/);
  });
});

describe('Assignment 5: Functions and Scope', () => {
  test('evaluates standard function with default and custom arguments', () => {
    assert.equal(calculateStandardArea(), 20); // 5 x 4
    assert.equal(calculateStandardArea(6, 7), 42);
  });

  test('evaluates arrow function area calculator', () => {
    assert.equal(calculateArrowArea(10, 3), 30);
  });

  test('safely catches ReferenceError for block scope test', () => {
    const res = runAssignment5(10, 3);
    assert.equal(res.standardArea, 20);
    assert.equal(res.arrowArea, 30);
    assert.equal(res.scopeError, 'ReferenceError: blockVar is not defined');
    assert.equal(res.output.trim(), assignment5Expected.trim());
  });
});

describe('Assignment 6: Array Methods', () => {
  test('demonstrates forEach, filter, and map on product array', () => {
    const res = runAssignment6();
    assert.equal(res.products.length, 3);
    assert.equal(res.filtered.length, 2); // Mouse ($25) and Keyboard ($45)
    assert.deepEqual(res.filtered.map(p => p.name), ["Mouse", "Keyboard"]);
    assert.deepEqual(res.mapped, [
      "LAPTOP costs $800",
      "MOUSE costs $25",
      "KEYBOARD costs $45"
    ]);
    assert.equal(res.output.trim(), assignment6Expected.trim());
  });
});

describe('Capstone: Smart Product Inventory Engine', () => {
  test('categorizes products according to pricing rules and boundaries', () => {
    // Category boundaries:
    // $49.99 -> Budget
    // $50 -> Standard
    // $199.99 -> Standard
    // $200 -> Premium
    assert.equal(categorizeProduct(49.99), "Budget");
    assert.equal(categorizeProduct(50), "Standard");
    assert.equal(categorizeProduct(199.99), "Standard");
    assert.equal(categorizeProduct(200), "Premium");

    // Additional boundary edge cases
    assert.equal(categorizeProduct(0.01), "Budget");
    assert.equal(categorizeProduct(800), "Premium");
    assert.throws(() => categorizeProduct(0), /Invalid price/i);
    assert.throws(() => categorizeProduct(-10), /Invalid price/i);
    assert.throws(() => categorizeProduct(NaN), /Invalid price/i);
  });

  test('adds valid product and rejects invalid product data', () => {
    const manager = new InventoryManager();
    const initialLen = manager.getAll().length;

    // Valid addition
    const added = manager.addProduct("Monitor", 150);
    assert.equal(added.name, "Monitor");
    assert.equal(added.price, 150);
    assert.equal(manager.getAll().length, initialLen + 1);

    // Invalid product additions
    assert.throws(() => manager.addProduct("", 100), /name cannot be empty/i);
    assert.throws(() => manager.addProduct("   ", 100), /name cannot be empty/i);
    assert.throws(() => manager.addProduct("Tablet", -50), /greater than zero/i);
    assert.throws(() => manager.addProduct("Tablet", 0), /greater than zero/i);
    assert.throws(() => manager.addProduct("Tablet", "invalid"), /valid number/i);
    assert.throws(() => manager.addProduct("Tablet", ""), /price cannot be empty/i);

    // Ensure inventory was not corrupted
    assert.equal(manager.getAll().length, initialLen + 1);
  });

  test('computes analytics using reduce, filter, and map', () => {
    const manager = new InventoryManager([
      { id: 1, name: "Laptop", price: 800 },
      { id: 2, name: "Mouse", price: 25 },
      { id: 3, name: "Monitor", price: 150 }
    ]);

    const analytics = manager.getAnalytics();
    assert.equal(analytics.totalCount, 3);
    assert.equal(analytics.totalValue, 975); // 800 + 25 + 150
    assert.deepEqual(analytics.affordableItems, ["Mouse", "Monitor"]);
    assert.equal(analytics.premiumCount, 1);
    assert.equal(analytics.averagePrice, 325); // 975 / 3
    assert.equal(analytics.highestProduct.name, "Laptop");
    assert.equal(analytics.lowestProduct.name, "Mouse");
    assert.deepEqual(analytics.formattedReportList, [
      "LAPTOP: $800",
      "MOUSE: $25",
      "MONITOR: $150"
    ]);
  });

  test('runs deterministic verification fixture matching Section 11 specifications', () => {
    const demo = InventoryManager.runVerificationDemo();
    assert.equal(demo.analytics.totalCount, 3);
    assert.equal(demo.analytics.totalValue, 975);
    assert.equal(demo.output.trim(), capstoneExpectedOutput.trim());
  });

  test('supports product removal by ID', () => {
    const manager = new InventoryManager([
      { id: 1, name: "Laptop", price: 800 },
      { id: 2, name: "Mouse", price: 25 }
    ]);

    const removed = manager.removeProduct(2);
    assert.equal(removed.name, "Mouse");
    assert.equal(manager.getAll().length, 1);
    assert.throws(() => manager.removeProduct(999), /not found/i);
  });

  test('supports search, filtering, and sorting', () => {
    const manager = new InventoryManager([
      { id: 1, name: "Gaming Laptop", price: 1200 },
      { id: 2, name: "Office Mouse", price: 20 },
      { id: 3, name: "Mechanical Keyboard", price: 90 },
      { id: 4, name: "USB Mousepad", price: 15 }
    ]);

    // Search
    const searchRes = manager.query({ search: "mouse" });
    assert.equal(searchRes.length, 2);

    // Category filter
    const budgetRes = manager.query({ category: "budget" });
    assert.equal(budgetRes.length, 2); // Mouse (20), Mousepad (15)

    // Sort by price ascending
    const sortedAsc = manager.query({ sortBy: "price-asc" });
    assert.equal(sortedAsc[0].price, 15);
    assert.equal(sortedAsc[sortedAsc.length - 1].price, 1200);

    // Sort by name descending
    const sortedNameDesc = manager.query({ sortBy: "name-desc" });
    assert.equal(sortedNameDesc[0].name, "USB Mousepad");
  });

  test('handles empty inventory without runtime errors', () => {
    const manager = new InventoryManager([]);
    manager.clear();

    const analytics = manager.getAnalytics();
    assert.equal(analytics.totalCount, 0);
    assert.equal(analytics.totalValue, 0);
    assert.equal(analytics.averagePrice, 0);
    assert.equal(analytics.highestProduct, null);
    assert.equal(analytics.lowestProduct, null);
    assert.deepEqual(analytics.affordableItems, []);
    assert.deepEqual(analytics.formattedReportList, []);

    const estimate = manager.calculateFinancialEstimate(10, 5);
    assert.equal(estimate.baseValue, 0);
    assert.equal(estimate.estimatedTotal, 0);
  });

  test('calculates financial estimates without mutating base inventory', () => {
    const manager = new InventoryManager([
      { id: 1, name: "Laptop", price: 800 },
      { id: 2, name: "Mouse", price: 200 }
    ]);

    // Base value is 1000
    // Discount 10% -> 1000 - 100 = 900
    // Tax 5% -> 900 + 45 = 945
    const est = manager.calculateFinancialEstimate(5, 10);
    assert.equal(est.baseValue, 1000);
    assert.equal(est.discountAmount, 100);
    assert.equal(est.subtotalAfterDiscount, 900);
    assert.equal(est.taxAmount, 45);
    assert.equal(est.estimatedTotal, 945);

    // Ensure inventory was NOT mutated
    assert.equal(manager.getAnalytics().totalValue, 1000);

    // Invalid percentages
    assert.throws(() => manager.calculateFinancialEstimate(-5, 10), /Tax percentage/i);
    assert.throws(() => manager.calculateFinancialEstimate(105, 10), /Tax percentage/i);
    assert.throws(() => manager.calculateFinancialEstimate(5, -1), /Discount percentage/i);
    assert.throws(() => manager.calculateFinancialEstimate(5, 101), /Discount percentage/i);
  });
});

describe('Execution Engine & Diffing', () => {
  test('registers and executes assignments cleanly', () => {
    const runner = new Runner();
    runner.register('a1', {
      name: 'Variables',
      expectedOutput: assignment1Expected,
      runFn: () => runAssignment1().output
    });

    const res = runner.execute('a1');
    assert.equal(res.status, 'success');
    assert.equal(res.comparison.match, true);
  });

  test('detects differences when output differs', () => {
    const runner = new Runner();
    runner.register('diff-test', {
      name: 'Diff Test',
      expectedOutput: 'Expected Line 1\nExpected Line 2',
      runFn: () => 'Expected Line 1\nDifferent Line 2'
    });

    const res = runner.execute('diff-test');
    assert.equal(res.status, 'success');
    assert.equal(res.comparison.match, false);
    assert.equal(res.comparison.diffLines[1].match, false);
  });
});
