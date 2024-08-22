// Function to get the next numerical UUID
function generateUUID() {
    let nextId = parseInt(localStorage.getItem('nextUserId')) || 1;
    localStorage.setItem('nextUserId', nextId + 1);
    return nextId;
}

// Array to store usersList
let usersList = JSON.parse(localStorage.getItem('usersList')) || [];

// Function to handle create account form submission
document.getElementById('createAccountForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const name = `${firstName} ${lastName}`;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();

    // Validate password length
    if (password.length < 8) {
        document.getElementById('passwordAlert').classList.remove('d-none');
        return;
    } else {
        document.getElementById('passwordAlert').classList.add('d-none');
    }

    // Check if the user already exists
    const userExists = usersList.some(user => user.email === email);
    if (userExists) {
        alert('User already exists');
        return;
    }

    // Create a new user object
    const newUser = { id: generateUUID(), name, email, password, role };
    usersList.push(newUser);

    // Save usersList to localStorage
    localStorage.setItem('usersList', JSON.stringify(usersList));

    alert('Account created successfully');
    window.location.href = '../sign-in/index.html'; 
});

// Function to validate email on input
document.getElementById('email').addEventListener('input', validateEmail);

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailAlert = document.getElementById('emailAlert');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
        emailAlert.classList.remove('d-none');
    } else {
        emailAlert.classList.add('d-none');
    }
}

// Function to validate password on input
document.getElementById('password').addEventListener('input', validatePassword);

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordAlert = document.getElementById('passwordAlert');
    const minLength = 8;

    if (passwordInput.value.trim().length < minLength) {
        passwordAlert.classList.remove('d-none');
    } else {
        passwordAlert.classList.add('d-none');
    }
}