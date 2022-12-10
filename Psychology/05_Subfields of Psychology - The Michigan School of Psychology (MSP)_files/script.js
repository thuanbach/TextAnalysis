// Feel free to place any JS you need in here! Included is a jQuery ready function that you should really use for any jQuery-related code.

jQuery(document).ready(function($){

  // Slider config, from old MSP site.
  $(".innerSlider").slides({
    preload: true,
    width: 800,
    playInterval: 5000, // [Number] Time spent on each slide in milliseconds
    pauseInterval: 8000, // [Number] Time spent on pause, triggered on any navigation or pagination click
    height: 286,
    generatePagination: true,
    pagination: true,
  }).append('<div class="clear" />');
  $(".innerSlider").slides("play");

  $('.vc-notification-wrapper .vc-close-notification').click(function(event) {
     // event.preventDefault();
     $(this).parents('.vc-notification-wrapper').fadeOut(400, function() {
        // $(this).parents('.vc-notification-wrapper').remove();
     });
  });

});


// Homepage slider made with Owl Slider
jQuery(document).ready(function($){

	$('a[href="#"]').on('click', function(e) {
		e.preventDefault();
	});

	$(".vc-owlSlider .elementor-section-wrap").addClass('owl-carousel owl-theme')

	var vcowl = $(".vc-owlSlider .elementor-section-wrap").owlCarousel({
		items: 1,
      	loop: true,
      	autoplay: true,
      	autoplayHoverPause: true,
	  	autoplayTimeout: 4500,
      	smartSpeed: 2500,
      	nav: true,
      	animateIn: 'fadeIn',
      	animateOut: 'fadeOut'
  	});

	// $('#vc-packaging-professional-homepage-section').click(function(e) {
	// 	location = '/packing-professional/';
	// });
  //
	// $('#vc-brand-owner-homepage-section').click(function(e) {
	// 	location = '/brand-owner/';
	// });

});
