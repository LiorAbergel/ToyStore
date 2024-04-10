// script.js

// Define a function to toggle the display of the text container
function toggleLogin() {
    var loginForm = document.getElementById("loginForm");
    if (loginForm.style.display === "block") {
        loginForm.style.display = "none";
    } else {
        loginForm.style.display = "block";
    }
}

function showRegisterForm() {
    var loginForm = document.getElementById("loginForm");
    var registerForm = document.getElementById("register");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
}

function closeLoginForm() {
    document.getElementById("loginForm").style.display = "none";
}

// Function to fetch toy data from the server
function fetchToyData() {
    // Make a fetch request to get toy data
    fetch('/Toys/GetToyData')
        .then(response => response.json())
        .then(data => {
            // Once data is fetched, populate the containers
            populateContainers(data);
        })
        .catch(error => {
            console.error('Error fetching toy data:', error);
        });
}

// Function to populate the containers with toy cards
function populateContainers(toyData) {
    // Get references to the containers
    const containers = document.querySelectorAll('.toys-container');

    // Loop through each container and populate it with cards
    containers.forEach((container, index) => {
        // Determine how many cards to populate in each container
        const batchSize = 3; // Change this as needed

        // Calculate the start and end index for the batch of cards
        const startIndex = index * batchSize;
        const endIndex = Math.min(startIndex + batchSize, toyData.length);

        // Generate HTML for each card and append it to the container
        for (let i = startIndex; i < endIndex; i++) {
            const cardHtml = generateCardHtml(toyData[i]); // Assuming you have a function to generate card HTML
            container.innerHTML += cardHtml;
        }
    });
}

// Call the fetchToyData function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchToyData();
});