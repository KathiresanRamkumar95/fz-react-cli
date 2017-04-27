#!/usr/bin/env node
var spawn = require('cross-spawn');
var script = process.argv[2];
var args = process.argv.slice(3);
var fs = require('fs');
var path = require('path')

//var appPath = fs.realpathSync(process.cwd())

switch (script) {
	case 'start':
		var result = spawn.sync(
	    'node',
	    [require.resolve('../lib/server/server')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	break;
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
	case 'sstest':
		var result = spawn.sync(
	    'node',
	    [require.resolve('../lib/server/ssServer')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	break;
	case "build:component":
	

	var result = spawn.sync(
	'cross-env',
	[
		"BABEL_ENV=commonjs", 
		'babel',
		"src",
		"--out-dir",
		"lib",
		"--presets=babel-preset-es2015/lib/index.js,babel-preset-react/lib/index.js", 
		"--copy-files"
	].concat(args),
	{stdio: 'inherit'});
	process.exit(result.status);	

	break;
	case "build:component:umd":
		var result = spawn.sync(
		    'webpack',
		    [
		    "--config",
		    require.resolve('../lib/config/webpack.component.build.config.js')
		    ].concat(args),
		    {stdio: 'inherit'}
	  	);  
	  	process.exit(result.status);
	break;
	case "build":
		var result = spawn.sync(
		    'webpack',
		    [
		    "--config",
		    require.resolve('../lib/config/webpack.prod.config.js')
		    ].concat(args),
		    {stdio: 'inherit'}
	  	);  
	  	process.exit(result.status);
	break;
	case "test":
		var appPath = fs.realpathSync(process.cwd())
		var result = spawn.sync(
	    'node',
	    [require.resolve('../lib/test')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	break;
	case "publish:report":
		var appPath = fs.realpathSync(process.cwd())
		var result = spawn.sync(
	    'sh',
	    [path.join(__dirname,'..','reportpublish.sh')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	break;
	default:
	  console.log('Unknown script "' + script + '".');
	  break;
}

