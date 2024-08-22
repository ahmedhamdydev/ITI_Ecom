/*------------- #Navbar Auth   --------------*/
document.addEventListener("DOMContentLoaded", () => {

  // handle page white space
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";
  document.body.style.justifyContent = "space-between";
  document.body.style.alignItems = "stretch";
  document.body.style.minHeight = "100vh";

  const authButton = document.getElementById("authButton");
  const accountButton = document.getElementById("accountButton");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
  const userExist = usersList.some((user) => user.id == userData?.id);

  function handleAuthUser() {
    authButton.textContent = "Logout";
    accountButton.classList.remove("d-none");
    if (userData.role === "customer") {
      accountButton.textContent = "My Account"
    }
    if (userData.role === "seller") {
      accountButton.textContent = "Dashboard"
    }

  }
  function handleNotAuthUser() {
    authButton.innerHTML = "Sign in";
    accountButton.classList.add("d-none");
  }

  if (userData && userExist) {
    handleAuthUser();
  } else {
    handleNotAuthUser();
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
  }

  authButton.addEventListener("click", () => {
    if (userData && userExist) {
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      window.location.href = `${window.location.origin}/store/home/index.html`;
    } else {
      window.location.href = "../sign-in/index.html";
    }
  });

  accountButton.addEventListener("click", () => {
    if (userData.role === "customer") {
      window.location.href = "../../../dashboard/user/index.html";
    }
    if (userData.role === "seller") {
      window.location.href = "../../../dashboard/seller/index.html";
    }
  });
});
