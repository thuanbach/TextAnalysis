/**
 * KEYBOARD NAVIGATION
 * tab key - jums to next menu item
 * tab+shift - jumps back to previous menu item
 * arrow keys - navigates between list items
***/

//define roles & aria for screen readers
$('.menu-item-overlay a').attr('role', 'menuitem');
$('#menu-overlay ul').attr('role', 'menu');
$('#menu-overlay li').attr('role', 'none');
$('.explore-item a').removeAttr('tabindex');
$('#menu-overlay .menu-item-cover').each(function(i) {
    if($(this).next().is('ul')) {
        i=i+1;
        $(this).children('.menu-item-heading').attr('id','cover-heading'+i); 
        $(this).next().attr('aria-labelledby','cover-heading'+i); 
    }
});
//remove extra aria (where is it coming from?)
$(document).on('click', '#explore-btn', function() {
    $('#menu-overlay').removeAttr('aria-expanded');
});

//define horizontal or vertical menu
function lowerNav() {
    var dHeight = $(window).height();
    var dWidth = $(window).width();
    if (dHeight < 768 || dWidth < 1024) { //laptop
    	$('#menu-overlay').attr('aria-orientation', 'vertical');
    	$('.menu-item-cover').attr('tabindex', 0); 
    	$('.menu-item-cover').attr('role', 'menuitem'); 
        $('.menu-item-cover').each(function() {
            if($(this).next('ul').length) {
                $('.menu-item-cover').attr('aria-haspop', 'true'); 
                $('.menu-item-cover').attr('aria-expanded', 'false');
                control_id=$(this).next('ul').attr('id');
                $(this).attr('aria-controls', control_id); }
            else {
                $('.menu-item-cover').removeAttr('aria-haspop aria-expanded');                
            }
        });
    } else {
        $('#menu-overlay').attr('aria-orientation', 'horizontal'); 
    	$('.menu-item-cover').removeAttr('tabindex role aria-haspop aria-expanded aria-controls'); 
    }
}
$(document).ready(function () {
    lowerNav();
});
$(window).resize(lowerNav);

//prevent browser scroll if menu open
$(document).on('keydown', function(e) {
if($('#explore-btn').attr('aria-expanded') === "true") {
	var ar=new Array(38,40,32);
    var key = e.which;
      if($.inArray(key,ar) > -1) {
        e.preventDefault();
      	return false; 
      	}
      return true;
      }
});

//MENU button
$('#explore-btn').keydown(function(event) {
    if($('#menu-overlay').attr('aria-orientation') === "horizontal") {
        if(event.keyCode === 13 || event.keyCode === 32 || event.keyCode === 40) { //enter, space, down
            event.preventDefault();
            $('#explore-btn').click();
            $('#akh-healthaz-index-list li:first-child a').focus();        
        }        
    }
    if($('#menu-overlay').attr('aria-orientation') === "vertical") {
        if(event.keyCode === 13 || event.keyCode === 32 || event.keyCode === 40) { //enter, space, down
            event.preventDefault();
            $('#explore-btn').click();
            $('#akh-healthaz-index-list').prev().focus(); 
        }
    }
    if($('#explore-btn').attr('aria-expanded') === "true") {
        //searchClose();
        $('#akh-search-mobile').attr('tabindex', -1);
        $('#akh-search-box').attr('tabindex', -1);
        $('#akh-logo').attr('tabindex', -1);
        $('#akh-search-btn').attr('tabindex', -1);
    }
    if($('#explore-btn').attr('aria-expanded') === "false") {
        //searchOpen(); 
        $('#akh-logo').removeAttr('tabindex');
        $('#akh-search-box').removeAttr('tabindex');
        $('#akh-search-btn').removeAttr('tabindex');
    } 
});

//MAINmenu links - vertical menu only
$('.explore-item').click(function () { //mouse
    if ($(this).children('.menu-item-cover').attr('aria-expanded') === "false") {
        $(this).children('.menu-item-cover').attr('aria-expanded', 'true'); }
    else if ($(this).children('.menu-item-cover').attr('aria-expanded') === "true") {
        $(this).children('.menu-item-cover').attr('aria-expanded', 'false'); }
});
$('.menu-item-cover').keydown(function(event) {
    if (event.keyCode === 13 || event.keyCode === 32 || event.keyCode === 40) { //enter, space, down
        $(this).parent().click();
        $(this).next('ul').children('li:first').children('a').focus();
    }
    if (event.shiftKey && event.keyCode === 9) {
        if($(this).next().is('#akh-healthaz-index-list')) {
            $('#explore-btn').click();
        }
    }
    if (event.keyCode === 27) {
        $('#explore-btn').click().focus();    
    }
});

