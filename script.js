// --- Lesson Content Array ---
const lessons = [
    { title: "Intro to Docker", desc: "Watch a 10-min 'What is Docker?' video.", link: "https://www.youtube.com/results?search_query=what+is+docker+10+minutes" },
    { title: "YAML Syntax Practice", desc: "Spend 10 mins reading a YAML syntax guide.", link: "https://www.tutorialspoint.com/yaml/index.htm" },
    { title: "Python Automation Basic", desc: "Write a simple Python script to rename a file.", link: "#" },
    { title: "SQL JOIN Types", desc: "Review the differences between INNER, LEFT, and RIGHT JOINs.", link: "#" },
    { title: "REST API Basics", desc: "Learn the four main HTTP methods (GET, POST, PUT, DELETE).", link: "#" },
    { title: "Stack Overflow Search", desc: "Practice searching Stack Overflow for a complex error message.", link: "#" },
    { title: "Cloud Services (AWS/Azure)", desc: "Read about the concept of 'Serverless Computing'.", link: "#" },
    // Add more lessons here!
];

// --- DOM Elements ---
const timeInvestedEl = document.getElementById('time-invested');
const lessonTitleEl = document.getElementById('current-lesson-title');
const lessonDescEl = document.getElementById('current-lesson-desc');
const lessonLinkEl = document.getElementById('lesson-link');
const completeButton = document.getElementById('complete-button');
const gapList = document.getElementById('gap-list');

// --- Initialization Variables ---
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const LESSON_TIME_MINUTES = 10;

// --- Time Utilities ---

// Loads total minutes from local storage, defaults to 0
function loadTime() {
    return parseInt(localStorage.getItem('timeInvestedMinutes') || '0');
}

// Converts total minutes into "X Hours, Y Minutes" format
function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} Hours, ${minutes} Minutes`;
}

// Updates the display
function updateTimeDisplay() {
    const totalMinutes = loadTime();
    timeInvestedEl.textContent = formatTime(totalMinutes);
}


// --- Lesson Logic ---

function getTodaysLesson() {
    const lastLessonDate = localStorage.getItem('lastLessonDate');
    const today = new Date().toDateString();

    // Check if a new lesson should be generated
    if (lastLessonDate !== today) {
        // Generate a random lesson index and save it for the day
        const lessonIndex = Math.floor(Math.random() * lessons.length);
        localStorage.setItem('todaysLessonIndex', lessonIndex);
        localStorage.setItem('lastLessonDate', today);
        localStorage.setItem('lessonCompletedToday', 'false');
    }

    const index = parseInt(localStorage.getItem('todaysLessonIndex'));
    return lessons[index];
}

function displayLesson() {
    const lesson = getTodaysLesson();
    const isCompleted = localStorage.getItem('lessonCompletedToday') === 'true';

    lessonTitleEl.textContent = lesson.title;
    lessonDescEl.textContent = lesson.desc;

    // Show link if available
    if (lesson.link && lesson.link !== '#') {
        lessonLinkEl.href = lesson.link;
        lessonLinkEl.textContent = 'View Resource';
        lessonLinkEl.style.display = 'inline';
    } else {
        lessonLinkEl.style.display = 'none';
    }

    // Update button state
    if (isCompleted) {
        completeButton.textContent = "DONE for Today! See you tomorrow.";
        completeButton.disabled = true;
    } else {
        completeButton.textContent = `Mark as Complete (${LESSON_TIME_MINUTES} Mins)`;
        completeButton.disabled = false;
    }
}

// --- Event Listeners ---

// Handle Lesson Completion
completeButton.addEventListener('click', () => {
    if (confirm(`Did you complete the ${LESSON_TIME_MINUTES} minute task?`)) {
        // 1. Update Regret Clock
        let totalMinutes = loadTime();
        totalMinutes += LESSON_TIME_MINUTES;
        localStorage.setItem('timeInvestedMinutes', totalMinutes.toString());

        // 2. Mark lesson as done for the day
        localStorage.setItem('lessonCompletedToday', 'true');

        // 3. Update the UI
        updateTimeDisplay();
        displayLesson();

        alert(`Congratulations! You invested ${LESSON_TIME_MINUTES} more minutes into your future.`);
    }
});

// Handle Skill Gap Tracker completion
gapList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (listItem) {
        listItem.classList.toggle('completed');

        // Simple saving of skill status
        const skillId = listItem.getAttribute('data-skill');
        const isCompleted = listItem.classList.contains('completed');
        localStorage.setItem(`skill-${skillId}-completed`, isCompleted ? 'true' : 'false');
    }
});

// --- Initialization ---

function init() {
    // Load Time & Lesson
    updateTimeDisplay();
    displayLesson();

    // Load Skill Gap Tracker status
    const listItems = gapList.querySelectorAll('li');
    listItems.forEach(item => {
        const skillId = item.getAttribute('data-skill');
        if (localStorage.getItem(`skill-${skillId}-completed`) === 'true') {
            item.classList.add('completed');
        }
    });
}

// Start the app!
init();