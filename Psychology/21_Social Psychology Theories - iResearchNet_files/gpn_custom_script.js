jQuery(document).ready(function($) {	
	if($(".gps-nav-next").has("a").length === 0){
	  $(".gps-nav-next").hide();	    	 
	} else if($(".gps-nav-prev").has("a").length === 0){
	  $(".gps-nav-prev").hide();	    	 
	} 
});	