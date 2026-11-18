/* omdubey.com · content
   ------------------------------------------------------------------------------------------
   Every line the page builds with JavaScript lives here: the rotating headline, work, experience,
   education, the bookshelf, the stack, testimonials, the Ask answers and the section names. Text that sits
   in index.html (hero, statement, How I work, About, contact, footer) is edited there.

   After any edit, run:  node _tools/site/build.mjs
   It refreshes om-dubey.md, llms.txt, the search data in index.html and the cache keys.

   Honesty rules: real numbers only. Earlier roles: content.json. Lucidity: Om's master context (7 Nov 2026),
   his own metrics only, no customers, no revenue, nothing marked [CONFIRM] or [ADD] there.
   Lucidity is anonymised (Om, 11 Nov 2026), matching the Notion case studies: approximate figures only ("around",
   "~", "100+", "a few hundred"), and no names of people, customers, internal tools, teams, lists or fields.
   Pilot-brand numbers say "pilot brand". Tekie's 200k+ and 400+ are company context, not Om's own results.
   ------------------------------------------------------------------------------------------ */
window.OM_CONTENT = {
  site: 'https://omdubey.com/',
  email: 'omdubeyyy@gmail.com',

  // Photos. Put the file in assets/ and set its path, e.g. 'assets/portrait.jpg'.
  media: {
    aboutPhoto: null // replaces the Memoji in the About photo tile
  },

  // The hero headline cycles through these pairs: [line 1, line 2].
  headline: [
    ["Founder's Office", 'generalist'],
    ['GTM & RevOps', 'at Lucidity'],
    ['A Jack of', 'all Trades'],
    ["The Founder's", 'firefighter']
  ],

  // Sections: [id, name]. The side rail and the phone menu list all of them; the top pill shows the ids in `nav`.
  sections: [['top', 'Home'], ['work', 'Work'], ['how', 'How I work'], ['ask', 'Ask me'], ['about', 'About'], ['experience', 'Experience'], ['education', 'Education'], ['stack', 'Stack'], ['words', 'Testimonials'], ['books', 'Bookshelf'], ['contact', 'Contact']],
  nav: ['top', 'work', 'how', 'experience', 'education', 'stack'],

  person: {
    name: 'Om Dubey',
    role: "Founder's Office (GTM & RevOps)",
    company: 'Lucidity',
    companyUrl: 'https://www.lucidity.cloud/',
    since: 'Oct 2025',
    city: 'Gurugram, India',
    tagline: "Founder's Office, GTM, RevOps.",
    oneLiner: 'A Jack of all Trades.',
    self: 'A GTM operator who builds AI agents and automations.',
    lucidity: 'Cloud savings, delivered: AI agents find cloud storage and infrastructure savings, apply them with approval, and verify them.',
    nowNote: 'I work with the Founder on growth bets and run the GTM and RevOps systems behind them.',
    languages: ['Hindi', 'English'],
    links: [
      ['LinkedIn', 'https://www.linkedin.com/in/om-dubey/'],
      ['Notion portfolio', 'https://omdubeyyy.notion.site/Om-Dubey-Portfolio-5eee76b192e44b649ba657a819cf7f5f']
    ],

    // Experience table. `years` shows in the table, `md` in the Markdown version.
    // `pts` are the bullet points a row opens to; `alt` is used while a role has no points yet.
    exp: [
      { role: "Founder's Office (GTM & RevOps)", co: 'Lucidity', city: 'Gurugram', years: 'Oct 2025–now', md: 'Oct 2025 – now',
        pts: ['Work directly with the Founder on growth bets: founder-led LinkedIn, Reddit and AI-answer-engine visibility, event launches', 'Made HubSpot a source of truth: data-quality KRAs finished above target', 'Led v1.2 of the internal GTM knowledge base, with a SQL chatbot and an MCP server, used by around 50 people', 'Built the systems behind event ops and monthly commissions, plus 20+ dashboards and 12+ recurring MIS reports', 'Dispatched to whatever is burning; no two weeks look the same'] },
      { role: "Founder's Office", co: 'Uolo (acquired Tekie)', city: 'Gurugram', years: 'Nov 2022–2025', md: 'Nov 2022 – 2025',
        pts: ['Launched 3 new products from ideation to commercialisation', 'Led 15+ pilot projects across B2B2C and B2B', 'Ran GTM for new products: user analysis, sales decks, activation', 'Tracked unit economics: acquisition, retention, LTV'] },
      { role: 'Product Manager', co: 'Tekie', city: 'Bengaluru', years: 'Oct 2020–Nov 2022', md: 'Oct 2020 – Nov 2022',
        pts: ['Owned product with 10 developers and 3 designers', 'Event Management System: 5k+ registrations in 2 months', 'Demo auto-assignment: 30% increase in monthly revenue', 'Coding & computer science books with 15+ artists, replacing traditional publishers', 'Revamped the CRM and sales funnel: WATI, IVR calls, anti-spam'] },
      { role: 'Operations Intern (B2C Ops)', co: 'Tekie', city: 'Bengaluru', years: 'Mar–Oct 2020', md: 'Mar 2020 – Oct 2020',
        pts: ['Managed 6 customer support executives', '92% retention, 84% renewal', 'Ran 20k+ live online classes', 'Set up support: tools, bot flows, ticketing', 'A/B experiments on onboarding and retention'] }
    ],
    edu: [
      { role: 'B.F.M. (Financial Markets) · 9.0 GPA', co: 'Mithibai College', city: 'Mumbai', years: '2022', md: "Bachelor's in Financial Markets (B.F.M.), Mithibai College, Mumbai, 2022, 9.0 GPA" },
      { role: 'AISSCE · 92.6%', co: 'Delhi Public School', city: 'Bhilai', years: '2019', md: 'AISSCE, Delhi Public School, Bhilai, 2019, 92.6%' }
    ],
    tekie: 'Tekie: 200k+ paid students and 400+ schools. Company context, not mine alone.',

    // Skills graph: four areas around one centre. A skill in `links` also connects to a second area,
    // which is what ties the four together on the page.
    skillHub: "Founder's Office",
    skills: {
      Product: ['PRDs', 'Wireframing', 'User research', 'Roadmaps', 'A/B testing', 'Internal AI tools'],
      Growth: ['GTM strategy', 'Founder-led content', 'Community', 'SEO & AEO', 'Outbound & ABM', 'Launches & events'],
      Business: ['Forecasting', 'Unit economics', 'Sales analytics', 'Market research', 'Sales decks', 'Stakeholders'],
      Ops: ['CRM governance', 'Pipeline design', 'Workflow automation', 'Dashboards & MIS', 'Commissions', 'Enablement']
    },
    skillLinks: [
      ['Forecasting', 'Ops'], ['Dashboards & MIS', 'Business'], ['Launches & events', 'Product'], ['Workflow automation', 'Product'],
      ['Internal AI tools', 'Ops'], ['Outbound & ABM', 'Business'], ['Enablement', 'Growth'], ['Unit economics', 'Growth'],
      ['GTM strategy', 'Business'], ['Sales analytics', 'Ops'], ['User research', 'Growth'], ['Pipeline design', 'Business']
    ],

    // Stack: [logo id, name]. Logos are monochrome SVGs in assets/logos/ (manifest.json lists each source).
    stack: [
      { group: 'AI & automation', tools: [['claude', 'Claude'], ['openai', 'OpenAI'], ['n8n', 'n8n'], ['appsscript', 'Apps Script'], ['apify', 'Apify'], ['vercel', 'Vercel'], ['supabase', 'Supabase'], ['lovable', 'Lovable'], ['python', 'Python']] },
      { group: 'GTM & RevOps', tools: [['hubspot', 'HubSpot'], ['apollo', 'Apollo'], ['gong', 'Gong'], ['fathom', 'Fathom'], ['nooks', 'Nooks'], ['smartlead', 'Smartlead'], ['heyreach', 'HeyReach'], ['lusha', 'Lusha'], ['linkedin', 'Sales Navigator'], ['mailchimp', 'Mailchimp'], ['lookerstudio', 'Looker Studio'], ['googlesheets', 'Google Sheets']] },
      { group: 'Product & ops', tools: [['notion', 'Notion'], ['figma', 'Figma'], ['jira', 'Jira'], ['trello', 'Trello'], ['miro', 'Miro'], ['mixpanel', 'Mixpanel'], ['pendo', 'Pendo'], ['freshworks', 'Freshworks'], ['zendesk', 'Zendesk'], ['shopify', 'Shopify'], ['wati', 'WATI'], ['interakt', 'Interakt'], ['photoshop', 'Photoshop']] }
    ],
    // The logo strip at the bottom of the hero, in order.
    heroTools: ['hubspot', 'claude', 'n8n', 'apollo', 'gong', 'lookerstudio', 'notion', 'openai', 'appsscript', 'apify', 'linkedin', 'figma', 'vercel', 'supabase', 'mixpanel', 'googlesheets'],

    // Bookshelf: every book opens Om's notes on Notion. Covers are assets/books/<id>.jpg (w × h in pixels).
    // status: 'Reading' shows a tag; hide: true leaves a book off the shelf.
    books: [
      { id: 'psycho-cybernetics', spine: '#23262B', nocover: true, title: 'Psycho-Cybernetics', author: 'Maxwell Maltz', url: 'https://omdubeyyy.notion.site/Psycho-Cybernetics-4192abc044ce818cb647f615c30af8e5' },
      { id: 'blue-ocean', spine: '#1565C0', nocover: true, title: 'Blue Ocean Strategy', author: 'W. Chan Kim & Renée Mauborgne', url: 'https://omdubeyyy.notion.site/Blue-Ocean-Strategy-4192abc044ce812bb15ae8e2950a93f3' },
      { id: 'shoe-dog', spine: '#EDE7DC', nocover: true, title: 'Shoe Dog', author: 'Phil Knight', url: 'https://omdubeyyy.notion.site/Shoe-Dog-4192abc044ce81cfad43f4530dd429eb' },
      { id: 'super-thinking', spine: '#F28C28', nocover: true, title: 'Super Thinking', author: 'Gabriel Weinberg & Lauren McCann', url: 'https://omdubeyyy.notion.site/Super-Thinking-4192abc044ce81a19d64ef874f8fa9ee' },
      { id: 'thinking-in-systems', spine: '#5F8F3A', nocover: true, title: 'Thinking in Systems', author: 'Donella H. Meadows', url: 'https://omdubeyyy.notion.site/Thinking-in-Systems-4192abc044ce81bf97cfd2b9c2e97d99' },
      { id: 'crossing-the-chasm', spine: '#B23A2E', nocover: true, title: 'Crossing the Chasm', author: 'Geoffrey A. Moore', url: 'https://omdubeyyy.notion.site/Crossing-the-Chasm-4192abc044ce81669f69e46e2304bdad' },
      { id: 'predictable-revenue', spine: '#0E6BA8', nocover: true, title: 'Predictable Revenue', author: 'Aaron Ross & Marylou Tyler', url: 'https://omdubeyyy.notion.site/Predictable-Revenue-4192abc044ce81ec86b6db249efceec0' },
      { id: 'hooked', spine: '#E3D23A', w: 300, h: 463, title: 'Hooked', author: 'Nir Eyal', status: 'Reading', url: 'https://omdubeyyy.notion.site/Hooked-7939beecdfcf4dc9ab2048b98c1418e7' },
      { id: 'lean-startup', spine: '#2F7CC0', w: 300, h: 450, title: 'The Lean Startup', author: 'Eric Ries', url: 'https://omdubeyyy.notion.site/The-lean-startup-c5fe140a133f4086bca4e7d695403d00' },
      { id: 'zero-to-one', spine: '#C79A2E', w: 300, h: 471, title: 'Zero to One', author: 'Peter Thiel', url: 'https://omdubeyyy.notion.site/Zero-to-one-398f126a0ae14a359b55fd0587c203f2' },
      { id: 'contagious', spine: '#E4783B', w: 300, h: 457, title: 'Contagious', author: 'Jonah Berger', url: 'https://omdubeyyy.notion.site/Contagious-7f2023c5e75d430eb098dd7306353919' },
      { id: 'this-is-marketing', spine: '#A3471A', w: 300, h: 424, title: 'This Is Marketing', author: 'Seth Godin', url: 'https://omdubeyyy.notion.site/This-is-Marketing-ca75f8b3dc6f4730b3e7bab6ce226a16' },
      { id: '100-startup', spine: '#EFE6D8', w: 300, h: 479, title: 'The $100 Startup', author: 'Chris Guillebeau', url: 'https://omdubeyyy.notion.site/The-100-startup-3eaabaaf45be42308a64f1b889f3b436' },
      { id: 'win-friends', spine: '#E6D6D8', w: 300, h: 322, title: 'How to Win Friends & Influence People', author: 'Dale Carnegie', url: 'https://omdubeyyy.notion.site/How-to-win-friends-influence-people-4001fbe0e85d44f690f590161d438871' },
      { id: 'rich-dad', spine: '#7D6230', w: 300, h: 452, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', url: 'https://omdubeyyy.notion.site/Rich-Dad-Poor-Dad-7681d8ea712e4c88914c6154695d5247' },
      { id: 'cashflow-quadrant', spine: '#5A3D44', w: 300, h: 450, title: 'Cashflow Quadrant', author: 'Robert Kiyosaki', url: 'https://omdubeyyy.notion.site/Cashflow-Quadrant-77d077bdf00c47b288ec8de59e6627ea' },
      { id: 'richest-man-babylon', spine: '#CFC7B8', w: 300, h: 454, title: 'The Richest Man in Babylon', author: 'George S. Clason', url: 'https://omdubeyyy.notion.site/The-richest-man-in-babylon-304cf0d514aa4e9b87e69b30c9e38733' },
      { id: 'total-money-makeover', spine: '#8E6A50', w: 300, h: 386, title: 'The Total Money Makeover', author: 'Dave Ramsey', url: 'https://omdubeyyy.notion.site/Total-money-makeover-85becf51fff243a6a66ad0defa3877fd' },
      { id: 'think-grow-rich', spine: '#2B2B2E', w: 300, h: 450, title: 'Think and Grow Rich', author: 'Napoleon Hill', url: 'https://omdubeyyy.notion.site/Think-grow-rich-0942368381d9403a8cb74f52c4f244dd' },
      { id: 'alchemist', spine: '#E59D35', w: 300, h: 453, title: 'The Alchemist', author: 'Paulo Coelho', url: 'https://omdubeyyy.notion.site/The-Alchemist-c464077d21fa4bd0858f1c5b725d4395' },
      { id: '5am-club', spine: '#F0B696', w: 300, h: 414, title: 'The 5 AM Club', author: 'Robin Sharma', url: 'https://omdubeyyy.notion.site/The-5am-club-4de996be83464938941c9d6ad873da51' },
      { id: 'megaliving', spine: '#E9E6DF', w: 300, h: 463, title: 'Megaliving!', author: 'Robin Sharma', url: 'https://omdubeyyy.notion.site/Megaliving-1ec22f47cd8b43bd86801bc5e9d6890f' },
      { id: 'subconscious-mind', spine: '#2E4B7A', w: 300, h: 450, title: 'The Power of Your Subconscious Mind', author: 'Joseph Murphy', url: 'https://omdubeyyy.notion.site/The-power-of-your-subconscious-mind-a544cbf26e1b4d1087e8ae554e787f29' },
      { id: 'the-secret', spine: '#B5764E', w: 300, h: 386, title: 'The Secret', author: 'Rhonda Byrne', url: 'https://omdubeyyy.notion.site/The-Secret-7b7928fc7cec403f8fc77b7854aa007c' },
      { id: 'chanakya-daily-life', spine: '#9DA556', w: 300, h: 479, title: 'Chanakya in Daily Life', author: 'Radhakrishnan Pillai', url: 'https://omdubeyyy.notion.site/Chanakya-in-daily-life-5705e0593c864e578c14f5551f923426' },
      { id: 'corporate-chanakya', spine: '#E2BF17', w: 300, h: 463, title: 'Corporate Chanakya', author: 'Radhakrishnan Pillai', url: 'https://omdubeyyy.notion.site/Corporate-Chanakya-c40ca4ffcc404bcd80bd6212caa663df' }
    ],

    // Testimonials: quotes stay word for word.
    words: [
      { name: 'Rohit Somani', title: 'CFO, Tekie', label: 'Strategic Problem Solver', url: 'https://www.linkedin.com/in/carohitsomani/',
        quote: 'Om is an outstanding professional with exceptional business and analytical skills. He has a talent for understanding complex issues and identifying creative solutions that drive business growth.' },
      { name: 'Naman Mukund', title: 'Co-founder, Tekie', label: 'Team Catalyst', url: 'https://www.linkedin.com/in/naman-mukund-2a389553/',
        quote: 'He brings with him a unique set of interpersonal skills that have been really helpful. His ability to understand and appreciate different perspectives has allowed us to achieve our goals as a team.' },
      { name: 'Anand Verma', title: 'Co-founder, Tekie', label: 'Exceptional Team Player', url: null,
        quote: 'Om is an exceptional team player and leader, with a talent for collaborating across multiple functions and delivering high-quality work. His ability to identify innovative solutions to complex problems, positive attitude, and strong work ethic make him an invaluable asset to any organization.' }
    ]
  },

  // Work filters. k is what a project lists in `cats`.
  cats: [
    { k: 'all', label: 'All', icon: 'i-all' },
    { k: 'ai', label: 'AI', icon: 'i-ai' },
    { k: 'growth', label: 'GTM & growth', icon: 'i-growth' },
    { k: 'ops', label: 'RevOps & ops', icon: 'i-ops' },
    { k: 'product', label: 'Product', icon: 'i-product' }
  ],

  /* Work, in page order. Each project:
     id       unique; also picks its live mini screen when a screen has that name
     ui       optional: the screen to use. Lucidity screens live in js/mini-lucidity.js; 'shot' shows a real screenshot
              (shot: 'assets/work/file.jpg'); 'placeholder' shows loading skeletons with `note`.
     show     true = big showcase card; false = a row under "More work" (needs `year`, `line`, `url`)
     cats     filters it appears under: ai, growth, ops, product
     name, date ('Sep 2025'), gyear (year on the grid card), year (year on the More work row)
     title    the showcase heading · tags: '#Hashtags' · quote: first person, in the white card
     meta     small line in the card (role or stack) · line: one more line under it
     cap      caption on the screen: { name, cat, year } · band: three colours for the card's gradient
     url      case study link, or null for "Case study soon" · prompt: text typed under the screen · alt: what the screen shows
     smalls   up to 4 facts under the card: [icon id, title, text]
     summary, outcome, stack, ptags: used in the Markdown version (md: false leaves a card out of it) */
  work: [
    { id: 'knowledge-base', ui: 'kb', show: true, cats: ['ai', 'ops'], name: 'GTM Knowledge Base', gyear: '2026', date: 'May – Oct 2026',
      title: 'GTM Knowledge Base. One place where reps and AI agents read the same account and deal truth.', tags: ['#AIProduct', '#MCP', '#KnowledgeBase'],
      cap: { name: 'GTM knowledge base', cat: 'Internal AI tool · Lucidity', year: 'Year: 2026' }, band: ['#93A6BA', '#5D7186', '#2C3845'],
      quote: "I took over Lucidity's internal GTM knowledge base and led v1.2: database integration, a chatbot that runs SQL, an MCP server so AI agents can query pipeline and account data, and a staging environment. I also moved enrichment to a cheaper model to cut LLM cost.",
      meta: 'Stack: Web app · Database · Chatbot with SQL · MCP server · OpenAI · HubSpot and Gong sync',
      line: 'Around 50 people have used it since it launched in May 2026.',
      url: 'https://omdubeyyy.notion.site/GTM-Knowledge-Base-and-MCP-Server-4152abc044ce8123a6aaeaf305aa21e1', prompt: 'Which deals moved this week?', alt: 'A knowledge-base chat: a question about deals becomes a SQL query, then a short answer with a small table of sample deals and a note that AI agents read the same data over MCP.',
      smalls: [['i-chat', 'Chatbot that runs SQL.', 'Plain-English questions, answered from the database.'], ['i-sync', 'Daily sync.', 'HubSpot and Gong data refreshed every day.'], ['i-ai', 'MCP server.', 'AI clients like Claude query the same pipeline data.'], ['i-person', 'Around 50 users.', '3k+ tracked events and 200+ chatbot sessions.']],
      summary: "Lucidity's internal GTM knowledge base: accounts, deals, customers and playbooks in one place, with a chatbot that runs SQL and an MCP server so AI agents read the same data as the reps. I took over the codebase and led v1.2 onward.",
      outcome: 'Around 50 users, 3k+ tracked events and 200+ chatbot sessions since May 2026. MCP server, staging environment and database integration shipped in v1.2.',
      stack: ['Web app', 'Database', 'Chatbot with SQL', 'MCP server', 'OpenAI', 'HubSpot', 'Gong'], ptags: ['AI product', 'Knowledge base', 'MCP', 'Internal tools'] },

    { id: 'briefs', ui: 'briefs', show: true, cats: ['ai', 'growth'], name: 'AI Account Research Engine', gyear: '2026', date: 'Jul – Sep 2026',
      title: 'AI Account Research Engine. One command maps an account and publishes the brief where the team already works.', tags: ['#ClaudeSkills', '#ABM', '#Research'],
      cap: { name: 'Account briefs', cat: 'Claude skill · Lucidity', year: 'Year: 2026' }, band: ['#B6B0A2', '#7A7466', '#3A362E'],
      quote: 'I built a Claude skill that researches an account end to end: org chart, ranked decision makers, the cloud provider with evidence and the why-now signals. One run publishes the brief to Google Docs, HubSpot and our knowledge base.',
      meta: 'Stack: Claude skill · Apollo · Apify · HubSpot · Google Docs · Knowledge-base MCP',
      line: '100+ accounts briefed in under three weeks.',
      url: 'https://omdubeyyy.notion.site/AI-Account-Research-Engine-4152abc044ce816cb137e2a320deb628', prompt: 'Map this account for outreach', alt: 'A research run: a liveness check, the cloud provider with a confidence label, ranked decision makers and a small org chart, then the brief is published to Docs, HubSpot and the knowledge base.',
      smalls: [['i-check', 'Liveness check first.', 'A closed company gets a "drop" brief, not an invented org chart.'], ['i-person', 'Ranked decision makers.', 'Buyer, champion, authority and working level.'], ['i-sync', 'Publishes everywhere.', 'A Google Doc, a HubSpot link and a knowledge-base page.'], ['i-funnel', 'Hundreds of contacts a week.', 'Personalised opening hooks for outbound.']],
      summary: 'A Claude-skill pipeline that maps any target account (org chart, ranked decision makers, cloud provider with evidence, why-now signals) and writes the brief back to Google Docs, HubSpot and the GTM knowledge base in one run.',
      outcome: '100+ accounts briefed in under three weeks (Aug – Sep 2026). A related hook automation produces a few hundred personalised contacts a week.',
      stack: ['Claude skills', 'Apollo', 'Apify', 'HubSpot', 'Google Docs', 'Knowledge-base MCP'], ptags: ['AI', 'Claude skills', 'Account research', 'ABM'] },

    { id: 'crm', ui: 'crm', show: true, cats: ['ops'], name: 'HubSpot Data Quality System', gyear: '2026', date: 'Nov 2025 – Oct 2026',
      title: 'HubSpot Data Quality System. A CRM the forecast and leadership could rely on.', tags: ['#RevOps', '#HubSpot', '#DataQuality'],
      cap: { name: 'CRM data quality', cat: 'RevOps · Lucidity', year: 'Year: 2026' }, band: ['#C2A9A9', '#866868', '#3F2F2F'],
      quote: "Deal, company and contact data was incomplete, so forecasts and reports couldn't be trusted. I designed an adherence process across 50+ deal and company properties, automated the fixes with n8n and HubSpot workflows, then wrote it up and handed the daily checks to a teammate.",
      meta: 'Stack: HubSpot workflows · n8n · Google Sheets + Apps Script · Gong',
      line: 'Data-quality KRAs finished just above target.',
      url: 'https://omdubeyyy.notion.site/HubSpot-Data-Quality-System-4152abc044ce81a79275ceb963c616f5', prompt: 'Run the daily adherence check', alt: 'A CRM adherence board: missing deal fields turn complete one by one while accuracy and Gong adherence meters pass their targets.',
      smalls: [['i-check', 'Accuracy around 86%.', 'Against an 80% target.'], ['i-resolved', 'Gong adherence around 89%.', 'Against an 85% target.'], ['i-sync', 'Fixes that run themselves.', 'Workflows backfill whatever can be derived.'], ['i-handoff', 'Handed over.', 'A written process a teammate now runs daily.']],
      summary: 'An adherence process and a set of automations that made HubSpot a source of truth the forecast and leadership could rely on.',
      outcome: 'Data-quality KRAs just above target: accuracy around 86% against 80%, Gong adherence around 89% against 85%.',
      stack: ['HubSpot', 'n8n', 'Google Sheets', 'Apps Script', 'Gong'], ptags: ['RevOps', 'HubSpot', 'Data quality', 'Automation'] },

    { id: 'founder', ui: 'radar', show: true, cats: ['growth', 'ai'], name: 'Founder-Led Growth Engine', gyear: '2026', date: 'Aug – Nov 2026',
      title: "Founder-Led Growth Engine. The Founder's LinkedIn, run as a system.", tags: ['#FounderBrand', '#LinkedIn', '#AIagents'],
      cap: { name: 'Founder-led growth', cat: "Founder's Office · Lucidity", year: 'Aug 2026 → now' }, band: ['#9FB2C4', '#62788C', '#2B3947'],
      quote: "I run the Founder's LinkedIn as a growth system: a strategy built on around 2,000 analysed posts, a daily AI radar that finds the conversations worth his time, outreach that turns engagement into conversations, and a weekly report that builds itself.",
      meta: 'Stack: Claude scheduled tasks · Apify · HeyReach · Pressmaster · n8n',
      line: 'Around 47k impressions from August to early November 2026.',
      url: 'https://omdubeyyy.notion.site/Founder-Led-Growth-Engine-4152abc044ce81aeb12fd34359c4080b', prompt: 'Find posts worth a comment today', alt: 'A daily radar: thousands of LinkedIn posts are filtered by age, activity and relevance down to a short list of posts worth engaging with.',
      smalls: [['i-funnel', '~11k posts screened.', 'Around 200 surfaced in the radar\'s first six weeks.'], ['i-person', '~45% accepted.', 'Invite acceptance in the outreach pilot.'], ['i-chat', 'About half replied.', 'Reply rate in the same pilot.'], ['i-report', 'A weekly MIS.', 'Built by a scheduled task, sent by n8n every Monday.']],
      summary: "The Founder's LinkedIn run as a data-backed system: strategy, content, a daily AI radar for engagement, outreach and an automated weekly report.",
      outcome: 'Around 47k impressions and 30k reach from Aug to early Nov 2026. Radar: ~11k posts screened, ~200 surfaced. Outreach pilot: ~45% invite acceptance, and about half replied.',
      stack: ['Claude scheduled tasks', 'Apify', 'HeyReach', 'Pressmaster', 'n8n', 'Google Sheets'], ptags: ['Founder brand', 'LinkedIn', 'Growth', 'Automation'] },

    { id: 'aeo', ui: 'aeo', show: true, cats: ['growth'], name: 'Reddit + AEO Programme', gyear: '2026', date: 'Sep – Nov 2026',
      title: 'Reddit + AEO. Measuring whether AI answer engines recommend us, then working to change it.', tags: ['#Community', '#AEO', '#Experiment'],
      cap: { name: 'Reddit + AEO', cat: "Founder's Office · Lucidity", year: 'Sep 2026 → now' }, band: ['#CDB2A0', '#8F6F5C', '#45332A'],
      quote: 'A community-led growth bet I run with full autonomy: a branded subreddit, value-first answers in the cloud and FinOps communities, and a baseline of how four AI answer engines talk about our category.',
      meta: 'Stack: Reddit · Claude skills · Claude, OpenAI, Gemini and Perplexity',
      line: '10 buyer questions across 4 AI engines, run twice in October 2026.',
      url: 'https://omdubeyyy.notion.site/Reddit-and-AEO-Programme-4152abc044ce81e89158fcc89651f0a9', prompt: 'Ask 4 AI engines 10 buyer questions', alt: 'An answer-engine baseline: ten buyer questions down the side, four AI engines across the top, each answer scored recommended, named or absent.',
      smalls: [['i-chat', 'A branded subreddit.', 'Launched for the brand; only moderators post.'], ['i-ai', '4 AI engines.', 'Claude, OpenAI, Gemini and Perplexity.'], ['i-sliders', 'One scoring rule.', 'Recommended, named or absent, with every answer archived.']],
      summary: 'A community-led growth programme on Reddit, plus a baseline of whether AI answer engines (Claude, OpenAI, Gemini, Perplexity) recommend Lucidity for real buyer questions.',
      outcome: 'A branded subreddit launched. A 10-question × 4-engine baseline run twice in Oct 2026, full answers archived.',
      stack: ['Reddit', 'Claude skills', 'Claude', 'OpenAI', 'Gemini', 'Perplexity'], ptags: ['Community', 'Reddit', 'AEO', 'Growth experiment'] },

    { id: 'whatsapp', show: true, cats: ['ai', 'ops'], name: 'WhatsApp Support Automation', gyear: '2025', date: 'Sep 2025',
      title: 'WhatsApp Support Automation. First reply in under 60 seconds, for a pilot brand.', tags: ['#AgenticAI', '#n8n', '#Support'],
      cap: { name: 'WhatsApp support', cat: 'E-comm', year: 'Year: 2025' }, band: ['#AEBEA5', '#6E8169', '#33403A'],
      quote: "I built an agentic automation that handles most incoming WhatsApp queries for a D2C brand: order tracking, returns, exchanges and address changes, with a hand-off to a person when it's needed.",
      meta: 'Stack: n8n · Shopify · Interakt', line: 'Numbers are from the pilot brand.',
      url: 'https://omdubeyyy.notion.site/WhatsApp-Customer-Support-Automation-27d2abc044ce802081ffcc0b80f7d54b',
      prompt: "Where's my order?", alt: 'A support inbox where an automation answers order, return and address questions, with a connect-agent fallback.',
      smalls: [['i-resolved', 'Resolved automatically.', '65–75% of eligible queries, pilot brand.'], ['i-timer', 'First reply.', 'Under 60 seconds, down from 10–15 minutes.'], ['i-smile', 'Happier customers.', '+8–12 CSAT points, pilot brand.'], ['i-handoff', 'Fewer hand-offs.', '30–40% fewer manual touches, pilot brand.']],
      summary: 'An agentic automation that handles most incoming WhatsApp queries for a D2C brand: order tracking, returns, exchanges, address changes, with a Connect Agent fallback.',
      outcome: 'Pilot brand: 65–75% automated resolution on eligible intents, first response under 60 seconds (from 10–15 minutes), +8–12 CSAT points, 30–40% fewer manual touches.',
      stack: ['n8n', 'Shopify', 'Interakt'], ptags: ['Agentic AI', 'n8n', 'E-comm', 'Support'] },

    { id: 'inventory', show: true, cats: ['ai', 'ops'], name: 'Inventory Management System', gyear: '2025', date: 'Sep 2025',
      title: 'Inventory Management System. A full dispatch system in 4 weeks, with no tech team.', tags: ['#AI', '#VibeCoding', '#Ecomm'],
      cap: { name: 'Inventory & dispatch', cat: 'E-comm', year: 'Year: 2025' }, band: ['#CDB89C', '#8C7660', '#43362B'],
      quote: 'I built a full inventory and dispatch system for a premium D2C streetwear brand, without a tech team, against a 4-week deadline.',
      meta: 'Stack: Supabase · Shopify · Delhivery · Shiprocket · Interakt · Return Prime · OpenAI · Resend',
      line: 'It unifies products, orders, warehouses and logistics in one place.',
      url: 'https://omdubeyyy.notion.site/Inventory-Management-System-26a2abc044ce8023b4cdcddcd459c319',
      prompt: 'Scan UPC…', alt: 'An inventory dashboard: a UPC scan highlights a product row, then sync, AWB and GRN chips and a restock suggestion appear.',
      smalls: [['i-sync', 'Shopify sync.', 'Products and orders stay in step with the store.'], ['i-box', 'AWB and GRNs.', 'Shipping labels out, goods received in.'], ['i-scan', 'Mobile UPC scanning.', 'Scan from a phone on the warehouse floor.'], ['i-restock', 'AI restock.', 'Recommendations on what to reorder.']],
      summary: 'A full inventory and dispatch system for a premium D2C streetwear brand. Built without a tech team, against a 4-week deadline.',
      outcome: 'Unifies products, orders, warehouses and logistics. Shopify sync, AWB generation, GRNs, mobile UPC scanning, live inventory, and AI restock recommendations.',
      stack: ['Supabase', 'Shopify', 'Delhivery', 'Shiprocket', 'Interakt', 'Return Prime', 'OpenAI', 'Resend'], ptags: ['AI', 'Vibe coding', 'E-comm', 'Internal tool'] },

    { id: 'event-ops', ui: 'shot', shot: 'assets/work/event-ops.jpg', show: false, cats: ['ops', 'growth'], name: 'Event Ops Automation & System', gyear: '2026', date: 'Sep – Nov 2026', year: '2026',
      tags: ['#Events', '#Attribution', '#n8n'], band: ['#B7AEA4', '#7B7166', '#3B352F'],
      line: 'A cross-team event launch at MS Ignite 2026, with pre-event reporting about 90% automated.', alt: 'A title card: Event Ops Automation & System, with n8n, Apps Script, Google Sheets, HubSpot and Apollo logos.',
      url: 'https://omdubeyyy.notion.site/Event-Ops-Automation-System-4152abc044ce81fa9b7fe1a44685601b',
      summary: 'An event-ops system and the project management around it, first run for a cross-team launch at MS Ignite 2026: a master contact book, a nightly n8n sync, process and outcome metrics, and one simple attribution rule.',
      outcome: 'Pre-event reporting about 90% automated, metrics down to account and rep, and zero new CRM fields.',
      stack: ['n8n', 'Apps Script', 'Google Sheets', 'HubSpot', 'Apollo'], ptags: ['Project management', 'Events', 'Attribution'] },

    { id: 'commission', ui: 'shot', shot: 'assets/work/commission.jpg', show: false, cats: ['ops'], name: 'Commission Automation', gyear: '2026', date: 'Jul – Aug 2026', year: '2026',
      tags: ['#RevOps', '#CompOps', '#Claude'], band: ['#BCB3A0', '#80775F', '#3D392D'],
      line: 'A workflow and system that runs monthly commissions for AEs, SEs and partners.', alt: 'A title card: Commission Automation, with Claude, Apps Script, HubSpot and Vercel logos.',
      url: 'https://omdubeyyy.notion.site/Commission-Automation-4152abc044ce8189a8f8f05f3b786540',
      summary: 'A workflow and a system that automate monthly commissions for AEs, SEs and partners, which used to be calculated by hand. Deal data comes from HubSpot, Apps Script runs the monthly steps, and the system was built with Claude and runs on Vercel.',
      outcome: 'Live since the V1 review in Aug 2026, with no more hand calculation. I review each monthly run before it goes out.',
      stack: ['Claude', 'Apps Script', 'HubSpot', 'Vercel'], ptags: ['RevOps', 'Compensation ops', 'Automation'] },

    { id: 'demo', show: false, cats: ['product', 'growth'], name: 'Demo Auto-assignment', gyear: '2021', date: 'Sep 2021', year: '2021',
      title: 'Demo Auto-assignment. The logic behind a 30% increase in monthly revenue.', tags: ['#Logic', '#Optimisation', '#UserFlow'],
      cap: { name: 'Demo auto-assignment', cat: 'Ed-tech', year: 'Year: 2021' }, band: ['#AFAAC6', '#6E6A88', '#312F45'],
      quote: 'I designed backend logic that assigns demo classes across multiple variables, plus automated reports for prospective customers.',
      meta: 'Role: Product Manager, Tekie', line: 'The logic behind a 30% increase in monthly revenue.',
      url: 'https://omdubeyyy.notion.site/Demo-Auto-assignment-Feature-c5f1ee3f8f9f481da1158d1cab327678',
      prompt: 'Assign a demo for Grade 6, Hindi, 5 pm', alt: 'A routing board: a demo request is matched on grade, language and time slot, then placed in the 5 pm column and a report goes out.',
      smalls: [['i-sliders', 'Many variables.', 'Each demo is matched across several variables at once.'], ['i-report', 'Automated reports.', 'Prospective customers get a report without anyone writing it.'], ['i-revenue', 'Revenue.', 'Monthly revenue up 30%.']],
      summary: 'Backend logic that assigns demo classes across multiple variables, plus automated reports for prospective customers.',
      outcome: '30% increase in monthly revenue.', ptags: ['Logic', 'Optimisation', 'User flow'] },

    { id: 'events', show: false, cats: ['product', 'growth'], name: 'Event Management System', gyear: '2022', date: 'Jan 2022', year: '2022',
      title: 'Event Management System. 5k+ registrations in 2 months.', tags: ['#ManagementTool', '#LeadGen', '#UserFlow'],
      cap: { name: 'Events', cat: 'Ed-tech', year: 'Year: 2022' }, band: ['#CBADA4', '#8E6C64', '#45312E'],
      quote: 'I built a tool to create, manage and edit events, made for better lead generation.',
      meta: 'Role: Product Manager, Tekie', line: 'A tool for events and lead generation: 5k+ registrations in 2 months.',
      url: 'https://omdubeyyy.notion.site/Event-Management-System-530b966820b94f61ac1a12f3ab6ccc62',
      prompt: 'Create a weekend coding workshop', alt: 'A create-event form fills itself in and publishes, then a registrations counter climbs to 5k+ in 2 months.',
      smalls: [['i-calplus', 'Create.', 'Set up a new event and open registrations.'], ['i-edit', 'Manage and edit.', "Update an event after it's published."], ['i-funnel', 'Lead generation.', '5k+ registrations in 2 months.']],
      summary: 'A tool to create, manage and edit events, built for better lead generation.',
      outcome: '5k+ registrations in 2 months.', ptags: ['Management tool', 'Web design', 'User flow'] },

    { id: 'nps', show: false, cats: ['product'], name: 'NPS & Feedback Structure', gyear: '2022', date: 'Oct 2022', year: '2022',
      tags: ['#NPS', '#Feedback', '#WebDesign'], band: ['#A2BDBA', '#5E7E7B', '#2B3D3C'],
      line: 'A process to capture, record and analyse NPS and feedback.', alt: 'A feedback screen with a 0 to 10 scale and a "tell us why" box.',
      url: 'https://omdubeyyy.notion.site/NPS-Feedback-Structure-a9dd11681d2648b5829e83dd6e429bc4',
      summary: 'A process to capture, record and analyse NPS and feedback from users.', outcome: 'Feedback, made a system.', ptags: ['NPS', 'Feedback', 'Web design'] },

    { id: 'sales', show: false, cats: ['product', 'growth'], name: 'Sales Management Tool', gyear: '2021', date: 'Jul 2021', year: '2021',
      tags: ['#Sales', '#Dashboard', '#WebDesign'], band: ['#BAB79C', '#7D7A5E', '#3B3A2B'],
      line: 'An internal tool for the sales pipeline, payments and onboarding.', alt: 'A sales pipeline board with lead, demo, paid and onboarded columns.',
      url: 'https://omdubeyyy.notion.site/Sales-Management-System-4a5abadef86a404cb0c84e4fb3232de1',
      summary: 'An internal tool to manage the sales pipeline, collect payments and onboard users.', outcome: 'Pipeline, payments, onboarding.', ptags: ['Sales', 'Dashboard', 'Web design'] },

    { id: 'lufthansa', show: false, cats: ['product'], name: 'Lufthansa Mobile App', gyear: '2023', date: 'Apr 2023', year: '2023',
      tags: ['#CaseStudy', '#Wireframe', '#Figma'], band: ['#ADBCCE', '#6A7F98', '#303D55'],
      line: 'A self-initiated case study on problems international travellers face.', alt: 'Two wireframe phone screens: a trip view and a transfer help flow.',
      url: 'https://omdubeyyy.notion.site/Lufthansa-Mobile-App-a274962fc8214ebabf600f03c3bbc5f1',
      summary: 'A self-initiated case study on how Lufthansa could solve problems faced by international travellers.', outcome: 'Self-briefed case study.', ptags: ['Case study', 'Wireframe', 'Figma'] }
  ],

  /* Ask me: pre-written answers, matched by keywords (the page says they're pre-written).
     k: keywords; '+word' counts double, 'word*' matches the start of a word. The first `chips` questions show as suggestions. */
  ask: {
    chips: 6,
    featured: ['Who are you, in one line?', 'What do you do at Lucidity?', "What's your best work?", 'What have you built with AI?', 'How do you work?', 'Are you open to new opportunities?'],
    groups: ['About me', 'My work', 'How I work', 'Tools & AI', 'Career & hiring', 'Off the clock'],
    qa: [
      { g: "About me", q: "Who are you, in one line?", k: ["+who are you", "+about you", "+introduce", "+one line", "+tldr", "+yourself", "summary"],
        a: "I'm Om. I sit in Lucidity's Founder's Office and look after GTM and RevOps, which mostly means I build the systems a sales team runs on and the AI agents that keep them running." },
      { g: "About me", q: "What do you do at Lucidity?", k: ["+lucidity", "+current role", "+current job", "+your job", "+day job", "what do you do", "role"],
        a: "Founder's Office, GTM and RevOps, since October 2025. Day to day that's the CRM, pipeline and forecast reporting, internal AI tools for the sales team, and whatever growth bet the Founder wants tested next: LinkedIn, Reddit, AI search, event launches. Some weeks it's spreadsheets, some weeks it's an MCP server." },
      { g: "About me", q: "What does Lucidity actually do?", k: ["+what is lucidity", "+lucidity do", "+does lucidity", "+cloud cost", "+cloud savings", "+company", "storage"],
        a: "Lucidity cuts cloud bills. Its AI agents find storage and infrastructure savings across AWS, Azure and GCP, apply them with your approval, and then check they actually landed. I'm on the GTM side, not engineering." },
      { g: "About me", q: "What does Founder's Office mean for you?", k: ["+founder*", "+office", "+chief of staff", "+cos", "generalist", "firefight*"],
        a: "Honestly? Firefighting. You get dropped wherever something's burning, fix it, and ideally leave a system behind so it doesn't catch fire again. No two weeks look the same, which is the part I like." },
      { g: "About me", q: "Why \"Jack of all trades\"?", k: ["+jack", "+trades", "+generalist", "specialist", "master of none"],
        a: "Because I've done ops, product, GTM and RevOps, and I'd rather own a problem end to end than hand it off at the edge of my job description. The rest of that saying is 'oftentimes better than a master of one', so I'm keeping it." },
      { g: "About me", q: "Where are you based?", k: ["+based", "+where are you", "+live in", "+city", "+location", "+gurugram", "+gurgaon", "+india", "+timezone", "+time zone", "ist", "+where do you live", "live"],
        a: "Gurugram, India. I work on IST, and I'm used to overlapping with US teams since half of my stakeholders are there." },
      { g: "About me", q: "How many years of experience do you have?", k: ["+how many years", "+years of experience", "+experience", "+how long", "+senior"],
        a: "About six years. Started in March 2020 in operations at Tekie, then product, then Founder's Office at Uolo, and now Lucidity." },
      { g: "About me", q: "Where did you start?", k: ["+start*", "+first job", "+began", "+intern*", "+beginning"],
        a: "Ops intern at Tekie, March 2020, right as the world shut down. I ran a team of 6 support executives, we ran 20k+ live online classes, and retention landed at 92% with 84% renewals. Good place to learn that customers notice everything." },
      { g: "About me", q: "What did you study?", k: ["+study", "+studied", "+degree", "+college", "+educat*", "+mithibai", "+bfm", "+b.f.m", "+financ*", "+gpa", "+school", "+dps"],
        a: "Financial Markets. A B.F.M. from Mithibai College, Mumbai, finished in 2022 with a 9.0 GPA. Before that, Delhi Public School, Bhilai. The finance background shows up every time I build a forecast." },
      { g: "About me", q: "Which languages do you speak?", k: ["+language*", "+hindi", "+english", "+speak"],
        a: "Hindi and English." },
      { g: "My work", q: "What's your best work?", k: ["+best work", "+proud*", "+favourite project", "+favorite project", "+best project", "+highlight"],
        a: "Probably the GTM knowledge base at Lucidity: one place where reps and AI agents read the same account and deal data, with a SQL chatbot and an MCP server on top. Around 50 people have used it. From earlier, demo auto-assignment at Tekie, because a bit of backend logic turned into a 30% bump in monthly revenue." },
      { g: "My work", q: "What's your best number?", k: ["+best number", "+number*", "+result*", "+impact", "+metric*", "+achiev*", "+kpi*"],
        a: "At Lucidity: CRM data-quality KRAs closed just above target, and an internal AI tool around 50 people have used. At Tekie: demo auto-assignment brought a 30% increase in monthly revenue. I keep Lucidity numbers approximate on purpose." },
      { g: "My work", q: "What is the GTM knowledge base?", k: ["+knowledge base", "+knowledge", "+wiki", "+mcp server", "+chatbot", "+sql"],
        a: "Lucidity's internal GTM wiki: accounts, deals, customers and playbooks in one place. A chatbot answers questions by actually running SQL on the data, and an MCP server lets AI agents like Claude read the same thing. I took over the codebase after launch and led v1.2. Around 50 people have used it since May 2026." },
      { g: "My work", q: "Tell me about the AI account research engine.", k: ["+account research", "+account brief*", "+briefs", "+research engine", "+abm", "+org chart"],
        a: "It's a set of Claude skills. Give it a company and it checks the company is still alive, maps the org chart, ranks the people who matter, finds which cloud they're on with evidence, pulls why-now signals, and writes the brief straight to Docs, HubSpot and the knowledge base. We got 100+ accounts briefed in under three weeks." },
      { g: "My work", q: "How did you fix HubSpot data quality?", k: ["+hubspot", "+crm", "+data quality", "+clean*", "+adherence", "+kra*"],
        a: "Boring answer, which is why it worked. An adherence process across 50+ deal and company properties, daily and weekly checks, and n8n plus HubSpot workflows that fix the predictable stuff automatically. The KRAs closed just above target, and I wrote it all down and handed the daily checks to a teammate." },
      { g: "My work", q: "What's the founder-led growth engine?", k: ["+founder-led", "+founder led", "+linkedin", "+founder brand", "+comment radar", "+radar"],
        a: "The Founder's LinkedIn, run as a system instead of 'post when inspired'. Strategy from studying a lot of posts, a daily AI radar that screens thousands of posts and surfaces the few worth a comment, outreach that turns engagement into conversations, and a weekly report that sends itself. Around 47k impressions in three months." },
      { g: "My work", q: "What are you doing on Reddit?", k: ["+reddit", "+community", "+subreddit", "+aeo", "+answer engine*", "+ai search", "+llm visibility"],
        a: "Two things. A community bet on Reddit, where the rule is be useful first and never pitch. And a baseline of whether AI answer engines (Claude, ChatGPT, Gemini, Perplexity) recommend us for real buyer questions: 10 questions, 4 engines, run twice, every answer archived. If people ask AI instead of Google now, you'd better know what AI says about you." },
      { g: "My work", q: "Tell me about the event ops system.", k: ["+event ops", "+ms ignite", "+ignite", "+event*", "+launch*", "+attribution"],
        a: "I took over a cross-team launch at MS Ignite 2026 that had nobody owning the tracking. Built a contact book synced nightly from Apollo and HubSpot, split metrics into process and outcome, and kept attribution to one simple rule. Pre-event reporting ended up about 90% automated, with zero new CRM fields. Now it's becoming the template for every event." },
      { g: "My work", q: "How did you automate commissions?", k: ["+commission*", "+payout*", "+comp ops", "+compensation"],
        a: "Monthly commissions for AEs, SEs and partners used to be done by hand. I built a workflow and a small system with Claude, Apps Script, HubSpot and Vercel that does the calculation from deal data. It's been live since August; I still look at each run before it goes out, because it's people's pay." },
      { g: "My work", q: "What did you build before Lucidity?", k: ["+before lucidity", "+side project*", "+whatsapp", "+inventory", "+d2c", "+shopify"],
        a: "Two builds for a D2C brand. A WhatsApp support agent that handles most customer questions (orders, returns, exchanges) and got first replies under a minute on the pilot. And a full inventory and dispatch system built in 4 weeks, without a tech team." },
      { g: "My work", q: "What did you do at Uolo?", k: ["+uolo", "+tekie acquisition", "+acquired", "+pilots", "+3 products", "+three products"],
        a: "Founder's Office, after Uolo acquired Tekie. I launched 3 new products from idea to commercialisation, led 15+ pilots across B2B and B2B2C, ran GTM for the new products, and kept an eye on unit economics: acquisition, retention, LTV." },
      { g: "My work", q: "Were you a product manager?", k: ["+product manager", "+pm", "+product management", "+developers", "+designers", "+prd*", "+roadmap*"],
        a: "Yes, at Tekie from October 2020 to November 2022. I owned product with 10 developers and 3 designers. Demo auto-assignment brought a 30% increase in monthly revenue, and the event system got 5k+ registrations in 2 months. I still write PRDs for my own tools, just shorter." },
      { g: "My work", q: "What was demo auto-assignment?", k: ["+demo*", "+auto-assign*", "+assignment", "+30%"],
        a: "At Tekie, demo classes were assigned by hand. I designed the backend logic that assigns them across several variables at once, plus automated reports for the prospects. It's credited with a 30% increase in monthly revenue, which still feels like a lot for a scheduling problem." },
      { g: "My work", q: "Have you ever had a project fail?", k: ["+fail*", "+mistake*", "+went wrong", "+didnt work", "+learn*", "+lesson*"],
        a: "Yes. We tested an AI SDR tool at Lucidity. Persona filtering and reminders worked, but about a third of the emails came out generic and the call scripts were thin. I wrote it up with a scorecard and recommended pausing it. Killing something cleanly is a result too." },
      { g: "My work", q: "Where can I read the case studies?", k: ["+case stud*", "+notion", "+portfolio", "+read more", "+all projects", "+more work"],
        a: "On my Notion portfolio. Every project there is written up properly: problem, what I built, results, what I'd do next. The 'See all projects on Notion' button in the Work section takes you there." },
      { g: "How I work", q: "How do you work?", k: ["+how do you work", "+approach", "+process", "+principle*", "+method*", "+habit*", "loop"],
        a: "Four habits. Ask why until the real problem shows up. Fix the cause once instead of the symptom every day. Close the loop: measure, feed back, adjust. And ship, because four weeks of done beats four months of perfect." },
      { g: "How I work", q: "How do you handle a messy problem?", k: ["+messy", "+ambigu*", "+problem solving", "+figure out", "+chaos", "+unclear"],
        a: "Write down what 'fixed' would look like first, then pull the actual data instead of trusting what everyone remembers. Usually the mess is three small problems wearing a trench coat. Pick the one that unblocks the others and start there." },
      { g: "How I work", q: "What's it like working with you?", k: ["+work with you", "+working with you", "+team player", "+colleague*", "+easy to work", "+personality"],
        a: "I'd like to think easy and fun. I own things end to end instead of forwarding them for approvals, I say early when something's slipping, and I start calls with a few minutes of chat, because it sets the tone for the rest." },
      { g: "How I work", q: "How do you work with founders?", k: ["+work with founder*", "+ceo", "+work with the ceo", "+with the founder", "+leadership", "+stakeholder*", "+senior"],
        a: "Direct and on time. I flag problems early so there are fewer surprises, I come with a recommendation along with the options, and I'm comfortable saying 'this isn't worth doing' when it isn't." },
      { g: "How I work", q: "How do you prioritise?", k: ["+prioriti*", "+priority", "+focus", "+too much", "+bandwidth"],
        a: "What's burning, then what unblocks the most people, then what compounds. I try to carry less work in progress than I want to; anything that's rolled over for two weeks gets closed or re-scoped." },
      { g: "How I work", q: "What's your biggest weakness?", k: ["+weakness*", "+improve", "+growth area*", "+bad at", "+feedback"],
        a: "I ship and move on too fast. In my last review I named it myself: for every tool I build, I should measure adoption and hours saved after it ships. I'm also learning to agree measurable goals for strategic work before starting it, not after." },
      { g: "How I work", q: "Do you manage people?", k: ["+manage*", "+team size", "+lead* a team", "+people management", "+mentor*"],
        a: "I've led a team of 6 support executives at Tekie and owned product with 10 developers and 3 designers. At Lucidity I onboarded and buddied a new hire and handed my recurring RevOps work to a teammate with proper docs." },
      { g: "Tools & AI", q: "What have you built with AI?", k: ["+built with ai", "+ai agent*", "+agent*", "+automat*", "+llm", "+gpt"],
        a: "At Lucidity: the GTM knowledge base with a SQL chatbot and MCP server, a Claude skill that researches accounts end to end, a daily LinkedIn radar for the Founder, and the systems behind event ops and commissions. Before that, a WhatsApp support agent for a D2C brand." },
      { g: "Tools & AI", q: "How do you use Claude?", k: ["+claude", "+anthropic", "+skills", "+scheduled task*", "+cowork"],
        a: "A lot. Custom skills for repeat work like account research, scheduled tasks that run every morning, artifacts that act as small dashboards, and MCP so Claude can read our own data. My rule: if I've done something manually three times, it becomes a skill." },
      { g: "Tools & AI", q: "What tools do you use?", k: ["+tool*", "+stack", "+software", "+apollo", "+gong", "+looker", "+sheets", "+apps script"],
        a: "For GTM and RevOps: HubSpot, Apollo, Gong, Looker Studio, Google Sheets with Apps Script. For AI and automation: Claude, n8n, Apify, OpenAI, Vercel. From my product days: Figma, Jira, Mixpanel and Notion. The logos are further down the page." },
      { g: "Tools & AI", q: "Do you code?", k: ["+code", "+coding", "+programm*", "+developer", "+python", "+javascript", "+technical", "+engineer*"],
        a: "Enough to be dangerous. I build with Apps Script, n8n, SQL and a bit of Python, and I lean on Claude for the heavy lifting. I've taken over a real codebase (the knowledge base) and shipped to production. GTM engineer is the honest label." },
      { g: "Tools & AI", q: "Why n8n?", k: ["+n8n", "+zapier", "+make.com", "+workflow*", "+integration*"],
        a: "It's flexible, it's cheap at our scale, and I can see exactly what each step did when something breaks. For anything that needs real logic I'll drop into code or Apps Script, but n8n is my default glue." },
      { g: "Tools & AI", q: "Is AI going to take GTM jobs?", k: ["+take jobs", "+replace", "+future of", "+ai jobs", "+opinion on ai", "+ai take"],
        a: "It'll take a lot of tasks. If you're good at the job, AI multiplies you, the way machines multiplied what one person could make. If your job was copy-pasting between tabs, yeah, that part is going away." },
      { g: "Tools & AI", q: "Is cold email dead?", k: ["+cold email*", "+outbound", "+cold call*", "+prospecting", "+sequences"],
        a: "Spray-and-pray cold email is. Deep research per account and per person still works, and it's much cheaper to do now with AI. That's basically why I built the account research engine." },
      { g: "Career & hiring", q: "What roles are you a fit for?", k: ["+fit for", "+roles", "+what kind of role", "+gtm engineer*", "+revops role", "+position*"],
        a: "Founder's Office, Chief of Staff, GTM engineering and RevOps, at a startup where the founder wants someone who'll own messy problems and build the system around them. Generalist roles, basically, where the job description is a bit vague on purpose." },
      { g: "Career & hiring", q: "Are you open to new opportunities?", k: ["+open to", "+opportunit*", "+looking for", "+job search", "+hiring", "+hire you", "+available", "+recruit*"],
        a: "I'm always happy to talk about interesting problems. Email me at omdubeyyy@gmail.com with a bit about the role and the team, and I'll reply myself." },
      { g: "Career & hiring", q: "Can I see your resume?", k: ["+resume", "+cv", "+download"],
        a: "Email me at omdubeyyy@gmail.com and I'll send the latest one. The Experience and Education sections on this page have the short version." },
      { g: "Career & hiring", q: "Why should we hire you?", k: ["+why should", "+should we hire", "+why you", "+why hire", "+stand out", "+different"],
        a: "Because I'll take the thing nobody owns, figure out what's actually broken, fix it, and leave a system and a doc behind so it stays fixed. And I'm easy to work with while doing it. My testimonials say roughly the same, in nicer words." },
      { g: "Career & hiring", q: "What are you looking for next?", k: ["+next", "+career goal*", "+where do you see", "+5 years", "+five years", "+ambition*", "+long term"],
        a: "More of the same, bigger: closer to founders, owning growth problems end to end, and building AI into how GTM teams actually work. I'll leave the five-year plan to people with better crystal balls." },
      { g: "Career & hiring", q: "Do you work remotely?", k: ["+remote", "+relocat*", "+open to relocation", "+hybrid", "+office", "+move", "+abroad"],
        a: "I'm in Gurugram and I've worked closely with US-based leadership for a while, so time zones don't scare me. For anything about relocating or setup, email me and let's talk specifics." },
      { g: "Career & hiring", q: "How do I reach you?", k: ["+contact", "+email", "+reach", "+get in touch", "+connect", "+linkedin profile", "+talk", "+call"],
        a: "Email is best: omdubeyyy@gmail.com. LinkedIn works too." },
      { g: "Off the clock", q: "What do you read?", k: ["+read*", "+book*", "+shelf", "+author*", "+favourite book", "+favorite book"],
        a: "My shelf is lower down the page, from Hooked and Zero to One to Shoe Dog and Thinking in Systems. Hover a spine for the cover; click it for my notes on Notion. Hooked is the one I'm reading now." },
      { g: "Off the clock", q: "What do you do outside work?", k: ["+outside work", "+hobb*", "+free time", "+weekend*", "+fun", "+travel*", "+interest*"],
        a: "Travel when I can, and an embarrassing amount of playing with new AI tools. I use Grok as a sort of personal assistant for reminders and nudges. I've also started posting on LinkedIn about how I actually use these tools." },
      { g: "Off the clock", q: "Do you post on LinkedIn?", k: ["+your linkedin", "+post*", "+content", "+personal brand", "+write"],
        a: "Yes, recently. Work learnings, AI and GTM tools, plus some travel and random takes. Same rule as the Founder's account: numbers over adjectives, and nothing that sounds like it was written by a robot." },
      { g: "Off the clock", q: "How did you build this site?", k: ["+this site", "+this website", "+built this", "+build this", "+portfolio site", "+framework"],
        a: "With Claude, a lot of back and forth on the looks. It's plain HTML, CSS and JavaScript, no framework, and there's a plain-Markdown version of the whole page for AI tools. Hit the { } button at the top to see it." },
      { g: "Off the clock", q: "Is this a real AI?", k: ["+real ai", "+chatgpt", "+are you ai", "+bot", "+live ai", "+how does this work"],
        a: "Nope. These are answers I wrote myself, matched to your question by keywords. If I haven't written yours down, you'll get a polite 404 and my email." }
    ],
    fallback: "Error 404: answer not found. I haven't written this one down yet. Email me at omdubeyyy@gmail.com and I'll answer it myself."
  }
};
