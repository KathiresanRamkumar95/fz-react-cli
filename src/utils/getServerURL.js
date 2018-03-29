let getServerURL = (protocol, serverInfo) => {
	let { host, locale, port } = serverInfo;

	if (locale) {
		return `${protocol}://${host}.${locale}.zohocorpin.com:${port}`;
	} 
	return `${protocol}://${host}:${port}`;
	
};

export default getServerURL;
