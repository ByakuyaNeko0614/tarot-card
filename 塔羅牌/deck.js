/* Complete bilingual deck and reading logic. No network dependencies. */
(function (root) {
  "use strict";
  const majorCards = [
  {
    "id": "fool",
    "arcana": "major",
    "image": "fool.png",
    "name": {
      "zh": "愚者",
      "en": "The Fool"
    },
    "upright": {
      "zh": "#新開始 #冒險 #純真",
      "en": "#new-beginnings #adventure #innocence"
    },
    "reversed": {
      "zh": "#魯莽 #過度冒險 #不負責任",
      "en": "#recklessness #excessive-risk #irresponsibility"
    }
  },
  {
    "id": "magician",
    "arcana": "major",
    "image": "magician.png",
    "name": {
      "zh": "魔術師",
      "en": "The Magician"
    },
    "upright": {
      "zh": "#創造力 #行動 #自信",
      "en": "#creativity #action #confidence"
    },
    "reversed": {
      "zh": "#缺乏動力 #騙局 #才華未展",
      "en": "#lack-of-motivation #deception #unused-talent"
    }
  },
  {
    "id": "high_priestess",
    "arcana": "major",
    "image": "high_priestess.png",
    "name": {
      "zh": "女祭司",
      "en": "The High Priestess"
    },
    "upright": {
      "zh": "#直覺 #神祕 #潛意識",
      "en": "#intuition #mystery #subconscious"
    },
    "reversed": {
      "zh": "#隱瞞 #忽視直覺 #表面",
      "en": "#secrets #ignored-intuition #superficiality"
    }
  },
  {
    "id": "empress",
    "arcana": "major",
    "image": "empress.png",
    "name": {
      "zh": "皇后",
      "en": "The Empress"
    },
    "upright": {
      "zh": "#豐收 #孕育 #母性",
      "en": "#abundance #nurturing #growth"
    },
    "reversed": {
      "zh": "#依賴 #過度保護 #缺乏成長",
      "en": "#dependence #overprotection #stagnation"
    }
  },
  {
    "id": "emperor",
    "arcana": "major",
    "image": "emperor.png",
    "name": {
      "zh": "皇帝",
      "en": "The Emperor"
    },
    "upright": {
      "zh": "#權威 #秩序 #控制",
      "en": "#authority #structure #discipline"
    },
    "reversed": {
      "zh": "#固執 #暴君 #缺乏紀律",
      "en": "#rigidity #domination #lack-of-discipline"
    }
  },
  {
    "id": "hierophant",
    "arcana": "major",
    "image": "hierophant.png",
    "name": {
      "zh": "教皇",
      "en": "The Hierophant"
    },
    "upright": {
      "zh": "#傳統 #信仰 #教育",
      "en": "#tradition #belief #learning"
    },
    "reversed": {
      "zh": "#打破常規 #盲從 #挑戰權威",
      "en": "#questioning-conventions #conformity #challenging-authority"
    }
  },
  {
    "id": "lovers",
    "arcana": "major",
    "image": "lovers.png",
    "name": {
      "zh": "戀人",
      "en": "The Lovers"
    },
    "upright": {
      "zh": "#選擇 #愛情 #結合",
      "en": "#choices #love #union"
    },
    "reversed": {
      "zh": "#分離 #失和 #錯誤的選擇",
      "en": "#separation #disharmony #misaligned-choices"
    }
  },
  {
    "id": "chariot",
    "arcana": "major",
    "image": "chariot.png",
    "name": {
      "zh": "戰車",
      "en": "The Chariot"
    },
    "upright": {
      "zh": "#意志 #勝利 #行動",
      "en": "#willpower #victory #determination"
    },
    "reversed": {
      "zh": "#失控 #阻礙 #缺乏方向",
      "en": "#loss-of-control #obstacles #lack-of-direction"
    }
  },
  {
    "id": "strength",
    "arcana": "major",
    "image": "strength.png",
    "name": {
      "zh": "力量",
      "en": "Strength"
    },
    "upright": {
      "zh": "#勇氣 #耐心 #柔克剛",
      "en": "#courage #patience #compassion"
    },
    "reversed": {
      "zh": "#軟弱 #自我懷疑 #失控",
      "en": "#insecurity #self-doubt #loss-of-composure"
    }
  },
  {
    "id": "hermit",
    "arcana": "major",
    "image": "hermit.png",
    "name": {
      "zh": "隱者",
      "en": "The Hermit"
    },
    "upright": {
      "zh": "#內省 #孤獨 #指引",
      "en": "#reflection #solitude #guidance"
    },
    "reversed": {
      "zh": "#孤立 #逃避 #拒絕溝通",
      "en": "#isolation #avoidance #withdrawal"
    }
  },
  {
    "id": "wheel",
    "arcana": "major",
    "image": "wheel.png",
    "name": {
      "zh": "命運之輪",
      "en": "Wheel of Fortune"
    },
    "upright": {
      "zh": "#轉變 #契機 #幸運",
      "en": "#change #opportunity #good-fortune"
    },
    "reversed": {
      "zh": "#厄運 #阻礙 #無力感",
      "en": "#setbacks #resistance #powerlessness"
    }
  },
  {
    "id": "justice",
    "arcana": "major",
    "image": "justice.png",
    "name": {
      "zh": "正義",
      "en": "Justice"
    },
    "upright": {
      "zh": "#公平 #平衡 #因果",
      "en": "#fairness #balance #accountability"
    },
    "reversed": {
      "zh": "#不公 #偏見 #逃避責任",
      "en": "#unfairness #bias #avoiding-responsibility"
    }
  },
  {
    "id": "hanged_man",
    "arcana": "major",
    "image": "hanged_man.png",
    "name": {
      "zh": "倒吊人",
      "en": "The Hanged Man"
    },
    "upright": {
      "zh": "#犧牲 #換位思考 #等待",
      "en": "#surrender #new-perspective #patience"
    },
    "reversed": {
      "zh": "#無謂的犧牲 #拖延 #鑽牛角尖",
      "en": "#needless-sacrifice #delay #inflexibility"
    }
  },
  {
    "id": "death",
    "arcana": "major",
    "image": "death.png",
    "name": {
      "zh": "死神",
      "en": "Death"
    },
    "upright": {
      "zh": "#結束 #重生 #轉型",
      "en": "#endings #renewal #transformation"
    },
    "reversed": {
      "zh": "#恐懼改變 #停滯 #拒絕放手",
      "en": "#fear-of-change #stagnation #holding-on"
    }
  },
  {
    "id": "temperance",
    "arcana": "major",
    "image": "temperance.png",
    "name": {
      "zh": "節制",
      "en": "Temperance"
    },
    "upright": {
      "zh": "#調和 #中庸 #淨化",
      "en": "#harmony #moderation #healing"
    },
    "reversed": {
      "zh": "#失衡 #極端 #缺乏耐心",
      "en": "#imbalance #extremes #impatience"
    }
  },
  {
    "id": "devil",
    "arcana": "major",
    "image": "devil.png",
    "name": {
      "zh": "惡魔",
      "en": "The Devil"
    },
    "upright": {
      "zh": "#誘惑 #束縛 #物質",
      "en": "#temptation #attachment #materialism"
    },
    "reversed": {
      "zh": "#解脫 #覺醒 #擺脫控制",
      "en": "#release #awareness #freedom"
    }
  },
  {
    "id": "tower",
    "arcana": "major",
    "image": "tower.png",
    "name": {
      "zh": "高塔",
      "en": "The Tower"
    },
    "upright": {
      "zh": "#毀滅 #突變 #解放",
      "en": "#upheaval #sudden-change #liberation"
    },
    "reversed": {
      "zh": "#逃避災難 #害怕改變 #重建困難",
      "en": "#avoiding-disruption #fear-of-change #difficult-rebuilding"
    }
  },
  {
    "id": "star",
    "arcana": "major",
    "image": "star.png",
    "name": {
      "zh": "星星",
      "en": "The Star"
    },
    "upright": {
      "zh": "#希望 #平靜 #靈感",
      "en": "#hope #peace #inspiration"
    },
    "reversed": {
      "zh": "#絕望 #悲觀 #缺乏靈感",
      "en": "#despair #pessimism #lack-of-inspiration"
    }
  },
  {
    "id": "moon",
    "arcana": "major",
    "image": "moon.png",
    "name": {
      "zh": "月亮",
      "en": "The Moon"
    },
    "upright": {
      "zh": "#不安 #迷惘 #潛意識",
      "en": "#uncertainty #illusion #subconscious"
    },
    "reversed": {
      "zh": "#揭露真相 #解除誤會 #克服恐懼",
      "en": "#clarity #resolved-confusion #facing-fears"
    }
  },
  {
    "id": "sun",
    "arcana": "major",
    "image": "sun.png",
    "name": {
      "zh": "太陽",
      "en": "The Sun"
    },
    "upright": {
      "zh": "#成功 #活力 #喜悅",
      "en": "#success #vitality #joy"
    },
    "reversed": {
      "zh": "#暫時的挫折 #過度自信 #缺乏熱情",
      "en": "#temporary-setbacks #overconfidence #waning-enthusiasm"
    }
  },
  {
    "id": "judgement",
    "arcana": "major",
    "image": "judgement.png",
    "name": {
      "zh": "審判",
      "en": "Judgement"
    },
    "upright": {
      "zh": "#覺醒 #反省 #重生",
      "en": "#awakening #reflection #renewal"
    },
    "reversed": {
      "zh": "#自我懷疑 #拒絕改變 #無法釋懷",
      "en": "#self-doubt #resisting-change #unresolved-feelings"
    }
  },
  {
    "id": "world",
    "arcana": "major",
    "image": "world.png",
    "name": {
      "zh": "世界",
      "en": "The World"
    },
    "upright": {
      "zh": "#圓滿 #達成 #完整",
      "en": "#fulfillment #achievement #wholeness"
    },
    "reversed": {
      "zh": "#未完成 #停滯 #缺乏成就感",
      "en": "#unfinished-business #stagnation #lack-of-closure"
    }
  }
];
  // Rank order: Ace through Ten, Page, Knight, Queen, King.
  // Each row contains Chinese upright/reversed and English upright/reversed keywords.
  const minorMeanings = {
    wands: `靈感 創造 新契機;缺乏動力 延誤 熱情消退;inspiration creativity opportunity;low-motivation delays fading-passion
規劃 遠見 抉擇;畏懼未知 缺乏規劃 猶豫;planning vision decisions;fear-of-unknown poor-planning hesitation
拓展 遠行 展望;受阻 眼界受限 延遲;expansion exploration foresight;obstacles limited-perspective delays
慶祝 和諧 歸屬;不穩定 家庭摩擦 缺乏支持;celebration harmony belonging;instability domestic-tension lack-of-support
競爭 衝突 磨合;迴避衝突 內耗 尋求和解;competition conflict negotiation;conflict-avoidance inner-tension reconciliation
勝利 認可 自信;失去信心 虛榮 缺乏認可;victory recognition confidence;self-doubt vanity lack-of-recognition
堅持 防衛 勇氣;不堪負荷 放棄 立場動搖;perseverance defense courage;overwhelm giving-up wavering
迅速進展 訊息 行動;延誤 混亂 操之過急;momentum messages action;delays confusion haste
韌性 警戒 堅守;疲憊 防備過度 倦怠;resilience vigilance persistence;exhaustion defensiveness burnout
重擔 責任 勞累;卸下重擔 過勞 學習委派;burden responsibility hard-work;releasing-burdens overwork delegation
探索 熱情 新消息;三分鐘熱度 壞消息 缺乏方向;exploration enthusiasm news;inconsistency disappointing-news aimlessness
冒險 行動力 激情;衝動 急躁 半途而廢;adventure initiative passion;impulsiveness impatience unfinished-work
自信 獨立 魅力;嫉妒 缺乏自信 自我中心;confidence independence charisma;jealousy insecurity self-centeredness
領導 遠見 果斷;專制 急躁 不切實際;leadership vision decisiveness;domination impatience unrealistic-expectations`,
    cups: `新感情 直覺 情感流動;壓抑情緒 情感耗竭 封閉;new-love intuition emotional-openness;repressed-emotions depletion withdrawal
連結 夥伴 相互吸引;失和 分離 溝通不良;connection partnership attraction;disharmony separation miscommunication
友誼 歡聚 合作;孤立 流言 過度放縱;friendship celebration collaboration;isolation gossip excess
沉思 冷淡 重新評估;重燃興趣 把握機會 走出冷漠;contemplation apathy reassessment;renewed-interest opportunity reengagement
失落 遺憾 悲傷;接納 釋懷 復原;loss regret grief;acceptance forgiveness recovery
回憶 純真 舊日連結;困於過去 理想化 成長;nostalgia innocence reunion;dwelling-on-past idealization growing-up
選擇 幻想 想像力;釐清選擇 不知所措 逃避現實;choices fantasy imagination;clarity overwhelm escapism
離開 尋求意義 放手;害怕離開 迷失 停滯;walking-away seeking-meaning release;fear-of-leaving aimlessness stagnation
滿足 願望實現 享受;不滿足 貪求 表面快樂;contentment wishes-fulfilled enjoyment;dissatisfaction greed superficial-pleasure
幸福 家庭 情感圓滿;家庭失和 期待落差 價值分歧;happiness family emotional-fulfillment;family-tension unmet-expectations differing-values
好奇 情感訊息 創意;情緒不成熟 不切實際 失望;curiosity emotional-news creativity;immaturity unrealistic-dreams disappointment
浪漫 邀請 追隨內心;情緒化 不實承諾 幻滅;romance invitation following-the-heart;moodiness empty-promises disillusionment
同理心 關懷 直覺;情緒依賴 過度付出 忽略自己;empathy care intuition;emotional-dependence overgiving self-neglect
情緒平衡 同理心 沉著;情緒壓抑 操控 心境不穩;emotional-balance compassion composure;repression manipulation volatility`,
    swords: `清晰 真相 新思維;混亂 誤解 判斷不清;clarity truth new-ideas;confusion misunderstanding poor-judgment
僵局 兩難 權衡;優柔寡斷 資訊過載 揭露真相;stalemate dilemma weighing-options;indecision information-overload revealed-truth
心痛 悲傷 分離;療癒 釋懷 壓抑悲傷;heartbreak sorrow separation;healing forgiveness suppressed-grief
休息 修復 靜思;倦怠 焦躁 重新出發;rest recovery contemplation;burnout restlessness reawakening
衝突 代價 爭勝;和解 悔意 未解衝突;conflict cost winning-at-all-costs;reconciliation remorse unresolved-conflict
過渡 離開困境 療癒;抗拒轉變 舊事牽絆 停滯;transition moving-on healing;resisting-change emotional-baggage stagnation
策略 隱瞞 獨自行動;坦白 被揭穿 自欺;strategy secrecy independence;confession exposure self-deception
受困 自我設限 無力感;解放 轉換觀點 找回力量;restriction limiting-beliefs powerlessness;liberation new-perspective empowerment
焦慮 失眠 憂慮;尋求支持 逐漸復原 深層恐懼;anxiety sleeplessness worry;seeking-support recovery deep-fears
痛苦結束 低谷 放下;復原 抗拒結束 重生;painful-ending rock-bottom release;recovery resisting-endings regeneration
求知 警覺 新想法;流言 草率 缺乏實踐;curiosity alertness new-ideas;gossip haste lack-of-follow-through
果斷 迅速 抱負;魯莽 好爭辯 缺乏方向;decisiveness speed ambition;recklessness argumentativeness aimlessness
獨立 清晰 界線;苛刻 冷漠 苦澀;independence clarity boundaries;harshness coldness bitterness
理性 權威 公正;濫用權力 冷酷 偏見;reason authority fairness;abuse-of-power ruthlessness bias`,
    pentacles: `新機會 富足 穩固起點;錯失機會 財務延誤 規劃不足;opportunity abundance solid-foundation;missed-opportunity financial-delays poor-planning
平衡 適應 多重任務;失衡 忙亂 超出負荷;balance adaptability multitasking;imbalance disorganization overload
團隊合作 技藝 學習;合作不良 品質不足 缺乏認可;teamwork craftsmanship learning;poor-teamwork low-quality lack-of-recognition
穩定 儲蓄 守成;貪婪 緊抓不放 學習分享;stability saving security;greed possessiveness learning-to-share
困頓 匱乏 孤立;援助 復甦 重建信心;hardship scarcity isolation;support recovery renewed-confidence
慷慨 互助 給予;不平等 附帶條件 債務;generosity support giving;inequality strings-attached debt
耐心 耕耘 長期投資;急於求成 回報不足 重新評估;patience cultivation long-term-investment;impatience poor-returns reassessment
勤奮 精進 專注;敷衍 完美主義 缺乏投入;diligence mastery focus;carelessness perfectionism disengagement
自立 富足 享受成果;過度消費 依賴 表面成功;independence abundance enjoying-rewards;overspending dependence superficial-success
傳承 保障 長遠穩定;家庭紛爭 財務損失 根基不穩;legacy security lasting-stability;family-disputes financial-loss unstable-foundation
務實 學習 新目標;拖延 缺乏專注 錯失學習;practicality learning new-goals;procrastination distraction missed-learning
可靠 耐心 穩步前進;固執 停滯 工作失衡;reliability patience steady-progress;stubbornness stagnation work-imbalance
照顧 務實 生活富足;忽略自己 過度操心 生活失衡;nurturing practicality comfort;self-neglect overconcern imbalance
成就 穩定 慷慨;物質至上 固執 管理不善;achievement stability generosity;materialism stubbornness mismanagement`
  };
  const suits = [
    { id: "wands", zh: "權杖", en: "Wands" },
    { id: "cups", zh: "聖杯", en: "Cups" },
    { id: "swords", zh: "寶劍", en: "Swords" },
    { id: "pentacles", zh: "錢幣", en: "Pentacles" }
  ];
  const rankZh = ["王牌", "二", "三", "四", "五", "六", "七", "八", "九", "十", "侍者", "騎士", "皇后", "國王"];
  const rankEn = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  const hashtags = text => text.split(" ").map(word => "#" + word).join(" ");
  const minorCards = suits.flatMap(suit => minorMeanings[suit.id].split("\n").map((row, rank) => {
    const [uprightZh, reversedZh, uprightEn, reversedEn] = row.split(";");
    const id = `${suit.id}-${rank + 1}`;
    return {
      id, arcana: "minor", suit: suit.id, rank: rank + 1, image: `cards/${id}.jpg`,
      name: { zh: suit.zh + rankZh[rank], en: `${rankEn[rank]} of ${suit.en}` },
      upright: { zh: hashtags(uprightZh), en: hashtags(uprightEn) },
      reversed: { zh: hashtags(reversedZh), en: hashtags(reversedEn) }
    };
  }));
  const deck = [...majorCards, ...minorCards];

  function getDeck(deckType = "full") {
    if (!["major", "full"].includes(deckType)) throw new Error("Unknown deck");
    return deckType === "major" ? [...majorCards] : [...deck];
  }

  function createSession(mode = "single", random = Math.random, deckType = "full") {
    if (!["single", "three"].includes(mode)) throw new Error("Unknown spread");
    const shuffled = getDeck(deckType);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { mode, deckType, deckSize: shuffled.length, cards: shuffled.slice(0, 6), draws: [], question: "", limit: mode === "three" ? 3 : 1 };
  }

  function drawCard(session, slot, question, random = Math.random) {
    if (session.draws.length >= session.limit || session.draws.some(draw => draw.slot === slot)) return null;
    if (!Number.isInteger(slot) || slot < 0 || slot >= session.cards.length) return null;
    if (!session.draws.length && !question.trim()) return null;
    if (!session.draws.length) session.question = question.trim();
    const draw = { card: session.cards[slot], slot, isUpright: random() < 0.5 };
    session.draws.push(draw);
    return draw;
  }

  function buildPrompt(session, language) {
    if (session.draws.length !== session.limit) return "";
    const zh = language === "zh";
    const positions = zh ? ["過去", "現在", "未來"] : ["Past", "Present", "Future"];
    const lines = session.draws.map((draw, index) => {
      const orientation = zh ? (draw.isUpright ? "正位" : "逆位") : (draw.isUpright ? "Upright" : "Reversed");
      const meanings = draw.card[draw.isUpright ? "upright" : "reversed"][language];
      const position = session.mode === "three" ? `${positions[index]}: ` : "";
      return `${position}${draw.card.name[language]} (${orientation}) — ${meanings}`;
    }).join("\n");
    return zh
      ? `我剛進行了塔羅牌占卜。我的問題是「${session.question}」。\n牌陣：${session.mode === "three" ? "過去／現在／未來（三張牌依抽牌順序）" : "單張指引"}。\n${lines}\n請依照每張牌的正逆位與牌位含義解讀，${session.mode === "three" ? "串聯過去、現在、未來的關係，" : ""}詳細回答問題並提供具體建議。請以繁體中文回答。`
      : `I did a tarot reading. My question is: "${session.question}".\nSpread: ${session.mode === "three" ? "Past / Present / Future (in draw order)" : "Single-card guidance"}.\n${lines}\nInterpret each card's orientation and spread position, ${session.mode === "three" ? "connect the past, present and future, " : ""}and answer my question with practical suggestions. Please respond in English.`;
  }
  const api = { deck, getDeck, createSession, drawCard, buildPrompt };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Tarot = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
