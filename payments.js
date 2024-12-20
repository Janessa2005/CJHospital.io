// Retrieve the cart data from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateOrderSummary() {
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

// Update the order summary on page load
document.addEventListener('DOMContentLoaded', updateOrderSummary);

// Handle form submission and display payment received message
document.getElementById('payments-portal').addEventListener('submit', function(event) {
    event.preventDefault();

    // Check if all required fields are filled
    const requiredFields = ['Hospital', 'Payment','patient', 'payer','phone', 'email','cash','card'];
    let allFieldsFilled = true;

    requiredFields.forEach(function(field) {
        if (document.getElementById(field).value.trim() === '') {
            allFieldsFilled = false;
            alert(`Please fill out the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        }
    });

    if (!allFieldsFilled) {
        return;
    }

    // Get form data
    const formData = {
        hospital: document.getElementById('Hospital').value,
        paymentType: document.getElementById('Payment').value,
        address: document.getElementById('address').value,
        cash: document.getElementById('cash').value,
        card: document.getElementById('card').value,
        patientName: document.getElementById('patient').value,
        payerName: document.getElementById('payer').value,
        nic: document.getElementById('no').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        totalPrice: document.getElementById('total-price').textContent
    };

    // Store the data in localStorage
    localStorage.setItem('paymentData', JSON.stringify(formData));

    // Clear the form and display a thank you message
    document.getElementById('payments-portal').style.display = 'none';
    const dateOfTransaction = new Date().toLocaleString();
    document.body.innerHTML = `
        
        <h2>Thank you for your payment.</h2>
        <h2> Your transaction has been successfully completed.</h2>
        <h2>Date of Transaction: ${dateOfTransaction}</h2>
    `;
});
