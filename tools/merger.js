#!/usr/bin/env node

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
const path = require('path');
const s_json = require('sort-json'); //json-keys-sort

const options = { ignoreCase: false, reverse: false, depth: 1};

const base_path = __dirname || process.cwd();
const target_path = path.resolve(base_path + '\\..\\data\\json\\');
const target_ext = '.json';

const local_debug = Boolean ( 1 );
const local_verbose = Boolean ( 0 );


function read_files(target_path) {
	let _out = {
		"meta": {
			"key_min": 9999,
			"key_max": 0
		},
		"data": {}
	};
	let _names = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext);
	if (local_debug) console.log('_names:', _names);

	let _content = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext)
		.map(name => require(path.join(target_path, name)));
	if (local_verbose) console.log('_content:', _content);

	for (let i = 0; i < _names.length; i++) {
		const id = _names[i].split('.')[0];
		_out["data"][id] = _content[i];
		const id_int = parseInt(id);
		if (id_int < _out["meta"]["key_min"]) _out["meta"]["key_min"] = id_int;
		if (id_int > _out["meta"]["key_max"]) _out["meta"]["key_max"] = id_int;
	}
	return _out;
}

async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path:', target_path);
	console.log('target_ext:', target_ext);

	const _out = read_files(target_path);
	console.log('read_files (1) (meta):', _out["meta"]);
	if (local_verbose) console.log('read_files (1) (data):', _out["data"]);

	const _out2 = read_files(target_path + '\\outsourcing\\');
	console.log('read_files (2) (meta):', _out2["meta"]);
	if (local_verbose) console.log('read_files (2) (data):', _out2["data"]);

	//sorted_json = JSON.dumps(_out2, sort_keys = true)
	var stringified = JSON.stringify(_out2["data"], null, "\t");
	await fs.writeFileSync(target_path + '\\_data.json', stringified, {encoding: 'utf8'}, (err) => err && console.error(err));

	//for (let project_id in _out2["data"]) {
	//	fs.appendFile(target_path + '\\_data.json', JSON.stringify({project_id: _out2["data"][project_id]}, null, "\t"), {encoding: 'utf8'}, (err) => err && console.error(err));
	//}

	await s_json.overwrite(target_path + '\\_data.json', options);
	//await fs.writeFileSync(target_path + '\\_data.json', json_ks.sort(_out2["data"], true), {encoding: 'utf8'}, (err) => err && console.error(err));
	//console.log(json_ks.sort(_out2["data"], true))

}


if (require.main === module) {main()} else {main};

