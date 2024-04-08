//function addCard() {
//    var cardList = document.getElementById("cardList");
//    var cardCount = cardList.getElementsByTagName("li").length + 1;
//    var newCard = document.createElement("li");
//    newCard.textContent = "Credit Card " + cardCount;
//    var closeButton = document.createElement("button");
//    closeButton.classList.add("close-button");
//    closeButton.textContent = "X";
//    closeButton.onclick = function () {
//        removeCard(newCard);
//    };
//    newCard.appendChild(closeButton);
//    newCard.addEventListener("dblclick", function () {
//        editCard();
//    });
//    newCard.onclick = function () {
//        selectCard(this);
//    };
//    cardList.appendChild(newCard);
//}

//function selectCard(card) {
//    var selectedCard = document.querySelector(".selected");
//    if (selectedCard === card) {
//        return; // If the clicked card is already selected, do nothing
//    }
//    if (selectedCard) {
//        selectedCard.classList.remove("selected");
//    }
//    card.classList.add("selected");
//}

//function editCard() {
//    var selectedCard = document.querySelector(".selected");
//    if (!selectedCard) {
//        alert("Please select a credit card to edit.");
//        return;
//    }
//    document.getElementById("editModal").style.display = "block";
//}

//function removeCard() {
//    var selectedCard = document.querySelector(".selected");
//    if (selectedCard && selectedCard.parentElement) {
//        selectedCard.parentElement.removeChild(selectedCard);
//    } else {
//        console.error("Invalid card element provided or card has no parent.");
//    }
//}

//function closeModal() {
//    document.getElementById("editModal").style.display = "none";
//}

