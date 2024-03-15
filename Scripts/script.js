
// script.js

// Define a function to toggle the display of the text container
function toggleExpand() {
    var rightColumn = document.querySelector('.right-column');
    rightColumn.classList.toggle('expanded');
}
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
