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
    $("#result").hide();
    $("#buyResult").hide();
    $("#shipResult").hide();
    $("#getZips").hide();
    $("#errorMes").hide();
    $("#shipResult").hide();
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
//
function toggleResult(sh, am)
{
    $("#inputVals").hide();
    $("#result").show();
    if ( sh > am )
        $("#shipResult").show();
    else
        $("#buyResult").show();

    if ( $("#shipResult").is(":visible") )
    {
        $('body').css("background-color","#093A49");
        $('html').css("background-color","#093A49");
        $("#shipButton").attr("class", "btn btn-lg btn-success");
        $("#buyButton").attr("class", "btn btn-lg btn-default");
        $("#buyDiv").insertAfter("#shipDiv").prepend('<br/>');
    }
    else
    {
        $('body').css("background-color","orange");
        $('html').css("background-color","orange");
        $("#buyButton").attr("class", "btn btn-lg btn-success");
        $("#shipButton").attr("class", "btn btn-lg btn-default");
        $("#shipDiv").insertAfter("#buyDiv").prepend('<br/>');
    }
}

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
        data: "urls="+urls+"&from_zip="+zip_s+"&to_zip="+zip_e,
        success: function( response ) {
            toggleResult(response.sh_price, response.am_price);
        }
    });
}
function submitForm()
{
    var $zipSVal = $zip_s.val().trim();
    var $zipEVal = $zip_e.val().trim();
    var $urlList = Object.keys($item_dictionary);

    var $urlString = "[";

    for ( var url in $item_dictionary) {
        var $numItem = $item_dictionary[url].counter;
        while (parseInt($numItem) > 0)
        {
            $urlString = $urlString  + "'" + url + "',";
            $numItem --;
        }
    }

    $urlString = $urlString.substr(0, $urlString.length - 1) + "]";

    alert($urlString);

    if ( $urlString != "" && $zipSVal != "" && $zipEVal != "" )
    {
        submitUrl($urlString, $zipSVal, $zipEVal);
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
    var $urlPic = $('<div class="urlItem"><img height=100px width=100px src="'+response.image+'"/>').append($urlBodyDiv);

    var $urlDiv = $('<li name="'+url+'" class="url">')
        .append($urlPic)
        .append("</li>")
        .attr('id', "element"+$listCounter);


    $listCounter++;

    // Setup default options
    $urls.prepend($urlDiv);
    $urls[0].scrollTop = $urls[0].scrollHeight;
}
