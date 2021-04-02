import type { HydrateFn } from './types';
import { join } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { isExists } from 'mauss/guards';
import { compareString } from './helper';
import { contentParser, countReadTime, extractMeta, generateTable, traverseCompare } from './utils';
import marker from './marker';

export function parseFile<I, O = I>(pathname: string, hydrate: HydrateFn<I, O>): O;
export function parseFile<I, O = I>(pathname: string, hydrate: HydrateFn<I, O>): O | undefined {
	const content = readFileSync(pathname, 'utf-8').trim();
	const match = content.match(/---\r?\n([\s\S]+?)\r?\n---/);
	const [filename] = pathname.split(/[/\\]/).slice(-1);

	const metadata = extractMeta((match && match[1].trim()) || '');
	const sliceIdx = match ? (match.index || 0) + match[0].length + 1 : 0;
	const article = !match ? content : content.slice(sliceIdx);
	metadata.toc = generateTable(article);
	metadata.read_time = countReadTime(article);
	const result = <typeof metadata>hydrate({ frontMatter: <I>metadata, content: article, filename });
	if (!result) return;

	if (result.date && result.date.published && !result.date.updated) {
		result.date.updated = result.date.published;
	}

	if (result.content) {
		const { content, ...rest } = result;
		result.content = contentParser(rest, content);
		result.content = marker.render(result.content);
	}
	return result as O;
}

export function parseDir<I, O extends Record<string, any> = I>(
	options: string | { dirname: string; extensions?: string[] },
	hydrate: HydrateFn<I, O>
): Array<O> {
	const { dirname, extensions = ['.md'] } =
		typeof options === 'string' ? { dirname: options } : options;
	if (!existsSync(dirname)) throw new Error(`Pathname ${dirname} does not exists!`);
	return readdirSync(dirname)
		.filter((name) => !name.startsWith('draft.') && extensions.some((ext) => name.endsWith(ext)))
		.map((filename) => parseFile(join(dirname, filename), hydrate))
		.filter(isExists)
		.sort((x, y) => {
			if (x.date && y.date) {
				if (typeof x.date === 'string' && typeof y.date === 'string')
					if (x.date !== y.date) return compareString(x.date, y.date);
				const { updated: xu = '', published: xp = '' } = x.date;
				const { updated: yu = '', published: yp = '' } = y.date;
				if (xu && yu && xu !== yu) return compareString(xu, yu);
				if (xp && yp && xp !== yp) return compareString(xp, yp);
			}
			return traverseCompare(x, y);
		});
}
