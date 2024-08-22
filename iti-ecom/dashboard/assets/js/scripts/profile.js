const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
const userData = JSON.parse(localStorage.getItem("userData")) || {};
const currentData = usersList.find((user) => user.id == userData.id);

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("name").value = currentData.name;
  document.getElementById("email").value = currentData.email;
  document.getElementById("password").value = currentData.password;
});

const validateInputs = () => {
  clearValidationErrors();
  let isValid = true;
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  if (!name.value.trim()) {
    setValidationError(name, "name is required.");
    isValid = false;
  }

  if (!validateEmail(email.value)) {
    setValidationError(email, "Please enter a valid email.");
    isValid = false;
  } else if (emailExists(email.value, userData.id)) {
    setValidationError(email, "Email already exists.");
    isValid = false;
  }

  if (!password.value.trim()) {
    setValidationError(password, "password is required.");
    isValid = false;
  } else if (password.value.length < 6) {
    setValidationError(
      password,
      "Password must be at least 6 characters long."
    );
    isValid = false;
  }

  return isValid;
};

const setValidationError = (element, message) => {
  element.classList.add("border-danger");
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("text-danger");
  errorDiv.innerText = message;
  element.parentNode.appendChild(errorDiv);
};

const clearValidationErrors = () => {
  document
    .querySelectorAll(".border-danger")
    .forEach((el) => el.classList.remove("border-danger"));
  document.querySelectorAll(".text-danger").forEach((el) => el.remove());
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const emailExists = (email, currentUserId) => {
  return usersList.some(
    (user) => user.email == email && user.id != currentUserId
  );
};

function saveProfile() {
  if (!validateInputs()) {
    return;
  }

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  userData.name = name;
  userData.email = email;
  userData.password = password;

  const userIndex = usersList.findIndex((user) => user.id == userData.id);
  if (userIndex !== -1) {
    usersList[userIndex] = { ...userData };
  }
  localStorage.setItem("usersList", JSON.stringify(usersList));
  localStorage.setItem("userData", JSON.stringify(userData));

  alert("Profile updated successfully!");
  $("#userName").text(name);
  window.scrollTo(0, 0);
}
