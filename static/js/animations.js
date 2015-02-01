var $window = $(window);
var $urls = $(".urls");
var $urlIn = $("#urlIn");
var $hiddenUrls = $("#listUrl");
var $currentInput = $urlIn.focus();
var $zip_s = $('#zip_s');
var $zip_e = $('#zip_e');




var $listCounter = 1;

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
            //alert($hiddenUrls.val());
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
        url: "/get_info",
        type: "POST",
        data: "url="+url+"&fromZip="+zip_s+"&toZip="+zip_e,
        success: function( response ) {
            alert(response.fromZip);
        }
    });
}
function submitForm()
{
    var $urlVal = $urlIn.val().trim();
    var $zipSVal = $zip_s.val().trim();
    var $zipEVal = $zip_e.val().trim();

    var $urlList = "";

    $("li").each(function( index ) {
        $urlList = $urlList + $(this).text().substr(4) + " ";
    });

    alert($urlList);

    if ( $urlVal != "" && $zipSVal != "" && $zipEVal != "" )
    {
        alert($urlVal);
        submitUrl($urlVal, $zipSVal, $zipEVal);
    }
}

function removeMe(val)
{
    $("#element"+val).remove();
}

function addUrl(url)
{
    $.ajax({
        url: "/get_info",
        type: "POST",
        data: "url="+url+"&fromZip="+0+"&toZip="+0,
        success: function( response ) {
            updateName(response, url);
        }
    });

}

function updateName(response, url)
{
    var $urlBodyButton = $('<div style="float:right" class="xbutton"><button id="button' + 
                            $listCounter + '" class="label label-danger" onClick="removeMe(' + 
                            $listCounter + ')">X</button>&nbsp;&nbsp;&nbsp;</div></div> ');
    var $urlBodyDiv = $('<span class="urlBody">'+response.title.substr(0,30)+'...</span>').append($urlBodyButton);
    var $urlPic = $('<div class="urlItem"><img width=100px src="'+response.image+'"/>').append($urlBodyDiv);

    var $urlDiv = $('<li class="url">')
        .append($urlPic)
        .append("</li>")
        .attr('id', "element"+$listCounter);

    $listCounter++;

    // Setup default options
    $urls.prepend($urlDiv);
    $urls[0].scrollTop = $urls[0].scrollHeight;
}
