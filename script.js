// --- Global Data Structures ---
const LESSON_TIME_MINUTES = 10;
const lessons = [
    { title: "Intro to Docker", desc: "Watch a 10-min 'What is Docker?' video.", link: "https://www.youtube.com/results?search_query=what+is+docker+10+minutes" },
    { title: "YAML Syntax Practice", desc: "Spend 10 mins reading a YAML syntax guide.", link: "https://www.tutorialspoint.com/yaml/index.htm" },
    { title: "Python Automation Basic", desc: "Write a simple Python script to rename a file.", link: "#" },
    { title: "SQL JOIN Types", desc: "Review the differences between INNER, LEFT, and RIGHT JOINs.", link: "#" },
    { title: "REST API Basics", desc: "Learn the four main HTTP methods (GET, POST, PUT, DELETE).", link: "#" },
];

// NEW: Richer data for Skill Gaps (Used in the clickable list and modal)
const skillGaps = {
    'docker': {
        title: "Learn Docker Basics",
        why: "Docker is essential for creating consistent development and production environments, eliminating 'it works on my machine' problems.",
        resources: [
            { name: "Official Docker 101 Video", link: "https://www.youtube.com/watch?v=fqMOX6ap5cUShortExample" },
            { name: "Docker vs. VM in 5 minutes", link: "https://www.youtube.com/watch?v=short-example-link-2" }
        ]
    },
    'yaml': {
        title: "Practice YAML Configuration",
        why: "YAML is the standard configuration language for modern DevOps tools (like Kubernetes and Ansible).",
        resources: [
            { name: "YAML Quick Tutorial", link: "https://yaml-tutorial.com/short-example" },
            { name: "Online YAML Validator", link: "https://online-yaml-validator.example.com" }
        ]
    },
    'scripting': {
        title: "Write an Automation Script",
        why: "Automation reduces manual workload, addresses Gab's anxiety over large-scale, manual server errors, and is highly valued in IT.",
        resources: [
            { name: "Python Automation for Beginners", link: "#" },
            { name: "PowerShell Basics (Windows Admin)", link: "#" }
        ]
    },
    'joins': {
        title: "Understand SQL Joins",
        why: "Proficiency in complex database queries is fundamental for back-end efficiency and data analysis in any company.",
        resources: [
            { name: "SQL Joins Visualizer", link: "#" },
            { name: "Practice SQL Joins Quiz", link: "#" }
        ]
    },
    'api': {
        title: "Practice REST API calls",
        why: "APIs are the backbone of modern software. Knowing how they work is key to integrating different company systems.",
        resources: [
            { name: "What is a REST API?", link: "#" },
            { name: "Intro to Postman tool", link: "#" }
        ]
    }
};

// --- DOM Elements ---
const timeInvestedEl = document.getElementById('time-invested');
const completeButton = document.getElementById('complete-button');
const gapList = document.getElementById('gap-list');

// Modal Elements
const modal = document.getElementById('skillModal');
const closeBtn = document.getElementsByClassName('close')[0];
const modalTitleEl = document.getElementById('modal-skill-title');
const modalDescEl = document.getElementById('modal-skill-description');
const modalResourcesEl = document.getElementById('modal-skill-resources');

// --- Time Utilities (RESTORED) ---
function loadTime() { 
    return parseInt(localStorage.getItem('timeInvestedMinutes') || '0'); 
}

function formatTime(totalMinutes) { 
    const hours = Math.floor(totalMinutes / 60); 
    const minutes = totalMinutes % 60; 
    return `${hours} Hours, ${minutes} Minutes`; 
}

function updateTimeDisplay() { 
    timeInvestedEl.textContent = formatTime(loadTime()); 
}

// --- Lesson Logic (RESTORED) ---
function getTodaysLesson() {
    const lastLessonDate = localStorage.getItem('lastLessonDate');
    const today = new Date().toDateString();

    if (lastLessonDate !== today) {
        // Generate a random lesson index and save it for the day
        const lessonIndex = Math.floor(Math.random() * lessons.length);
        localStorage.setItem('todaysLessonIndex', lessonIndex);
        localStorage.setItem('lastLessonDate', today);
        localStorage.setItem('lessonCompletedToday', 'false');
    }

    const index = parseInt(localStorage.getItem('todaysLessonIndex'));
    if (lessons && lessons.length > index) {
        return lessons[index];
    }
    return { title: "Error Loading", desc: "Please refresh.", link: "#" };
}


function displayLesson() {
    const lessonTitleEl = document.getElementById('current-lesson-title');
    const lessonDescEl = document.getElementById('current-lesson-desc');
    const lessonLinkEl = document.getElementById('lesson-link');
    
    const lesson = getTodaysLesson(); 
    const isCompleted = localStorage.getItem('lessonCompletedToday') === 'true';

    lessonTitleEl.textContent = lesson.title;
    lessonDescEl.textContent = lesson.desc;

    // Update link visibility
    if (lesson.link && lesson.link !== '#') {
        lessonLinkEl.href = lesson.link;
        lessonLinkEl.textContent = 'View Resource';
        lessonLinkEl.style.display = 'block'; // Changed to block for new design
    } else {
        lessonLinkEl.style.display = 'none';
    }

    // Update button state 
    if (completeButton) {
        if (isCompleted) {
            completeButton.textContent = "DONE for Today! See you tomorrow.";
            completeButton.disabled = true;
        } else {
            completeButton.textContent = `Mark as Complete (${LESSON_TIME_MINUTES} Mins)`;
            completeButton.disabled = false;
        }
    }
}

// --- NEW: Skill Gap & Modal Logic ---

function populateSkillList() {
    gapList.innerHTML = ''; // Clear existing list
    for (const key in skillGaps) {
        const skill = skillGaps[key];
        const listItem = document.createElement('li');
        listItem.textContent = skill.title;
        listItem.setAttribute('data-skill-key', key);
        
        // Check local storage for completion status
        if (localStorage.getItem(`skill-${key}-completed`) === 'true') {
            listItem.classList.add('completed');
        }

        gapList.appendChild(listItem);
    }
}

function openSkillModal(skillKey) {
    const skill = skillGaps[skillKey];
    
    modalTitleEl.textContent = skill.title;
    modalDescEl.textContent = skill.why;
    modalResourcesEl.innerHTML = ''; // Clear previous resources

    // Add resources as links
    skill.resources.forEach(res => {
        const link = document.createElement('a');
        link.href = res.link;
        link.textContent = res.name;
        link.target = '_blank';
        link.className = 'modal-resource-link';
        modalResourcesEl.appendChild(link);
    });

    modal.style.display = 'block';
}

// --- Event Listeners ---

// Handle Lesson Completion
if (completeButton) {
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
}


// Handle Skill Gap Clicks (to open modal OR mark complete)
gapList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (listItem) {
        const skillKey = listItem.getAttribute('data-skill-key');
        
        // 1. Toggle completion status
        listItem.classList.toggle('completed');
        const isCompleted = listItem.classList.contains('completed');
        localStorage.setItem(`skill-${skillKey}-completed`, isCompleted ? 'true' : 'false');
        
        // 2. Open the modal to show resources
        openSkillModal(skillKey);
    }
});

// Close Modal logic
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close modal if user clicks outside the content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


// --- Initialization ---

function init() {
    // 1. Initialize time and lesson status
    updateTimeDisplay();
    displayLesson(); // <--- This is now functional and will load the content

    // 2. Populate the skill list from the new data structure
    populateSkillList();
}

// Start the app!
init();
