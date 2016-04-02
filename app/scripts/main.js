var app = app || {};

app.ctrl = {

    init: (function () {

        'use strict';

        $(document).on('ready', function () {

            // - Listener para redefinir el margin-top del header segun altura del main-nav
            $(window).resize(app.ctrl.defineHeaderTop);
            $(window).ready(app.ctrl.defineHeaderTop);

            if (app.context.isMobile()) {

                app.ctrl.defineHeaderBG(true);

            } else {

                app.ctrl.defineHeaderBG(false);

            }

            // - Initialize owl-carousel
            app.ctrl.setGallery();

        });

    }()),

    settings: (function () {

        'use strict';

        var transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd',
                msTransition: 'MSTransitionEnd',
                transition: 'transitionend'
            },
            support = {
                transitions: Modernizr.csstransitions
            },
            transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

        // SETTINGS MAIN_NAV
        (function () {

            var didScroll,
                lastScrollTop = 0,
                // - Minimum of pixels lapsed after hide or show menu
                delta = 10,
                $mainNav = $('#main-nav'),
                navbarHeight = $mainNav.outerHeight(),
                $sections = $('#page-content > section'),
                $section,
                sectionId,
                $menuItem,
                wpSectionDown = $sections.waypoint(function (direction) {

                    $section = $(this.element);
                    sectionId = $section.attr('id');
                    $menuItem = $('a[href="#' + sectionId + '"]');

                    if (direction === 'down') {

                        $menuItem.trigger('click', [true]);

                    }

                }, {
                    offset: function () {

                        return $('#main-nav').outerHeight();

                    }
                }),
                wpSectionUp = $sections.waypoint(function (direction) {

                    $section = $(this.element);
                    sectionId = $section.attr('id');
                    $menuItem = $('a[href="#' + sectionId + '"]');

                    if (direction === 'up') {

                        $menuItem.trigger('click', [true]);

                    }

                }, {
                    offset: function () {

                        return -$(this.element).outerHeight(true) + $('#main-nav').outerHeight();

                    }
                });

            // on scroll, let the interval function know the user has scrolled
            $(window).scroll(function (event) {

                didScroll = true;

            });

            // run hasScrolled() and reset didScroll status
            setInterval(function () {

                if (didScroll) {

                    hasScrolled();
                    didScroll = false;

                }

            }, 250);

            /**
             * Muestra u oculta la navegacion si se esta haciendo scroll
             */
            function hasScrolled () {

                var st = $(window).scrollTop();

                // Verify minimum of pixels lapsed after hide or show menu
                if (Math.abs(lastScrollTop - st) <= delta) {

                    return;

                }

                if (!app.context.isMobile()) {

                    return;

                }

                // If current position > last position AND scrolled past navbar
                if (st > lastScrollTop && st > navbarHeight) {

                    // - scroll down hide
                    $mainNav.addClass('main-nav--hide');

                } else if (st + $(window).height() < $(document).height()) {

                    // - scroll up show
                    $mainNav.removeClass('main-nav--hide');

                }

                lastScrollTop = st;

            }

            $(document).on('click', '.js-menu-link', function (ev, waypoint) {

                ev.preventDefault();

                var $item = $(ev.target).parent(),
                    $currentItem = $mainNav.find('.menu__item--current'),
                    menuLinkTo = $(this).attr("href"),
                    $toSection = $(menuLinkTo),
                    toSectionTop = app.context.isMobile() ? $toSection.offset().top : $toSection.offset().top - $mainNav.outerHeight(),
                    directionDown = toSectionTop > lastScrollTop;

                if (!waypoint) {

                    if (directionDown) {

                        $(wpSectionDown).each(function (index, wp) {

                            wp.disable();

                        });

                    } else {

                        $(wpSectionUp).each(function (index, wp) {

                            wp.disable();

                        });

                    }

                }

                // - return if already current
                if ($item.hasClass('menu__item--current')) {

                    return false;

                }

                // - remove current
                $currentItem.removeClass('menu__item--current');
                // - set current
                $item.addClass('menu__item--current');

                if (!waypoint) {

                    if (support.transitions) {

                        $currentItem.bind(transEndEventName, function (event) {

                            $(this).unbind(event);
                            $("html, body").animate({
                                scrollTop: toSectionTop
                            }, 500, function () {

                                if (directionDown) {

                                    $(wpSectionDown).each(function (index, wp) {

                                        wp.enable();

                                    });

                                } else {

                                    $(wpSectionUp).each(function (index, wp) {

                                        wp.enable();

                                    });

                                }

                            });

                        });

                    } else {

                        console.log('rapido');
                        $("html, body").scrollTop(toSectionTop);

                    }

                }

            });

        }());

        // SETTINGS PRODUCTO
        (function () {

            var $productos = $('.js-producto'),
                wpProducto = $productos.waypoint(function (direction) {

                    var $item = $(this.element);

                    $item.animate({
                        opacity: 1
                    });

                    this.destroy();

                }, {
                    offset: 'bottom-in-view'
                });

        }());

    }()),

    defineHeaderTop: function () {

        'use strict';

        var $headerVideo = $('#header-video'),
            mainNavHeight = $('#main-nav').outerHeight();

        $headerVideo.css('margin-top', mainNavHeight + 'px');

    },

    defineHeaderBG: function (isMobile) {

        'use strict';

        var $headerBG = $('#main-header-bg');

        if (isMobile) {

            $headerBG.append('<img src="img/fondo-header-main-video.jpg" alt="protectores armadillo">');

        } else {

            $headerBG.append(
                '<video class="header-video__video" autoplay loop muted poster="videos/header-main-video.jpg">' +
                '   <source src="videos/header-main-video.mp4" type="video/mp4">' +
                '   <source src="videos/header-main-video.webm" type="video/webm">' +
                '</video>'
            );

        }

    },

    setGallery: function () {

        'use strict';

        $("#owl-gallery").owlCarousel({
            navigation: false,
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: true,
            autoPlay: true,
            stopOnHover: true,
            navigationText: ['siguiente', 'anterior'],
            lazyLoad: true
        });

    }

};
