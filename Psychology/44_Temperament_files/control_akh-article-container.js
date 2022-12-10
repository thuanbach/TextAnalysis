/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_1b08edd2346149ffab38808d9fe255ee(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_1b08edd2346149ffab38808d9fe255ee.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH-Article-Container.js';
  ctx['DisplayTemplateData']['TemplateType']='Control';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

ms_outHtml.push('',''
,''
);

if (!$isNull(ctx.ClientControl) &&
    !$isNull(ctx.ClientControl.shouldRenderControl) &&
    !ctx.ClientControl.shouldRenderControl())
{
    return "";
}
ctx.ListDataJSONGroupsKey = "ResultTables";
var $noResults = Srch.ContentBySearch.getControlTemplateEncodedNoResultsMessage(ctx.ClientControl);
var noResultsClassName = "ms-srch-result-noResults";

//IFFY to create item to used in markup
var item = (function (context, containerId) {
    var internalItem = {
        encodedId: null,
        model: {},
        selectors: {},
        events: {
            onPostRender: function (context) {
            	/*fix for pdf*/
				$('.pdf-container').insertAfter('#wb-container');
				$('.pdf-container').css('display', 'block');
				
            	//Survey pop-up				
				(function(){ 

			        //var akhArticleId = window.location.href.split('contentid=').pop().split('&language')[0];
			        var surveyCheck = 'akhArticleSurvey';
				    var contentHeight = 0;
				    var scrollTop = $(window).scrollTop();
				    
				    $('body').append('<div class="side-survey" aria-label="website feedback"><a class="feedback-btn"><i class="material-icons">rate_review</i> <span>Feedback</span></a><div class="popup-text-container"><p><strong>Was this article helpful to you?</strong></p><button id="survey-btn">Take Survey ></button><a id="survey-delay" href="#/">Take survey later</a></div></div>');
				    $('article .panel-body').each(function() {
				       contentHeight += $(this).height()*0.65;
				
				    });
				    var scrollReached = 0;
				    var surveyOpen = 0
				    $(window).scroll(function() {
				        if( $(window).scrollTop() >= contentHeight && scrollReached === 0 && $.cookie(surveyCheck) == null) {
				        	scrollReached = 1;
				        	$('.side-survey').addClass('side-survey-open');
				        	$('.feedback-btn i').html("close");
					    }
					    if( $(window).scrollTop() < 200 && surveyOpen === 0 && scrollReached === 1) {
				        	$('.side-survey').removeClass('side-survey-open');
				        	scrollReached = 0;
				        	$('.feedback-btn i').html("rate_review");
					    }

				    });				
				    
				    $('#survey-delay').click(function() {
				    	$('.pop-survey-container').remove();
				    	$('.side-survey').removeClass('side-survey-open');
				    	$('.feedback-btn i').html("rate_review");
			        	$.cookie( surveyCheck, true, {expires: 14, path: '/' });				    	
				    	//$.removeCookie(surveyCheck);

				    });


				    $('.side-survey .feedback-btn').click(function() {
			        	$.cookie( surveyCheck, true, {expires: 183, path: '/' });
				    	$('.side-survey').toggleClass('side-survey-open');
				    	if ($('.side-survey-open').length > 0) {
				    		$('.feedback-btn i').html("close");
				    		// code for corresonding survey close is in akh.js line 597
				    		if ($('.social-button[aria-label="close"]').length > 0 && $(window).width() <= 1024) {
				    			$('.social-button').trigger('click');
				    		}	
				    	} else {
				    		$('.feedback-btn i').html("rate_review");
				    	}
				    	if ($('.pop-survey-container').length > 0) {
				    		$('.pop-survey-container').remove();
				    		surveyOpen = 0
				    		//$(this).addClass('side-survey-open');

				    	}
				    });
				    $('#survey-btn').on('click', function() {
				    	var refUrl = window.location.href;
		            	if ($('.pop-survey-container').length < 1 && surveyOpen === 0) {
		            	$('<div class="pop-survey-container"><iframe id="survey-popup" src="https://surveys.aboutkidshealth.ca/index.php/179945?lang=en&#38;sourceURL=' + refUrl + '"></iframe><div class="pop-survey-container-close">close</div></div></div>').appendTo('body');
				    	surveyOpen = 1
				    	$('html').css('overflow-y', 'hidden');
				    	$('.side-survey').hide();
				    	$.cookie( surveyCheck, true, {expires: 183, path: '/' });

				    	}
				    	$('.pop-survey-container-close').click(function() {
				    		surveyOpen = 0
				    		$('html').css('overflow-y', 'auto');
				    		$('.pop-survey-container').remove();
				    		$('.side-survey').removeClass('side-survey-open');
				    		$('.side-survey').show();
				    		$('.feedback-btn i').html("rate_review");
				    		
				    	});

				    });
				})();	

                // Open all accordian dropdowns                
	            (function(){
	                /*Landing page breadcrumb cookies*/
	                var prevUrl = document.referrer
	                var landingUrl = $.cookie('akhLandingUrl')
	                var collUrl = $.cookie('collectionUrl')
	                if (landingUrl != null) {
	                    $('<a href="' + $.cookie('akhLandingUrl') + '\"class=\"breadcrumb-item landing-link\"></a>').appendTo('.breadcrumb-nav');
	                    $('.landing-link').html($.cookie('akhLanding'));
	                };
	
	                if (collUrl != null) {
	                    $('<a href="' + $.cookie('collectionUrl') + '\"class=\"breadcrumb-item coll-link\"></a><i class="material-icons"> &#xE5CC; </i>').prependTo('.breadcrumb-nav');
	                    $('.coll-link').html($.cookie('collectionTitle'));
	                };
	                if (prevUrl != landingUrl && prevUrl !=collUrl) {
	                	$('.breadcrumb-nav').remove();
	                }
	            })();
	            //this is a fall back for when SP strips iframe elements from content on authoring side. This inserts the iframe and puts YouTube embed text inside .asset-video into the iframe src 
				$('.asset-video').each(function() {
				    if ($(this).children('iframe').length === 0) {
				        $(this).html('<iframe src=' + $(this).html() + '></iframe>');
				    }
				
				});

	            // Add fullscreen attribute to iframe youtube embed because SharePoint strips allowfullscreen attribute
            	$(".asset-video iframe").attr("allowFullScreen","allowFullScreen");

	            //apply fitvids plugin to div with asset-video class
				$('.asset-video').fitVids();
                
                //Show pdf and readspk function buttons
                (function pageCheck() {
                    $('#pdfer').show();
                    if(window.location.href.indexOf('=English') > -1){
                        $('#readspker').show();
                    } else if(window.location.href.indexOf('=French') > -1){
                        $('#readspker').show();
                    } else if(window.location.href.indexOf('&language') == -1){
                        $('#readspker').show();
                    } else {}
                })();
                //show pdf spinner
                (function pageCheck() {
					$('#akh-pdf-download-button, #akh-pdf-print-button').on('click', function() {
				$('.pdfloader').show();
			});
					
                })();
                

                //Panels
                function openPanel() {
	                $("#open-all-panels").click(function(e) {
	                   var $this = $(this);
	                   //$('.panel-heading-collapsable-icon').trigger('click');
	                   
	                   if($this.find('i').hasClass('mdi-chevron-up')) {
	                        $this.find('i').removeClass('mdi-chevron-up').addClass('mdi-chevron-down');
	                        $("#open-all-panels span").text('Expand All');
	                        $('.panel-heading:not(".panel-collapsed")').trigger('click');	                        
	                    } else {
	                        $this.find('i').removeClass('mdi-chevron-down').addClass('mdi-chevron-up');
	                        $("#open-all-panels span").text('Collapse All');
	                        $('.panel-collapsed').trigger('click');  
	                    }
	                    e.preventDefault();
	                });
                };
                /*Create cookies*/
                var articleUrl = window.location.pathname + window.location.search.split('&hub')[0];
                document.cookie = "previousTitle =" + document.title;
                document.cookie = "akhArticleUrl =" + articleUrl; 

                if($('article .panel .clickable').length <= 1) {
                	$('#open-all-panels').remove();
                } else {
                	openPanel();
                };
                
                $('.panel-heading').on('click', function() {
                    var $this = $(this);
                    var panelVideo = $(this).siblings('.panel-body').children('.asset-video');
                    if(!$this.hasClass('panel-collapsed')) {
                        $this.parents('.panel').find('.panel-body').slideUp();
                        $this.addClass('panel-collapsed');
                        $this.attr('aria-expanded', 'false');
                        $this.find('i').removeClass('mdi-chevron-up').addClass('mdi-chevron-down');
                    } else {
                        $this.parents('.panel').find('.panel-body').slideDown();
                        $this.removeClass('panel-collapsed');
                        $this.attr('aria-expanded', 'true');
                        $this.find('i').removeClass('mdi-chevron-down').addClass('mdi-chevron-up');
                    }
                    $this.blur();
                    //Check if panel has a video embed and then apply fitVids
                    
                    /*
                    if(panelVideo.length > 0) {
                    	panelVideo.fitVids();
                    }
                    */
                });
                $('.panel-heading').keydown(function(e) {
                    var $this = $(this);
                    if(event.which === 13) {
                        if(!$this.hasClass('panel-collapsed')) {
                            $this.parents('.panel').find('.panel-body').slideUp();
                            $this.addClass('panel-collapsed');
                            $this.attr('aria-expanded', 'false');
                            $this.find('i').removeClass('mdi-chevron-up').addClass('mdi-chevron-down');
                        } else {
                            $this.parents('.panel').find('.panel-body').slideDown();
                            $this.removeClass('panel-collapsed');
                            $this.attr('aria-expanded', 'true');
                            $this.find('i').removeClass('mdi-chevron-down').addClass('mdi-chevron-up');
                        }
                    }
                });
                
                $('i.mdi').attr('aria-hidden','true');

                if ($('#open-all-panels').length) {
                $('#panel-container .panel-heading').attr('role','button');
                $('#panel-container .panel-heading').attr('aria-expanded','false');
                $('#panel-container').attr('aria-labelledby','article_title');
                /*$('#panel-container .panel-body').attr('role','region');
                    $('#panel-container .panel-heading').each(function(i) {
                        i=i+1;
                        $(this).attr('id','panel'+i);
                    });
                    $('#panel-container .panel-body').each(function(i) {
                        i=i+1;
                        $(this).attr('aria-labelledby','panel'+i);
                    });
                */
                }

                document.title = context.Title;
            }
            
        },
        init: function () {
            this.initSelectors().initModel().initEvents();
            return {
                model: this.model,
                selectors: this.selectors
            }
        },
        initModel: function () {
            return internalItem;
        },
        initSelectors: function()  {
            //create element ids
            this.encodedId = $htmlEncode(context.ClientControl.get_nextUniqueId() + containerId);
            this.selectors = {
                container: this.encodedId + "container"
            };
            return this;
        },
        initEvents: function () {
            context.OnPostRender = [];
            context.OnPostRender.push(this.events.onPostRender);
            //context.OnPostRender = this.events.onPostRender;
            return this;
        }
    };
    return internalItem.init();
})(ctx, "_akh-article-container_");

ms_outHtml.push(''
,''
,'        <div id="', item.selectors.container ,'">'
,'            ', ctx.RenderGroups(ctx) ,''
,'        </div>'
);
if (ctx.ClientControl.get_shouldShowNoResultMessage())
{
ms_outHtml.push(''
,'        <div class="', noResultsClassName ,'">', $noResults ,'</div>'
);
}
ms_outHtml.push(''
,''
); 
    AddPostRenderCallback(ctx, function () {
		 // Will move entire code onto PostRender
    	 // duplicate images and put them in image gallery 
        (function(){ 
                var newImage = $('article figure:not(.asset-small) img, #brand-photo img');     
                var imageArrayObj = [];
                for(var i = 0; i < newImage.length; i++){
                    imageArrayObj.push({ 
                        src: newImage[i].src, 
                        alt: newImage[i].alt
                    });
                };
                
                for (var x = 0; x < imageArrayObj.length; x++) {
                    var anchorID = '#' + $('img[src$="'+imageArrayObj[x].src +'"]').closest('.panel-body').prop('id');
                    $('<div>' + '<a href='+ anchorID + '>' + '<img src="' + imageArrayObj[x].src + '" alt ="' + imageArrayObj[x].alt + '"/></a></div>').appendTo('.slider-for');
                    $('<div>' + '<img src="' + imageArrayObj[x].src + '" alt="' + imageArrayObj[x].alt + '"/></a></div>').appendTo('.slider-nav');          
                };
		
                $('.slider-for a').click( function() {
                    var target = $(this).attr('href');
                    if ( !$(target).hasClass('in')) {
                        $(target).prev().find('.panel-heading-collapsable-icon').trigger('click');
                    };
                }); 
                // remove gallery if no images are detected within the article 
                if($('article img').length === 0) {
                	$('#gallery-frame').remove();
                }
           })();
           
            $('#image-gallery img').each(function () {
                var image = $(this).attr('src');
                $(this).attr('src', image);
            });

            $('article img:not([src*=".gif"').each(function () {
                var image = $(this).attr('src');
                if ($(this).closest('.asset-c-100').length > 0 || $(this).closest('.asset-c-80').length > 0 || $(this).closest('.asset-center').length > 0) {
                	$(this).attr('src', image + '?RenditionID=19');
                } else {
                	$(this).attr('src', image + '?RenditionID=10');
                }
            }); 

            // Slick slider controls
            
            var pageLang = window.location.href.toLowerCase(); // sanitize and get language url
            	
            // Check the language that uses right to left	

			if(pageLang.indexOf("arabic") > -1 || pageLang.indexOf("urdu") > -1) {
					$('.slider-for').not('.slick-initialized').slick({
					respondTo: 'slider',
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false,
					arrows: false,
					asNavFor: '.slider-nav',
                    accessibility: false,
					rtl: true
				});

					$('.slider-nav').not('.slick-initialized').slick({ 
					slidesToShow: 2,
					slidesToScroll: 1,
					asNavFor: '.slider-for',
					arrows: true,
					centerMode: false,
                    accessibility: false,
					focusOnSelect: true,
					rtl: true
				});
			} else {
	            $('.slider-for').not('.slick-initialized').slick({
	                respondTo: 'slider',
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                dots: false,
	                arrows: false,
	                asNavFor: '.slider-nav', 
                    accessibility: false,
					focusOnChange: false
	            });
	            $('.slider-nav').not('.slick-initialized').slick({ 
	                slidesToShow: 2,
	                slidesToScroll: 1,
	                asNavFor: '.slider-for',
	                arrows: true,
	                centerMode: false,
	                focusOnSelect: true,
                    accessibility: false,
					focusOnChange: false
	            });
			}

            if ($('.slider-for img').length < 2) {
                $('.slider-nav').remove();
            }

            // Article image mouse click zoom
            $('figure IMG').click(function (e) {
                var imgSrc = $(this).closest('figure').clone().addClass('img-focus'); 
                $('<div class="img-overlay"></div>').prependTo('body');
                imgSrc.appendTo('.img-overlay');
                $('.img-focus img').attr('src', function(index, src) {
    				return src.replace('?RenditionID=10', '?RenditionID=19')
    			});	
                e.stopPropagation();
            });

            $(document).click(function(){
                if ( $( ".img-overlay" ).length ) {
                    $('.img-overlay').remove();
                    //$('html').css('overflow-y', 'auto');
                }
            }); 
            // Move language links to language dropdown
			
			function langSwitch() {
				
				var dWidth = $(window).width();
	            function langSwitchMobile() {
		             	$("#lang-switch option:contains('Arabic')").html('AR');
		             	$("#lang-switch option:contains('English')").html('EN');
	                    $("#lang-switch option:contains('French')").html('FR');
						$("#lang-switch option:contains('ChineseSimplified')").html('ZH');
						$("#lang-switch option:contains('ChineseTraditional')").html('CN');
		             	$("#lang-switch option:contains('Portuguese')").html('PT');
		             	$("#lang-switch option:contains('Tamil')").html('TA');
		             	$("#lang-switch option:contains('Urdu')").html('UR');
		             	$("#lang-switch option:contains('Spanish')").html('ES');
		             	$("#lang-switch option:contains('Punjabi')").html('PA');
	            };
	            function langDefault() {
		             	$("#lang-switch option:contains(AR')").html('Arabic');
		             	$("#lang-switch option:contains('EN')").html('English');
	                    $("#lang-switch option:contains('FR')").html('French');
						$("#lang-switch option:contains('ZH')").html('ChineseSimplified');
						$("#lang-switch option:contains('CN')").html('ChineseTraditional');
		             	$("#lang-switch option:contains('PT')").html('Portuguese');
		             	$("#lang-switch option:contains('TA')").html('Tamil');
		             	$("#lang-switch option:contains('UR')").html('Urdu');
		             	$("#lang-switch option:contains('ES')").html('Spanish');
		             	$("#lang-switch option:contains('PA')").html('Punjabi');
	            };
	            
            	if( dWidth <= 520) {
            		langSwitchMobile();	
            	} else if ( dWidth > 520 ) {
            		langDefault();
            	};
		    };   
            $(window).resize(langSwitch);
            		         
		    setTimeout(function(){ 
		    	$('.article-lang').appendTo('#lang-switch');
		    	langSwitch();
			 }, 100);
            // wrap figure IMG with div overlay to add and position zoom icon correctly onto image
   
			(function(){
				$('figure IMG').wrap('<div class="fig-img-zoom"></div>');
				// $('figure .fig-img-zoom').prepend('<span class="zoom-btn">zoom into image</span>');
			})();

            (function(){
	            if ($("figure img").closest(".panel-body[id]").length < 1) {
	                    $("figure img").each(function () {
	                           var figureSrc = $(this).attr('src');
	                           var newId = figureSrc.split('/akhassets/').pop().split('.jpg').shift();
	                           $(this).attr('id', newId);
	                           $('.slider-for img[src="' + figureSrc + '"]').parent('a').attr('href', '#' + newId);
	                    });
	           };
            })();	
 			//Temporary workaround iframe issue for html5 animations and flash animations sharing same class 
	
			/*$(".asset-animation").each(function() {
				if ($(this).children('iframe').length === 0) {
					var iframeSrc = $(this).html();
					$(this).html('<iframe scrolling="no" frameborder="0" class="asset-animation-swf"' + iframeSrc + '></iframe>').css("visibility","visible");
				}
			});*/

			$(".asset-animation-swf").each(function() {
				var lnk = $(this).attr("src");
					if ( lnk != undefined) {
	                	$(this).attr("src", lnk.replace('akhpub', 'www'));
	                }
                });

 			
            // Scroll down to anchor links. This will not work if you're logged into the website because SP uses s4 class divs that wrap around content	
            (function(){
                $('a[href*="#"]:not([href="#"])').click(function() {
                    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                      var target = $(this.hash);
                      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                      target.closest('.panel').find('.panel-collapsed').trigger('click');
                      if (target.length) {
                        $('html, #s4-workspace').animate({
                          scrollTop: target.offset().top - 100
                        }, 300);

                        return false;
                      }
                    }
              });
            })();

            /*Learning Hub cookies used to create sequence buttons*/
            /*setTimeout used due to inconsistencies with the function running on article*/
			setTimeout(function(){ 
	            (function(){ 
	                if (window.location.href.indexOf("hub=") > -1) {
	                    hubGo();
	                }
	            }) ();
			}, 100);

            function hubGo() {
                if (typeof $.cookie('akhThisTitle') !== "undefined") {
                    var thisHub = parseFloat($.cookie('thisHubNum'));
                    var hubLinksNum = parseFloat($.cookie('hubLinksTotal'));
                    function hubButtons(){
                        var prevHubs = $.cookie('akhHubPrev').split('//');
                        var prevHubNum = parseFloat(prevHubs[0]);
                        var nextHubs = $.cookie('akhHubNext').split('//');
                        var nextHubNum = parseFloat(nextHubs[0]);
                       //&utm is a google marketting tag added to URLs
                        var hubUrl = window.location.href.split('&hub=').pop().split('&utm')[0];
                        var justHub = hubUrl.split('#')[0];
                        var justColl = hubUrl.split('#')[1];
                        
                        // do no add next and previous button if article is part of COVID-19 hub
                        var vanityUrl = hubUrl.toLowerCase();
						var covidCheck = vanityUrl.indexOf("covid");
						
                        if (hubUrl != null) {
                            $('<span class="feature-title">EXPLORE THE LEARNING HUB</span>').prependTo('#learning-hub-links');
                        };
                        if (prevHubNum > -1 && covidCheck < 0) {
                            $('<li class="previous"><a href="' + (prevHubs[1]) + '" id="' + (prevHubNum) + '"><div class="pointbox"><i class="mdi mdi-chevron-left"></i> Previous article</div><div class="pager-content">' + (prevHubs[2]) + '</div></a></li>').appendTo('.pager');
                        };
                        if (hubUrl != null) {
                            if (justColl != undefined){
                                if (justColl.length > 0){
									$('<li class="hubhome"><a href="/' + (justColl) + '?topic=' + (justHub) + '"><div class="pointbox">Back to:</div><div class="pager-content"><div class="hubimg"><img alt="" src="' + $.cookie('akhHubImg') + '"/></div><span class="profile-category">Learning Hub</span><h3>' + $.cookie('akhThisTitle') + '</h3></div></a></li>').appendTo('.pager');
                                }
                            } else {
                                $('<li class="hubhome"><a href="/' + (hubUrl) + '"><div class="pointbox">Back to:</div><div class="pager-content"><div class="hubimg"><img alt="" src="' + $.cookie('akhHubImg') + '"/></div><span class="profile-category">Learning Hub</span><h3>' + $.cookie('akhThisTitle') + '</h3></div></a></li>').appendTo('.pager');
                            }
                        };
                        if (nextHubNum < hubLinksNum++ && covidCheck < 0) {
                            $('<li class="next"><a href="' + (nextHubs[1]) + '" id="' + (nextHubNum) + '"><div class="pointbox">Next article <i class="mdi mdi-chevron-right"></i></div><div class="pager-content">' + (nextHubs[2]) + '</div></a></li>').appendTo('.pager');
                        };
                        //remove cookies
                        $.removeCookie('hubLinksTotal');
                        $.removeCookie('akhHubPrev');
                        $.removeCookie('akhHubNext');
                        $.removeCookie('akhThisTitle');
                        $.removeCookie('akhHubImg');
                    }
                    hubButtons();
                    }
                };

                /*Prev and Next Buttons, replace Learning Hub Cookies*/
                //Get the id of the clicked link and bake cookies
                $('.pager li a').mousedown(function(event) {
                    switch (event.which) {
                        case 1:
                            var thisHub = $(this).attr('id');
                            document.cookie = "thisHubNum =" + thisHub
                        case 2:
                            var thisHub = $(this).attr('id');
                            document.cookie = "thisHubNum =" + thisHub
                        case 3:
                            var thisHub = $(this).attr('id');
                            document.cookie = "thisHubNum =" + thisHub
                        default:
                            var thisHub = $(this).attr('id');
                            document.cookie = "thisHubNum =" + thisHub
                    }
                });
                //Get the id for mobile
                $('.pager li a').onTouchListener = function(){
                    var thisHub = $(this).attr('id');
                    document.cookie = "thisHubNum =" + thisHub
                };
                //Get the id for keyboard
                $('.pager li a').keydown(function(event){
                    switch (event.which) {
                        case 13:
                            var thisHub = $(this).attr('id');
                            document.cookie = "thisHubNum =" + thisHub
                        case 32:
                            var thisHub = $(this).attr('id');
                            document.cookie = "thisHubNum =" + thisHub                
                    }
                });

            //show message for swf animations if on mobile
            (function(){ 
                if (jQuery(window).width() < 900){
                    $('.swf-asset-c-80').html('<a href="https://get.adobe.com/flashplayer/"><img src="https://assets.aboutkidshealth.ca/AKHAssets/noflash.svg"/></a>');
                }
            }) ();
	                /*Create cookies*/
	                var articleUrl = window.location.href.split( _spPageContextInfo.webAbsoluteUrl ).pop();
	                document.cookie = "previousTitle =" + document.title;
					$.cookie.raw = true;
					/*
	                var collUrl = $('.coll-link').attr('href');
	                if ($('.landing-link').attr('href') === collUrl) {
	                    $('.landing-link, .breadcrumb-nav span').remove();
	                };*/
	          	
	          	/*Slick Slide Gallery*/     	
	          	//add aria	          	
				$(function() {
				if($('#image-gallery .slick-prev').length) {
					$('#image-gallery').attr('role', 'region');
					$('#image-gallery').attr('aria-roledescription', 'carousel');
					$('#image-gallery').attr('aria-labelledby', 'article_title');
                    $('#image-gallery .slick-slide.slick-current.slick-active a').attr('aria-label','skip to related content');
					$('#image-gallery .slick-prev').next().children('.slick-track').attr('id', 'track-slick');
					$('#image-gallery .slick-prev').attr({'aria-label':'previous slide', 'aria-controls':'track-slick'});
					$('#image-gallery .slick-next').attr({'aria-label':'next slide', 'aria-controls':'track-slick'});									
                    //add slide numbers
                    var slick_div = $('#image-gallery .slick-slide:not(.slick-slide.slick-cloned)');
                    $(slick_div).each(function() {	
                        var num = $(this).attr('data-slick-index');
                        var num_value = parseInt(num) + 1;	
                        var sum	= $(slick_div).length / 2;
                        if(num >= 0 && slick_div.length > 1) {
                        $(this).attr({'role':'group', 'aria-roledescription':'slide'});
                        $(this).attr('aria-label', num_value + ' of ' + sum);  
                        }
                    });   
				}
				});
                $('#image-gallery .slick-slide:not(.slick-current.slick-active) a').each(function() {
                    $(this).attr('tabindex', '-1');  
                    //$(this).parent().attr('tabindex', '-1');  
                });
                $('#image-gallery .slider-nav .slick-arrow').keydown(function() {
                    if($('#image-gallery .slick-slide.slick-current.slick-active').attr('aria-hidden') === "false") {
                        $('#image-gallery .slick-slide.slick-current.slick-active a').removeAttr();  }
                    $('#image-gallery .slick-slide:not(.slick-current.slick-active) a').attr('tabindex','-1');
                });
	          	//remove focus if link undefined
	          	$(function () {
	          	if ($('#image-gallery .slick-slide.slick-current.slick-active a').attr('href') === "#undefined") {  
	          		$('#image-gallery .slick-slide').attr('aria-hidden', 'true'); 
	          		$('#image-gallery .slick-slide').removeAttr('tabindex');
	          		$('#image-gallery .slick-slide a').attr('tabindex', -1).css('pointer-events','none'); 
	          	}
	          	});	        		     
	     
				/*ReadSpeaker*/	

                //provided by RS; dropdown options menu
                window.addEventListener("load", () => { const url = new URL(window.location.href); 
                    const l = url.searchParams.get("language"); let lang = "fr_fr"; if (l == "English") 
                    { lang = "en_us"; } rspkr.Lang.setUiLang(lang, { load: true, updateUi: true }); 
                }) 

                $(document).mouseup(function() {
                    if (window.getSelection().toString() != '') {
                        $('.ms-backgroundImage .rspopup_play').click(function() {
                            $('#wb-container').css('z-index','7');
                            $('#webreader_button .rsbtn_play').css({'background-color':'#373f47','box-shadow':'0 2px 4px 0 rgb(0, 0, 0, 50%)'});
                            $('#webreader_button .rsbtn_text, #webreader_button span').css('color','#FFF');
                    
                            $('#webreader_button .rsbtn_closer').click(function() {
                                $(this).closest('#wb-container').css('z-index','5');
                                $('#webreader_button .rsbtn_play').css({'background-color':'unset','box-shadow':'unset'});
                                $('#webreader_button .rsbtn_text, #webreader_button span').css('color','unset');
                            });
                        });   
                    }
                });
                $('#webreader_button .rsbtn_play').click(function() {
                    if ( $('#webreader_button .rsbtn_tooltoggle').length ) { 
                        $(this).closest('#wb-container').css('z-index','7');
                        $(this).css({'background-color':'#373f47','box-shadow':'0 2px 4px 0 rgb(0, 0, 0, 50%)'});
                        $('#webreader_button .rsbtn_text, #webreader_button span').css('color','#FFF');
                    }                    
                    $('#webreader_button .rsbtn_closer, .ms-backgroundImage .rs-controlpanel-close ').click(function() {
                        $(this).closest('#wb-container').css('z-index','5');
                        $('#webreader_button .rsbtn_play').css({'background-color':'unset','box-shadow':'unset'});
                        $('#webreader_button .rsbtn_play span, #webreader_button .rsbtn_tooltoggle span').css('color','inherit');
                    });
                });              
                ReadSpeaker.init();



        /*End callback function*/    	
		});       
	ms_outHtml.push(''
,'    '
);

  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_1b08edd2346149ffab38808d9fe255ee() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Contol_AKH-Article-Container", DisplayTemplate_1b08edd2346149ffab38808d9fe255ee);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH-Article-Container.js", DisplayTemplate_1b08edd2346149ffab38808d9fe255ee);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH-Article-Container.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
    //
}
RegisterTemplate_1b08edd2346149ffab38808d9fe255ee();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH-Article-Container.js"), RegisterTemplate_1b08edd2346149ffab38808d9fe255ee);
}