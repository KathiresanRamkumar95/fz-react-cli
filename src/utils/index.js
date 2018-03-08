export { default as getOptions } from './getOptions';
export { default as setOptions } from './setOptions';
export { default as requireOptions } from './requireOptions';
export { default as createEventStream } from './createEventStream';

export let log = (...info) => {
	let print = console;
	print(...info);
};
