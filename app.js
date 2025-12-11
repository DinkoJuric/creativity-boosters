/* --- Google Sheets Sync Configuration --- */
// This URL points to your Google Apps Script that reads/writes the Sheet
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbw-Vn-MH2zOY8c0FzQZt35o7XfpVC1vn12eQxerjqvbmghOsJDO0HnOScRlVpQqsxZe/exec';

// Fallback data if Sheet is empty or unreachable
const fallbackData = [
    { id: 'ep1', title: 'Ep 01: First Mover Advantage', desc: 'Hook: "In 2008..."', status: 'production', checklist: { record: true, edit: true, publish: false, promo: false } },
    { id: 'ep2', title: 'Ep 02: Subtraction Innovation', desc: 'Hook: "$753M Pill Bottle"', status: 'ready' },
    { id: 'ep3', title: 'Ep 03: AI Consulting Disruption', desc: 'Hook: "Two Scandals..."', status: 'production', checklist: { record: true, edit: false, publish: false, promo: false } },
    { id: 'ep4', title: 'Ep 04: Middle Manager Dilemma', desc: 'Hook: "Best idea died..."', status: 'ready' },
    { id: 'ep5', title: 'Ep 05: Stealth Innovation', desc: 'Hook: "Pfizer HR..."', status: 'production', checklist: { record: true, edit: false, publish: false, promo: false } },
    { id: 'ep6', title: 'Ep 06: Negative Emotions', desc: 'Hook: "Velcro from burrs"', status: 'ready' },
    { id: 'ep7', title: 'Ep 07: Creative Constraints', desc: 'The beauty of limits', status: 'researching' },
    { id: 'ep8', title: 'Ep 08: The Agentic Future', desc: 'AI as a colleague', status: 'ideas' }
];

/* --- Global State --- */
let tasks = [];
let isSyncing = false;

/* --- DOM Elements --- */
const stacks = {
    ideas: document.getElementById('stack-ideas'),
    researching: document.getElementById('stack-researching'),
    ready: document.getElementById('stack-ready'),
    production: document.getElementById('stack-production')
};
const counts = {
    ideas: document.querySelector('#col-ideas .count'),
    researching: document.querySelector('#col-researching .count'),
    ready: document.querySelector('#col-ready .count'),
    production: document.querySelector('#col-production .count')
};
const progressFill = document.getElementById('season-progress');
const progressText = document.getElementById('progress-text');
const researchingBadge = document.getElementById('researching-badge');

/* --- Sync Functions --- */
async function loadFromSheet() {
    try {
        showSyncStatus('Loading...');
        const response = await fetch(SHEETS_API_URL);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            tasks = data;
            showSyncStatus('Synced ✓', true);
        } else {
            console.warn('Sheet empty, using fallback');
            tasks = JSON.parse(JSON.stringify(fallbackData));
            showSyncStatus('Using defaults', true);
        }
    } catch (error) {
        console.error('Failed to load from Sheet:', error);
        tasks = JSON.parse(JSON.stringify(fallbackData));
        showSyncStatus('Offline mode', true);
    }
}

async function saveToSheet() {
    if (isSyncing) return;
    isSyncing = true;

    try {
        showSyncStatus('Saving...');

        // Use form data to avoid CORS preflight
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(tasks));

        await fetch(SHEETS_API_URL, {
            method: 'POST',
            body: formData
        });

        showSyncStatus('Saved ✓', true);
    } catch (error) {
        console.error('Failed to save to Sheet:', error);
        showSyncStatus('Save failed!', true);
    }

    isSyncing = false;
}

function showSyncStatus(message, fadeOut = false) {
    let statusEl = document.getElementById('sync-status');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'sync-status';
        statusEl.style.cssText = 'position:fixed;bottom:20px;right:20px;background:rgba(0,0,0,0.8);color:#00E5FF;padding:10px 20px;border-radius:8px;font-size:0.9rem;z-index:1000;transition:opacity 0.5s;';
        document.body.appendChild(statusEl);
    }
    statusEl.textContent = message;
    statusEl.style.opacity = '1';

    if (fadeOut) {
        setTimeout(() => { statusEl.style.opacity = '0'; }, 2000);
    }
}

/* --- Initialization --- */
async function init() {
    await loadFromSheet();
    renderBoard();
    updateProgress();
}

/* --- Rendering --- */
function renderBoard() {
    Object.values(stacks).forEach(el => el.innerHTML = '');

    tasks.forEach(task => {
        const card = createCard(task);
        const targetStack = stacks[task.status];
        if (targetStack) targetStack.appendChild(card);
    });

    updateCounts();
}

