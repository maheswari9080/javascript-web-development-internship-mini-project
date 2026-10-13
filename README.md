# JavaScript Practical Learning Lab & Smart Inventory Analytics System

A comprehensive, zero-dependency educational laboratory and interactive analytics system built with vanilla JavaScript (ES6+), semantic HTML5, and modern CSS3.

## Project Structure

```text
javascript-learning-lab/
├── index.html                  # Accessible, responsive learning laboratory interface
├── css/
│   └── style.css               # Minimal developer-tool dark theme and responsive layout
├── js/
│   ├── assignments.js          # Core implementations for Assignments 1 through 6
│   ├── execution-engine.js     # Controlled execution runner, diff comparator, and state tracker
│   ├── inventory.js            # Capstone Smart Inventory manager, categories, analytics & estimates
│   ├── dashboard.js            # Dashboard coordinator and progress aggregation
│   └── main.js                 # UI events, DOM bindings, and live browser test runner
├── tests/
│   └── assignments.test.js     # 27 Node.js native automated tests (node:test & node:assert)
├── package.json                # Project manifest and test runner script
└── README.md                   # Setup guide, test execution instructions, and system specs
```

---

## Features & Modules

### 1. Core Assignments
- **Assignment 1 — Variables & Data Types:** Demonstrates `var`, `let`, `const`, primitive types, array reference, `typeof`, and JSON array serialization.
- **Assignment 2 — Operators & Input Handling:** Restaurant tip calculator with numeric conversion via `Number()`, positive value validation, arithmetic/assignment operators, and currency formatting.
- **Assignment 3 — Conditional Statements:** Student grading engine using `if...else` input bounds validation (0–100), `switch` statement for letter grades (A, B, C, D, F), and ternary operator for pass/fail status.
- **Assignment 4 — Loops & Flow Control:** Independent demonstrations of `for` loop multiplication table, `while` loop finding first number > 10 divisible by 6 using `break`, and `do...while` loop skipping selected values with `continue`.
- **Assignment 5 — Functions & Scope:** Standard functions with default parameters, arrow functions, and controlled try/catch handling of block-scope `ReferenceError`.
- **Assignment 6 — Array Methods:** Real array operations on product data using `forEach()` for listing, `filter()` for items under $50, and `map()` for uppercase tags.

### 2. Capstone: Smart Product Inventory
- **CRUD & Categorization:** Add products with strict validation (rejects blank, non-numeric, or non-positive values); remove products with confirmation modal.
- **Tiered Classification:**
  - **Budget:** Price < $50 (e.g. $49.99)
  - **Standard:** Price $50 to < $200 (e.g. $50, $150, $199.99)
  - **Premium:** Price $\ge$ $200 (e.g. $200, $800)
- **Analytics Metrics:** Calculates total item count, total inventory value using `reduce()`, affordable items (< $200) using `filter()`, premium item count, average price, highest-priced item, and lowest-priced item.
- **Search, Filter & Sort:** Real-time search by name, category dropdown filter, and bidirectional sorting by name (A–Z, Z–A) and price (low–high, high–low).
- **Financial Estimator:** Optional tax and discount calculations that project adjusted values without modifying base inventory or mutating product prices.
- **Section 11 Deterministic Fixture:** One-click automated verification adding `Monitor ($150)` producing the exact expected verification log.

### 3. Automated Test Center
- **Node.js Test Runner:** Built-in native testing with `node --test tests/assignments.test.js`.
- **In-Browser Test Runner:** Live, real-time client-side test execution covering 27 assertions with microsecond timers, pass/fail status badges, and no hardcoded data.

---

## Running the Application

### 1. View in Browser
No build tools or web servers are required. Open `index.html` directly in any modern browser:
- Double-click `index.html` in your file explorer, or
- Open `file:///D:/current%20project/js/mw/index.html` in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

Or serve via any static HTTP server:
```bash
npx serve .
# or
python -m http.server 8080
```

### 2. Run Automated Tests
Execute the native Node.js automated test suite:
```bash
npm test
```
Or directly:
```bash
node --test tests/assignments.test.js
```

---

## Test Verification Summary

Latest test suite execution:
- **Total Test Suites:** 8
- **Total Tests:** 27
- **Passed:** 27
- **Failed:** 0
- **Duration:** ~270 ms
"# javascript-web-development-internship-mini-project" 
