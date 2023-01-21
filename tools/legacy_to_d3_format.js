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
const target_path = path.resolve(base_path + '\\..\\data\\json');
const target_ext = '.json';

const local_debug = Boolean ( 1 );
const local_verbose = Boolean ( 1 );


function read_files(_target_path) {
	let _out = {
		"meta": {
			"key_min": 9999,
			"key_max": 0
		},
		"data": {}
	};
	let _names = fs.readdirSync(_target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext);
	if (local_debug) console.log('_names:', _names);

	let _content = fs.readdirSync(_target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext)
		.map(name => require(path.join(_target_path, name)));
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

function convert(legacy_input) {
	const example_legacy = {'0000': {
		"name": "Space Station 13",
		"relations": [{
			"name": "_root_",
			"type": "pin",
			"note": "",
			"meta": {
				"inherit_all": true,
				"migrated_commit": "",
				"added_by": "CthulhuOnIce",
				"add_date": ""
		}}],
		"note": "Original build.",
		"meta": {
			"migrated_commit": "f759e67563",
			"added_by": "CthulhuOnIce",
			"add_date": "2019-09-07T19:22:34Z"
	}}}
	const example_d3 = [{
		"id": '0001',
		"name": "Space Station 13",
		"parent": {
			"id": "0000",
			"details": {
				"type": "",
				"note": "",
				"migrated_commit": "",
				"added_by": "CthulhuOnIce",
				"add_date": ""
			}
		},
		"details": {
			"note": "Original build.",
			"migrated_commit": "f759e67563",
			"added_by": "CthulhuOnIce",
			"add_date": "2019-09-07T19:22:34Z"
		}}
	]
	let fancy_d3_format = [];
	const legacy_keys = Object.keys(legacy_input);
	for (let i = 0; i < legacy_keys.length; i++) {
		const legacy_project_id = legacy_keys[i];
		const legacy_project = legacy_input[legacy_project_id];
		console.log(legacy_project_id, legacy_project);
		fancy_d3_format.push(...[{
			"id": legacy_project_id,
			"name": legacy_project.name,
			"parent": {
				"id": ";___INSERT_ME_1___",
				"name": legacy_project.relations[0].name + ";___REPLACE_ME_1___",
				"details": {
					"type": legacy_project.relations[0].type,
					"note": legacy_project.relations[0].note,
					"migrated_commit": legacy_project.relations[0].meta.migrated_commit,
					"added_by": legacy_project.relations[0].meta.added_by,
					"add_date": legacy_project.relations[0].meta.add_date
				}
			},
			"details": {
				"note": legacy_project.note,
				"migrated_commit": legacy_project.meta.migrated_commit,
				"added_by": legacy_project.meta.added_by,
				"add_date": legacy_project.meta.add_date
			}
		}]);
	}
	return fancy_d3_format;
}

async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path:', target_path);
	console.log('target_ext:', target_ext);

	const _out1 = read_files(target_path);
	console.log('read_files (1) (meta):', _out1["meta"]);
	if (local_verbose) console.log('read_files (1) (data):', _out1["data"]);

	const convert1 = convert(_out1["data"]);
	console.log('convert (1):', convert1);

	var stringified = JSON.stringify(convert1, null, "\t");
	await fs.writeFileSync(path.resolve(target_path + '\\merged\\_fancy.json'), stringified, {encoding: 'utf8'}, (err) => err && console.error(err));


	process.exit(1);

	const _out2 = read_files(target_path + '\\outsourcing\\');
	console.log('read_files (2) (meta):', _out2["meta"]);
	if (local_verbose) console.log('read_files (2) (data):', _out2["data"]);

	//sorted_json = JSON.dumps(_out2, sort_keys = true)
	var stringified = JSON.stringify(_out2["data"], null, "\t");
	await fs.writeFileSync(path.resolve(target_path +  + '\\..\\merged\\_data.json'), stringified, {encoding: 'utf8'}, (err) => err && console.error(err));

	//for (let project_id in _out2["data"]) {
	//	fs.appendFile(path.resolve(target_path +  + '\\..\\merged\\_data.json'), JSON.stringify({project_id: _out2["data"][project_id]}, null, "\t"), {encoding: 'utf8'}, (err) => err && console.error(err));
	//}

	//await s_json.overwrite(path.resolve(target_path +  + '\\..\\merged\\_data.json'), options);
	//await fs.writeFileSync(path.resolve(target_path +  + '\\..\\merged\\_data.json'), json_ks.sort(_out2["data"], true), {encoding: 'utf8'}, (err) => err && console.error(err));
	//console.log(json_ks.sort(_out2["data"], true))

}


if (require.main === module) {main()} else {main};

