# Tarot Card · 塔羅牌占卜

[Link to Tarot Card Website](https://play-tarot-card.netlify.app/)

A static, bilingual tarot website with a choice of 22 major arcana or all 78 cards, upright/reversed meanings, single-card readings, and a Past / Present / Future spread. Traditional Chinese and dark mode are the defaults.

## How to Use

1. Enter your question, choose the **22-card major arcana** or **78-card full deck**, and select **Single-card guidance** or **Past / Present / Future**.
2. Select one or three cards from the six face-down choices. Choices are shuffled from your selected deck; a spread never repeats a card.
3. In a three-card reading, the first selection represents the past, the second the present, and the third the future. The question is locked after the first draw.
4. Complete your spread, then copy the generated AI prompt. It includes your question, each card's position, orientation, and matching meanings.
5. Open Gemini or DeepSeek and paste the prompt to request an interpretation. The website does not call an AI API itself.
6. Use **Shuffle again** to start over. The checkbox controls whether to keep your question. Changing the deck or spread also starts a new reading, but always preserves your question. The keep-question checkbox applies only to Shuffle again.
7. Use **View card** beside a result to inspect the artwork at a larger size. Close the preview with its button, the backdrop, or Escape.

Use the header controls to switch between **Chinese / English** and dark / light mode. The Chinese interface remains Traditional Chinese; its menu label is English so visitors can recognize the language selector. Switching language also translates an existing reading and regenerates the AI prompt without redrawing. Language, theme, deck, and the keep-question preference are saved locally when browser storage is available.

The mobile layout uses compact controls, six cards in two rows, 44px touch targets, and two side-by-side AI links below a full-width copy button. Only the six dealt faces are preloaded; smaller delivery images keep mobile downloads manageable.

The interface follows a three-step reading flow with a midnight-blue / champagne-gold palette (and a warm light theme). Optional question suggestions help you get started; validation appears beside the question. Completed readings include artwork thumbnails and a direct link to the results. AI tools appear after the spread is complete, with the generated prompt in an expandable panel that is open by default. If automatic copying fails, that panel opens and selects the prompt for manual copying.

## Changelog

### v2.0 (2026/10/31)

- Completed all 78 bilingual cards with upright and reversed meanings; choose 22 major arcana or the full 78-card deck.
- Added single-card guidance and Past / Present / Future spreads with no duplicate cards in a reading.
- Added 56 ChatGPT-generated minor arcana illustrations matching the original starry, gold-framed engraved style; original major arcana artwork remains credited to Gemini.
- Added Traditional Chinese (default) / English and dark (default) / light themes. Language options read Chinese / English; language, theme, deck, and reset preferences are saved locally.
- Redesigned the interface in midnight blue and champagne gold, with a three-step reading flow, question suggestions, inline validation, artwork thumbnails, and a shortcut to results.
- Improved mobile layouts, touch targets, and keyboard access, with large card previews.
- Added gentle theme transitions, button press feedback, copy-success feedback, reading entrance animations, and animated card preview opening and closing.
- Changing the deck or spread preserves the question. Only Shuffle again uses the keep-question preference to decide whether to clear it.
- AI tools appear after the spread is complete. Prompts include the question, positions, orientations, and matching meanings; the prompt panel opens by default, with manual copying available if automatic copying fails.
- Optimized delivery artwork and preloaded only six dealt faces for faster mobile loading, while preserving full-resolution originals.
- Added an expandable bilingual changelog and automated deck-rule and desktop/mobile browser checks.
- Change webpage URL

### v1.3 (2026/08/30)

- Preloaded images for smoother card draws.
- Added an option to keep or clear the question during reset.
- Fixed placeholders appearing after reset.

### v1.2 (2026/03/20)

- Redesigned major UI components.
- Added reversed-position hashtags and fixed typos.
- Optimized the interface for small screens.

### v1.1 (2026/03/20)

- Added reset, a DeepSeek shortcut, and a version number.
- Updated the single-card draw limit to one.

