"use strict";

// Toggle password visibility
const toggleButtons = document.querySelectorAll('.toggle-password');
        
toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const inputId = this.getAttribute('data-for');
        const passwordInput = document.getElementById(inputId);
        
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// Password strength meter
const newPassword = document.getElementById('newPassword');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

newPassword.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Clear previous classes
    strengthBar.className = '';
    
    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Voer een nieuw wachtwoord in';
    } else if (strength < 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Zwak';
    } else if (strength < 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Gemiddeld';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Sterk';
    }
});

// Form submission handlers
const forms = document.querySelectorAll('form');
const successMessage = document.getElementById('success-message');

forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        successMessage.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });
});

const cancelButtons = document.querySelectorAll('.cancel-btn');

cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Reset the form
        const form = this.closest('form');
        form.reset();
    });
});