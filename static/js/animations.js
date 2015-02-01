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
    $("#getZips").hide();
    $("#errorMes").hide();
});

//function resizeMe()
//{
//    if ( $listCounter > 1 ){
//        $(".urlBody").text(
//            $item_dictionary[$(this).attr('id')].title.substr(0, getStrLen())
//        );
//    }
//}
//
function goToZips()
{
    if ( Object.keys($item_dictionary).length > 0 ) 
    {
        $("#getZips").show();
        $("#getUrl").hide();

    }
    else
    {
        $("#normMes").hide();//.delay(1000).show();
        $("#errorMes").show();//.delay(1000).hide();
    }
}

function returnURL()
{
    $("#getZips").hide();
    $("#getUrl").show();
}

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

function submitUrl(urls, zip_s, zip_e)
{
    $.ajax({
        url: "/submit_req",
        type: "POST",
        data: "urls="+urls+"&from_zip="+zip_s+"$to_zip="+zip_e,
        success: function( response ) {
            alert(response.sh_price);
        }
    });
}
function submitForm()
{
    var $zipSVal = $zip_s.val().trim();
    var $zipEVal = $zip_e.val().trim();
    var $urlList = Object.keys($item_dictionary);

    alert($urlList);

    if ( $urlList != "" && $zipSVal != "" && $zipEVal != "" )
    {
        submitUrl($urlList, $zipSVal, $zipEVal);
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
                $item_dictionary[url].url = url;
                updateName(response, url);
            }
        });
    }
    else {
        alert("This item has already been added! \nPlease change the quanity.");
    }
}

function getStrLen()
{
    var $winWidth = $(window).width();
    return ($winWidth*.60 - 160-120)/20;
}

function addItem(val, url)
{
    $item_dictionary[url].counter = $item_dictionary[url].counter+1 ;
    $('#numItem'+val).text( $item_dictionary[url].counter );
}

function subItem(val, url)
{
    $item_dictionary[url].counter = $item_dictionary[url].counter - 1;
    $('#numItem'+val).text( $item_dictionary[url].counter );
    if ( $item_dictionary[url].counter <= 0 )
    {
        removeMe(val, url);
    }
}

function updateName(response, url)
{
    $item_dictionary[url].counter = 1;
    var $urlBodyButton = $('<font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Qt:</font><span id="numItem'+$listCounter+'">'+
                            $item_dictionary[url].counter+'</span><span class="label label-primary" onClick="addItem('+$listCounter+',\'' + url +
                            '\')">+</span><span class="label label-primary" onClick="subItem('+$listCounter+',\''+url+'\')">-</span><span style="float:right;"id="button' + 
                            $listCounter + '" class="label label-danger" onClick="removeMe(' + 
                            $listCounter + ',\'' + url + '\')">X</span>&nbsp;&nbsp;&nbsp;</div> ');
    var $urlBodyDiv = $('<span class="urlBody" id="' + url +'">'+response.title.substr(0,getStrLen())+'...</span>').append($urlBodyButton);
    var $urlPic = $('<div class="urlItem"><img width=100px src="'+response.image+'"/>').append($urlBodyDiv);

    var $urlDiv = $('<li name="'+url+'" class="url">')
        .append($urlPic)
        .append("</li>")
        .attr('id', "element"+$listCounter);


    $listCounter++;

    // Setup default options
    $urls.prepend($urlDiv);
    $urls[0].scrollTop = $urls[0].scrollHeight;
}
