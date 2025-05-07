// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
  // Login form handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;
      
      // Clear previous error messages
      const errorElement = document.getElementById('login-error');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      
      // Validate input
      if (!email || !password) {
        errorElement.textContent = 'Please enter both email and password';
        errorElement.classList.add('show');
        return;
      }
      
      // Disable the login button to prevent multiple submissions
      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      // Set persistence based on remember me checkbox
      const persistence = remember ? 
        firebase.auth.Auth.Persistence.LOCAL : 
        firebase.auth.Auth.Persistence.SESSION;
      
      auth.setPersistence(persistence)
        .then(() => {
          return auth.signInWithEmailAndPassword(email, password);
        })
        .then(userCredential => {
          // Login successful
          console.log("Login successful, user:", userCredential.user.uid);
          showNotification('Login successful!');
          
          // Redirect to home page
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        })
        .catch(error => {
          console.error("Login error:", error.code, error.message);
          
          // Show error message
          errorElement.textContent = getAuthErrorMessage(error.code);
          errorElement.classList.add('show');
          
          // Re-enable the login button
          submitButton.disabled = false;
          submitButton.innerHTML = 'Login';
        });
    });
  }

  // Register form handling
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Clear previous error messages
      const errorElement = document.getElementById('register-error');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      
      // Validate input
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errorElement.textContent = 'Please fill all fields';
        errorElement.classList.add('show');
        return;
      }
      
      // Check if passwords match
      if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.classList.add('show');
        return;
      }
      
      // Disable the register button to prevent multiple submissions
      const submitButton = registerForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
      
      // Create user with email and password
      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          console.log("User created successfully:", userCredential.user.uid);
          
          // Add user details to Firestore
          return db.collection('users').doc(userCredential.user.uid).set({
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(() => {
          // Registration successful
          showNotification('Registration successful!');
          
          // Redirect to home page
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        })
        .catch(error => {
          console.error("Registration error:", error.code, error.message);
          
          // Show error message
          errorElement.textContent = getAuthErrorMessage(error.code);
          errorElement.classList.add('show');
          
          // Re-enable the register button
          submitButton.disabled = false;
          submitButton.innerHTML = 'Register';
        });
    });
  }

  // Forgot password
  const forgotPasswordLink = document.getElementById('forgot-password');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const errorElement = document.getElementById('login-error');
      
      if (!email) {
        errorElement.textContent = 'Please enter your email address';
        errorElement.classList.add('show');
        return;
      }
      
      // Send password reset email
      auth.sendPasswordResetEmail(email)
        .then(() => {
          showNotification('Password reset email sent. Check your inbox.');
        })
        .catch(error => {
          console.error("Password reset error:", error.code, error.message);
          errorElement.textContent = getAuthErrorMessage(error.code);
          errorElement.classList.add('show');
        });
    });
  }

  // Logout functionality
  const logoutButtons = document.querySelectorAll('#logout-btn, #mobile-logout');
  logoutButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        auth.signOut()
          .then(() => {
            console.log("User signed out");
            window.location.href = 'login.html';
          })
          .catch(error => {
            console.error("Logout error:", error);
            showNotification('Error signing out. Please try again.', 'error');
          });
      });
    }
  });
});

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  document.body.appendChild(notification);
  
  // Add active class after a small delay (for animation)
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300); // Wait for fade out animation
  }, 5000);
  
  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300); // Wait for fade out animation
  });
}

// Get user-friendly error message
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password is too weak (minimum 6 characters)';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';
    case 'auth/invalid-credential':
      return 'Invalid login credentials';
    case 'auth/operation-not-allowed':
      return 'This login method is not enabled';
    default:
      return `Authentication error: ${errorCode}`;
  }
}