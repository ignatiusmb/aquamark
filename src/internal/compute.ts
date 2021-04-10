import type { MarquaTable } from './types';
import { separators } from './helper';

export function id(title: string): string {
	title = title.toLowerCase().replace(separators, '-');
	return title.replace(/-+/g, '-').replace(/^-*(.+)-*$/, '$1');
}

export function readTime(content: string): number {
	const paragraphs = content.split('\n').filter(
		(p) => !!p && !/^[!*]/.test(p) // remove empty and not sentences
	);
	const words = paragraphs.reduce((acc, cur) => {
		if (/^[\t\s]*<.+>/.test(cur.trim())) return acc + 1;
		return acc + cur.split(' ').filter((w) => !!w && /\w|\d/.test(w) && w.length > 2).length;
	}, 0);
	const images = content.match(/!\[.+\]\(.+\)/g);
	const total = words + (images || []).length * 12;
	return Math.round(total / 240) || 1;
}

export function table(content: string) {
	const lines: RegExpMatchArray[] = [];
	const counter = [0, 0, 0];
	for (const line of content.split('\n')) {
		const match = line.trim().match(/^(#{2,4}) (.+)/);
		if (match) lines.push(match), counter[match[1].length - 2]++;
	}
	const alone =
		(counter[0] && !counter[1] && !counter[2]) ||
		(!counter[0] && counter[1] && !counter[2]) ||
		(!counter[0] && !counter[1] && counter[2]);

	return lines.reduce((table: MarquaTable[], [, signs, title]) => {
		title = title.replace(/\[(.+)\]\(.+\)/g, '$1');
		title = title.replace(/`(.+)`/g, '$1');
		const content = { id: id(title), title };

		if (alone || (!counter[0] && signs.length === 3) || signs.length === 2) {
			table.push(content);
		} else if (table.length) {
			let parent = table[table.length - 1];
			if (!parent.sections) parent.sections = [];
			if ((!counter[0] && signs.length === 4) || signs.length === 3) {
				parent.sections.push(content);
			} else if (counter[0] && parent.sections.length && signs.length === 4) {
				parent = parent.sections[parent.sections.length - 1];
				if (!parent.sections) parent.sections = [content];
				else parent.sections.push(content);
			}
		}
		return table;
	}, []);
}
