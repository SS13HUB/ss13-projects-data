#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const base_path = __dirname || process.cwd();
const target_path1 = path.resolve(base_path + '\\..\\data\\semiauto_edges.dot');
const target_path2 = path.resolve(base_path + '\\..\\data\\semiauto_edges.json');

const local_debug = Boolean ( 0 );
const local_verbose = Boolean ( 0 );


async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path1:', target_path1);
	console.log('target_path2:', target_path2);

	// projects in dot
	let projs_dot = fs.readFileSync(target_path1, {encoding: 'utf8', flag: 'r'});
	projs_dot = projs_dot.replaceAll('\r', '').split('\n');
	let projs_dict = [];

	// https://stackoverflow.com/a/18159249/8175291
	for (let i = 0; i < projs_dot.length; i++) {
		if (!projs_dot[i].includes("->")) continue;
		if (projs_dot[i].trim().startsWith("///")) continue;
		if (projs_dot[i].trim().startsWith("//")) continue;

		// single project
		let proj_arr = projs_dot[i]
			.trim()
			//.replaceAll('  ', ' ')
			//.replaceAll(' ', '')
			.replace(/\s+/g, ' ')
			.replace(' -> ', '; ')
			.replace(' // ', '; "')
			.split('; ');
		for (let ii = 0; ii < proj_arr.length; ii++) {
			let proj_str = Array.from(proj_arr[ii]);
			let proj_clean = false;
			if (proj_arr[ii].includes('[')) {
				console.log('cleaning:', proj_arr[ii]);
				proj_arr[ii] = proj_arr[ii].split(' [')[0];
				proj_str = Array.from(proj_arr[ii]);
				proj_clean = true;
			}
			if (proj_str[0] == '"') {
				proj_arr[ii] = proj_arr[ii].slice(1);
			}
			if (proj_str[proj_str.length - 1] == '"') {
				proj_arr[ii] = proj_arr[ii].slice(0, -1);
			}
			if (proj_clean) {
				console.log('result:   ', proj_arr[ii]);
			}
		}
		projs_dict.push({
			"parent": proj_arr[0],
			"name": proj_arr[1],
			"notes": (proj_arr.length > 3 ? JSON.stringify(proj_arr.slice(2, proj_arr.length)) : proj_arr[2])
		});
		//
	}

	//console.log('projs_dict:', projs_dict);

	fs.writeFileSync(target_path2, JSON.stringify(projs_dict, null, '\t'), 'utf8');

	console.log('bye');
	return 0;
}


if (require.main === module) {main()} else {main};

