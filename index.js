// index.js — canon-paper: fetch a single paper + its body from the Live Canon.
//
//   const p = await paper(470);
//   console.log(p.title, p.body.excerpt);

const DEFAULT_BASE = 'https://live-canon.superinstance.dev';

async function canonFetch(base, path, params) {
  const url = new URL(path, base || DEFAULT_BASE);
  for (const [k, v] of Object.entries(params || {})) {
    if (v != null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`canon HTTP ${res.status}: ${res.statusText} (${url.toString()})`);
  }
  return res.json();
}

async function paper(num, options = {}) {
  if (!num || typeof num !== 'number' && isNaN(parseInt(num, 10))) {
    throw new TypeError('paper(num) requires a numeric paper number');
  }
  const n = parseInt(num, 10);
  const data = await canonFetch(options.base, '/api/canon', {});
  const papers = data.papers || data;
  const p = papers.find(x => x.number === n);
  if (!p) {
    return { error: `paper-${n} not found`, number: n };
  }
  // Try to fetch the body too
  let body = null;
  try {
    body = await canonFetch(options.base, `/api/canon/body/${n}`, {});
  } catch (e) {
    body = null;
  }
  return {
    ...p,
    body: body || null,
  };
}

async function listPapers(options = {}) {
  const data = await canonFetch(options.base, '/api/canon', {});
  return data.papers || data;
}

async function papersByAuthor(author, options = {}) {
  const all = await listPapers(options);
  return all.filter(p => (p.title || '').toLowerCase().includes(author.toLowerCase()));
}

async function papersByPhase(phase, options = {}) {
  const all = await listPapers(options);
  return all.filter(p => p.phase === phase);
}

async function papersByFNumber(f, options = {}) {
  const all = await listPapers(options);
  return all.filter(p => p.f_number === f);
}

module.exports = { paper, listPapers, papersByAuthor, papersByPhase, papersByFNumber, DEFAULT_BASE };
