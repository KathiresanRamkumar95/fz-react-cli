module.exports = hmrMiddleware;

function pathMatch(url, path) {
  if (url == path) {
    return true;
  }
  var q = url.indexOf('?');
  if (q == -1) {
    return false;
  }
  return url.substring(0, q) == path;
}

function hmrMiddleware(compiler, opts) {
  opts = opts || {};
  opts.log =
    typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
  opts.path = opts.path || '/__webpack_hmr';
  opts.heartbeat = opts.heartbeat || 10 * 1000;

  var eventStream = createEventStream(opts.heartbeat);
  var latestStats = null;

  compiler.plugin('compile', function() {
    latestStats = null;
    if (opts.log) {
      opts.log('webpack building...');
    }
    eventStream.publish({ type: 'building' });
  });
  compiler.plugin('done', function(statsResult) {
    // Keep hold of latest stats so they can be propagated to new clients
    latestStats = statsResult;

    publishStats('built', latestStats, eventStream, opts.log);
  });
  var middleware = function(req, res, next) {
    if (!pathMatch(req.url, opts.path)) {
      return next();
    }
    eventStream.handler(req, res);
    if (latestStats) {
      // Explicitly not passing in `log` fn as we don't want to log again on
      // the server
      //  publishStats('sync', latestStats, eventStream);
    }
  };
  middleware.publish = eventStream.publish;
  return middleware;
}

function createEventStream(heartbeat) {
  var clientId = 0;
  var clients = {};
  function everyClient(fn) {
    Object.keys(clients).forEach(function(id) {
      fn(clients[id]);
    });
  }
  setInterval(function heartbeatTick() {
    everyClient(function(client) {
      client.write('data: ' + JSON.stringify({ type: 'heartbeat' }) + '\n\n');
    });
  }, heartbeat).unref();
  return {
    handler: function(req, res) {
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
      req.on('close', function() {
        delete clients[id];
      });
    },
    publish: function(payload) {
      everyClient(function(client) {
        client.write('data: ' + JSON.stringify(payload) + '\n\n');
      });
    }
  };
}

function publishStats(action, statsResult, eventStream, log) {
  // For multi-compiler, stats will be an object with a 'children' array of stats
  var bundles = extractBundles(statsResult.toJson({ errorDetails: false }));
  bundles.forEach(function(stats) {
    if (log) {
      log(
        'webpack built ' +
          (stats.name ? stats.name + ' ' : '') +
          stats.hash +
          ' in ' +
          stats.time +
          'ms'
      );
    }
    // if (
    //   //  !force &&
    //   action !== 'sync' &&
    //   stats &&
    //   (!stats.errors || stats.errors.length === 0) &&
    //   stats.assets &&
    //   stats.assets.every(asset => !asset.emitted)
    // ) {
    //   eventStream.publish({
    //     type: 'still-ok'
    //   });
    // }
    eventStream.publish({
      type: 'hash',
      data: stats.hash
    });

    if (stats.errors.length > 0) {
      eventStream.publish({
        type: 'errors',
        data: stats.errors
      });
    } else if (stats.warnings.length > 0) {
      eventStream.publish({
        type: 'warnings',
        data: stats.warnings
      });
    } else {
      eventStream.publish({
        type: 'content-changed'
      });
    }
  });
}

function extractBundles(stats) {
  // Stats has modules, single bundle
  if (stats.modules) {
    return [stats];
  }

  // Stats has children, multiple bundles
  if (stats.children && stats.children.length) {
    return stats.children;
  }

  // Not sure, assume single
  return [stats];
}

function buildModuleMap(modules) {
  var map = {};
  modules.forEach(function(module) {
    map[module.id] = module.name;
  });
  return map;
}
