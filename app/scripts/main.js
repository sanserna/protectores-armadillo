/**
*  Web Care-Package
*  Copyright 2015 Santiago Serna. Todos los derechos reservados.
*/

$(function() {

    var container = $('#video-container');
    var logo = $('#lr-logo');

    // w = 1592 h = 372

    function repaint() {
        var loquesea = 50;

        var newH = container.height();
        // var logoH = Math.round(container.width() / 2 * 372 / 1592);

        var logoH = Math.round(container.width() / 2 * 378 / 400);

        logo.css("top", (newH - logoH) / 2 + 'px');

    }

    // $('#fullpage').fullpage();

    $(window).resize(repaint);
    $(window).ready(repaint);
    $('video').on('canplay', repaint);
    repaint();

});



















