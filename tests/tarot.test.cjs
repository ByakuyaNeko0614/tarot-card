const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { deck, getDeck, createSession, drawCard, buildPrompt } = require('../塔羅牌/deck.js');

test('78 unique bilingual cards, complete meanings and local artwork', () => {
  assert.equal(deck.length, 78);
  assert.equal(new Set(deck.map(card => card.id)).size, 78);
  assert.equal(deck.filter(card => card.arcana === 'major').length, 22);
  for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
    assert.deepEqual(deck.filter(card => card.suit === suit).map(card => card.rank), Array.from({ length: 14 }, (_, i) => i + 1));
  }
  for (const card of deck) {
    for (const language of ['zh', 'en']) {
      assert.ok(card.name[language]);
      assert.equal(card.upright[language].split(' ').length, 3, card.id);
      assert.equal(card.reversed[language].split(' ').length, 3, card.id);
    }
    assert.ok(fs.statSync(path.join(__dirname, '../塔羅牌', card.image)).size > 0);
  }
});

test('blank questions, invalid slots and repeated selections do not consume draws', () => {
  const session = createSession('three');
  for (const slot of [-1, 6, 1.5, NaN]) assert.equal(drawCard(session, slot, 'Question'), null);
  assert.equal(drawCard(session, 0, ' \n\t'), null);
  assert.equal(session.draws.length, 0);
  assert.ok(drawCard(session, 0, '  Original question  ', () => 0));
  assert.equal(drawCard(session, 0, 'Changed question'), null);
  assert.equal(session.draws.length, 1);
  assert.equal(session.question, 'Original question');
  assert.equal(buildPrompt(session, 'zh'), '');
});

test('single-card readings lock after one selection and retain the question snapshot', () => {
  const session = createSession();
  const draw = drawCard(session, 3, 'My question', () => 0.9);
  assert.equal(draw.isUpright, false);
  assert.equal(drawCard(session, 2, 'Another question'), null);
  const prompt = buildPrompt(session, 'en');
  assert.ok(prompt.includes('My question'));
  assert.ok(prompt.includes(draw.card.name.en));
  assert.ok(prompt.includes('Reversed'));
  assert.ok(prompt.includes(draw.card.reversed.en));
  assert.ok(!prompt.includes(draw.card.upright.en));
});

test('three-card readings use draw order for past, present and future in both languages', () => {
  const session = createSession('three');
  for (const slot of [5, 1, 3]) drawCard(session, slot, 'Original', () => slot === 1 ? 0.9 : 0);
  assert.equal(new Set(session.draws.map(draw => draw.card.id)).size, 3);
  assert.equal(drawCard(session, 2, 'Changed'), null);
  assert.equal(session.question, 'Original');
  for (const language of ['zh', 'en']) {
    const prompt = buildPrompt(session, language);
    const positions = language === 'zh' ? ['過去', '現在', '未來'] : ['Past', 'Present', 'Future'];
    session.draws.forEach((draw, i) => assert.ok(prompt.includes(`${positions[i]}: ${draw.card.name[language]}`)));
    assert.ok(prompt.includes(session.draws[1].card.reversed[language]));
    assert.ok(prompt.includes(language === 'zh' ? '繁體中文' : 'respond in English'));
  }
});

test('shuffling reaches every card and never duplicates a face within a spread', () => {
  let seed = 20261031;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const seen = new Set();
  for (let i = 0; i < 1000; i++) {
    const session = createSession('three', random);
    assert.equal(new Set(session.cards.map(card => card.id)).size, 6);
    session.cards.forEach(card => seen.add(card.id));
  }
  assert.equal(seen.size, 78);
  assert.throws(() => createSession('unknown'));
});

test('22-card deck contains only major arcana and supports both spreads', () => {
  const majorDeck = getDeck('major');
  assert.equal(majorDeck.length, 22);
  assert.ok(majorDeck.every(card => card.arcana === 'major'));
  assert.equal(getDeck('full').length, 78);
  assert.throws(() => getDeck('unknown'));
  assert.throws(() => createSession('single', Math.random, 'unknown'));
  for (const mode of ['single', 'three']) {
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      const session = createSession(mode, Math.random, 'major');
      assert.equal(session.deckType, 'major');
      assert.equal(session.deckSize, 22);
      assert.equal(new Set(session.cards.map(card => card.id)).size, 6);
      assert.ok(session.cards.every(card => card.arcana === 'major'));
      session.cards.forEach(card => seen.add(card.id));
      for (let slot = 0; slot < session.limit; slot++) drawCard(session, slot, 'Major arcana reading');
      assert.equal(session.draws.length, mode === 'three' ? 3 : 1);
      assert.ok(buildPrompt(session, 'en').includes('Major arcana reading'));
    }
    assert.equal(seen.size, 22);
  }
  // Mutating a returned deck must never change either source deck.
  majorDeck.pop();
  assert.equal(getDeck('major').length, 22);
  assert.equal(deck.length, 78);
});
