var userData = {
  id: "a1",
  name: "admin",
  email: "admin@gmail.com",
  role: "admin",
};
document.addEventListener("DOMContentLoaded", () => {
  $("#userName").text(userData.name);
});
