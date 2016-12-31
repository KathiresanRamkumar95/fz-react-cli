#!/usr/bin/env node
var spawn = require('cross-spawn');
var script = process.argv[2];
var args = process.argv.slice(3);
//var appPath = fs.realpathSync(process.cwd())
switch (script) {
	case 'docs':
		var result = spawn.sync(
	    'node',
	    [require.resolve('../lib/server/docsServer')].concat(args),
	    {stdio: 'inherit'}
	  );
	  process.exit(result.status);
	  break;
	default:
	  console.log('Unknown script "' + script + '".');
	  console.log('Perhaps you need to update react-scripts?');
	  break;
}

