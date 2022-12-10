//Change banners for different display ports and the url in the
(function () {
    var sponsorLink = "https://secure.sickkidsfoundation.com/donate/monthly?appeal=GEA-DIGT-AKB&utm_campaign=fy23ddmvsdigital&utm_medium=display&utm_source=akh.com&utm_adtype=banner";
    var desktopImg = "https://assets.aboutkidshealth.ca/AKHAssets/foundation_banners/0922-042-AKH-Fall-Internal-970x90.jpg";
    var tabletImg = "https://assets.aboutkidshealth.ca/AKHAssets/foundation_banners/0922-042-AKH-Fall-Internal-728x90.jpg";
    var mobileImg = "https://assets.aboutkidshealth.ca/AKHAssets/foundation_banners/0922-042-AKH-Fall-Internal-520x400.jpg";
    
    $('#foundation-donate a').attr("href", sponsorLink);
    $('#foundation-donate source[media="(min-width:991px)"]').attr("srcset", desktopImg);
    $('#foundation-donate source[media="(min-width: 521px)"]').attr("srcset", tabletImg);
    $('#foundation-donate IMG').attr("src", mobileImg);
    $('#foundation-donate source[media="(min-width:991px)"]').attr("data-srcSet", desktopImg);
    $('#foundation-donate source[media="(min-width: 521px)"]').attr("data-srcSet", tabletImg);
    $('#foundation-donate IMG').attr("data-src", mobileImg);
    
})();