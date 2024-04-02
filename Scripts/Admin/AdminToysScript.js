const productsContainer = document.getElementById('products-container');

// Retrieve the JSON data from the data attribute
var toyDataElement = document.getElementById('toyData');
var toyDataAttribute = toyDataElement.getAttribute('data-toydata');

var categoryDataElement = document.getElementById('categoryData');
var categoryDataAttribute = categoryDataElement.getAttribute('data-categorydata');

var ageGroupDataElement = document.getElementById('ageGroupData');
var ageGroupDataAttribute = ageGroupDataElement.getAttribute('data-agegroupdata');

// Parse the JSON data
var toyData = JSON.parse(toyDataAttribute);
var categoryData = JSON.parse(categoryDataAttribute);
var ageGroupData = JSON.parse(ageGroupDataAttribute);


function generateProduct(toy) {
    const product = document.createElement("div");
    product.classList.add("product");
    product.setAttribute("id", `${toy.ToyId}`); // Set ID attribute with toy ID

    // Check if the toy is out of stock
    const isOutOfStock = toy.Amount <= 0;

    // Create front and back div elements
    const frontSide = document.createElement("div");
    frontSide.classList.add("product-front");

    const backSide = document.createElement("div");
    backSide.classList.add("product-back");
    backSide.classList.add('hidden');

    // Set inner HTML content for front side
    frontSide.innerHTML = `
    <img src="${toy.ImagePath}" alt="${toy.Name} Image">
    <h2>${toy.Name}</h2>
    <p>Category: ${toy.Category.Name}</p>
    <p>Description: ${toy.Description}</p>
    <p>Availability: ${isOutOfStock ? '<span style="color: red;">Out of Stock</span>' : toy.Amount}</p>
    <p>Age Group: ${toy.AgeGroup}</p>
    <h3>Price: ${toy.Price} $</h3>
    <div class="buttons">
        <button class="edit" onclick="editToy(${toy.ToyId})">Edit</button>
    </div>
`;

    const categoryOptions =
        categoryData.map(category => `<option value="${category.Name}"></option>`).join('');

    const ageGroupOptions =
        ageGroupData.map(ageGroup => `<option value="${ageGroup}"></option>`).join('');

    backSide.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="${toy.Name}">

        <label for="category">Category:</label>
        <input list="categoryOptions" id="category" name="category" value="${toy.Category.Name}">
        <datalist id="categoryOptions">
            ${categoryOptions}
        </datalist>

        <label for="description">Description:</label>
        <input type="text" id="description" name="description" value="${toy.Description}">

        <label for="amount">Availability:</label>
        <input type="amount" id="amount" name="amount" value="${toy.Amount}" min="0">

        <label for="ageGroup">Age Group:</label>
        <input list="ageGroupOptions" id="ageGroup" name="ageGroup" value="${toy.AgeGroup}">
        <datalist id="ageGroupOptions">
            ${ageGroupOptions}
        </datalist>
           

        <label for="price">Price:</label>
        <input type="number" id="price" name="price" value="${toy.Price}" min="0" step="0.01">

        <label for="imagePath">Image Path:</label>
        <input type="text" id="imagePath" name="imagePath" value="${toy.ImagePath}">

        <button class="save" onclick="saveToy(${toy.ToyId})">Save</button>

    </div>
`;

    // Event listener to handle selection of category
    const categoryInput = backSide.querySelector('#category');
    categoryInput.addEventListener('input', function () {
        const selectedCategoryName = this.value;
        const selectedCategory = categoryData.find(category => category.Name === selectedCategoryName);
        if (selectedCategory) {
            // You can access the selected category object here
            console.log(selectedCategory);
        }
    });

    // Append front and back sides to the product div
    product.appendChild(frontSide);
    product.appendChild(backSide);

    // You can add more details or functionality here if needed

    return product;
}
function editToy(toyId) {
    const productDiv = document.getElementById(`${toyId}`);
    const frontSide = productDiv.querySelector('.product-front');
    const backSide = productDiv.querySelector('.product-back');

    if (productDiv) {
        frontSide.classList.add('hidden');
        backSide.classList.remove('hidden');
    } else {
        console.error(`Product with ID ${toyId} not found.`);
    }

    // Toggle flip class to initiate flip animation
    productDiv.classList.toggle('flip');
}

function saveToy(toyId) {
    const productDiv = document.getElementById(`${toyId}`);
    const frontSide = productDiv.querySelector('.product-front');
    const backSide = productDiv.querySelector('.product-back');

    // Get the updated toy data from the input fields
    const name = productDiv.querySelector('#name').value;
    const selectedCategoryName = productDiv.querySelector('#category').value;
    const category = categoryData.find(category => category.Name === selectedCategoryName);
    const categoryId = category.CategoryId;
    const description = productDiv.querySelector('#description').value;
    const amount = productDiv.querySelector('#amount').value;
    const ageGroup = productDiv.querySelector('#ageGroup').value;
    const price = productDiv.querySelector('#price').value;
    const imagePath = productDiv.querySelector('#imagePath').value;

    // Create a toy object
    let toy = { toyId, categoryId, category, name, description, amount, ageGroup, price, imagePath };

    // Send a POST request to the server
    fetch('/Admin/EditToy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(toy),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the data returned by the server
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // Update the front side with the new values
    frontSide.innerHTML = `
        <img src="${toy.imagePath}" alt="${toy.name} Image">
        <h2>${toy.name}</h2>
        <p>Category: ${toy.category.Name}</p>
        <p>Description: ${toy.description}</p>
        <p>Availability: ${toy.amount <= 0 ? '<span style="color: red;">Out of Stock</span>' : toy.amount}</p>
        <p>Age Group: ${toy.ageGroup}</p>
        <h3>Price: ${toy.price} $</h3>
        <div class="buttons">
            <button class="edit" onclick="editToy(${toy.toyId})">Edit</button>
        </div>
    `;

    // Toggle flip class to initiate
    backSide.classList.add('hidden');
    frontSide.classList.remove('hidden');
    productDiv.classList.toggle('flip');
}

// Function to show order confirmation message
function showOrderConfirmation(toyName, amount) {
    alert(`Order placed successfully!\nToy : ${toyName}\nAmount : ${amount}`); // Display an alert message
}


// Function to render a batch of products
function renderProducts(startIndex, batchSize) {
    const endIndex = Math.min(startIndex + batchSize, toyData.length);
    for (let i = startIndex; i < endIndex; i++) {
        productsContainer.appendChild(generateProduct(toyData[i]));
    }
}

// Function to calculate batch size dynamically based on screen size
function calculateBatchSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        return 10; // Show 3 products for small screens
    } else if (screenWidth >= 768 && screenWidth < 1024) {
        return 20; // Show 6 products for medium screens
    } else {
        return 30; // Show 9 products for large screens
    }
}

// Initial rendering of products with dynamically calculated batch size
let initialBatchSize = calculateBatchSize();
renderProducts(0, initialBatchSize);

// Scroll event handler to load more products
window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Load more products if scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        const currentProductCount = productsContainer.querySelectorAll('.product').length;
        if (currentProductCount < toyData.length) {
            const remainingProducts = toyData.length - currentProductCount;
            const productsToLoad = Math.min(calculateBatchSize(), remainingProducts);
            renderProducts(currentProductCount, productsToLoad);
        }
    }
});

// Event listener to recalculate batch size if window is resized
window.addEventListener("resize", () => {
    const newBatchSize = calculateBatchSize();
    // Re-render products only if the batch size changes
    if (newBatchSize !== initialBatchSize) {
        productsContainer.innerHTML = ""; // Clear existing products
        renderProducts(0, newBatchSize);
    }
});

// Event listener to recalculate batch size if window is resized
window.addEventListener("resize", () => {
    const newBatchSize = calculateBatchSize();
    // Re-render products only if the batch size changes
    if (newBatchSize !== initialBatchSize) {
        productsContainer.innerHTML = ""; // Clear existing products
        renderProducts(0, newBatchSize);
        initialBatchSize = newBatchSize; // Update initialBatchSize
    }
});