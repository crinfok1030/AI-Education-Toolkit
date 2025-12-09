// DET Practice Tools - Main Script

// ========== STATE MANAGEMENT ==========
let currentWordIndex = 0;
let todayWordsStart = 0;
let timerInterval = null;
let timerSeconds = 25 * 60; // Default 25 minutes
let isTimerRunning = false;

// ========== MOTIVATIONAL QUOTES ==========
const QUOTES = [
    "125+ score? It starts with today's practice!",
    "Fun fact: Top scorers practice daily, not intensely.",
    "Pro tip: Even 15 minutes counts!",
    "Remember: The exam is adaptive, so is your brain!",
    "Break time? Perfect! Fresh minds score higher.",
    "Consistency beats intensity every single time!",
    "Every word you learn brings you closer to your goal.",
    "Small daily improvements lead to stunning results.",
    "Your future self will thank you for practicing today!",
    "Progress is progress, no matter how small."
];

// ========== DET SCORE CONVERSION DATA ==========
const SCORE_CONVERSION_TABLE = {
    160: { toefl: "120", ielts: "8.5-9", cefr: "C2" },
    155: { toefl: "119", ielts: "8", cefr: "C2" },
    150: { toefl: "117-118", ielts: "8", cefr: "C1" },
    145: { toefl: "113-116", ielts: "7.5", cefr: "C1" },
    140: { toefl: "109-112", ielts: "7.5", cefr: "C1" },
    135: { toefl: "104-108", ielts: "7", cefr: "C1" },
    130: { toefl: "98-103", ielts: "7", cefr: "C1" },
    125: { toefl: "93-97", ielts: "6.5", cefr: "B2" },
    120: { toefl: "87-92", ielts: "6.5", cefr: "B2" },
    115: { toefl: "82-86", ielts: "6", cefr: "B2" },
    110: { toefl: "76-81", ielts: "6", cefr: "B2" },
    105: { toefl: "70-75", ielts: "5.5", cefr: "B2" },
    100: { toefl: "65-69", ielts: "5.5", cefr: "B2" },
    95: { toefl: "59-64", ielts: "5.5", cefr: "B1" },
    90: { toefl: "53-58", ielts: "5", cefr: "B1" },
    85: { toefl: "47-52", ielts: "5", cefr: "B1" },
    80: { toefl: "41-46", ielts: "4.5", cefr: "B1" },
    75: { toefl: "35-40", ielts: "4.5", cefr: "B1" },
    70: { toefl: "30-34", ielts: "4.5", cefr: "B1" },
    65: { toefl: "24-29", ielts: "4", cefr: "B1" },
    60: { toefl: "18-23", ielts: "4", cefr: "B1" }
};



// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadSavedSettings();
    displayRandomQuote();
    updateCurrentYear();
});

function initializeApp() {
    // Calculate today's words (50 words per day, rotating through the list)
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    todayWordsStart = (dayOfYear * 50) % VOCAB_DATA.length;

    // Display first word
    displayWord(0);
    updateProgress();
}

// ========== FLASHCARD FUNCTIONS ==========
function displayWord(relativeIndex) {
    const absoluteIndex = (todayWordsStart + relativeIndex) % VOCAB_DATA.length;
    const word = VOCAB_DATA[absoluteIndex];

    // Display word in lowercase
    document.getElementById('word').textContent = word.toLowerCase();

    currentWordIndex = relativeIndex;
    updateProgress();
    updateNavigationButtons();
}

function updateProgress() {
    document.getElementById('progress-indicator').textContent = `${currentWordIndex + 1}/50`;
}

function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = currentWordIndex === 0;
    document.getElementById('next-btn').disabled = currentWordIndex === 49;
}

function goToPreviousWord() {
    if (currentWordIndex > 0) {
        displayWord(currentWordIndex - 1);
    }
}

function goToNextWord() {
    if (currentWordIndex < 49) {
        displayWord(currentWordIndex + 1);
    }
}

function defineWord() {
    const word = document.getElementById('word').textContent;
    const url = `https://www.google.com/search?q=define+${encodeURIComponent(word)}`;
    window.open(url, '_blank');
}

