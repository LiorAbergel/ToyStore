const productsContainer = document.getElementById("products-container");

// Retrieve the JSON data from the data attribute
var toyDataElement = document.getElementById('toyData');
var toyDataAttribute = toyDataElement.getAttribute('data-toydata');

// Parse the JSON data
var toyData = JSON.parse(toyDataAttribute);

function generateProduct(toy) {
    const product = document.createElement("div");
    product.classList.add("product");
    product.innerHTML = `
        <img src="${toy.ImagePath}" alt="${toy.Name} Image">
        <h2>${toy.Name}</h2>
        <p>Category: ${toy.Category.Name}</p>
        <p>Description: ${toy.Description}</p>
        <p>Price: ${toy.Price}</p>
        <p>Amount in stock: ${toy.Amount}</p>
        <p>Age Group: ${toy.AgeGroup}</p>

        <div class="buttons">
            <button class="add-to-cart">Add to Cart</button>
            <button class="buy-now">Buy Now</button>
        </div>
        <!-- You can add more details here -->
    `;
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