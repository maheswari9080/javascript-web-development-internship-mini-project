/**
 * JavaScript Learning Lab - Dashboard Module
 * Manages overview cards, learning progress metrics, and navigation shortcuts.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LabDashboard = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const ASSIGNMENTS_META = [
    {
      id: "assignment-1",
      number: "1",
      title: "Variables & Data Types",
      concept: "var, let, const, typeof, JSON array",
      targetView: "assignment-1"
    },
    {
      id: "assignment-2",
      number: "2",
      title: "Operators & Input Handling",
      concept: "Arithmetic operators, Number(), tip calculation",
      targetView: "assignment-2"
    },
    {
      id: "assignment-3",
      number: "3",
      title: "Conditional Statements",
      concept: "if...else validation, switch grades, ternary status",
      targetView: "assignment-3"
    },
    {
      id: "assignment-4",
      number: "4",
      title: "Loops & Flow Control",
      concept: "for multiplication, while break, do...while continue",
      targetView: "assignment-4"
    },
    {
      id: "assignment-5",
      number: "5",
      title: "Functions & Scope",
      concept: "Default parameters, arrow syntax, ReferenceError catch",
      targetView: "assignment-5"
    },
    {
      id: "assignment-6",
      number: "6",
      title: "Array Methods",
      concept: "forEach() listing, filter() < $50, map() formatting",
      targetView: "assignment-6"
    },
    {
      id: "capstone",
      number: "★",
      title: "Capstone: Smart Inventory",
      concept: "reduce(), CRUD, categorization, tax/discount estimates",
      targetView: "capstone"
    }
  ];

  class DashboardManager {
    constructor(runner, inventoryManager) {
      this.runner = runner;
      this.inventoryManager = inventoryManager;
    }

    /**
     * Compute statistics for the dashboard view
     */
    getSummary() {
      const progress = this.runner ? this.runner.getProgress() : { total: 7, completed: 0, matching: 0, percentage: 0 };
      const inventoryAnalytics = this.inventoryManager ? this.inventoryManager.getAnalytics() : { totalCount: 0, totalValue: 0 };

      return {
        totalAssignments: ASSIGNMENTS_META.length,
        completedCount: progress.completed,
        matchingCount: progress.matching,
        progressPercentage: Math.round((progress.completed / ASSIGNMENTS_META.length) * 100),
        inventoryProductCount: inventoryAnalytics.totalCount,
        inventoryTotalValue: inventoryAnalytics.totalValue,
        assignments: ASSIGNMENTS_META.map(meta => {
          const registered = this.runner ? this.runner.assignments[meta.id] : null;
          return {
            ...meta,
            status: registered ? registered.status : "idle",
            isMatching: registered && registered.comparison ? registered.comparison.match : false
          };
        })
      };
    }
  }

  return {
    ASSIGNMENTS_META,
    DashboardManager
  };
}));
