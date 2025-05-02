// Password toggle functionality
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const passwordInput = this.previousElementSibling;
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
  });
});

// Login form submission
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (email && password) {
      // In a real app, you would send this to your backend
      localStorage.setItem('loggedInUser', email);
      window.location.href = 'account.html';
    } else {
      alert('Please fill in all fields');
    }
  });
}

// Account page functionality
if (document.getElementById('logout')) {
  // Display user info
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    document.getElementById('username-display').textContent = loggedInUser.split('@')[0];
    document.getElementById('account-email').textContent = loggedInUser;
  } else {
    window.location.href = 'acc.login.html';
  }
  
  // Logout functionality
  document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    window.location.href = 'acc.login.html';
  });
}