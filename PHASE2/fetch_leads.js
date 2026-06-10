#!/usr/bin/env node
/**
 * fetch_leads.js v2 — Pushshift-based Reddit Lead Generator
 * 
 * Uses Pushshift.io (public, unauthenticated, CORS-friendly) to
 * find recent threads matching SMC/ICT/trading indicator keywords.
 *
 * Pushshift doesn't block like Reddit's native API.
 *
 * Usage: node fetch_leads.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'leads_output.txt');

const TARGET_SUBREDDITS = ['TradingView', 'algotrading', 'Forex', 'CryptoMarkets', 'Daytrading'];

const QUERIES = [
  'SMC indicator',
  'fair value gap',
  'order block',
  'liquidity sweep',
  'ICT trading',
  'smart money concepts',
  'pine script v5',
  'TradingView indicator',
];

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SMCLeadGen/2.0; +smc-pro-pack.surge.sh)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

/**
 * Pushshift submission search — returns submissions with keyword in title
 */
async function searchPushshift(subreddit, keyword) {
  const encoded = encodeURIComponent(keyword);
  const url = `https://api.pushshift.io/reddit/submission/search/?subreddit=${subreddit}&q=${encoded}&size=15&sort=desc&sort_type=created_utc&aggs=created_utc&metadata=true`;

  try {
    const raw = await fetchURL(url);
    const data = JSON.parse(raw);

    if (!data.data || data.data.length === 0) return [];

    return data.data
      .filter(post => post.title && !post.is_self === false) // ensure it's a text/link post
      .map(post => ({
        type: 'pushshift',
        title: post.title || '(no title)',
        url: post.full_link || `https://reddit.com/r/${subreddit}/comments/${post.id}/`,
        subreddit: post.subreddit,
        score: post.score || 0,
        comments: post.num_comments || 0,
        created_utc: post.created_utc,
        keyword_matched: keyword,
        domain: post.domain || 'self',
      }));
  } catch (e) {
    console.error(`  [!] Pushshift error r/${subreddit} "${keyword}": ${e.message}`);
    return [];
  }
}

function formatDate(ts) {
  return new Date(ts * 1000).toISOString().replace('T', ' ').split('.')[0];
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  SMC Pro Pack — Pushshift Lead Gen v2      ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  console.log(`Target subreddits: ${TARGET_SUBREDDITS.join(', ')}`);
  console.log(`Queries: ${QUERIES.join(', ')}\n`);

  const allLeads = [];
  const seen = new Set();

  for (const sub of TARGET_SUBREDDITS) {
    for (const q of QUERIES) {
      process.stdout.write(`  r/${sub} → "${q}"... `);
      const results = await searchPushshift(sub, q);
      console.log(`${results.length} leads`);
      for (const r of results) {
        if (!seen.has(r.url)) {
          seen.add(r.url);
          allLeads.push(r);
        }
      }
      // Be respectful to Pushshift
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`Total unique leads found: ${allLeads.length}`);
  console.log(`═══════════════════════════════════════════════\n`);

  allLeads.sort((a, b) => (b.score + b.comments) - (a.score + a.comments));

  const lines = [];
  lines.push('╔══════════════════════════════════════════════════════════╗');
  lines.push('║  SMC Pro Pack — Reddit Leads (Pushshift)               ║');
  lines.push(`║  Generated: ${new Date().toISOString()}               ║`);
  lines.push('╚══════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`Total: ${allLeads.length}`);
  lines.push('');

  let i = 0;
  for (const lead of allLeads) {
    i++;
    lines.push(`[${i}] ${lead.title}`);
    lines.push(`    URL: ${lead.url}`);
    lines.push(`    r/${lead.subreddit} | ${lead.score} pts/${lead.comments} cmts | ${formatDate(lead.created_utc)}`);
    lines.push(`    Matched: "${lead.keyword_matched}"`);
    lines.push('');
  }

  lines.push('── Quick Links ──');
  for (const lead of allLeads.slice(0, 30)) {
    lines.push(lead.url);
  }
  lines.push('');
  lines.push('── SMC Pro Pack ──');
  lines.push('https://smc-pro-pack.surge.sh');
  lines.push('');

  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf8');
  console.log(`✅ Exported to ${OUTPUT_FILE}\n`);

  console.log('── Top 10 Quick Links ──');
  for (const lead of allLeads.slice(0, 10)) {
    console.log(`  ${lead.url}`);
  }
  console.log('');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});