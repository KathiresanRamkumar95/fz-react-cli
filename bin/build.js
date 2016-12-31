#!/usr/bin/env node
var spawn = require('cross-spawn');
var script = process.argv[2];
var args = process.argv.slice(3);
var fs = require('fs');
var path = require('path')
//var appPath = fs.realpathSync(process.cwd())

switch (script) {

	case 'clean':
	var appPath = fs.realpathSync(process.cwd())
	args=args.map((arg)=>path.join(appPath,arg))
	var result = spawn.sync(
	    'node',
	    [require.resolve('../lib/clean')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	break;
	case 'docs':
		var result = spawn.sync(
	    'node',
	    [require.resolve('../lib/server/docsServer')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	break;
	case "build:component":
	var fzNodeModulesFolder =path.resolve(__dirname,'..','node_modules');

	var result = spawn.sync(
	path.resolve(fzNodeModulesFolder,'.bin/cross-env'),
	[
		"BABEL_ENV=commonjs", 
		path.resolve(fzNodeModulesFolder,".bin/babel"),
		"src --out-dir lib",
		"--presets="+path.resolve(fzNodeModulesFolder,'babel-preset-es2015/lib/index.js')+","+path.resolve(fzNodeModulesFolder,"babel-preset-react/lib/index.js"), 
		"--copy-files"
	].concat(args),
	{stdio: 'inherit'});
	process.exit(result.status);

	break;
	case "build:component:umd":
		var result = spawn.sync(
		    require.resolve('../node_modules/.bin/webpack'),
		    [
		    "--config",
		    require.resolve('../lib/config/webpack.component.build.config.js')
		    ].concat(args),
		    {stdio: 'inherit'}
	  	);  
	  	process.exit(result.status);
	break;
	default:
	  console.log('Unknown script "' + script + '".');
	  console.log('Perhaps you need to update react-scripts?');
	  break;
}

