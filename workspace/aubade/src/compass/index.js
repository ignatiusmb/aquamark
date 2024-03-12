import * as fs from 'fs';
import { marker } from '../artisan/index.js';
import { parse } from '../core/index.js';

/**
 * @template {object} Output
 * @param {string} entry
 * @returns {Output & import('../types.js').Metadata & { content: string }}
 */
export function visit(entry) {
	const { body, metadata } = parse(fs.readFileSync(entry, 'utf-8'));
	const result = { ...metadata, content: marker.render(body) };
	return /** @type {any} */ (result);
}

/**
 * @template {'all' | 'files' | 'directories'} T
 * @param {T} type
 * @param {string} entry
 * @returns {T extends 'all'
 * 		? import('../types.js').HydrateChunk['siblings'] : T extends 'files'
 * 		? import('../types.js').FileChunk[] : import('../types.js').DirChunk[]}
 */
export function scan(type, entry) {
	/** @type {import('../types.js').HydrateChunk['siblings']} */
	const entries = [];
	for (const name of fs.statSync(entry).isDirectory() ? fs.readdirSync(entry) : []) {
		const path = join(entry, name);
		/** @type {any} - trick TS to enable discriminated union */
		const stat = fs.statSync(path).isDirectory() ? 'directory' : 'file';
		if (type === 'files' && stat === 'directory') continue;
		if (type === 'directories' && stat === 'file') continue;
		entries.push({
			type: stat,
			path,
			breadcrumb: path.split(/[/\\]/).reverse(),
			get buffer() {
				return stat === 'file' ? fs.readFileSync(path) : void 0;
			},
		});
	}
	return /** @type {any} */ (entries);
}

/**
 * @param {string} entry
 * @param {{
 * 	depth?: number;
 * }} [options]
 */
export function traverse(entry, { depth: level = 0 } = {}) {
	const entries = scan('files', entry);
	for (const { path } of level ? scan('directories', entry) : []) {
		entries.push(...traverse(path, { depth: level - 1 }).files);
	}

	return {
		files: entries,

		/**
		 * Hydrate `files` scanned on to the shelf with the `load` function.
		 *
		 * @template {object} Output
		 * @param {(chunk: import('../types.js').HydrateChunk) => undefined | Output} load
		 * @param {(path: string) => boolean} [filter] files to process with `load`
		 * @returns {Output[]}
		 */
		hydrate(load, filter = (v) => v.endsWith('.md')) {
			const items = [];
			for (const { path, breadcrumb, buffer } of entries) {
				if (!filter(path)) continue;
				const item = load({
					breadcrumb,
					buffer,
					marker,
					parse,
					get siblings() {
						const parent = breadcrumb.slice(1).reverse();
						const tree = scan('all', parent.join('/'));
						return tree.filter(({ path: file }) => file !== path);
					},
				});
				item && items.push(item);
			}
			return items;
		},
	};
}

/**
 * adapted from https://github.com/alchemauss/mauss/pull/153
 * @param {string[]} paths
 */
function join(...paths) {
	if (!paths.length) return '.';
	const index = paths[0].replace(/\\/g, '/').trim();
	if (paths.length === 1 && index === '') return '.';
	const parts = index.replace(/[/]*$/g, '').split('/');
	if (parts[0] === '') parts.shift();

	for (let i = 1; i < paths.length; i += 1) {
		const part = paths[i].replace(/\\/g, '/').trim();
		for (const slice of part.split('/')) {
			if (slice === '.') continue;
			if (slice === '..') parts.pop();
			else if (slice) parts.push(slice);
		}
	}

	return (index[0] === '/' ? '/' : '') + parts.join('/');
}
