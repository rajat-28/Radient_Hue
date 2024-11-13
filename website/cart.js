let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save the cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartItemsContainer || !totalPriceElement) {
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    // Display each item in the cart
    cart.forEach((item, index) => {
        if (!item.name || !item.price) return; // Skip undefined or incomplete items

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        cartItemElement.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <img src="${item.image}" alt="Product Image">
                <h3>${item.name}</h3>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
            <p>${item.description}</p>
            <div class="quantity-price">
                <div>
                    <label for="quantity">Quantity: </label>
                    <select id="quantity" onchange="updateQuantity(${index}, this.value)">
                        <option value="1" ${item.quantity === 1 ? 'selected' : ''}>1</option>
                        <option value="2" ${item.quantity === 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${item.quantity === 3 ? 'selected' : ''}>3</option>
                    </select>
                </div>
                <div>
                    <p>Price: $${item.price}</p>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.innerHTML = `<p>Total Price: $${totalPrice.toFixed(2)}</p>`;
}

// Add an item to the cart
function addToCart(item) {
    if (!item.name || !item.price) {
        alert("Item data is incomplete.");
        return;
    }

    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    saveCart(); // Save the updated cart to localStorage
    updateCart();

    alert(`Your ${item.name} has been added to the cart!`);
}

// Remove an item from the cart by index
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart(); // Save the updated cart to localStorage
    updateCart();
}

// Update the quantity of an item by index
function updateQuantity(index, quantity) {
    const item = cart[index];
    if (item) {
        item.quantity = parseInt(quantity);
    }
    saveCart(); // Save the updated cart to localStorage
    updateCart();
}

// Event listener for all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            const description = this.getAttribute('data-description');
            
            if (name && !isNaN(price) && image && description) { // Only add valid items
                addToCart({ name, price, image, description });
            } else {
                alert("Error: Missing item details.");
            }
        });
    });

    // Load cart contents on page load
    updateCart();
});
