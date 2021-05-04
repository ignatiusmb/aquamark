import { forge, compile, traverse } from '../../src';
import { expectAssignable, expectType } from 'tsd';

type FileOptions = Parameters<typeof compile>[0];
type DirOptions = Parameters<typeof traverse>[0];

expectAssignable<FileOptions>(forge.compile({ entry: '' }));
expectAssignable<FileOptions>(forge.compile({ entry: '', minimal: true }));
expectAssignable<FileOptions>(forge.compile({ entry: '', minimal: false }));
expectAssignable<FileOptions>(forge.compile({ entry: '', minimal: true, exclude: [] }));
expectAssignable<FileOptions>(forge.compile({ entry: '', minimal: false, exclude: [] }));

expectAssignable<DirOptions>(forge.traverse({ entry: '' }));
expectAssignable<DirOptions>(forge.traverse({ entry: '', recurse: true }));
expectAssignable<DirOptions>(forge.traverse({ entry: '', recurse: false }));
expectAssignable<DirOptions>(forge.traverse({ entry: '', recurse: true, extensions: [] }));
expectAssignable<DirOptions>(forge.traverse({ entry: '', recurse: false, extensions: [] }));

expectType<{ entry: string; minimal: true }>(forge.compile({ entry: '', minimal: true }));
expectType<{ entry: ''; minimal: true }>(forge.compile({ entry: '', minimal: true }));
expectType<{ entry: ''; minimal: false }>(forge.compile({ entry: '', minimal: false }));

expectType<{ entry: string; recurse: true }>(forge.traverse({ entry: '', recurse: true }));
expectType<{ entry: ''; recurse: true }>(forge.traverse({ entry: '', recurse: true }));
expectType<{ entry: ''; recurse: false }>(forge.traverse({ entry: '', recurse: false }));
