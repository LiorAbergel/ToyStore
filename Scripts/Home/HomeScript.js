function generateProduct(toy) {
    const productCard = document.createElement("div");
    productCard.classList.add('product');

    // Check if the toy is out of stock
    const isOutOfStock = toy.Amount <= 0;

    let priceHTML;
    if (toy.Discount > 0) {
        var discountedPrice = toy.Price - (toy.Price * toy.Discount / 100);
        priceHTML = `<del>$${toy.Price.toFixed(2)}</del> $${discountedPrice.toFixed(2)}`;
    } else {
        priceHTML = `$${toy.Price.toFixed(2)}`;
    }

    productCard.innerHTML = `
        <div class="product-image">
            <img src="${toy.ImagePath}" alt="${toy.Name} Image">
        </div>
        <div class="product-details">
            <h2>${toy.Name}</h2>
            <p class="price">${priceHTML}</p>
            <p class="description">${toy.Description}</p>
            <p class="availability">${isOutOfStock ? '<span class="out-of-stock">Out of Stock</span>' : 'Available'}</p>
            <p class="category">Category: ${toy.Category.Name}</p>
            <p class="age-group">Age Group: ${toy.AgeGroup}</p>
            <div class="buttons">
                ${toy.Amount > 0 ? `
                    <input type="number" name="amount" value="1" min="1" max="${toy.Amount}" oninput="validity.valid||(value='');" autocomplete="off" />
                    <button class="add-to-cart">Add To Cart</button>
                    <button class="buy-now">Buy Now</button>
                ` : `
                    <button class="notify-me">Notify Me</button>
                `}
            </div>
        </div>`;

    // Add event listeners to buttons
    const addToCartButton = productCard.querySelector('.add-to-cart');
    const buyNowButton = productCard.querySelector('.buy-now');
    const notifyMeButton = productCard.querySelector('.notify-me');

    const toyId = toy.ToyId;

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const amountInput = this.previousElementSibling;
            addToCart(toyId, amountInput.value);
        });
    }

    if (buyNowButton) {
        buyNowButton.addEventListener('click', function () {
            const amountInput = this.previousElementSibling.previousElementSibling;
            addToCart(toyId, amountInput.value);
            window.location.href = '/Order/Cart';
        });
    }

    if (notifyMeButton) {
        notifyMeButton.addEventListener('click', function () {
            showNotifyConfirmation(toy.Name);
        });
    }

    return productCard;
}

// Select the products container
const productsContainer = document.getElementById('products-container');

// Assuming you have toyData available
const toyData = JSON.parse(document.getElementById('toyData').getAttribute('data-toydata'));

// Function to populate the products container with product cards
// Function to populate the products container with product cards
function populateProductsContainer() {
    // Clear existing content
    productsContainer.innerHTML = '';
    // Iterate over toy data and generate product cards, but limit to 3 products
    for (let i = 0; i < 5 && i < toyData.length; i++) {
        const productCard = generateProduct(toyData[i]);
        productsContainer.appendChild(productCard);
    }
}
const SaleProductsContainer = document.getElementById('SaleProductsContainer-container');

function populateSaleProductsContainer(containerId, filter) {
    // Clear existing content
    SaleProductsContainer.innerHTML = '';

    // Filter toy data for products on sale
    const saleToyData = toyData.filter(toy => toy.Discount > 0);

    // Iterate over the sale toy data and generate product cards
    for (let i = 0; i < 5 && i < saleToyData.length; i++) {
        const productCard = generateProduct(saleToyData[i]);
        SaleProductsContainer.appendChild(productCard);
    }
}


const PopularProductsContainer = document.getElementById('PopularProductsContainer-container');

function populatePopularProductsContainer() {
    // Clear existing content
    PopularProductsContainer.innerHTML = '';

    // Sort toy data based on order count in descending order
    const sortedToyData = toyData.sort((a, b) => b.OrderCount - a.OrderCount);

    // Take the top 5 items
    const top5Products = sortedToyData.slice(0, 6);

    // Iterate over the top 5 products and generate product cards
    for (let i = 0; i < top5Products.length; i++) {
        const productCard = generateProduct(top5Products[i]);
        PopularProductsContainer.appendChild(productCard);
    }
}

// Call the function to populate the products container
populateProductsContainer();
populateSaleProductsContainer();
populatePopularProductsContainer();
