import type { MarquaTable } from '../types.js';
import { generate } from '../utils.js';

export function parse(source: string) {
	const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(source);
	const crude = source.slice(match ? match.index + match[0].length + 1 : 0);
	const memory = construct((match && match[1].trim()) || '') as Record<string, any>;

	return {
		content: inject(crude, memory),
		metadata: Object.assign(memory, {
			/** estimated reading time */
			get estimate() {
				const paragraphs = crude.split('\n').filter(
					(p) => !!p && !/^[!*]/.test(p) // remove empty and not sentences
				);
				const words = paragraphs.reduce((total, line) => {
					if (/^[\t\s]*<.+>/.test(line.trim())) return total + 1;
					const accumulated = line.split(' ').filter((w) => !!w && /\w|\d/.test(w) && w.length > 1);
					return total + accumulated.length;
				}, 0);
				const images = /!\[.+\]\(.+\)/g.exec(crude);
				const total = words + (images || []).length * 12;
				return Math.round(total / 240) || 1;
			},

			/** table of contents */
			get table() {
				const table: MarquaTable[] = [];
				for (const line of crude.split('\n')) {
					const match = /^(#{2,4}) (.+)/.exec(line.trim());
					if (!match) continue;

					const [, h, title] = match;

					table.push({
						id: generate.id(title),
						level: h.length,
						title: title.replace(/\[\]/g, ''),
						sections: [],
					});
				}

				return table;
			},
		}),
	};
}

type Primitives = null | boolean | string;
type FrontMatter = { [key: string]: Primitives | Primitives[] | FrontMatter | FrontMatter[] };
export function construct(raw: string, memo: Record<string, any> = {}): FrontMatter[string] {
	const indent = indentation(raw);
	if (!/[:\-\[\]|#]/gm.test(raw)) {
		return indent > 1 ? dedent(raw) : coerce(raw.trim());
	}
	if (indent <= 1) raw = raw.trimStart();
	if (/^(".*"|'.*')$/.test(raw.trim())) {
		return raw.trim().slice(1, -1);
	}

	const PATTERN = /(^[^:\s]+):(?!\/)\n?([\s\S]*?(?=^\S)|[\s\S]*$)/gm;
	let match: null | RegExpExecArray;
	while ((match = PATTERN.exec(raw))) {
		const [, key, value] = match;
		const i = indentation(value);
		const data = construct(i ? dedent(value) : value, memo[key]);
		if (Array.isArray(data) || typeof data !== 'object') memo[key] = data;
		else memo[key] = { ...memo[key], ...data };
	}

	if (Object.keys(memo).length) return memo;

	const cleaned = raw.replace(/#.*$/gm, '').trim();
	switch (cleaned[0]) {
		case '-': {
			const sequence = cleaned.split('-').filter((v) => v);
			type Possibly = Primitives & FrontMatter; // what the ...?
			return sequence.map((v) => construct(dedent(v)) as Possibly);
		}
		case '[': {
			const pruned = cleaned.slice(1, -1);
			return pruned.split(',').map(coerce);
		}
		case '|': {
			return dedent(cleaned.slice(1).replace('\n', ''));
		}
		default: {
			return coerce(cleaned.trim());
		}
	}
}

// ---- internal functions ----

function coerce(u: string) {
	const v = u.trim(); // argument can be passed as-is
	const map = { true: true, false: false, null: null };
	if (v in map) return map[v as keyof typeof map];
	// if (!Number.isNaN(Number(v))) return Number(v);
	return /^(".*"|'.*')$/.test(v) ? v.slice(1, -1) : v;
}

function dedent(input: string) {
	const indent = indentation(input);
	const lines = input.split(/\r?\n/);
	return lines.map((l) => l.slice(indent)).join('\n');
}

function indentation(line: string) {
	return (/^\s*/.exec(line) || [''])[0].length;
}

function inject(source: string, metadata: Record<string, any>) {
	const plane = compress(metadata);
	return source.replace(/!{(.+)}/g, (s, c) => (c && plane[c]) || s);
}

function compress(metadata: Record<string, any>, parent = '') {
	const memo: typeof metadata = {};
	const prefix = parent ? `${parent}:` : '';
	for (const [k, v] of Object.entries(metadata)) {
		if (typeof v !== 'object') memo[prefix + k] = v;
		else Object.assign(memo, compress(v, k));
	}
	return memo;
}
