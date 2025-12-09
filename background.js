// Background Service Worker for Timer Management
let timerState = {
    timeLeft: 40 * 60, // seconds
    isRunning: false,
    selectedPreset: 40, // minutes
    startTime: null,
    intervalId: null
};

let pinnedWindowId = null;

// Load saved state on startup
chrome.runtime.onStartup.addListener(() => {
    loadTimerState();
});

chrome.runtime.onInstalled.addListener(() => {
    loadTimerState();
});

// Load timer state from storage
async function loadTimerState() {
    const result = await chrome.storage.local.get(['timerState']);
    if (result.timerState) {
        timerState = { ...timerState, ...result.timerState };

        // If timer was running, calculate elapsed time and resume
        if (timerState.isRunning && timerState.startTime) {
            const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
            timerState.timeLeft = Math.max(0, timerState.timeLeft - elapsed);

            if (timerState.timeLeft > 0) {
                startTimerInterval();
            } else {
                timerState.isRunning = false;
            }
        }
    }
    saveTimerState();
}

// Save timer state to storage
function saveTimerState() {
    chrome.storage.local.set({ timerState });
}

// Start timer interval
function startTimerInterval() {
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
    }

    timerState.intervalId = setInterval(() => {
        if (timerState.timeLeft > 0) {
            timerState.timeLeft--;
            saveTimerState();
            broadcastTimerUpdate();

            if (timerState.timeLeft === 0) {
                stopTimer();
            }
        }
    }, 1000);
}

// Stop timer interval
function stopTimer() {
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
    }
    timerState.isRunning = false;
    saveTimerState();
    broadcastTimerUpdate();
}

// Broadcast timer update to all connected clients
function broadcastTimerUpdate() {
    chrome.runtime.sendMessage({
        type: 'TIMER_UPDATE',
        state: timerState
    }).catch(() => {
        // Ignore errors if no receivers
    });
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'GET_TIMER_STATE':
            sendResponse({ state: timerState });
            break;

        case 'START_TIMER':
            if (!timerState.isRunning && timerState.timeLeft > 0) {
                timerState.isRunning = true;
                timerState.startTime = Date.now();
                startTimerInterval();
                saveTimerState();
                broadcastTimerUpdate();
            }
            sendResponse({ success: true });
            break;

        case 'PAUSE_TIMER':
            if (timerState.isRunning) {
                stopTimer();
            }
            sendResponse({ success: true });
            break;

        case 'RESET_TIMER':
            stopTimer();
            timerState.timeLeft = timerState.selectedPreset * 60;
            timerState.startTime = null;
            saveTimerState();
            broadcastTimerUpdate();
            sendResponse({ success: true });
            break;

        case 'SET_PRESET':
            stopTimer();
            timerState.selectedPreset = message.minutes;
            timerState.timeLeft = message.minutes * 60;
            timerState.startTime = null;
            saveTimerState();
            broadcastTimerUpdate();
            sendResponse({ success: true });
            break;

        case 'PIN_TIMER':
            createPinnedWindow();
            sendResponse({ success: true });
            break;
    }
    return true; // Keep message channel open for async response
});

// Create pinned timer window
async function createPinnedWindow() {
    // Check if window already exists
    if (pinnedWindowId) {
        try {
            await chrome.windows.get(pinnedWindowId);
            // Window exists, just focus it
            chrome.windows.update(pinnedWindowId, { focused: true });
            return;
        } catch (e) {
            // Window doesn't exist anymore
            pinnedWindowId = null;
        }
    }

    // Create new pinned window
    try {
        const window = await chrome.windows.create({
            url: 'timer-window.html',
            type: 'popup',
            width: 320,
            height: 280,
            focused: true
        });

        pinnedWindowId = window.id;
    } catch (error) {
        console.error('Failed to create pinned window:', error);
    }
}

// Clean up when pinned window is closed
chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === pinnedWindowId) {
        pinnedWindowId = null;
    }
});
