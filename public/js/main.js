$(function () {
    $('.js-subscribe-button').click(function() {
        var topicId = $(this).closest('.topic').data('id');
        sendAjaxWithPopup('/subscribe', 'POST', {topic: topicId});
    });

    $('.js-unsubscribe-button').click(function() {
        var topicId = $(this).closest('.topic').data('id');
        sendAjaxWithPopup('/unsubscribe', 'POST', {topic: topicId});
    });

    $('.js-delete-button').click(function() {
        var topicId = $(this).closest('.topic').data('id');
        sendAjaxWithPopup('/topic/delete/' + topicId, 'GET', null, true);
    });

    function sendAjaxWithPopup(url, method, data, reload) {
        reload = reload || false;
        var $popup = $('#popup');
        $popup.attr('data-reload', 0);
        $.ajax({
            method: method,
            url: url,
            data: data,
            dataType: 'json',
            success: function(data) {
                if (data.status == 'success') {
                    $popup.addClass('is-visible')
                        .find('.popup__title').html(data.message)
                        .removeClass('error').addClass('success');
                    if (reload) {
                        $popup.attr('data-reload', 1);
                    }
                } else if (data.status == 'fail') {
                    $popup.addClass('is-visible')
                        .find('.popup__title').html(data.message)
                        .removeClass('success').addClass('error');
                }
            }
        });
    }

    $(function() {
        // close popup
        $('#popup').on('click', function(event){
            if( $(event.target).is('.popup__close') || $(event.target).is('#popup') ) {
                event.preventDefault();
                $(this).removeClass('is-visible');
                if ($(this).data('reload')) {
                    location.reload();
                }
            }
        });

        // close popup when clicking the esc keyboard button
        $(document).keyup(function(event){
            if(event.which=='27'){
                var $popup = $('#popup');
                $popup.removeClass('is-visible');
                if ($popup.data('reload')) {
                    location.reload();
                }
            }
        });
    });
});