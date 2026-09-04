const { paper, listPapers, papersByFNumber, DEFAULT_BASE } = require('../index.js');

async function run() {
  console.log('canon-paper self-test');
  console.log('  base:', DEFAULT_BASE);

  // paper 474 = F165, which is highly cited and is the most-cited F# when claiming "F161"
  const p = await paper(474);
  console.log('  paper 474:', p.title);
  if (p.error) throw new Error('expected paper 474 to exist');
  if (!p.body) {
    console.log('    (no body, ok — claim endpoint may have returned a different paper)');
  } else {
    console.log('    body excerpt len:', p.body.excerpt.length);
  }

  const all = await listPapers();
  console.log('  total papers:', all.length);
  if (all.length < 70) throw new Error('expected at least 70 papers');

  const f168 = await papersByFNumber(168);
  console.log('  F168 papers:', f168.length, '-', f168[0]?.title?.slice(0, 50));
  if (f168.length < 1) throw new Error('expected at least 1 F168 paper');

  console.log('  ✓ all checks passed');
}

run().catch(err => {
  console.error('  ✗ test failed:', err.message);
  process.exit(1);
});
