import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, makeScreenDriver, box } from '../src';

let screen = blessed.screen({ smartCSR: true, useBCE: true });

let ClickableBox = clicked => box({
	top: 'center', left: 'center',
	width: 20, height: 3,
	align: 'center', valign: 'middle',
	tags: true,
	content: `{bold}${ clicked ? 'Clicked' : 'Click Me!' }{/bold}`,
	fg: 'white',
	bg: clicked ? '#e66' : '#6e6',
	id: 'Button',
	clickable: true
});

run(({ screen: { on } }) => {
	let clicks$ = on('element click')
		.filter(box => box.options.id === 'Button')
		.scan(() => true).startWith(false);

	return {
		term: clicks$.map(ClickableBox),
		exit: on('key C-c')
	};
}, {
	term: makeTermDriver(screen),
	screen: makeScreenDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});