// ========== COUNTDOWN TIMER ==========
function updateCountdown() {
    chrome.storage.local.get(['examDate'], (result) => {
        const examDate = result.examDate;
        const countdownElement = document.getElementById('countdown-text');

        if (!examDate) {
            countdownElement.textContent = 'Click the calendar to set your exam date';
            return;
        }

        const now = new Date();
        const exam = new Date(examDate);
        // Reset time part to ensure accurate day calculation
        const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const examMidnight = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());

        const diffTime = examMidnight - nowMidnight;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Format date as YYYY-MM-DD
        const dateString = exam.toISOString().split('T')[0];

        if (diffDays < 0) {
            countdownElement.textContent = `Target: ${dateString} (Passed)`;
        } else if (diffDays === 0) {
            countdownElement.textContent = `Target: ${dateString} (🔥 Exam is TODAY!)`;
        } else if (diffDays === 1) {
            countdownElement.textContent = `Target: ${dateString} (🔥 Exam is TOMORROW!)`;
        } else {
            countdownElement.textContent = `Target: ${dateString} (⏰ ${diffDays} days left)`;
        }
    });
}

function saveExamDate() {
    const examDate = document.getElementById('exam-date-input').value;
    if (examDate) {
        chrome.storage.local.set({ examDate }, () => {
            updateCountdown();
        });
    }
}

// ========== DET SCORE CALCULATOR ==========
function roundToNearestFive(value) {
    return Math.round(value / 5) * 5;
}

function calculateScores() {
    const listening = parseInt(document.getElementById('listening-score').value) || 0;
    const speaking = parseInt(document.getElementById('speaking-score').value) || 0;
    const reading = parseInt(document.getElementById('reading-score').value) || 0;
    const writing = parseInt(document.getElementById('writing-score').value) || 0;

    // Check if all scores are valid
    if (listening === 0 && speaking === 0 && reading === 0 && writing === 0) {
        document.getElementById('overall-score').textContent = '-';
        document.getElementById('production-score').textContent = '-';
        document.getElementById('literacy-score').textContent = '-';
        document.getElementById('comprehension-score').textContent = '-';
        document.getElementById('conversation-score').textContent = '-';
        return;
    }

    // Calculate Overall Score (average of all 4 skills)
    const overall = roundToNearestFive((listening + speaking + reading + writing) / 4);

    // Calculate Subscores
    const production = roundToNearestFive((writing + speaking) / 2);
    const literacy = roundToNearestFive((reading + writing) / 2);
    const comprehension = roundToNearestFive((listening + reading) / 2);
    const conversation = roundToNearestFive((speaking + listening) / 2);

    // Display results
    document.getElementById('overall-score').textContent = overall;
    document.getElementById('production-score').textContent = production;
    document.getElementById('literacy-score').textContent = literacy;
    document.getElementById('comprehension-score').textContent = comprehension;
    document.getElementById('conversation-score').textContent = conversation;
}

// ========== SCORE CONVERTER ==========
function updateScoreConversion() {
    const detScore = parseInt(document.getElementById('det-score').value);

    if (!detScore || detScore < 10 || detScore > 160) {
        document.getElementById('toefl-score').textContent = '-';
        document.getElementById('ielts-score').textContent = '-';
        document.getElementById('cefr-level').textContent = '-';
        return;
    }

    // Round to nearest 5
    const roundedScore = roundToNearestFive(detScore);

    // Find closest match in conversion table
    let conversion = SCORE_CONVERSION_TABLE[roundedScore];

    // If exact match not found, find closest lower score
    if (!conversion) {
        const scores = Object.keys(SCORE_CONVERSION_TABLE).map(Number).sort((a, b) => b - a);
        for (let score of scores) {
            if (roundedScore >= score) {
                conversion = SCORE_CONVERSION_TABLE[score];
                break;
            }
        }
    }

    // Handle scores below 60 (A1-A2 range)
    if (roundedScore < 60) {
        conversion = { toefl: "0-17", ielts: "0-4", cefr: "A1-A2" };
    }

    if (conversion) {
        document.getElementById('toefl-score').textContent = conversion.toefl;
        document.getElementById('ielts-score').textContent = conversion.ielts;
        document.getElementById('cefr-level').textContent = conversion.cefr;
    }
}

