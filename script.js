document.addEventListener('DOMContentLoaded', () => {
    // --- Screen Elements ---
    const loginScreen = document.getElementById('login-screen');
    const questionScreen = document.getElementById('question-screen');
    const messageScreen = document.getElementById('message-screen');

    // --- Login Screen Elements ---
    const nicknameInput = document.getElementById('nickname-input');
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('error-message');

    // Accepted nicknames (case-insensitive)
    const acceptedNicknames = ['roy', 'be', 'beb', 'mahal', 'buba', 'bebeb', 'baby'];

    // --- Question Screen Elements ---
    const sobraButton = document.getElementById('sobra-button');
    const hindiButton = document.getElementById('hindi-button');

    // State variable to track if 'SOBRA' has been clicked
    let sobraClicked = false;

    // --- Function to switch screens ---
    function showScreen(screenToShow) {
        loginScreen.classList.add('hidden');
        questionScreen.classList.add('hidden');
        messageScreen.classList.add('hidden');
        screenToShow.classList.remove('hidden');
    }

    // --- Login Logic ---
    loginButton.addEventListener('click', () => {
        const inputNickname = nicknameInput.value.trim().toLowerCase();

        if (acceptedNicknames.includes(inputNickname)) {
            errorMessage.textContent = '';
            showScreen(questionScreen);
        } else {
            // Updated error message for incorrect nickname
            errorMessage.textContent = 'MALI SINONG LALAKI YAN BEBENG BRUH!! 😡';
        }
    });

    // Allows pressing Enter to login
    nicknameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    // --- Question Logic ---

    // Make 'Hindi Bruh' button move
    hindiButton.addEventListener('mouseover', () => {
        if (!sobraClicked) { // Only move if 'SOBRA' hasn't been clicked
            const containerRect = hindiButton.closest('.options').getBoundingClientRect();
            const buttonRect = hindiButton.getBoundingClientRect();

            // Calculate new random position within the container bounds
            // We want it to stay mostly within the options div to not disappear
            const newX = Math.random() * (containerRect.width - buttonRect.width) - (buttonRect.left - containerRect.left);
            const newY = Math.random() * (containerRect.height - buttonRect.height) - (buttonRect.top - containerRect.top);


            hindiButton.style.position = 'relative'; // Ensure relative positioning for top/left
            hindiButton.style.left = `${newX}px`;
            hindiButton.style.top = `${newY}px`;
            hindiButton.style.transition = 'all 0.1s ease-out'; // Smooth movement
        }
    });

    // Reset button position when mouse leaves (optional, but makes it less frustrating)
    hindiButton.addEventListener('mouseout', () => {
        if (!sobraClicked) {
            hindiButton.style.left = '0px';
            hindiButton.style.top = '0px';
            hindiButton.style.transition = 'all 0.3s ease-in-out';
        }
    });

    // If 'Hindi Bruh' is clicked, do nothing (or show a subtle message)
    hindiButton.addEventListener('click', () => {
        if (!sobraClicked) {
            // Optionally, you could add a subtle text message here instead of an alert
            // For now, we'll just let the movement do the talking.
        }
    });


    sobraButton.addEventListener('click', () => {
        sobraClicked = true; // Set the flag
        // Reset hindiButton position just in case, and remove its hover effect
        hindiButton.style.position = 'static';
        hindiButton.style.left = '0';
        hindiButton.style.top = '0';
        hindiButton.style.transition = 'none'; // Disable transition after 'SOBRA' is clicked
        // You might want to disable the hover effect or make the button less prominent
        hindiButton.style.pointerEvents = 'none'; // Make it unclickable after SOBA is picked
        hindiButton.style.opacity = '0.5'; // Visually indicate it's disabled

        showScreen(messageScreen);
    });

    // --- Floating Hearts Animation Logic ---
    const heartContainer = document.querySelector('.heart-container');
    const numberOfHearts = 20;

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '💖';

        // Randomize position and animation delay
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 8 + 6}s`; // 6s to 14s duration
        heart.style.animationDelay = `-${Math.random() * 10}s`; // Start off-screen
        heart.style.fontSize = `${Math.random() * 1.5 + 1.5}em`; // 1.5em to 3em size

        heartContainer.appendChild(heart);

        // Remove heart after it's done animating to save memory
        setTimeout(() => {
            heart.remove();
        }, (parseFloat(heart.style.animationDuration) * 1000) + 100);
    }

    // Generate hearts initially and then continuously
    for (let i = 0; i < numberOfHearts; i++) {
        createHeart();
    }

    // Keep generating new hearts every second
    setInterval(createHeart, 1000);

});
