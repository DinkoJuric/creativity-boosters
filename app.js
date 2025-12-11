/* --- Data: Initial State --- */
// BASELINE DATA: This is the "source of truth" committed to Git.
// Both Dinko and Nikhil will start from this state.
// localStorage saves SESSION changes; to PERMANENTLY sync, update this and push.
// TODO (Future): Google Sheets sync for live multi-user state.
const initialData = [
    { id: 'ep1', title: 'Ep 01: First Mover Advantage', desc: 'Hook: "In 2008..."', status: 'production', checklist: { record: true, edit: true, publish: false, promo: false } },
    { id: 'ep2', title: 'Ep 02: Subtraction Innovation', desc: 'Hook: "$753M Pill Bottle"', status: 'ready' },
    { id: 'ep3', title: 'Ep 03: AI Consulting Disruption', desc: 'Hook: "Two Scandals..."', status: 'production', checklist: { record: true, edit: false, publish: false, promo: false } },
    { id: 'ep4', title: 'Ep 04: Middle Manager Dilemma', desc: 'Hook: "Best idea died..."', status: 'ready' },
    { id: 'ep5', title: 'Ep 05: Stealth Innovation', desc: 'Hook: "Pfizer HR..."', status: 'production', checklist: { record: true, edit: false, publish: false, promo: false } },
    { id: 'ep6', title: 'Ep 06: Negative Emotions', desc: 'Hook: "Velcro from burrs"', status: 'ready' },
    { id: 'ep7', title: 'Ep 07: Creative Constraints', desc: 'The beauty of limits', status: 'researching' },
    { id: 'ep8', title: 'Ep 08: The Agentic Future', desc: 'AI as a colleague', status: 'ideas' }
];

/* --- State Management --- */
const STORAGE_KEY = 'creativityBoostersState';

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to parse saved state, using default.');
        }
    }
    return JSON.parse(JSON.stringify(initialData)); // Deep clone
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function resetToBaseline() {
    if (confirm('Reset board to the last committed state? This will lose any unsaved changes.')) {
        localStorage.removeItem(STORAGE_KEY);
        tasks = JSON.parse(JSON.stringify(initialData));
        renderBoard();
        updateProgress();
    }
}

/* --- Global State --- */
let tasks = loadState();

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

/* --- Initialization --- */
function init() {
    renderBoard();
    updateProgress();
}

/* --- Rendering --- */
function renderBoard() {
    // Clear all stacks
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

    // Production Checklist Feature (with Auto-Archive)
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

    // Drag Events
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
        saveState();

        // Auto-archive if all checked
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

    // Zeigarnik Effect: Show badge if items in Researching
    if ((statusCounts.researching || 0) > 0) {
        researchingBadge.style.display = 'inline-block';
    } else {
        researchingBadge.style.display = 'none';
    }
}

/* --- Goal Gradient (Progress Logic) --- */
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

/* --- Drag & Drop Handlers --- */
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
            // Initialize checklist when moving to production
            if (newStatus === 'production' && !tasks[taskIndex].checklist) {
                tasks[taskIndex].checklist = { record: false, edit: false, publish: false, promo: false };
            }
            saveState();
        }

        renderBoard();
        updateProgress();
    }
}

/* --- Login Logic --- */
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

/* --- Archive Logic --- */
window.archiveCard = function (id) {
    const card = document.getElementById(id);
    if (card) {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
    }

    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveState();
        renderBoard();
        updateProgress();
    }, 500);
};

// Start
init();
