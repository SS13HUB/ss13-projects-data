
'use strict';

//const chalkMy = require(process.cwd() + "/src/chalk");
/* let jsonData = await fetch(base_path + '/data/000.json')
	.then((val) => {return [true, val.json()];})
	.catch((err) => {return [false, err];});
if (!jsonData[0]) console.log('Error:', jsonData[1]);
jsonData = jsonData[1];
if (jsonData == 'Error') {
	console.log('Error');
	process.exit();
}*/

//import jsdom from 'jsdom';
//import * as d3 from 'd3';

//const d3 = require("d3@v3"); //v3, not v7

const fs = require('fs');
const path = require('path'); //base_path = path.resolve();
const base_path = process.cwd();
const target_path = base_path + '\\data\\json\\';
const target_ext = '.json';


function init() {
	let _names = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext);
	console.log('_names:', _names);
	let _content = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext)
		.map(name => require(path.join(target_path, name)));
	console.log('_content:', _content);
	let _out = {};
	for (let i = 0; i < _names.length; i++) {
		const element = _names[i].split('.')[0];
		_out[element] = _content[i];
	}
	return _out;
}

async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path:', target_path);
	console.log('target_ext:', target_ext);

	const jsonData = require(target_path + '000' + target_ext);
	console.log('jsonData:', jsonData);
}

main();
console.log('_out:', init());