//function saveCard() {
//    var fullName = document.getElementById("fullName").value;
//    var cardNumber = document.getElementById("cardNumber").value;
//    var expDate = document.getElementById("expDate").value;
//    var cvv = document.getElementById("cvv").value;
//    var selectedCard = document.querySelector(".selected");
//    if (selectedCard) {
//        selectedCard.textContent = fullName + " | " + cardNumber + " | " + expDate + " | " + cvv;
//        // Re-add the "X" button
//        var closeButton = document.createElement("button");
//        closeButton.classList.add("close-button");
//        closeButton.textContent = "X";
//        closeButton.onclick = function () {
//            removeCard(selectedCard);
//        };
//        selectedCard.appendChild(closeButton);
//    }
//    closeModal();
//}
document.addEventListener("DOMContentLoaded", function () {

    // Retrieve the data from the HTML
    var orderDataElement = document.getElementById('orderData');
    var orderDataAttribute = orderDataElement.getAttribute('data-orderdata');

    // Parse the JSON data
    var orderData = JSON.parse(orderDataAttribute);

    if (orderData === null || orderData.length === 0)
        return;

    // Count the total amount of products in the cart
    let total = 0;

    // Retrieve the container for the product cards
    var productCardsContainer = document.querySelector('.product-cards');

    // Iterate over orderData keys to retrieve products
    for (let i = 0; i < orderData.length; i++) {

        const order = orderData[i];

        // Create a div element for the product card
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Create h2 element for product name
        const productName = document.createElement('h2');
        productName.textContent = order.Toy.Name;
        productCard.appendChild(productName);

        // Create p element for product amount
        const productAmount = document.createElement('p');
        productAmount.textContent = `Amount: ${order.Quantity}`;
        productCard.appendChild(productAmount);

        // Create p element for product price
        const productPrice = document.createElement('p');
        const price = parseFloat(`${order.Toy.Price}`) * order.Quantity;
        total += price;
        productPrice.textContent = '$' + (price).toFixed(2);
        productCard.appendChild(productPrice);

        // Create button element for removing product
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', function () {
            removeProductCard(this, order.Toy.ToyId); // Call the function to remove the product card
        });
        productCard.appendChild(removeButton);

        // Append the product card to the container
        productCardsContainer.appendChild(productCard);
    }
   
    // Add total amount 
    const label = document.getElementById('total-amount');
    const totalAmount = document.createElement('span');
    totalAmount.textContent = calculateTotal();
    label.appendChild(totalAmount);

    // Add event listener to the checkout button
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function (event) {
        // Retrieve the user data from the HTML
        var firstNameInput = document.getElementById("first-name").value;
        var lastNameInput = document.getElementById("last-name").value;
        var emailInput = document.getElementById("email").value;
        var addressInput = document.getElementById("address").value;

        if (!validateUserForm())
            return;

        // generate random password
        var randomPassword = Math.random().toString(36).slice(-8);
        customer = { FirstName: firstNameInput, LastName: lastNameInput, Email: emailInput, Address: addressInput, Password: generateRandomPassword(), Role: "User" };

        // validate the credit card form
        if (!validateCreditCardForm())
            return;

        // Send a POST request to the server
        fetch('/Order/SubmitOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        })
        .then(response => response.json())

        .then(data => {
            // Handle the data returned by the server
            alert(data.message);

            if (!data.success)
                return; 

            // Redirect to the order home page
            window.location.href = '/Home/Index';

        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

function validateUserForm() {
    // Retrieve the user data from the HTML
    var firstNameInput = document.getElementById("first-name").value;
    var lastNameInput = document.getElementById("last-name").value;
    var emailInput = document.getElementById("email").value;
    var addressInput = document.getElementById("address").value;

    // Regular expression for validating email addresses
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the first name meets the requirements
    if (firstNameInput.length < 2 || firstNameInput.length > 50) {
        alert("First name should consist of 2 to 50 characters in length.");
        return false;
    }

    // Check if the last name meets the requirements
    if (lastNameInput.length < 2 || lastNameInput.length > 50) {
        alert("Last name should consist of 2 to 50 characters in length.");
        return false;
    }

    // Check if the email meets the requirements
    if (!emailRegex.test(emailInput)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Check if the address meets the requirements
    if (addressInput.length < 2 || addressInput.length > 100) {
        alert("Address should consist of 2 to 100 characters in length.");
        return false;
    }

    return true;
}
function validateCreditCardForm() {
    // Get the form elements
    var fullName = document.getElementById("full-name");
    var cardNumber = document.getElementById("card-number");
    var expirationDate = document.getElementById("expiration-date");
    var cvv = document.getElementById("cvv");

    // Validate full name
    if (fullName.value.trim() === "") {
        alert("Please enter your full name.");
        fullName.focus();
        return false;
    }

    // Validate card number (assuming it should be a numeric value)
    if (isNaN(cardNumber.value.trim()) || cardNumber.value.trim() === "") {
        alert("Please enter a valid card number.");
        cardNumber.focus();
        return false;
    }

    // Validate expiration date
    if (expirationDate.value.trim() === "") {
        alert("Please enter the expiration date.");
        expirationDate.focus();
        return false;
    }

    // Validate CVV (assuming it should be a numeric value)
    if (isNaN(cvv.value.trim()) || cvv.value.trim() === "") {
        alert("Please enter a valid CVV.");
        cvv.focus();
        return false;
    }

    // If all validations pass, the form is valid
    return true;
}

// Function to remove product card
function removeProductCard(button, toyId) {

    const productCard = button.closest('.product-card');
    productCard.remove(); // Remove the product card from the DOM

    // Update the total amount
    const totalAmount = document.getElementById('total-amount').firstChild;
    totalAmount.textContent = calculateTotal();

    // Send a POST request to the server
    fetch('/Customer/RemoveFromCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toyId: toyId }), // Corrected to send toyId as a JSON object
    })
    .then(response => response.json())

    .then(data => {
        // Handle the data returned by the server
        alert(data.message);

        if (!data.success)
            return;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

// Function to calculate the total amount
function calculateTotal() {
    let total = 0;
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((productCard) => {
        const price = parseFloat(productCard.querySelector('p:nth-child(3)').textContent.substring(1));
        total += price;
    });

    return 'Total: $' + total.toFixed(2);
}

function generateRandomPassword() {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialCharacters = '!@#$%^&*()-_=+';

    const allCharacters = uppercaseLetters + lowercaseLetters + digits + specialCharacters;

    let password = '';

    // Add at least one character from each character set
    password += getRandomCharacter(uppercaseLetters);
    password += getRandomCharacter(lowercaseLetters);
    password += getRandomCharacter(digits);
    password += getRandomCharacter(specialCharacters);

    // Add remaining characters randomly
    for (let i = password.length; i < 8; i++) {
        password += getRandomCharacter(allCharacters);
    }

    return password;
}

function getRandomCharacter(characterSet) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    return characterSet.charAt(randomIndex);
}
