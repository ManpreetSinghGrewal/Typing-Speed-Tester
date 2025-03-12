const sampleTextElement = document.getElementById('sample-text');
const typingArea = document.getElementById('typing-area');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeLeftDisplay = document.getElementById('time-left');
const resetButton = document.getElementById('reset-btn');
const timeSelect = document.getElementById('time-select');

let sampleText = '';
let startTime = null;
let correctCharacters = 0;
let timer = null;
let timeLimit = 60; // Default time limit

// Function to fetch a random sentence from API
async function fetchRandomSentence() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();

        sampleText = data.content;
        sampleTextElement.textContent = sampleText;

        resetTest();
    } catch (error) {
        console.error('Error fetching sentence:', error);
        sampleTextElement.textContent = "Failed to load sentence. Try again.";
    }
}

// Start countdown timer
function startTimer() {
    let timeRemaining = timeLimit;
    timeLeftDisplay.textContent = timeRemaining;

    timer = setInterval(() => {
        timeRemaining--;
        timeLeftDisplay.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            endTest();
        }
    }, 1000);
}

// Typing logic
typingArea.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
        startTimer();
    }

    const userInput = typingArea.value;

    let correctChars = 0;
    let totalTyped = userInput.length;

    const formattedText = sampleText.split('').map((char, index) => {
        if (userInput[index] === undefined) {
            return `<span>${char}</span>`;
        } else if (userInput[index] === char) {
            correctChars++;
            return `<span class="correct">${char}</span>`;
        } else {
            return `<span class="wrong">${char}</span>`;
        }
    }).join('');

    sampleTextElement.innerHTML = formattedText;

    correctCharacters = correctChars;

    // Accuracy Calculation
    const accuracy = Math.round((correctChars / totalTyped) * 100);
    accuracyDisplay.textContent = isNaN(accuracy) ? '0%' : accuracy + '%';

    // WPM Calculation
    const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = sampleText.slice(0, correctCharacters).split(/\s+/).length;

    if (timeElapsed > 0) {
        const wpm = Math.round(wordsTyped / timeElapsed);
        wpmDisplay.textContent = wpm;
    }
});

// End the test and display final results
function endTest() {
    typingArea.disabled = true;
    typingArea.placeholder = "Time's up! Click 'New Sentence' to try again.";
}

// Reset functionality (generate a new sentence)
resetButton.addEventListener('click', fetchRandomSentence);

// Time limit change handler
timeSelect.addEventListener('change', () => {
    timeLimit = parseInt(timeSelect.value, 10);
    resetTest();
});

// Reset everything
function resetTest() {
    typingArea.disabled = false;
    typingArea.value = '';
    startTime = null;
    correctCharacters = 0;
    clearInterval(timer);

    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    timeLeftDisplay.textContent = timeLimit;
}

// Initial sentence on load
window.onload = fetchRandomSentence;
