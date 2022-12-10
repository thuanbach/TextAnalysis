$(function () {
    var sidebar = $('#fb-sidebar');
    var noSidebar = sidebar.attr('data-hide') || false;
    var sidebarToggle = $('#fb-sidebar-toggle');
    var overlay = $('#fb-overlay');
    var seemoreNav = $("#fb-seemore-nav");
    var navbarUserButton = $("#fb-navbar-user-btn");
    var navbarUserDropdown = $("#fb-navbar-user-dp");
    var arrowIcon = $("#fb-seemore-btn-icon");
    var body = $('body');
    var topBar = $('.fb-topbar');
    // banner
    var specialBannerDesktop = $("#fb-special-banner-desktop");
    var specialBannerMobile = $("#fb-special-banner-mobile");

    // background overlay
    overlay.on('click', function (e) {
        e.stopPropagation()
        overlay.hide();
        sidebar.toggle();
    });

    // sidebar toggle
    sidebarToggle.on('click', function (e) {
        e.stopPropagation()
        overlay.toggle();
        sidebar.toggle();
    });

    // sidebar hover
    $(".fb-sidebar-nav > a").mouseenter(function () {
        var img = $(this).find("> img")
        var srcHighlighted = img.data('highlighted');
        img.attr('src', srcHighlighted);
    });

    // sidebar hover
    $(".fb-sidebar-nav > a").mouseleave(function () {
        var img = $(this).find("> img")
        var src = img.data('src');
        img.attr('src', src);
    });

    // see more
    $("#fb-seemore-btn").click(function (e) {
        var self = $(this).find(".fb-seemore-btn-text");
        var currentText = self.text();
        if (currentText === "See Less") {
            self.text('See More')
            console.log('if', self.text())
        } else {
            self.text('See Less')
        }
        arrowIcon.toggleClass('fb-rotate')
        seemoreNav.slideToggle()
    });

    // user profile dropdown
    navbarUserButton.on('click', function () {
        navbarUserDropdown.toggleClass('d-none');
    });

    // user profile dropdown outside click handler
    $(document).click(function (e) {
        if (!navbarUserButton.is(e.target) &&
            navbarUserButton.has(e.target).length === 0) {
            navbarUserDropdown.addClass('d-none');
        }
    });

    if (window.matchMedia('(min-width: 1024px)').matches && noSidebar === false) {
        sidebar.toggle();
    }

    // check if top banner available for the page and add offsets
    var calcSidebarOffset = function () {
        var bannerHeight = 0;
        if (!specialBannerDesktop.hasClass('d-none')) {
            bannerHeight = specialBannerDesktop.height()
        }

        if (!specialBannerMobile.hasClass('d-none')) {
            bannerHeight = specialBannerMobile.height()
        }

        // add banner height for offset: prevoius pt = 50
        sidebar.css('padding-top', `${bannerHeight + 50}px`)
        body.css('padding-top', `${bannerHeight + 50}px`)
        topBar.css('top', `${bannerHeight}px`)
    }

    calcSidebarOffset();
    $(window).resize(function () {
        calcSidebarOffset();
    });
})