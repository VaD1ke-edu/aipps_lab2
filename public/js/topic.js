$(function () {
    $('#create-topic').click(function (e) {
        var $popup;
        var $form = $(this).closest('#topic-form');
        $.ajax({
            method: 'POST',
            url: $form.attr('action'),
            data: {
                title: $form.find('#title')[0].value,
                content: $form.find('#content')[0].value
            },
            dataType: 'json',
            success: function (data) {
                if (data.status == 'success') {
                    $popup = $('#popup');
                    $popup.addClass('is-visible')
                        .find('.popup__title').html(data.message)
                        .removeClass('error').addClass('success');
                    $popup.attr('status', 'success');
                } else if (data.status == 'fail') {
                    $popup = $('#popup');
                    $popup.addClass('is-visible')
                        .find('.popup__title').html(data.message)
                        .removeClass('success').addClass('error');
                    $popup.attr('status', 'fail');
                }
            }
        });
        e.preventDefault();
    });

    $(function() {
        // close popup
        $('#popup').on('click', function (event){
            if( $(event.target).is('.popup__close') || $(event.target).is('#popup') ) {
                event.preventDefault();
                $(this).removeClass('is-visible');
                if ($(this).attr('status') == 'success') {
                    window.location.replace(window.location.host);
                }
            }
        });

        // close popup when clicking the esc keyboard button
        $(document).keyup(function (event){
            if(event.which=='27'){
                $('#popup').removeClass('is-visible');
                if ($('#popup').attr('status') == 'success') {
                    window.location.replace(window.location.host);
                }
            }
        });
    });
});