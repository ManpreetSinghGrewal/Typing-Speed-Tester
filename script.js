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

// Predefined array of longer sentences
const sentences = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Persistence and dedication often outweigh talent alone in achieving true greatness.",
    "The world is full of magical things patiently waiting for our senses to grow sharper. When we pause to appreciate the beauty around us, our creativity flourishes.",
    "In the middle of every difficulty lies opportunity. Challenges force us to grow beyond our comfort zones, unlocking potential we never imagined we possessed.",
    "The only limit to our realization of tomorrow is our doubts of today. Confidence and belief in oneself pave the way for extraordinary accomplishments.",
    "Happiness is not something ready-made. It comes from your own actions, built through consistent effort and thoughtful choices each day.",
    "A journey of a thousand miles begins with a single step. Small, consistent progress is the key to achieving long-term success in any endeavor.",
    "Time is a created thing. To say 'I don’t have time' is to say 'I don’t want to.' Prioritizing our values allows us to focus on what truly matters.",
    "Creativity is intelligence having fun. By allowing curiosity to guide us, we tap into endless possibilities and discover new solutions.",
    "Don’t watch the clock; do what it does. Keep going. Consistency, even in small steps, leads to remarkable achievements over time.",
    "Our greatest glory is not in never falling, but in rising every time we fall. Resilience shapes us into stronger and wiser individuals."
];

// Function to get a random sentence from the array
function getRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
}

// Function to set a new sample text
function setNewSentence() {
    sampleText = getRandomSentence();
    sampleTextElement.textContent = sampleText;
    resetTest();
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
resetButton.addEventListener('click', setNewSentence);

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
window.onload = setNewSentence;
