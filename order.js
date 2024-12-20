let cart = [];
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

// Fetch JSON data
fetch('cart.json')
    .then(response => response.json())
    .then(data => {
        cart = data.cart;
        favourites = JSON.parse(localStorage.getItem('favourites')) || data.favourites;
        initializeEventListeners(data.functions.eventListeners);
    })
    .catch(error => console.error('Error fetching JSON data:', error));

function initializeEventListeners(eventListeners) {
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', event => {
            const medicineItem = event.target.closest('.medicine-item');
            const medicineName = medicineItem.querySelector('p:first-of-type').textContent;
            const quantityInput = medicineItem.querySelector('input[type="number"]');
            const pricePerUnitText = medicineItem.querySelector('p:nth-of-type(2)').textContent;
            const pricePerUnit = parseFloat(pricePerUnitText.replace('Price per unit: Rs.', '').trim());

            addToCart(medicineName, quantityInput.id, pricePerUnit);
        });
    });

    document.getElementById('buy-now').addEventListener('click', () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = '8.payments.html';  // Change this URL to your desired confirmation page
    });

    document.getElementById('addToFavourites').addEventListener('click', () => {
        favourites = cart.slice();
        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert('Current cart items added to favourites.');
    });

    document.getElementById('applyFavourites').addEventListener('click', () => {
        favourites.forEach(favouriteItem => {
            const existingItem = cart.find(item => item.medicineName === favouriteItem.medicineName);

            if (existingItem) {
                existingItem.quantity += favouriteItem.quantity;
            } else {
                cart.push({ ...favouriteItem });
            }
        });

        updateCartTable();
        alert('Favourites applied to current cart.');
    });

    document.getElementById('reset-cart').addEventListener('click', () => {
        cart = [];
        updateCartTable();
        alert('Cart has been reset.');
    });
}

function addToCart(medicineName, quantityInputId, pricePerUnit) {
    const quantity = parseInt(document.getElementById(quantityInputId).value);

    // Check if the quantity is a positive integer
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity greater than 0. Example: 1, 2, 3, etc.');
        return; // Exit the function if the input is invalid
    }

    const existingItem = cart.find(item => item.medicineName === medicineName);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ medicineName, quantity, pricePerUnit });
    }

    updateCartTable();
}

function updateCartTable() {
    const cartTableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
    cartTableBody.innerHTML = '';

    cart.forEach(item => {
        const row = cartTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.textContent = item.medicineName;
        cell2.textContent = item.quantity;
        cell3.textContent = `Rs.${item.pricePerUnit.toFixed(2)}`;
        cell4.textContent = `Rs.${(item.pricePerUnit * item.quantity).toFixed(2)}`;
    });

    const totalPriceCell = document.getElementById('total-price');
    const totalPrice = cart.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
    totalPriceCell.textContent = `Rs.${totalPrice.toFixed(2)}`;
}
