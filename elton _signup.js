document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const formSuccess = document.getElementById('formSuccess');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Reset messages
        passwordError.style.display = 'none';

        // 2. Validate Password Match
        if (password.value !== confirmPassword.value) {
            passwordError.style.display = 'block';
            confirmPassword.style.borderColor = '#ef4444';
            return;
        }

        // Restore border style if matched
        confirmPassword.style.borderColor = 'var(--card-border)';

        // 3. Show Success Message
        formSuccess.style.display = 'block';

        // 4. Simulate Redirection back to Hub after 2 seconds
        setTimeout(() => {
            window.location.href = 'elton.html';
        }, 2000);
    });
});
