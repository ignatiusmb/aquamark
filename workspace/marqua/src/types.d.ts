import type { parse } from './core/index.js';

type Primitives = string | boolean | null;

export interface FrontMatter {
	[key: string]: Primitives | Primitives[] | FrontMatter | FrontMatter[];
}

export interface HydrateChunk {
	breadcrumb: string[];
	buffer: Buffer;
	parse: typeof parse;
}

export interface Metadata {
	estimate: number;
	table: MarquaTable[];
}

export interface MarquaData {
	type: string;
	title: string;
	body: string | MarquaData[];
}

export interface MarquaTable {
	id: string;
	level: number;
	title: string;
}
