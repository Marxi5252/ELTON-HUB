document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginIdentifier = document.getElementById('loginIdentifier');
    const loginPassword = document.getElementById('loginPassword');
    const loginSuccess = document.getElementById('loginSuccess');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        loginError.style.display = 'none';
        loginSuccess.style.display = 'none';

        const userVal = loginIdentifier.value.trim();
        const passVal = loginPassword.value.trim();

        // 1. Basic Field Validation
        if (!userVal || !passVal) {
            loginError.textContent = 'Please enter both your contact info and password.';
            loginError.style.display = 'block';
            return;
        }

        // 2. Save Session Flag to LocalStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userHandle', userVal);

        // 3. Show Success Feedback & Redirect
        loginSuccess.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'elton.html';
        }, 1500);
    });
});
