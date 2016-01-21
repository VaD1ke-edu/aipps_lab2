$(function () {
    $('.js-subscribe-button').click(function () {
        sendAjax('/subscribe', 'POST', {topic: 1});
    });

    $('.js-unsubscribe-button').click(function () {
        sendAjax('/unsubscribe', 'POST', {topic: 1});
    });

    function sendAjax(url, method, data) {
        $.ajax({
            method: method,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.status == 'success') {
                    $('#popup').addClass('is-visible')
                        .find('.popup__title').html(data.message)
                        .removeClass('error').addClass('success');
                } else if (data.status == 'fail') {
                    $('#popup').addClass('is-visible')
                        .find('.popup__title').html(data.message)
                        .removeClass('success').addClass('error');
                }
            }
        });
    }

    $(function() {
        // close popup
        $('#popup').on('click', function (event){
            if( $(event.target).is('.popup__close') || $(event.target).is('#popup') ) {
                event.preventDefault();
                $(this).removeClass('is-visible');
            }
        });

        // close popup when clicking the esc keyboard button
        $(document).keyup(function (event){
            if(event.which=='27'){
                $('#popup').removeClass('is-visible');
            }
        });
    });
});