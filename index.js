
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

const local_debug = Boolean ( 0 );


function read_files(target_path) {
	let _out = {};
	let _names = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext);
	if (local_debug) console.log('_names:', _names);
	let _content = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === target_ext)
		.map(name => require(path.join(target_path, name)));
	if (local_debug) console.log('_content:', _content);
	for (let i = 0; i < _names.length; i++) {
		const element = _names[i].split('.')[0];
		_out[element] = _content[i];
	}
	return _out;
}

function get_score(data) {
	let score = {
		'adders': {},
		'relations_count': {}
	};
	for (const project_data of Object.values(data)) {
		if (!score.adders[project_data.meta.added_by]) score.adders[project_data.meta.added_by] = 0;
		if (!score.relations_count[project_data.name]) score.relations_count[project_data.name] = 0;
		score.adders[project_data.meta.added_by] += 1;
		score.relations_count[project_data.name] += 1;
		for (let ii = 0; ii < project_data.relations.length; ii++) {
			const relation = project_data.relations[ii];
			if (!score.adders[relation.meta.added_by]) score.adders[relation.meta.added_by] = 0;
			score.adders[relation.meta.added_by] += 1;
			if (!score.relations_count[relation.name]) score.relations_count[relation.name] = 0;
			score.relations_count[relation.name] += 1;
		}
	}
	if (score.adders['']) {
		score.adders['_Fill_Me_'] = score.adders[''];
		delete score.adders[''];
	}
	for (const [project_name, project_score] of Object.entries(score.relations_count)) {
		if (project_score < 2) delete score.relations_count[project_name];
	}
	return score
}

function require_project(project_id) {
	return require(target_path + project_id + target_ext) || false;
}

async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path:', target_path);
	console.log('target_ext:', target_ext);

	const jsonData = require_project('000');
	console.log('jsonData:', jsonData);

	let _out = read_files(target_path);
	console.log('_out:', _out);

	const score = get_score(_out);
	console.log('get_score 1:', score);

	let _out2 = read_files(target_path + 'outsourcing\\');
	const score2 = get_score(_out2);
	console.log('get_score 2:', score2);

}


if (require.main === module) {main()} else {main};

