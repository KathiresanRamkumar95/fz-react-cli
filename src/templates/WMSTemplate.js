import querystring from 'querystring';
import { log } from '../utils';

let options = querystring.parse(__resourceQuery.slice(1));
window.WebSocket = window.WebSocket || window.MozWebSocket;
let connection = new WebSocket(options.wmsPath);

connection.onopen = () => {
	// connection is opened and ready to use
	console.log('open');
};

connection.onerror = error => {
	// an error occurred when sending/receiving data
};

connection.onmessage = message => {
	// try to decode json (I assume that each message
	// from server is json)
	try {
		let json = JSON.parse(message.data);
		Collaboration.handleCustomMessage(json);
	} catch (e) {
		log("This doesn't look like a valid JSON: ", message.data);
		return;
	}
	// handle incoming message
};
