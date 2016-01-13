var port = 8142;


// Require the modules we need
var http = require('http');
var mysql = require('mysql');
var irc = require('irc');
var ircName = "nodejs_boot";
var WebSocketServer = require('websocket').server;
var newMessage = false;
// Create a http server with a callback for each request
var httpServer = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(200, {'Content-type': 'text/plain'});
  response.end('Hello world\n');
});
var sendObject = {};


// Setup the http-server to listen to a port
httpServer.listen(port, function() {
  console.log((new Date()) + ' HTTP server is listening on port ' + port);
});

// Require the modules we need


// Create an object for the websocket
// https://github.com/Worlize/WebSocket-Node/wiki/Documentation
wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

var client = new irc.Client('irc.bsnet.se', 'nodejs_boot', {
    channels: ['#nodejstest','#wip','#db-o-webb'],
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});



var mysqlConnection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'per.fisk20.',
    database : 'irc'
});

mysqlConnection.connect();

function originIsAllowed(origin) {
 //if (origin === 'http://127.0.0.1' || origin === 'http://www.student.bth.se' || origin === 'http://192.168.0.15' || origin === 'http://app.per-lennartsson.se' ) {
    return true;
 //}
 //return false;
}

client.addListener('message', function (fromName, to, message) {
//newMessage = true;
//console.log(newMessage);
console.log(fromName + ' => ' + to + ': ' + message);
var temp =  (new Date).getTime();
//temp = new Date(temp).getUnixTime();
console.log(Math.floor(new Date() / 1000));
sendObject = {fromName: fromName, to: to, message: message, timeMessage:  temp};
storeMessage(sendObject);
});

function storeMessage(object)
{
    console.log(object);
    var sqlString = "INSERT INTO message(message,fromName,channel) VALUES('";
    sqlString += object['message'] + "','";
    sqlString += object['fromName'] + "','";
    sqlString += object['to'] + "')";
    console.log(sqlString);
    mysqlConnection.query(sqlString, function(err, rows) {
            if (err)
            {
                console.log(err);
            }
        });
}
// Create a callback to handle each connection request
wsServer.on('request', function(request) {

    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol',request.origin);
    console.log((new Date()) + ' Connection accepted from ' + request.origin);
    //console.log(connection.connected);
    client.addListener('message', function (fromName, to, message) {
    //console.log(fromName + ' => ' + to + ': ' + message);
    sendObject = {fromName: fromName, to: to, message: message, timeMessage:  new Date()};
    connection.send(JSON.stringify({data: sendObject ,type: 'getOne'}));
    });
    connection.on('message', function(message) {
        var temp = message.utf8Data;
        temp = JSON.parse(temp);
        if(temp.type == "post")
        {
            console.log(temp.channel);
            client.say(temp.channel, temp.message);
            sendObject = {fromName: ircName, to: temp.channel, message: temp.message};
            storeMessage(sendObject);
        } else if(temp.type == "get") {
            mysqlConnection.query("SELECT * from message where  channel='"+temp.channel+"' order by timeMessage DESC limit 100;", function(err, rows) {
                if (err)
                {
                    console.log(err);
                } else{
                    var temp = JSON.stringify({data: rows, type: 'get'});
                    console.log("Succeeded");
                    connection.sendUTF(temp);
                    console.log("Succeeded");
                    //connection.send(JSON.stringify(rows));
                }
            });
        }
    });


    // Callback when client closes the connection
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
