#!/usr/bin/env node

'use strict';

// node ".\tools\dot_parser.js"

//import { parse } from 'ts-graphviz/ast';
const ast = require('ts-graphviz/ast');

// https://github.com/ts-graphviz/ts-graphviz#ts-graphvizast-module-
function parse_example(_in) {
	const _ast = ast.parse(_in);
	return _ast;
}

async function main() {
	console.clear();
	console.log('Hi');

	const example = `
		digraph example {
			node1 [
				label = "My Node",
			]
		}
	`;
	console.log('parse:', parse_example(example));

	console.log('Bye');
}


if (require.main === module) {main()} else {main};

