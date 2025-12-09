// Timer Window Script
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const closeBtn = document.getElementById('close-btn');
const presetBtns = document.querySelectorAll('.preset-btn');
const taskLabel = document.getElementById('task-label');
const timerDisplay = document.querySelector('.timer-display');

let currentState = null;

// Initialize
async function init() {
    await updateTimerState();

    // Listen for timer updates from background
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'TIMER_UPDATE') {
            currentState = message.state;
            updateDisplay();
        }
    });
}

// Get timer state from background
async function updateTimerState() {
    const response = await chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' });
    currentState = response.state;
    updateDisplay();
}

// Update display
function updateDisplay() {
    if (!currentState) return;

    const m = Math.floor(currentState.timeLeft / 60);
    const s = currentState.timeLeft % 60;
    minutesDisplay.textContent = m.toString().padStart(2, '0');
    secondsDisplay.textContent = s.toString().padStart(2, '0');

    // Update button state
    if (currentState.isRunning) {
        startBtn.innerHTML = '⏸ Pause';
        startBtn.classList.add('running');
        timerDisplay.classList.add('running');
    } else {
        startBtn.innerHTML = '▶ Start';
        startBtn.classList.remove('running');
        timerDisplay.classList.remove('running');
    }

    // Update preset buttons
    presetBtns.forEach(btn => {
        const time = parseInt(btn.getAttribute('data-time'));
        if (time === currentState.selectedPreset) {
            btn.classList.add('active-preset');
        } else {
            btn.classList.remove('active-preset');
        }
    });

    // Update task label
    if (currentState.selectedPreset === 20) {
        taskLabel.textContent = 'Task 1 - Academic/General';
    } else if (currentState.selectedPreset === 40) {
        taskLabel.textContent = 'Task 2 - Essay';
    } else {
        taskLabel.textContent = `${currentState.selectedPreset} minutes`;
    }

    // Change display color when time is running out
    if (currentState.timeLeft <= 60 && currentState.timeLeft > 0) {
        timerDisplay.style.color = '#dc2626'; // Red when < 1 min
    } else if (currentState.timeLeft <= 300 && currentState.timeLeft > 60) {
        timerDisplay.style.color = '#f59e0b'; // Orange when < 5 min
    } else {
        timerDisplay.style.color = 'var(--text-color)';
    }
}

// Start/Pause timer
startBtn.addEventListener('click', async () => {
    if (currentState.isRunning) {
        await chrome.runtime.sendMessage({ type: 'PAUSE_TIMER' });
    } else {
        await chrome.runtime.sendMessage({ type: 'START_TIMER' });
    }
    await updateTimerState();
});

// Reset timer
resetBtn.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'RESET_TIMER' });
    await updateTimerState();
});

// Close window
closeBtn.addEventListener('click', () => {
    window.close();
});

// Preset buttons
presetBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const minutes = parseInt(btn.getAttribute('data-time'));
        await chrome.runtime.sendMessage({
            type: 'SET_PRESET',
            minutes: minutes
        });
        await updateTimerState();
    });
});

// Poll for updates (backup in case message doesn't arrive)
setInterval(updateTimerState, 1000);

// Initialize on load
init();
