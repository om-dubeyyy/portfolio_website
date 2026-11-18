/* omdubey.com · the page as plain Markdown.
   Used by the Agent view (the { } button, or omdubey.com/#agent) and by _tools/site/build.mjs,
   which writes the same text to /om-dubey.md, so both always say the same thing. */
(function (g) {
  'use strict';
  g.OM_MD = function (C) {
    const D = C.person, L = [];
    L.push('# Om Dubey', '', `${D.role} at ${D.company} · ${D.city}`, `${D.tagline} ${D.oneLiner} ${D.self}`, '');
    L.push('## Links', `- Website: ${C.site}`, `- Email: ${C.email}`);
    D.links.forEach(([k, v]) => L.push(`- ${k}: ${v}`));
    L.push(`- Languages: ${D.languages.join(', ')}`, '');
    L.push('## Now', `${D.role} at ${D.company} (${D.companyUrl}), since ${D.since}.`, `What ${D.company} does: ${D.lucidity}`);
    if (D.nowNote) L.push(D.nowNote);
    L.push('');
    L.push('## Experience');
    D.exp.forEach(e => { L.push(`### ${e.role} · ${e.co}`, `${e.city} · ${e.md}`); (e.pts || e.alt || []).forEach(p => L.push(`- ${p}`)); L.push(''); });
    if (D.tekie) L.push(`Note: ${D.tekie}`, '');
    L.push('## Education'); D.edu.forEach(e => L.push(`- ${e.md}`)); L.push('');
    L.push('## Selected work');
    C.work.filter(w => w.md !== false).forEach(w => {
      L.push(`### ${w.name} (${w.date})`, w.summary);
      if (w.outcome) L.push(`Outcome: ${w.outcome}`);
      if (w.stack) L.push(`Stack: ${w.stack.join(', ')}`);
      if (w.ptags) L.push(`Tags: ${w.ptags.join(', ')}`);
      if (w.url) L.push(`Case study: ${w.url}`);
      L.push('');
    });
    L.push('## Skills'); Object.keys(D.skills).forEach(k => L.push(`- ${k}: ${D.skills[k].join(', ')}`)); L.push('');
    L.push('## Tools'); (D.stack || []).forEach(g => L.push(`- ${g.group}: ${g.tools.map(t => t[1]).join(', ')}`)); L.push('');
    const books = (D.books || []).filter(b => !b.hide);
    if (books.length) { L.push('## Bookshelf'); books.forEach(b => L.push(`- ${b.title}, ${b.author}${b.status === 'Reading' ? ' (reading now)' : ''}: ${b.url}`)); L.push(''); }
    L.push('## Testimonials'); D.words.forEach(q => L.push(`> "${q.quote}"`, `> ${q.name}, ${q.title}`, ''));
    L.push('## Contact', `Email: ${C.email}`, `Based in ${D.city}.`);
    return L.join('\n');
  };
})(typeof window !== 'undefined' ? window : globalThis);
