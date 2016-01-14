/**
* Place your JS-code here.
*/
var bootName = "";
var currentChannel = "#";
var lastY = 0;
document.addEventListener('deviceready', function() {
    currentChannel = "#";
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

    ThreeDeeTouch.isAvailable(function (avail) {
        ThreeDeeTouch.enableLinkPreview();

        ThreeDeeTouch.configureQuickActions([
        {
            title: '#n',
            iconTemplate: 'HeartTemplate'
        },
        {
          title: '#',
          iconTemplate: 'HeartTemplate'
        },
        {
          title: '#',
          iconTemplate: 'HeartTemplate' // from Assets catalog
        }
        ]);
    });
    
    window.addEventListener('keyboardDidHide', function (e) {
        window.scrollTo(20,0);
    });

    console.log('Everything is ready.');
    websocket = new WebSocket('ws://127.0.0.1:8142', 'echo-protocol');

    websocket.onopen = function(){
        console.log('The websocket is now open.');
        //websocket.send('Thanks for letting me connect to you.');
    }

    websocket.onmessage = function(event) {
      
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
    console.log(channel);
    currentChannel = channel;
    updateChatPage(channel);
}

function showMessages(data)
{

    for(var i = data.length-1; i >= 0 ; i--)
    {
        showMessage(data[i]);

    }
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
