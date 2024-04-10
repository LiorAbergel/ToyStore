// Retrieve the data from the HTML
var toyDataElement = document.getElementById('toyData');
var toyDataAttribute = toyDataElement.getAttribute('data-toydata');

var categoryDataElement = document.getElementById('categoryData');
var categoryDataAttribute = categoryDataElement.getAttribute('data-categorydata');

var ageGroupDataElement = document.getElementById('ageGroupData');
var ageGroupDataAttribute = ageGroupDataElement.getAttribute('data-agegroupdata');

// Parse the JSON data and store in variables
var toyData = JSON.parse(toyDataAttribute);
var categoryData = JSON.parse(categoryDataAttribute);
var ageGroupData = JSON.parse(ageGroupDataAttribute).sort((a, b) => b.localeCompare(a));

// Get products container
const productsContainer = document.getElementById("products-container");

// Function to show notifty confirmation message
function showNotifyConfirmation(toyName) {
    alert(`Got it!\nYou'll be notified when ${toyName} is back in stock`); // Display an alert message
}

function addToCart(toyId, amount) {

    // Create an object to hold the data
    const data = {
        toyId: toyId,
        amount: parseInt(amount)
    };

    // Send a POST request to the server
    fetch('/Customer/AddToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

    // Set default value for age group options
    const defaultValue = "8+"; // Replace "Default Age Group" with your desired default value

    // Populate the Age group options bar
    const ageGroupOptions = document.getElementById('age-group-options');

    ageGroupData.forEach(group => {
        const option = document.createElement('option');
        option.value = group; // Assuming 'group' contains the value of the age group
        option.textContent = group; // Assuming 'group' contains the display text of the age group
        if (group === defaultValue) {
            option.selected = true; // Set this option as selected if it matches the default value
        }
        ageGroupOptions.appendChild(option);
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
        let filteredProducts = filterProductsByCategory(toyData);
        filteredProducts = filterProductsByAgeGroup(filteredProducts);
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
            'popular-desc': (a, b) => b.OrderCount - a.OrderCount,
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

    // Select the age group options dropdown
    const ageGroupOptionsDropdown = document.getElementById('age-group-options');

    let selectedAgeGroup = '8+'; // Default selected age group
    // Event listener for age group options dropdown
    ageGroupOptionsDropdown.addEventListener('change', function () {
        // Get the selected age group option value
        selectedAgeGroup = ageGroupOptionsDropdown.value;

        // Render products based on selected age group
        renderFilteredProducts(0, calculateBatchSize());
    });

    // Function to filter products based on selected age group
    function filterProductsByAgeGroup(products) {
        if (selectedAgeGroup === "8+") {
            return products;
        } else if (selectedAgeGroup === "4+") {
            return products.filter(product => product.AgeGroup === "4+" || product.AgeGroup === "All ages");
        } else if (selectedAgeGroup === "All ages") {
            return products.filter(product => product.AgeGroup === "All ages");
        } else {
            return products; // Return all products if no age group is selected
        }
    }

    function generateProduct(toy) {
        const product = document.createElement("div");
        product.classList.add('product');
        product.setAttribute('id', toy.ToyId);

        // Check if the toy is out of stock
        const isOutOfStock = toy.Amount <= 0;

        let priceHTML;
        if (toy.Discount > 0) {
            var discountedPrice = toy.Price - (toy.Price * toy.Discount / 100);

            priceHTML = `<h3>Price: <del>$${toy.Price.toFixed(2)}</del> $${discountedPrice.toFixed(2)}</h3>`;
        } else {
            priceHTML = `<h3>Price: $${toy.Price.toFixed(2)}</h3>`;
        }

        product.innerHTML = `
    <img src="${toy.ImagePath}" alt="${toy.Name} Image">
    <h2>${toy.Name}</h2>
    ${priceHTML}
    <div class="details-container">
        <p>Description: ${toy.Description}</p>
        <p>Category: ${toy.Category.Name}</p>
        <p>Availability: ${isOutOfStock ? '<span style="color: red;">Out of Stock</span>' : toy.Amount}</p>
        <p>Age Group: ${toy.AgeGroup}</p>
    </div>

    <div class="buttons">
            ${toy.Amount > 0 ? `
                <input type="number" name="amount" value="1" min="1" max="${toy.Amount}" oninput="validity.valid||(value='');" autocomplete="off" />
                <button class="add-to-cart">Add To Cart</button>
                <button class="buy-now" onclick="">Buy Now</button>
            ` : `
                <button class="notify-me" onclick="showNotifyConfirmation('${toy.Name}')">Notify Me</button>
            `}
    </div>`;


        // Add event listener to the "Add To Cart" button
        const addToCartButton = product.querySelector('.add-to-cart');
        const toyId = parseInt(product.getAttribute('id'));
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function () {
                addToCart(toyId, this.previousElementSibling.value);
            });
        }

        // Add event listener to the "Buy Now" button
        const buyNowButton = product.querySelector('.buy-now');
        if (buyNowButton) {
            buyNowButton.addEventListener('click', function () {
                addToCart(toyId, this.previousElementSibling.previousElementSibling.value);
                window.location.href = '/Order/Cart';
            });
        }



        return product;
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
            const ageFilteredProducts = filterProductsByAgeGroup(filteredProducts); // Filter products based on selected age group
            if (currentProductCount < ageFilteredProducts.length) {
                const remainingProducts = ageFilteredProducts.length - currentProductCount;
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

