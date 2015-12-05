/**
 *  main.js
 *  @authors
 *      - John O'Grady <natedrake> | 14101718
 *  @date 10/11/2015
 *  @note controls ajax calls and jQuery animation
 */
 
var ajaxurls = [];
ajaxurls["comments"] = 'https://cipher-natedrake13.c9users.io/comment';

var animationTimer;

/** $(document).onready **/
$(function(){
    if($('#input-select option:selected').val() === 'vig') {
        addCipherKeyInput();
    }
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
            $('#encrypt-btn').button('reset');
            // ='popover', title='Your Encrypted Text', data-content=""
            //$('#encrypt-btn').attr('data-toggle', 'popover').attr('data-content', data).attr('data-trigger', 'focus').attr('role', 'button');
            $('#encrypt-btn').popover('show');
            updatePreviousRequests();
        });
    });
    
    $('#input-select').on('change', function(event) {
        var selectedCipher = $('#input-select option:selected').val();
        if ($('.keywrapper').length > 0) {
            $('.keywrapper').remove();
        }
        if (selectedCipher === 'vig') {
            addCipherKeyInput();
        }
    });
    
    /**
     *  submit a comment to a post
     */
    $('#submit-comment').on('click', function(event) {
        $.post(ajaxurls['comments'], $('#comment-form').serializeArray(), function(data) {
            updateComments()
        });
    });
    
    
    /**
     *  load previous requests
     *
     */
    $('#requests').ready(function(event) {
        updatePreviousRequests();
    });
    
});

/**
 *  update previous requests table
 */
function updatePreviousRequests() {
    $.post('/requests', '', function(data) {
        console.log('creating animation schema');
        createAnimationSchema($('#requests'));
        setTimeout(function() {
            finishAnimation(function() {
                $('#requests').html(data);
            });
        }, 2000);
    });
}

/**
 *  Update comment list on a blog post 
 */
function updateComments(postid) {
    $.post('/getcomments', {postid: postid}, function(data) {
        
    });
}

/**
 *  function to inject the input box when using vigenere cipher from dropdown 
 */
function addCipherKeyInput() {
    var cipherKeyInput = $(
        '<div class="form-group keywrapper">'+
        '<label for="cipher-key">Choose a Key Phrase <em><small> [] </small><em/></label>'+
        '<input id="cipher-key" name="cipherkey" class="form-control" autocomplete="no" placeholder="Choose a key for encryption" required="true">'+
        '</div>'
    );
    $('#input-select').parent().prev().after(cipherKeyInput);
}

function createAnimationSchema(element) {
    var html = $('<span class="glyphicon glyphicon-cog span-center-big" id="spinner"></span>');
    element.addClass('table-fade');
    element.append(html);
    (performScalingAnimation(html));
}

function scaleElement(element) {
    var defaultFontSize = parseCssProperty(element.css('font-size'));
    var defaultOpacity = element.css('opacity');
    /** the maximum scale factor for element **/
    var iScaleMax = 0;
    iScaleMax = parseCssProperty(element.css('font-size'));
    iScaleMax += (iScaleMax * .2);
    element.animate({
        fontSize: iScaleMax+"px",
        opacity: 0.5
    }, 750, function() {
        element.animate({
            fontSize: defaultFontSize+"px",
            opacity: defaultOpacity
        }, 750, function() {
            console.log('done animation cycle');
        }); // scale back to normal
    }); // scale bigger
}

function performScalingAnimation(element) {
    animationTimer = setInterval(scaleElement(element), 1550);
}

function finishAnimation(callback) {
    $('#spinner').remove();
    $('#requests').removeClass('table-fade');
    clearInterval(animationTimer);
    if (typeof(callback) === 'function') {
        callback();
    }
}

/** 
 * DRY code
 * 
 */
 
 function parseCssProperty(property) {
     var sResult = property;
     var iResult = parseInt(property.replace(/[^\d]/g, ''));
     if (!isNaN(iResult)) {
         return iResult;
     } else {
         return null;
     }
 }