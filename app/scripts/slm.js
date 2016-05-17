var slm = {};

slm.tmpltParser = function (template, data) {

    'use strict';

    var HTML = template;

    // Si hay algo que reemplazar
    if (data) {

        $.each(data, function (bracket, value) {

            if (value === undefined || value === null) {

                value = '';

            } else {

                value = value.toString();

            }

            bracket = new RegExp('{{' + bracket + '}}', 'g');
            HTML = HTML.replace(bracket, value.replace(/\$/g, '$$$') || '');

        });

    }

    return HTML;

};
