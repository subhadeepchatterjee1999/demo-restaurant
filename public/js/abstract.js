/*
 **********************************************************
 * OPAQUE NAVBAR SCRIPT
 **********************************************************
 */

 // Toggle tranparent navbar when the user scrolls the page

 $(window).scroll(function() {
   if($(this).scrollTop() > 50)  /*height in pixels when the navbar becomes non opaque*/
   {
       $('.opaque-navbar').addClass('opaque');
   } else {
       $('.opaque-navbar').removeClass('opaque');
   }
});
// Login
$(function () {
    $('input, select').on('focus', function () {
        $(this).parent().find('.input-group-text').css('border-color', '#80bdff');
    });
    $('input, select').on('blur', function () {
        $(this).parent().find('.input-group-text').css('border-color', '#ced4da');
    });
});
