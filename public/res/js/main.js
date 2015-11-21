/**
 *  main.js
 *  @author John O'Grady
 *  @date 10/11/2015
 *  @note controls ajax calls,
 *      uses google AJAXSLT to transform
 *      ajax xml responses with xslt
 */

/** GloBal variables **/
var xmlStylesheet = 'https://cipher-com.herokuapp.com/style.xsl';

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
     *      perform XSL transformation & append
     *      transformed html
     */
    $('#encrypt-form').submit(function() {
        /** serialize the form data **/
        var formData = ($(this).serializeArray());
        /** post the data to the url **/
        $.post('/enc', formData, function(data) {
            /** parse the xml response to be transformed **/
            var xml = xmlParse(data);
            /** get request for xml of xsl file **/
            $.get(xmlStylesheet, function(response) {
                /**
                *   xsl is returned as an XML Object,
                 *  we need to serialize it, then convert to string
                 */
                var xslt = xmlParse(new XMLSerializer().serializeToString(response));
                /** transform the xml with the xslt **/
                var returnHTML = xsltProcess(xml, xslt);
                updatePreviousRequests();
                $('#response').html(returnHTML);
            }); // end $.get
        }); // end $.post
    }); // end onsubmit
    /**
     *  load previous requests
     *
     */
     $('#requests').ready(function(event) {
         updatePreviousRequests();
     });
});

function updatePreviousRequests() {
    $.post('/requests', '', function(data) {
        /** parse the xml response to be transformed **/
        var xml = xmlParse(data);
        /** get request for xml of xsl file **/
        $.get(xmlStylesheet, function(response) {
            /**
            *   xsl is returned as an XML Object,
             *  we need to serialize it, then convert to string
             */
            var xslt = (new XMLSerializer().serializeToString(response));
            xslt = xmlParse(xslt);
            /** transform the xml with the xslt **/
            var returnHTML = xsltProcess(xml, xslt);
            $('#requests').html(returnHTML);
        }); // end $.get
    }); // end $.post
}
