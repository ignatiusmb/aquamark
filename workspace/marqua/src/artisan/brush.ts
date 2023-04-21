import { getHighlighter } from 'shiki';
import { escape, generate } from '../utils.js';

export interface Dataset {
	lang?: string;
	file?: string;
	[data: string]: string | undefined;
}

export const highlighter = await getHighlighter({ theme: 'github-dark' });

export function transform(source: string, dataset: Dataset) {
	const { codeToThemedTokens } = highlighter;
	const { file, ...rest } = dataset;

	let highlighted = '';
	let line = +(rest['line-start'] || 1);
	for (const tokens of codeToThemedTokens(source, rest.lang)) {
		let code = `<code data-line="${line++}">`;
		for (const { content, color } of tokens) {
			const style = color ? `style="color: ${color}"` : '';
			code += `<span ${style}>${escape(content)}</span>`;
		}
		highlighted += `${code}</code>\n`;
	}

	rest.language = dataset.lang || ''; // fallback for HTML attribute
	const attrs = Object.entries(rest).map(([k, v]) => `data-${k}="${v || ''}"`);

	// needs to be /^<pre/ to prevent added wrapper from markdown-it
	return `<pre data-mrq="block" class="mrq">
	<header
		data-mrq="header"
		${attrs.join('\n\t\t')}
		class="mrq ${file ? '' : 'empty'}"
	>${file ? `<span>${file}</span>` : ''}
		<div data-mrq="toolbar" class="mrq">
			${generate.icon('list', 'Toggle\nNumbering')}
			${generate.icon('clipboard', 'Copy')}
		</div>
	</header>

	<div
		data-mrq="pre"
		${attrs.join('\n\t\t')}
		class="mrq language-${rest.lang || 'none'}"
	>${highlighted.trim()}</div>
</pre>`;
}