// ========== STUDY TIMER ==========
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    document.getElementById('timer-display').textContent = formatTime(timerSeconds);
}

function toggleTimer() {
    const timerBtn = document.getElementById('timer-btn');
    const durationSelect = document.getElementById('timer-duration');

    if (isTimerRunning) {
        // Pause timer
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerBtn.textContent = 'Resume';
    } else {
        // Start timer
        isTimerRunning = true;
        timerBtn.textContent = 'Pause';
        durationSelect.disabled = true;

        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                const duration = parseInt(durationSelect.value);
                timerBtn.textContent = 'Start';
                timerSeconds = duration * 60;
                updateTimerDisplay();
                durationSelect.disabled = false;
                alert(`⏰ Great job! Your ${duration}-minute study session is complete. Take a 5-minute break!`);
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const duration = parseInt(document.getElementById('timer-duration').value);
    timerSeconds = duration * 60;
    updateTimerDisplay();
    document.getElementById('timer-btn').textContent = 'Start';
    document.getElementById('timer-duration').disabled = false;
}

function onTimerDurationChange() {
    if (!isTimerRunning) {
        resetTimer();
    }
}

// ========== MOTIVATIONAL QUOTE ==========
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    document.getElementById('quote').textContent = `💡 "${QUOTES[randomIndex]}"`;
}

// ========== SETTINGS ==========
function loadSavedSettings() {
    chrome.storage.local.get(['examDate'], (result) => {
        if (result.examDate) {
            document.getElementById('exam-date-input').value = result.examDate;
        }
    });

    updateCountdown();
}

// ========== UTILITIES ==========
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Flashcard navigation
    document.getElementById('prev-btn').addEventListener('click', goToPreviousWord);
    document.getElementById('next-btn').addEventListener('click', goToNextWord);
    document.getElementById('define-btn').addEventListener('click', defineWord);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPreviousWord();
        if (e.key === 'ArrowRight') goToNextWord();
        if (e.key === 'd' || e.key === 'D') defineWord();
    });

    // Exam date
    const datePickerBtn = document.getElementById('date-picker-btn');
    const dateInput = document.getElementById('exam-date-input');

    datePickerBtn.addEventListener('click', () => {
        // Show the date picker
        if (dateInput.showPicker) {
            dateInput.showPicker();
        } else {
            dateInput.click();
        }
    });

    dateInput.addEventListener('change', saveExamDate);

    // Score calculator
    document.getElementById('listening-score').addEventListener('input', calculateScores);
    document.getElementById('speaking-score').addEventListener('input', calculateScores);
    document.getElementById('reading-score').addEventListener('input', calculateScores);
    document.getElementById('writing-score').addEventListener('input', calculateScores);

    // Score converter
    document.getElementById('det-score').addEventListener('input', updateScoreConversion);

    // Timer
    document.getElementById('timer-btn').addEventListener('click', toggleTimer);
    document.getElementById('timer-duration').addEventListener('change', onTimerDurationChange);

    // Mastered button
    document.getElementById('mastered-btn').addEventListener('click', () => {
        // Mark as mastered (in a real app, we'd save this state)
        // For now, just move to next word with a small animation
        const card = document.getElementById('flashcard');
        card.style.transform = 'translateX(50px)';
        card.style.opacity = '0';

        setTimeout(() => {
            goToNextWord();
            card.style.transform = 'none';
            card.style.opacity = '1';
        }, 300);
    });
}

// ========== AUTO-UPDATE ==========
// Rotate quotes every 30 seconds
setInterval(displayRandomQuote, 30000);

// Update countdown every minute
setInterval(updateCountdown, 60000);

console.log('🎉 DET Practice Tools loaded successfully!');
console.log(`📚 Today's vocabulary: ${todayWordsStart} to ${(todayWordsStart + 50) % VOCAB_DATA.length}`);
