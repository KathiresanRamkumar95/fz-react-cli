import rimraf from 'rimraf';

let help = false;
let dashdash = false;
//eslint-disable-next-line array-callback-return
let args = process.argv.slice(2).filter(arg => {
	if (dashdash) {
		return !!arg;
	} else if (arg === '--') {
		dashdash = true;
	} else if (arg.match(/^(-+|\/)(h(elp)?|\?)$/)) {
		help = true;
	} else {
		return !!arg;
	}
});

if (help || args.length === 0) {
	// If they didn't ask for help, then this is not a "success"
	// eslint-disable-next-line no-console
	let log = help ? console.log : console.error;
	log('Usage: rimraf <path> [<path> ...]');
	log('');
	log('  Deletes all files and folders at "path" recursively.');
	log('');
	log('Options:');
	log('');
	log('  -h, --help    Display this usage info');
	process.exit(help ? 0 : 1);
} else {
	go(0);
}

let go = n => {
	if (n >= args.length) {
		return;
	}
	rimraf(args[n], er => {
		if (er) {
			throw er;
		}
		go(n + 1);
	});
};
