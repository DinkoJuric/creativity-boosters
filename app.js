/* --- Data: Initial State --- */
// In a real app, this would come from a database.
// For V1 MVP, we hardcode the state based on your Markdown files.
const initialData = [
    { id: 'ep1', title: 'Ep 01: First Mover Advantage', desc: 'Hook: "In 2008..."', status: 'ready' },
    { id: 'ep2', title: 'Ep 02: Subtraction Innovation', desc: 'Hook: "$753M Pill Bottle"', status: 'ready' },
    { id: 'ep3', title: 'Ep 03: AI Consulting Disruption', desc: 'Hook: "Two Scandals..."', status: 'ready' },
    { id: 'ep4', title: 'Ep 04: Middle Manager Dilemma', desc: 'Hook: "Best idea died..."', status: 'ready' },
    { id: 'ep5', title: 'Ep 05: Stealth Innovation', desc: 'Hook: "Pfizer HR..."', status: 'ready' },
    { id: 'ep6', title: 'Ep 06: Negative Emotions', desc: 'Hook: "Velcro from burrs"', status: 'ready' },
    { id: 'ep7', title: 'Ep 07: Creative Constraints', desc: 'The beauty of limits', status: 'researching' }, // Added to demo Zeigarnik Effect
    { id: 'ep8', title: 'Ep 08: The Agentic Future', desc: 'AI as a colleague', status: 'ideas' }
];

/* --- Global State --- */
let tasks = initialData;

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
        el.innerHTML += `
            <div class="prod-checklist" style="margin-top:10px; font-size:0.8rem; border-top:1px solid rgba(255,255,255,0.2); padding-top:5px;">
                <label style="display:block;"><input type="checkbox" onchange="checkAutoArchive(this, '${task.id}')"> Record</label>
                <label style="display:block;"><input type="checkbox" onchange="checkAutoArchive(this, '${task.id}')"> Edit</label>
                <label style="display:block;"><input type="checkbox" onchange="checkAutoArchive(this, '${task.id}')"> Publish</label>
                <label style="display:block;"><input type="checkbox" onchange="checkAutoArchive(this, '${task.id}')"> Promo</label>
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

function updateCounts() {
    // Calculate counts
    const statusCounts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});

    // Update numbers
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
    const total = tasks.length;

    // Logic: Only "Ready" and "Production" count towards "Ready for Season"
    const percentage = Math.round((readyOrDone / 8) * 100); // 8 is our hard target for S1

    progressFill.style.width = `${percentage}%`;
    progressText.innerText = `${readyOrDone}/8 Episodes Ready`;

    // Visual Reward for completion
    if (percentage >= 50) {
        progressFill.classList.add('glow-active');
    } else {
        progressFill.classList.remove('glow-active');
    }
}

/* --- Drag & Drop Handlers --- */
function allowDrop(e) {
    e.preventDefault(); // Necessary to allow dropping
}

function drop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');

    // Identify target column (climb up DOM if dropped on a card)
    let target = e.target;
    while (!target.classList.contains('card-stack') && target.parentElement) {
        target = target.parentElement;
    }

    if (target.classList.contains('card-stack')) {
        // Map stack ID to status
        const newStatus = target.id.replace('stack-', '');

        // Update Model
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].status = newStatus;
        }

        // Re-render
        renderBoard();
        updateProgress();
    }
}

/* --- Login Logic (Security-ish) --- */
document.getElementById('login-btn').addEventListener('click', () => {
    const input = document.getElementById('password-input').value;
    const overlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('dashboard');
    const error = document.getElementById('error-msg');

    // Hardcoded "password"
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
    // Fade out effect
    const card = document.getElementById(id);
    if (card) {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
    }

    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        renderBoard();
        updateProgress();
    }, 500);
};

/* --- Auto Archive Logic --- */
window.checkAutoArchive = function (checkbox, id) {
    const card = document.getElementById(id);
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    if (allChecked) {
        // Delay slightly so user sees the checkmark appear before it vanishes
        setTimeout(() => {
            archiveCard(id);
        }, 800);
    }
};

// Start
init();
