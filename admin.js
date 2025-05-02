document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic authentication (replace with secure backend validation)
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('isAuthenticated', 'true');
    window.location.href = 'dashboard.html'; // Redirect to dashboard
  } else {
    alert('Invalid username or password');
  }
});

// Check authentication on dashboard load
if (window.location.pathname.includes('dashboard.html')) {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) {
    window.location.href = 'login.html'; // Redirect to login if not authenticated
  }
}

// Logout functionality
document.getElementById('logout')?.addEventListener('click', function () {
  localStorage.removeItem('isAuthenticated');
  window.location.href = 'login.html';
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
// Update dashboard stats
if (window.location.pathname.includes('dashboard.html')) {
  const totalProducts = document.getElementById('total-products');
  const totalSales = document.getElementById('total-sales');

  // Load products from localStorage
  const products = JSON.parse(localStorage.getItem('products')) || [];

  // Update stats
  totalProducts.textContent = products.length;
  totalSales.textContent = products.reduce((sum, product) => sum + parseFloat(product.price), 0).toFixed(2);
}
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
          <div class="product-images">
            ${product.images.map((image) => `<img src="${image}" alt="${product.name}">`).join('')}
          </div>
          <button onclick="deleteProduct(${index})">Delete</button>
        </div>
      `
      )
      .join('');
  }

  // Add new product
  productForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productDescription = document.getElementById('product-description').value;
    const productPrice = document.getElementById('product-price').value;
    const productImages = document.getElementById('product-images').files;

    // Convert FileList to array of image URLs
    const imageUrls = [];
    for (let i = 0; i < productImages.length; i++) {
      const file = productImages[i];
      const imageUrl = URL.createObjectURL(file);
      imageUrls.push(imageUrl);
    }

    const newProduct = {
      name: productName,
      description: productDescription,
      price: productPrice,
      images: imageUrls,
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