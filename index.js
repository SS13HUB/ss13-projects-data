
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

const fs = require('fs');
const path = require('path'); //base_path = path.resolve();
const base_path = process.cwd();
const target = base_path + '\\data\\'

function init() {
	let _names = fs.readdirSync(target)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === '.json');
	let _content = fs.readdirSync(target)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === '.json')
		.map(name => require(path.join(target, name)));
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

	const jsonData = require(base_path + '\\data\\000.json');
	console.log(jsonData);
}

//main();
console.log(init());
