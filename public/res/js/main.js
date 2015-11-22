/**
 *  main.js
 *  @author John O'Grady
 *  @date 10/11/2015
 *  @note controls ajax calls
 */
 
var ajaxurls = [];
ajaxurls["comments"] = 'https://cipher-natedrake13.c9users.io/comment';

/** $(document).onready **/
$(function(){
    /**
     *  @note prevent default on forms on submit event to stop page refreshing on submit.
     **/
    $('form').each(function(index) {
        $(this).submit(function(event) {
            event.preventDefault();
        });
    });
    /**
     *  @note send request to encrypt text
     */
    $('#encrypt-form').submit(function() {
        $('#encrypt-btn').button('loading');
        /** serialize the form data **/
        var formData = ($(this).serializeArray());
        $.post('/enc', formData, function(data) {
            setTimeout(function() {
                $('#encrypt-btn').button('reset');
                // ='popover', title='Your Encrypted Text', data-content=""
                $('#encrypt-btn').attr('data-toggle', 'popover').attr('data-content', data).attr('data-trigger', 'focus').attr('role', 'button');
                $('#encrypt-btn').popover('show');
                updatePreviousRequests();
            }, 2000);
        });
    });
    /**
     *  load previous requests
     *
     */
    $('#requests').ready(function(event) {
        updatePreviousRequests();
    });
    
    /**
     *  submit a comment to a post
     */
    $('#submit-comment').on('click', function(event) {
        console.log($('#comment-form').serializeArray().postid);
        $.post(ajaxurls['comments'], $('#comment-form').serializeArray(), function(data) {
            updateComments()
        });
    });
    
});

function updatePreviousRequests() {
    $.post('/requests', '', function(data) {
        $('#requests').html(data);
    });
}

function updateComments(postid) {
    $.post('/getcomments', {postid: postid}, function(data) {
    });
}
