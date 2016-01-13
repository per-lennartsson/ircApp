/**
* Place your JS-code here.
*/
var bootName = "per-mobil";
var currentChannel = "#db-o-webb";
var lastY = 0;
document.addEventListener('deviceready', function() {
    currentChannel = "#db-o-webb";
    setup();

    ThreeDeeTouch.onHomeIconPressed = function(payload) {
        channel(payload.title);
    };
    StatusBar.overlaysWebView(false);
    StatusBar.styleDefault();
    StatusBar.backgroundColorByHexString("#f8f8f8");
    channel(currentChannel);
}, false);
function setup(){
    //Keyboard.disableScrollingInShrinkView(true);
    window.addEventListener("statusTap", function() {
        window.scrollTo(20, 0);
    });
    /*
    $(function() {
        $(document).on("touchmove", function(evt) {
            //console.log($( "body" ).scrollTop());
            if($( "body" ).scrollTop()== 0)
            {
                //console.log($( "body" ).scrollTop()== 0);

                var currentY = $( "body" ).scrollTop();
                console.log(currentY);
                console.log(lastY);
                    if(currentY > lastY){
                        console.log($( "body" ).scrollTop());
                    } else if(currentY <= lastY){
                        console.log($( "body" ).scrollTop());
                        evt.preventDefault();
                    }
                lastY = currentY;
            }

        });
        $(document).on("touchmove", ".scrollable", function(evt) {
            if($( "body" ).scrollTop()== 0)
            {
                var lastY;
                var currentY = evt.originalEvent.touches[0].clientY;
                    if(currentY > lastY){
                        console.log($( "body" ).scrollTop());
                    } else if(currentY < lastY){
                        console.log($( "body" ).scrollTop());
                        evt.preventDefault();
                    }
                lastY = currentY;
            }

        });
    });
    */
    ThreeDeeTouch.isAvailable(function (avail) {
        ThreeDeeTouch.enableLinkPreview();

        ThreeDeeTouch.configureQuickActions([
        {
            title: '#nodejstest',
            iconTemplate: 'HeartTemplate'
        },
        {
          title: '#wip',
          iconTemplate: 'HeartTemplate'
        },
        {
          title: '#db-o-webb',
          iconTemplate: 'HeartTemplate' // from Assets catalog
        }
        ]);
    });
    /*
    window.addEventListener('keyboardDidShow', function(e) {

        console.log("test");
        //e.preventDefault();
        //document.getElementById('fixedDiv').style.position = "absolute";
        //document.getElementById('fixedDiv').style.top = "380px;";
    });
    */
    window.addEventListener('keyboardDidHide', function (e) {
        window.scrollTo(20,0);
    });

    console.log('Everything is ready.');
    //document.getElementById("startPage").style.display = "";
    //document.getElementById("chatPage").style.display = "none";
    websocket = new WebSocket('ws://127.0.0.1:8142', 'echo-protocol');

    websocket.onopen = function(){
        console.log('The websocket is now open.');
        //websocket.send('Thanks for letting me connect to you.');
    }

    websocket.onmessage = function(event) {
        //console.log(JSON.parse(event.data));
        //document.getElementById('messages').innerHTML = document.getElementById('messages').innerHTML + "<p>" + event.data + "</p>";
            data = JSON.parse(event.data);
            type = data.type;
            data = data.data;
            console.log(type);
            console.log(data);
        if (type == "get") {
            showMessages(data);
        } else if(type == "getOne") {
            if(data['to'] == currentChannel) {
                showMessage(data);
            }
        }
    }

    websocket.onclose = function() {
        console.log('The websocket is now closed.');
    }

    window.addEventListener("beforeunload", function (e) {
        websocket.onclose();

    });

}

function showMessage(event)
{
    //console.log(event);
    //document.getElementById("chatPage").style.display = "";
    //document.getElementById("startPage").style.display = "none";
    var temp = document.getElementById('messages').innerHTML;
    //console.log(temp);
    document.getElementById('messages').innerHTML = "";
    var minutes = new Date(event['timeMessage']).getMinutes();
    var hours = new Date(event['timeMessage']).getHours()
    if(minutes.toString().length == 1) {
        minutes = '0'+minutes;
    }

    if(hours.toString().length == 1) {
        hours = '0'+hours;
    }
    var tempMessage = event['message'];
    tempMessage = tempMessage.autoLink();
    /*var tempString = tempMessage.substring(tempMessage.indexOf(">"),tempMessage.indexOf("</a>"));
    tempMessage.splice(tempMessage.indexOf(">"),tempMessage.indexOf("</a>")-tempMessage.indexOf(">"),tempString.substring(0,47)+"...");
    */
    var message = document.createElement("div");
    message.className = 'message';
    message.innerHTML += "<p><b>"+ hours + ":"+ minutes +" : "+ event['fromName'] + " </b></p>";
    message.innerHTML += "<p>"+ tempMessage + "</p>";

    document.getElementById('messages').appendChild(message);
    document.getElementById('messages').innerHTML += temp;
    window.scrollTo(20, 0);
}

function sendMessage()
{
    //console.log(currentChannel);
    if(document.getElementById('textMessage').value.length > 0)
    {
        var temp = {channel: currentChannel, message: document.getElementById('textMessage').value, type: 'post'};
        websocket.send(JSON.stringify(temp));
        temp = {fromName: bootName, to: currentChannel, message: document.getElementById('textMessage').value, timeMessage: new Date()};
        showMessage(temp);
        document.getElementById('textMessage').value = "";
    }
}

function updateChatPage(channel)
{
    document.getElementById('messages').innerHTML = "";
    var temp = {type: 'get', channel: channel};

    var sendinterval = setInterval(function (){
        if(websocket.readyState == 1){
            websocket.send(JSON.stringify(temp));
            clearInterval(sendinterval);
        }
    },100);

}

function channel(channel)
{
    //document.getElementById("chatPage").style.display = "";
    //document.getElementById("startPage").style.display = "none";
    console.log(channel);
    currentChannel = channel;
    updateChatPage(channel);
}

function showMessages(data)
{

    for(var i = data.length-1; i >= 0 ; i--)
    {
        //console.log(data[i]);
        showMessage(data[i]);

    }
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