function createCard(task) {
    const el = document.createElement('div');
    el.className = 'task-card';
    el.setAttribute('draggable', 'true');
    el.id = task.id;

    el.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
    `;

    if (task.status === 'production') {
        const cl = task.checklist || { record: false, edit: false, publish: false, promo: false };
        el.innerHTML += `
            <div class="prod-checklist" style="margin-top:10px; font-size:0.8rem; border-top:1px solid rgba(255,255,255,0.2); padding-top:5px;">
                <label style="display:block;"><input type="checkbox" ${cl.record ? 'checked' : ''} onchange="updateChecklist('${task.id}', 'record', this.checked)"> Record</label>
                <label style="display:block;"><input type="checkbox" ${cl.edit ? 'checked' : ''} onchange="updateChecklist('${task.id}', 'edit', this.checked)"> Edit</label>
                <label style="display:block;"><input type="checkbox" ${cl.publish ? 'checked' : ''} onchange="updateChecklist('${task.id}', 'publish', this.checked)"> Publish</label>
                <label style="display:block;"><input type="checkbox" ${cl.promo ? 'checked' : ''} onchange="updateChecklist('${task.id}', 'promo', this.checked)"> Promo</label>
                <button onclick="archiveCard('${task.id}')" style="margin-top:5px; width:100%; border:none; background:rgba(255,255,255,0.1); color:var(--text-muted); cursor:pointer; padding:5px; border-radius:4px; font-size:0.7rem;">Archive Manually</button>
            </div>
        `;
    }

    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        el.classList.add('is-dragging');
    });
    el.addEventListener('dragend', () => {
        el.classList.remove('is-dragging');
    });

    return el;
}

/* --- Checklist Logic --- */
window.updateChecklist = function (id, field, value) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        if (!task.checklist) task.checklist = { record: false, edit: false, publish: false, promo: false };
        task.checklist[field] = value;
        saveToSheet();

        const cl = task.checklist;
        if (cl.record && cl.edit && cl.publish && cl.promo) {
            setTimeout(() => archiveCard(id), 800);
        }
    }
};

function updateCounts() {
    const statusCounts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});

    counts.ideas.innerText = statusCounts.ideas || 0;
    counts.researching.innerText = statusCounts.researching || 0;
    counts.ready.innerText = statusCounts.ready || 0;
    counts.production.innerText = statusCounts.production || 0;

    if ((statusCounts.researching || 0) > 0) {
        researchingBadge.style.display = 'inline-block';
    } else {
        researchingBadge.style.display = 'none';
    }
}

/* --- Progress Logic --- */
function updateProgress() {
    const readyOrDone = tasks.filter(t => t.status === 'ready' || t.status === 'production').length;
    const percentage = Math.round((readyOrDone / 8) * 100);

    progressFill.style.width = `${percentage}%`;
    progressText.innerText = `${readyOrDone}/8 Episodes Ready`;

    if (percentage >= 50) {
        progressFill.classList.add('glow-active');
    } else {
        progressFill.classList.remove('glow-active');
    }
}

/* --- Drag & Drop --- */
function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');

    let target = e.target;
    while (!target.classList.contains('card-stack') && target.parentElement) {
        target = target.parentElement;
    }

    if (target.classList.contains('card-stack')) {
        const newStatus = target.id.replace('stack-', '');
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].status = newStatus;
            if (newStatus === 'production' && !tasks[taskIndex].checklist) {
                tasks[taskIndex].checklist = { record: false, edit: false, publish: false, promo: false };
            }
            saveToSheet();
        }

        renderBoard();
        updateProgress();
    }
}

/* --- Login --- */
document.getElementById('login-btn').addEventListener('click', () => {
    const input = document.getElementById('password-input').value;
    const overlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('dashboard');
    const error = document.getElementById('error-msg');

    if (input.toLowerCase() === 'creativityboom') {
        overlay.style.display = 'none';
        dashboard.classList.remove('hidden');
    } else {
        error.style.display = 'block';
        input.value = '';
    }
});

/* --- Archive --- */
window.archiveCard = function (id) {
    const card = document.getElementById(id);
    if (card) {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
    }

    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveToSheet();
        renderBoard();
        updateProgress();
    }, 500);
};

/* --- Add Card Modal --- */
window.openAddModal = function () {
    document.getElementById('add-modal').style.display = 'flex';
    document.getElementById('new-title').focus();
};

window.closeAddModal = function () {
    document.getElementById('add-modal').style.display = 'none';
    document.getElementById('new-title').value = '';
    document.getElementById('new-desc').value = '';
};

window.submitNewCard = function () {
    const title = document.getElementById('new-title').value.trim();
    const desc = document.getElementById('new-desc').value.trim();

    if (!title) {
        alert('Please enter a title');
        return;
    }

    // Generate new ID
    const maxId = tasks.reduce((max, t) => {
        const num = parseInt(t.id.replace('ep', '')) || 0;
        return num > max ? num : max;
    }, 0);
    const newId = 'ep' + (maxId + 1);

    // Create new card
    tasks.push({
        id: newId,
        title: title,
        desc: desc || 'New episode idea',
        status: 'ideas'
    });

    saveToSheet();
    renderBoard();
    updateProgress();
    closeAddModal();

    showSyncStatus('Episode added!', true);
};

// Start
init();

