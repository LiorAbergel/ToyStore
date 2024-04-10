
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

// Retrieve the JSON data from the data attribute
var toyDataElement = document.getElementById('toyData');
var toyDataAttribute = toyDataElement.getAttribute('data-toydata');

// Parse the JSON data
var toyData = JSON.parse(toyDataAttribute);