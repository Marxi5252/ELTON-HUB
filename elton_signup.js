document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const fullName = document.getElementById('fullName');
    const contactInfo = document.getElementById('contactInfo');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    const passwordError = document.getElementById('passwordError');
    const formSuccess = document.getElementById('formSuccess');

    if (!signupForm) return;

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (passwordError) passwordError.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'none';
        if (confirmPassword) confirmPassword.style.borderColor = 'var(--card-border)';

        const nameVal = fullName ? fullName.value.trim() : '';
        const contactVal = contactInfo ? contactInfo.value.trim() : '';
        const passVal = password ? password.value : '';
        const confirmVal = confirmPassword ? confirmPassword.value : '';

        if (!nameVal || !contactVal || !passVal) {
            if (passwordError) {
                passwordError.textContent = 'Please fill in all required fields.';
                passwordError.style.display = 'block';
            }
            return;
        }

        if (passVal.length < 6) {
            if (passwordError) {
                passwordError.textContent = 'Password must be at least 6 characters.';
                passwordError.style.display = 'block';
            }
            return;
        }

        if (passVal !== confirmVal) {
            if (passwordError) {
                passwordError.textContent = 'Passwords do not match.';
                passwordError.style.display = 'block';
            }
            if (confirmPassword) confirmPassword.style.borderColor = '#ef4444';
            return;
        }

        if (terms && !terms.checked) {
            if (passwordError) {
                passwordError.textContent = 'Please accept the Terms & Membership Rules.';
                passwordError.style.display = 'block';
            }
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userHandle', contactVal || nameVal);

        if (formSuccess) formSuccess.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'elton.html';
        }, 1500);
    });
});
