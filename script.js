// Cart Functionality
let cart = [];

function addToCart(product) {
  cart.push(product);
  updateCartCount();
  saveCartToLocalStorage();
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.innerText = cart.length;
  }
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

// Load cart from localStorage when the page loads
loadCartFromLocalStorage();

// Add to Cart Button Functionality
document.querySelectorAll('.add-to-cart').forEach((button, index) => {
  button.addEventListener('click', () => {
    const product = {
      name: document.querySelectorAll('.product-card h3')[index].innerText,
      price: document.querySelectorAll('.product-card p')[index].innerText,
      image: document.querySelectorAll('.product-card img')[index].src,
    };
    addToCart(product);
    alert(`${product.name} added to cart!`);
  });
});

// Buy Now Button Functionality
document.querySelectorAll('.buy-now').forEach((button, index) => {
  button.addEventListener('click', () => {
    const product = {
      name: document.querySelectorAll('.product-card h3')[index].innerText,
      price: document.querySelectorAll('.product-card p')[index].innerText,
      image: document.querySelectorAll('.product-card img')[index].src,
    };
    alert(`You are buying ${product.name} for ${product.price}. Proceeding to checkout...`);
    // Redirect to checkout page or payment gateway
  });
});

// Prescription Modal Functionality
const prescriptionModal = document.getElementById('prescription-modal');
const prescriptionButtons = document.querySelectorAll('.prescription');
const closeModal = document.querySelector('.close');

// Open modal when prescription button is clicked
prescriptionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    prescriptionModal.style.display = 'block';
  });
});

// Close modal when close button is clicked
closeModal.addEventListener('click', () => {
  prescriptionModal.style.display = 'none';
});

// Close modal when clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target === prescriptionModal) {
    prescriptionModal.style.display = 'none';
  }
});

// Handle prescription form submission
document.getElementById('prescription-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const file = document.getElementById('prescription-file').files[0];
  if (file) {
    alert(`Prescription uploaded: ${file.name}`);
    prescriptionModal.style.display = 'none';
  } else {
    alert('Please upload a valid prescription file.');
  }
});

// Fetch products from the backend
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    console.log('Products:', products);
    // Render products on the page
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

fetchProducts();

// Handle prescription upload
document.getElementById('prescription-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('prescription-file');
  const formData = new FormData();
  formData.append('prescription', fileInput.files[0]);

  try {
    const response = await fetch('/api/upload-prescription', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    alert(result.message);
    prescriptionModal.style.display = 'none';
  } catch (error) {
    console.error('Error uploading prescription:', error);
    alert('Failed to upload prescription.');
  }
});

// Handle Razorpay payment
document.getElementById('razorpay-btn').addEventListener('click', async () => {
  const amount = 500; // Replace with actual amount
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const order = await response.json();
    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: order.amount,
      currency: order.currency,
      name: 'Lensshine Clone',
      description: 'Payment for Eyewear',
      order_id: order.id,
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#ff6600',
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    alert('Failed to initiate payment.');
  }
});

// Handle Stripe payment
document.getElementById('stripe-btn').addEventListener('click', async () => {
  const amount = 500; // Replace with actual amount
  try {
    const response = await fetch('/api/create-stripe-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const { client_secret } = await response.json();
    const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
    const { error } = await stripe.confirmCardPayment(client_secret);
    if (error) {
      alert('Payment failed. Please try again.');
    } else {
      alert('Payment successful!');
    }
  } catch (error) {
    console.error('Error processing Stripe payment:', error);
    alert('Failed to initiate payment.');
  }
});

// Add to Cart Button Functionality
document.querySelectorAll('.add-to-cart').forEach((button, index) => {
  button.addEventListener('click', () => {
    const product = {
      name: document.querySelectorAll('.product-card h3')[index].innerText,
      price: document.querySelectorAll('.product-card p')[index].innerText,
      image: document.querySelectorAll('.product-card img')[index].src,
    };
    addToCart(product);
    alert(`${product.name} added to cart!`);
    window.location.href = 'cart.html'; // Redirect to cart page
  });
});

// Buy Now Button Functionality
document.querySelectorAll('.buy-now').forEach((button, index) => {
  button.addEventListener('click', () => {
    const product = {
      name: document.querySelectorAll('.product-card h3')[index].innerText,
      price: document.querySelectorAll('.product-card p')[index].innerText,
      image: document.querySelectorAll('.product-card img')[index].src,
    };
    document.getElementById('payment-section').style.display = 'block'; // Show payment options
  });
});

// Search Bar Functionality
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-bar').value;
  alert(`Searching for: ${query}`);
  // Implement search functionality
});

