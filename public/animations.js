var $window = $(window);
var $urls = $(".urls");
var $urlIn = $("#urlIn");
var $hiddenUrls = $("#listUrl");
var $currentInput = $urlIn.focus();
var $zip_s = $('#zip_s');
var $zip_e = $('#zip_e');

$(function(){
    $("#amazonContainer").hide();
    $("#listUrl").hide();
});


$window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey))  {
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
        if ($urlIn.val().trim() != "") {
            if ( $("#amazonContainer").is(":hidden") ) {
                $("#amazonContainer").show();
            }
            url = cleanInput($urlIn.val().trim());
            $hiddenUrls.val($hiddenUrls.val()+" "+url);
            addUrl(url);
            alert($hiddenUrls.val());
            $urlIn.val('');
        }
    }
}); 

function cleanInput (input) {
    return $('<div/>').text(input).text();
}

function submitUrl(url, zip_s, zip_e)
{
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://54.68.34.231:8000/get_info",
        contentType: "json",
        data: {"url": url, "fromZip" : zip_s, "toZip" : zip_e},
        success: function( response ) {
            alert(response);
        }
    });
}
function submitForm()
{
    var $urlVal = $urlIn.val().trim();
    var $zipSVal = $zip_s.val().trim();
    var $zipEVal = $zip_e.val().trim();

    if ( $urlVal != "" && $zipSVal != "" && $zipEVal != "" )
    {
        alert("hello");
        submitUrl($urlVal, $zipSVal, $zipEVal);
    }
}

function addUrl(url)
{
    var $urlBodyDiv = $('<span class="urlBody">')
        .text(url);

    var $urlDiv = $('<li class="url"/>')
        .append($urlBodyDiv);

    // Setup default options
    $urls.append($urlDiv);
    $urls[0].scrollTop = $urls[0].scrollHeight;
}
