/**
 * JavaScript Learning Lab - Assignment Logic Module
 * Provides pure, testable implementations of Assignments 1 through 6.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabAssignments = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // ASSIGNMENT 1: Variables and Data Types
  function runAssignment1() {
    var name = "Alice";
    let age = 25;
    const isEmployed = true;
    const skills = ["HTML", "CSS", "JavaScript"];

    const lines = [
      `Name: ${name} (Type: ${typeof name})`,
      `Age: ${age} (Type: ${typeof age})`,
      `IsEmployed: ${isEmployed} (Type: ${typeof isEmployed})`,
      `Skills: ${JSON.stringify(skills)} (Type: ${typeof skills})`
    ];

    return {
      variables: { name, age, isEmployed, skills },
      types: {
        nameType: typeof name,
        ageType: typeof age,
        isEmployedType: typeof isEmployed,
        skillsType: typeof skills
      },
      output: lines.join("\n")
    };
  }

  const assignment1Expected = [
    'Name: Alice (Type: string)',
    'Age: 25 (Type: number)',
    'IsEmployed: true (Type: boolean)',
    'Skills: ["HTML","CSS","JavaScript"] (Type: object)'
  ].join("\n");

  // ASSIGNMENT 2: Operators and Input Handling
  function calculateTip(subtotalInput, tipPercentInput) {
    if (subtotalInput === "" || subtotalInput === null || subtotalInput === undefined ||
        tipPercentInput === "" || tipPercentInput === null || tipPercentInput === undefined) {
      throw new Error("Inputs cannot be blank.");
    }

    const subtotal = Number(subtotalInput);
    const tipPercent = Number(tipPercentInput);

    if (isNaN(subtotal) || isNaN(tipPercent)) {
      throw new Error("Subtotal and tip percentage must be valid numeric values.");
    }
    if (subtotal < 0) {
      throw new Error("Subtotal cannot be negative.");
    }
    if (tipPercent < 0 || tipPercent > 100) {
      throw new Error("Tip percentage must be between 0% and 100%.");
    }

    const tip = Math.round((subtotal * (tipPercent / 100)) * 100) / 100;
    const total = Math.round((subtotal + tip) * 100) / 100;

    const formatMoney = (val) => {
      return Number.isInteger(val) ? `$${val}` : `$${val.toFixed(2).replace(/\.00$/, '')}`;
    };

    const lines = [
      `Subtotal: ${formatMoney(subtotal)}`,
      `Tip Percentage: ${tipPercent}%`,
      `Calculated Tip: ${formatMoney(tip)}`,
      `Total Amount to Pay: ${formatMoney(total)}`
    ];

    return {
      subtotal,
      tipPercent,
      tip,
      total,
      output: lines.join("\n")
    };
  }

  const assignment2Expected = [
    'Subtotal: $100',
    'Tip Percentage: 15%',
    'Calculated Tip: $15',
    'Total Amount to Pay: $115'
  ].join("\n");

  // ASSIGNMENT 3: Conditional Statements
  function evaluateGrade(scoreInput) {
    if (scoreInput === "" || scoreInput === null || scoreInput === undefined) {
      throw new Error("Score cannot be blank.");
    }

    const score = Number(scoreInput);
    if (isNaN(score)) {
      throw new Error("Score must be a valid number.");
    }
    if (score < 0 || score > 100) {
      throw new Error(`Invalid score: ${score}. Score must be between 0 and 100.`);
    }

    // Letter grade selection using switch
    let grade;
    switch (true) {
      case (score >= 90 && score <= 100):
        grade = "A";
        break;
      case (score >= 80 && score < 90):
        grade = "B";
        break;
      case (score >= 70 && score < 80):
        grade = "C";
        break;
      case (score >= 60 && score < 70):
        grade = "D";
        break;
      default:
        grade = "F";
        break;
    }

    // Pass/fail status using ternary operator
    const status = grade !== "F" ? "Passed" : "Failed";

    const lines = [
      `Score: ${score}`,
      `Grade: ${grade}`,
      `Status: ${status}`
    ];

    return {
      score,
      grade,
      status,
      output: lines.join("\n")
    };
  }

  const assignment3Expected = [
    'Score: 85',
    'Grade: B',
    'Status: Passed'
  ].join("\n");

  // ASSIGNMENT 4: Loops and Flow Control
  function runAssignment4() {
    const lines = [];

    // 1. For loop: multiplication table of 5 from 1 to 5
    lines.push("--- Multiplication Table of 5 ---");
    for (let i = 1; i <= 5; i++) {
      lines.push(`5 x ${i} = ${5 * i}`);
    }

    // 2. While loop: first number > 10 divisible by 6, using break
    lines.push("");
    lines.push("--- First number > 10 divisible by 6 ---");
    let num = 11;
    let found = null;
    while (true) {
      if (num % 6 === 0) {
        found = num;
        break;
      }
      num++;
    }
    lines.push(`Found: ${found}`);

    // 3. Do...while loop: skip selected numbers using continue
    lines.push("");
    lines.push("--- Do...While Loop (Skip 3 with continue) ---");
    let count = 0;
    do {
      count++;
      if (count === 3) {
        continue;
      }
      lines.push(`Remaining Number: ${count}`);
    } while (count < 5);

    return {
      multiplicationResult: [5, 10, 15, 20, 25],
      foundNumber: found,
      output: lines.join("\n")
    };
  }

  const assignment4Expected = [
    '--- Multiplication Table of 5 ---',
    '5 x 1 = 5',
    '5 x 2 = 10',
    '5 x 3 = 15',
    '5 x 4 = 20',
    '5 x 5 = 25',
    '',
    '--- First number > 10 divisible by 6 ---',
    'Found: 12',
    '',
    '--- Do...While Loop (Skip 3 with continue) ---',
    'Remaining Number: 1',
    'Remaining Number: 2',
    'Remaining Number: 4',
    'Remaining Number: 5'
  ].join("\n");

  // ASSIGNMENT 5: Functions and Scope
  function calculateStandardArea(length = 5, width = 4) {
    return length * width;
  }

  const calculateArrowArea = (length, width) => length * width;

  function runAssignment5(customLength = 10, customWidth = 3) {
    const standardArea = calculateStandardArea(); // uses default 5 x 4
    const arrowArea = calculateArrowArea(customLength, customWidth);

    let scopeError = "";
    try {
      {
        let blockVar = "Declared inside block scope";
      }
      // Accessing blockVar outside its block scope throws ReferenceError
      // eslint-disable-next-line no-undef
      const attempt = blockVar;
    } catch (err) {
      scopeError = `${err.name}: ${err.message}`;
    }

    const lines = [
      `Standard Function Area (Default 5 x 4): ${standardArea}`,
      `Arrow Function Area (Custom ${customLength} x ${customWidth}): ${arrowArea}`,
      `Scope Test Error: ${scopeError}`
    ];

    return {
      standardArea,
      arrowArea,
      scopeError,
      output: lines.join("\n")
    };
  }

  const assignment5Expected = [
    'Standard Function Area (Default 5 x 4): 20',
    'Arrow Function Area (Custom 10 x 3): 30',
    'Scope Test Error: ReferenceError: blockVar is not defined'
  ].join("\n");

  // ASSIGNMENT 6: Array Methods
  function runAssignment6() {
    const products = [
      { name: "Laptop", price: 800 },
      { name: "Mouse", price: 25 },
      { name: "Keyboard", price: 45 }
    ];

    const lines = [];

    // 1. forEach() to display every product
    lines.push("--- All Products (forEach) ---");
    products.forEach(item => {
      lines.push(`Item: ${item.name} - Price: $${item.price}`);
    });

    // 2. filter() to find products under $50
    lines.push("");
    lines.push("--- Filtered Products (Price < $50) ---");
    const filtered = products.filter(p => p.price < 50);
    filtered.forEach(p => {
      lines.push(`${p.name}: $${p.price}`);
    });

    // 3. map() to create uppercase name-price strings
    lines.push("");
    lines.push("--- Mapped Product Tags (map) ---");
    const mapped = products.map(p => `${p.name.toUpperCase()} costs $${p.price}`);
    mapped.forEach(str => {
      lines.push(str);
    });

    return {
      products,
      filtered,
      mapped,
      output: lines.join("\n")
    };
  }

  const assignment6Expected = [
    '--- All Products (forEach) ---',
    'Item: Laptop - Price: $800',
    'Item: Mouse - Price: $25',
    'Item: Keyboard - Price: $45',
    '',
    '--- Filtered Products (Price < $50) ---',
    'Mouse: $25',
    'Keyboard: $45',
    '',
    '--- Mapped Product Tags (map) ---',
    'LAPTOP costs $800',
    'MOUSE costs $25',
    'KEYBOARD costs $45'
  ].join("\n");

  return {
    runAssignment1,
    assignment1Expected,
    calculateTip,
    assignment2Expected,
    evaluateGrade,
    assignment3Expected,
    runAssignment4,
    assignment4Expected,
    calculateStandardArea,
    calculateArrowArea,
    runAssignment5,
    assignment5Expected,
    runAssignment6,
    assignment6Expected
  };
}));
