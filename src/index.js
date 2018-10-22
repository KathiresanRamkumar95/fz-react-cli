var spawn = require('cross-spawn');

import devConfig from './config/webpack.dev.config';
import docsConfig from './config/webpack.docs.config';
import prodConfig from './config/webpack.prod.config';
import startDocServer from './server/docsServer';

export default function (projectFolder,reactCliPath,script){
	switch(script){
		case "start":
		console.log("Not yet implemented");
		case "docs":
		startDocServer(projectFolder,reactCliPath);
	}
  	
}