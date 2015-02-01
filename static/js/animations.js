var $window = $(window);
var $urls = $(".urls");
var $urlIn = $("#urlIn");
var $hiddenUrls = $("#listUrl");
var $currentInput = $urlIn.focus();
var $zip_s = $('#zip_s');
var $zip_e = $('#zip_e');




var $listCounter = 1;

var $item_dictionary = {};

$(function(){
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

function removeMe(val, url)
{
    $("#element"+val).remove();
    if (url in $item_dictionary) {
        delete $item_dictionary[url];
    }
}

function addUrl(url)
{
    if (!(url in $item_dictionary)) {
        $.ajax({
            url: "/get_info",
            type: "POST",
            data: "url="+url+"&fromZip="+0+"&toZip="+0,
            success: function( response ) {
                $item_dictionary[url] = response;
                $item_dictionary[url]['url'] = url;
                updateName(response, url);
            }
        });
    }
    else {
        alert("This item has already been added!");
    }
}

function updateName(response, url)
{
    var $urlBodyButton = $('<div style="float:right" class="xbutton"><span id="button' + 
                            $listCounter + '" class="label label-danger" onClick="removeMe(' + 
                            $listCounter + ',\'' + url + '\')">X</span>&nbsp;&nbsp;&nbsp;</div></div> ');
    var $urlBodyDiv = $('<span class="urlBody" id="' + url +'">'+response.title.substr(0,40)+'...</span>').append($urlBodyButton);
    var $urlPic = $('<div class="urlItem"><img width=100px src="'+response.image+'"/>').append($urlBodyDiv);

    var $urlDiv = $('<li class="url">')
        .append($urlPic)
        .append("</li>")
        .attr('id', "element"+$listCounter);

    $item_dictionary[url]['counter'] = $listCounter;

    $listCounter++;

    // Setup default options
    $urls.prepend($urlDiv);
    $urls[0].scrollTop = $urls[0].scrollHeight;
}
