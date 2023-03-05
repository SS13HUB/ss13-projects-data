#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const base_path = __dirname || process.cwd();
const target_path1 = path.resolve(base_path + '\\..\\data\\semiauto_part1.dot');
const target_path2 = path.resolve(base_path + '\\..\\data\\semiauto_part2.json');

const local_debug = Boolean ( 0 );
const local_verbose = Boolean ( 0 );


async function main() {
	console.clear();
	console.log('Hi');

	console.log('base_path:', base_path);
	console.log('target_path1:', target_path1);
	console.log('target_path2:', target_path2);

	let data = fs.readFileSync(target_path1, {encoding: 'utf8', flag: 'r'});
	data = data.replaceAll('\r', '').split('\n');
	let data_out = [];

	// https://stackoverflow.com/a/18159249/8175291
	for (let i = 0; i < data.length; i++) {
		if (!data[i].includes("->")) continue;
		if (data[i].trim().startsWith("//")) continue;

		let tmp = data[i]
			.trim()
			//.replaceAll('  ', ' ')
			//.replaceAll(' ', '')
			.replace(/\s+/g, ' ')
			.replace(' -> ', '; ')
			.replace(' // ', '; "')
			.split('; ');
		for (let ii = 0; ii < tmp.length; ii++) {
			let tmp_str = Array.from(tmp[ii]);
			let tmp_clean = false;
			if (tmp[ii].includes('[')) {
				console.log('cleaning:', tmp[ii]);
				tmp[ii] = tmp[ii].split(' [')[0];
				tmp_str = Array.from(tmp[ii]);
				tmp_clean = true;
			}
			if (tmp_str[0] == '"') {
				tmp[ii] = tmp[ii].slice(1);
			}
			if (tmp_str[tmp_str.length-1] == '"') {
				tmp[ii] = tmp[ii].slice(0, -1);
			}
			if (tmp_clean) {
				console.log('result:   ', tmp[ii]);
			}
		}
		data_out.push({
			"parrent": tmp[0],
			"name": tmp[1],
			"notes": (tmp.length > 3 ? tmp.slice(2, tmp.length) : tmp[2])
		});
	}

	//console.log('data_out:', data_out);

	fs.writeFileSync(target_path2, JSON.stringify(data_out, null, '\t'), 'utf8');

	console.log('bye');
	return 0;
}


if (require.main === module) {main()} else {main};

