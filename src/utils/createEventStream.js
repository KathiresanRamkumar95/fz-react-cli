let createEventStream = (heartbeat, heartbeatInfo = null) => {
	let clientId = 0;
	let clients = {};
	let everyClient = fn => {
		Object.keys(clients).forEach(id => {
			fn(clients[id]);
		});
	};
	setInterval(() => {
		everyClient(client => {
			if (heartbeatInfo) {
				client.write(
					'data: ' +
						JSON.stringify({
							type: 'heartbeat',
							info: heartbeatInfo()
						}) +
						'\n\n'
				);
			} else {
				client.write(
					'data: ' + JSON.stringify({ type: 'heartbeat' }) + '\n\n'
				);
			}
		});
	}, heartbeat).unref();
	return {
		handler: (req, res) => {
			req.socket.setKeepAlive(true);
			res.writeHead(200, {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'text/event-stream;charset=utf-8',
				'Cache-Control': 'no-cache, no-transform',
				Connection: 'keep-alive'
			});
			res.write('\n');
			let id = clientId++;
			clients[id] = res;
			req.on('close', () => {
				delete clients[id];
			});
		},
		publish: payload => {
			everyClient((client) => {
				client.write('data: ' + JSON.stringify(payload) + '\n\n');
			});
		}
	};
};

export default createEventStream;
