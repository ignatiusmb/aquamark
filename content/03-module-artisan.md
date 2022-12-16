---
title: Module / Artisan
---

### transform

This isn't usually necessary, but in case you want to handle the markdown parsing and rendering by yourself, here's how you can tap into the `transform` function provided by the module.

```typescript
export interface Dataset {
  language?: string;
  lineStart?: number;
  title?: string;
}

export function transform(source: string, dataset: Dataset): string;
```

A simple example would be passing a raw source code as a string.

```javascript
import { transform } from 'marqua/artisan'

const source = `
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 0,
  name: 'User'
}
`;

transform(source, { language: 'typescript' });
```

### marker

The artisan module also exposes the `marker` import that is a markdown-it object.

```javascript
import { marker } from 'marqua/artisan';
import plugin from 'markdown-it-plugin'; // some markdown-it plugin
marker.use(plugin); // add this before calling 'compile' or 'traverse'
```

Importing `marker` to extend with plugins is optional, it is usually used to enable you to write [LaTeX](https://www.latex-project.org/) in your markdown for example, which is useful for math typesetting and writing abstract symbols using TeX functions. Here's a working example with a plugin that uses [KaTeX](https://katex.org/).

```javascript
import { marker } from 'marqua/artisan';
import { compile } from 'marqua';
import TexMath from 'markdown-it-texmath';
import KaTeX from 'katex';

marker.use(TexMath, {
  engine: KaTeX,
  delimiters: 'dollars',
});

const data = compile(/* source path */);
```
