import type { Schema } from '../content.json/+server';
import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	const res = await fetch('/docs/content.json');
	// @ts-ignore - see what this results in
	if (!res.ok) error(res.status, res.statusText);

	const { items, metadata }: Schema = await res.json();
	const docs = items.find(({ slug }) => slug === params.slug);
	if (!docs) error(404, "Sorry, we can't find that page");

	return {
		title: docs.title,
		slug: docs.slug,
		path: docs.path,
		content: docs.content,
		flank: docs.flank,
		pages: metadata.pages,
		meta: {
			title: docs.title,
			description: 'The framework to manage your static content',
		},
	};
}
