/* Browser controller; the deck and reading rules live in deck.js. */
(() => {
  "use strict";
  const translations = {
    zh: {
      brand: "白夜貓塔羅", language: "語言", title: "讓直覺，為你引路。", pageTitle: "塔羅牌占卜 · 白夜貓",
      stepQuestion: "寫下問題", stepDraw: "憑直覺抽牌", stepRead: "閱讀指引", ideas: "還沒有靈感？",
      topicGrowth: "自我成長", topicWork: "工作方向", topicLove: "關係探索",
      ideaGrowth: "現在的我，可以如何更好地照顧自己？", ideaWork: "面對工作中的下一步，我可以留意什麼？", ideaLove: "在這段關係中，我需要理解什麼？",
      settingsNote: "更換牌組或牌陣會重新開始這次占卜。", readResult: "查看我的指引 ↓",
      emptyHint: "每一次提問，都是重新認識自己的起點。你的牌義會在抽牌後出現在這裡。",
      interpretationIntro: "想再深入一點？複製指令後，開啟 AI 並貼上，延續這段探索。", showPrompt: "查看解讀指令",
      eyebrow: "{count} 張牌・一段與自己的對話", intro: "靜下心，讓直覺帶你找到此刻的指引。",
      questionLabel: "你想探索什麼？", questionPlaceholder: "在心中默念疑問，並在此輸入…",
      spreadLabel: "選擇牌陣", single: "單張指引", three: "過去・現在・未來",
      deckLabel: "選擇牌組", majorDeck: "22 張・大阿爾克那", fullDeck: "78 張・完整牌組", deckChanged: "已切換牌組並重新洗牌。",
      viewCard: "放大牌面", closePreview: "關閉",
      reading: "你的牌面", empty: "指引將在此顯現", complete: "你的指引已揭曉", partial: "繼續抽牌，完成你的牌陣",
      promptLabel: "複製以下指令，請 AI 為你解牌：", promptPlaceholder: "完成抽牌後，AI 占卜指令會顯示在這裡…",
      copy: "📋 複製指令", copied: "✓ 複製成功！", copyFailed: "無法自動複製，已選取指令，請手動複製。",
      gemini: "✨ Gemini ↗", deepseek: "🐳 DeepSeek ↗", keepQuestion: "重置時保留問題", reset: "↻ 重新洗牌",
      changelog: "更新紀錄", credits: "大阿爾克那圖片由 Gemini 生成；小阿爾克那圖片由 ChatGPT 生成。網頁由白夜貓創作。",
      light: "☀ 淺色模式", dark: "☾ 深色模式", upright: "正位", reversed: "逆位", past: "過去", present: "現在", future: "未來",
      instructionSingle: "抽一張第一眼就看中的牌。", instructionThree: "依序抽三張牌，探索過去、現在與未來。",
      questionRequired: "請先輸入你想問的問題。", resetDone: "已重新洗牌，可以開始新的占卜。", modeChanged: "已切換牌陣並重新洗牌。",
      spread: "塔羅牌", cardBack: "塔羅牌背面", drawCard: "選擇第 {n} 張牌", progress: "已抽 {count} / {limit} 張", deckInfo: "{count} 張牌隨機洗牌",
      history: [
        ["v2.0 · 2026/10/31", ["完整 78 張雙語塔羅牌與正逆位牌義，可選擇 22 張大阿爾克那或 78 張完整牌組。", "支援單張指引與過去／現在／未來三張牌陣，同一牌陣不會重複抽牌。", "56 張小阿爾克那由 ChatGPT 生成，延續原有大阿爾克那的星空、金框與版畫風格；原有大阿爾克那由 Gemini 生成。", "新增繁體中文（預設）／英文與深色（預設）／淺色模式；語言選單顯示 Chinese／English，並記住語言、外觀、牌組與重置偏好。", "重新設計深藍與香檳金介面，加入三步占卜進度、問題靈感、就地驗證提示、牌面縮圖與結果捷徑。", "優化手機排版、觸控區域與鍵盤操作，提供可放大的牌面預覽。", "新增柔和的主題漸變、按鈕按壓、複製成功回饋、解讀進場與牌面視窗開關動畫。", "切換牌組或單／三張模式會保留問題；只有重新洗牌才依保留問題設定決定是否清除。", "完成抽牌後顯示 AI 工具，指令包含問題、牌位、正逆位與對應牌義，指令面板預設展開；無法自動複製時可手動複製。", "壓縮牌面圖片並僅預載六張候選牌，加快手機載入；保留完整原圖。", "新增可展開的雙語更新紀錄，以及牌組規則與桌面／手機瀏覽器自動檢查。"]],
        ["v1.3 · 2026/08/30", ["預載牌面圖片，讓翻牌動畫更順暢。", "重置時可保留或清除問題。", "修正重置後顯示預留文字的問題。"]],
        ["v1.2 · 2026/03/20", ["重新設計介面，優化小螢幕操作。", "新增逆位關鍵字並修正錯字。"]],
        ["v1.1 · 2026/03/20", ["新增重置按鈕、DeepSeek 捷徑與版本編號。", "單張模式每次占卜限抽一張牌。"]]
      ]
    },
    en: {
      brand: "Byakuya Neko Tarot", language: "Language", title: "Let intuition lead the way.", pageTitle: "Tarot Reading · Byakuya Neko",
      stepQuestion: "Set an intention", stepDraw: "Choose your cards", stepRead: "Find your guidance", ideas: "Need inspiration?",
      topicGrowth: "Personal growth", topicWork: "Work & purpose", topicLove: "Relationships",
      ideaGrowth: "How can I take better care of myself right now?", ideaWork: "What can I pay attention to as I take my next step at work?", ideaLove: "What do I need to understand in this relationship?",
      settingsNote: "Changing the deck or spread starts a new reading.", readResult: "Explore my reading ↓",
      emptyHint: "Every question is a chance to understand yourself anew. Your card meanings will appear here after you draw.",
      interpretationIntro: "Go a little deeper. Copy your prompt, open an AI tool, and paste it to continue exploring.", showPrompt: "View reading prompt",
      eyebrow: "{count} CARDS · A CONVERSATION WITH YOURSELF", intro: "Take a breath. Let your intuition guide you.",
      questionLabel: "What would you like to explore?", questionPlaceholder: "Think about your question and enter it here…",
      spreadLabel: "Choose your spread", single: "Single-card guidance", three: "Past · Present · Future",
      deckLabel: "Choose your deck", majorDeck: "22 cards · Major arcana", fullDeck: "78 cards · Full deck", deckChanged: "Deck changed and shuffled.",
      viewCard: "View card", closePreview: "Close",
      reading: "YOUR READING", empty: "Your guidance will appear here", complete: "Your guidance is revealed", partial: "Keep drawing to complete your spread",
      promptLabel: "Copy this prompt and ask AI to interpret your cards:", promptPlaceholder: "Your AI prompt will appear after you complete the spread…",
      copy: "📋 Copy prompt", copied: "✓ Prompt copied!", copyFailed: "Automatic copying is unavailable. The prompt is selected; please copy it manually.",
      gemini: "✨ Gemini ↗", deepseek: "🐳 DeepSeek ↗", keepQuestion: "Keep question when resetting", reset: "↻ Shuffle again",
      changelog: "Changelog", credits: "Major arcana images generated with Gemini. Minor arcana images generated with ChatGPT. Website by Byakuya Neko.",
      light: "☀ Light mode", dark: "☾ Dark mode", upright: "Upright", reversed: "Reversed", past: "Past", present: "Present", future: "Future",
      instructionSingle: "Choose the card that first catches your eye.", instructionThree: "Choose three cards in order: past, present, then future.",
      questionRequired: "Please enter your question first.", resetDone: "The deck is shuffled. Start a new reading.", modeChanged: "Spread changed and deck shuffled.",
      spread: "Tarot cards", cardBack: "Tarot card back", drawCard: "Choose card {n}", progress: "Drawn {count} / {limit}", deckInfo: "Shuffled from the {count}-card deck",
      history: [
        ["v2.0 · 2026/10/31", ["Completed all 78 bilingual cards with upright and reversed meanings; choose 22 major arcana or the full 78-card deck.", "Added single-card guidance and Past / Present / Future spreads with no duplicate cards in a reading.", "Added 56 ChatGPT-generated minor arcana illustrations matching the original starry, gold-framed engraved style; original major arcana artwork remains credited to Gemini.", "Added Traditional Chinese (default) / English and dark (default) / light themes. Language options read Chinese / English; language, theme, deck, and reset preferences are saved locally.", "Redesigned the interface in midnight blue and champagne gold, with a three-step reading flow, question suggestions, inline validation, artwork thumbnails, and a shortcut to results.", "Improved mobile layouts, touch targets, and keyboard access, with large card previews.", "Added gentle theme transitions, button press feedback, copy-success feedback, reading entrance animations, and animated card preview opening and closing.", "Changing the deck or spread preserves the question. Only Shuffle again uses the keep-question preference to decide whether to clear it.", "AI tools appear after the spread is complete. Prompts include the question, positions, orientations, and matching meanings; the prompt panel opens by default, with manual copying available if automatic copying fails.", "Optimized delivery artwork and preloaded only six dealt faces for faster mobile loading, while preserving full-resolution originals.", "Added an expandable bilingual changelog and automated deck-rule and desktop/mobile browser checks."]],
        ["v1.3 · 2026/08/30", ["Preloaded card artwork for smoother reveals.", "Added a choice to keep or clear the question on reset.", "Fixed placeholders appearing after reset."]],
        ["v1.2 · 2026/03/20", ["Redesigned the interface and improved small-screen layouts.", "Added reversed keywords and corrected typos."]],
        ["v1.1 · 2026/03/20", ["Added reset, a DeepSeek shortcut and a version number.", "Limited single-card readings to one draw."]]
      ]
    }
  };
  const $ = id => document.getElementById(id);
  function loadPreference(key, fallback) {
    try { return localStorage.getItem(`tarot-${key}`) ?? fallback; } catch { return fallback; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(`tarot-${key}`, value); } catch { /* Private browsing may disable storage. */ }
  }
  let language = loadPreference("language", "zh") === "en" ? "en" : "zh";
  let theme = loadPreference("theme", "dark") === "light" ? "light" : "dark";
  const savedDeck = loadPreference("deck", "full") === "major" ? "major" : "full";
  let session = Tarot.createSession("single", Math.random, savedDeck);
  let noticeKey = "";
  const cardButtons = [];
  const t = key => translations[language][key];
  const orientation = draw => t(draw.isUpright ? "upright" : "reversed");
  const cardLabel = draw => `${draw.card.name[language]} (${orientation(draw)})`;
  let previewAnimation;
  function openPreview() {
    previewAnimation?.cancel();
    $("cardPreview").showModal();
    previewAnimation = $("cardPreview").animate([
      { opacity: 0, transform: "translateY(24px) scale(.94)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ], { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" });
  }
  async function closePreview() {
    previewAnimation?.cancel();
    if (!$("cardPreview").open) return;
    const animation = $("cardPreview").animate([
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(14px) scale(.97)" }
    ], { duration: 200, easing: "ease-in" });
    previewAnimation = animation;
    try { await animation.finished; } catch { return; }
    if (previewAnimation === animation) $("cardPreview").close();
  }
  $("keepQuestion").checked = loadPreference("keep-question", "true") !== "false";

  function showNotice(key) {
    noticeKey = key;
    $("notice").textContent = key ? t(key) : "";
    $("questionError").hidden = key !== "questionRequired";
    $("questionError").textContent = key === "questionRequired" ? t(key) : "";
    $("copyBtn").textContent = t(key === "copied" ? "copied" : "copy");
    if (key === "copied") $("copyBtn").animate([
      { transform: "scale(1)" }, { transform: "scale(1.035)" }, { transform: "scale(1)" }
    ], { duration: 360, easing: "ease-out" });
  }

  function renderJourney() {
    const complete = session.draws.length === session.limit;
    const active = complete ? 2 : $("question").value.trim() ? 1 : 0;
    ["stepQuestion", "stepDraw", "stepRead"].forEach((id, index) => {
      $(id).classList.toggle("active", index === active);
      $(id).classList.toggle("done", index < active);
      if (index === active) $(id).setAttribute("aria-current", "step");
      else $(id).removeAttribute("aria-current");
    });
  }

  function createCards() {
    cardButtons.length = 0;
    $("cardSpread").replaceChildren();
    session.cards.forEach((_, slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tarot-card";
      const front = document.createElement("span");
      front.className = "card-front";
      front.setAttribute("aria-hidden", "true");
      const back = document.createElement("span");
      back.className = "card-back";
      back.setAttribute("aria-hidden", "true");
      const image = new Image();
      image.src = "back.png";
      image.alt = "";
      image.draggable = false;
      back.append(image);
      button.append(front, back);
      button.addEventListener("click", () => selectCard(slot));
      cardButtons.push(button);
      $("cardSpread").append(button);
    });
    preloadSessionImages();
  }

  function selectCard(slot) {
    if (!session.draws.length && !$("question").value.trim()) {
      showNotice("questionRequired");
      $("question").setAttribute("aria-invalid", "true");
      $("question").focus();
      return;
    }
    const draw = Tarot.drawCard(session, slot, $("question").value);
    if (!draw) return;
    $("question").removeAttribute("aria-invalid");
    const front = cardButtons[slot].querySelector(".card-front");
    const image = new Image();
    image.src = draw.card.image;
    image.alt = cardLabel(draw);
    image.draggable = false;
    front.append(image);
    front.classList.toggle("reversed", !draw.isUpright);
    cardButtons[slot].classList.add("flipped");
    showNotice("");
    renderReading();
  }

  function renderReading() {
    const complete = session.draws.length === session.limit;
    renderJourney();
    $("interpretationTools").hidden = !complete;
    $("readingLink").hidden = !complete;
    $("emptyHint").hidden = session.draws.length > 0;
    $("questionIdeas").hidden = session.draws.length > 0;
    $("result").classList.toggle("has-reading", session.draws.length > 0);
    $("cardSpread").classList.toggle("is-complete", complete);
    $("question").disabled = session.draws.length > 0;
    $("copyBtn").disabled = !complete;
    $("cardName").textContent = t(!session.draws.length ? "empty" : complete ? "complete" : "partial");
    $("drawInstruction").textContent = t(complete ? "complete" : session.mode === "three" ? "instructionThree" : "instructionSingle");
    $("progress").textContent = `${t("progress").replace("{count}", session.draws.length).replace("{limit}", session.limit)} · ${t("deckInfo").replace("{count}", session.deckSize)}`;
    document.querySelector('[data-i18n="eyebrow"]').textContent = t("eyebrow").replace("{count}", session.deckSize);
    $("deckType").value = session.deckType;
    $("readingCards").replaceChildren();
    session.draws.forEach((draw, index) => {
      const article = document.createElement("article");
      article.className = "reading-card";
      const heading = document.createElement("h3");
      const position = document.createElement("span");
      position.className = "position-label";
      position.textContent = session.mode === "three" ? t(["past", "present", "future"][index]) : t("single");
      heading.append(position, document.createTextNode(cardLabel(draw)));
      const titleRow = document.createElement("div");
      titleRow.className = "reading-title-row";
      const preview = document.createElement("button");
      preview.type = "button";
      preview.className = "preview-btn";
      preview.textContent = t("viewCard");
      preview.setAttribute("aria-label", `${t("viewCard")}: ${cardLabel(draw)}`);
      preview.addEventListener("click", () => {
        $("previewTitle").textContent = cardLabel(draw);
        $("previewImage").src = draw.card.image;
        $("previewImage").alt = cardLabel(draw);
        $("previewImage").classList.toggle("reversed", !draw.isUpright);
        openPreview();
      });
      titleRow.append(heading, preview);
      const meanings = document.createElement("p");
      meanings.textContent = draw.card[draw.isUpright ? "upright" : "reversed"][language];
      const thumbnail = document.createElement("img");
      thumbnail.className = "reading-thumbnail";
      thumbnail.src = draw.card.image;
      thumbnail.alt = "";
      thumbnail.classList.toggle("reversed", !draw.isUpright);
      const content = document.createElement("div");
      content.className = "reading-content";
      content.append(titleRow, meanings);
      article.append(thumbnail, content);
      $("readingCards").append(article);
    });
    cardButtons.forEach((button, slot) => {
      const draw = session.draws.find(item => item.slot === slot);
      button.disabled = complete || Boolean(draw);
      button.setAttribute("aria-label", draw ? cardLabel(draw) : t("drawCard").replace("{n}", slot + 1));
      const image = button.querySelector(".card-front img");
      if (image && draw) image.alt = cardLabel(draw);
    });
    $("AIPrompt").value = Tarot.buildPrompt(session, language);
  }

  function renderLanguage() {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    document.title = t("pageTitle");
    $("language").value = language;
    document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-placeholder]").forEach(node => { node.placeholder = t(node.dataset.placeholder); });
    $("cardSpread").setAttribute("aria-label", t("spread"));
    document.querySelector(".journey").setAttribute("aria-label", language === "zh" ? "占卜進度" : "Reading progress");
    $("changelogContent").replaceChildren();
    t("history").forEach(([version, changes]) => {
      const heading = document.createElement("h3");
      heading.textContent = version;
      const list = document.createElement("ul");
      changes.forEach(change => {
        const item = document.createElement("li");
        item.textContent = change;
        list.append(item);
      });
      $("changelogContent").append(heading, list);
    });
    renderTheme();
    renderReading();
    showNotice(noticeKey);
  }

  function renderTheme() {
    document.documentElement.dataset.theme = theme;
    $("themeBtn").textContent = t(theme === "dark" ? "light" : "dark");
    $("themeBtn").setAttribute("aria-pressed", String(theme === "light"));
  }

  function resetReading(mode = session.mode, message = "resetDone", deckType = session.deckType) {
    previewAnimation?.cancel();
    $("cardPreview").close();
    session = Tarot.createSession(mode, Math.random, deckType);
    if (message === "resetDone" && !$("keepQuestion").checked) $("question").value = "";
    $("question").removeAttribute("aria-invalid");
    document.querySelector(".prompt-details").open = true;
    createCards();
    renderReading();
    showNotice(message);
  }

  $("question").addEventListener("input", () => {
    $("question").removeAttribute("aria-invalid");
    if (noticeKey === "questionRequired") showNotice("");
    renderJourney();
  });
  $("question").setAttribute("aria-describedby", "questionError");
  document.querySelectorAll("[data-question]").forEach(button => {
    button.addEventListener("click", () => {
      $("question").value = t(button.dataset.question);
      $("question").dispatchEvent(new Event("input"));
      $("question").focus();
    });
  });
  $("language").addEventListener("change", event => {
    language = event.target.value === "en" ? "en" : "zh";
    savePreference("language", language);
    renderLanguage();
  });
  $("themeBtn").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    savePreference("theme", theme);
    renderTheme();
  });
  $("keepQuestion").addEventListener("change", () => savePreference("keep-question", String($("keepQuestion").checked)));
  $("deckType").addEventListener("change", event => {
    const deckType = event.target.value === "major" ? "major" : "full";
    savePreference("deck", deckType);
    resetReading(session.mode, "deckChanged", deckType);
  });
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", () => resetReading(radio.value, "modeChanged"));
  });
  $("resetBtn").addEventListener("click", () => resetReading());
  $("closePreview").addEventListener("click", closePreview);
  $("cardPreview").addEventListener("cancel", event => {
    event.preventDefault();
    closePreview();
  });
  $("cardPreview").addEventListener("click", event => {
    if (event.target === $("cardPreview")) closePreview();
  });
  document.addEventListener("click", event => {
    const control = event.target.closest(".quiet-btn, .action-btn, .preview-btn, [data-question], .mode-picker label");
    if (!control || control.disabled) return;
    control.animate([
      { transform: "scale(.96)" }, { transform: "scale(1)" }
    ], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
  });
  $("copyBtn").addEventListener("click", async () => {
    if (!$("AIPrompt").value) return;
    const copyingSession = session;
    const copyingLanguage = language;
    try {
      await navigator.clipboard.writeText($("AIPrompt").value);
      if (session === copyingSession && language === copyingLanguage) showNotice("copied");
    } catch {
      if (session !== copyingSession || language !== copyingLanguage) return;
      document.querySelector(".prompt-details").open = true;
      $("AIPrompt").focus();
      $("AIPrompt").select();
      showNotice("copyFailed");
    }
  });
  // Preload only the six dealt choices; the remaining full-size art is not needed.
  let preloadedImages = [];
  function preloadSessionImages() {
    preloadedImages = session.cards.map(card => {
      const image = new Image();
      image.decoding = "async";
      image.src = card.image;
      return image;
    });
  }
  createCards();
  renderLanguage();
})();
