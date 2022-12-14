window.mtmetq22018 = 'true';
console.log(mtmetq22018);

    /*!
     * JavaScript Cookie v2.2.0
     * https://github.com/js-cookie/js-cookie
     *
     * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
     * Released under the MIT license
     */
    (function (factory) {
        var registeredInModuleLoader;
        if (typeof define === 'function' && define.amd) {
            define(factory);
            registeredInModuleLoader = true;
        }
        if (typeof exports === 'object') {
            module.exports = factory();
            registeredInModuleLoader = true;
        }
        if (!registeredInModuleLoader) {
            var OldCookies = window.Cookies;
            var api = window.Cookies = factory();
            api.noConflict = function () {
                window.Cookies = OldCookies;
                return api;
            };
        }
    }(function () {
        function extend () {
            var i = 0;
            var result = {};
            for (; i < arguments.length; i++) {
                var attributes = arguments[ i ];
                for (var key in attributes) {
                    result[key] = attributes[key];
                }
            }
            return result;
        }

        function init (converter) {
            function api (key, value, attributes) {
                if (typeof document === 'undefined') {
                    return;
                }

                // Write

                if (arguments.length > 1) {
                    attributes = extend({
                        path: '/'
                    }, api.defaults, attributes);

                    if (typeof attributes.expires === 'number') {
                        attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
                    }

                    // We're using "expires" because "max-age" is not supported by IE
                    attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

                    try {
                        var result = JSON.stringify(value);
                        if (/^[\{\[]/.test(result)) {
                            value = result;
                        }
                    } catch (e) {}

                    value = converter.write ?
                        converter.write(value, key) :
                        encodeURIComponent(String(value))
                            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

                    key = encodeURIComponent(String(key))
                        .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                        .replace(/[\(\)]/g, escape);

                    var stringifiedAttributes = '';
                    for (var attributeName in attributes) {
                        if (!attributes[attributeName]) {
                            continue;
                        }
                        stringifiedAttributes += '; ' + attributeName;
                        if (attributes[attributeName] === true) {
                            continue;
                        }

                        // Considers RFC 6265 section 5.2:
                        // ...
                        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                        //     character:
                        // Consume the characters of the unparsed-attributes up to,
                        // not including, the first %x3B (";") character.
                        // ...
                        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
                    }

                    return (document.cookie = key + '=' + value + stringifiedAttributes);
                }

                // Read

                var jar = {};
                var decode = function (s) {
                    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
                };
                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all.
                var cookies = document.cookie ? document.cookie.split('; ') : [];
                var i = 0;

                for (; i < cookies.length; i++) {
                    var parts = cookies[i].split('=');
                    var cookie = parts.slice(1).join('=');

                    if (!this.json && cookie.charAt(0) === '"') {
                        cookie = cookie.slice(1, -1);
                    }

                    try {
                        var name = decode(parts[0]);
                        cookie = (converter.read || converter)(cookie, name) ||
                            decode(cookie);

                        if (this.json) {
                            try {
                                cookie = JSON.parse(cookie);
                            } catch (e) {}
                        }

                        jar[name] = cookie;

                        if (key === name) {
                            break;
                        }
                    } catch (e) {}
                }

                return key ? jar[key] : jar;
            }

            api.set = api;
            api.get = function (key) {
                return api.call(api, key);
            };
            api.getJSON = function () {
                return api.apply({
                    json: true
                }, arguments);
            };
            api.remove = function (key, attributes) {
                api(key, '', extend(attributes, {
                    expires: -1
                }));
            };

            api.defaults = {};

            api.withConverter = init;

            return api;
        }

        return init(function () {});
    }));


// Main page count cookie

var countCookie = Cookies.getJSON('count_cookie');
var pagesViewed = 0;
var countCookieExpiry = null;

if (typeof countCookie !== 'undefined') {
    if (typeof countCookie.count !== 'undefined') {
        pagesViewed = countCookie.count;
        countCookieExpiry = new Date(countCookie.expiry);
    } else {
        pagesViewed = countCookie;
    }
}
    function getSalesPageLink(trackingTag) {
        var salesLink = "/signup/monthly/";
        if (mindtools.dynamic.metering.salesLink && mindtools.dynamic.metering.salesLink.length > 0)
        {
            salesLink = mindtools.dynamic.metering.salesLink;
        }

        if (trackingTag && trackingTag.length > 0) {
            if (salesLink.indexOf('?') > 0) {
                salesLink += "&trackingtag=" + trackingTag;
            }
            else {
                salesLink += "?trackingtag=" + trackingTag;
            }
        }
        return salesLink;
    }

    //// Proposition Modal

    // Show proposition modal

    function showPropositionModal() {
        if (!canShowPopups()) {
            return;
        }
        if (deviceToken == "smartphone") {
            showStickyBar();
            return;
        }

        var title = mindtools.dynamic.metering.popupTitle;
        var copy = mindtools.dynamic.metering.popupCopy;
        if (pageAllowance)
        {
            copy = copy.replace('%pageAllowance%', pageAllowance);
        }
        if (singlePrice)
        {
            copy = copy.replace('%singlePrice%', singlePrice);
        }
        var image = mindtools.dynamic.metering.popupImage;

        var propositionModalMarkUp = '<div class="mtx-modal mtx-modal--dismissable is-active" id="propositionModal" data-test="metering_proposition_modal">'+
            '  <div class="mtx-modal__inner">'+
            '    <div class="mtx-modal__header">'+
            '      <h2 class="mtx-modal__heading mtx-heading mtx-heading--3">This is 1 of your ' + pageAllowance + ' free articles </h2>'+
            '      <button class="mtx-modal__close mtx-icon-btn">'+
            '                <svg style="width:30px;height:30px" viewBox="0 0 24 24">'+
            '                    <path fill="#fff" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>'+
            '                </svg>'+
            '            </button>'+
            '    </div>'+
            '    <div class="mtx-modal__body mtx-modal__body--blue ">'+
            '      <h3 class="mtx-modal__lead mtx-heading mtx-heading--1">' + title + '</h3>'+
            '      <div class="row">'+
            '        <div class="col-md-6">'+
                        copy +
            '          <div class="mtx-modal__ctas">'+
            '               <a href="' + getSalesPageLink("met1") + '&utm_content=metering" data-test="metering_proposition_modal_signup" class="mtx-btn mtx-btn--primary mtx-btn--block">Plans &amp; Pricing</a>'+
            '            </div>'+
            ''+
            '        </div>'+
            '        <div class="col-md-6">'+
            '          <img src="'+image+'" data-src="'+image+'" alt="Skill-building Articles Developed by Industry Experts" class="mtx-img">'+
            '        </div>'+
            '      </div>'+
            ''+
            '      <img src="/assets/images/sales/newSales/mindtools_small_blue_logo.png" data-src="/assets/images/sales/newSales/mindtools_small_blue_logo.png" class="mtx-sign-up__logo">'+
            '      '+
            '      <a href="/amember/loginmember.php?amember_redirect_url=' + pageUrl + '" class="mtx-modal__login">Already a member? Login now</a>'+
            ''+
            '    </div>'+
            '  </div>'+
            '</div>';

        $('body').append(propositionModalMarkUp);
        $('html').addClass('mtx-modal-open');

        console.log('After 10 seconds display proposition modal');
    }

// Hide proposition modal
    $('body').on('click', '#propositionModal .mtx-modal__close, #propositionModal .mtx-btn--secondary', function () {
        $("#propositionModal").removeClass('is-active');
        $('html').removeClass('mtx-modal-open');
        // Show sticky bar
        showStickyBar();
        console.log('Show sticky bar once proposition modal is closed');
    });

////  Sticky count bar

// Show sticky count bar

    function showStickyBar() {
        // Add sticky bar mark-up

        var stickyBar = '<div class="mtx-sticky-cta">'+
            '        <div class="mtx-container">'+
            '            <h2 class="mtx-heading mtx-heading--4">You are viewing ' + pagesViewed + ' of ' + pageAllowance + ' free articles</h2>'+
            '          <p>Get ahead faster in your career with unlimited access</p>'+
            '            <a href="' + getSalesPageLink("metf") + '&utm_content=metering" class="mtx-btn mtx-btn--primary" data-test="metering_bar_signup_link" >Try our Club for just  ' + singlePrice + '</a>'+
            '          <a href="/amember/loginmember.php?amember_redirect_url=' + pageUrl + '">Login to Mind Tools</a>'+
            '        </div>'+
            '    </div>';

        $('body').append(stickyBar);

        // Reveal sticky bar

        window.setTimeout(function(){
            $('.mtx-sticky-cta').addClass('is-fixed');
        }, 1000);

    }

//// Final Article Modal

// Show final article modal

    function showFinalArticleModal() {
        if (!canShowPopups()) {
            return;
        }
        var title = mindtools.dynamic.metering.finalPopupTitle;
        var copy = mindtools.dynamic.metering.finalPopupCopy;
        if (pageAllowance)
        {
            copy = copy.replace('%pageAllowance%', pageAllowance);
        }
        if (singlePrice)
        {
            copy = copy.replace('%singlePrice%', singlePrice);
        }
        var image = mindtools.dynamic.metering.finalPopupImage;

        var finalArticleModalMarkup = '<div class="mtx-modal mtx-modal--dismissable is-active" id="finalArticleModal">'+
            '  <div class="mtx-modal__inner">'+
            '    <div class="mtx-modal__header">'+
            '      <h2 class="mtx-modal__heading mtx-heading mtx-heading--3">We hope you\'ve enjoyed your '+
            pageAllowance +
            ' free articles</h2>' +
            '      <button class="mtx-modal__close mtx-icon-btn">'+
            '                <svg style="width:30px;height:30px" viewBox="0 0 24 24">'+
            '                    <path fill="#fff" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>'+
            '                </svg>'+
            '            </button>'+
            '    </div>'+
            '    <div class="mtx-modal__body mtx-modal__body--blue">'+
            '      <h3 class="mtx-modal__lead mtx-heading mtx-heading--1">'+title+'</h3>'+
            '      <div class="row">'+
            '        <div class="col-md-6">'+
                        copy +
            '               <a href="' + getSalesPageLink("met2") + '&utm_content=metering" class="mtx-btn mtx-btn--primary mtx-btn--block" data-test="metering_final_modal_signup" >Plans &amp; Pricing</a>'+
            ''+
            '        </div>'+
            '        <div class="col-md-6">'+
            '          <img src="'+image+'" data-src="'+image+'" alt="Skill-building Articles Developed by Industry Experts" class="mtx-img">'+
            '        </div>'+
            '      </div>'+
            ''+
            '      <img src="/assets/images/sales/newSales/mindtools_small_blue_logo.png" data-src="/assets/images/sales/newSales/mindtools_small_blue_logo.png" class="mtx-sign-up__logo">'+
            '      '+
            '      <a href="/amember/loginmember.php?amember_redirect_url=' + pageUrl + '" class="mtx-modal__login">Already a member? Login now</a>'+
            ''+
            '    </div>'+
            '  </div>'+
            '</div>';

        $('body').append(finalArticleModalMarkup);
        $('html').addClass('mtx-modal-open');
        // window['optimizely'].push({
        //     type: "event",
        //     eventName: "limitReached"
        // });

        console.log('After 30 seconds display final article modal');
    }

// Hide first article modal
    $('body').on('click', '#finalArticleModal .mtx-modal__close, #finalArticleModal .mtx-btn--secondary', function () {
        $("#finalArticleModal").removeClass('is-active');
        $('html').removeClass('mtx-modal-open');
        // Show sticky bar
        showStickyBar();
    });


//// Stub article AKA HARD PAY WALL

    function stubArticle() {

        var nlSignUpBox = document.querySelectorAll('[data-test="newsletter-res-right"]');

        // check if the article is orginally stubbed or not
        var orginallyStubbed = $('.article').hasClass('stubbed');
        var startMarker = $('#start-article-hook');
        var endMarker = $('#end-article-hook');

        if (orginallyStubbed && startMarker.length === 0) {
            //hard stubbing is on
            return true;
        }

        if (startMarker.length) {

            // Article was orginally stubbed
            console.log('Article was orginally stubbed');

            // Remove content between hooks

            var startParent = startMarker.parent().hasClass('resource_content__body') ? startMarker : startMarker.parent();
            var endParent = endMarker.parent().hasClass('resource_content__body') ? endMarker : endMarker.parent();

            startParent.nextUntil(endParent).remove();

            if (! startMarker.parent().hasClass('resource_content__body')) {
                startMarker.nextAll().remove();
            }

            if (! endMarker.parent().hasClass('resource_content__body')) {
                endMarker.prevAll().remove();
            }


        } else {
            // Article was orginally unstubbed
            console.log('Article was orginally unstubbed');

            // Remove everything except first 3 paragraph's
            //$('.resource_content__body *').not('p:nth-child(1), p:nth-child(2), p:nth-child(3)').remove();

        }

        var stubbMessage = '<div class="stub_wrapper">'+
            '    <!--<div class="stub_triangle">'+
            '    </div>-->'+
            '    <div class="stub">'+
            '        <section>'+
            '        	<h2>Access the Full Article</h2>'+
            ''+
            '        	<p>This article is only available in full within the Mind Tools Club.</p>'+
            ''+
            '                    <a href="' + getSalesPageLink("stub") + '&utm_content=metering_stub&url=' + relativeUrl + '" class="stub_join">Learn More and Join Today</a>'+
            '        '+
            ''+
            ''+
            '        	<p>Already a Club member? <a href="/amember/loginmember.php?amember_redirect_url=' + pageUrl + '">Log in</a> to finish this article.</p>'+
            '        </section>'+
            '    </div>'+
            '</div>';


        // Add stubbed message
        // utils.waitForElement('.resource_content__body').then(function(){
            $('.resource_content__body').append(stubbMessage);

            // utils.waitForElement('.article').then(function(){
                $('.article').removeClass('unstubbed');
                $('.article').addClass('stubbed');
            // });
        // });

        // Remove other unwanted elements on stubbed pages

        // Learning plan button, Article rating, Star rating , responsive add, cta links, Social links ,comments, upsale block
        $('.article-plp-button, .articleRating, .star-ratings-container, .responsive-ad-container, .cta-links, .socialbottom, .commenting, .upsale-block').remove();

        // replace newsletter class, as otherwise we get a nl box on the left and one directly next to it on medium screen sizes
        nlSignUpBox.removeClass('display-on-load');
        nlSignUpBox.addClass('stubbed-nl-signup-option');

        console.log('Article is now stubbed');
    }

    //// Show HARD PAY WALL

    function showPaywall() {
        if (!canShowPopups()) {
            return;
        }

        var title = mindtools.dynamic.metering.paywallTitle;
        var copy = mindtools.dynamic.metering.paywallCopy;
        if (pageAllowance)
        {
            copy = copy.replace('%pageAllowance%', pageAllowance);
        }
        if (singlePrice)
        {
            copy = copy.replace('%singlePrice%', singlePrice);
        }

        var paywallMarkup="";
        paywallMarkup += "<div style=\"visibility:hidden\" class=\"mtx-modal mtx-modal--paywall mtx-modal--dismissable is-active\" id=\"hardPaywall\" data-test=\"metering_hard_paywall\" >";
        paywallMarkup += "  <div class=\"mtx-modal__inner\">";
        paywallMarkup += "    <div class=\"mtx-modal__header\">";
        paywallMarkup += "   ";
        paywallMarkup += "      <h2 class=\"mtx-modal__heading mtx-heading mtx-heading--3\">We hope you???ve enjoyed your ";
        paywallMarkup += pageAllowance;
        paywallMarkup += "      free articles<\/h2>";
        paywallMarkup += " ";
        paywallMarkup += "      <button class=\"mtx-modal__close mtx-icon-btn\" data-test=\"metering_hard_paywall_close\">";
        paywallMarkup += "                <svg style=\"width:30px;height:30px\" viewBox=\"0 0 24 24\">";
        paywallMarkup += "                    <path fill=\"#fff\" d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\"><\/path>";
        paywallMarkup += "                <\/svg>";
        paywallMarkup += "            <\/button>";
        paywallMarkup += "      ";
        paywallMarkup += "    <\/div>";
        paywallMarkup += "    <div class=\"mtx-modal__body mtx-modal__body--blue \">";
        paywallMarkup += "     ";
        paywallMarkup += "      <div class=\"row\">";
        paywallMarkup += "        <div class=\"col-xl-4\">";
        paywallMarkup += "          <h3 class=\"mtx-heading mtx-heading--2\">" + title + "<\/h3>";
        paywallMarkup +=            copy;
        paywallMarkup += "          <p class=\"mtx-heading mtx-heading--4\">Go on, invest in yourself.<\/p>";
        paywallMarkup += "";
        paywallMarkup += "        <\/div>";
        paywallMarkup += "        <div class=\"col-xl-8\">";
        paywallMarkup += "          <div class=\"mtx-price-tables\">";
        paywallMarkup += "            <div class=\"row\">";
        paywallMarkup += "              <div class=\"col-md-6\">";
        paywallMarkup += "                <div class=\"mtx-price-table mtx-price-table__box-shadow\">";
        paywallMarkup += "                  <h3 class=\"mtx-price-table__heading mtx-heading mtx-heading--3 primary\" data-modal=\"signUpModal\" data-membership=\"premium\">Annual Membership<\/h3>";
        paywallMarkup += "                  <div class=\"mtx-price-table__body\">";
        paywallMarkup += "                    <p class=\"mtx-price-table__sub-heading  mtx-heading mtx-heading--4 js-price-structure-premium\">";
        paywallMarkup += "                      Get 2 months FREE!<\/br>";
        paywallMarkup += "                    <span class=\"mtx-price-table__sub-heading  mtx-heading mtx-heading--2 js-price-structure-premium primary-text price-line\">";
        paywallMarkup += premiumAnnualPrice;
        paywallMarkup += " a year<\/span><\/p>";
        paywallMarkup += "                    <ul class=\"mtx-price-table__feature-list mtx-feature-list blue-text\">";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item \">Full Toolkit (1,300+ Tools)<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Coaching Clinic Forum<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Career Caf?? Forum<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Bite-Sized Training<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Expert Interviews<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Book Insights<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Learning Streams<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Certified Time Manager Course<\/li>";
        paywallMarkup += "                    <\/ul>";
        paywallMarkup += "                    <a href=\"" + getSalesPageLink("annual") + "&utm_content=metering\" class=\"mtx-price-table__action mtx-btn--left mtx-btn--primary mtx-btn--block \" data-test=\"metering_paywall_premium_signup\">Find out more<\/a>";
        paywallMarkup += "                  <\/div>";
        paywallMarkup += "                <\/div>";
        paywallMarkup += "              <\/div>";
        paywallMarkup += "              <div class=\"col-md-6\">";
        paywallMarkup += "                <div class=\"mtx-price-table mtx-price-table__box-shadow\">";
        paywallMarkup += "                  <h3 class=\"mtx-price-table__heading mtx-heading mtx-heading--3 secondary-blue-bg\" data-modal=\"signUpModal\" data-membership=\"standard\"> Monthly Membership<\/h3>";
        paywallMarkup += "                  <div class=\"mtx-price-table__body\">";
        paywallMarkup += "                    <p class=\"mtx-price-table__sub-heading mtx-heading mtx-heading--4 js-price-structure-standard\">";
        paywallMarkup += "                      1st month only " + singlePrice + " then<\/br>";
        paywallMarkup += "                    <span class=\"mtx-price-table__sub-heading  mtx-heading mtx-heading--2 js-price-structure-premium secondary-blue price-line\">";
        paywallMarkup +=                       premiumMonthlyPrice + " per month<\/span><\/p>";
        paywallMarkup += "                    <ul class=\"mtx-price-table__feature-list mtx-feature-list blue-text\">";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item \">Full Toolkit (1,300+ Tools)<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Coaching Clinic Forum<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Career Caf?? Forum<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Bite-Sized Training<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Expert Interviews<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Book Insights<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Learning Streams<\/li>";
        paywallMarkup += "                      <li class=\"mtx-feature-list__item\">Certified Time Manager Course<\/li>";
        paywallMarkup += "                    <\/ul>";
        paywallMarkup += "                    <a href=\"" + getSalesPageLink("monthly") + "&utm_content=metering\" class=\"mtx-price-table__action mtx-btn--left mtx-btn--block secondary-blue-bg align-left\">Find out more<\/a>";
        paywallMarkup += "                  <\/div>";
        paywallMarkup += "";
        paywallMarkup += "                <\/div>";
        paywallMarkup += "              <\/div>";
        paywallMarkup += "";
        paywallMarkup += "            <\/div>";
        paywallMarkup += "          <\/div>";
        paywallMarkup += "        ";
        paywallMarkup += "      <\/div>";
        paywallMarkup += "      <a href=\"\/amember\/loginmember.php?amember_redirect_url=";
        paywallMarkup +=  pageUrl;
        paywallMarkup += "\" class=\"mtx-modal__login mtx-sign-up__logo\">Already a member? Login now<\/a>";
        paywallMarkup += "";
        paywallMarkup += "      ";
        paywallMarkup += "    <\/div>";
        paywallMarkup += "      <\/div>";
        paywallMarkup += "  <\/div>";
        paywallMarkup += "<\/div>";

        // Add stubbed message
        $('body').append(paywallMarkup);
        $('html').addClass('mtx-modal-open');
        $('body').addClass('article-limit-reached');

        //slow render causes flash of unstyled in safari so display after 1 second
        setTimeout(function(){
            document.getElementById('hardPaywall').style.visibility = "initial";
        }, 1000);

        // window['optimizely'].push({
        //     type: "event",
        //     eventName: "paywallMeter"
        // });

        // Data toggle tool tips

        $( ".mtx-feature-list__item button" ).each(function() {
            var tooltipText = $(this).data('original-title');
            var tooltip = '<div class="tooltip">' + tooltipText + ' <button class="tooltip__close mtx-icon-btn"><svg style="width:15px;height:15px" viewBox="0 0 18 18"><path fill="#fff" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg></button></div>';
            $(tooltip).insertAfter(this);
        });

        $('body').on('click', '.mtx-feature-list__item button', function (e) {
            var element = e.target;
            console.log(element);
            e.preventDefault();
            $('.mtx-feature-list__item').removeClass('active');
            $(this).parent('.mtx-feature-list__item').addClass('active');
        });

        $('body').on('click', '.tooltip__close', function () {
            $('.mtx-feature-list__item').removeClass('active');
        });

    }


// Hide paywall
    $('body').on('click', '#hardPaywall .mtx-modal__close, #hardPaywall .mtx-btn--secondary', function () {
        $("#hardPaywall").removeClass('is-active');
        $('html').removeClass('mtx-modal-open');
    });


// Smart metering logic


// Current URL
    pageUrl = window.location.href;
    var relativeUrl = window.location.href.split('.com')[1];

// Pages visited
    var firstPageVisited = Cookies.get('first_page_visited');
    var secondPageVisited = Cookies.get('second_page_visited');
    var thirdPageVisited = Cookies.get('third_page_visited');

// Page allowance
    pageAllowance = '2';

//  Set prices
    var ctaLinkText = $('.js-nav-signup-button').text();
    if (mindtools.dynamic.pricing) {
        singlePrice = mindtools.dynamic.pricing.offerPrice;
        standardMonthlyPrice = mindtools.dynamic.pricing.monthlyStandard;
        premiumMonthlyPrice = mindtools.dynamic.pricing.monthlyPremium;
        premiumAnnualPrice = mindtools.dynamic.pricing.annualPremium;
    }
    else if (ctaLinkText.indexOf('??1') > -1) {
        singlePrice = '??1';
        standardMonthlyPrice = '??12.00';
        premiumMonthlyPrice = '??17.00';
        premiumAnnualPrice = '??170.00';
    } else {
        singlePrice = '$1';
        standardMonthlyPrice = '$19.00';
        premiumMonthlyPrice = '$27.00';
        premiumAnnualPrice = '$270.00';
    }
//  finally do metering logic
    smartMeterLogic();


    function smartMeterLogic() {

        // Check if article was orginally stubbed
        var orginallyStubbed = $('.article').hasClass('stubbed');

        if (orginallyStubbed) {
            console.log('Article is originally stubbed, lets stubb it!');
            stubArticle();
        } else {

            // Check if count cookie exists

            if (pagesViewed) {

                // User has the count cookie
                console.log('The count cookie exists');

                // Check if user has visited page before?
                if ((firstPageVisited == pageUrl) || (secondPageVisited == pageUrl) || (thirdPageVisited == pageUrl)) {
                    // User has seen this page before just show the sticky bar
                    console.log('User has visited before so just showing sticky bar');
                    showStickyBar();
                } else {

                    // check how many pages viewed
                    if (pagesViewed == 1) {

                        // User has viewed one page before
                        console.log('The user has viewed ' + pagesViewed + ' pages before');

                        // Set the count cookie to 2 articles viewed
                        updateCountCookie('2', countCookieExpiry);
                        console.log('The count cookie has been set to 2');

                        // Set the current url in page cookie
                        Cookies.set('second_page_visited', pageUrl, { expires: 30});

                        // Show final article modal after 30 seconds
                        setTimeout(showFinalArticleModal, 30000);

                        // Show sticky bar
                        showStickyBar();

                    } else if (pagesViewed == 2) {

                        // User has viewed 2 pages already
                        console.log('The user has viewed ' + pagesViewed + ' pages before');

                        // Stub the article
                        stubArticle();
                        showFinalArticleModal();
                        // showPaywall();

                    }
                }

            } else {

                // User does not have the count cookie
                console.log('The count cookie does not exists');

                // Set the current url in page cookie
                Cookies.set('first_page_visited', pageUrl, { expires: 30});

                // Set the count cookie to 1 article viewed
                updateCountCookie('1');
                console.log('The count cookie is set to 1');

                // Show proposition modal after 10 seconds
                setTimeout(showPropositionModal, 10000);
                //setTimeout(showPropositionModal, 2000); // temp 2 secs

            }

        }
    };

    //update the cookie to the current page count
    function updateCountCookie(count, expiry) {
        //Set a date in future as part of the value
        if (! expiry || typeof countCookieExpiry !== 'object') {
            expiry = new Date(new Date() * 1 + 30 * 864e+5);
        }

        Cookies.set('count_cookie', {count: count, expiry: expiry}, { expires: expiry, path: '/'  });

        //update the count
        pagesViewed = count;
    }

    function canShowPopups() {
        return !document.body.classList.contains('js-no-popups');
    }

// Dismiss modals clicking on BG

    $(document).on('click', '.mtx-modal--dismissable', function (e) {
        console.log('event =' + e);
        console.log('this =' + this);

        if( e.target != this ) {

        } else {
            $('.mtx-modal').removeClass('is-active');
            $('html').removeClass('mtx-modal-open');

            // Check if sticky bar exists
            var stickBar = $('.mtx-sticky-cta');

            if (stickBar.length ) {
            } else {
                // Show sticky bar
                showStickyBar();
            }
        }
    });
// }


/// Hide pop-ups

    $('html').addClass('mtx-hide-pop-up');
    $('html').css( "overflow", "auto" );
    $('html').css( "margin-right", "0" );
    $('.mfp-bg').remove();
    $('.mfp-wrap').remove();
    $('html').removeClass('mtx-hide-pop-up');