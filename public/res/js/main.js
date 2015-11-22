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
        /** serialize the form data **/
        var formData = ($(this).serializeArray());
        $.post('/enc', formData, function(data) {
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
    });
}

function updateComments(postid) {
    $.post('/getcomments', {postid: postid}, function(data) {
    });
}
