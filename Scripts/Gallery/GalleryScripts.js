﻿// Retrieve the data from the HTML
var toyDataElement = document.getElementById('toyData');
var toyDataAttribute = toyDataElement.getAttribute('data-toydata');

var categoryDataElement = document.getElementById('categoryData');
var categoryDataAttribute = categoryDataElement.getAttribute('data-categorydata');

var ageGroupDataElement = document.getElementById('ageGroupData');
var ageGroupDataAttribute = ageGroupDataElement.getAttribute('data-agegroupdata');

// Parse the JSON data and store in variables
var toyData = JSON.parse(toyDataAttribute);
var categoryData = JSON.parse(categoryDataAttribute);
var ageGroupData = JSON.parse(ageGroupDataAttribute).sort((a, b) => a.localeCompare(b));

// Get products container
const productsContainer = document.getElementById("products-container");

document.addEventListener("DOMContentLoaded", function () {

    // Function to create checkboxes for categories
    function createCategoryCheckbox(category) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category.Name;
        checkbox.id = 'category-' + category.Name
        checkbox.addEventListener('change', function () {
            // Filter products when checkbox state changes
            renderFilteredProducts(0, calculateBatchSize());
        });

        const label = document.createElement('label');
        label.textContent = category.Name;
        label.setAttribute('for', 'category-' + category.Name.toLowerCase().replace(/\s+/g, '-'));

        const container = document.createElement('div');
        container.appendChild(checkbox);
        container.appendChild(label);

        return container;
    }

    // Populate the category filter bar with checkboxes
    const categoryFilterBar = document.getElementById('categoryFilterBar');
    categoryData.forEach(category => {
        categoryFilterBar.appendChild(createCategoryCheckbox(category));
    });

    // Function to filter products based on selected categories
    function filterProductsByCategory(products) {
        const selectedCategories = Array.from(categoryFilterBar.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        if (selectedCategories.length === 0) {
            return products; // Return all products if no categories are selected
        } else {
            return products.filter(product => selectedCategories.includes(product.Category.Name));
        }
    }

    // Function to render products based on applied filters
    function renderFilteredProducts(startIndex, batchSize) {
        const filteredProducts = filterProductsByCategory(toyData);
        const endIndex = Math.min(startIndex + batchSize, filteredProducts.length);
        productsContainer.innerHTML = ''; // Clear existing products
        for (let i = startIndex; i < endIndex; i++) {
            productsContainer.appendChild(generateProduct(filteredProducts[i]));
        }
    }

    // Select the sort options dropdown
    const sortOptionsDropdown = document.getElementById('sort-options');

    // Even listener for sort options dropdown
    sortOptionsDropdown.addEventListener('change', function () {

        // Get the selected sort option value
        const selectedSortOption = sortOptionsDropdown.value;

        // Define sorting functions for different sort options
        const sortFunctions = {
            'popular-desc': (a, b) => a.Price - b.Price,
            'price-asc': (a, b) => a.Price - b.Price,
            'price-desc': (a, b) => b.Price - a.Price,
            'category-asc': (a, b) => a.Category.Name.localeCompare(b.Category.Name),
            'name-asc': (a, b) => a.Name.localeCompare(b.Name),
            'name-desc': (a, b) => b.Name.localeCompare(a.Name)
        };

        // Sort the toyData based on the selected sort option
        if (sortFunctions[selectedSortOption]) {
            toyData.sort(sortFunctions[selectedSortOption]);
        } else {
            console.log('Invalid sort option');
        }

        // Clear the products container
        productsContainer.innerHTML = '';

        // Render products in the sorted order
        renderFilteredProducts(0, calculateBatchSize());
    });

    function generateProduct(toy) {
        const product = document.createElement("div");
        product.classList.add("product");

        // Check if the toy is out of stock
        const isOutOfStock = toy.Amount <= 0;

        product.innerHTML = `
        <img src="${toy.ImagePath}" alt="${toy.Name} Image">
        <h2>${toy.Name}</h2>
        <p>Category: ${toy.Category.Name}</p>
        <p>Description: ${toy.Description}</p>
        <p>Availability: ${isOutOfStock ? '<span style="color: red;">Out of Stock</span>' : toy.Amount}</p>
        <p>Age Group: ${toy.AgeGroup}</p>
        <h3>Price: ${toy.Price} $</h3>
        <div class="buttons">
            ${toy.Amount > 0 ? `
                 <input type="number" name="amount" value="1" min="1" max="${toy.Amount}" oninput="validity.valid||(value='');" />
                <button class="add-to-car" onclick="showCartAddingConfirmation('${toy.Name}', this.previousElementSibling.value)">Add To Cart</button>
                <button class="buy-now" onclick="">Buy Now</button>
            ` : `
                <button class="notify-me" onclick="showNotifyConfirmation('${toy.Name}')">Notify Me</button>
            `}
        </div>
        <!-- You can add more details here -->
    `;

        return product;
    }

    function showCartAddingConfirmation(toyName, amount) {
        alert(`Order placed successfully!\nToy : ${toyName}\nAmount : ${amount}`); // Display an alert message
    }

    // Function to show notifty confirmation message
    function showNotifyConfirmation(toyName) {
        alert(`Got it!\nYou'll be notified when ${toyName} is back in stock`); // Display an alert message
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

    // Scroll event handler to load more filtered products
    window.addEventListener("scroll", () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // Load more products if scrolled to the bottom
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            const currentProductCount = productsContainer.querySelectorAll('.product').length;
            const filteredProducts = filterProductsByCategory(toyData); // Filter products based on applied categories
            if (currentProductCount < filteredProducts.length) {
                const remainingProducts = filteredProducts.length - currentProductCount;
                const productsToLoad = Math.min(calculateBatchSize(), remainingProducts);
                renderFilteredProducts(currentProductCount, productsToLoad);
            }
        }
    });

    // Event listener to recalculate batch size if window is resized
    window.addEventListener("resize", () => {
        const newBatchSize = calculateBatchSize();
        // Re-render products only if the batch size changes
        if (newBatchSize !== initialBatchSize) {
            productsContainer.innerHTML = ""; // Clear existing products
            renderFilteredProducts(0, newBatchSize);
            initialBatchSize = newBatchSize; // Update initialBatchSize
        }
    });

    // Initial rendering of products with dynamically calculated batch size
    let initialBatchSize = calculateBatchSize();
    renderFilteredProducts(0, initialBatchSize);
});

