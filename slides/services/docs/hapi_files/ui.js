(function ($) {

    $.toc = $.toc || {};

    $.toc.register = function () {
        var prevHeaderNum = 2;
        var toc = $('<div><ul class="1"></ul></div>');
        var level = 1;

        $.each($('h2, h3, h4'), function(i, header) {
            var headingText = $(header).text();
            var headingId = headingText.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            $(header).attr("id", headingId);
            var headerNum = parseInt(header.tagName.replace(/H/i, ''));

            if (prevHeaderNum === headerNum) {
                $('ul.' + level + ':last', toc).append("<li><a href=\"#" + headingId + "\">" + headingText + "</a></li>");
            }
            else if (prevHeaderNum < headerNum) {
                $('ul.' + level + ':last li:last', toc).append("<ul class=\"" + ++level + "\"><li><a href=\"#" + headingId + "\">" + headingText + "</a></li></ul>");
            }
            else {
                $('ul.' + --level + ':last', toc).append("<li><a href=\"#" + headingId + "\">" + headingText + "</a></li>");
            }

            prevHeaderNum = headerNum;
        });

        if ( ('.api').length === 0 ) {
            $('.sidebar').append(toc);
        }

    };
})(jQuery);
