/**
 * JavaScript Learning Lab - Main Application Coordinator
 * Binds DOM interactions, state managers, execution engine, and live in-browser tests.
 */

(function () {
  'use strict';

  // Ensure dependencies are available
  const {
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
  } = window.LabAssignments;

  const {
    DEFAULT_PRODUCTS,
    categorizeProduct,
    InventoryManager,
    capstoneExpectedOutput
  } = window.InventoryModule;

  const { Runner } = window.ExecutionEngine;
  const { ASSIGNMENTS_META, DashboardManager } = window.LabDashboard;

  // Global State
  const runner = new Runner();
  const inventory = new InventoryManager();
  const dashboardManager = new DashboardManager(runner, inventory);

  // Pending Modal Action
  let pendingModalConfirm = null;

  /* ==========================================================================
     Register Assignments in Execution Engine
     ========================================================================== */
  runner.register('assignment-1', {
    name: 'Variables & Data Types',
    expectedOutput: assignment1Expected,
    runFn: () => runAssignment1().output,
    resetFn: () => {
      clearConsole('a1', 'Click "Run Example" to execute Assignment 1.');
    }
  });

  runner.register('assignment-2', {
    name: 'Operators & Input Handling',
    expectedOutput: assignment2Expected,
    runFn: (subtotal = 100, tip = 15) => calculateTip(subtotal, tip).output,
    resetFn: () => {
      document.getElementById('a2-subtotal-input').value = '100';
      document.getElementById('a2-tip-input').value = '15';
      hideAlert('a2-error-alert');
      clearConsole('a2', 'Click "Calculate Tip & Total" to run calculation.');
    }
  });

  runner.register('assignment-3', {
    name: 'Conditional Statements',
    expectedOutput: assignment3Expected,
    runFn: (score = 85) => evaluateGrade(score).output,
    resetFn: () => {
      document.getElementById('a3-score-input').value = '85';
      hideAlert('a3-error-alert');
      clearConsole('a3', 'Click "Evaluate Score" to run grading logic.');
    }
  });

  runner.register('assignment-4', {
    name: 'Loops & Flow Control',
    expectedOutput: assignment4Expected,
    runFn: () => runAssignment4().output,
    resetFn: () => {
      clearConsole('a4', 'Click "Run All Loops" to execute loop demonstrations.');
    }
  });

  runner.register('assignment-5', {
    name: 'Functions & Scope',
    expectedOutput: assignment5Expected,
    runFn: () => runAssignment5().output,
    resetFn: () => {
      clearConsole('a5', 'Click "Run Scope Example" to execute function demonstrations.');
    }
  });

  runner.register('assignment-6', {
    name: 'Array Methods',
    expectedOutput: assignment6Expected,
    runFn: () => runAssignment6().output,
    resetFn: () => {
      clearConsole('a6', 'Click "Run Array Methods" to execute array operations.');
    }
  });

  runner.register('capstone', {
    name: 'Smart Product Inventory',
    expectedOutput: capstoneExpectedOutput,
    runFn: () => {
      const demo = InventoryManager.runVerificationDemo();
      return demo.output;
    },
    resetFn: () => {
      clearConsole('capstone', 'Run the Section 11 Verification Demo or add/remove products to inspect console activity.');
    }
  });

  /* ==========================================================================
     DOM Helpers
     ========================================================================== */
  function showAlert(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.style.display = 'flex';
  }

  function hideAlert(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.display = 'none';
    el.textContent = '';
  }

  function clearConsole(suffix, idleText) {
    const con = document.getElementById(`console-${suffix}`);
    const badge = document.getElementById(`status-badge-${suffix}`);
    const diffContainer = document.getElementById(`diff-container-${suffix}`);

    if (con) {
      con.textContent = idleText;
      con.className = 'console-output idle';
    }
    if (badge) {
      badge.textContent = 'IDLE';
      badge.className = 'status-badge idle';
    }
    if (diffContainer) {
      diffContainer.innerHTML = '';
    }
    updateNavStatusDot(suffix, 'idle');
    updateGlobalProgress();
  }

  function updateNavStatusDot(suffix, status) {
    let dotId = `nav-dot-${suffix}`;
    if (suffix === 'capstone') dotId = 'nav-dot-capstone';
    const dot = document.getElementById(dotId);
    if (dot) {
      dot.className = `nav-status-dot ${status}`;
      dot.title = status.toUpperCase();
    }
  }

  function updateGlobalProgress() {
    const summary = dashboardManager.getSummary();

    const topCompleted = document.getElementById('top-completed-count');
    const topProgressPill = document.getElementById('top-progress-pill');
    const sidebarProgressLabel = document.getElementById('sidebar-progress-label');

    if (topCompleted) topCompleted.textContent = summary.completedCount;
    if (topProgressPill) topProgressPill.textContent = `${summary.progressPercentage}% Complete`;
    if (sidebarProgressLabel) sidebarProgressLabel.textContent = `${summary.completedCount} / 7 Done`;

    // Dashboard View Stats
    const dProgress = document.getElementById('dash-stat-progress');
    const dCompSub = document.getElementById('dash-stat-completed-sub');
    const dMatches = document.getElementById('dash-stat-matches');
    const dProducts = document.getElementById('dash-stat-products');
    const dValue = document.getElementById('dash-stat-value');

    if (dProgress) dProgress.textContent = `${summary.progressPercentage}%`;
    if (dCompSub) dCompSub.textContent = `${summary.completedCount} of 7 Completed`;
    if (dMatches) dMatches.textContent = `${summary.matchingCount} / 7`;
    if (dProducts) dProducts.textContent = `${summary.inventoryProductCount} Items`;
    if (dValue) dValue.textContent = `$${summary.inventoryTotalValue}`;

    renderDashboardGrid(summary);
  }

  function renderDiff(containerId, comparison) {
    const container = document.getElementById(containerId);
    if (!container || !comparison) return;

    if (comparison.match) {
      container.innerHTML = `
        <div class="alert alert-success" style="margin-top: 14px;">
          ✓ Output perfectly matches the expected specification!
        </div>
      `;
      return;
    }

    let diffHtml = `
      <div class="alert alert-warning" style="margin-top: 14px;">
        ⚠ Output difference detected. See comparison below:
      </div>
      <div class="diff-container">
    `;

    comparison.diffLines.forEach(line => {
      const cls = line.match ? 'diff-line match' : 'diff-line mismatch';
      const mark = line.match ? ' ' : '!';
      const exp = line.expected !== null ? line.expected : '<none>';
      const act = line.actual !== null ? line.actual : '<none>';
      diffHtml += `
        <div class="${cls}">
          <span class="diff-num">${line.lineNumber}</span>
          <span class="diff-content">${mark} Exp: ${escapeHtml(exp)} | Act: ${escapeHtml(act)}</span>
        </div>
      `;
    });

    diffHtml += '</div>';
    container.innerHTML = diffHtml;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ==========================================================================
     View Navigation
     ========================================================================== */
  function switchView(viewId) {
    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update top bar title
    const currentViewTitle = document.getElementById('current-view-name');
    if (currentViewTitle) {
      const activeBtn = document.querySelector(`.nav-btn[data-view="${viewId}"]`);
      if (activeBtn) {
        const textSpan = activeBtn.querySelector('.nav-btn-left span:last-child');
        currentViewTitle.textContent = textSpan ? textSpan.textContent : viewId;
      }
    }

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('mobile-open');
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('mobile-open');
  }

  /* ==========================================================================
     Dashboard Cards Rendering
     ========================================================================== */
  function renderDashboardGrid(summary) {
    const grid = document.getElementById('dashboard-assignments-grid');
    if (!grid) return;

    grid.innerHTML = summary.assignments.map(item => {
      let badgeHtml = '';
      if (item.status === 'success') {
        badgeHtml = item.isMatching
          ? '<span class="status-badge success">MATCHING</span>'
          : '<span class="status-badge warning">DIFF DETECTED</span>';
      } else if (item.status === 'error') {
        badgeHtml = '<span class="status-badge error">ERROR</span>';
      } else {
        badgeHtml = '<span class="status-badge idle">NOT RUN</span>';
      }

      return `
        <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="nav-badge-num">${item.number}</span>
              ${badgeHtml}
            </div>
            <h3 style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              ${escapeHtml(item.title)}
            </h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
              ${escapeHtml(item.concept)}
            </p>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button class="btn btn-primary btn-sm dash-run-btn" data-id="${item.id}" style="flex: 1;">Run</button>
            <button class="btn btn-secondary btn-sm dash-view-btn" data-view="${item.targetView}">Inspect</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners to newly created dashboard buttons
    grid.querySelectorAll('.dash-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
      });
    });

    grid.querySelectorAll('.dash-run-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        executeAssignmentById(id);
      });
    });
  }

  /* ==========================================================================
     Assignment Execution Dispatcher
     ========================================================================== */
  function executeAssignmentById(id) {
    if (id === 'assignment-1') {
      executeA1();
    } else if (id === 'assignment-2') {
      executeA2();
    } else if (id === 'assignment-3') {
      executeA3();
    } else if (id === 'assignment-4') {
      executeA4();
    } else if (id === 'assignment-5') {
      executeA5();
    } else if (id === 'assignment-6') {
      executeA6();
    } else if (id === 'capstone') {
      executeCapstoneDemo();
    }
  }

  /* Assignment 1 Handler */
  function executeA1() {
    const res = runner.execute('assignment-1');
    const con = document.getElementById('console-a1');
    const badge = document.getElementById('status-badge-a1');

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }
    updateNavStatusDot('a1', res.status);
    updateGlobalProgress();
  }

  /* Assignment 2 Handler */
  function executeA2() {
    hideAlert('a2-error-alert');
    const subtotalVal = document.getElementById('a2-subtotal-input').value;
    const tipVal = document.getElementById('a2-tip-input').value;

    const res = runner.execute('assignment-2', subtotalVal, tipVal);
    const con = document.getElementById('console-a2');
    const badge = document.getElementById('status-badge-a2');

    if (res.status === 'error') {
      showAlert('a2-error-alert', res.error);
    }

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }
    updateNavStatusDot('a2', res.status);
    updateGlobalProgress();
  }

  /* Assignment 3 Handler */
  function executeA3() {
    hideAlert('a3-error-alert');
    const scoreVal = document.getElementById('a3-score-input').value;

    const res = runner.execute('assignment-3', scoreVal);
    const con = document.getElementById('console-a3');
    const badge = document.getElementById('status-badge-a3');

    if (res.status === 'error') {
      showAlert('a3-error-alert', res.error);
    }

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }
    updateNavStatusDot('a3', res.status);
    updateGlobalProgress();
  }

  /* Assignment 4 Handler */
  function executeA4() {
    const res = runner.execute('assignment-4');
    const con = document.getElementById('console-a4');
    const badge = document.getElementById('status-badge-a4');

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }
    updateNavStatusDot('a4', res.status);
    updateGlobalProgress();
  }

  /* Assignment 5 Handler */
  function executeA5() {
    const res = runner.execute('assignment-5');
    const con = document.getElementById('console-a5');
    const badge = document.getElementById('status-badge-a5');

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }
    updateNavStatusDot('a5', res.status);
    updateGlobalProgress();
  }

  /* Assignment 6 Handler */
  function executeA6() {
    const res = runner.execute('assignment-6');
    const con = document.getElementById('console-a6');
    const badge = document.getElementById('status-badge-a6');

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }
    updateNavStatusDot('a6', res.status);
    updateGlobalProgress();
  }

  /* Capstone Demo Execution */
  function executeCapstoneDemo() {
    // Make sure Monitor $150 exists in active inventory roster
    const all = inventory.getAll();
    const hasMonitor = all.some(p => p.name.toLowerCase() === 'monitor' && p.price === 150);
    if (!hasMonitor) {
      inventory.addProduct('Monitor', 150);
      renderInventoryTable();
      renderCapstoneAnalytics();
    }

    const res = runner.execute('capstone');
    const con = document.getElementById('console-capstone');
    const badge = document.getElementById('status-badge-capstone');

    if (con) {
      con.textContent = res.output;
      con.className = `console-output ${res.status}`;
    }
    if (badge) {
      badge.textContent = `${res.status.toUpperCase()} (${res.executionMs}ms)`;
      badge.className = `status-badge ${res.status}`;
    }

    renderDiff('diff-container-capstone', res.comparison);
    updateNavStatusDot('capstone', res.status);
    updateGlobalProgress();
  }

  /* ==========================================================================
     Capstone Inventory UI Operations
     ========================================================================== */
  function renderInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    const emptyMsg = document.getElementById('inventory-empty-msg');
    if (!tbody) return;

    const search = document.getElementById('table-search-input')?.value || '';
    const category = document.getElementById('table-category-filter')?.value || 'all';
    const sortBy = document.getElementById('table-sort-by')?.value || 'none';

    const items = inventory.query({ search, category, sortBy });

    if (items.length === 0) {
      tbody.innerHTML = '';
      if (emptyMsg) emptyMsg.style.display = 'flex';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

    tbody.innerHTML = items.map(p => {
      const badgeCls = `category-badge ${p.category.toLowerCase()}`;
      return `
        <tr>
          <td><span class="nav-badge-num">#${p.id}</span></td>
          <td><strong>${escapeHtml(p.name)}</strong></td>
          <td class="text-right price-cell">$${p.price.toFixed(2)}</td>
          <td><span class="${badgeCls}">${p.category}</span></td>
          <td class="text-right">
            <button class="btn btn-outline-danger btn-sm remove-product-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}">
              Remove
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach remove handlers
    tbody.querySelectorAll('.remove-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const name = btn.getAttribute('data-name');
        openConfirmModal(
          `Remove Product "${name}"?`,
          `Are you sure you want to delete this product from the inventory? This cannot be undone.`,
          () => {
            inventory.removeProduct(id);
            renderInventoryTable();
            renderCapstoneAnalytics();
            updateGlobalProgress();
            calculateAndRenderFinancialEstimate();
          }
        );
      });
    });
  }

  function renderCapstoneAnalytics() {
    const analytics = inventory.getAnalytics();

    const countEl = document.getElementById('capstone-stat-count');
    const totalValEl = document.getElementById('capstone-stat-total-value');
    const avgValEl = document.getElementById('capstone-stat-avg-value');
    const premCountEl = document.getElementById('capstone-stat-premium-count');
    const affordableEl = document.getElementById('capstone-stat-affordable');
    const highestEl = document.getElementById('capstone-stat-highest');
    const lowestEl = document.getElementById('capstone-stat-lowest');

    if (countEl) countEl.textContent = analytics.totalCount;
    if (totalValEl) totalValEl.textContent = `$${analytics.totalValue.toFixed(2)}`;
    if (avgValEl) avgValEl.textContent = `$${analytics.averagePrice.toFixed(2)}`;
    if (premCountEl) premCountEl.textContent = analytics.premiumCount;

    if (affordableEl) {
      affordableEl.textContent = analytics.affordableItems.length > 0
        ? JSON.stringify(analytics.affordableItems)
        : '[]';
    }

    if (highestEl) {
      highestEl.textContent = analytics.highestProduct
        ? `${analytics.highestProduct.name} ($${analytics.highestProduct.price})`
        : 'N/A';
    }

    if (lowestEl) {
      lowestEl.textContent = analytics.lowestProduct
        ? `${analytics.lowestProduct.name} ($${analytics.lowestProduct.price})`
        : 'N/A';
    }
  }

  function calculateAndRenderFinancialEstimate() {
    hideAlert('financial-calc-error');
    const discountInput = document.getElementById('fin-discount-input');
    const taxInput = document.getElementById('fin-tax-input');
    const outputEl = document.getElementById('financial-calc-results');

    try {
      const discount = discountInput ? discountInput.value : 10;
      const tax = taxInput ? taxInput.value : 8;

      const estimate = inventory.calculateFinancialEstimate(tax, discount);

      if (outputEl) {
        outputEl.textContent = [
          `Base Inventory Value: $${estimate.baseValue.toFixed(2)}`,
          `Discount (${estimate.discountPercent}%): -$${estimate.discountAmount.toFixed(2)}`,
          `Subtotal after Discount: $${estimate.subtotalAfterDiscount.toFixed(2)}`,
          `Estimated Tax (${estimate.taxPercent}%): +$${estimate.taxAmount.toFixed(2)}`,
          `Projected Adjusted Total: $${estimate.estimatedTotal.toFixed(2)}`
        ].join('\n');
      }
    } catch (err) {
      showAlert('financial-calc-error', err.message);
    }
  }

  /* ==========================================================================
     Confirmation Modal Manager
     ========================================================================== */
  function openConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('modal-confirm-title');
    const msgEl = document.getElementById('modal-confirm-message');

    if (!modal) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    pendingModalConfirm = onConfirm;
    modal.classList.add('open');
  }

  function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.remove('open');
    pendingModalConfirm = null;
  }

  /* ==========================================================================
     In-Browser Test Center Runner
     ========================================================================== */
  function runBrowserTests() {
    const container = document.getElementById('test-results-container');
    const statusBadge = document.getElementById('test-runner-status');
    const passedStat = document.getElementById('test-stat-passed');
    const failedStat = document.getElementById('test-stat-failed');
    const totalStat = document.getElementById('test-stat-total');
    const passRateStat = document.getElementById('test-stat-pass-rate');
    const durationStat = document.getElementById('test-stat-duration');

    if (!container) return;

    if (statusBadge) {
      statusBadge.textContent = 'RUNNING';
      statusBadge.className = 'status-badge running';
    }

    const testCases = [
      {
        name: 'Assignment 1: Variable values and runtime types',
        run: () => {
          const res = runAssignment1();
          if (res.variables.name !== 'Alice') throw new Error('Expected name Alice');
          if (res.types.nameType !== 'string') throw new Error('Expected string type');
          if (res.variables.age !== 25) throw new Error('Expected age 25');
          if (res.types.ageType !== 'number') throw new Error('Expected number type');
          if (res.variables.isEmployed !== true) throw new Error('Expected isEmployed true');
          if (res.types.isEmployedType !== 'boolean') throw new Error('Expected boolean type');
          if (res.variables.skills.length !== 3) throw new Error('Expected 3 skills');
          if (res.types.skillsType !== 'object') throw new Error('Expected object type for array');
        }
      },
      {
        name: 'Assignment 1: Output formatting string comparison',
        run: () => {
          const res = runAssignment1();
          if (res.output.trim() !== assignment1Expected.trim()) throw new Error('Assignment 1 output mismatch');
        }
      },
      {
        name: 'Assignment 2: Correct tip and total calculation',
        run: () => {
          const res = calculateTip(100, 15);
          if (res.subtotal !== 100 || res.tip !== 15 || res.total !== 115) throw new Error('Tip calculation error');
        }
      },
      {
        name: 'Assignment 2: Decimal monetary rounding',
        run: () => {
          const res = calculateTip(50.50, 20);
          if (res.tip !== 10.1 || res.total !== 60.6) throw new Error('Decimal rounding error');
        }
      },
      {
        name: 'Assignment 2: Rejects blank inputs',
        run: () => {
          let caught = false;
          try { calculateTip('', 15); } catch (e) { caught = true; }
          if (!caught) throw new Error('Failed to reject blank subtotal');
        }
      },
      {
        name: 'Assignment 2: Rejects non-numeric inputs',
        run: () => {
          let caught = false;
          try { calculateTip('abc', 15); } catch (e) { caught = true; }
          if (!caught) throw new Error('Failed to reject non-numeric input');
        }
      },
      {
        name: 'Assignment 2: Rejects negative subtotal',
        run: () => {
          let caught = false;
          try { calculateTip(-20, 15); } catch (e) { caught = true; }
          if (!caught) throw new Error('Failed to reject negative subtotal');
        }
      },
      {
        name: 'Assignment 2: Rejects invalid tip percentage (>100 or <0)',
        run: () => {
          let caught = false;
          try { calculateTip(100, 150); } catch (e) { caught = true; }
          if (!caught) throw new Error('Failed to reject >100 tip');
        }
      },
      {
        name: 'Assignment 3: Grade calculation boundaries (100, 85, 60, 40)',
        run: () => {
          if (evaluateGrade(100).grade !== 'A') throw new Error('Expected A for 100');
          if (evaluateGrade(85).grade !== 'B') throw new Error('Expected B for 85');
          if (evaluateGrade(60).grade !== 'D') throw new Error('Expected D for 60');
          if (evaluateGrade(40).grade !== 'F') throw new Error('Expected F for 40');
        }
      },
      {
        name: 'Assignment 3: Rejects invalid scores (-1 and 101)',
        run: () => {
          let c1 = false, c2 = false;
          try { evaluateGrade(-1); } catch (e) { c1 = true; }
          try { evaluateGrade(101); } catch (e) { c2 = true; }
          if (!c1 || !c2) throw new Error('Failed to reject scores outside 0-100');
        }
      },
      {
        name: 'Assignment 4: 5 Multiplication table generation',
        run: () => {
          const res = runAssignment4();
          if (res.multiplicationResult.join(',') !== '5,10,15,20,25') throw new Error('Table mismatch');
        }
      },
      {
        name: 'Assignment 4: While loop with break finds 12',
        run: () => {
          const res = runAssignment4();
          if (res.foundNumber !== 12) throw new Error('Expected found number 12');
        }
      },
      {
        name: 'Assignment 4: Loop termination and continue statement',
        run: () => {
          const res = runAssignment4();
          if (res.output.trim() !== assignment4Expected.trim()) throw new Error('Loops output mismatch');
        }
      },
      {
        name: 'Assignment 5: Standard function with default parameters (20)',
        run: () => {
          if (calculateStandardArea() !== 20) throw new Error('Default standard area must be 20');
        }
      },
      {
        name: 'Assignment 5: Arrow function area calculator (30)',
        run: () => {
          if (calculateArrowArea(10, 3) !== 30) throw new Error('Arrow area must be 30');
        }
      },
      {
        name: 'Assignment 5: ReferenceError controlled scope handling',
        run: () => {
          const res = runAssignment5();
          if (!res.scopeError.includes('ReferenceError')) throw new Error('Expected ReferenceError');
        }
      },
      {
        name: 'Assignment 6: Array operations (forEach, filter < 50, map)',
        run: () => {
          const res = runAssignment6();
          if (res.filtered.length !== 2) throw new Error('Expected 2 filtered products');
          if (res.mapped[0] !== 'LAPTOP costs $800') throw new Error('Expected uppercase map string');
        }
      },
      {
        name: 'Capstone: Category boundaries ($49.99, $50, $199.99, $200)',
        run: () => {
          if (categorizeProduct(49.99) !== 'Budget') throw new Error('49.99 must be Budget');
          if (categorizeProduct(50) !== 'Standard') throw new Error('50 must be Standard');
          if (categorizeProduct(199.99) !== 'Standard') throw new Error('199.99 must be Standard');
          if (categorizeProduct(200) !== 'Premium') throw new Error('200 must be Premium');
        }
      },
      {
        name: 'Capstone: Product insertion with valid data',
        run: () => {
          const mgr = new InventoryManager();
          const p = mgr.addProduct('Tablet', 250);
          if (p.name !== 'Tablet' || p.price !== 250) throw new Error('Product insertion failed');
        }
      },
      {
        name: 'Capstone: Product insertion input validation errors',
        run: () => {
          const mgr = new InventoryManager();
          let c1 = false, c2 = false;
          try { mgr.addProduct('', 100); } catch (e) { c1 = true; }
          try { mgr.addProduct('Item', -5); } catch (e) { c2 = true; }
          if (!c1 || !c2) throw new Error('Failed to reject invalid product inputs');
        }
      },
      {
        name: 'Capstone: Analytics calculation (reduce total value and count)',
        run: () => {
          const mgr = new InventoryManager([
            { id: 1, name: 'Item A', price: 100 },
            { id: 2, name: 'Item B', price: 200 }
          ]);
          const a = mgr.getAnalytics();
          if (a.totalCount !== 2 || a.totalValue !== 300) throw new Error('Analytics total value mismatch');
        }
      },
      {
        name: 'Capstone: Section 11 deterministic verification demo',
        run: () => {
          const demo = InventoryManager.runVerificationDemo();
          if (demo.analytics.totalCount !== 3 || demo.analytics.totalValue !== 975) {
            throw new Error('Verification demo total mismatch');
          }
          if (demo.output.trim() !== capstoneExpectedOutput.trim()) {
            throw new Error('Verification demo output text mismatch');
          }
        }
      },
      {
        name: 'Capstone: Product removal by ID',
        run: () => {
          const mgr = new InventoryManager([
            { id: 1, name: 'Item A', price: 100 },
            { id: 2, name: 'Item B', price: 200 }
          ]);
          mgr.removeProduct(1);
          if (mgr.getAll().length !== 1) throw new Error('Removal failed');
        }
      },
      {
        name: 'Capstone: Search, category filtering, and sorting',
        run: () => {
          const mgr = new InventoryManager([
            { id: 1, name: 'Alpha', price: 40 },
            { id: 2, name: 'Beta', price: 150 },
            { id: 3, name: 'Gamma', price: 300 }
          ]);
          const search = mgr.query({ search: 'alpha' });
          if (search.length !== 1) throw new Error('Search failed');
          const sorted = mgr.query({ sortBy: 'price-desc' });
          if (sorted[0].price !== 300) throw new Error('Sort failed');
        }
      },
      {
        name: 'Capstone: Empty inventory handling without errors',
        run: () => {
          const mgr = new InventoryManager([]);
          mgr.clear();
          const a = mgr.getAnalytics();
          if (a.totalCount !== 0 || a.totalValue !== 0 || a.averagePrice !== 0) {
            throw new Error('Empty analytics failure');
          }
        }
      },
      {
        name: 'Capstone: Financial estimates without mutating inventory base',
        run: () => {
          const mgr = new InventoryManager([{ id: 1, name: 'Item', price: 1000 }]);
          const est = mgr.calculateFinancialEstimate(10, 10);
          if (est.estimatedTotal !== 990) throw new Error('Financial calculation mismatch');
          if (mgr.getAnalytics().totalValue !== 1000) throw new Error('Inventory was mutated');
        }
      },
      {
        name: 'Execution Engine: Output diffing detector',
        run: () => {
          const r = new Runner();
          r.register('test', {
            name: 'test',
            expectedOutput: 'Line 1\nLine 2',
            runFn: () => 'Line 1\nLine 2'
          });
          const res = r.execute('test');
          if (!res.comparison.match) throw new Error('Diff comparison failed on exact match');
        }
      }
    ];

    const startTime = performance.now();
    let passed = 0;
    let failed = 0;
    const renderedItems = [];

    testCases.forEach(tc => {
      const itemStart = performance.now();
      try {
        tc.run();
        const duration = Math.round((performance.now() - itemStart) * 100) / 100;
        passed++;
        renderedItems.push(`
          <div class="test-item pass">
            <div class="test-item-title">
              <span style="color: var(--color-success); font-weight: bold;">✓</span>
              <span>${escapeHtml(tc.name)}</span>
            </div>
            <span class="test-item-time">${duration} ms</span>
          </div>
        `);
      } catch (err) {
        const duration = Math.round((performance.now() - itemStart) * 100) / 100;
        failed++;
        renderedItems.push(`
          <div class="test-item fail">
            <div class="test-item-title">
              <span style="color: var(--color-danger); font-weight: bold;">✕</span>
              <span>${escapeHtml(tc.name)} - <em style="color: #fca5a5;">${escapeHtml(err.message)}</em></span>
            </div>
            <span class="test-item-time">${duration} ms</span>
          </div>
        `);
      }
    });

    const totalDuration = Math.round((performance.now() - startTime) * 100) / 100;

    container.innerHTML = renderedItems.join('');

    if (totalStat) totalStat.textContent = testCases.length;
    if (passedStat) passedStat.textContent = passed;
    if (failedStat) failedStat.textContent = failed;
    if (durationStat) durationStat.textContent = `${totalDuration} ms`;
    if (passRateStat) {
      passRateStat.textContent = failed === 0 ? '100% Pass Rate' : `${Math.round((passed / testCases.length) * 100)}% Pass Rate`;
    }

    if (statusBadge) {
      if (failed === 0) {
        statusBadge.textContent = `ALL PASSED (${passed}/${testCases.length})`;
        statusBadge.className = 'status-badge success';
        updateNavStatusDot('tests', 'success');
      } else {
        statusBadge.textContent = `${failed} FAILED`;
        statusBadge.className = 'status-badge error';
        updateNavStatusDot('tests', 'error');
      }
    }
  }

  /* ==========================================================================
     Event Listeners Setup
     ========================================================================== */
  function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) switchView(view);
      });
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', openMobileSidebar);
    }

    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileSidebar);
    }

    // Dashboard Run All Button
    const runAllBtn = document.getElementById('btn-run-all-assignments');
    if (runAllBtn) {
      runAllBtn.addEventListener('click', () => {
        executeA1();
        executeA2();
        executeA3();
        executeA4();
        executeA5();
        executeA6();
        executeCapstoneDemo();
      });
    }

    // Assignment 1 buttons
    document.getElementById('btn-run-a1')?.addEventListener('click', executeA1);
    document.getElementById('btn-compare-a1')?.addEventListener('click', () => {
      const item = runner.assignments['assignment-1'];
      if (!item || !item.comparison) executeA1();
      renderDiff('diff-container-a1', runner.assignments['assignment-1'].comparison);
    });
    document.getElementById('btn-reset-a1')?.addEventListener('click', () => runner.reset('assignment-1'));

    // Assignment 2 buttons & presets
    document.getElementById('btn-run-a2')?.addEventListener('click', executeA2);
    document.getElementById('btn-compare-a2')?.addEventListener('click', () => {
      executeA2();
      renderDiff('diff-container-a2', runner.assignments['assignment-2'].comparison);
    });
    document.getElementById('btn-reset-a2')?.addEventListener('click', () => runner.reset('assignment-2'));

    document.getElementById('a2-preset-demo')?.addEventListener('click', () => {
      document.getElementById('a2-subtotal-input').value = '100';
      document.getElementById('a2-tip-input').value = '15';
      executeA2();
    });
    document.getElementById('a2-preset-decimal')?.addEventListener('click', () => {
      document.getElementById('a2-subtotal-input').value = '50.50';
      document.getElementById('a2-tip-input').value = '20';
      executeA2();
    });
    document.getElementById('a2-preset-neg')?.addEventListener('click', () => {
      document.getElementById('a2-subtotal-input').value = '-25';
      document.getElementById('a2-tip-input').value = '15';
      executeA2();
    });
    document.getElementById('a2-preset-tip-overflow')?.addEventListener('click', () => {
      document.getElementById('a2-subtotal-input').value = '100';
      document.getElementById('a2-tip-input').value = '150';
      executeA2();
    });

    // Assignment 3 buttons & presets
    document.getElementById('btn-run-a3')?.addEventListener('click', executeA3);
    document.getElementById('btn-compare-a3')?.addEventListener('click', () => {
      executeA3();
      renderDiff('diff-container-a3', runner.assignments['assignment-3'].comparison);
    });
    document.getElementById('btn-reset-a3')?.addEventListener('click', () => runner.reset('assignment-3'));

    const setScoreAndRun = (score) => {
      document.getElementById('a3-score-input').value = score;
      executeA3();
    };
    document.getElementById('a3-preset-100')?.addEventListener('click', () => setScoreAndRun(100));
    document.getElementById('a3-preset-85')?.addEventListener('click', () => setScoreAndRun(85));
    document.getElementById('a3-preset-60')?.addEventListener('click', () => setScoreAndRun(60));
    document.getElementById('a3-preset-40')?.addEventListener('click', () => setScoreAndRun(40));
    document.getElementById('a3-preset-neg1')?.addEventListener('click', () => setScoreAndRun(-1));
    document.getElementById('a3-preset-101')?.addEventListener('click', () => setScoreAndRun(101));

    // Assignment 4 buttons
    document.getElementById('btn-run-a4')?.addEventListener('click', executeA4);
    document.getElementById('btn-compare-a4')?.addEventListener('click', () => {
      executeA4();
      renderDiff('diff-container-a4', runner.assignments['assignment-4'].comparison);
    });
    document.getElementById('btn-reset-a4')?.addEventListener('click', () => runner.reset('assignment-4'));

    // Assignment 5 buttons
    document.getElementById('btn-run-a5')?.addEventListener('click', executeA5);
    document.getElementById('btn-compare-a5')?.addEventListener('click', () => {
      executeA5();
      renderDiff('diff-container-a5', runner.assignments['assignment-5'].comparison);
    });
    document.getElementById('btn-reset-a5')?.addEventListener('click', () => runner.reset('assignment-5'));

    // Assignment 6 buttons
    document.getElementById('btn-run-a6')?.addEventListener('click', executeA6);
    document.getElementById('btn-compare-a6')?.addEventListener('click', () => {
      executeA6();
      renderDiff('diff-container-a6', runner.assignments['assignment-6'].comparison);
    });
    document.getElementById('btn-reset-a6')?.addEventListener('click', () => runner.reset('assignment-6'));

    // Capstone Demo Button
    document.getElementById('btn-run-capstone-demo')?.addEventListener('click', executeCapstoneDemo);

    // Add Product Form
    const addProductForm = document.getElementById('capstone-add-product-form');
    if (addProductForm) {
      addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAlert('capstone-form-error');
        hideAlert('capstone-form-success');

        const nameInput = document.getElementById('prod-name-input');
        const priceInput = document.getElementById('prod-price-input');

        try {
          const added = inventory.addProduct(nameInput.value, priceInput.value);
          showAlert('capstone-form-success', `✓ Successfully added "${added.name}" ($${added.price.toFixed(2)})!`);
          nameInput.value = '';
          priceInput.value = '';

          renderInventoryTable();
          renderCapstoneAnalytics();
          updateGlobalProgress();
          calculateAndRenderFinancialEstimate();
        } catch (err) {
          showAlert('capstone-form-error', err.message);
        }
      });
    }

    // Query Toolbar listeners
    document.getElementById('table-search-input')?.addEventListener('input', renderInventoryTable);
    document.getElementById('table-category-filter')?.addEventListener('change', renderInventoryTable);
    document.getElementById('table-sort-by')?.addEventListener('change', renderInventoryTable);

    // Reset Inventory Button
    document.getElementById('btn-reset-inventory')?.addEventListener('click', () => {
      openConfirmModal(
        'Reset Inventory to Default Catalog?',
        'This will restore the inventory to the initial demonstration products (Laptop $800, Mouse $25).',
        () => {
          inventory.reset(DEFAULT_PRODUCTS);
          renderInventoryTable();
          renderCapstoneAnalytics();
          updateGlobalProgress();
          calculateAndRenderFinancialEstimate();
        }
      );
    });

    // Clear Inventory Button
    document.getElementById('btn-clear-inventory')?.addEventListener('click', () => {
      openConfirmModal(
        'Clear Entire Inventory?',
        'This will remove all products to test empty inventory handling.',
        () => {
          inventory.clear();
          renderInventoryTable();
          renderCapstoneAnalytics();
          updateGlobalProgress();
          calculateAndRenderFinancialEstimate();
        }
      );
    });

    // Financial Estimate button
    document.getElementById('btn-calc-estimate')?.addEventListener('click', calculateAndRenderFinancialEstimate);

    // Test Center Run Button
    document.getElementById('btn-run-browser-tests')?.addEventListener('click', runBrowserTests);

    // Confirmation Modal buttons
    document.getElementById('modal-cancel-btn')?.addEventListener('click', closeConfirmModal);
    document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
      if (typeof pendingModalConfirm === 'function') {
        pendingModalConfirm();
      }
      closeConfirmModal();
    });
  }

  /* ==========================================================================
     Application Initialization
     ========================================================================== */
  function init() {
    setupEventListeners();
    renderInventoryTable();
    renderCapstoneAnalytics();
    calculateAndRenderFinancialEstimate();
    updateGlobalProgress();

    // Auto-run browser verification tests so Test Center starts with verified real metrics
    runBrowserTests();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
