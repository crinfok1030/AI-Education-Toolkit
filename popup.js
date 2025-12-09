document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching Logic
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Timer Logic - Sync with Background
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const pinTimerBtn = document.getElementById('pin-timer-btn');

  let currentState = null;

  // Get timer state from background
  async function updateTimerState() {
    const response = await chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' });
    currentState = response.state;
    updateDisplay();
  }

  // Update display from state
  function updateDisplay() {
    if (!currentState) return;

    const m = Math.floor(currentState.timeLeft / 60);
    const s = currentState.timeLeft % 60;
    minutesDisplay.textContent = m.toString().padStart(2, '0');
    secondsDisplay.textContent = s.toString().padStart(2, '0');

    // Update button state
    if (currentState.isRunning) {
      startBtn.textContent = 'Pause';
      startBtn.classList.add('running');
    } else {
      startBtn.textContent = 'Start';
      startBtn.classList.remove('running');
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
  }

  // Listen for timer updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TIMER_UPDATE') {
      currentState = message.state;
      updateDisplay();
    }
  });

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

  // Pin timer button
  pinTimerBtn.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'PIN_TIMER' });
  });

  // Word Counter Logic
  const essayInput = document.getElementById('essay-input');
  const taskSelect = document.getElementById('task-select');
  const wordCountDisplay = document.getElementById('word-count');
  const countStatus = document.getElementById('count-status');
  const statusText = document.getElementById('status-text');
  const clearTextBtn = document.getElementById('clear-text-btn');

  function countWords(text) {
    // Remove extra whitespace and count words
    const trimmed = text.trim();
    if (trimmed === '') return 0;
    return trimmed.split(/\s+/).length;
  }

  function updateWordCount() {
    const text = essayInput.value;
    const wordCount = countWords(text);
    const taskType = taskSelect.value;
    const requiredWords = taskType === '1' ? 150 : 250;

    wordCountDisplay.textContent = wordCount;

    if (wordCount >= requiredWords) {
      const extra = wordCount - requiredWords;
      countStatus.className = 'count-status success';
      statusText.textContent = `✓ ${extra} words over minimum`;
      countStatus.querySelector('.status-icon').textContent = '✅';
    } else {
      const needed = requiredWords - wordCount;
      countStatus.className = 'count-status warning';
      statusText.textContent = `Need ${needed} more words`;
      countStatus.querySelector('.status-icon').textContent = '⚠️';
    }
  }

  if (essayInput) {
    essayInput.addEventListener('input', updateWordCount);
    taskSelect.addEventListener('change', updateWordCount);
    clearTextBtn.addEventListener('click', () => {
      essayInput.value = '';
      updateWordCount();
    });
  }

  // Initialize
  updateTimerState();

  // Poll for updates every second
  setInterval(updateTimerState, 1000);
});
