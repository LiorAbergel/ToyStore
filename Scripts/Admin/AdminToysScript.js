// Retrieve the data from the HTML
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

// Sort the ageGroupData array alphabetically
ageGroupData.sort((a, b) => a.localeCompare(b));

// Get the products container element
const productsContainer = document.getElementById('products-container');

// Initial rendering of products with dynamically calculated batch size
let initialBatchSize = calculateBatchSize();
appendAddToyButton();
appendAddCategoryButton();
renderProducts(0, initialBatchSize);

// Function to append the "Add Toy" button to a specific element
function appendAddToyButton() {
    var buttonContainer = document.getElementById('button-container');
    if (buttonContainer) {
        var button = document.createElement('button');
        button.id = 'add-toy-button';
        button.type = 'button';
        button.textContent = 'Add Toy';
        button.onclick = addToy;
        buttonContainer.appendChild(button);
    }
}
function appendAddCategoryButton() {
    var buttonContainer = document.getElementById('button-container');
    if (buttonContainer) {
        var button = document.createElement('button');
        button.id = 'add-category-button';
        button.type = 'button';
        button.textContent = 'Add Category';
        button.onclick = addCategory;
        buttonContainer.appendChild(button);
    }
}
function addCategory() {
    var buttonContainer = document.getElementById('button-container');

    // Create input for category name
    var categoryNameInput = document.createElement('input');
    categoryNameInput.type = 'text';
    categoryNameInput.placeholder = 'Category Name';
    categoryNameInput.id = 'category-name';

    // Create input for category description
    var categoryDescriptionInput = document.createElement('input');
    categoryDescriptionInput.type = 'text';
    categoryDescriptionInput.placeholder = 'Category Description';
    categoryDescriptionInput.id = 'category-description';

    // Create a button to save the category
    var saveCategoryButton = document.createElement('button');
    saveCategoryButton.id = 'save-category-button';
    saveCategoryButton.type = 'button';
    saveCategoryButton.textContent = 'Save Category';
    saveCategoryButton.onclick = saveCategory;

    // Append inputs to the category container
    buttonContainer.appendChild(categoryNameInput);
    buttonContainer.appendChild(categoryDescriptionInput);
    buttonContainer.appendChild(saveCategoryButton);
}
function saveCategory() {
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;

    let category = { name, description }

    // Send a POST request to the server
    fetch('/Admin/AddCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the data returned by the server
        if (!data.success) {
            alert(data.message);
            return;
        }

        category = data.category;

        // Append the new category to the categoryData array
        categoryData.push(category);

        // Append the new category to the categoryDataElement
        categoryDataElement.setAttribute('data-categorydata', JSON.stringify(categoryData));

        // Append the new category to the select element
        var categorySelect = document.getElementById('category');
        var newOption = document.createElement('option');
        newOption.value = category.Name;
        newOption.textContent = category.Name;
        categorySelect.appendChild(newOption);

        // Remove the input fields and button
        document.getElementById('category-name').remove();
        document.getElementById('category-description').remove();
        document.getElementById('save-category-button').remove();

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function generateProduct(toy) {
    const product = document.createElement("div");
    product.classList.add("product");

    const backSide = document.createElement("div");
    backSide.classList.add("product-back");

    const frontSide = document.createElement("div");
    frontSide.classList.add("product-front");


    if (toy === undefined) {
        // Create a new toy object with default values
        toy = {
            ToyId: 0,
            Category: categoryData[0],
            Name: "New Toy",
            Description: "Description",
            Amount: 0,
            AgeGroup: ageGroupData[0],
            Price: 1,
            ImagePath: "https://via.placeholder.com/150",
        };

        frontSide.classList.add('hidden');
        backSide.classList.remove('hidden');
        product.classList.toggle('flip');
    }

    else {
        // Show the front side of the card
        backSide.classList.add('hidden');
    }

    product.setAttribute("id", `${toy.ToyId}`); // Set ID attribute with toy ID

    // Check if the toy is out of stock
    const isOutOfStock = toy.Amount <= 0;


    let priceHTML;
    if (toy.Discount > 0) {
        var discountedPrice = toy.Price - (toy.Price * toy.Discount / 100);

        priceHTML = `<h3>Price: <del>$${toy.Price.toFixed(2)}</del> $${discountedPrice.toFixed(2)}</h3>`;
    } else {
        priceHTML = `<h3>Price: $${toy.Price.toFixed(2)}</h3>`;
    }
    
    frontSide.innerHTML = `
        <img src="${toy.ImagePath}" alt="${toy.Name} Image">
        <h2>${toy.Name}</h2>
        <p>Category: ${toy.Category.Name}</p>
        <p>Description: ${toy.Description}</p>
        <p>Availability: ${isOutOfStock ? '<span style="color: red;">Out of Stock</span>' : toy.Amount}</p>
        ${isOutOfStock ? `
        <input type="number" name="amount" value="1" min="1" max="99" oninput="validity.valid||(value='');" />
        <button class="restock" onclick="showOrderConfirmation('${toy.Name}', this.previousElementSibling.value)">Restock</button>
        ` : ``}
        <p>Age Group: ${toy.AgeGroup}</p>
        <p>Order Count: ${toy.OrderCount}</p>
        <p>Discount: ${toy.Discount}%</p>
        ${priceHTML}
        <div class="buttons">
            <button class="edit" onclick="editToy(${toy.ToyId})">Edit</button>
            <button class="delete" onclick="confirmDeleteToy(${toy.ToyId})">Delete</button>
        </div>

    `;

    backSide.innerHTML = `
        <img src="${toy.ImagePath}" alt="${toy.Name} Image">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="${toy.Name}">

        <label for="category">Category:</label>
        <select id="category" name="category">
            <option value="${toy.Category.Name}" selected>${toy.Category.Name}</option>
            ${categoryData.filter(category => category.Name !== toy.Category.Name).map(category => `<option value="${category.Name}">${category.Name}</option>`).join('')}
        </select>

        <label for="description">Description:</label>
        <input type="text" id="description" name="description" value="${toy.Description}">

        <label for="amount">Availability:</label>
        <input type="number" id="amount" name="amount" value="${toy.Amount}" min="0" step="1">

        <label for="ageGroup">Age Group:</label>
        <select id="ageGroup" name="ageGroup">
            <option value="${toy.AgeGroup}" selected>${toy.AgeGroup}</option>
            ${ageGroupData.filter(ageGroup => ageGroup !== toy.AgeGroup).map(ageGroup => `<option value="${ageGroup}">${ageGroup}</option>`).join('')}
        </select>

        <div class="discount-container">
            <p>Discount:</p>
            <input type="number" name="amount" value="${toy.Discount}" min="0" max="90" step="5" autocomplete="off" oninput="validity.valid||(value='');" />
        </div>

        <div class="price-container">
            <label for="price">Price:</label>
            <input type="number" id="price" name="price" value="${toy.Price}" min="0" step="0.01">
        </div>

        <label for="imagePath">Image Path:</label>
        <input type="text" id="imagePath" name="imagePath" value="${toy.ImagePath}">

        <button class="save" onclick="confirmSaveToy(${toy.ToyId})">Save</button>

        </div>
    `;


    // Append front and back sides to the product div
    product.appendChild(frontSide);
    product.appendChild(backSide);

    return product;
}

function confirmDeleteToy(toyId) {
    if (confirm("Are you sure you want to delete this toy?")) {
        deleteToy(toyId);
    }
}

function confirmSaveToy(toyId) {
    if (confirm("Are you sure you want to save the changes ?")) {
        saveToy(toyId);
    }
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
function deleteToy(toyId) {
    // Send a POST request to the server
    fetch(`/Admin/DeleteToy`, {
        method: 'POST',
        body: JSON.stringify({ id: toyId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the response body as JSON
            return response.json();
        })
        .then(data => {
            alert(data.message);
            if (!data.success) {
                return;
            }

            // If the request was successful, remove the toy's element from the DOM
            const productContainer = document.getElementById('products-container');
            const productDiv = document.getElementById(`${toyId}`);
            if (productDiv) {
                productContainer.removeChild(productDiv);
                // refresh the page
                location.reload();
            } else {
                console.error(`Product with ID ${toyId} not found.`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
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
    const discount = productDiv.querySelector('.discount-container input').value;
    const price = productDiv.querySelector('#price').value;
    const imagePath = productDiv.querySelector('#imagePath').value;


    // Create a toy object
    let toy = { toyId, categoryId, name, description, amount, ageGroup, discount, price, imagePath };

    const path = (toyId === 0) ? '/Admin/AddToy' : '/Admin/EditToy';
    // Send a POST request to the server
    fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(toy),
    })
    .then(response => response.json()) // Parse the response body as JSON

    .then(data => {
        // Handle the data returned by the server
        if (!data.success) {
            alert(data.message);
            return;
        }
        toy = data.toy;

        // Remove 'hidden' class from frontSide to show it
        frontSide.classList.remove('hidden');

        // Hide backSide
        backSide.classList.add('hidden');

        // Toggle flip class to initiate flip animation
        productDiv.classList.toggle('flip');

        // Define isOutOfStock based on updated toy data
        const isOutOfStock = toy.Amount <= 0;

        // Define priceHTML based on updated toy data
        let priceHTML;
        if (toy.Discount > 0) {
            var discountedPrice = toy.Price - (toy.Price * toy.Discount / 100);

            priceHTML = `<h3>Price: <del>$${toy.Price.toFixed(2)}</del> $${discountedPrice.toFixed(2)}</h3>`;
        } else {
            priceHTML = `<h3>Price: $${toy.Price.toFixed(2)}</h3>`;
        }

        frontSide.innerHTML = `
        <img src="${toy.ImagePath}" alt="${toy.Name} Image">
        <h2>${toy.Name}</h2>
        <p>Category: ${toy.Category.Name}</p>
        <p>Description: ${toy.Description}</p>
        <p>Availability: ${isOutOfStock ? '<span style="color: red;">Out of Stock</span>' : toy.Amount}</p>
        ${isOutOfStock ? `
        <input type="number" name="amount" value="1" min="1" max="99" oninput="validity.valid||(value='');" />
        <button class="restock" onclick="showOrderConfirmation('${toy.Name}', this.previousElementSibling.value)">Restock</button>
        ` : ``}
        <p>Age Group: ${toy.AgeGroup}</p>
        <p>Order Count: ${toy.OrderCount}</p>
        <p>Discount: ${toy.Discount}%</p>
        ${priceHTML}
        <div class="buttons">
            <button class="edit" onclick="editToy(${toy.ToyId})">Edit</button>
            <button class="delete" onclick="confirmDeleteToy(${toy.ToyId})">Delete</button>
        </div>
        `;

        productDiv.setAttribute("id", `${toy.ToyId}`); // Set ID attribute with toy ID

        if (path == '/Admin/AddToy') {
            // Append the new toy to the toyData array
            toyData.push(toy);

            // Append the new toy to the toyDataElement
            toyDataElement.setAttribute('data-toydata', JSON.stringify(toyData));

            // Append the new toy to the products container
            productsContainer.prepend(productDiv);

        }
    })
    .catch((error) => {
    });
}
function addToy() {
    product = generateProduct();
    productsContainer.prepend(product);
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

// Function to apply a discount to a toy
//function applyDiscount(toyId, discount) {
//    discount = parseInt(discount);
//    const productDiv = document.getElementById(`${toyId}`);

//    fetch(`/Admin/EditDiscount`, {
//        method: 'POST',
//        body: JSON.stringify({ toyId: toyId, discount: discount }),
//        headers: {
//            'Content-Type': 'application/json'
//        }
//    })
//        .then(response => {
//            if (!response.ok) {
//                throw new Error(`HTTP error! status: ${response.status}`);
//            }
//            return response.json(); // Parse the response body as JSON
//        })
//        .then(data => {
//            // Handle the data returned by the server
//            if (data.success === false) {
//                alert(data.message);
//                return;
//            }
//        })
//        .catch(error => {
//            // Handle any errors that occur during the fetch operation or when processing the response data
//            console.error('Error:', error);
//        });

