#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const base_path = __dirname || process.cwd();
const target_path = path.resolve(base_path + '\\..\\data\\json\\outsourcing\\');

async function main() {
	console.clear();
	console.log('Hi');

	let _names = fs.readdirSync(target_path)
		//.filter(item => !item.isDirectory())
		.filter(name => path.extname(name) === '.json')
		.filter(name => name.split(".")[0].length == 3);
	for(var p in _names) {
		fs.rename(target_path + '\\' + _names[p].split(".")[0] + '.' + _names[p].split(".")[1], target_path + '\\' + '0' + _names[p].split(".")[0] + '.' + _names[p].split(".")[1], function(err) {
			if ( err ) console.log('ERROR: ' + err);
		});
	}

}


if (require.main === module) {main()} else {main};

