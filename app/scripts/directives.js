var app = app || {};

app.directives = {};

app.directives.filterKeys = (function () {

    /* RegEx Examples:
        - email: "0-9a-zA-ZÃ‘Ã±@._\-"
        - numbers only: "0-9"
        - letters only: "a-zA-Z"

        Usage Example:
        <input type="text" name="email" filter-keys="0-9a-zA-Z@._\-" />
    */
    'use strict';
    $(document).on('keyup change', '[filter-keys]', function (event) {

        var $elem = $(this),
            value = $(this).val(),
            valLength = value.length,
            preset = {
                'alpha': 'A-Za-zÃ‘Ã±\\s',
                'numeric': '0-9',
                'common': 'A-Za-z0-9!@#&()?*,.\\-\\s',
                'common-latin': 'A-Za-z0-9Ã‘Ã±Ã¡Ã©Ã­Ã³ÃºÃ¼ÃÃ‰ÃÃ“ÃšÃœÂ¡!@#&()Â¿?*,.\\-\\s',
                'latin-alphanumeric': 'A-Za-z0-9Ã‘Ã±Ã¡Ã©Ã­Ã³ÃºÃ¼ÃÃ‰ÃÃ“ÃšÃœ\\s',
                'alphanumeric': 'A-Za-z0-9\\s',
                'email': '0-9a-zA-ZÃ‘Ã±@._\\-',
                'twitter': '\\w_',
                'address': 'A-Za-z0-9\\s'
            },
            regReplace,
            filter = preset[$elem.attr('filter-keys')] || $elem.attr('filter-keys'),
            caretPos = $elem[0].selectionStart;

        if (value) {

            regReplace = new RegExp('[^' + filter + ']', 'ig');
            $elem.val(value.replace(regReplace, ''));
            value = $elem.val();

        }

        caretPos = value.length === valLength ? caretPos : caretPos - 1;

        try {

            $elem[0].setSelectionRange(caretPos, caretPos);

        } catch (error) {

            return;

        }

    });

}());
