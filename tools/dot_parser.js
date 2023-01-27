#!/usr/bin/env node

'use strict';

// node ".\tools\dot_parser.js"

//import { parse } from 'ts-graphviz/ast';
const ast = require('ts-graphviz/ast');
const path = require('path');
const fs = require('fs');

const base_path = __dirname || process.cwd();
const target_path = path.resolve(base_path + '\\..\\submodules\\SS13-Codebases\\src\\builds_all.dot');


// https://stackoverflow.com/a/6833016/8175291
async function readLines(input, func) {
	var remaining = '';

	input.on('data', function(data) {
		remaining += data;
		var index = remaining.indexOf('\n');
		while (index > -1) {
			var line = remaining.substring(0, index);
			remaining = remaining.substring(index + 1);
			func(line);
			index = remaining.indexOf('\n');
		}
	});

	input.on('end', function() {
		if (remaining.length > 0) {
			func(remaining);
		}
	});
}

function func(data) {
	console.log('Line: ' + data);
}


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
	//console.log('parse:', parse_example(example));


	//var input = fs.createReadStream(target_path);
	//await readLines(input, func);

	let file_content_raw = fs.readFileSync(target_path, 'utf8'); //.replaceAll('\n', '\\n')
	let file_content_arr = file_content_raw.split(/\r?\n|\r|\n/g); // https://stackoverflow.com/a/21712066/8175291
	console.log('file_content_arr.length:', file_content_arr.length);
	for (var i = 0; i < file_content_arr.length; i++) {
		// https://stackoverflow.com/a/1981837/8175291
		if (file_content_arr[i].includes('\\n')) {
			let _content = file_content_arr[i];
			console.log('> (\\n):', i, _content.trim().replaceAll(/  +/g, ' '));
			file_content_arr[i] = file_content_arr[i].replaceAll('\\n', '_n');
		}
		else if (file_content_arr[i].includes('\\')) {
			let _content = file_content_arr[i];
			console.log('> (\\):', i, _content.trim().replaceAll(/  +/g, ' '));
			file_content_arr[i] = file_content_arr[i].replaceAll('\\', '_');
		}
	}
	file_content_raw = file_content_arr.join('\n');

	console.log('readFileAsync:', file_content_raw);
	console.log('parse:', parse_example(file_content_raw));

	console.log('Bye');
}


if (require.main === module) {main()} else {main};

