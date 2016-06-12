var app = app || {};

app.ctrl = {

    init: (function () {

        'use strict';

        $(document).on('ready', function () {

            // - definir header top inicial
            app.ctrl.defineHeaderTop();

            // - Listener para redefinir el margin-top del header segun altura del main-nav
            $(window).on('resize', app.ctrl.defineHeaderTop);

            // - Realizar carga de gifs para almacenar en cache
            app.ctrl.preCargarGif();

            if (app.context.isMobile()) {

                app.ctrl.defineHeaderBG(true);

            } else {

                app.ctrl.defineHeaderBG(false);

            }

            // - Initialize owl-carousel
            app.ctrl.setGallery();

            // - set elements image backgrounds
            app.ctrl.setElementImgBg();

        });

    }()),

    settings: (function () {

        'use strict';

        var animationEndEventsNames = {
                WebkitAnimation: 'webkitAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                OAnimation: 'MSAnimationEnd',
                msAnimation: 'oanimationend',
                animation: 'animationend'
            },
            transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd',
                msTransition: 'MSTransitionEnd',
                transition: 'transitionend'
            },
            support = {
                animations: Modernizr.cssanimations,
                transitions: Modernizr.csstransitions
            },
            animationEventName = animationEndEventsNames[Modernizr.prefixed('animation')],
            transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
            productImgSrc;

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

                        return $('#main-nav').height();

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

                        return -($(this.element).outerHeight(true) - 2) + $('#main-nav').height();

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
                    toSectionTop = app.context.isMobile() ? $toSection.offset().top : $toSection.offset().top - $mainNav.height(),
                    directionDown = toSectionTop > lastScrollTop;

                if (Modernizr.mq('(max-width: 39.9375em)')) {

                    $('.js-menu').slideUp();

                }

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
                        opacity: 1,
                        top: 0
                    }, 600);

                    this.destroy();

                }, {
                    offset: '80%'
                });

        }());

        // - hover effect para añadir animacion gif
        $('.js-producto').hover(function () {

            var $this = $(this),
                $img = $('img', $this),
                gifPath = $img.data().gif ? $img.data().gif : false;

            productImgSrc = $img.attr('src');

            if ($this.hasClass('active-info')) {

                return;

            }

            if (gifPath) {

                $img.attr('src', gifPath);

            }

        }, function () {

            var $this = $(this),
                $img = $('img', $this);

            $img.attr('src', productImgSrc);

        });

        // - toggle main-nav
        $('.js-nav-toggle').click(function () {

            var $navMenu = $('.js-menu');

            $navMenu.slideToggle();

        });

        // - toggle product info
        $(document).on('click', '.js-info__toggle', function () {

            var $this = $(this),
                $producto = $this.closest('.js-producto'),
                $img = $('img', $producto);

            if ($producto.hasClass('active-info')) {

                $this.css('background-image', 'url(styles/img/flecha-negra__arriba.png)');
                $producto.removeClass('active-info');
                $producto.trigger('mouseenter');

            } else {

                $img.attr('src', productImgSrc);
                $this.css('background-image', 'url(styles/img/flecha-negra__abajo.png)');
                $producto.addClass('active-info');

            }

        });

        // - toggle cotizador
        $(document).on('click', '#toggleCotizador', function () {

            var $this = $(this),
                $cotizadorContent = $('#cotizadorContent');

            $cotizadorContent.slideToggle(300);

        });

        // - click añadir producto cotizacion
        $(document).on('click', '[btn-add-producto]', function (event) {

            event.preventDefault();

            var $this = $(this),
                $context = $this.closest('.js-producto'),
                $numProducto = $('[num-producto]', $context),
                $nombreProducto = $('[producto-nombre]', $context),
                $productosCotizacion = $('#productosCotizacion'),
                productsArr = [],
                productObj;

            $.each($('.productos-cotizacion__producto'), function (i, producto) {

                var nombre = $(producto).find('[ctzn-product-name]').text();
                productsArr.push(nombre);

            });

            if (productsArr.indexOf($nombreProducto.text()) >= 0) {

                return;

            }

            if ($numProducto.val() && Number($numProducto.val()) > 0) {

                productObj = {
                    nombreProducto: $nombreProducto.text(),
                    numProducto: $numProducto.val()
                };

                $productosCotizacion.append(slm.tmpltParser(app.templates.productCotizacion, productObj));
                $('#productosCotizacion').trigger('addRemoveElement');

            } else {

                $numProducto.addClass('animated shake');
                $numProducto.one(animationEventName, function () {

                    $(this).removeClass('animated shake');
                    $(this).focus();

                });

            }

        });

        // - click remover producto cotizacion
        $(document).on('click', '[ctzn-product-close]', function (event) {

            event.preventDefault();

            var $this = $(this),
                $producto = $this.closest('[ctzn-product]');

            $producto.remove();
            $('#productosCotizacion').trigger('addRemoveElement');

        });

        // - productos cotizacion removed element
        $('#productosCotizacion').on('addRemoveElement', function () {

            var $this = $(this),
                $mensaje = $('#cotizadorMsj'),
                $cotizadorContent = $('#cotizadorContent');

            if ($this.find('[ctzn-product]').length) {

                $mensaje.slideUp(300);

                if ($cotizadorContent.css('display') === 'none') {

                    $cotizadorContent.slideDown(300);

                }

            } else {

                if ($cotizadorContent.css('display') === 'block') {

                    $cotizadorContent.slideUp(300);

                }

                $mensaje.slideDown(300);

            }

        });

        // - send contact form
        $('#sendForm').click(function (event) {

            event.preventDefault();

            var $nombre = $('#nombre'),
                $email = $('#correo'),
                $mensaje = $('#mensaje'),
                $returnMsn = $('#returnMsn'),
                datos;

            $returnMsn.empty().removeClass('contact-form__return-msn--success contact-form__return-msn--error');

            if ($nombre.val() == '') {

                $nombre.addClass('animated shake');
                $nombre.one(animationEventName, function () {

                    $(this).removeClass('animated shake');
                    $(this).focus();

                });

            } else if ($email.val() == '') {

                $email.addClass('animated shake');
                $email.one(animationEventName, function () {

                    $(this).removeClass('animated shake');
                    $(this).focus();

                });

            } else if ($mensaje.val() == '') {

                $mensaje.addClass('animated shake');
                $mensaje.one(animationEventName, function () {

                    $(this).removeClass('animated shake');
                    $(this).focus();

                });

            } else {

                datos = 'nombre=' + $nombre.val() + '&email=' + $email.val() + '&mensaje=' + $mensaje.val();
                $.ajax({
                    type: 'POST',
                    url: './contact-form.php',
                    data: datos,
                    success: function () {

                        $nombre.val('');
                        $email.val('');
                        $mensaje.val('');
                        $returnMsn.text('Mensaje enviado con éxito!').addClass('contact-form__return-msn--success');

                    },
                    error: function () {

                        $returnMsn.text('Error al enviar el mensaje, por favor intenta de nuevo.').addClass('contact-form__return-msn--error');

                    }
                });

            }

        });

        // - solicitar cotizacion
        $('#btnSolicitar').click(function (event) {

            var $this = $(this),
                $nombre = $('#nombreCotizacion'),
                $email = $('#emailCotizacion'),
                $productosContainer = $('#productosCotizacion'),
                $productosCotizacion = $('[ctzn-product]'),
                data = {},
                arr = [];

            if ($productosCotizacion.length) {

                if ($nombre.val() && $email.val()) {

                    $productosCotizacion.each(function (i, p) {

                        var obj = {
                            nombreProducto: $(p).find('[ctzn-product-name]').text(),
                            cantidadProducto: $(p).find('[ctzn-product-num]').text()
                        };

                        arr.push(obj);

                    });

                    data.nombre = $nombre.val();
                    data.email = $email.val();
                    data.items = arr;

                    $.ajax({
                        type: 'POST',
                        url: './solicitar-cotizacion.php',
                        data: {data: JSON.stringify(data)},
                        success: function () {

                            $this.html('SOLICITUD ESXITOSA!').addClass('success');

                            setTimeout(function () {

                                $('#cotizadorContent').slideUp(300, function () {

                                    $productosContainer.empty();
                                    $('[num-producto]').val('');
                                    $nombre.val('');
                                    $email.val('');
                                    $this.html('SOLICITAR').removeClass('success');

                                    $('#productosCotizacion').trigger('addRemoveElement');

                                });

                            }, 3000);

                        },
                        error: function () {

                            $this.html('ERROR EN LA SOLICITUD').addClass('error');

                            setTimeout(function () {

                                $this.html('SOLICITAR').removeClass('error');

                            }, 3000);

                        }
                    });

                }

            }

        });

    }()),

    defineHeaderTop: function () {

        'use strict';

        var $headerVideo = $('#header-video'),
            query = Modernizr.mq('(min-width: 40em)'),
            navHeight = query ? $('#main-nav').outerHeight() : $('.main-nav__top').outerHeight();

        $headerVideo.css('margin-top', navHeight + 'px');

    },

    defineHeaderBG: function (isMobile) {

        'use strict';

        var $headerBG = $('#main-header-bg');

        if (isMobile) {

            $headerBG.append('<div class="header-video__img"></div>');
            $('.header-video__img').css('background-image', 'url(img/fondo-header-main-video.jpg)');

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

    },

    setElementImgBg: function () {

        'use strict';

        var $element = $('[media-bg-img]');

        $.each($element, function (i, e) {

            var $e = $(e),
                path = $e.attr('media-bg-img');

            $e.css('background-image', 'url(' + path + ')');

        });

    },

    preCargarGif: function () {

        'use strict';

        var $imgProducto = $('.js-producto img');

        $.each($imgProducto, function (i, img) {

            var $img = $(img);

            if ($img.data().gif) {

                $('<img src="' + $img.data().gif + '">');

            }

        });

    }

};
