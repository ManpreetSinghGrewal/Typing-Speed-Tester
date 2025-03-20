// Sample sentences for the typing test
const sampleSentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Success usually comes to those who are too busy to be looking for it.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Believe you can and you're halfway there.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Your limitation—it’s only your imagination.",
    "The purpose of our lives is to be happy.",
    "Push yourself, because no one else is going to do it for you."
];

// DOM Elements
const sampleTextElement = document.getElementById('sample-text');
const typingArea = document.getElementById('typing-area');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const timeLeftElement = document.getElementById('time-left');
const resetBtn = document.getElementById('reset-btn');
const timeSelect = document.getElementById('time-select');

// Variables
let sentence = "";
let startTime;
let correctChars = 0;
let totalTypedChars = 0;
let timer;
let timeRemaining = parseInt(timeSelect.value);  // Default time
let typingActive = false;

// Load a random sentence
function loadRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sampleSentences.length);
    sentence = sampleSentences[randomIndex];
    sampleTextElement.innerHTML = sentence
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('');
    
    typingArea.value = "";
    correctChars = 0;
    totalTypedChars = 0;
    typingActive = false;
    
    // Reset stats
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";
    clearInterval(timer);
    timeRemaining = parseInt(timeSelect.value);  // Get selected time limit
    timeLeftElement.textContent = timeRemaining;
}

// Start Typing Logic
typingArea.addEventListener('input', () => {
    const typedText = typingArea.value.trim();
    const characters = sampleTextElement.querySelectorAll('span');

    if (!typingActive) {
        startTime = new Date();  // Start timing
        typingActive = true;

        // Timer Countdown
        timer = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                timeLeftElement.textContent = timeRemaining;
            } else {
                clearInterval(timer);
                typingArea.disabled = true;
                typingArea.placeholder = "⏳ Time's up! Press 'New Sentence' to restart.";
            }
        }, 1000);
    }

    totalTypedChars = typedText.length;

    // Highlight characters
    correctChars = 0;
    characters.forEach((char, index) => {
        const typedChar = typedText[index];
        if (typedChar == null) {
            char.classList.remove('correct', 'wrong');
        } else if (typedChar === char.innerText) {
            char.classList.add('correct');
            char.classList.remove('wrong');
            correctChars++;
        } else {
            char.classList.add('wrong');
            char.classList.remove('correct');
        }
    });

    // Prevent deletion of mistakes
    if (typedText.length < totalTypedChars) {
        typingArea.value = typedText; // Prevent backspacing on errors
    }

    // Calculate WPM
    const elapsedTime = (new Date() - startTime) / 60000; // Time in minutes
    const wordsTyped = correctChars / 5;
    const wpm = Math.round(wordsTyped / elapsedTime);

    // Calculate Accuracy
    const accuracy = Math.round((correctChars / totalTypedChars) * 100);

    wpmElement.textContent = isNaN(wpm) || wpm < 0 ? "0" : wpm;
    accuracyElement.textContent = isNaN(accuracy) || accuracy < 0 ? "0%" : `${accuracy}%`;
});

// Reset Logic
resetBtn.addEventListener('click', () => {
    typingArea.disabled = false;
    typingArea.placeholder = "Start typing here...";
    loadRandomSentence();
});

// Handle time selection change
timeSelect.addEventListener('change', () => {
    timeRemaining = parseInt(timeSelect.value);
    timeLeftElement.textContent = timeRemaining;
});

// Initialize App
window.addEventListener('load', loadRandomSentence);
