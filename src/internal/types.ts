export interface DirOptions {
	dirname: string;
	extensions?: Array<string>;
}

export interface FileOptions {
	pathname: string;
	minimal?: boolean;
	exclude?: Array<string>;
}

export interface HydrateFn<I, O = I> {
	(data: { frontMatter: I; content: string; filename: string }): O | undefined;
}

export interface MarquaData extends Record<string, any> {
	date?: { published?: string | Date; updated?: string | Date };
	toc: Array<{ id: string; cleaned: string }>;
	read_time: number;
	content?: string;
}

export interface MarquaTable {
	id: string;
	title: string;
	sections?: Array<this>;
}
