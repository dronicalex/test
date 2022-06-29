jQuery(document).ready(function($) {


    var active = $('.question-active');
    var custom_url = active.attr('data-custom-url');
    window.history.pushState("", "", '?q=' + custom_url);
    if (typeof gtag == 'function') {
        gtag('config', 'UA-201753528-1', {'page_path': '?q=' + custom_url});
    } else {
        console.log('no');
    }
    $('.cta-button-disabled').click(function(e){
        e.preventDefault();
    });

    $('.back-quiz').click(function(e){
        e.preventDefault();
        move_to_previous_question();
    });

    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    $('.cta-button').on('click', function(e){
        e.preventDefault();
        if(!$(this).hasClass('cta-button-disabled') && $('.question-active').attr('data-question-id') != $('#quiz').attr('data-total')) {
            move_to_next_question();
        }
    });

    function move_to_next_question(){
        var quiz_count = variables.quiz_count,
            active_question = $('.question-active'),
            active_question_id = parseInt(active_question.attr('data-question-id')),
            next_question_id = active_question_id + 1;
        if(active_question_id == quiz_count) {
            $('#quiz').submit();
        } else {
            var new_active_question = $('#quiz').find("[data-question-id='" + next_question_id + "']");
            active_question.fadeOut(150, function () {
                new_active_question.fadeIn(150);
                new_active_question.addClass('question-active');
                active_question.removeClass('question-active');
            });
            if(next_question_id != 1) {
                $('.back-quiz').css('visibility', 'visible');
            }
            if(new_active_question.attr('data-qzcount')) {
                $('.current-count').html(new_active_question.attr('data-qzcount'));
                $('.qz-count').css('visibility', 'visible');
            } else {
                $('.qz-count').css('visibility', 'hidden');
            }
            handle_progress_bar(next_question_id);
            var custom_url = new_active_question.attr('data-custom-url');
            window.history.pushState("", "", '?q=' + custom_url);
            if (typeof gtag == 'function') {
                gtag('config', 'UA-201753528-1', {'page_path': '?q=' + custom_url});
            }
            $('html, body').animate({
                scrollTop: $(".top-line").offset().top
            }, 0);
        }
    }

    function move_to_previous_question(){
        var active_question = $('.question-active'),
            active_question_id = parseInt(active_question.attr('data-question-id')),
            next_question_id = active_question_id - 1;
        if(next_question_id == 0) {
            history.go(-1)
        } else {
            var new_active_question = $('#quiz').find("[data-question-id='" + next_question_id + "']");
            active_question.fadeOut(function(){
                new_active_question.fadeIn();
                new_active_question.addClass('question-active');
                active_question.removeClass('question-active');
            });
            if(next_question_id == 1) {
                $('.back-quiz').css('visibility', 'hidden');
            }
            if(new_active_question.attr('data-qzcount')) {
                $('.current-count').html(new_active_question.attr('data-qzcount'));
                $('.qz-count').css('visibility', 'visible');
            } else {
                $('.qz-count').css('visibility', 'hidden');
            }
            var custom_url = new_active_question.attr('data-custom-url');
            window.history.pushState("", "", '?q=' + custom_url);
            if (typeof gtag == 'function') {
                gtag('config', 'UA-201753528-1', {'page_path': '?q=' + custom_url});
            }

        }
        handle_progress_bar(next_question_id);
    }

    function handle_progress_bar(target_question){
        var progress = 50;
        if(target_question == 1) {
            $('.progress-quiz').addClass('quiz-disabled-progress');
        } else {
            $('.progress-quiz').removeClass('quiz-disabled-progress');
        }
        if(target_question <= 5) {
            progress = progress + (target_question * 5);
        } else {
            progress = 75;
            var quiz_count = variables.quiz_count,
                progress_for_each_question = 25 / quiz_count;
            progress = progress + progress_for_each_question * target_question;
        }
        $('.progress-quiz-active').css('width', progress + '%');
    }


    $('.answ-hl input').on('change', function(e){
        var parent = $(this).parent(),
            parent_parent = parent.parent(),
            numberOfChecked = parent_parent.find('input:checked').length,
            max = parent.attr('data-max');
        parent_parent.find('input:not(:checked)').parent().removeClass('active-box');
        parent_parent.find('input:checked').parent().addClass('active-box');
        if(numberOfChecked >= max) {
            move_to_next_question();
        }

        if(parent_parent.hasClass('multiple-question')) {
            e.preventDefault();
            var numberOfChecked = parent_parent.find('input:checked').length;
            if(numberOfChecked > 0) {
                parent_parent.parent().find('.cta-button').removeClass('cta-button-disabled');
            } else {
                parent_parent.parent().find('.cta-button').addClass('cta-button-disabled');
            }
        }
    });


    $('.single-answer-allowed label').on('click', function(e){
        var parent = $(this),
            parent_parent = parent.parent(),
            numberOfChecked = parent_parent.find('input:checked').length,
            max = parent.attr('data-max');
        parent_parent.find('input:checked').parent().addClass('active-box');
        if(numberOfChecked >= max) {
            move_to_next_question();
        }
    });




    $('.imperial-metric input').on('change', function(e){
        e.preventDefault();
        var container = $(this).parent().parent(),
            numberOfChecked = container.find('input:checked'),
            type = $(this).parent().attr('data-lb');
        if(type == 'lb') {
            $('.lb-inps').show();
            $('.inp-kg').hide();
        } else {
            $('.lb-inps').hide();
            $('.inp-kg').show();
        }
        $('.change-txt-c').html(type);
        $('.imp-label').removeClass('imp-m-active');
        numberOfChecked.parent().addClass('imp-m-active');
    });


    $(document).on('submit', '#quiz', function(e){
        $('.quiz-loader').fadeIn();
        e.preventDefault();
        let formData = new FormData(this);
        formData.append('action', 'submit_quiz_form');
        $.ajax({
            url: variables.ajaxUrl,
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
               // console.log(data);
                window.location.href = variables.quiz_url;
            }
        });
    });


    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); // use for exdays
        d.setTime(d.getTime() + (3600 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

});