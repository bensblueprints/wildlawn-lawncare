/**
 * WildLawn Lawncare LLC — Admin Dashboard
 * Vanilla JS admin panel for managing leads submitted through the contact form.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------
  const API = {
    GET_LEADS: '/.netlify/functions/get-leads',
    UPDATE_LEAD: '/.netlify/functions/update-lead',
    DELETE_LEAD: '/.netlify/functions/delete-lead',
    GET_SETTINGS: '/.netlify/functions/get-settings',
    UPDATE_SETTINGS: '/.netlify/functions/update-settings',
  };

  const AUTO_REFRESH_MS = 60000; // 60 seconds

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let allLeads = [];        // master list from API
  let filteredLeads = [];   // after search / filter
  let refreshTimer = null;  // setInterval id
  let trucksData = [];
  let servicesData = [];

  // ---------------------------------------------------------------------------
  // DOM helpers
  // ---------------------------------------------------------------------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ---------------------------------------------------------------------------
  // 1. AUTH MANAGEMENT
  // ---------------------------------------------------------------------------

  /** Return the stored token (or null). */
  function getToken() {
    return sessionStorage.getItem('adminToken');
  }

  /** Persist token for the session. */
  function setToken(token) {
    sessionStorage.setItem('adminToken', token);
  }

  /** Remove token and reset UI. */
  function logout() {
    sessionStorage.removeItem('adminToken');
    stopAutoRefresh();
    showLogin();
  }

  /** Show login form, hide dashboard. */
  function showLogin() {
    const login = $('#login-section');
    const dash = $('#dashboard-section');
    if (login) { login.removeAttribute('hidden'); login.style.display = ''; }
    if (dash) { dash.setAttribute('hidden', ''); dash.style.display = 'none'; }
  }

  /** Show dashboard, hide login form. */
  function showDashboard() {
    const login = $('#login-section');
    const dash = $('#dashboard-section');
    if (login) { login.setAttribute('hidden', ''); login.style.display = 'none'; }
    if (dash) { dash.removeAttribute('hidden'); dash.style.display = ''; }
  }

  /** Attempt login by fetching leads with the provided password as Bearer token. */
  async function login(password) {
    try {
      const res = await fetch(API.GET_LEADS, {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (!res.ok) throw new Error('Invalid credentials');

      setToken(password);
      const data = await res.json();
      allLeads = Array.isArray(data) ? data : data.leads || [];
      showDashboard();
      renderAll();
      startAutoRefresh();
      fetchSettings();
      showToast('Logged in successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  }

  /** On page load, check for existing token and auto-login. */
  async function tryAutoLogin() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(API.GET_LEADS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      allLeads = Array.isArray(data) ? data : data.leads || [];
      showDashboard();
      renderAll();
      startAutoRefresh();
      fetchSettings();
    } catch {
      // Token expired / invalid — clear it and show login
      sessionStorage.removeItem('adminToken');
      showLogin();
    }
  }

  // ---------------------------------------------------------------------------
  // 2. CRUD OPERATIONS
  // ---------------------------------------------------------------------------

  /** Build common request headers. */
  function authHeaders(extra = {}) {
    return {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  /** Fetch all leads from the API. */
  async function fetchLeads() {
    const res = await fetch(API.GET_LEADS, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch leads');
    const data = await res.json();
    allLeads = Array.isArray(data) ? data : data.leads || [];
  }

  /** Update a lead's status and/or notes. */
  async function updateLead(id, updates) {
    const res = await fetch(API.UPDATE_LEAD, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error('Failed to update lead');
    return res.json();
  }

  /** Delete a lead by id. */
  async function deleteLead(id) {
    const res = await fetch(API.DELETE_LEAD, {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete lead');
    return res.json();
  }

  // ---------------------------------------------------------------------------
  // 3. DASHBOARD STATS
  // ---------------------------------------------------------------------------

  /** Calculate and render dashboard statistics. */
  function renderStats() {
    const total = allLeads.length;
    const newLeads = allLeads.filter((l) => l.status === 'new').length;

    // "Booked this month" — leads with status 'booked' whose date is in the current month
    const now = new Date();
    const bookedThisMonth = allLeads.filter((l) => {
      if (l.status !== 'booked') return false;
      const d = new Date(l.updatedAt || l.createdAt || l.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const booked = allLeads.filter((l) => l.status === 'booked').length;
    const conversionRate = total > 0 ? ((booked / total) * 100).toFixed(1) : '0.0';

    // Update DOM
    const el = (id) => document.getElementById(id);
    if (el('stat-total')) el('stat-total').textContent = total;
    if (el('stat-new')) el('stat-new').textContent = newLeads;
    if (el('stat-booked-month')) el('stat-booked-month').textContent = bookedThisMonth;
    if (el('stat-conversion')) el('stat-conversion').textContent = `${conversionRate}%`;
  }

  // ---------------------------------------------------------------------------
  // 4. LEAD RENDERING
  // ---------------------------------------------------------------------------

  /** Format an ISO/timestamp date into a readable string. */
  function formatDate(raw) {
    if (!raw) return '—';
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  /** Return a CSS class for status badges. */
  function statusClass(status) {
    const map = {
      new: 'badge-new',
      contacted: 'badge-contacted',
      booked: 'badge-booked',
      archived: 'badge-archived',
    };
    return map[status] || 'badge-default';
  }

  /** Build a table row for desktop view. */
  function buildTableRow(lead) {
    const tr = document.createElement('tr');
    tr.dataset.id = lead.id;
    tr.classList.add('lead-row');
    tr.innerHTML = `
      <td>${lead.name || '—'}</td>
      <td><a href="mailto:${lead.email || ''}">${lead.email || '—'}</a></td>
      <td><a href="tel:${(lead.phone || '').replace(/\D/g, '')}">${lead.phone || '—'}</a></td>
      <td>${lead.service || '—'}</td>
      <td><span class="badge ${statusClass(lead.status)}">${lead.status || 'new'}</span></td>
      <td>${formatDate(lead.createdAt || lead.date)}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-contacted" data-action="contacted" data-id="${lead.id}" title="Mark Contacted">Contacted</button>
        <button class="btn btn-sm btn-booked" data-action="booked" data-id="${lead.id}" title="Mark Booked">Booked</button>
        <button class="btn btn-sm btn-archive" data-action="archived" data-id="${lead.id}" title="Archive">Archive</button>
        <button class="btn btn-sm btn-delete" data-action="delete" data-id="${lead.id}" title="Delete">Delete</button>
      </td>
    `;
    // Click row (not action buttons) to open detail modal
    tr.addEventListener('click', (e) => {
      if (e.target.closest('.actions-cell')) return;
      openModal(lead);
    });
    return tr;
  }

  /** Build a card for mobile view. */
  function buildCard(lead) {
    const div = document.createElement('div');
    div.classList.add('lead-card');
    div.dataset.id = lead.id;
    div.innerHTML = `
      <div class="lead-card-header">
        <strong>${lead.name || '—'}</strong>
        <span class="badge ${statusClass(lead.status)}">${lead.status || 'new'}</span>
      </div>
      <div class="lead-card-body">
        <p><a href="mailto:${lead.email || ''}">${lead.email || '—'}</a></p>
        <p><a href="tel:${(lead.phone || '').replace(/\D/g, '')}">${lead.phone || '—'}</a></p>
        <p>${lead.service || '—'}</p>
        <p class="lead-date">${formatDate(lead.createdAt || lead.date)}</p>
      </div>
      <div class="lead-card-actions">
        <button class="btn btn-sm btn-contacted" data-action="contacted" data-id="${lead.id}">Contacted</button>
        <button class="btn btn-sm btn-booked" data-action="booked" data-id="${lead.id}">Booked</button>
        <button class="btn btn-sm btn-archive" data-action="archived" data-id="${lead.id}">Archive</button>
        <button class="btn btn-sm btn-delete" data-action="delete" data-id="${lead.id}">Delete</button>
      </div>
    `;
    // Tap card body to open modal
    div.querySelector('.lead-card-body').addEventListener('click', () => openModal(lead));
    return div;
  }

  /** Render the leads table (desktop) and cards (mobile). */
  function renderLeads() {
    const tbody = $('#leadsTableBody');
    const cardContainer = $('#leadsCards');
    if (tbody) tbody.innerHTML = '';
    if (cardContainer) cardContainer.innerHTML = '';

    if (filteredLeads.length === 0) {
      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="empty-state">No leads found.</td>';
        tbody.appendChild(tr);
      }
      if (cardContainer) {
        cardContainer.innerHTML = '<p class="empty-state">No leads found.</p>';
      }
      return;
    }

    filteredLeads.forEach((lead) => {
      if (tbody) tbody.appendChild(buildTableRow(lead));
      if (cardContainer) cardContainer.appendChild(buildCard(lead));
    });
  }

  /** Re-apply filters, recalc stats, re-render table. */
  function renderAll() {
    applyFilters();
    renderStats();
    renderLeads();
  }

  // ---------------------------------------------------------------------------
  // 5. FILTER & SEARCH
  // ---------------------------------------------------------------------------

  /** Apply the current status filter and search query to allLeads. */
  function applyFilters() {
    const statusFilter = ($('#filterStatus') || {}).value || 'all';
    const searchQuery = (($('#filterSearch') || {}).value || '').toLowerCase().trim();

    filteredLeads = allLeads.filter((lead) => {
      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

      // Search filter — match against name, email, phone
      if (searchQuery) {
        const haystack = [lead.name, lead.email, lead.phone]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(searchQuery)) return false;
      }
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // 6. LEAD DETAIL MODAL
  // ---------------------------------------------------------------------------

  /** Open the detail modal for a given lead. */
  function openModal(lead) {
    const modal = $('#leadModal');
    if (!modal) return;

    // Populate fields
    $('#modalName').textContent = lead.name || '—';
    $('#modalEmail').innerHTML = lead.email
      ? `<a href="mailto:${lead.email}">${lead.email}</a>`
      : '—';
    $('#modalPhone').innerHTML = lead.phone
      ? `<a href="tel:${lead.phone.replace(/\D/g, '')}">${lead.phone}</a>`
      : '—';
    $('#modalService').textContent = lead.service || '—';
    $('#modalMessage').textContent = lead.message || '—';
    $('#modalStatus').innerHTML = `<span class="badge ${statusClass(lead.status)}">${lead.status || 'new'}</span>`;
    $('#modalDate').textContent = formatDate(lead.createdAt || lead.date);
    $('#modalNotes').value = lead.notes || '';

    // Store current lead id on the modal for later use
    modal.dataset.leadId = lead.id;

    // Show modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  /** Close the detail modal. */
  function closeModal() {
    const modal = $('#leadModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // ---------------------------------------------------------------------------
  // 7. ACTIONS — quick status change, delete
  // ---------------------------------------------------------------------------

  /** Handle quick-action button clicks (status change or delete). */
  async function handleAction(action, id) {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        await deleteLead(id);
        showToast('Lead deleted', 'success');
      } else {
        // action is the new status: 'contacted', 'booked', 'archived'
        await updateLead(id, { status: action });
        showToast(`Lead marked as ${action}`, 'success');
      }
      // Refresh data and re-render
      await fetchLeads();
      renderAll();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  }

  /** Save notes from the modal. */
  async function saveNotes() {
    const modal = $('#leadModal');
    const id = modal ? modal.dataset.leadId : null;
    const notes = $('#modalNotes') ? $('#modalNotes').value : '';
    if (!id) return;

    try {
      await updateLead(id, { notes });
      showToast('Notes saved', 'success');
      await fetchLeads();
      renderAll();
    } catch (err) {
      showToast(err.message || 'Failed to save notes', 'error');
    }
  }

  /** Change status from inside the modal. */
  async function modalStatusChange(newStatus) {
    const modal = $('#leadModal');
    const id = modal ? modal.dataset.leadId : null;
    if (!id) return;

    try {
      await updateLead(id, { status: newStatus });
      showToast(`Lead marked as ${newStatus}`, 'success');
      closeModal();
      await fetchLeads();
      renderAll();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  }

  // ---------------------------------------------------------------------------
  // 8. TOAST NOTIFICATION SYSTEM
  // ---------------------------------------------------------------------------

  /**
   * Display a toast notification.
   * @param {string} message — text to show
   * @param {'success'|'error'|'info'} type — visual style
   */
  function showToast(message, type = 'info') {
    // Ensure container exists
    let container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger slide-in (allow paint before adding class)
    requestAnimationFrame(() => toast.classList.add('visible'));

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove());
      // Fallback removal if transitionend doesn't fire
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // 9. AUTO-REFRESH
  // ---------------------------------------------------------------------------

  /** Start polling for new leads every 60 seconds. */
  function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(async () => {
      try {
        await fetchLeads();
        renderAll();
      } catch {
        // Silently fail — user will see data from last successful fetch
      }
    }, AUTO_REFRESH_MS);
  }

  /** Stop the auto-refresh interval. */
  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  // ---------------------------------------------------------------------------
  // 10. EXPORT LEADS AS CSV
  // ---------------------------------------------------------------------------

  /** Generate a CSV string from the current leads data and trigger a download. */
  function exportCSV() {
    if (allLeads.length === 0) {
      showToast('No leads to export', 'info');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Service', 'Status', 'Message', 'Notes', 'Date'];
    const rows = allLeads.map((l) => [
      l.name || '',
      l.email || '',
      l.phone || '',
      l.service || '',
      l.status || '',
      l.message || '',
      l.notes || '',
      l.createdAt || l.date || '',
    ]);

    // Escape CSV fields (wrap in quotes, escape internal quotes)
    const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escape).join(','),
      ...rows.map((r) => r.map(escape).join(',')),
    ].join('\r\n');

    // Build filename with today's date
    const today = new Date().toISOString().split('T')[0];
    const filename = `wildlawn-leads-${today}.csv`;

    // Create blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showToast('CSV exported', 'success');
  }

  // ---------------------------------------------------------------------------
  // EVENT BINDING
  // ---------------------------------------------------------------------------

  function bindEvents() {
    // --- Login form ---
    const loginForm = $('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pw = $('#loginPassword');
        if (pw && pw.value.trim()) login(pw.value.trim());
      });
    }

    // --- Magic Link toggle ---
    const switchToMagic = $('#switchToMagicLink');
    if (switchToMagic) {
      switchToMagic.addEventListener('click', () => {
        $('#passwordLoginTab').setAttribute('hidden', '');
        $('#magicLinkTab').removeAttribute('hidden');
      });
    }
    const switchToPass = $('#switchToPassword');
    if (switchToPass) {
      switchToPass.addEventListener('click', () => {
        $('#magicLinkTab').setAttribute('hidden', '');
        $('#passwordLoginTab').removeAttribute('hidden');
      });
    }

    // --- Magic Link form ---
    const magicForm = $('#magicLinkForm');
    if (magicForm) {
      magicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#magicEmail').value.trim();
        if (!email) return;
        try {
          await fetch('/.netlify/functions/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'magic-link', email }),
          });
          const msg = $('#magicLinkMsg');
          if (msg) { msg.removeAttribute('hidden'); msg.textContent = 'Check your email for the login link! (If configured)'; }
        } catch {
          showToast('Failed to send magic link', 'error');
        }
      });
    }

    // --- Reset Password toggle ---
    const resetBtn = $('#resetPasswordBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const section = $('#resetPasswordSection');
        if (section) section.toggleAttribute('hidden');
      });
    }

    // --- Reset Password form ---
    const resetForm = $('#resetPasswordForm');
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPw = $('#newPassword').value;
        const confirmPw = $('#confirmPassword').value;
        const resetError = $('#resetError');
        const resetSuccess = $('#resetSuccess');
        if (resetError) resetError.setAttribute('hidden', '');
        if (resetSuccess) resetSuccess.setAttribute('hidden', '');

        if (newPw !== confirmPw) {
          if (resetError) { resetError.removeAttribute('hidden'); resetError.textContent = 'Passwords do not match.'; }
          return;
        }
        if (newPw.length < 8) {
          if (resetError) { resetError.removeAttribute('hidden'); resetError.textContent = 'Password must be at least 8 characters.'; }
          return;
        }
        try {
          await fetch('/.netlify/functions/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'password-reset', email: $('#resetEmail').value, newPassword: newPw }),
          });
          if (resetSuccess) { resetSuccess.removeAttribute('hidden'); resetSuccess.textContent = 'Password reset request sent. Update ADMIN_PASSWORD in Netlify environment variables to complete the change.'; }
        } catch {
          if (resetError) { resetError.removeAttribute('hidden'); resetError.textContent = 'Reset failed. Please try again.'; }
        }
      });
    }

    // --- Logout button ---
    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // --- Status filter dropdown ---
    const filterStatus = $('#filterStatus');
    if (filterStatus) {
      filterStatus.addEventListener('change', () => {
        applyFilters();
        renderLeads();
      });
    }

    // --- Search input ---
    const searchInput = $('#filterSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        applyFilters();
        renderLeads();
      });
    }

    // --- Quick action buttons (delegated) ---
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action && id) handleAction(action, id);
    });

    // --- Modal close button ---
    const modalClose = $('#modalCloseBtn');
    if (modalClose) modalClose.addEventListener('click', closeModal);

    // --- Modal overlay click ---
    const modal = $('#leadModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // --- Escape key closes modal ---
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // --- Modal save notes ---
    const saveNotesBtn = $('#saveNotesBtn');
    if (saveNotesBtn) saveNotesBtn.addEventListener('click', saveNotes);

    // --- Modal status change buttons ---
    $$('[data-modal-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        modalStatusChange(btn.dataset.modalStatus);
      });
    });

    // --- Export CSV ---
    const exportBtn = $('#exportCsvBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);

    // --- Fleet & Services ---
    const addTruckBtn = $('#addTruckBtn');
    if (addTruckBtn) addTruckBtn.addEventListener('click', addTruck);
    const saveTrucksBtn = $('#saveTrucksBtn');
    if (saveTrucksBtn) saveTrucksBtn.addEventListener('click', saveTrucks);
    const addServiceBtn = $('#addServiceBtn');
    if (addServiceBtn) addServiceBtn.addEventListener('click', addService);
    const saveServicesBtn = $('#saveServicesBtn');
    if (saveServicesBtn) saveServicesBtn.addEventListener('click', saveServices);

    // Delegated delete for trucks and services
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="delete-truck"]');
      if (btn) { trucksData = trucksData.filter(t => t.id !== btn.dataset.id); renderTrucks(); return; }
      const btn2 = e.target.closest('[data-action="delete-service"]');
      if (btn2) { servicesData = servicesData.filter(s => s.id !== btn2.dataset.id); renderServices(); }
    });

    // --- Refresh button (manual) ---
    const refreshBtn = $('#refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        try {
          await fetchLeads();
          renderAll();
          showToast('Leads refreshed', 'info');
        } catch (err) {
          showToast('Refresh failed', 'error');
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 12. FLEET & SERVICES MANAGEMENT
  // ---------------------------------------------------------------------------

  /** Generate a unique ID with a given prefix. */
  function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  /** Fetch fleet and services settings from the API. */
  async function fetchSettings() {
    try {
      const res = await fetch(API.GET_SETTINGS, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      trucksData = Array.isArray(data.trucks) ? data.trucks : [];
      servicesData = Array.isArray(data.services) ? data.services : [];
    } catch (err) {
      // Gracefully handle — keep existing data
      console.warn('fetchSettings:', err.message);
    }
    renderTrucks();
    renderServices();
  }

  const inputStyle = "background:#1a1a1a; border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:10px 14px; color:#f7f5f2; font-family:'DM Sans',sans-serif; font-size:0.9rem; width:100%;";

  /** Render truck cards into #trucksList. */
  function renderTrucks() {
    const container = $('#trucksList');
    if (!container) return;
    container.innerHTML = '';

    if (trucksData.length === 0) {
      container.innerHTML = `<div class="empty-hint" style="text-align:center; padding:32px; color:#6b6965; font-size:0.9rem;">
        <p>No trucks configured yet. Click "Add Truck" to get started.</p>
      </div>`;
      return;
    }

    trucksData.forEach((truck) => {
      const card = document.createElement('div');
      card.className = 'truck-card';
      card.dataset.id = truck.id;
      card.style.cssText = 'background:#1a1a1a; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; margin-bottom:12px;';
      card.innerHTML = `
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:flex-start;">
          <div style="flex:1; min-width:180px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Truck Name</label>
            <input type="text" data-field="name" value="${(truck.name || '').replace(/"/g, '&quot;')}" placeholder="e.g. Truck 1" style="${inputStyle}">
          </div>
          <div style="flex:2; min-width:240px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Google Calendar ID</label>
            <input type="text" data-field="calendarId" value="${(truck.calendarId || '').replace(/"/g, '&quot;')}" placeholder="e.g. abc123@group.calendar.google.com" style="${inputStyle}">
          </div>
          <div style="min-width:120px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Status</label>
            <select data-field="status" style="${inputStyle}">
              <option value="active"${truck.status === 'active' ? ' selected' : ''}>Active</option>
              <option value="inactive"${truck.status === 'inactive' ? ' selected' : ''}>Inactive</option>
            </select>
          </div>
          <div style="display:flex; align-items:flex-end; padding-bottom:2px;">
            <button data-action="delete-truck" data-id="${truck.id}" class="btn btn-sm" style="background:rgba(255,0,0,0.1); color:#ff6b6b; border:1px solid rgba(255,0,0,0.2); border-radius:8px; padding:8px 14px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.85rem;">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /** Render service cards into #servicesList. */
  function renderServices() {
    const container = $('#servicesList');
    if (!container) return;
    container.innerHTML = '';

    if (servicesData.length === 0) {
      container.innerHTML = `<div class="empty-hint" style="text-align:center; padding:32px; color:#6b6965; font-size:0.9rem;">
        <p>No services configured yet. Click "Add Service" to get started.</p>
      </div>`;
      return;
    }

    servicesData.forEach((svc) => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.dataset.id = svc.id;
      card.style.cssText = 'background:#1a1a1a; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; margin-bottom:12px;';
      card.innerHTML = `
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:flex-start;">
          <div style="flex:1; min-width:180px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Service Name</label>
            <input type="text" data-field="name" value="${(svc.name || '').replace(/"/g, '&quot;')}" placeholder="e.g. Weekly Mowing" style="${inputStyle}">
          </div>
          <div style="flex:2; min-width:240px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Description</label>
            <textarea data-field="description" rows="2" placeholder="Describe the service..." style="${inputStyle} resize:vertical;">${(svc.description || '').replace(/</g, '&lt;')}</textarea>
          </div>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:flex-start; margin-top:12px;">
          <div style="flex:1; min-width:140px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Price Display</label>
            <input type="text" data-field="priceDisplay" value="${(svc.priceDisplay || '').replace(/"/g, '&quot;')}" placeholder="$45 - $75" style="${inputStyle}">
          </div>
          <div style="min-width:100px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Price Min</label>
            <input type="number" data-field="priceMin" value="${svc.priceMin || ''}" placeholder="45" style="${inputStyle}">
          </div>
          <div style="min-width:100px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Price Max</label>
            <input type="number" data-field="priceMax" value="${svc.priceMax || ''}" placeholder="75" style="${inputStyle}">
          </div>
          <div style="min-width:120px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Duration (min)</label>
            <input type="number" data-field="durationMinutes" value="${svc.durationMinutes || 60}" placeholder="60" style="${inputStyle}">
          </div>
          <div style="min-width:120px;">
            <label style="display:block; font-size:0.8rem; color:#a8a5a0; margin-bottom:4px;">Status</label>
            <select data-field="status" style="${inputStyle}">
              <option value="active"${svc.status === 'active' ? ' selected' : ''}>Active</option>
              <option value="inactive"${svc.status === 'inactive' ? ' selected' : ''}>Inactive</option>
            </select>
          </div>
          <div style="display:flex; align-items:flex-end; padding-bottom:2px;">
            <button data-action="delete-service" data-id="${svc.id}" class="btn btn-sm" style="background:rgba(255,0,0,0.1); color:#ff6b6b; border:1px solid rgba(255,0,0,0.2); border-radius:8px; padding:8px 14px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.85rem;">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /** Add a new truck to the fleet. */
  function addTruck() {
    trucksData.push({
      id: generateId('truck'),
      name: '',
      calendarId: '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    renderTrucks();
  }

  /** Add a new service. */
  function addService() {
    servicesData.push({
      id: generateId('service'),
      name: '',
      description: '',
      priceDisplay: '',
      priceMin: null,
      priceMax: null,
      durationMinutes: 60,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    renderServices();
  }

  /** Generic function to collect data from cards in a container by data-field attributes. */
  function collectFromCards(containerSelector, fields) {
    const cards = $$(containerSelector);
    return cards.map((card) => {
      const obj = { id: card.dataset.id };
      fields.forEach((field) => {
        const el = card.querySelector(`[data-field="${field}"]`);
        if (el) {
          obj[field] = el.tagName === 'TEXTAREA' ? el.value : el.value;
        }
      });
      return obj;
    });
  }

  /** Save fleet trucks to the API. */
  async function saveTrucks() {
    try {
      const collected = collectFromCards('.truck-card', ['name', 'calendarId', 'status']);
      // Merge collected values back into trucksData
      trucksData = trucksData.map((truck) => {
        const updated = collected.find((c) => c.id === truck.id);
        if (updated) {
          return { ...truck, ...updated, updatedAt: new Date().toISOString() };
        }
        return truck;
      });

      // Validate
      const invalid = trucksData.find((t) => !t.name || !t.name.trim());
      if (invalid) {
        showToast('Each truck must have a name', 'error');
        return;
      }

      const res = await fetch(API.UPDATE_SETTINGS, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ trucks: trucksData }),
      });
      if (!res.ok) throw new Error('Failed to save fleet');
      showToast('Fleet saved successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save fleet', 'error');
    }
  }

  /** Save services to the API. */
  async function saveServices() {
    try {
      const collected = collectFromCards('.service-card', ['name', 'description', 'priceDisplay', 'priceMin', 'priceMax', 'durationMinutes', 'status']);
      // Merge collected values back into servicesData
      servicesData = servicesData.map((svc) => {
        const updated = collected.find((c) => c.id === svc.id);
        if (updated) {
          return {
            ...svc,
            ...updated,
            priceMin: updated.priceMin ? Number(updated.priceMin) : null,
            priceMax: updated.priceMax ? Number(updated.priceMax) : null,
            durationMinutes: updated.durationMinutes ? Number(updated.durationMinutes) : 60,
            updatedAt: new Date().toISOString(),
          };
        }
        return svc;
      });

      // Validate
      const invalid = servicesData.find((s) => !s.name || !s.name.trim());
      if (invalid) {
        showToast('Each service must have a name', 'error');
        return;
      }

      const res = await fetch(API.UPDATE_SETTINGS, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ services: servicesData }),
      });
      if (!res.ok) throw new Error('Failed to save services');
      showToast('Services saved successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save services', 'error');
    }
  }

  // ---------------------------------------------------------------------------
  // 11. AI RECEPTIONIST SETTINGS
  // ---------------------------------------------------------------------------

  function initAISettings() {
    const toggle = $('#aiToggle');
    const knob = $('#aiToggleKnob');
    const statusLabel = $('#aiStatusLabel');
    const fields = $('#aiSettingsFields');
    const saveBtn = $('#saveAiSettings');
    const agentIdInput = $('#aiAgentId');
    const greetingInput = $('#aiGreeting');

    if (!toggle) return;

    // Load existing config
    const config = JSON.parse(localStorage.getItem('wildlawn_ai_config') || '{}');
    if (config.enabled) {
      toggle.checked = true;
      knob.style.transform = 'translateX(22px)';
      knob.style.background = '#48BB78';
      statusLabel.textContent = 'Enabled';
      statusLabel.style.color = '#48BB78';
      fields.style.display = 'block';
    }
    if (config.agentId && agentIdInput) agentIdInput.value = config.agentId;
    if (config.greeting && greetingInput) greetingInput.value = config.greeting;

    // Toggle handler
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        knob.style.transform = 'translateX(22px)';
        knob.style.background = '#48BB78';
        statusLabel.textContent = 'Enabled';
        statusLabel.style.color = '#48BB78';
        fields.style.display = 'block';
      } else {
        knob.style.transform = 'translateX(0)';
        knob.style.background = '#6b6965';
        statusLabel.textContent = 'Disabled';
        statusLabel.style.color = '#6b6965';
        fields.style.display = 'none';
        // Disable AI when toggled off
        localStorage.setItem('wildlawn_ai_config', JSON.stringify({ enabled: false }));
        showToast('AI Receptionist disabled', 'info');
      }
    });

    // Save handler
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const agentId = agentIdInput ? agentIdInput.value.trim() : '';
        const greeting = greetingInput ? greetingInput.value.trim() : '';

        if (!agentId) {
          showToast('Please enter an ElevenLabs Agent ID', 'error');
          return;
        }

        const newConfig = {
          enabled: true,
          agentId,
          greeting: greeting || 'Hi! Thanks for calling Wild Lawn Lawncare. How can I help you today?',
        };
        localStorage.setItem('wildlawn_ai_config', JSON.stringify(newConfig));
        showToast('AI Receptionist settings saved! The option will now appear on the website.', 'success');
      });
    }
  }

  // ---------------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------------

  function init() {
    bindEvents();
    initAISettings();
    tryAutoLogin();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
