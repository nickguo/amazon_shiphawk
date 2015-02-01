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
    $("#calculating").hide();
    $("#result").hide();
    $("#buyResult").hide();
    $("#shipResult").hide();
    $("#getZips").hide();
    $("#errorMes").hide();
    $("#shipResult").hide();
});



function toggleResult(sh, am)
{
    $("#calculating").hide();
    $("#result").delay(10000).show();
    if ( am > sh )
        $("#shipResult").delay(10000).show();
    else
        $("#buyResult").delay(10000).show();

    if ( $("#shipResult").is(":visible") )
    {
        $('body').css("background-color","#093A49");
        $('html').css("background-color","#093A49");
        $("#shipButton").attr("class", "btn btn-lg btn-success")
            .append("<br/>Cost: $"+sh.toFixed(2));
        $("#buyButton").attr("class", "btn btn-lg btn-default").
            append("<br/>Cost: $"+am.toFixed(2));
        $("#buyDiv").insertAfter("#shipDiv").prepend('<br/>');
    }
    else
    {
        $('body').css("background-color","orange");
        $('html').css("background-color","orange");
        $("#buyButton").attr("class", "btn btn-lg btn-success")
            .append("<br/>Cost: $"+am.toFixed(2));
        $("#shipButton").attr("class", "btn btn-lg btn-default")
            .append("<br/>Cost: $"+sh.toFixed(2));
        $("#shipDiv").insertAfter("#buyDiv").prepend('<br/>');
    }
}

function goToZips()
{
    if ( Object.keys($item_dictionary).length > 0 ) 
    {
        $("#getZips").show();
        $zip_s.focus();
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
        if ($urlIn.val().trim() != "" && $("#getZips").is(":hidden") ) {
            if ( $("#amazonContainer").is(":hidden") ) {
                $("#amazonContainer").show();
            }
            url = cleanInput($urlIn.val().trim());
            $hiddenUrls.val($hiddenUrls.val()+" "+url);
            addUrl(url);
            $urlIn.val("");
        }
        else if ($("#getZips").is(":visible") )
        {
            submitForm();
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
    if ( $zipSVal.length != 5 || $zipEVal.length != 5 )
    {
        alert("Zipcodes are not length of 5");
        return;
    }
    var $urlList = Object.keys($item_dictionary);

    var $urlString = "\'";

    for ( var url in $item_dictionary) {
        var $numItem = $item_dictionary[url].counter;
        while (parseInt($numItem) > 0)
        {
            $urlString = $urlString  + "\"" + url.split('&')[0] + "\",";
            $numItem --;
        }
    }

    $urlString = $urlString.substr(0, $urlString.length - 1) + "\'";

    if ( $urlString != "" && $zipSVal != "" && $zipEVal != "" )
    {
        $("#inputVals").animate({'marginTop':"-=500px"}, function(){$("#inputVals").hide();$("#calculating").show()});;
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
                if ( response.error == "item error" )
                {
                    alert("Not a valid Amazon URL.");
                }
                else
                {
                    $item_dictionary[url] = response;
                    $item_dictionary[url].url = url;
                    updateName(response, url);
                }
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
    return ($winWidth*.60 - 100)/20;
}

function addItem(val, url)
{
    $item_dictionary[url].counter = $item_dictionary[url].counter+1 ;
    $('#numItem'+val).text( $item_dictionary[url].counter +"   ");
}

function subItem(val, url)
{
    $item_dictionary[url].counter = $item_dictionary[url].counter - 1;
    $('#numItem'+val).text( $item_dictionary[url].counter +"   ");
    if ( $item_dictionary[url].counter <= 0 )
    {
        removeMe(val, url);
    }
}

function updateName(response, url)
{
    $item_dictionary[url].counter = 1;
    var $urlBodyButton = $('<div class="qtControll"><font color=black>Qt: </font><span style="color:black" id="numItem'+$listCounter+'">'+
                            $item_dictionary[url].counter+'&nbsp;</span><button style="font-size:32px; padding:0px;width:50px" class="btn btn-default" onClick="addItem('+$listCounter+',\'' + url +
                            '\')">+</span>&nbsp;<button style="font-size:32px; width:50px; padding:0px;" class="btn btn-default" onClick="subItem('+$listCounter+',\''+url+'\')">-</button></div>'
                            //<span style="float:right;"id="button' + 
                            //$listCounter + '" class="label label-danger" onClick="removeMe(' + 
                            //$listCounter + ',\'' + url + '\')">X</span>
                            +'&nbsp;&nbsp;&nbsp;</div> ');
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
