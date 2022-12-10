var banner = document.getElementById('banner');
var legal = document.getElementById('roll-cta');

var tl = new TimelineMax({repeat:0, repeatDelay:2.2});
window.onload = function() {

  tl.set(banner, {visibility: "visible"})

	/*frame one*/
	.from(".dell-logo, .cta-1, .funding-box", .5, { alpha:0, alpha:0, ease:Quad.easeInOut}, "frame1")
    .from(".pro-f1",.5, { alpha:0, xPercent:10, ease:Power4.easeout}, "frame1")    
	.from(".title1", .5, { alpha:0, xPercent:-25, ease:Quad.easeInOut}, "frame1+=.3")
	.to(".title1", .5, { alpha:0, ease:Quad.easeInOut}, "frame1+=2.5")
	.to(".pro-f1, .cta-1, .dell-logo, .funding-box", .5, { alpha:0, ease:Quad.easeInOut}, "frame1+=2.5")

	/*frame two*/
	.add("frame2","frame1+=3")	
    .from(".f2-img, .cta-2", .5, { alpha:0, ease:Power4.easeout}, "frame2")	
	.from(".title2", .5, { alpha:0, xPercent:-25, ease:Quad.easeInOut}, "frame2+=.3")
	.to(".title2, .f2-img, .cta-2", .5, { alpha:0, ease:Quad.easeInOut}, "frame2+=2.5")

	/*frame three*/
	.add("frame3","frame2+=3")
	.to(".cta-1", .5, { alpha:1, ease:Quad.easeInOut}, "frame3")
    .from(".pro-f3, .upto", .5, { alpha:0, xPercent:25, ease:Power4.easeout}, "frame3")	
	.from(".title3, .product-price", .5, { alpha:0, ease:Expo.easeInOut}, "frame3+=.3")	
	.from(".viof3", .5, { yPercent:-150, ease:Expo.easeInOut}, "frame3+=.3")	
	.from(".vio_textf3", .5, {yPercent:-100, ease:Expo.easeInOut}, "frame3+=.8")
	.to(".viof3, .vio_textf3", .5, {alpha:0, ease: Power1.easeInOut}, "frame3+=2.5")	
	.to(".pro-f3, .title3,.product-price, .upto", .5, { alpha:0, ease:Quad.easeInOut}, "frame3+=2.5")

	/*frame three*/
	.add("frame4","frame3+=3")
    .from(".pro-f4", .5, { alpha:0, xPercent:25, ease:Power4.easeout}, "frame4")	
	.from(".title4,.product-price1", .5, { alpha:0, ease:Power4.easeout}, "frame4")	
	.from(".viof4", .5, { xPercent:-150, ease:Expo.easeInOut}, "frame4+=.3")	
	.from(".vio_textf4", .5, {xPercent:-100, ease:Expo.easeInOut}, "frame4+=.8")
	.to(".viof4, .vio_textf4", .5, {alpha:0, ease: Power1.easeInOut}, "frame4+=2.5")
	.to(".pro-f4, .title4,.product-price1", .5, { alpha:0, ease:Quad.easeInOut}, "frame4+=2.5")
	
	
	/*frame four*/ 
	.add("frame5","frame4+=3")
	.to(".dell-logo,.product-price", .5, { alpha:1, ease:Quad.easeInOut}, "frame5")
	.from(".pro-f5", .5, { alpha:0, xPercent:25, ease:Quad.easeInOut}, "frame5")
	.from(".title5", .5, { alpha:0, xPercent:-25, ease:Quad.easeInOut}, "frame5+=.3")
    .from(".dell-logo2,.product-price", .5, { alpha:0, ease:Quad.easeInOut}, "frame5")


	
  // **Legal** //
  .from("#roll-cta", .3, {alpha:0, xPercent:-300, ease:Power4.easeout}, "frame5")
  .from("#rolltext", .3, {alpha:0, ease:Power4.easeout}, "frame5")
  .from("#legal-text", .3, {alpha:0, ease:Power4.easeout}, "frame5")

  legal.addEventListener("mouseover",legalHover);
    function legalHover(){
    tl.pause();
    TweenMax.to("#legal", .3, {top:0, ease:Quad.easeInOut})
  }

  legal.addEventListener("mouseout",legalOut);
    function legalOut(){
    tl.play();
    TweenMax.to("#legal", .3, {top:"-120%", ease:Power0.easInOIn})
  }	
  ;

	// tl.seek("loop")
	var currentDuration = tl.duration();
	var repeatDelay  = tl.repeatDelay();
	console.log(currentDuration + repeatDelay); 

};
