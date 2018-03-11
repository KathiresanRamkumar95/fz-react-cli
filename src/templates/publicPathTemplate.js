import queryString from 'querystring';

let options = queryString.parse(__resourceQuery.slice(1));

if (!__DEVELOPMENT__) {
	global.setPublicPath = function(webpackRequireFun) {
		webpackRequireFun.p = `${global.staticDomain[options.js]}`;
	};
}
