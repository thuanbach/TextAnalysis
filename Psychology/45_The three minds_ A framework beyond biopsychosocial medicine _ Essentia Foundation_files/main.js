$(document).ready(function() {

  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  };


  // Smooth scroll to anchor
  $(document).on('click', 'a[href^="#"]:not([data-vc-container=".vc_tta"])', function(event) {
    event.preventDefault();

    if ($(this).parent().hasClass('vc_tta-panel-title')) {
      return;
    } else {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 150
      }, 800);
    }

  });

  // Header 2 achtergrond wijzigen na scroll
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 60) {
      $("body").addClass("scrolled");
    } else {
      $("body").removeClass("scrolled");
    }
  }).trigger('scroll');

  // Uitklapmenu mobile
  $(".show_children").click(function() {
    if ($(this).text() == "add") {
      $(this).text("remove")
    } else {
      $(this).text("add");
    }

    $(this).siblings('.sub-menu').slideToggle();
  });

  // Slider - v1
  var reviewsArray = [];
  var clientNameArray = [];

  var selectedReview = $('#slider-1 .testimonialContent > .wpb_wrapper > *');
  var selectedClientName = $('#slider-1 .testimonialAuthor > .wpb_wrapper > *');

  reviewsArray.push($('#slider-1 .testimonialContent > .wpb_wrapper > *').html());
  clientNameArray.push($('#slider-1 .testimonialAuthor > .wpb_wrapper > *').html());

  $('#slider-1-content .testimonialContent > .wpb_wrapper > *').each(function() {
    reviewsArray.push($(this).html());
  });
  $('#slider-1-content .testimonialAuthor > .wpb_wrapper > *').each(function() {
    clientNameArray.push($(this).html());
  });

  var i = 0;
  $('.nextTestimonial').click(function() {
    i++;
    if (i > reviewsArray.length - 1) {
      i = 0;
    }
    selectedReview.hide().html(reviewsArray[i]).fadeIn(0);
    selectedClientName.hide().html(clientNameArray[i]).fadeIn(0);
  });

  $('.prevTestimonial').click(function() {
    i--;
    if (i < 0) {
      i = reviewsArray.length - 1;
    }
    selectedReview.hide().html(reviewsArray[i]).fadeIn(0);
    selectedClientName.hide().html(clientNameArray[i]).fadeIn(0);
  });
  // End Slider - v1

  $(".cat_block").each(function() {
    if ($(this).find("a").length) {
      $(this).addClass("has_link");
    }
  });
  $(".cat_block").click(function() {
    link = $(this).find("a").attr("href");
    window.location.href = link;
  });

  // Bouw topic selector opties op basis van waardes uit de author cards
  if ($(".author_card").length) {
    topicArray = [];
    $(".author_card").each(function() {
      topic = $(this).find(".user_topic").text();
      if (topicArray.includes(topic) == false && topic != "") {
        topicArray.push(topic);
      }
    });

    select_html = "";
    var arrayLength = topicArray.length;
    for (var i = 0; i < arrayLength; i++) {
      // console.log(topicArray[i]);
      val = topicArray[i];
      val_id = val.toLowerCase();
      select_html += '<option value="' + val + '" id="' + val_id + '">' + val + '</option>';
    }
    // console.log(select_html);

    $("#topic_select").append(select_html);
  }


  // Authors sort & filter
  function sortUsingNestedText(parent, childSelector, keySelector) {
    var items = parent.children(childSelector).sort(function(a, b) {
      var vA = $(keySelector, b).text().replace(/\D/g,'');
      vA = parseInt(vA);
      var vB = $(keySelector, a).text().replace(/\D/g,'');
      vB = parseInt(vB);
      return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
  }
  $(".sortBy").click(function() {
    switch ($(this).data("value")) {
      case 'recent':
        sortUsingNestedText($('#authors_cont'), ".author_card_outer", "span.register_date");
        break;
      case 'most':
        sortUsingNestedText($('#authors_cont'), ".author_card_outer", "span.post_count");
        break;
      case 'latest':
        sortUsingNestedText($('#essays .vc_grid .vc_pageable-slide-wrapper'), ".vc_grid-item", ".vc_gitem-post-data-source-post_date");
        break;
      case 'popular':
        sortUsingNestedText($('#essays .vc_grid .vc_pageable-slide-wrapper'), ".vc_grid-item", ".vc_gitem-post-meta-field-wpb_post_views_count");
        break;
      default:
        // code block
    }
    $(this).siblings(".active").removeClass("active");
    $(this).addClass("active");
  });
  $('#topic_select').change(function() {
    value = jQuery(this).val();

    if (value != "") {
      $(".author_card").parent().hide();
      $(".author_card .user_topic:contains(" + value + ")").closest(".author_card").parent().show();
    } else {
      $(".author_card").parent().show();
    }

  });
  $('#category_select').change(function() {
    value = jQuery(this).val();

    if (value != "") {
      $("#essays .vc_grid-item").hide();
      $("#essays .vc_grid-item .vc_gitem-post-category-name:contains(" + value + ")").closest(".vc_grid-item").show();
    } else {
      $("#essays .vc_grid-item").show();
    }

    title = $(".heading-block.essays h2");

    switch(value) {
      case "Listening":
        title.text("Audio");
        break;
      case "Reading":
        title.text("Essays");
        break;
      case "Seeing":
        title.text("Videos");
        break;
      case "Debating":
        title.text("Discussions");
        break;
      case "Learning":
        title.text("Courses");
        break;
      default:
        title.text("All published items");
    }

  });

  // Authors link to author page
  $(".author_card").click(function() {
    userId = $(this).find(".user_id").text();
    link = '/author/?user_id=' + userId + '';
    window.location.href = link;
  });

  $.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementTop > viewportTop && elementTop < viewportBottom;
  };

  // Add active class to inpage menu item based on scroll location
  $(window).on('resize scroll', function() {

    if ($("body.about").length) {

      $(".entry-content > div.vc_row[id]").each(function() {
        id = $(this).attr('id');
        if ($(this).find("> div").isInViewport()) {
          $('#inpage_navbar a[href*="'+id+'"]').parent().addClass("active");
        } else {
          $('#inpage_navbar a[href*="'+id+'"]').parent().removeClass("active");
        }
      });
    }
  });

  if ($("body.about").length) {
    (function(){
        var $w = $(window);
        var wh = $w.height();
        var h = $('.entry-content').height();
        var sHeight = h - wh;
        $w.on('scroll', function(){
            var perc = Math.max(0, Math.min(1, $w.scrollTop()/sHeight));
            updateProgress(perc);
        });

        function updateProgress(perc){
          perc = perc * 0.9;
          totalWidth = $('#inpage_navbar ul').width();
          scrollAmount = totalWidth * perc - 100;
          // console.log("totalWidth is: "+totalWidth);
          // console.log("percentage is: "+perc);
          // console.log("scroll amount is: "+scrollAmount);
          $('#inpage_navbar .cont').animate({ // animate your right div
              scrollLeft: scrollAmount // to the position of the target
          }, 0);
        }

    }());
  }


  essay_cat = getUrlParameter('cat');
  if (essay_cat) {
    scrollTarget = $("#essays").offset().top + 150;
    $('html, body').animate({
      scrollTop: scrollTarget
    }, 1200);

    setTimeout(function() {
      $('#category_select').val(essay_cat).trigger('change');
    }, 1500);
  }

  $(".vc_grid-item .vc_grid-item-mini").click(function() {
    link = $(this).find("a.vc_gitem-link.vc-zone-link").attr("href");
    // console.log(link);
    window.location.href = link;
  });

  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() != 0) {
      $( ".searchbar-link" ).hide();
      // console.log("hide");
    } else {
      $( ".searchbar-link" ).show();
      // console.log("show");
    }
  });

  // direct browser to top right away
  if (window.location.hash)
      scroll(0,0);
  // takes care of some browsers issue
  setTimeout(function(){scroll(0,0);},1);

  $(function(){
  //your current click function
  $('.scroll').on('click',function(e){
      e.preventDefault();
      $('html,body').animate({
          scrollTop:$($(this).attr('href')).offset().top - 150
      },1000,'swing');
  });

  // if we have anchor on the url (calling from other page)
  if(window.location.hash){
      // smooth scroll to the anchor id
      $('html,body').animate({
          scrollTop:$(window.location.hash).offset().top - 150
          },1000,'swing');
      }
  });


});
// END Document Ready
