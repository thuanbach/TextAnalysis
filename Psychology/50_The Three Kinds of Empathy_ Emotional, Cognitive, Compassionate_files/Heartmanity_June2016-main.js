$(function() {

    /** 
     * Mobile Nav
     *
     * Hubspot Standard Toggle Menu
     */

    $('.custom-menu-primary').addClass('js-enabled');
    
    /* Mobile button with three lines icon */
        $('.custom-menu-primary').before('<div class="mobile-trigger"><i></i><span>Menu</span></div>');
        
    /* Uncomment for mobile button that says 'MENU' 
        $('.custom-menu-primary .hs-menu-wrapper').before('<div class="mobile-trigger">MENU</div>');
    */
    
    $('.custom-menu-primary .flyouts .hs-item-has-children > a').after(' <div class="child-trigger"><i></i></div>');
    $('.custom-menu-primary').hide();
    $('.mobile-trigger').click(function() {
        $(this).next('.custom-menu-primary').fadeToggle(0);
        $('body').toggleClass('mobile-open');
        $('.child-trigger').removeClass('child-open');
        return false;
     });

    $('.child-trigger').click(function() {
        $(this).parent().siblings('.hs-item-has-children').find('.child-trigger').removeClass('child-open');
        $(this).parent().siblings('.hs-item-has-children').find('.hs-menu-children-wrapper').slideUp(0);
        $(this).next('.hs-menu-children-wrapper').slideToggle(0);
        $(this).next('.hs-menu-children-wrapper').children('.hs-item-has-children').find('.hs-menu-children-wrapper').slideUp(0);
        $(this).next('.hs-menu-children-wrapper').children('.hs-item-has-children').find('.child-trigger').removeClass('child-open');
        $(this).toggleClass('child-open');
        return false;
    });
    


});






$('.footer-container-wrapper').before('<div class="overlay"></div>');

$( document ).ready(function() {
     $('.body-container, .footer-container, .custom-logo, .custom-banner,.overlay').click(function(){
        $('body').removeClass("mobile-open");
        $('.custom-menu-primary').hide();
  });
  
});


var postday = document.getElementsByClassName('custom-day');
var setDay = document.getElementsByClassName('date_text');
for(var i = 0; i < postday.length; i++) {
if(postday[i].innerHTML == "1" || postday[i].innerHTML == "01" || postday[i].innerHTML == "21" || postday[i].innerHTML == "31") {
setDay[i].innerHTML = "st";
}
else if(postday[i].innerHTML == "2" || postday[i].innerHTML == "02" || postday[i].innerHTML == "22") {
setDay[i].innerHTML = "nd";
}
else if(postday[i].innerHTML == "3" || postday[i].innerHTML == "03" || postday[i].innerHTML == "23") {
setDay[i].innerHTML = "rd";
}
else {
setDay[i].innerHTML = "th";
} 
}





