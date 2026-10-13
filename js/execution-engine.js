/**
 * JavaScript Learning Lab - Execution Engine
 * Safe, controlled runner for assignments with status tracking and line-by-line output diffing.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ExecutionEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  class Runner {
    constructor() {
      this.assignments = {};
      this.history = [];
    }

    /**
     * Register an assignment runner with metadata and expected output
     */
    register(id, { name, description, expectedOutput, runFn, resetFn = null }) {
      this.assignments[id] = {
        id,
        name,
        description,
        expectedOutput: (expectedOutput || "").trim(),
        runFn,
        resetFn,
        status: "idle", // 'idle' | 'running' | 'success' | 'error'
        lastOutput: "",
        lastError: null,
        lastExecutionMs: 0,
        comparison: null // { match: boolean, diff: Array<{line: number, expected: string, actual: string, match: boolean}> }
      };
    }

    /**
     * Execute a registered assignment safely
     */
    execute(id, ...args) {
      const item = this.assignments[id];
      if (!item) {
        throw new Error(`Assignment with ID "${id}" is not registered.`);
      }

      const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      item.status = "running";
      item.lastError = null;

      try {
        const result = item.runFn(...args);
        const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        item.lastExecutionMs = Math.round((endTime - startTime) * 100) / 100;

        let outputStr = "";
        if (typeof result === 'string') {
          outputStr = result;
        } else if (result && typeof result.output === 'string') {
          outputStr = result.output;
        } else {
          outputStr = JSON.stringify(result, null, 2);
        }

        item.lastOutput = outputStr.trim();
        item.status = "success";
        item.comparison = this.compare(id);

        this.history.push({
          id,
          timestamp: new Date().toISOString(),
          status: "success",
          executionMs: item.lastExecutionMs
        });

        return {
          id,
          status: "success",
          output: item.lastOutput,
          executionMs: item.lastExecutionMs,
          comparison: item.comparison,
          result
        };
      } catch (err) {
        const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        item.lastExecutionMs = Math.round((endTime - startTime) * 100) / 100;
        item.status = "error";
        item.lastError = err.message || String(err);
        item.lastOutput = `[Execution Error]: ${item.lastError}`;
        item.comparison = { match: false, diffText: `Error: ${item.lastError}` };

        this.history.push({
          id,
          timestamp: new Date().toISOString(),
          status: "error",
          error: item.lastError,
          executionMs: item.lastExecutionMs
        });

        return {
          id,
          status: "error",
          error: item.lastError,
          output: item.lastOutput,
          executionMs: item.lastExecutionMs,
          comparison: item.comparison
        };
      }
    }

    /**
     * Reset an assignment state
     */
    reset(id) {
      const item = this.assignments[id];
      if (!item) return;

      item.status = "idle";
      item.lastOutput = "";
      item.lastError = null;
      item.comparison = null;
      item.lastExecutionMs = 0;

      if (typeof item.resetFn === 'function') {
        item.resetFn();
      }

      return item;
    }

    /**
     * Compare actual output to expected output
     */
    compare(id) {
      const item = this.assignments[id];
      if (!item) return null;

      const actualLines = (item.lastOutput || "").split(/\r?\n/);
      const expectedLines = (item.expectedOutput || "").split(/\r?\n/);

      const maxLen = Math.max(actualLines.length, expectedLines.length);
      const diffLines = [];
      let isIdentical = true;

      for (let i = 0; i < maxLen; i++) {
        const expected = expectedLines[i] !== undefined ? expectedLines[i] : null;
        const actual = actualLines[i] !== undefined ? actualLines[i] : null;
        const lineMatch = expected === actual;

        if (!lineMatch) {
          isIdentical = false;
        }

        diffLines.push({
          lineNumber: i + 1,
          expected,
          actual,
          match: lineMatch
        });
      }

      return {
        match: isIdentical,
        totalLines: maxLen,
        diffLines
      };
    }

    /**
     * Get aggregate progress of all assignments
     */
    getProgress() {
      const total = Object.keys(this.assignments).length;
      let completed = 0;
      let matching = 0;

      for (const id in this.assignments) {
        const a = this.assignments[id];
        if (a.status === "success") {
          completed++;
        }
        if (a.comparison && a.comparison.match) {
          matching++;
        }
      }

      return {
        total,
        completed,
        matching,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }
  }

  return {
    Runner
  };
}));
