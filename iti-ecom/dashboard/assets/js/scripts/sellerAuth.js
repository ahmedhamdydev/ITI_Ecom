document.addEventListener("DOMContentLoaded", () => {
  const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
  const userData = JSON.parse(localStorage.getItem("userData"));


  if (!userData || !usersList.some((user) => user.id == userData?.id ) || userData.role != "seller" ) {
    alert("Auth error");
    localStorage.removeItem("userData");
    window.location.href = `${window.location.origin}/store/home/index.html`;
    return;
  }

  $("#userName").text(userData.name);
});
$(".logoBox").click(function () {
  window.location.href = `${window.location.origin}/store/home/index.html`;
});

$(".logout-link").click(function () {
  localStorage.removeItem("userData");
  localStorage.removeItem("userRole");
  window.location.href = `${window.location.origin}/store/home/index.html`;
});