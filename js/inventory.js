/**
 * JavaScript Learning Lab - Inventory Management & Analytics Engine
 * Capstone Project: Smart Product Inventory
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InventoryModule = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Initial demonstration products
  const DEFAULT_PRODUCTS = [
    { id: 1, name: "Laptop", price: 800 },
    { id: 2, name: "Mouse", price: 25 }
  ];

  /**
   * Determine product category using conditional statements (if-else and switch)
   * Budget: < $50
   * Standard: >= $50 and < $200
   * Premium: >= $200
   */
  function categorizeProduct(price) {
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
      throw new Error("Invalid price for categorization");
    }

    // Meaningful use of switch with conditional expressions
    let category;
    switch (true) {
      case price < 50:
        category = "Budget";
        break;
      case price < 200:
        category = "Standard";
        break;
      default:
        category = "Premium";
        break;
    }
    return category;
  }

  /**
   * InventoryManager class to encapsulate state and operations
   */
  class InventoryManager {
    constructor(initialItems = DEFAULT_PRODUCTS) {
      this.nextId = 1;
      this.products = [];
      this.reset(initialItems);
    }

    /**
     * Reset inventory to provided or default products
     */
    reset(items = DEFAULT_PRODUCTS) {
      this.products = items.map(p => ({
        id: this.nextId++,
        name: String(p.name).trim(),
        price: Number(p.price)
      }));
      return this.getAll();
    }

    /**
     * Clear all inventory items (for testing empty states)
     */
    clear() {
      this.products = [];
      return this.products;
    }

    /**
     * Validate product input
     */
    static validateProduct(name, price) {
      const errors = [];
      const trimmedName = typeof name === 'string' ? name.trim() : '';

      if (!trimmedName) {
        errors.push("Product name cannot be empty.");
      }

      if (price === "" || price === null || price === undefined) {
        errors.push("Product price cannot be empty.");
      } else {
        const numPrice = Number(price);
        if (isNaN(numPrice)) {
          errors.push("Product price must be a valid number.");
        } else if (numPrice <= 0) {
          errors.push("Product price must be greater than zero.");
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitized: {
          name: trimmedName,
          price: Number(price)
        }
      };
    }

    /**
     * Add a product to inventory
     */
    addProduct(name, price) {
      const validation = InventoryManager.validateProduct(name, price);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(" "));
      }

      const newProduct = {
        id: this.nextId++,
        name: validation.sanitized.name,
        price: validation.sanitized.price
      };

      this.products.push(newProduct);
      return newProduct;
    }

    /**
     * Remove a product by ID
     */
    removeProduct(id) {
      const numId = Number(id);
      const index = this.products.findIndex(p => p.id === numId);
      if (index === -1) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      const removed = this.products.splice(index, 1)[0];
      return removed;
    }

    /**
     * Retrieve all products with their evaluated categories
     */
    getAll() {
      return this.products.map(p => ({
        ...p,
        category: categorizeProduct(p.price)
      }));
    }

    /**
     * Query products with search, category filter, and sorting
     */
    query({ search = "", category = "all", sortBy = "none" } = {}) {
      let result = this.getAll();

      // Search filter
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(query));
      }

      // Category filter
      if (category && category.toLowerCase() !== "all") {
        const cat = category.toLowerCase();
        result = result.filter(p => p.category.toLowerCase() === cat);
      }

      // Sorting
      if (sortBy === "name-asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "name-desc") {
        result.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortBy === "price-asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        result.sort((a, b) => b.price - a.price);
      }

      return result;
    }

    /**
     * Analytics calculations using reduce(), filter(), map(), and forEach()
     */
    getAnalytics() {
      const count = this.products.length;

      // reduce() for total inventory value
      const totalValue = this.products.reduce((acc, p) => acc + p.price, 0);

      // filter() for affordable items below $200
      const affordableItems = this.products
        .filter(p => p.price < 200)
        .map(p => p.name);

      // filter() for premium items (>= $200)
      const premiumItems = this.products.filter(p => p.price >= 200);

      // Average price
      const averagePrice = count > 0 ? (totalValue / count) : 0;

      // Highest and lowest priced products
      let highestProduct = null;
      let lowestProduct = null;
      if (count > 0) {
        highestProduct = this.products.reduce((prev, curr) => (curr.price > prev.price ? curr : prev), this.products[0]);
        lowestProduct = this.products.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), this.products[0]);
      }

      // map() for formatted report list tags
      const formattedReportList = this.products.map(p => `${p.name.toUpperCase()}: $${p.price}`);

      return {
        totalCount: count,
        totalValue,
        affordableItems,
        premiumCount: premiumItems.length,
        averagePrice,
        highestProduct: highestProduct ? { ...highestProduct, category: categorizeProduct(highestProduct.price) } : null,
        lowestProduct: lowestProduct ? { ...lowestProduct, category: categorizeProduct(lowestProduct.price) } : null,
        formattedReportList
      };
    }

    /**
     * Financial projection with configurable tax and discount percentages.
     * Crucial: never mutates stored product prices or base inventory total.
     */
    calculateFinancialEstimate(taxPercent = 0, discountPercent = 0) {
      const t = Number(taxPercent);
      const d = Number(discountPercent);

      if (isNaN(t) || t < 0 || t > 100) {
        throw new Error("Tax percentage must be a number between 0 and 100.");
      }
      if (isNaN(d) || d < 0 || d > 100) {
        throw new Error("Discount percentage must be a number between 0 and 100.");
      }

      const baseValue = this.products.reduce((sum, p) => sum + p.price, 0);
      const discountAmount = Math.round(baseValue * (d / 100) * 100) / 100;
      const subtotalAfterDiscount = Math.round((baseValue - discountAmount) * 100) / 100;
      const taxAmount = Math.round(subtotalAfterDiscount * (t / 100) * 100) / 100;
      const estimatedTotal = Math.round((subtotalAfterDiscount + taxAmount) * 100) / 100;

      return {
        baseValue,
        discountPercent: d,
        discountAmount,
        subtotalAfterDiscount,
        taxPercent: t,
        taxAmount,
        estimatedTotal
      };
    }

    /**
     * Deterministic Capstone verification run matching section 11 specifications
     */
    static runVerificationDemo() {
      const manager = new InventoryManager([
        { id: 1, name: "Laptop", price: 800 },
        { id: 2, name: "Mouse", price: 25 }
      ]);

      const logLines = [];
      logLines.push("--- Initializing Inventory System ---");
      logLines.push("[Demo Input: Monitor, $150]");

      // Add demo product Monitor $150
      manager.addProduct("Monitor", 150);

      logLines.push("");
      logLines.push("--- Processing Inventory Roster ---");

      // forEach() to format roster items
      manager.getAll().forEach(p => {
        logLines.push(`Item: ${p.name} ($${p.price}) -> Category: ${p.category}`);
      });

      const analytics = manager.getAnalytics();

      const formatJsonArray = (arr) => '[' + arr.map(item => JSON.stringify(item)).join(', ') + ']';

      logLines.push("");
      logLines.push("--- Financial Analytics ---");
      logLines.push(`Total Products: ${analytics.totalCount}`);
      logLines.push(`Total Inventory Value: $${analytics.totalValue}`);
      logLines.push(`Affordable Items (Under $200): ${formatJsonArray(analytics.affordableItems)}`);
      logLines.push(`Formatted Report List: ${formatJsonArray(analytics.formattedReportList)}`);

      return {
        manager,
        analytics,
        output: logLines.join("\n")
      };
    }
  }

  const capstoneExpectedOutput = [
    '--- Initializing Inventory System ---',
    '[Demo Input: Monitor, $150]',
    '',
    '--- Processing Inventory Roster ---',
    'Item: Laptop ($800) -> Category: Premium',
    'Item: Mouse ($25) -> Category: Budget',
    'Item: Monitor ($150) -> Category: Standard',
    '',
    '--- Financial Analytics ---',
    'Total Products: 3',
    'Total Inventory Value: $975',
    'Affordable Items (Under $200): ["Mouse", "Monitor"]',
    'Formatted Report List: ["LAPTOP: $800", "MOUSE: $25", "MONITOR: $150"]'
  ].join("\n");

  return {
    DEFAULT_PRODUCTS,
    categorizeProduct,
    InventoryManager,
    capstoneExpectedOutput
  };
}));
