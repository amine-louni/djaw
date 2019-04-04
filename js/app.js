$(function() {
  //OVERLAY TOGGLE
  $(".menu").on("click", function() {
    $(".overlay").slideToggle();
    $(this).toggleClass("menu--on");
  });
});
