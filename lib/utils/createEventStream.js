'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createEventStream = function createEventStream(heartbeat) {
  var heartbeatInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var clientId = 0;
  var clients = {};
  var everyClient = function everyClient(fn) {
    Object.keys(clients).forEach(function (id) {
      fn(clients[id]);
    });
  };
  setInterval(function () {
    everyClient(function (client) {
      if (heartbeatInfo) {
        client.write('data: ' + JSON.stringify({
          type: 'heartbeat',
          info: heartbeatInfo()
        }) + '\n\n');
      } else {
        client.write('data: ' + JSON.stringify({ type: 'heartbeat' }) + '\n\n');
      }
    });
  }, heartbeat).unref();
  return {
    handler: function handler(req, res) {
      req.socket.setKeepAlive(true);
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      });
      res.write('\n');
      var id = clientId++;
      clients[id] = res;
      req.on('close', function () {
        delete clients[id];
      });
    },
    publish: function publish(payload) {
      everyClient(function (client) {
        client.write('data: ' + JSON.stringify(payload) + '\n\n');
      });
    }
  };
};

exports.default = createEventStream;