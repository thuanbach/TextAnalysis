function newsletterStrip(e){if(e.show(),"strip"!=newsletterCheckState(e)){var t=e.find(".title");e.addClass("strip"),e.find(".development-plan").insertBefore(t)}}function newsletterBlock(e){if("block"!=newsletterCheckState(e)){var t=e.find(".title");e.removeClass("strip"),e.find(".development-plan").insertAfter(t)}}function newsletterCollapse(e){e.find("section").hide(),e.find(".title").addClass("collapsed").insertBefore(e.find("section")),null!=document.querySelector(".icon")&&(document.querySelector(".icon").className="icon mt-arrow-down",e.find(".title, .icon").on("click",newsletterToggle))}function newsletterToggle(){var e=$(this).parent();e.find("section").toggle(),helperClassToggle(e.find("span.icon"),"mt-arrow-down","mt-arrow-up"),helperClassToggle(e.find(".title"),"collapsed","expanded")}function newsletterExpand(e){e.find(".title").removeClass("collapsed").insertBefore(e.find("p.summary")),e.find(".title, .icon").unbind("click",newsletterToggle)}function newsletterCheckState(e){return e.hasClass("strip")?"strip":"block"}mindtools.tools.addEvent("resize",function(){Modernizr.mq("screen and (min-width: 39.125em)")&&$("#newsl-block-module").find("section").show()});