//SUBMENU links
$('.explore-item a').focus(function() {
    $(this).closest('.menu-item-overlay').addClass('opacity');
    $(this).parents('ul').prev('.menu-item-cover').attr('aria-expanded','true');
}).blur(function() {
    $(this).closest('.menu-item-overlay').removeClass('opacity'); 
    $(this).parents('ul').prev('.menu-item-cover').attr('aria-expanded','false');   
});
$('.explore-item a').keydown(function(event) { 
    //desktop
    if($('#menu-overlay').attr('aria-orientation') === "horizontal") {         
        if (event.keyCode === 9) { //tab - jump to next item
            if($(event.target).closest('#akh-healthaz-index-list').length) {
                event.preventDefault();
                if(event.shiftKey) { // +shift - jump back to previous item
                    $('#explore-btn').click().focus();
                } else {
                $('#akh-drugaz-index-list li:first-child a').focus(); 
                }
            }
            if($(event.target).closest('#akh-drugaz-index-list').length) {
                event.preventDefault();
                if(event.shiftKey) {
                    $('#akh-healthaz-index-list li:first-child a').focus();                
                } else {
                $('#learning-hubs').focus();
                }
            }
            if($(event.target).closest('#learning-hubs').length) {
                if(event.shiftKey) {
                    event.preventDefault();
                    $('#akh-drugaz-index-list li:first-child a').focus();                
                } 
            }
            if($(event.target).closest('#htbw-index').length) {
                event.preventDefault();
                if(event.shiftKey) {
                    $('#healthy-living').focus();                 
                } else {
                $('#ages-stages-index li:first-child a').focus(); 
                }
            }
            if($(event.target).closest('#ages-stages-index').length) {
                event.preventDefault();
                if(event.shiftKey) {
                    $('#htbw-index li:first-child a').focus();                 
                } else {
                $('#menu-footer .explore-item:first-child a').focus(); 
                }
            }  
            if($(event.target).closest('#menu-footer .explore-item:last-child').length) { //youtube
                event.preventDefault();
                if(event.shiftKey) {
                    $('#menu-footer .explore-item:nth-child(2) a').focus();                
                } else {
                    $('#explore-btn').click();
                    $('#akh-logo').removeAttr('tabindex').focus();
                    $('#akh-search-box').removeAttr('tabindex');
                    $('#akh-search-btn').removeAttr('tabindex');
                }
            }
        }
        if (event.keyCode === 27) { //esc
            $('#explore-btn').click().focus();        
        }
    }        
    //laptop
    if($('#menu-overlay').attr('aria-orientation') === "vertical") { 
        if (event.keyCode === 9) { //tab {
            if($(event.target).closest('#akh-healthaz-index-list').length) {
                event.preventDefault();
                $('#akh-healthaz-index-list').parent().click();
                $('#akh-drugaz-index-list').prev().focus();
            }
            if($(event.target).closest('#akh-drugaz-index-list').length) {
                event.preventDefault();
                $('#akh-drugaz-index-list').parent().click();
                $('#learning-hubs').focus();
            }
            if($(event.target).closest('#htbw-index').length) {
                event.preventDefault();
                $('#htbw-index').parent().click();
                $('#ages-stages-index').prev().focus();
            }
            if($(event.target).closest('#ages-stages-index').length) {
                event.preventDefault();
                $('#ages-stages-index').parent().click();
                $(this).closest('.explore-item').next().children('a').focus();
            }
            if($(event.target).closest('#multicontent-list').length) {
                event.preventDefault();
                $('#multicontent-list').parent().click();
                $('#menu-footer .explore-item:first-child a').focus();
            }
            if($(event.target).closest('#menu-footer .explore-item:last-child').length) { //youtube
                event.preventDefault();
                if(event.shiftKey) {
                    $('#menu-footer .explore-item:nth-child(2) a').focus();                
                } else {
                    $('#explore-btn').click();
                    $('#akh-logo').removeAttr('tabindex').focus();
                    $('#akh-search-box').removeAttr('tabindex');
                    $('#akh-search-btn').removeAttr('tabindex');
                }
            }
        }
        if (event.keyCode === 27) { //esc
            if($(this).parents('ul')) {
                $(this).closest('.explore-item').click();
                $(this).parents('ul').prev('.menu-item-cover').focus(); }    
        }
        if (event.shiftKey && event.keyCode === 9)
            $(this).parents('ul').prev('.menu-item-cover').focus();             
        }
    
});

    //letters A-Z; Health and Drug 
    $('ul.akh-article-index-list a').keydown(function(event) { 
        if(event.keyCode === 37) { //left
            if($(this).parent().is(':first-child')) {
                $(this).parent().siblings('li.view-all').children('a').focus(); }
            $(this).parent().prev().children('a').focus();
        }			
        if(event.keyCode === 39) { //right	 
            if($(this).parent().is(':last-child')) {	   		 			
              $(this).parent().siblings('li:first-child').children('a').focus(); }			 					
            $(this).parent().next().children('a').focus();
        }
    });	
    //lettersA-Z; Health
    var healthletter_to_link = {};
    $('#akh-healthaz-index-list a').each(function(event) {
       var letter = $(this).text().trim(); //get letter
          healthletter_to_link[letter] = $(this);
    });
        healthletter_mapping = {
       'A': 'F',
       'B': 'G',
       'C': 'H',
       'D': 'I',
       'E': 'J',
       'F': 'K',
       'G': 'L',
       'H': 'M',
       'I': 'N',
       'J': 'O',
       'K': 'P',
       'L': 'Q',
       'M': 'R',
       'N': 'S',
       'O': 'T',
       'P': 'U',
       'Q': 'V',
       'R': 'W',
       'S': 'X',
       'T': 'Y',
       'U': 'Z',
       'V': 'View All',
       'W': 'View All',
       'X': 'View All',
       'Y': 'View All',
       'Z': 'A',
       'View All': 'A'
    }
    $('#akh-healthaz-index-list a').on('keydown', function(event) {
       var letter = $(this).text().trim();
       if(event.keyCode === 40) { //down
           var target_letter = healthletter_mapping[letter];
           healthletter_to_link[target_letter].focus(); 
       } else if (event.keyCode === 38) { // up
            for (var key in healthletter_mapping) {
                if (letter == 'View All') {
                    healthletter_to_link['A'].focus();
                    break;
                } else if (healthletter_mapping[key] === letter) {
                    healthletter_to_link[key].focus();
                    break;
                } else if(key == 'B') {
                    $('#akh-healthaz-index-list li.view-all a').focus();
                }
            }
       }
    });
    //lettersA-Z; Drug
    var drugletter_to_link = {};
    $('#akh-drugaz-index-list a').each(function(event) {
       var letter = $(this).text().trim(); //get letter
       drugletter_to_link[letter] = $(this);
    });
    drugletter_mapping = {
       'A': 'F',
       'B': 'G',
       'C': 'H',
       'D': 'I',
       'E': 'J',
       'F': 'K',
       'G': 'L',
       'H': 'M',
       'I': 'N',
       'J': 'O',
       'K': 'P',
       'L': 'Q',
       'M': 'R',
       'N': 'S',
       'O': 'T',
       'P': 'U',
       'Q': 'V',
       'R': 'W',
       'S': 'X',
       'T': 'Y',
       'U': 'Z',
       'V': 'View All',
       'W': 'View All',
       'X': 'View All',
       'Y': 'View All',
       'Z': 'A',
       'View All': 'A'
    }
    $('#akh-drugaz-index-list a').on('keydown', function(event) {
       var letter = $(this).text().trim();
       if(event.keyCode === 40) { //down
           var target_letter = drugletter_mapping[letter]
           drugletter_to_link[target_letter].focus(); 
       } else if (event.keyCode === 38) { // up
            for (var key in healthletter_mapping) {
                if (letter == 'View All') {
                    healthletter_to_link['A'].focus();
                    break;
                } else if (healthletter_mapping[key] === letter) {
                    healthletter_to_link[key].focus();
                    break;
                } else if(key == 'B') {
                    $('#akh-drugaz-index-list li.view-all a').focus();
                }
            }
       }
    });

	//HTBW, Ages&Stages, Multilingual Content submenu links
	$('ul.landing-index a').keydown(function(event) { 
		if(event.keyCode === 40) { //down
            if($('#htbw-index li:last-child a').is(':focus')) {
                $('#htbw-index li:first-child a').focus();               
                } 
            if($('#ages-stages-index li:last-child a').is(':focus')) {
                $('#ages-stages-index li:first-child a').focus();               
                }
            $(this).parent('li').next('li').children('a').focus();
		}	 	
	 	if(event.keyCode === 38) { //up 
            if($('#htbw-index li:first-child a').is(':focus')) {
                $('#htbw-index li:last-child a').focus();               
                } 
            if($('#ages-stages-index li:first-child a').is(':focus')) {
                $('#ages-stages-index li:last-child a').focus();               
                }; 
            $(this).parent('li').prev('li').children('a').focus();	
		}
	   if($('#menu-overlay').attr('aria-orientation') === "vertical") {  	
           if(event.keyCode === 39 || event.keyCode === 37) { //left or right 			
                if($(this).parent().is(':first-child')) {
                $('.landing-index li:nth-child(5) a').focus(); 
                }		
                else if($(this).parent().is(':nth-child(2)')) {
                $('.landing-index li:nth-child(6) a').focus(); 
                }			
                else if($(this).parent().is(':nth-child(3)')) {
                $('.landing-index li:nth-child(7) a').focus(); 
                }		
                else if($(this).parent().is(':nth-child(4)')) {
                $('.landing-index li:last-child a').focus(); 
                }		
                else if($(this).parent().is(':nth-child(5)')) {
                $('.landing-index li:first-child a').focus(); 
                }		
                else if($(this).parent().is(':nth-child(6)')) {
                $('.landing-index li:nth-child(2) a').focus(); 
                }		
                else if($(this).parent().is(':nth-child(7)')) {
                $('.landing-index li:nth-child(3) a').focus(); 
                }
                else if($(this).parent().is(':last-child')) {
                $('.landing-index li:nth-child(4) a').focus(); 
                }	
		} }
	});