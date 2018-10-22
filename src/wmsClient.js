var querystring = require('querystring');
var options = querystring.parse(__resourceQuery.slice(1));
window.WebSocket = window.WebSocket || window.MozWebSocket;
var connection = new WebSocket(options.wmsPath);
connection.onopen = function() {
  // connection is opened and ready to use
  console.log('open');
};

connection.onerror = function(error) {
  // an error occurred when sending/receiving data
};

connection.onmessage = function(message) {
  // try to decode json (I assume that each message
  // from server is json)
  try {
    var json = JSON.parse(message.data);
    Collaboration.handleCustomMessage(json);
  } catch (e) {
    console.log("This doesn't look like a valid JSON: ", message.data);
    return;
  }
  // handle incoming message
};
