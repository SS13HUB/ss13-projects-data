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
const path = require('path'); //base_path = path.resolve();
const base_path = __dirname || process.cwd();
const target_path = path.resolve(base_path + '\\data\\json');
const target_ext = '.json';

const local_debug = Boolean ( 0 );
const local_verbose = Boolean ( 1 );


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
		const id = _names[i].split('.')[0];
		_out[id] = _content[i];
	}
	return _out;
}

function data_lint(data) {
	let unaccepted = {};
	for (const [project_id, project_data] of Object.entries(data)) {
		let reason = '';
		if ((typeof project_data.name !== 'string') || (project_data.name.length == 0)) reason += 'name; ';
		if ( typeof project_data.relations !== 'object') reason += 'relations; '; // 'array'

		if ( typeof project_data.note !== 'string') reason += 'note; '; // || (relation.name.length == 0)
		if ( typeof project_data.meta !== 'object') reason += 'meta; ';

		if ( typeof project_data.meta.migrated_commit !== 'string') reason += 'meta.migrated_commit; '; //  || (relation.meta.migrated_commit == 0)

		if ((typeof project_data.meta.added_by !== 'string') || (project_data.meta.added_by == 0)) reason += 'meta.added_by; ';
		if ( typeof project_data.meta.add_date !== 'string') reason += 'meta.add_date; '; // || (relation.meta.add_date == 0)

		for (let i = 0; i < project_data.relations.length; i++) {
			const relation = project_data.relations[i];
			if ((typeof relation.name !== 'string') || (relation.name.length == 0)) reason += 'relation.name; ';
			if ((typeof relation.type !== 'string') || (!Array('parent', 'pin', 'red').includes(relation.type))) reason += 'relation.type; ';
			if ( typeof relation.note !== 'string') reason += 'relation.note; ';
			if ( typeof relation.meta !== 'object') reason += 'relation.meta; ';
			if ( typeof relation.meta.inherit_all !== 'boolean') reason += 'relation.meta.migrated_commit; ';
			if ( typeof relation.meta.migrated_commit !== 'string') reason += 'relation.meta.migrated_commit; ';
			if ((typeof relation.meta.added_by !== 'string') || (relation.meta.added_by == 0)) reason += 'relation.meta.added_by; ';
			if ( typeof relation.meta.add_date !== 'string') reason += 'relation.meta.add_date; ';
		}
		if (reason.length > 0) unaccepted[project_id] = {project_data, reason};
	}
	return unaccepted;
}

function get_score(data) {
	let score = {
		'adders': {},
		'relations_count': {}
	};
	for (const project_data of Object.values(data)) {
		//console.log("project_data", project_data);
		//if (!project_data.meta) console.log('No "Meta" field:', project_data);
		//if (!project_data.meta.added_by) console.log('No "Added by" field:', project_data);
		//if (!project_data.name) console.log('No "Added by" field:', project_data);

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
	return score;
}

// http://stackoverflow.com/a/25500462/8175291
function dict_sort(dict, keys_pos_inverted = true) {
	// Create items array
	var items = Object.keys(dict).sort().map((key) => {
		return [key, dict[key]];
	});

	// Sort the array based on the second element
	items.sort((first, second) => {
		return second[1] - first[1];
	});
	var items2 = [];
	if (keys_pos_inverted) {
		for (let i = 0; i < items.length; i++) {
			items2.push([items[i][1], items[i][0]]);
		}
		items2.sort((first, second) => {
			return second[1] - first[1];
		});
	} else {
		items2 = items;
	}


	// Create a new array with only the first 5 items
	//console.log(items.slice(0, 5));

	/* var dict_sorted = {}
	for (let i = 0; i < items.length; i++) {
		dict_sorted[items[i][0]] = items[i][1];
	}
	console.log(dict_sorted); */
	return items2;
}

async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path:', target_path);
	//console.log('target_ext:', target_ext);

	//const jsonData = require_project('000');
	//console.log('jsonData:', jsonData);

	const _out = read_files(target_path);
	if (local_verbose) console.log('read_files (1):', _out);

	const score = get_score(_out);
	if (local_verbose) console.log('get_score (1):', score);


	const _out2 = read_files(target_path + '\\outsourcing\\');
	const score2 = get_score(_out2);
	let score2_sorted = {'adders': dict_sort(score2.adders), 'relations_count': dict_sort(score2.relations_count)};
	console.log('get_score (2) sort:', score2_sorted);


	const unaccepted = data_lint(_out);
	console.log('unaccepted (read_files 1):', unaccepted);

	const unaccepted2 = data_lint(_out2);
	console.log('unaccepted (read_files 2):', unaccepted2);

}


if (require.main === module) {main()} else {main};

