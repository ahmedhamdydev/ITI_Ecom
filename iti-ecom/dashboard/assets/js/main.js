/*------------- #General --------------*/

$('a[href="#"]').click(function ($) {
  $.preventDefault();
});
$("#sidebar-close").click(function () {
  $(".sidebar").removeClass("active");
});
$("#sidebar-open").click(function () {
  $(".sidebar").addClass("active");
});
/*------------- #show and hide password   --------------*/

$(".password-field .eye-icon").on("click", function () {
  var password_input = $(this).parent().find(".password-input");

  if (password_input.attr("type") === "password") {
    password_input.attr("type", "text");
    $(this).addClass("hide");
  } else {
    password_input.attr("type", "password");
    $(this).removeClass("hide");
  }
});
