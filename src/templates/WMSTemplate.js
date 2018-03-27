import querystring from 'querystring';

let log = (...args) => {
	let print = console;
	print.log(...args);
};

// eslint-disable-next-line no-undef
let options = querystring.parse(__resourceQuery.slice(1));
window.WebSocket = window.WebSocket || window.MozWebSocket;
let connection = new WebSocket(options.wmsPath);

connection.onopen = () => {
	// connection is opened and ready to use
	log('open');
};

connection.onerror = error => {
	// an error occurred when sending/receiving data
	throw error;
};

connection.onmessage = message => {
	// try to decode json (I assume that each message
	// from server is json)
	try {
		let json = JSON.parse(message.data);
		// eslint-disable-next-line no-undef
		Collaboration.handleCustomMessage(json);
	} catch (e) {
		log('This doesn\'t look like a valid JSON: ', message.data);
		return;
	}
	// handle incoming message
};
