// Retrieve users from localStorage
const users = JSON.parse(localStorage.getItem('usersList')) || [];

// Function to authenticate the user
function authenticate(email, password) {
    return users.find(user => user.email === email && user.password === password);
}

// Function to handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = authenticate(email, password);
    if (user) {
        delete user.password;
        localStorage.setItem('userData' , JSON.stringify(user));
        // alert(`Welcome, ${user.role}`);
        localStorage.setItem('userRole', user.role);

        
        if(user.role === "customer"){
            window.location.href = '../home/index.html';
        }
        if(user.role === "seller"){
            window.location.href = '../../../dashboard/seller/index.html';
        }

        // window.location.href = `../../home/${user.role.toLowerCase()}.html`; // Redirect based on role


    } else {
        alert('Invalid email or password');
    }
});