/* Optional legacy vector archive; these faces are no longer used by the site. */
const fs = require('node:fs');
const path = require('node:path');
const { deck } = require('../塔羅牌/deck.js');
const output = path.join(__dirname, '../artifacts/legacy-vector-cards');
fs.mkdirSync(output, { recursive: true });
const themes = {
  wands: { color: '#e6ad78', bg: '#30202a', symbol: '<path d="M-7 26 7-26M-4 4Q-24-5-13-18Q0-13-4 4M4-6Q25-13 16-25Q1-21 4-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  cups: { color: '#a4cee6', bg: '#172d40', symbol: '<path d="M-17-18H17L13 1Q0 19-13 1ZM0 12V25M-11 25H11M17-14Q33-15 24-1L14 4M-17-14Q-33-15-24-1L-14 4" fill="none" stroke="currentColor" stroke-width="2.5"/>' },
  swords: { color: '#d5c9eb', bg: '#28213d', symbol: '<path d="M0-30 8-16 4 12H-4L-8-16ZM-16 14H16M0 14V28M-5 28H5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>' },
  pentacles: { color: '#d9cb86', bg: '#20312b', symbol: '<circle r="25" fill="none" stroke="currentColor" stroke-width="2"/><path d="m0-20 12 36-31-23H19L-12 16Z" fill="none" stroke="currentColor" stroke-width="2"/>' }
};
const numerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X','PAGE','KNIGHT','QUEEN','KING'];
for (const card of deck.filter(card => card.arcana === 'minor')) {
  const theme = themes[card.suit];
  let artwork;
  if (card.rank <= 10) {
    const count = card.rank;
    const columns = count === 1 ? 1 : 2;
    const rows = Math.ceil(count / columns);
    artwork = Array.from({ length: count }, (_, i) => {
      const lastCentered = count % 2 && i === count - 1;
      const x = lastCentered || columns === 1 ? 150 : 100 + (i % 2) * 100;
      const y = rows === 1 ? 230 : 125 + Math.floor(i / columns) * (220 / (rows - 1));
      return `<g transform="translate(${x} ${y}) scale(${count === 1 ? 2 : .9})">${theme.symbol}</g>`;
    }).join('');
  } else {
    const emblems = {
      11: '<path d="m-23-18 23-20 23 20-23 25ZM-13 17h26v12h-26Z"/>',
      12: '<path d="m-24 22 5-35 20-23 20 12 6 22-23-6-12 30ZM-19-13-30-27l20 1"/>',
      13: '<path d="m-32-24 12 37h40l12-37-20 13L0-32-12-11ZM-20 22h40"/>',
      14: '<path d="m-34-22 12 39h44l12-39-20 12L0-35-14-10ZM-22 27h44M0-35v-15M-7-43H7"/>'
    };
    artwork = `<circle cx="150" cy="220" r="92" fill="none" stroke="currentColor" opacity=".35"/><g transform="translate(150 182) scale(1.35)" fill="none" stroke="currentColor" stroke-width="2">${emblems[card.rank]}</g><g transform="translate(150 284) scale(1.25)">${theme.symbol}</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 480" role="img" aria-labelledby="title"><title id="title">${card.name.en}</title><defs><radialGradient id="glow"><stop stop-color="${theme.color}" stop-opacity=".15"/><stop offset="1" stop-color="${theme.color}" stop-opacity="0"/></radialGradient></defs><rect width="300" height="480" rx="16" fill="${theme.bg}"/><rect x="12" y="12" width="276" height="456" rx="10" fill="none" stroke="${theme.color}" opacity=".65"/><rect x="20" y="20" width="260" height="440" rx="7" fill="none" stroke="${theme.color}" opacity=".25"/><ellipse cx="150" cy="230" rx="145" ry="195" fill="url(#glow)"/><g fill="${theme.color}" font-family="Georgia,serif" text-anchor="middle"><text x="150" y="66" font-size="21" letter-spacing="4">${numerals[card.rank - 1]}</text><text x="150" y="411" font-size="15" letter-spacing="1">${card.name.en.toUpperCase()}</text><path d="m150 430 4 6-4 6-4-6Z"/></g><g color="${theme.color}">${artwork}</g><g fill="${theme.color}"><circle cx="40" cy="40" r="2"/><circle cx="260" cy="40" r="2"/><circle cx="40" cy="440" r="2"/><circle cx="260" cy="440" r="2"/></g></svg>\n`;
  fs.writeFileSync(path.join(output, `${card.id}.svg`), svg);
}
console.log('Generated 56 minor arcana SVG faces.');
