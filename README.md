# @superinstance/canon-paper

Fetch individual papers from the Live Canon (https://live-canon.superinstance.dev).

```js
const { paper, listPapers, papersByFNumber } = require('@superinstance/canon-paper');

const p = await paper(470);
// { number: 470, title: "F161 — Conservation Laws...", f_number: 161, ... }

const all = await listPapers();
// [paper-408, paper-409, ...]  71 papers

const f168 = await papersByFNumber(168);
// [paper-477]  F168 papers only
```

## Self-test

```bash
npm test
```

Source: https://github.com/SuperInstance/canon-paper

MIT © Casey Digennaro