// Add Select Lenses and Purchase Button Functionality
document.querySelectorAll('.select-lenses').forEach((button, index) => {
  button.addEventListener('click', () => {
    const product = {
      name: document.querySelectorAll('.product-card h3')[index].innerText,
      price: document.querySelectorAll('.product-card p')[index].innerText,
      image: document.querySelectorAll('.product-card img')[index].src,
    };
    alert(`You are selecting lenses for ${product.name}. Proceeding to lens selection...`);
    // Redirect to lens selection page or open a modal for lens selection
  });
});

// Open modal when "Select Lenses and Purchase" button is clicked
document.querySelectorAll('.select-lenses').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById('la-prescription-modal-wrapper').style.display = 'flex';
  });
});

// Close modal when close button is clicked
document.querySelector('.la-prescription-modal-close').addEventListener('click', () => {
  document.getElementById('la-prescription-modal-wrapper').style.display = 'none';
});

// Close modal when clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('la-prescription-modal-wrapper')) {
    document.getElementById('la-prescription-modal-wrapper').style.display = 'none';
  }
});

// Toggle "Choose Your Lenses" section when "SINGLE VISION" button is clicked
document.addEventListener('DOMContentLoaded', function () {
  const singleVisionButton = document.getElementById('single_vision');
  const chooseLensesSection = document.getElementById('choose-lenses-section');

  // Debugging: Log the elements to the console
  console.log('Single Vision Button:', singleVisionButton);
  console.log('Choose Lenses Section:', chooseLensesSection);

  if (singleVisionButton && chooseLensesSection) {
    singleVisionButton.addEventListener('click', function () {
      console.log('Button Clicked!'); // Debugging: Log button click

      // Toggle the visibility of the "Choose Your Lenses" section
      if (chooseLensesSection.style.display === 'none' || chooseLensesSection.style.display === '') {
        chooseLensesSection.style.display = 'block'; // Show the section
      } else {
        chooseLensesSection.style.display = 'none'; // Hide the section
      }
    });
  } else {
    console.error('Elements not found!'); // Debugging: Log if elements are missing
  }
});

// Toggle "Choose Your Lenses" section when "SINGLE VISION" button is clicked
document.addEventListener('DOMContentLoaded', function () {
  const singleVisionButton = document.getElementById('single_vision');

  if (singleVisionButton) {
    singleVisionButton.addEventListener('click', function () {
      console.log('Redirecting to lenses.html...'); // Debugging: Log redirection
      window.location.href = 'lenses.html'; // Redirect to the new page
    });
  } else {
    console.error('Single Vision Button not found!'); // Debugging: Log if the button is missing
  }
});
// Product Management
if (window.location.pathname.includes('products.html')) {
  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');

  // Load existing products
  let products = JSON.parse(localStorage.getItem('products')) || [];

  // Display products
  function displayProducts() {
    productList.innerHTML = products
      .map(
        
        (product, index) => `
        <div class="product-item">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
          <img src="${product.image}" alt="${product.name}" width="100">
          <button onclick="deleteProduct(${index})">Delete</button>
        </div>
      `
      )
      .join('');
  }

  // Add new product
  productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newProduct = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: document.getElementById('product-price').value,
      image: document.getElementById('product-image').value,
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    productForm.reset();
  });

  // Delete product
  window.deleteProduct = function (index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
  };

  displayProducts();
}

// Update navigation based on login state
function updateAuthLinks() {
  const loginLink = document.getElementById('login-link');
  const accountLink = document.getElementById('account-link');
  
  if (localStorage.getItem('loggedInUser')) {
    loginLink.style.display = 'none';
    accountLink.style.display = 'block';
  } else {
    loginLink.style.display = 'block';
    accountLink.style.display = 'none';
  }
}

// Call on page load
updateAuthLinks();

document.querySelectorAll('.gender-box').forEach(box => {
  box.addEventListener('click', function() {
    // Remove active class from all boxes
    document.querySelectorAll('.gender-box').forEach(b => {
      b.classList.remove('active');
    });
    // Add active class to clicked box
    this.classList.add('active');
    
    // Here you could add logic to filter content based on gender selection
    console.log('Selected gender:', this.querySelector('span').textContent);
  });
});