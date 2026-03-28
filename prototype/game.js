// ============================================================
// FRAME:04 - ROGUELIKE PROTOTYPE
// ============================================================

// ============================================================
// DATA - loaded from frames.json
// ============================================================
let FRAMES = {};

const STAT_NAMES = { OUT: '出力', SHL: '外殻', CTRL: '制御' };

// ============================================================
// FRAME PASSIVES (1 per unique frame in squad)
// ============================================================
// Frame passive relics - auto-granted at run start based on unique frames selected
const FRAME_PASSIVE_RELICS = {
  striker:  'passive_striker',
  gunner:   'passive_gunner',
  blaster:  'passive_blaster',
  shielder: 'passive_shielder',
  medic:    'passive_medic',
  jammer:   'passive_jammer',
  cracker:  'passive_cracker',
  booster:  'passive_booster',
  phantom:  'passive_phantom',
  overload: 'passive_overload',
};

// ============================================================
// ENEMY POOLS PER ACT (tiered: weak/mid/strong/boss)
// Act 4+ reuses Act 1-3 templates with act-based scaling
// ============================================================
const ENEMY_POOLS = {
  1: {
    weak: [
      [
        { name: 'ドローン-A', hp: 20, atk: 4, speed: 0, patterns: ['attack','attack','barrier'] },
        { name: 'ドローン-B', hp: 20, atk: 5, speed: 0, patterns: ['attack','attack','barrier'] },
      ],
      [
        { name: 'スカウト', hp: 18, atk: 5, speed: 0, patterns: ['attack','attack','attack'] },
        { name: 'ガード', hp: 22, atk: 4, speed: 0, patterns: ['barrier','attack','attack'] },
      ],
      [
        { name: 'ガード-A', hp: 20, atk: 5, speed: 0, patterns: ['attack','barrier','attack'] },
        { name: 'ガード-B', hp: 20, atk: 5, speed: 0, patterns: ['attack','attack','barrier'] },
      ],
    ],
    mid: [
      [
        { name: 'ドローン-A', hp: 20, atk: 4, speed: 0, patterns: ['attack','attack','barrier'] },
        { name: 'ドローン-B', hp: 22, atk: 5, speed: 0, patterns: ['attack','attack_all','attack'] },
        { name: 'ドローン-C', hp: 18, atk: 4, speed: 0, patterns: ['attack','barrier','attack'] },
      ],
      [
        { name: '重装ドローン-A', hp: 28, atk: 6, speed: 0, patterns: ['attack','attack','barrier','attack_all'] },
        { name: '重装ドローン-B', hp: 28, atk: 7, speed: 0, patterns: ['attack','barrier','attack','attack'] },
      ],
    ],
    strong: [
      [
        { name: 'ヘビーガード', hp: 60, atk: 9, speed: 0, patterns: ['attack','attack','attack_heavy','barrier','attack_all'] },
      ],
      [
        { name: 'エヴェイダー', hp: 55, atk: 8, speed: 0, patterns: ['attack','attack','buff_self','attack','attack_heavy'] },
        { name: 'サポートビット', hp: 18, atk: 4, speed: 0, patterns: ['barrier','attack','barrier'] },
      ],
    ],
    boss: [
      [
        { name: 'コマンダー Mk-I', hp: 100, atk: 10, speed: 0, patterns: ['barrier','attack','attack_heavy','attack_all','attack','buff_self','attack_heavy'] },
        { name: 'ビット-L', hp: 18, atk: 4, speed: 0, patterns: ['attack','attack','barrier'] },
        { name: 'ビット-R', hp: 18, atk: 4, speed: 0, patterns: ['attack','barrier','attack'] },
      ],
    ],
  },
  2: {
    weak: [
      [
        { name: '重装ドローン-A', hp: 28, atk: 6, speed: 0, patterns: ['attack','attack','barrier','attack_all'] },
        { name: '重装ドローン-B', hp: 28, atk: 7, speed: 0, patterns: ['attack','barrier','attack','attack'] },
      ],
      [
        { name: 'スナイパー', hp: 25, atk: 7, speed: 0, patterns: ['attack','attack','attack_heavy'] },
        { name: 'シールダー', hp: 30, atk: 6, speed: 0, patterns: ['barrier','barrier','attack','attack_all'] },
      ],
    ],
    mid: [
      [
        { name: 'アサルト-A', hp: 25, atk: 7, speed: 0, patterns: ['attack','attack','attack_heavy'] },
        { name: 'アサルト-B', hp: 25, atk: 7, speed: 0, patterns: ['attack','attack_heavy','attack'] },
        { name: 'リペアビット', hp: 18, atk: 3, speed: 0, patterns: ['barrier','barrier','attack'] },
      ],
      [
        { name: 'ストーム', hp: 28, atk: 6, speed: 0, patterns: ['attack_all','attack_all','barrier'] },
        { name: 'ガード', hp: 30, atk: 6, speed: 0, patterns: ['attack','barrier','attack'] },
        { name: 'ガード', hp: 30, atk: 6, speed: 0, patterns: ['barrier','attack','attack'] },
      ],
    ],
    strong: [
      [
        { name: 'ジャガーノート', hp: 75, atk: 11, speed: 0, patterns: ['attack_heavy','attack','barrier','attack_all','buff_self','attack_heavy'] },
      ],
      [
        { name: 'デュアルブレード', hp: 70, atk: 10, speed: 0, patterns: ['attack','attack','attack_heavy','attack','attack_heavy'] },
        { name: 'サポートコア', hp: 25, atk: 5, speed: 0, patterns: ['barrier','buff_self','attack'] },
      ],
    ],
    boss: [
      [
        { name: 'コア・ユニット Mk-II', hp: 130, atk: 12, speed: 0, patterns: ['barrier','attack_heavy','attack','attack_all','buff_self','attack_heavy','attack_all'] },
        { name: 'ガードビット-L', hp: 25, atk: 6, speed: 0, patterns: ['attack','barrier','attack'] },
        { name: 'ガードビット-R', hp: 25, atk: 6, speed: 0, patterns: ['barrier','attack','attack'] },
      ],
    ],
  },
  3: {
    weak: [
      [
        { name: 'エリート兵-A', hp: 32, atk: 8, speed: 0, patterns: ['attack','attack_heavy','barrier','attack_all'] },
        { name: 'エリート兵-B', hp: 32, atk: 9, speed: 0, patterns: ['attack','barrier','attack_heavy','attack'] },
      ],
      [
        { name: 'バーサーカー', hp: 35, atk: 9, speed: 0, patterns: ['attack_heavy','attack','buff_self','attack_heavy'] },
        { name: 'バーサーカー', hp: 35, atk: 9, speed: 0, patterns: ['attack','attack_heavy','attack','buff_self'] },
      ],
    ],
    mid: [
      [
        { name: 'ハンター', hp: 30, atk: 9, speed: 0, patterns: ['attack','attack','attack_heavy','attack'] },
        { name: 'メディック', hp: 30, atk: 6, speed: 0, patterns: ['barrier','barrier','attack','attack_all'] },
        { name: 'アサルト', hp: 35, atk: 8, speed: 0, patterns: ['attack','attack','attack_heavy'] },
      ],
    ],
    strong: [
      [
        { name: 'デストロイヤー', hp: 90, atk: 12, speed: 0, patterns: ['attack_heavy','attack_all','buff_self','attack_heavy','barrier','attack_all','attack_heavy'] },
      ],
      [
        { name: 'ツインファング-A', hp: 85, atk: 12, speed: 0, patterns: ['attack','attack_heavy','attack','attack'] },
        { name: 'ツインファング-B', hp: 85, atk: 12, speed: 0, patterns: ['attack','attack','attack_heavy','attack'] },
      ],
    ],
    boss: [
      [
        { name: 'アーキテクト', hp: 150, atk: 14, speed: 0, patterns: ['barrier','attack_heavy','attack_all','buff_self','attack','attack_heavy','attack_all','buff_self','attack_heavy'] },
      ],
    ],
  },
};

// Get enemy pool for any act (Act 4+ cycles Act 1-3 templates)
function getEnemyPool(actNum) {
  const baseAct = ((actNum - 1) % 3) + 1; // 1,2,3,1,2,3,...
  return ENEMY_POOLS[baseAct];
}

// Act-based scaling: each act beyond 1 increases stats
function getActScale(actNum) {
  return 1 + (actNum - 1) * 0.15;
}

// ============================================================
// INTER-BATTLE EVENTS
// ============================================================
const LINEAR_EVENTS = [
  {
    id: 'repair',
    title: '整備',
    desc: '機体の損傷を修復できる。',
    choices: [
      { label: '修復する', desc: '全機HP30%回復', action: 'repair_30' },
    ]
  },
  {
    id: 'upgrade',
    title: '最適化',
    desc: 'カードシステムの最適化が可能だ。',
    choices: [
      { label: '最適化実行', desc: 'ランダムなカード1枚を+化', action: 'free_upgrade' },
    ]
  },
  {
    id: 'remove',
    title: 'データ整理',
    desc: '不要なカードデータを削除してデッキを最適化できる。',
    choices: [
      { label: 'カードを除去', desc: 'デッキから1枚選んで除去', action: 'remove_card' },
      { label: '見送る', desc: '何も起きない', action: 'nothing' },
    ]
  },
  {
    id: 'relic_find',
    title: '残骸発見',
    desc: '先行部隊の残骸からパーツを回収できる。',
    choices: [
      { label: '回収する', desc: 'レリックを1つ獲得', action: 'find_relic' },
    ]
  },
  {
    id: 'gamble',
    title: '賭け',
    desc: '不安定なエネルギー源を発見。リスクを取るか？',
    choices: [
      { label: '取り込む', desc: '全機HP20%消費 → 50%でレリック獲得', action: 'gamble_relic' },
      { label: '見送る', desc: '何も起きない', action: 'nothing' },
    ]
  },
];

// ============================================================
// RELIC DEFINITIONS
// ============================================================
const RELIC_DEFS = {
  // --- Combat ---
  power_core:       { name: 'パワーコア', desc: '全攻撃ダメージ+2', rarity: 'common' },
  rapid_loader:     { name: 'ラピッドローダー', desc: '毎ターンのドロー枚数+1(6枚)', rarity: 'uncommon' },
  reserve_battery:  { name: '予備バッテリー', desc: '各戦闘開始時EN+1', rarity: 'common' },
  en_converter:     { name: 'ENコンバーター', desc: 'EN上限+1(6)', rarity: 'uncommon' },
  twin_strike:      { name: 'ツインストライク', desc: 'EN0カード使用後、次のカードダメージ+3', rarity: 'uncommon' },
  berserker_chip:   { name: 'バーサーカーチップ', desc: 'HP50%以下の味方の攻撃+4', rarity: 'uncommon' },
  crit_module:      { name: 'クリティカルモジュール', desc: '10%の確率でダメージ1.5倍', rarity: 'common' },
  multi_target:     { name: 'マルチターゲット', desc: '単体攻撃が別の敵にも50%ダメージ', rarity: 'rare' },
  // --- Defense ---
  auto_repair:      { name: 'オートリペア', desc: 'ターン開始時、最もHP低い味方をHP3回復', rarity: 'common' },
  reactive_armor:   { name: 'リアクティブアーマー', desc: 'フィールド残量の50%を次ターンに持越し', rarity: 'uncommon' },
  emergency_shield: { name: '緊急シールド', desc: '戦闘開始時、全味方にフィールド+5', rarity: 'common' },
  damage_absorber:  { name: 'ダメージアブソーバー', desc: '受けるダメージ-1(最低1)', rarity: 'uncommon' },
  last_stand_relic: { name: 'ラストスタンド', desc: 'HPが1になった時、1回だけフィールド+15', rarity: 'rare' },
  guardian_angel:   { name: 'ガーディアンエンジェル', desc: '大破時、1回だけHP1で復活(ラン中1回)', rarity: 'rare' },
  // --- Status ---
  heat_amplifier:   { name: '過熱増幅器', desc: '過熱ダメージ+1', rarity: 'common' },
  corrosive_coat:   { name: '腐食コート', desc: '脆弱付与量+2', rarity: 'common' },
  static_field:     { name: '静電フィールド', desc: 'ターン開始時、ランダム敵1体に感電1T', rarity: 'uncommon' },
  deep_freeze:      { name: 'ディープフリーズ', desc: '減速効果の持続+2ターン', rarity: 'uncommon' },
  chain_lightning:  { name: 'チェインライトニング', desc: '感電中の敵にダメージ時、隣の敵にも3ダメージ', rarity: 'rare' },
  thermal_cascade:  { name: 'サーマルカスケード', desc: '過熱で敵撃破時、過熱値を別の敵に伝播', rarity: 'rare' },
  // --- Speed ---
  accel_boot:       { name: 'アクセルブート', desc: '戦闘開始時、全味方に加速+5%', rarity: 'common' },
  friction_field:   { name: 'フリクションフィールド', desc: '戦闘開始時、全敵に減速-5%', rarity: 'common' },
  // --- Economy ---
  card_scanner:     { name: 'カードスキャナー', desc: 'カード報酬の選択肢が4枚になる', rarity: 'uncommon' },
  upgrade_kit:      { name: 'アップグレードキット', desc: 'カード報酬で選んだカードが50%で+付き', rarity: 'uncommon' },
  lucky_coin:       { name: 'ラッキーコイン', desc: 'イベントの賭けが70%成功になる', rarity: 'common' },
  scout_drone:      { name: 'スカウトドローン', desc: '次の戦闘の敵情報が常に見える', rarity: 'common' },
  // --- Frame passive relics (auto-granted, cannot be found) ---
  passive_striker:  { name: '先制打撃', desc: 'ターン1の攻撃ダメージ+3', rarity: 'frame' },
  passive_gunner:   { name: '精密照準', desc: '脆弱付与量+1', rarity: 'frame' },
  passive_blaster:  { name: '残火', desc: '過熱ダメージ+1', rarity: 'frame' },
  passive_shielder: { name: '装甲', desc: '戦闘開始時シールダーにフィールド+5', rarity: 'frame' },
  passive_medic:    { name: '応急修復', desc: 'ターン開始時、最低HP味方をHP2回復', rarity: 'frame' },
  passive_jammer:   { name: '電磁干渉', desc: '感電付与ターン+1', rarity: 'frame' },
  passive_cracker:  { name: '構造解析', desc: '脆弱状態の敵へのダメージ+2', rarity: 'frame' },
  passive_booster:  { name: '充電', desc: '戦闘開始時EN+1', rarity: 'frame' },
  passive_phantom:  { name: '残影', desc: '敵の攻撃回避時、次の攻撃+3', rarity: 'frame' },
  passive_overload: { name: '暴走', desc: '自傷ダメージ-1(最低0)', rarity: 'frame' },
  // --- Boss relics ---
  overclock:        { name: 'オーバークロック', desc: 'EN回復量+1(毎ターン4回復)', rarity: 'boss' },
  nano_repair_sys:  { name: 'ナノリペアシステム', desc: '毎ターン全味方HP1回復', rarity: 'boss' },
  war_machine:      { name: 'ウォーマシン', desc: '手札のEN2以上のカードのコスト-1', rarity: 'boss' },
  quantum_link:     { name: '量子リンク', desc: 'カード使用時にフィールド+1(使用者)', rarity: 'boss' },
  infinity_core:    { name: 'インフィニティコア', desc: 'デッキ1周ごとに全味方HP5回復', rarity: 'boss' },
};

function hasRelic(id) {
  return state.relics && state.relics.includes(id);
}

function getRelicChoices(rarity, count) {
  const pool = Object.entries(RELIC_DEFS)
    .filter(([id, r]) => {
      if (r.rarity === 'frame') return false; // frame passives never offered
      if (rarity === 'boss') return r.rarity === 'boss';
      return r.rarity !== 'boss';
    })
    .filter(([id]) => !hasRelic(id))
    .map(([id]) => id);
  shuffle(pool);
  return pool.slice(0, count);
}

// ============================================================
// GAME STATE
// ============================================================
let state = {
  // Setup
  selectedFrames: [],
  // Run state
  run: null,
  // Battle state
  allies: [],
  enemies: [],
  deck: [],
  discard: [],
  hand: [],
  en: 3,
  maxEN: 3,
  enCap: 5,
  turn: 0,
  turnBuffs: {},
  logs: [],
  battleOver: false,
  // Relics
  relics: [],
  // Reward
  rewardCardChosen: false,
  rewardRelicChosen: false,
};

// ============================================================
// ENEMY SEQUENCE GENERATION (linear progression)
// ============================================================
function generateEnemySequence(actNum) {
  const pool = getEnemyPool(actNum);
  const sequence = [];
  // Battles 1-3: weak tier
  for (let i = 0; i < 3; i++) {
    const group = pool.weak[Math.floor(Math.random() * pool.weak.length)];
    sequence.push({ tier: 'weak', enemies: group });
  }
  // Battles 4-6: mid tier
  for (let i = 0; i < 3; i++) {
    const group = pool.mid[Math.floor(Math.random() * pool.mid.length)];
    sequence.push({ tier: 'mid', enemies: group });
  }
  // Battles 7-9: strong tier
  for (let i = 0; i < 3; i++) {
    const group = pool.strong[Math.floor(Math.random() * pool.strong.length)];
    sequence.push({ tier: 'strong', enemies: group });
  }
  // Battle 10: boss
  const bossGroup = pool.boss[Math.floor(Math.random() * pool.boss.length)];
  sequence.push({ tier: 'boss', enemies: bossGroup });
  return sequence;
}

// ============================================================
// RUN MANAGEMENT (linear progression)
// ============================================================
function startRun() {
  state.run = {
    act: 1,
    battleIndex: 0,
    overallBattle: 0,
    enemySequence: [],
    totalTurns: 0,
    battlesWon: 0,
    elitesKilled: 0,
    bossesKilled: 0,
    scoutedNext: false,
    cardPool: [],       // discoverable cards not yet in deck
    guardianUsed: false, // guardian_angel one-time flag
  };

  // Grant frame passive relics (unique frames only - duplicates reduce passive count)
  const uniqueFrames = [...new Set(state.selectedFrames.filter(f => f !== null))];
  state.relics = uniqueFrames.map(fk => FRAME_PASSIVE_RELICS[fk]).filter(Boolean);

  // Build initial allies from setup (baseStats only, no TP)
  state.allies = state.selectedFrames.filter(fk => fk !== null).map((fk, i) => {
    const frame = FRAMES[fk];
    const stats = { ...(frame.baseStats || { OUT: 0, SHL: 0, CTRL: 0 }) };
    const maxHP = Math.round(frame.baseHP * (1 + stats.SHL * 0.03));
    const dupeCount = state.selectedFrames.slice(0, i + 1).filter(f => f === fk).length;
    const totalDupes = state.selectedFrames.filter(f => f === fk).length;
    const displayName = totalDupes > 1 ? `${frame.name} #${dupeCount}` : frame.name;
    // Starter cards = first 3, rest go to discovery pool
    const starterCards = frame.cards.slice(0, 3).map((c, ci) => ({
      ...c, id: `${fk}_${i}_${ci}`, ownerIdx: i, ownerFrame: fk, playable: true, upgraded: false
    }));
    const discoverCards = frame.cards.slice(3).map((c, ci) => ({
      ...c, id: `${fk}_${i}_${3 + ci}`, ownerIdx: i, ownerFrame: fk, playable: true, upgraded: false
    }));
    state.run.cardPool.push(...discoverCards);
    return {
      id: i, frameKey: fk, name: displayName, stats,
      hp: maxHP, maxHP, barrier: 0, dead: false, speed: 0, speedEffects: [],
      cards: starterCards,
      buffs: {}, persistentBarrier: 0, attackLocked: false, counterDmg: 0, reactive: false, siegeBuff: 0, spikeReflect: 0,
      fullDriveActive: false,
      elementCoat: null, absorbField: false, elementStacks: 0,
      linkedTo: -1, linkMode: null,
      bombCounter: 0, phoenixCore: false,
      ironBody: false, ironBodyRate: 0, dmgTakenThisTurn: 0,
      damageCounter: 0, lastStand: false, berserkerBonus: 0,
      loadCounter: 0,
      drones: [], droneGuardMode: false, droneFocusTarget: -1, droneFocusMultiplier: 1,
      partsSalvageActive: false, junkShieldActive: false, junkShieldBonus: 0,
      scanned: false,
    };
  });

  enterAct(1);
}

function enterAct(actNum) {
  state.run.act = actNum;
  state.run.battleIndex = 0;
  state.run.enemySequence = generateEnemySequence(actNum);
  showProgressScreen();
}

function showProgressScreen() {
  showScreen('progress-screen');
  renderProgressScreen();
}

function advanceToBattle() {
  const bi = state.run.battleIndex;
  if (bi >= 10) {
    // Act complete, move to next act
    enterAct(state.run.act + 1);
    return;
  }
  const encounter = state.run.enemySequence[bi];
  state.run.battleIndex++;
  state.run.overallBattle++;

  // Map tier to encounter type for reward scaling
  const encounterType = encounter.tier === 'boss' ? 'boss'
    : encounter.tier === 'strong' ? 'elite' : 'normal';

  startBattleFromSequence(encounter.enemies, encounterType);
}

// ============================================================
// SETUP SCREEN
// ============================================================
function initSetup() {
  state.selectedFrames = [null, null, null, null];

  const grid = document.getElementById('frame-grid');
  grid.innerHTML = '';

  const baseFrames = Object.entries(FRAMES).filter(([k, f]) => f.pack === 'base');

  for (const [key, frame] of baseFrames) {
    const btn = document.createElement('button');
    btn.className = 'frame-btn';
    const base = frame.baseStats || {};
    btn.innerHTML = `<span class="fname">${frame.name}</span><span class="frole">${frame.role}</span><span class="fstats">HP${frame.baseHP} O${base.OUT||0} S${base.SHL||0} C${base.CTRL||0}</span>`;
    btn.dataset.key = key;
    btn.onclick = () => pickFrameForSlot(key);
    grid.appendChild(btn);
  }

  renderSlotIndicator();
  updateStartBtn();
}

function getActiveSlot() {
  // Returns the first empty slot index, or -1 if all filled
  return state.selectedFrames.indexOf(null);
}

function pickFrameForSlot(key) {
  const slot = getActiveSlot();
  if (slot < 0) return;
  state.selectedFrames[slot] = key;
  renderSlotIndicator();
  updateStartBtn();
}

function removeSlot(slotIdx) {
  state.selectedFrames[slotIdx] = null;
  const filled = state.selectedFrames.filter(f => f !== null);
  state.selectedFrames = [...filled, ...Array(4 - filled.length).fill(null)];
  renderSlotIndicator();
  updateStartBtn();
}

function renderSlotIndicator() {
  const el = document.getElementById('select-count');
  const count = state.selectedFrames.filter(f => f !== null).length;
  const slots = state.selectedFrames.map((fk, i) => {
    const name = fk ? FRAMES[fk].name : '---';
    return `<span style="border:1px solid ${fk ? '#6aff6a' : '#333'};padding:2px 6px;font-size:11px;color:${fk ? '#6aff6a' : '#666'};">${name}</span>`;
  }).join('');
  // Show passives
  const uniqueFrames = [...new Set(state.selectedFrames.filter(f => f !== null))];
  const passiveHtml = uniqueFrames.map(fk => {
    const relicId = FRAME_PASSIVE_RELICS[fk];
    const p = relicId ? RELIC_DEFS[relicId] : null;
    return p ? `<span style="border:1px solid #fa0;padding:1px 5px;font-size:10px;color:#fa0;" title="${p.desc}">${p.name}</span>` : '';
  }).join('');
  const passiveNote = count > 0 && uniqueFrames.length < count ? ` <span style="color:#888;font-size:10px;">(重複: パッシブ${uniqueFrames.length}種)</span>` : '';

  el.innerHTML = `<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">${slots} <span style="color:#888;font-size:12px;">(${count}/4)</span>` +
    (count > 0 ? ` <button onclick="removeSlot(${state.selectedFrames.findLastIndex(f => f !== null)})" style="font-size:11px;padding:2px 6px;">取消</button>` : '') + '</div>' +
    (passiveHtml ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">PASSIVE: ${passiveHtml}${passiveNote}</div>` : '');
  // Update frame button highlights
  document.querySelectorAll('.frame-btn').forEach(btn => {
    const key = btn.dataset.key;
    const inSlots = state.selectedFrames.filter(f => f === key).length;
    btn.classList.toggle('selected', inSlots > 0);
    if (inSlots > 1) {
      btn.querySelector('.frole').textContent = FRAMES[key].role + ` (×${inSlots})`;
    } else {
      btn.querySelector('.frole').textContent = FRAMES[key].role;
    }
  });
}


function updateStartBtn() {
  document.getElementById('btn-start').disabled = state.selectedFrames.filter(f => f !== null).length !== 4;
}

// ============================================================
// BATTLE INITIALIZATION
// ============================================================
function startBattleFromSequence(enemyDefs, encounterType) {
  // Scale enemies by act number
  const actScale = getActScale(state.run.act);

  state.enemies = enemyDefs.map((e, i) => ({
    id: i, name: e.name,
    hp: Math.floor(e.hp * actScale), maxHP: Math.floor(e.hp * actScale),
    barrier: 0, dead: false,
    atk: Math.floor(e.atk * actScale), speed: 0, speedEffects: [],
    patterns: e.patterns, patternIdx: 0,
    intent: null, targetIdx: 0,
    statuses: { overheat: 0, vulnerability: 0, shock: 0 },
    debuffs: {},
    marked: false, markBonus: 0,
    scanned: false, weakPointBonus: 0,
  }));

  // Prepare allies for battle (preserve HP, dead status carries over)
  state.allies.forEach(a => {
    a.barrier = 0;
    clearSpeedEffects(a);
    a.buffs = {};
    a.persistentBarrier = 0;
    a.attackLocked = false;
    a.counterDmg = 0;
    a.reactive = false;
    a.siegeBuff = 0;
    a.spikeReflect = 0;
    a.fullDriveActive = false;
    // Reset expansion per-battle state
    a.elementCoat = null;
    a.absorbField = false;
    a.elementStacks = 0;
    a.linkedTo = -1;
    a.linkMode = null;
    a.bombCounter = 0;
    a.phoenixCore = false;
    a.ironBody = false;
    a.ironBodyRate = 0;
    a.dmgTakenThisTurn = 0;
    a.damageCounter = 0;
    a.lastStand = false;
    a.berserkerBonus = 0;
    a.loadCounter = 0;
    a.drones = [];
    a.droneGuardMode = false;
    a.droneFocusTarget = -1;
    a.droneFocusMultiplier = 1;
    a.partsSalvageActive = false;
    a.junkShieldActive = false;
    a.junkShieldBonus = 0;
    // Re-enable cards for alive units, keep dead cards disabled
    a.cards.forEach(c => { c.playable = !a.dead; });
  });

  // Build deck
  state.deck = [];
  state.allies.forEach(a => {
    a.cards.forEach(c => state.deck.push({ ...c }));
  });
  shuffle(state.deck);
  state.discard = [];
  state.hand = [];
  state.en = state.maxEN;
  state.enCap = 5 + (hasRelic('en_converter') ? 1 : 0);
  state.turn = 0;
  state.logs = [];
  state.battleOver = false;
  state.turnBuffs = {};
  state._encounterType = encounterType;

  // Apply frame passive relics at battle start
  if (hasRelic('passive_shielder')) {
    state.allies.forEach(a => {
      if (!a.dead && a.frameKey === 'shielder') {
        a.barrier += 5;
        addLog(`${a.name}: [装甲] 戦闘開始フィールド+5`, 'barrier');
      }
    });
  }
  if (hasRelic('passive_booster')) {
    state.en = Math.min(state.en + 1, state.enCap);
    addLog('[充電] 戦闘開始EN+1', 'info');
  }

  // Show scouted info if recon was used
  if (state.run && state.run.scoutedNext) {
    state.run.scoutedNext = false;
    enemyDefs.forEach(e => {
      addLog(`[偵察] ${e.name} - HP:${Math.floor(e.hp * actScale)} ATK:${Math.floor(e.atk * actScale)}`, 'info');
    });
  }

  showScreen('battle-screen');
  renderBattleHUD();
  nextTurn();
}

// ============================================================
// TURN MANAGEMENT
// ============================================================
function nextTurn() {
  state.turn++;
  const enRegen = state.maxEN + (hasRelic('overclock') ? 1 : 0);
  state.en = Math.min(state.en + enRegen, state.enCap);

  // Reset per-turn states
  state.allies.forEach(a => {
    if (!a.dead) {
      const persist = a.persistentBarrier || 0;
      a.barrier = persist;
      a.persistentBarrier = 0;
      a.attackLocked = false;
      a.counterDmg = 0;
      a.reactive = false;
      a.spikeReflect = 0;
      if (a.siegeBuff > 0) {
        a.buffs.dmgBonus = (a.buffs.dmgBonus || 0) + a.siegeBuff;
        a.siegeBuff = 0;
      }
      // Reset per-turn expansion state (keep persistent ones)
      a.ironBody = false;
      a.ironBodyRate = 0;
      a.dmgTakenThisTurn = 0;
      a.lastStand = false;
      a.berserkerBonus = 0;
      a.partsSalvageActive = false;
      a.junkShieldActive = false;
      a.junkShieldBonus = 0;
      a.droneFocusTarget = -1;
      a.droneFocusMultiplier = 1;
      // Tick speed effects (decrement turns, remove expired)
      tickSpeedEffects(a);
    }
    a.buffs = a.buffs.dmgBonus ? { dmgBonus: a.buffs.dmgBonus } : {};
  });

  // Reset full drive at turn start (it only lasts within a turn)
  state.allies.forEach(a => { a.fullDriveActive = false; });

  // Reset enemy barrier, speed, and process statuses
  state.enemies.forEach(e => {
    if (e.dead) return;
    e.barrier = 0;
    tickSpeedEffects(e); // Tick speed effects (decrement turns, remove expired)
    // Overheat: deal N damage, then N decreases by 1
    if (e.statuses.overheat > 0) {
      let dmg = e.statuses.overheat;
      if (hasRelic('passive_blaster')) dmg += 1; // 残火: +1
      e.hp -= dmg;
      addLog(`${e.name}: 過熱ダメージ ${dmg}`, 'dmg');
      e.statuses.overheat--;
      if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
    }
    // Vulnerability persists until consumed by damage (no turn decay)
    // Shock: decrement turns
    if (e.statuses.shock > 0) {
      e.statuses.shock--;
    }
    // Legacy debuffs for expansion frames
    if (e.debuffs.agiReduction) {
      e.debuffs.agiReduction.dur--;
      if (e.debuffs.agiReduction.dur <= 0) delete e.debuffs.agiReduction;
    }
    if (e.debuffs.atkReduction) {
      e.debuffs.atkReduction--;
      if (e.debuffs.atkReduction <= 0) delete e.debuffs.atkReduction;
    }
    e.marked = false;
    e.markBonus = 0;
    // scanned persists, but reset per-turn weak point bonus
    e.weakPointBonus = 0;
  });

  // Reactive armor damage from last turn
  state.allies.forEach(a => {
    if (a._reactiveBarrierRemaining && a._reactiveBarrierRemaining > 0) {
      const rdmg = a._reactiveBarrierRemaining;
      state.enemies.forEach(e => {
        if (!e.dead) {
          e.hp -= rdmg;
          if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
        }
      });
      addLog(`${a.name}: リアクティブアーマー反撃 ${rdmg} (全体)`, 'dmg');
    }
    a._reactiveBarrierRemaining = 0;
  });

  // Check win
  if (state.enemies.every(e => e.dead)) { endBattle(true); return; }

  // Set enemy intents
  state.enemies.forEach(e => {
    if (e.dead) return;
    const pattern = e.patterns[e.patternIdx % e.patterns.length];
    const aliveAllies = state.allies.filter(a => !a.dead);
    e.targetIdx = aliveAllies.length > 0 ? aliveAllies[Math.floor(Math.random() * aliveAllies.length)].id : 0;
    e.intent = pattern;
    e.patternIdx++;
  });

  // Frame passive relic: medic auto-heal
  if (hasRelic('passive_medic')) {
    const alive = state.allies.filter(a => !a.dead);
    if (alive.length > 0) {
      alive.sort((a, b) => (a.hp / a.maxHP) - (b.hp / b.maxHP));
      const target = alive[0];
      if (target.hp < target.maxHP) {
        const heal = Math.min(2, target.maxHP - target.hp);
        target.hp += heal;
        addLog(`${target.name}: [応急修復] HP+${heal}`, 'heal');
      }
    }
  }

  // Draw 5 cards
  state.hand = [];
  for (let i = 0; i < 5; i++) drawCard();

  addLog(`--- ターン ${state.turn} ---`, 'info');
  renderBattle();
}

function drawCard() {
  if (state.deck.length === 0) {
    if (state.discard.length === 0) return;
    state.deck = [...state.discard];
    state.discard = [];
    shuffle(state.deck);
    addLog('デッキリシャッフル', 'info');
  }
  state.hand.push(state.deck.pop());
}

function endTurn() {
  if (state.battleOver) return;
  // Discard remaining hand
  state.hand.forEach(c => state.discard.push(c));
  state.hand = [];

  // Track reactive armor
  state.allies.forEach(a => {
    if (a.reactive && a.barrier > 0) {
      a._reactiveBarrierRemaining = a.barrier;
    }
  });

  // Enemy actions
  state.enemies.forEach(e => {
    if (e.dead) return;
    const aliveAllies = state.allies.filter(a => !a.dead);
    if (aliveAllies.length === 0) return;
    let target = state.allies[e.targetIdx];
    if (!target || target.dead) target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];

    let atkPower = e.atk - (e.debuffs.atkReduction || 0);
    if (atkPower < 0) atkPower = 0;

    switch (e.intent) {
      case 'attack':
        dealDmgToAlly(e, target, atkPower);
        break;
      case 'attack_heavy':
        dealDmgToAlly(e, target, Math.floor(atkPower * 1.8));
        break;
      case 'attack_all':
        aliveAllies.forEach(a => dealDmgToAlly(e, a, Math.floor(atkPower * 0.7)));
        break;
      case 'barrier':
        e.barrier += 10;
        addLog(`${e.name}: フィールド +10`, 'barrier');
        break;
      case 'buff_self':
        e.atk += 2;
        addLog(`${e.name}: 攻撃力 +2`, 'status');
        break;
    }
  });

  // Process ally overheat
  state.allies.forEach(a => {
    if (a.dead) return;
    if (a.buffs.overheat && a.buffs.overheat > 0) {
      a.hp -= a.buffs.overheat;
      addLog(`${a.name}: 過熱ダメージ ${a.buffs.overheat}`, 'dmg');
      a.buffs.overheat--;
      if (a.hp <= 0) { killAlly(a); }
    }
  });

  // Drone auto-actions at end of turn
  state.allies.forEach(a => {
    if (a.drones && a.drones.length > 0) {
      a.drones.forEach(drone => {
        if (drone.hp <= 0) return;
        const aliveEnemies = state.enemies.filter(e => !e.dead);
        if (aliveEnemies.length === 0) return;
        if (drone.mode === 'attack' || a.droneFocusTarget >= 0) {
          let target;
          let dmg = drone.atk;
          if (a.droneFocusTarget >= 0) {
            target = state.enemies[a.droneFocusTarget];
            if (!target || target.dead) target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            dmg = Math.floor(dmg * a.droneFocusMultiplier);
          } else {
            target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          }
          if (target && !target.dead) {
            target.hp -= dmg;
            addLog(`ドローン → ${target.name}: ${dmg}ダメージ`, 'dmg');
            if (target.hp <= 0) { target.hp = 0; target.dead = true; addLog(`${target.name} 撃破!`, 'info'); }
          }
        } else if (drone.mode === 'guard') {
          const aliveAllies = state.allies.filter(al => !al.dead);
          if (aliveAllies.length > 0) {
            const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
            const barrierAmt = Math.round(5 * (1 + a.stats.OUT * 0.04));
            target.barrier += barrierAmt;
            addLog(`ドローン → ${target.name}: フィールド+${barrierAmt}`, 'barrier');
          }
        }
      });
    }
  });

  // Reset temp-playable cards (emergency repair)
  state.hand.forEach(c => {
    if (c._tempPlayable) {
      c.playable = false;
      delete c._tempPlayable;
    }
  });

  // Check game over
  if (state.allies.every(a => a.dead)) { endBattle(false); return; }
  if (state.enemies.every(e => e.dead)) { endBattle(true); return; }

  nextTurn();
}

function dealDmgToAlly(enemy, ally, dmg) {
  // Speed-based miss/dodge checks
  // Attacker (enemy) negative speed: MISS
  if (enemy.speed < 0 && Math.random() * 100 < Math.abs(enemy.speed)) {
    addLog(`${enemy.name} → ${ally.name}: MISS! (減速${enemy.speed}%)`, 'info');
    return;
  }
  // Defender (ally) positive speed: DODGE
  if (ally.speed > 0 && Math.random() * 100 < ally.speed) {
    addLog(`${enemy.name} → ${ally.name}: DODGE! (加速+${ally.speed}%)`, 'info');
    // Frame passive: phantom afterimage - next attack +3 on dodge
    if (hasRelic('passive_phantom')) {
      ally.buffs.dmgBonus = (ally.buffs.dmgBonus || 0) + 3;
      addLog(`${ally.name}: [残影] 次の攻撃+3`, 'status');
    }
    return;
  }

  // Linker damage share: redirect 25% to linked partner
  if (ally.linkedTo >= 0 && ally.linkMode === 'damage_share') {
    const partner = state.allies[ally.linkedTo];
    if (partner && !partner.dead) {
      const shared = Math.floor(dmg * 0.25);
      dmg -= shared;
      partner.hp -= shared;
      addLog(`${partner.name}: シェアードペイン ${shared}肩代わり`, 'dmg');
      if (partner.hp <= 0) { killAlly(partner); }
    }
  }

  let remaining = dmg;
  if (ally.barrier > 0) {
    const absorbed = Math.min(ally.barrier, remaining);
    ally.barrier -= absorbed;
    remaining -= absorbed;
    addLog(`${enemy.name} → ${ally.name}: ${dmg}ダメージ (フィールド${absorbed}吸収)`, 'barrier');
    if (ally.counterDmg > 0) {
      enemy.hp -= ally.counterDmg;
      addLog(`${ally.name}: カウンター ${ally.counterDmg}`, 'dmg');
      if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; addLog(`${enemy.name} 撃破!`, 'info'); }
    }
    // Spike armor: reflect 50% of absorbed damage back to attacker
    if (ally.spikeReflect > 0 && absorbed > 0) {
      const reflectDmg = Math.floor(absorbed * ally.spikeReflect);
      if (reflectDmg > 0) {
        enemy.hp -= reflectDmg;
        addLog(`${ally.name}: スパイクアーマー反射 ${reflectDmg}`, 'dmg');
        if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; addLog(`${enemy.name} 撃破!`, 'info'); }
      }
    }
    // Converter absorb field: gain element stack when hit by elemental attack
    if (ally.absorbField && absorbed > 0) {
      ally.elementStacks += 1;
      addLog(`${ally.name}: 属性吸収 蓄積+1 (合計: ${ally.elementStacks})`, 'status');
    }
    // Linker barrier share: when barrier applied, share 40% to partner
    if (ally.linkedTo >= 0 && ally.linkMode === 'barrier_share' && absorbed > 0) {
      const partner = state.allies[ally.linkedTo];
      if (partner && !partner.dead) {
        const sharedBarrier = Math.floor(absorbed * 0.4);
        // Don't re-share, just note the intent was to share barrier (barrier already applied)
      }
    }
  }
  if (remaining > 0) {
    ally.hp -= remaining;
    // Bulk iron body: track damage taken this turn
    if (ally.ironBody) {
      const counterGain = Math.floor(remaining * ally.ironBodyRate);
      ally.dmgTakenThisTurn += remaining;
      ally.damageCounter += counterGain;
      addLog(`${ally.name}: アイアンボディ 被弾カウンター+${counterGain}`, 'status');
    }
    if (ally.barrier <= 0) addLog(`${enemy.name} → ${ally.name}: ${remaining}ダメージ`, 'dmg');
    if (enemy.statuses && enemy.statuses.frozen) enemy.statuses.frozen = false;
  }
  if (ally.hp <= 0) { killAlly(ally); }
}

function killAlly(ally) {
  // Phoenix core check: revive at HP 1 instead of dying
  if (ally.phoenixCore) {
    ally.phoenixCore = false;
    ally.hp = 1;
    addLog(`${ally.name}: フェニックスコア発動! HP1で復帰`, 'heal');
    return;
  }
  // Last stand check: survive at HP 1 once this turn
  if (ally.lastStand) {
    ally.lastStand = false;
    ally.hp = 1;
    ally.damageCounter += 5;
    addLog(`${ally.name}: ラストスタンド発動! HP1で耐える`, 'heal');
    return;
  }

  ally.hp = 0;
  ally.dead = true;
  addLog(`${ally.name} 大破!`, 'dmg');

  // Decoy bomb explosion on death
  if (ally.bombCounter > 0) {
    const bombDmg = ally.bombCounter * 3;
    state.enemies.filter(e => !e.dead).forEach(e => {
      e.hp -= bombDmg;
      if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
    });
    addLog(`${ally.name}: 爆薬爆発! 全体${bombDmg}ダメージ`, 'dmg');
    ally.bombCounter = 0;
  }

  const ownerIdx = ally.id;
  [...state.deck, ...state.discard, ...state.hand].forEach(c => {
    if (c.ownerIdx === ownerIdx) c.playable = false;
  });
}

function endBattle(win) {
  state.battleOver = true;
  if (state.run) state.run.totalTurns += state.turn;

  if (!win) {
    // All allies dead -> run over
    showRunEnd(false);
    return;
  }

  // Track stats
  if (state.run) {
    state.run.battlesWon++;
    if (state._encounterType === 'elite') state.run.elitesKilled++;
    if (state._encounterType === 'boss') state.run.bossesKilled++;
  }

  // Show reward screen (no final boss - infinite progression)
  showRewardScreen();
}

// ============================================================
// CARD PLAY LOGIC
// ============================================================
let pendingCard = null;

function playCard(handIdx) {
  const card = state.hand[handIdx];
  if (!card || !card.playable || state.battleOver) return;
  // Check cost with full drive discount
  let effectiveCost = card.cost;
  if (state.allies.some(a => a.fullDriveActive) && card.effect !== 'full_drive') {
    effectiveCost = Math.max(0, effectiveCost - (state._fullDriveAmount || 1));
  }
  if (effectiveCost > state.en) return;

  const ally = state.allies[card.ownerIdx];
  if (ally.dead && card.type !== 'special') return;
  if (ally.attackLocked && card.type === 'attack') return;

  pendingCard = { card, handIdx };

  switch (card.target) {
    case 'enemy_single':
      showTargetModal('敵を選択', state.enemies.filter(e => !e.dead), 'enemy');
      break;
    case 'ally_single':
      showTargetModal('味方を選択', state.allies.filter(a => !a.dead), 'ally');
      break;
    case 'ally_dead':
      const deadAllies = state.allies.filter(a => a.dead);
      if (deadAllies.length === 0) { addLog('大破した味方がいません', 'info'); pendingCard = null; renderBattle(); return; }
      showTargetModal('再起動する味方を選択', deadAllies, 'ally');
      break;
    case 'provoke':
      showTargetModal('挑発する敵を選択', state.enemies.filter(e => !e.dead), 'enemy');
      break;
    case 'ally_pair':
      // For linker: need to select 2 allies - select first, then second
      showTargetModal('リンク対象1機目を選択', state.allies.filter(a => !a.dead), 'ally');
      break;
    case 'provoke_all':
      // Decoy distract - no target needed
      executeCard(null);
      break;
    default:
      executeCard(null);
      break;
  }
}

function executeCard(targetId) {
  if (!pendingCard) return;
  const { card, handIdx } = pendingCard;
  const ally = state.allies[card.ownerIdx];
  pendingCard = null;
  closeTargetModal();

  // Full Drive: reduce cost by 1 if active
  let actualCost = card.cost;
  if (state.allies.some(a => a.fullDriveActive) && card.effect !== 'full_drive') {
    const fdAmt = state._fullDriveAmount || 1;
    actualCost = Math.max(0, actualCost - fdAmt);
    state.allies.forEach(a => { a.fullDriveActive = false; });
    if (actualCost < card.cost) addLog(`フルドライブ! EN消費-${fdAmt}`, 'status');
  }
  state.en -= actualCost;

  let bonusDmg = (ally.buffs.dmgBonus || 0) + (ally.buffs.warcryBonus || 0);

  switch (card.type) {
    case 'attack': {
      const statVal = card.stat === 'OUT' ? ally.stats.OUT : 0;
      let cardBaseDmg = card.baseDmg + (card.upgraded && card.upgrade && card.upgrade.baseDmg ? card.upgrade.baseDmg : 0);
      let baseDmg = Math.round(cardBaseDmg * (1 + statVal * 0.04)) + bonusDmg;
      const hits = card.hits || 1;

      // --- Expansion: Converter reverse_charge / fusion_burst ---
      if (card.effect === 'reverse_charge') {
        const stacks = ally.elementStacks;
        const rawDmg = stacks > 0 ? stacks * card.accumMultiplier + card.baseDmg : card.baseDmg;
        baseDmg = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04));
        ally.elementStacks = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: リバースチャージ ${baseDmg}ダメ (蓄積${stacks}消費)`, 'dmg');
        }
      } else if (card.effect === 'fusion_burst') {
        const stacks = ally.elementStacks;
        const rawDmg = stacks * card.accumMultiplier + card.baseDmg;
        baseDmg = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04));
        ally.elementStacks = 0;
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          if (stacks >= card.accumThreshold && !enemy.dead) {
            enemy.statuses.overheat = (enemy.statuses.overheat || 0) + 2;
            enemy.statuses.shock = (enemy.statuses.shock || 0) + 1;
            addSpeedEffect(enemy, -10); // deceleration from fusion burst
          }
        });
        addLog(`${ally.name}: フュージョンバースト ${baseDmg}全体ダメ (蓄積${stacks}消費)`, 'dmg');
      } else if (card.effect === 'rail_cannon') {
        baseDmg = Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) + bonusDmg;
        ally.loadCounter = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: レールキャノン ${baseDmg}ダメ!`, 'dmg');
        }
      } else if (card.effect === 'satellite_cannon') {
        baseDmg = Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) + bonusDmg;
        ally.loadCounter = 0;
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
        });
        addLog(`${ally.name}: サテライトキャノン ${baseDmg}全体ダメ!`, 'dmg');
      } else if (card.effect === 'counter_blow') {
        baseDmg = Math.round((ally.damageCounter * card.counterMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) + bonusDmg;
        ally.damageCounter = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: カウンターブロー ${baseDmg}ダメ!`, 'dmg');
        }
      } else if (card.effect === 'exploit') {
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          let statusCount = 0;
          for (const s in enemy.statuses) { if (enemy.statuses[s]) statusCount++; }
          if (enemy.scanned) baseDmg += statusCount * card.perStatusBonus;
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: エクスプロイト ${baseDmg}ダメ (状態異常${statusCount}種)`, 'dmg');
        }
      // --- Standard attack logic ---
      } else if (card.target === 'enemy_single') {
        const enemy = state.enemies[targetId];
        if (!enemy || enemy.dead) { /* skip */ } else {
          for (let h = 0; h < hits; h++) {
            let dmg = baseDmg;
            // Backstab bonus: +N if target is targeting another ally
            if (card.backstabBonus && enemy.targetIdx !== ally.id) {
              let bonus = card.backstabBonus + (card.upgraded && card.upgrade && card.upgrade.backstabBonus ? card.upgrade.backstabBonus : 0);
              dmg += bonus;
            }
            // Overheat bonus (Blaster Meltdown)
            if (card.overheatBonus && enemy.statuses.overheat > 0) {
              let bonus = card.overheatBonus + (card.upgraded && card.upgrade && card.upgrade.overheatBonus ? card.upgrade.overheatBonus : 0);
              dmg += bonus;
            }
            // Vulnerability bonus (Cracker Crackshot)
            if (card.vulnerabilityBonus && enemy.statuses.vulnerability > 0) {
              let bonus = card.vulnerabilityBonus + (card.upgraded && card.upgrade && card.upgrade.vulnerabilityBonus ? card.upgrade.vulnerabilityBonus : 0);
              dmg += bonus;
            }
            if (enemy.marked) dmg += enemy.markBonus;
            if (enemy.weakPointBonus) dmg += enemy.weakPointBonus;
            dealDmgToEnemy(ally, enemy, dmg, card);
            if (enemy.dead) break;
          }
          if (enemy.dead && card.onKill) handleOnKill(ally, card.onKill);
        }
      } else if (card.target === 'enemy_all') {
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          let dmg = baseDmg;
          if (card.overheatBonus && enemy.statuses.overheat > 0) {
            let bonus = card.overheatBonus + (card.upgraded && card.upgrade && card.upgrade.overheatBonus ? card.upgrade.overheatBonus : 0);
            dmg += bonus;
          }
          if (enemy.marked) dmg += enemy.markBonus;
          if (enemy.weakPointBonus) dmg += enemy.weakPointBonus;
          dealDmgToEnemy(ally, enemy, dmg, card);
          if (enemy.dead && card.onKill) handleOnKill(ally, card.onKill);
        });
      } else if (card.target === 'enemy_random') {
        for (let h = 0; h < hits; h++) {
          const alive = state.enemies.filter(e => !e.dead);
          if (alive.length === 0) break;
          const enemy = alive[Math.floor(Math.random() * alive.length)];
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          if (enemy.dead && card.onKill) handleOnKill(ally, card.onKill);
        }
      }

      // Self field (Shielder Shield Bash)
      if (card.selfField) {
        let fieldAmt = card.selfField + (card.upgraded && card.upgrade && card.upgrade.selfField ? card.upgrade.selfField : 0);
        fieldAmt = Math.round(fieldAmt * (1 + ally.stats.SHL * 0.04));
        ally.barrier += fieldAmt;
        addLog(`${ally.name}: フィールド +${fieldAmt}`, 'barrier');
      }
      // Self heal (Medic Drain Lance, Overload Drain Shot)
      if (card.selfHeal) {
        let healAmt = card.selfHeal + (card.upgraded && card.upgrade && card.upgrade.selfHeal ? card.upgrade.selfHeal : 0);
        healAmt = Math.round(healAmt * (1 + ally.stats.CTRL * 0.04));
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
        addLog(`${ally.name}: HP +${healAmt}`, 'heal');
      }
      // Self damage (Overload)
      if (card.selfDmg && !card.effect) {
        let selfDmg = card.selfDmg + (card.upgraded && card.upgrade && card.upgrade.selfDmg ? card.upgrade.selfDmg : 0);
        if (hasRelic('passive_overload')) selfDmg = Math.max(0, selfDmg - 1); // 暴走: -1
        ally.hp -= selfDmg;
        addLog(`${ally.name}: 自傷 ${selfDmg}`, 'dmg');
        if (ally.hp <= 0) killAlly(ally);
      }
      if (card.selfRemoveBarrier) ally.barrier = 0;
      if (card.selfBuffAGI) addSpeedEffect(ally, card.selfBuffAGI);

      if (ally.buffs.warcryBonus) delete ally.buffs.warcryBonus;
      break;
    }
    case 'defend': {
      const statVal = card.stat === 'SHL' ? ally.stats.SHL : (card.stat === 'CTRL' ? ally.stats.CTRL : (card.stat === 'OUT' ? ally.stats.OUT : 0));
      const barrierAmt = Math.round(card.baseBarrier * (1 + statVal * 0.04));

      if (card.target === 'self' || card.target === 'provoke' || card.target === 'provoke_all') {
        if (card.persistent) {
          ally.persistentBarrier += barrierAmt;
          ally.barrier += barrierAmt;
        } else {
          ally.barrier += barrierAmt;
        }
        addLog(`${ally.name}: フィールド +${barrierAmt}`, 'barrier');
        if (card.counterDmg) ally.counterDmg = card.counterDmg;
        if (card.reactive) ally.reactive = true;
        if (card.lockAttack) ally.attackLocked = true;
        if (card.siegeBuff) ally.siegeBuff = card.siegeBuff;
        if (card.spikeReflect) ally.spikeReflect = card.spikeReflect;

        // Converter absorb field
        if (card.effect === 'absorb_field') {
          ally.absorbField = true;
          addLog(`${ally.name}: アブソーブフィールド(属性攻撃被弾で蓄積)`, 'status');
        }
        // Scavenger junk shield
        if (card.effect === 'junk_shield') {
          ally.junkShieldActive = true;
          ally.junkShieldBonus = card.killBarrierBonus;
        }

        if (card.target === 'provoke') {
          const enemy = state.enemies[targetId];
          if (enemy) {
            enemy.targetIdx = ally.id;
            addLog(`${ally.name}: ${enemy.name} を挑発!`, 'info');
          }
        }
        // Decoy distract: provoke ALL enemies
        if (card.target === 'provoke_all') {
          state.enemies.filter(e => !e.dead).forEach(e => {
            e.targetIdx = ally.id;
          });
          addLog(`${ally.name}: 全敵を挑発!`, 'info');
        }
      } else if (card.target === 'ally_single') {
        const target = state.allies[targetId];
        if (target) {
          if (card.persistent) {
            target.persistentBarrier += barrierAmt;
            target.barrier += barrierAmt;
          } else {
            target.barrier += barrierAmt;
          }
          addLog(`${target.name}: フィールド +${barrierAmt}`, 'barrier');
        }
      } else if (card.target === 'ally_all') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.barrier += barrierAmt;
        });
        addLog(`全機: フィールド +${barrierAmt}`, 'barrier');
      }
      break;
    }
    case 'heal': {
      const statVal = card.stat === 'CTRL' ? ally.stats.CTRL : 0;
      const healAmt = Math.round(card.baseHeal * (1 + statVal * 0.04));

      if (card.target === 'self') {
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
        addLog(`${ally.name}: HP +${healAmt}`, 'heal');
      } else if (card.target === 'ally_single') {
        const target = state.allies[targetId];
        target.hp = Math.min(target.maxHP, target.hp + healAmt);
        addLog(`${target.name}: HP +${healAmt}`, 'heal');
      } else if (card.target === 'ally_all') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.hp = Math.min(a.maxHP, a.hp + healAmt);
        });
        addLog(`全機: HP +${healAmt}`, 'heal');
      }
      break;
    }
    case 'buff': {
      if (card.effect === 'overdrive') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.overdrive = true;
        });
        addLog(`全機: オーバードライブ! 今ターン攻撃2回ヒット`, 'status');
      } else if (card.effect === 'chargeshot') {
        ally.buffs.chargeshot = card.chargeAmount;
        addLog(`${ally.name}: チャージ +${card.chargeAmount}`, 'status');
      } else if (card.effect === 'limiter') {
        ally.hp -= card.selfDmg;
        ally.buffs.dmgBonus = (ally.buffs.dmgBonus || 0) + card.amount;
        addLog(`${ally.name}: リミッター解除! HP-${card.selfDmg}, 攻撃+${card.amount}`, 'status');
        if (ally.hp <= 0) killAlly(ally);
      } else if (card.effect === 'powerlink') {
        const target = state.allies[targetId];
        target.buffs.powerlink = (target.buffs.powerlink || 0) + card.amount;
        addLog(`${target.name}: パワーリンク +${card.amount}`, 'status');
      } else if (card.effect === 'accel') {
        const target = state.allies[targetId];
        addSpeedEffect(target, card.amount);
        addLog(`${target.name}: 加速(+${card.amount}%, ${SPEED_DURATION}T)`, 'status');
      } else if (card.effect === 'fullboost') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.outBonus = (a.buffs.outBonus || 0) + card.amount;
          a.buffs.outBonus = (a.buffs.outBonus || 0) + card.amount;
        });
        state.en = Math.min(state.en + 1, state.enCap);
        addLog(`全機: OUT +${card.amount}, EN +1`, 'status');
      } else if (card.effect === 'smoke') {
        state.allies.filter(a => !a.dead).forEach(a => {
          addSpeedEffect(a, card.amount);
        });
        addLog(`全機: 加速(+${card.amount}%, ${SPEED_DURATION}T)`, 'status');
      // --- Expansion buff effects ---
      } else if (card.effect === 'element_coat_heat') {
        const target = state.allies[targetId];
        if (target) { target.elementCoat = 'heat'; addLog(`${target.name}: 熱量付与(持続)`, 'status'); }
      } else if (card.effect === 'element_coat_shock') {
        const target = state.allies[targetId];
        if (target) { target.elementCoat = 'shock'; addLog(`${target.name}: 電磁付与(持続)`, 'status'); }
      } else if (card.effect === 'link_boost') {
        // Boost linked allies
        const linked = state.allies.filter(a => !a.dead && a.linkedTo >= 0);
        linked.forEach(a => {
          a.buffs.outBonus = (a.buffs.outBonus || 0) + card.amount;
          a.buffs.outBonus = (a.buffs.outBonus || 0) + card.amount;
        });
        addLog(`リンク中の味方: OUT +${card.amount}`, 'status');
      } else if (card.effect === 'resonance') {
        const linked = state.allies.filter(a => !a.dead && a.linkedTo >= 0);
        linked.forEach(a => {
          a.buffs.powerlink = (a.buffs.powerlink || 0) + card.amount;
        });
        addLog(`リンク中の味方: 次攻撃 +${card.amount}`, 'status');
      } else if (card.effect === 'berserker') {
        const hpPct = ally.hp / ally.maxHP;
        const bonus = hpPct <= 0.5 ? card.lowBonus : card.highBonus;
        ally.berserkerBonus = bonus;
        ally.buffs.dmgBonus = (ally.buffs.dmgBonus || 0) + bonus;
        addLog(`${ally.name}: バーサーカーモード! 攻撃+${bonus}`, 'status');
      } else if (card.effect === 'data_link') {
        // Seeker data link: buff based on scanned count
        const scannedCount = state.enemies.filter(e => !e.dead && e.scanned).length;
        const totalBuff = card.baseAmount + scannedCount * card.perScanBonus;
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.outBonus = (a.buffs.outBonus || 0) + totalBuff;
          a.buffs.outBonus = (a.buffs.outBonus || 0) + totalBuff;
        });
        addLog(`全機: OUT +${totalBuff} (スキャン${scannedCount}体)`, 'status');
      } else if (card.effect === 'warcry') {
        // Warcry: all allies get +warcryBonus to next attack, self gets barrier
        const bonus = card.warcryBonus || 3;
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.warcryBonus = (a.buffs.warcryBonus || 0) + bonus;
        });
        ally.barrier += card.selfBarrier || 3;
        addLog(`全機: 次攻撃+${bonus}, ${ally.name}フィールド+${card.selfBarrier || 3}`, 'status');
      }
      // Apply ally speed (e.g. Booster's アクセルフィールド)
      if (card.applyAllySpeed) {
        if (card.target === 'ally_all') {
          state.allies.filter(a => !a.dead).forEach(a => {
            addSpeedEffect(a, card.applyAllySpeed);
          });
          addLog(`全機: 加速(+${card.applyAllySpeed}%, ${SPEED_DURATION}T)`, 'status');
        } else if (card.target === 'ally_single') {
          const target = state.allies[targetId];
          if (target) {
            addSpeedEffect(target, card.applyAllySpeed);
            addLog(`${target.name}: 加速(+${card.applyAllySpeed}%, ${SPEED_DURATION}T)`, 'status');
          }
        }
      }
      break;
    }
    case 'debuff': {
      if (card.target === 'enemy_single') {
        const enemy = state.enemies[targetId];
        if (!enemy || enemy.dead) break;
        // Apply status effects
        if (card.applyStatus) {
          applyCardStatuses(ally, enemy, card);
        }
        // Apply speed to target enemy
        if (card.applySpeed) {
          addSpeedEffect(enemy, card.applySpeed);
          addLog(`${enemy.name}: 減速(${card.applySpeed}%, ${SPEED_DURATION}T) → 速度${enemy.speed}%`, 'status');
        }
        // Expansion: mark
        if (card.effect === 'mark') {
          enemy.marked = true;
          enemy.markBonus = card.amount;
          addLog(`${enemy.name}: マーク! 次攻撃 +${card.amount}`, 'status');
        }
        // Expansion: scan
        if (card.effect === 'scan') {
          enemy.scanned = true;
          addLog(`${enemy.name}: スキャン(持続)。被ダメ+20%`, 'status');
        }
        if (card.effect === 'weak_point') {
          const bonus = enemy.scanned ? card.scannedBonus : card.unscannedBonus;
          enemy.weakPointBonus = (enemy.weakPointBonus || 0) + bonus;
          addLog(`${enemy.name}: ウィークポイント +${bonus}`, 'status');
        }
        if (card.debuffATK) {
          enemy.debuffs.atkReduction = (enemy.debuffs.atkReduction || 0) + card.debuffATK;
          addLog(`${enemy.name}: 攻撃力 -${card.debuffATK}`, 'status');
        }
      } else if (card.target === 'enemy_all') {
        // Apply status to all enemies
        if (card.applyStatus) {
          state.enemies.filter(e => !e.dead).forEach(e => {
            applyCardStatuses(ally, e, card);
          });
        }
        // Apply speed to all enemies
        if (card.applySpeed) {
          state.enemies.filter(e => !e.dead).forEach(e => {
            addSpeedEffect(e, card.applySpeed);
          });
          addLog(`敵全体: 減速(${card.applySpeed}%, ${SPEED_DURATION}T)`, 'status');
        }
        // Expansion: analyze field (scan all)
        if (card.effect === 'analyze_field') {
          state.enemies.filter(e => !e.dead).forEach(e => {
            e.scanned = true;
          });
          addLog(`敵全体: スキャン(持続)`, 'status');
        }
      }
      break;
    }
    case 'special': {
      if (card.effect === 'encharge') {
        state.en = Math.min(state.en + card.amount, state.enCap);
        addLog(`EN +${card.amount}`, 'info');
      } else if (card.effect === 'full_drive') {
        const fdAmount = card.upgraded && card.upgrade && card.upgrade.amount ? 1 + card.upgrade.amount : 1;
        state._fullDriveAmount = fdAmount;
        state.allies.forEach(a => { a.fullDriveActive = true; });
        addLog(`フルドライブ! 次のカードEN-${fdAmount}`, 'status');
      } else if (card.effect === 'reboot') {
        const target = state.allies[targetId];
        target.dead = false;
        target.hp = 1;
        [...state.deck, ...state.discard, ...state.hand].forEach(c => {
          if (c.ownerIdx === target.id) c.playable = true;
        });
        addLog(`${target.name}: リブート! HP1で再起動`, 'heal');
      // --- Expansion special effects ---
      } else if (card.effect === 'neural_link') {
        // Linker: link 2 allies. For simplicity, auto-pick 2 strongest alive non-linker allies
        const candidates = state.allies.filter(a => !a.dead && a.id !== ally.id);
        if (candidates.length >= 2) {
          const a1 = candidates[0], a2 = candidates[1];
          a1.linkedTo = a2.id; a2.linkedTo = a1.id;
          a1.linkMode = 'barrier_share'; a2.linkMode = 'barrier_share';
          addLog(`${a1.name} ↔ ${a2.name}: ニューラルリンク(フィールド共有40%)`, 'status');
        } else if (candidates.length === 1) {
          const a1 = candidates[0];
          a1.linkedTo = ally.id; ally.linkedTo = a1.id;
          a1.linkMode = 'barrier_share'; ally.linkMode = 'barrier_share';
          addLog(`${ally.name} ↔ ${a1.name}: ニューラルリンク`, 'status');
        }
      } else if (card.effect === 'synchro_attack') {
        state.allies.filter(a => !a.dead && a.linkedTo >= 0).forEach(a => { a.linkMode = 'attack_sync'; });
        addLog(`リンク切替: 攻撃連動(30%追撃)`, 'status');
      } else if (card.effect === 'shared_pain') {
        state.allies.filter(a => !a.dead && a.linkedTo >= 0).forEach(a => { a.linkMode = 'damage_share'; });
        addLog(`リンク切替: 被弾分散(25%肩代わり)`, 'status');
      } else if (card.effect === 'overcharge') {
        ally.bombCounter += card.bombAmount;
        addLog(`${ally.name}: 爆薬カウンター +${card.bombAmount} (合計: ${ally.bombCounter})`, 'status');
      } else if (card.effect === 'self_destruct') {
        // Trigger bomb explosion then kill self
        const bombDmg = ally.bombCounter > 0 ? ally.bombCounter * card.bombMultiplier : card.baseBombDmg;
        state.enemies.filter(e => !e.dead).forEach(e => {
          e.hp -= bombDmg;
          if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
        });
        addLog(`${ally.name}: セルフデストラクト! 全体${bombDmg}ダメージ`, 'dmg');
        ally.bombCounter = 0;
        killAlly(ally);
      } else if (card.effect === 'phoenix_core') {
        ally.phoenixCore = true;
        addLog(`${ally.name}: フェニックスコア(不死1回)`, 'status');
      } else if (card.effect === 'parts_salvage') {
        ally.partsSalvageActive = true;
        addLog(`${ally.name}: パーツ回収(今ターン撃破ボーナス)`, 'status');
      } else if (card.effect === 'precog') {
        // Pick best card from discard and put on top of deck
        if (state.discard.length > 0) {
          // AI: pick the most valuable playable card
          const best = state.discard.reduce((b, c) => (!b || c.cost > 0) ? c : b, null);
          const idx = state.discard.indexOf(best);
          if (idx >= 0) {
            state.discard.splice(idx, 1);
            state.deck.push(best); // push to top
            addLog(`${best.name} → 山札の上(次ターン確定ドロー)`, 'info');
          }
        } else { addLog(`捨て札なし`, 'info'); }
      } else if (card.effect === 'recall') {
        // Pick card from discard to hand
        if (state.discard.length > 0) {
          const best = state.discard.reduce((b, c) => (!b || c.cost > 0) ? c : b, null);
          const idx = state.discard.indexOf(best);
          if (idx >= 0) {
            state.discard.splice(idx, 1);
            state.hand.push(best);
            addLog(`${best.name} → 手札に回収`, 'info');
          }
        } else { addLog(`捨て札なし`, 'info'); }
      } else if (card.effect === 'accelerate') {
        for (let i = 0; i < card.drawAmount; i++) drawCard();
        addLog(`${card.drawAmount}枚追加ドロー`, 'info');
      } else if (card.effect === 'karma_reset') {
        // Put a card from hand to bottom of deck, gain EN
        // Auto: put the least valuable card
        const others = state.hand.filter((c, i) => i !== handIdx && c !== card);
        if (others.length > 0) {
          const worst = others[others.length - 1]; // last card as proxy for least valuable
          const wIdx = state.hand.indexOf(worst);
          if (wIdx >= 0) {
            state.hand.splice(wIdx, 1);
            state.deck.unshift(worst); // bottom of deck
            addLog(`${worst.name} → 山札の底`, 'info');
          }
        }
        state.en = Math.min(state.en + card.enGain, state.enCap);
        addLog(`EN +${card.enGain}`, 'info');
      } else if (card.effect === 'time_leap') {
        // Shuffle all discard back into deck, then draw
        state.deck = [...state.deck, ...state.discard];
        state.discard = [];
        shuffle(state.deck);
        for (let i = 0; i < card.drawAmount; i++) drawCard();
        addLog(`捨て札→山札シャッフル。${card.drawAmount}枚ドロー`, 'info');
      } else if (card.effect === 'load') {
        ally.loadCounter += card.loadAmount;
        addLog(`${ally.name}: 装填 +${card.loadAmount} (合計: ${ally.loadCounter})`, 'status');
      } else if (card.effect === 'quick_load') {
        ally.loadCounter += card.loadAmount;
        ally.hp -= card.selfDmg;
        addLog(`${ally.name}: 急速装填 +${card.loadAmount}, HP-${card.selfDmg} (装填: ${ally.loadCounter})`, 'status');
        if (ally.hp <= 0) killAlly(ally);
      } else if (card.effect === 'iron_body') {
        ally.ironBody = true;
        ally.ironBodyRate = card.absorbRate;
        addLog(`${ally.name}: アイアンボディ(被弾${Math.floor(card.absorbRate * 100)}%蓄積)`, 'status');
      } else if (card.effect === 'endurance') {
        const healAmt = Math.floor(ally.maxHP * card.healPct);
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
        ally.damageCounter += card.counterAdd;
        addLog(`${ally.name}: HP+${healAmt}, 被弾カウンター+${card.counterAdd} (合計: ${ally.damageCounter})`, 'heal');
      } else if (card.effect === 'last_stand') {
        ally.lastStand = true;
        ally.damageCounter += card.counterAdd;
        addLog(`${ally.name}: ラストスタンド! 被弾カウンター+${card.counterAdd} (合計: ${ally.damageCounter})`, 'status');
      } else if (card.effect === 'drone_deploy') {
        if (ally.drones.length < card.maxDrones) {
          const droneATK = Math.round(card.droneATK * (1 + ally.stats.OUT * 0.04));
          ally.drones.push({ hp: card.droneHP, maxHP: card.droneHP, atk: droneATK, mode: 'attack' });
          addLog(`${ally.name}: ドローン展開(HP${card.droneHP}, ATK${droneATK})`, 'status');
        } else {
          addLog(`${ally.name}: ドローン枠満杯(最大${card.maxDrones}機)`, 'info');
        }
      } else if (card.effect === 'drone_mode_change') {
        ally.droneGuardMode = !ally.droneGuardMode;
        ally.drones.forEach(d => { d.mode = ally.droneGuardMode ? 'guard' : 'attack'; });
        addLog(`ドローン: ${ally.droneGuardMode ? 'ガードモード' : 'アタックモード'}`, 'status');
      } else if (card.effect === 'command_focus') {
        ally.droneFocusTarget = targetId;
        ally.droneFocusMultiplier = card.focusMultiplier;
        addLog(`ドローン: ${state.enemies[targetId]?.name || '?'} に集中砲火`, 'status');
      } else if (card.effect === 'drone_self_destruct') {
        if (ally.drones.length > 0) {
          const drone = ally.drones.pop();
          const dmg = drone.hp + card.bonusDmg;
          state.enemies.filter(e => !e.dead).forEach(e => {
            e.hp -= dmg;
            if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
          });
          addLog(`ドローン自爆: 全体${dmg}ダメージ`, 'dmg');
        } else { addLog(`ドローンがいません`, 'info'); }
      } else if (card.effect === 'resupply' || card.effect === 'full_restock') {
        // Pick from discard to hand
        const pickCount = card.pickCount || 1;
        for (let i = 0; i < pickCount; i++) {
          if (state.discard.length > 0) {
            const best = state.discard.reduce((b, c) => (!b || c.cost > 0) ? c : b, null);
            const idx = state.discard.indexOf(best);
            if (idx >= 0) {
              state.discard.splice(idx, 1);
              state.hand.push(best);
              addLog(`${best.name} → 手札に補給`, 'info');
            }
          }
        }
      } else if (card.effect === 'emergency_repair') {
        // Find a Dead Draw card and make it playable this turn
        const deadDraws = state.hand.filter(c => !c.playable);
        if (deadDraws.length > 0) {
          deadDraws[0].playable = true;
          deadDraws[0]._tempPlayable = true; // mark for end-of-turn reset
          addLog(`${deadDraws[0].name}: 今ターンのみ使用可能!`, 'heal');
        } else { addLog(`Dead Drawカードなし`, 'info'); }
      } else if (card.effect === 'supply_drop') {
        for (let i = 0; i < card.drawAmount; i++) drawCard();
        state.en = Math.min(state.en + card.enGain, state.enCap);
        addLog(`${card.drawAmount}枚追加ドロー, EN+${card.enGain}`, 'info');
      }
      break;
    }
  }

  state.hand.splice(handIdx, 1);
  state.discard.push(card);

  if (state.enemies.every(e => e.dead)) { endBattle(true); return; }
  if (state.allies.every(a => a.dead)) { endBattle(false); return; }

  renderBattle();
}

function dealDmgToEnemy(ally, enemy, baseDmg, card) {
  let dmg = baseDmg;

  // Frame passive: striker turn 1 bonus
  if (hasRelic('passive_striker') && state.turn === 1) dmg += 3;
  // Frame passive: cracker bonus vs vulnerable enemies
  if (hasRelic('passive_cracker') && enemy.statuses.vulnerability > 0) dmg += 2;

  // Seeker scan bonus: +20% damage to scanned enemies (expansion)
  if (enemy.scanned) {
    dmg = Math.floor(dmg * 1.2);
  }

  // Speed-based hit/dodge checks
  if (!card.unavoidable) {
    // Attacker (ally) negative speed: MISS
    if (ally.speed < 0 && Math.random() * 100 < Math.abs(ally.speed)) {
      addLog(`${ally.name} → ${enemy.name}: MISS! (減速${ally.speed}%)`, 'info');
      return;
    }
    // Defender (enemy) positive speed: DODGE
    if (enemy.speed > 0 && Math.random() * 100 < enemy.speed) {
      addLog(`${ally.name} → ${enemy.name}: DODGE! (加速+${enemy.speed}%)`, 'info');
      return;
    }
  }

  // Shock: damage taken ×1.2 while shocked
  if (enemy.statuses.shock > 0) {
    dmg = Math.floor(dmg * 1.2);
    addLog(`感電ボーナス! ×1.2`, 'status');
  }

  // Vulnerability: add N to damage, then consume
  if (enemy.statuses.vulnerability > 0) {
    dmg += enemy.statuses.vulnerability;
    addLog(`脆弱消費! +${enemy.statuses.vulnerability}`, 'status');
    enemy.statuses.vulnerability = 0;
  }

  // Barrier removal (Armor Break)
  if (card.removeBarrier) {
    if (enemy.barrier > 0) addLog(`${enemy.name}: フィールド除去!`, 'barrier');
    enemy.barrier = 0;
  }

  // Barrier absorption
  let remaining = dmg;
  if (enemy.barrier > 0 && !card.removeBarrier) {
    const absorbed = Math.min(enemy.barrier, remaining);
    enemy.barrier -= absorbed;
    remaining -= absorbed;
    if (absorbed > 0) addLog(`${ally.name} → ${enemy.name}: ${dmg}ダメージ (フィールド${absorbed}吸収)`, 'barrier');
  }
  if (remaining > 0) {
    enemy.hp -= remaining;
    addLog(`${ally.name} → ${enemy.name}: ${remaining}ダメージ`, 'dmg');
  }

  // Element coat: add status effects from physical attacks (expansion)
  if (ally.elementCoat) {
    if (ally.elementCoat === 'heat') {
      enemy.statuses.overheat = (enemy.statuses.overheat || 0) + 1;
      addLog(`${enemy.name}: 熱量付与 → 過熱+1`, 'status');
    } else if (ally.elementCoat === 'shock') {
      enemy.statuses.shock = (enemy.statuses.shock || 0) + 1;
      addLog(`${enemy.name}: 電磁付与 → 感電+1T`, 'status');
    }
  }

  // Apply statuses from attack card (AFTER damage - vulnerability from this card doesn't benefit this attack)
  applyCardStatuses(ally, enemy, card);

  // Apply speed effects from card
  if (card.applySpeed) {
    addSpeedEffect(enemy, card.applySpeed);
    addLog(`${enemy.name}: 減速(${card.applySpeed}%, ${SPEED_DURATION}T) → 速度${enemy.speed}%`, 'status');
  }
  if (card.applySelfSpeed) {
    addSpeedEffect(ally, card.applySelfSpeed);
    addLog(`${ally.name}: 加速(+${card.applySelfSpeed}%, ${SPEED_DURATION}T) → 速度+${ally.speed}%`, 'status');
  }

  // Legacy debuffs for expansion frames
  if (card.debuffAGI) {
    enemy.debuffs.agiReduction = { val: card.debuffAGI, dur: card.debuffDur || 1 };
  }
  if (card.debuffATK) {
    enemy.debuffs.atkReduction = (enemy.debuffs.atkReduction || 0) + card.debuffATK;
  }

  if (enemy.hp <= 0) {
    enemy.hp = 0; enemy.dead = true;
    addLog(`${enemy.name} 撃破!`, 'info');
    // Parts salvage (expansion)
    state.allies.forEach(a => {
      if (!a.dead && a.partsSalvageActive) {
        state.en = Math.min(state.en + 1, state.enCap);
        ally.hp = Math.min(ally.maxHP, ally.hp + 3);
        addLog(`パーツ回収: EN+1, ${ally.name} HP+3`, 'info');
      }
      if (!a.dead && a.junkShieldActive) {
        a.barrier += a.junkShieldBonus;
        addLog(`${a.name}: ジャンクシールド +${a.junkShieldBonus}フィールド`, 'barrier');
      }
    });
  }

  // Linker attack sync (expansion)
  if (ally.linkedTo >= 0 && ally.linkMode === 'attack_sync' && !enemy.dead) {
    const partner = state.allies[ally.linkedTo];
    if (partner && !partner.dead) {
      const syncDmg = Math.floor(dmg * 0.3);
      if (syncDmg > 0) {
        enemy.hp -= syncDmg;
        addLog(`${partner.name}: シンクロ追撃 ${syncDmg}`, 'dmg');
        if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; addLog(`${enemy.name} 撃破!`, 'info'); }
      }
    }
  }
}

// Apply status effects from a card to an enemy (used by both attack and debuff cards)
// CTRL scaling: overheat/vulnerability scale with applier CTRL, shock does NOT
function applyCardStatuses(ally, enemy, card) {
  if (!card.applyStatus) return;
  const statuses = Array.isArray(card.applyStatus) ? card.applyStatus : [card.applyStatus];
  const ctrlMultiplier = 1 + (ally.stats.CTRL || 0) * 0.04;
  const upgraded = card.upgraded && card.upgrade;

  for (const st of statuses) {
    if (st.type === 'overheat') {
      let stacks = st.stacks + (upgraded && card.upgrade.stacks ? card.upgrade.stacks : 0);
      stacks = Math.floor(stacks * ctrlMultiplier);
      enemy.statuses.overheat = (enemy.statuses.overheat || 0) + stacks;
      addLog(`${enemy.name}: 過熱(${stacks})`, 'status');
    } else if (st.type === 'vulnerability') {
      let stacks = st.stacks + (upgraded && card.upgrade.stacks ? card.upgrade.stacks : 0);
      stacks = Math.floor(stacks * ctrlMultiplier);
      if (hasRelic('passive_gunner')) stacks += 1; // 精密照準: +1
      enemy.statuses.vulnerability = (enemy.statuses.vulnerability || 0) + stacks;
      addLog(`${enemy.name}: 脆弱(${stacks})`, 'status');
    } else if (st.type === 'shock') {
      let turns = st.turns + (upgraded && card.upgrade.turns ? card.upgrade.turns : 0);
      if (hasRelic('passive_jammer')) turns += 1; // 電磁干渉: +1T
      enemy.statuses.shock = (enemy.statuses.shock || 0) + turns;
      addLog(`${enemy.name}: 感電(${turns}T)`, 'status');
    }
  }
}

// Scavenger on-kill effects
function handleOnKill(ally, onKill) {
  switch (onKill.type) {
    case 'en_recover':
      state.en = Math.min(state.en + onKill.amount, state.enCap);
      addLog(`${ally.name}: 撃破ボーナス EN+${onKill.amount}`, 'info');
      break;
    case 'draw':
      for (let i = 0; i < onKill.amount; i++) drawCard();
      addLog(`${ally.name}: 撃破ボーナス ${onKill.amount}枚ドロー`, 'info');
      break;
    case 'permanent_buff':
      state.allies.filter(a => !a.dead).forEach(a => {
        a.stats.OUT += onKill.amount;
      });
      addLog(`フィールドストリップ: 全機OUT+${onKill.amount}(永続)`, 'status');
      break;
  }
}

// ============================================================
// CONSUMABLE ITEMS
// ============================================================
// ============================================================
// CARD UPGRADE SYSTEM
// ============================================================
function getUpgradedCard(card) {
  const u = { ...card };
  u.upgraded = true;
  u.name = card.name + '+';

  // New upgrade system: use the upgrade field from card data
  if (card.upgrade) {
    const up = card.upgrade;
    if (up.costReduction) u.cost = Math.max(0, (card.cost || 0) - up.costReduction);
    if (up.amount) u.amount = (card.amount || 0) + up.amount;
    if (up.baseDmg) u.baseDmg = (card.baseDmg || 0) + up.baseDmg;
    if (up.baseBarrier) u.baseBarrier = (card.baseBarrier || 0) + up.baseBarrier;
    if (up.baseHeal) u.baseHeal = (card.baseHeal || 0) + up.baseHeal;
    if (up.selfField) u.selfField = (card.selfField || 0) + up.selfField;
    if (up.selfHeal) u.selfHeal = (card.selfHeal || 0) + up.selfHeal;
    if (up.selfDmg) u.selfDmg = Math.max(0, (card.selfDmg || 0) + up.selfDmg); // selfDmg upgrade is negative (reduction)
    if (up.backstabBonus) u.backstabBonus = (card.backstabBonus || 0) + up.backstabBonus;
    if (up.overheatBonus) u.overheatBonus = (card.overheatBonus || 0) + up.overheatBonus;
    if (up.vulnerabilityBonus) u.vulnerabilityBonus = (card.vulnerabilityBonus || 0) + up.vulnerabilityBonus;
    if (up.applyAllySpeed) u.applyAllySpeed = (card.applyAllySpeed || 0) + up.applyAllySpeed;
    if (up.applySelfSpeed) u.applySelfSpeed = (card.applySelfSpeed || 0) + up.applySelfSpeed;
    if (up.applySpeed) u.applySpeed = (card.applySpeed || 0) + up.applySpeed;
    // Status stacks/turns are handled at apply time via card.upgraded check
  }

  // Rebuild description with actual upgraded values
  u.desc = buildCardDesc(u);
  return u;
}

function buildCardDesc(card) {
  const parts = [];

  // Attack damage
  if (card.type === 'attack' && card.baseDmg) {
    if (card.target === 'enemy_all') {
      parts.push(`敵全体に${card.baseDmg}ダメージ`);
    } else if (card.target === 'enemy_random') {
      parts.push(`ランダム敵に${card.baseDmg}×${card.hits || 1}回ダメージ`);
    } else {
      parts.push(`敵1体に${card.baseDmg}ダメージ`);
    }
  }

  // Field removal
  if (card.removeBarrier) parts.push('フィールド全除去');

  // Self field
  if (card.selfField) parts.push(`自機フィールド${card.selfField}`);

  // Self heal
  if (card.selfHeal) parts.push(`自機HP${card.selfHeal}回復`);

  // Self damage
  if (card.selfDmg) parts.push(`自機HP-${card.selfDmg}`);

  // Unavoidable
  if (card.unavoidable) parts.push('回避不可');

  // Status effects
  if (card.applyStatus) {
    const st = card.applyStatus;
    if (st.type === 'overheat') parts.push(`過熱(${st.stacks})付与`);
    if (st.type === 'vulnerability') parts.push(`脆弱(${st.stacks})付与`);
    if (st.type === 'shock') parts.push(`感電(${st.turns}T)付与`);
  }

  // Speed
  if (card.applySpeed) parts.push(`減速(${card.applySpeed})付与`);
  if (card.applySelfSpeed) parts.push(`自機加速(+${card.applySelfSpeed})`);
  if (card.applyAllySpeed) parts.push(`全機加速(+${card.applyAllySpeed})`);

  // Bonuses
  if (card.backstabBonus) parts.push(`他をターゲット中なら+${card.backstabBonus}`);
  if (card.overheatBonus) parts.push(`過熱敵に+${card.overheatBonus}`);
  if (card.vulnerabilityBonus) parts.push(`脆弱敵に+${card.vulnerabilityBonus}`);

  // Defend
  if (card.type === 'defend') {
    if (card.target === 'provoke') parts.push(`挑発。自機フィールド${card.baseBarrier}`);
    else if (card.target === 'provoke_all') parts.push(`全体挑発。自機フィールド${card.baseBarrier}`);
    else if (card.target === 'ally_all') parts.push(`全機フィールド${card.baseBarrier}`);
    else parts.push(`自機フィールド${card.baseBarrier}`);
  }

  // Heal
  if (card.type === 'heal') {
    if (card.target === 'ally_all') parts.push(`全機HP${card.baseHeal}回復`);
    else parts.push(`味方1機HP${card.baseHeal}回復`);
  }

  // Special
  if (card.effect === 'reboot') parts.push('大破味方1機をHP1で再起動');
  if (card.effect === 'encharge') parts.push(`EN+${card.amount}`);
  if (card.effect === 'full_drive') parts.push('次カードEN-1');

  // Debuff only (no damage)
  if (card.type === 'debuff' && card.applyStatus) {
    const st = card.applyStatus;
    if (st.type === 'overheat') parts.push(`過熱(${st.stacks})付与`);
    if (st.type === 'shock') parts.push(`感電(${st.turns}T)付与`);
  }
  if (card.type === 'debuff' && card.applySpeed) parts.push(`敵全体減速(${card.applySpeed})`);
  if (card.type === 'buff' && card.applyAllySpeed) parts.push(`全機加速(+${card.applyAllySpeed})`);

  let desc = parts.join('。');
  if (card.upgraded) desc += ' [+]';
  return desc;
}

// ============================================================
// REWARD SCREEN
// ============================================================
function showRewardScreen() {
  state.rewardCardChosen = false;
  state.rewardRelicChosen = false;
  const isEliteOrBoss = state._encounterType === 'elite' || state._encounterType === 'boss';

  showScreen('reward-screen');

  // Card discovery
  renderRewardCardChoice();

  // Relic for elite/boss
  if (isEliteOrBoss) {
    document.getElementById('reward-relic-section').style.display = '';
    renderRewardRelicChoice();
  } else {
    document.getElementById('reward-relic-section').style.display = 'none';
    state.rewardRelicChosen = true;
  }

  updateContinueBtn();
}

function renderRewardCardChoice() {
  const container = document.getElementById('reward-card-list');
  container.innerHTML = '';

  const pool = [...state.run.cardPool];
  shuffle(pool);
  const count = hasRelic('card_scanner') ? 4 : 3;
  const choices = pool.slice(0, count);

  if (choices.length === 0) {
    container.innerHTML = '<p style="color:#888;">発見可能なカードがありません</p>';
    state.rewardCardChosen = true;
    updateContinueBtn();
    return;
  }

  choices.forEach(card => {
    const owner = state.allies[card.ownerIdx];
    const ownerName = owner ? owner.name : '?';
    const div = document.createElement('div');
    div.className = 'reward-card-option';
    div.innerHTML = `
      <div style="color:#666;font-size:10px;margin-bottom:2px;">${ownerName}</div>
      <div><span style="color:#ff6;font-weight:bold;">EN${card.cost}</span> <span style="color:#aaf;font-weight:bold;">${card.name}</span></div>
      <div style="color:#999;font-size:11px;margin-top:4px;">${card.desc}</div>
    `;
    div.onclick = () => {
      if (state.rewardCardChosen) return;
      // Add card to owner's deck
      const ally = state.allies[card.ownerIdx];
      if (!ally) return;
      let newCard = { ...card };
      // Apply upgrade_kit relic: 50% chance to auto-upgrade
      if (hasRelic('upgrade_kit') && !newCard.upgraded && newCard.upgrade && Math.random() < 0.5) {
        newCard = getUpgradedCard(newCard);
        newCard.ownerIdx = card.ownerIdx;
        newCard.ownerFrame = card.ownerFrame;
        newCard.playable = !ally.dead;
        newCard.id = card.id;
      }
      ally.cards.push(newCard);
      // Remove from pool
      state.run.cardPool = state.run.cardPool.filter(c => c.id !== card.id);
      state.rewardCardChosen = true;
      container.querySelectorAll('.reward-card-option').forEach(el => el.style.opacity = '0.3');
      div.style.opacity = '1';
      div.style.borderColor = '#6aff6a';
      if (newCard.upgraded) div.style.borderColor = '#4a4';
      updateContinueBtn();
    };
    container.appendChild(div);
  });
}

function renderRewardRelicChoice() {
  const container = document.getElementById('reward-relic-list');
  container.innerHTML = '';

  const rarity = state._encounterType === 'boss' ? 'boss' : 'any';
  const choices = getRelicChoices(rarity, 3);

  if (choices.length === 0) {
    container.innerHTML = '<p style="color:#888;">獲得可能なレリックがありません</p>';
    state.rewardRelicChosen = true;
    updateContinueBtn();
    return;
  }

  choices.forEach(relicId => {
    const def = RELIC_DEFS[relicId];
    const div = document.createElement('div');
    div.className = 'reward-relic';
    const rarityColor = { common: '#6aff6a', uncommon: '#6af', rare: '#fa0', boss: '#f6f' }[def.rarity] || '#fff';
    div.innerHTML = `
      <div class="relic-name" style="color:${rarityColor};">${def.name}</div>
      <div class="relic-desc">${def.desc}</div>
      <div class="relic-rarity" style="color:${rarityColor};font-size:9px;">${def.rarity.toUpperCase()}</div>
    `;
    div.onclick = () => {
      if (state.rewardRelicChosen) return;
      state.relics.push(relicId);
      state.rewardRelicChosen = true;
      container.querySelectorAll('.reward-relic').forEach(el => el.style.opacity = '0.3');
      div.style.opacity = '1';
      div.style.borderColor = rarityColor;
      updateContinueBtn();
    };
    container.appendChild(div);
  });
}

function updateContinueBtn() {
  const allDone = state.rewardCardChosen && state.rewardRelicChosen;
  document.getElementById('btn-continue-run').disabled = !allDone;
}

function continueRun() {
  // After boss, go directly to next act (no event between acts)
  if (state._encounterType === 'boss') {
    advanceToBattle();
    return;
  }
  // ~40% chance to show an inter-battle event
  if (Math.random() < 0.4) {
    showLinearEvent();
  } else {
    showProgressScreen();
  }
}

// ============================================================
// INTER-BATTLE EVENT SCREEN
// ============================================================
function showLinearEvent() {
  const event = LINEAR_EVENTS[Math.floor(Math.random() * LINEAR_EVENTS.length)];
  showScreen('event-screen');

  document.getElementById('event-title').textContent = `[ ${event.title} ]`;
  document.getElementById('event-description').innerHTML = `<p>${event.desc}</p>`;

  const container = document.getElementById('event-choices');
  container.innerHTML = '';

  event.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'event-choice-btn';
    btn.innerHTML = `<span class="choice-label">${choice.label}</span><span class="choice-desc">${choice.desc}</span>`;
    btn.onclick = () => {
      resolveEvent(choice.action);
    };
    container.appendChild(btn);
  });
}

function resolveEvent(action) {
  let resultMsg = '';

  switch (action) {
    case 'nothing':
      resultMsg = '何も起きなかった。';
      break;
    case 'repair_30':
      state.allies.filter(a => !a.dead).forEach(a => {
        const heal = Math.floor(a.maxHP * 0.3);
        const oldHP = a.hp;
        a.hp = Math.min(a.maxHP, a.hp + heal);
        const actual = a.hp - oldHP;
        resultMsg += `${a.name}: HP +${actual} (${a.hp}/${a.maxHP})\n`;
      });
      resultMsg = '機体を整備した。\n' + resultMsg;
      break;
    case 'free_upgrade': {
      const upgradable = [];
      state.allies.forEach(a => {
        if (a.dead) return;
        a.cards.forEach((c, ci) => { if (!c.upgraded) upgradable.push({ ally: a, idx: ci }); });
      });
      if (upgradable.length > 0) {
        const pick = upgradable[Math.floor(Math.random() * upgradable.length)];
        const upgraded = getUpgradedCard(pick.ally.cards[pick.idx]);
        upgraded.ownerIdx = pick.ally.id;
        upgraded.ownerFrame = pick.ally.frameKey;
        upgraded.playable = true;
        upgraded.id = pick.ally.cards[pick.idx].id;
        pick.ally.cards[pick.idx] = upgraded;
        resultMsg = `${pick.ally.name}の ${upgraded.name} を最適化(+)した!`;
      } else {
        resultMsg = 'アップグレード可能なカードがなかった。';
      }
      break;
    }
    case 'remove_card':
      showCardRemovalUI();
      return; // Don't show result yet
    case 'find_relic': {
      const choices = getRelicChoices('any', 1);
      if (choices.length > 0) {
        state.relics.push(choices[0]);
        const def = RELIC_DEFS[choices[0]];
        resultMsg = `レリック「${def.name}」を獲得!\n${def.desc}`;
      } else {
        resultMsg = '獲得可能なレリックがなかった。';
      }
      break;
    }
    case 'gamble_relic': {
      state.allies.filter(a => !a.dead).forEach(a => {
        const cost = Math.floor(a.maxHP * 0.2);
        a.hp = Math.max(1, a.hp - cost);
      });
      const successRate = hasRelic('lucky_coin') ? 0.7 : 0.5;
      if (Math.random() < successRate) {
        const choices = getRelicChoices('any', 1);
        if (choices.length > 0) {
          state.relics.push(choices[0]);
          const def = RELIC_DEFS[choices[0]];
          resultMsg = `成功! レリック「${def.name}」を獲得!\n${def.desc}`;
        } else {
          resultMsg = '成功したが、獲得可能なレリックがなかった。';
        }
      } else {
        resultMsg = 'エネルギーは不安定すぎた。HPを消耗しただけだった...';
      }
      break;
    }
  }

  const container = document.getElementById('event-choices');
  container.innerHTML = `
    <pre style="color:#6aff6a; margin:12px 0; white-space:pre-wrap;">${resultMsg}</pre>
    <button class="btn-primary" onclick="showProgressScreen()">CONTINUE</button>
  `;
}

function showCardRemovalUI() {
  const container = document.getElementById('event-choices');
  container.innerHTML = '<p style="color:#fff;margin-bottom:8px;">除去するカードを選択:</p>';
  const cardList = document.createElement('div');
  cardList.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

  state.allies.forEach(a => {
    a.cards.forEach((c, ci) => {
      const div = document.createElement('button');
      div.className = 'event-choice-btn';
      div.innerHTML = `<span class="choice-label">${a.name} - ${c.name}${c.upgraded ? '+' : ''} (EN${c.cost})</span><span class="choice-desc">${c.desc}</span>`;
      div.onclick = () => {
        a.cards.splice(ci, 1);
        container.innerHTML = `
          <pre style="color:#6aff6a; margin:12px 0;">「${c.name}」を除去した。デッキ枚数: ${state.allies.reduce((s, al) => s + al.cards.length, 0)}枚</pre>
          <button class="btn-primary" onclick="showProgressScreen()">CONTINUE</button>
        `;
      };
      cardList.appendChild(div);
    });
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'やめる';
  cancelBtn.style.cssText = 'margin-top:8px;';
  cancelBtn.onclick = () => {
    container.innerHTML = `
      <pre style="color:#888; margin:12px 0;">カード除去を見送った。</pre>
      <button class="btn-primary" onclick="showProgressScreen()">CONTINUE</button>
    `;
  };

  container.appendChild(cardList);
  container.appendChild(cancelBtn);
}

// ============================================================
// RUN END SCREEN
// ============================================================
function showRunEnd(victory) {
  showScreen('runend-screen');
  const title = document.getElementById('runend-title');
  title.textContent = '[ MISSION FAILED ]';
  title.style.color = '#ff6a6a';

  let html = '<div class="run-stats">';
  html += `<p><span class="stat-label">到達Act: </span><span class="stat-value">${state.run.act}</span></p>`;
  html += `<p><span class="stat-label">Act内戦闘: </span><span class="stat-value">${state.run.battleIndex}/10</span></p>`;
  html += `<p><span class="stat-label">総戦闘数: </span><span class="stat-value">${state.run.battlesWon}</span></p>`;
  html += `<p><span class="stat-label">ボス撃破: </span><span class="stat-value">${state.run.bossesKilled}</span></p>`;
  html += `<p><span class="stat-label">レリック: </span><span class="stat-value">${state.relics.length}</span></p>`;
  html += `<p><span class="stat-label">デッキ枚数: </span><span class="stat-value">${state.allies.reduce((s, a) => s + a.cards.length, 0)}</span></p>`;
  html += `<p><span class="stat-label">総ターン数: </span><span class="stat-value">${state.run.totalTurns}</span></p>`;

  html += '<h3 style="margin-top:12px;">// SQUAD STATUS</h3>';
  state.allies.forEach(a => {
    html += `<p>${a.name}: ${a.dead ? '<span style="color:#f44;">DESTROYED</span>' : `HP ${a.hp}/${a.maxHP}`}</p>`;
  });

  html += '</div>';
  document.getElementById('runend-stats').innerHTML = html;
}

// ============================================================
// TARGET MODAL
// ============================================================
function showTargetModal(title, units, type) {
  document.getElementById('target-title').textContent = title;
  const container = document.getElementById('target-buttons');
  container.innerHTML = '';
  units.forEach(u => {
    const btn = document.createElement('button');
    btn.className = 'target-btn';
    btn.textContent = `${u.name} (HP: ${u.hp}/${u.maxHP}${u.barrier ? ' B:' + u.barrier : ''})`;
    btn.onclick = () => executeCard(u.id);
    container.appendChild(btn);
  });
  document.getElementById('target-modal').style.display = 'flex';
}

function closeTargetModal() {
  document.getElementById('target-modal').style.display = 'none';
  pendingCard = null;
  renderBattle();
}

// ============================================================
// PROGRESS SCREEN RENDERING
// ============================================================
function renderProgressScreen() {
  const act = state.run.act;
  const bi = state.run.battleIndex; // next battle index (0-based)
  const battleNum = bi + 1; // display as 1-based

  // HUD
  const hud = document.getElementById('progress-hud');
  let hudHtml = '';
  hudHtml += `<div class="run-hud-item"><span class="label">ACT</span> <span class="value">${act}</span></div>`;
  hudHtml += `<div class="run-hud-item"><span class="label">BATTLE</span> <span class="value">${battleNum}/10</span></div>`;
  hudHtml += `<div class="run-hud-item"><span class="label">TOTAL</span> <span class="value">${state.run.overallBattle}</span></div>`;
  hudHtml += `<div class="run-hud-item"><span class="label">RELICS</span> <span class="value">${state.relics.length}</span></div>`;
  hudHtml += `<div class="run-hud-item"><span class="label">DECK</span> <span class="value">${state.allies.reduce((s, a) => s + a.cards.length, 0)}</span></div>`;
  hud.innerHTML = hudHtml;

  // Progress bar (10 segments for current act)
  const barWrapper = document.getElementById('progress-bar-wrapper');
  let barHtml = `<div class="progress-act-label">-- ACT ${act} --</div>`;
  barHtml += '<div class="progress-bar-segments">';
  for (let i = 0; i < 10; i++) {
    const isBoss = i === 9;
    let cls = 'progress-segment';
    if (i < bi) cls += ' completed';
    else if (i === bi) cls += ' current';
    if (isBoss) cls += ' boss';

    const tierLabels = { weak: 'W', mid: 'M', strong: 'S', boss: 'BOSS' };
    const tier = state.run.enemySequence[i]?.tier || '?';
    barHtml += `<div class="${cls}">${isBoss ? 'B' : (i + 1)}</div>`;
  }
  barHtml += '</div>';
  barWrapper.innerHTML = barHtml;

  // Squad status
  const info = document.getElementById('progress-info');
  let infoHtml = '<div class="progress-squad">';
  state.allies.forEach(a => {
    const hpPct = (a.hp / a.maxHP * 100);
    const color = a.dead ? '#f44' : (hpPct < 30 ? '#fa0' : '#6aff6a');
    infoHtml += `<div class="progress-unit">
      <span class="progress-unit-name">${a.name}</span>
      <span class="progress-unit-hp" style="color:${color};">${a.dead ? 'DESTROYED' : `${a.hp}/${a.maxHP}`}</span>
      ${!a.dead ? `<div class="progress-hp-bar"><div class="progress-hp-fill" style="width:${hpPct}%;background:${color};"></div></div>` : ''}
    </div>`;
  });
  infoHtml += '</div>';
  info.innerHTML = infoHtml;
}

function renderBattleHUD() {
  const hud = document.getElementById('battle-hud');
  if (!state.run) { hud.innerHTML = ''; return; }
  const tierLabels = { normal: 'NORMAL', elite: 'ELITE', boss: 'BOSS' };
  const typeLabel = tierLabels[state._encounterType] || '';
  let html = '';
  html += `<div class="run-hud-item"><span class="label">ACT</span> <span class="value">${state.run.act}</span></div>`;
  html += `<div class="run-hud-item"><span class="label">BATTLE</span> <span class="value">${state.run.battleIndex}/10</span></div>`;
  if (typeLabel) html += `<div class="run-hud-item"><span class="label">TYPE</span> <span class="value" style="color:#f88;">${typeLabel}</span></div>`;
  html += `<div class="run-hud-item"><span class="label">RELICS</span> <span class="value">${state.relics.length}</span></div>`;
  hud.innerHTML = html;
}

// ============================================================
// RENDERING
// ============================================================
function renderBattle() {
  // Enemies
  const enemyDiv = document.getElementById('enemy-units');
  enemyDiv.innerHTML = '';
  state.enemies.forEach(e => {
    const intentText = getIntentText(e);
    const statusText = getEnemyStatusText(e);
    const hpPct = (e.hp / e.maxHP * 100);
    enemyDiv.innerHTML += `
      <div class="unit-card ${e.dead ? 'dead' : ''}">
        <strong>${e.name}</strong> HP: ${e.hp}/${e.maxHP} ${e.barrier > 0 ? `<span style="color:#44a;">B:${e.barrier}</span>` : ''}
        <div class="hp-bar"><div class="hp-fill ${hpPct < 30 ? 'low' : ''}" style="width:${hpPct}%"></div></div>
        ${e.barrier > 0 ? `<div class="barrier-bar"><div class="barrier-fill" style="width:${Math.min(100, e.barrier/20*100)}%"></div></div>` : ''}
        ${!e.dead ? `<div class="intent">${intentText}</div>` : ''}
        ${statusText ? `<div class="status-effects">${statusText}</div>` : ''}
      </div>
    `;
  });

  // Allies
  const allyDiv = document.getElementById('ally-units');
  allyDiv.innerHTML = '';
  state.allies.forEach(a => {
    const hpPct = (a.hp / a.maxHP * 100);
    const buffText = getAllyBuffText(a);
    allyDiv.innerHTML += `
      <div class="unit-card ${a.dead ? 'dead' : ''}">
        <strong>${a.name}</strong> ${a.dead ? '【大破】' : ''} HP: ${a.hp}/${a.maxHP} ${a.barrier > 0 ? `<span style="color:#44a;">B:${a.barrier}</span>` : ''}
        <div class="hp-bar"><div class="hp-fill ${hpPct < 30 ? 'low' : ''}" style="width:${hpPct}%"></div></div>
        ${a.barrier > 0 ? `<div class="barrier-bar"><div class="barrier-fill" style="width:${Math.min(100, a.barrier/30*100)}%"></div></div>` : ''}
        ${buffText ? `<div class="status-effects">${buffText}</div>` : ''}
      </div>
    `;
  });

  // Hand
  const handDiv = document.getElementById('hand-cards');
  handDiv.innerHTML = '';
  state.hand.forEach((c, i) => {
    const fullDriveDiscount = state.allies.some(a => a.fullDriveActive) && c.effect !== 'full_drive' ? (state._fullDriveAmount || 1) : 0;
    const effectiveCost = Math.max(0, c.cost - fullDriveDiscount);
    const canPlay = c.playable && effectiveCost <= state.en && !state.battleOver;
    const owner = state.allies[c.ownerIdx];
    const isLocked = owner && owner.attackLocked && c.type === 'attack';
    const upgradedClass = c.upgraded ? 'upgraded' : '';
    handDiv.innerHTML += `
      <div class="card ${(!canPlay || isLocked) ? 'unplayable' : ''} ${upgradedClass}" onclick="${canPlay && !isLocked ? `playCard(${i})` : ''}">
        <span class="ccost">${fullDriveDiscount > 0 && c.cost > 0 ? `<s>EN${c.cost}</s> EN${effectiveCost}` : `EN${c.cost}`}</span>
        <span class="cname">${c.name}</span>
        <span class="cframe">${owner ? owner.name : '?'}</span>
        <div class="cdesc">${c.desc}</div>
        ${!c.playable ? '<div style="color:#f44;font-size:10px;">DEAD DRAW</div>' : ''}
      </div>
    `;
  });

  // Relic bar
  renderRelicBar();

  // EN & Turn
  document.getElementById('en-display').textContent = `${state.en}/${state.enCap}`;
  document.getElementById('turn-info').textContent = `TURN ${state.turn}`;
  document.getElementById('deck-info').textContent = `(山: ${state.deck.length} / 捨: ${state.discard.length})`;

  // Log
  const logDiv = document.getElementById('log-area');
  logDiv.innerHTML = state.logs.map(l => `<div class="log-${l.type}">${l.text}</div>`).join('');
  logDiv.scrollTop = logDiv.scrollHeight;
}

function renderRelicBar() {
  const bar = document.getElementById('relic-bar');
  if (!bar) return;
  if (state.relics.length === 0) {
    bar.innerHTML = '<span style="color:#555;font-size:10px;">RELICS: ---</span>';
    return;
  }
  let html = '<span style="color:#888;font-size:10px;">RELICS:</span>';
  state.relics.forEach(id => {
    const def = RELIC_DEFS[id];
    if (!def) return;
    const color = { common: '#6aff6a', uncommon: '#6af', rare: '#fa0', boss: '#f6f' }[def.rarity] || '#fff';
    html += `<span class="relic-icon" title="${def.desc}" style="border-color:${color};color:${color};">${def.name.slice(0, 2)}</span>`;
  });
  bar.innerHTML = html;
}

function getIntentText(e) {
  if (e.dead) return '';
  const target = state.allies[e.targetIdx];
  const tName = target ? target.name : '?';
  const atk = e.atk - (e.debuffs.atkReduction || 0);
  switch (e.intent) {
    case 'attack': return `>> ${tName} に攻撃 (${atk})`;
    case 'attack_heavy': return `>> ${tName} に強攻撃 (${Math.floor(atk * 1.8)})`;
    case 'attack_all': return `>> 全体攻撃 (${Math.floor(atk * 0.7)})`;
    case 'barrier': return '>> フィールド展開';
    case 'buff_self': return '>> 自己強化';
    default: return '>> ???';
  }
}

function getEnemyStatusText(e) {
  const parts = [];
  if (e.statuses.overheat > 0) parts.push(`過熱(${e.statuses.overheat})`);
  if (e.statuses.vulnerability > 0) parts.push(`脆弱(${e.statuses.vulnerability})`);
  if (e.statuses.shock > 0) parts.push(`感電(${e.statuses.shock}T)`);
  if (e.speed > 0) {
    const maxT = e.speedEffects ? Math.max(...e.speedEffects.filter(s => s.value > 0).map(s => s.turns)) : 0;
    parts.push(`加速+${e.speed}%(${maxT}T)`);
  }
  if (e.speed < 0) {
    const maxT = e.speedEffects ? Math.max(...e.speedEffects.filter(s => s.value < 0).map(s => s.turns)) : 0;
    parts.push(`減速${e.speed}%(${maxT}T)`);
  }
  if (e.debuffs.agiReduction) parts.push(`AGI-${e.debuffs.agiReduction.val}`);
  if (e.debuffs.atkReduction) parts.push(`ATK-${e.debuffs.atkReduction}`);
  if (e.marked) parts.push('マーク');
  if (e.scanned) parts.push('スキャン');
  if (e.weakPointBonus) parts.push(`WP+${e.weakPointBonus}`);
  return parts.join(' / ');
}

function getAllyBuffText(a) {
  const parts = [];
  if (a.fullDriveActive) parts.push('FD');
  if (a.speed > 0) {
    const maxT = a.speedEffects ? Math.max(...a.speedEffects.filter(s => s.value > 0).map(s => s.turns)) : 0;
    parts.push(`加速+${a.speed}%(${maxT}T)`);
  }
  if (a.speed < 0) {
    const maxT = a.speedEffects ? Math.max(...a.speedEffects.filter(s => s.value < 0).map(s => s.turns)) : 0;
    parts.push(`減速${a.speed}%(${maxT}T)`);
  }
  if (a.buffs.dmgBonus) parts.push(`ATK+${a.buffs.dmgBonus}`);
  if (a.buffs.warcryBonus) parts.push(`WC+${a.buffs.warcryBonus}`);
  if (a.buffs.overheat) parts.push(`過熱(${a.buffs.overheat})`);
  if (a.attackLocked) parts.push('攻撃不可');
  if (a.reactive) parts.push('リアクティブ');
  if (a.siegeBuff) parts.push(`次T ATK+${a.siegeBuff}`);
  // Expansion states
  if (a.elementCoat) parts.push(a.elementCoat === 'heat' ? '熱量付与' : '電磁付与');
  if (a.elementStacks > 0) parts.push(`蓄積${a.elementStacks}`);
  if (a.linkedTo >= 0) parts.push(`リンク(${a.linkMode === 'attack_sync' ? '攻撃連動' : a.linkMode === 'damage_share' ? '被弾分散' : 'フィールド共有'})`);
  if (a.bombCounter > 0) parts.push(`爆薬${a.bombCounter}`);
  if (a.phoenixCore) parts.push('不死');
  if (a.loadCounter > 0) parts.push(`装填${a.loadCounter}`);
  if (a.damageCounter > 0) parts.push(`被弾C${a.damageCounter}`);
  if (a.ironBody) parts.push('アイアンボディ');
  if (a.lastStand) parts.push('ラストスタンド');
  if (a.drones && a.drones.length > 0) parts.push(`ドローン×${a.drones.length}`);
  return parts.join(' / ');
}

// ============================================================
// DECK & RELIC VIEWER MODALS
// ============================================================
function showDeckModal() {
  const container = document.getElementById('deck-modal-content');
  let html = '';
  const totalCards = state.allies.reduce((s, a) => s + a.cards.length, 0);
  html += `<p style="color:#888;margin-bottom:8px;">デッキ枚数: ${totalCards}枚</p>`;
  state.allies.forEach(a => {
    html += `<div style="margin-bottom:12px;"><div style="color:#6aff6a;font-weight:bold;margin-bottom:4px;">${a.name} (${a.cards.length}枚)${a.dead ? ' <span style="color:#f44;">[大破]</span>' : ''}</div>`;
    a.cards.forEach(c => {
      const upgCls = c.upgraded ? 'style="border-color:#4a4;"' : '';
      html += `<div class="deck-view-card" ${upgCls}>
        <span style="color:#ff6;font-weight:bold;">EN${c.cost}</span>
        <span style="color:${c.upgraded ? '#6f6' : '#aaf'};font-weight:bold;">${c.name}</span>
        <span style="color:#888;font-size:10px;">${c.desc}</span>
      </div>`;
    });
    html += '</div>';
  });
  container.innerHTML = html;
  document.getElementById('deck-modal').style.display = 'flex';
}

function showRelicModal() {
  const container = document.getElementById('relic-modal-content');
  if (state.relics.length === 0) {
    container.innerHTML = '<p style="color:#888;">レリックなし</p>';
  } else {
    let html = `<p style="color:#888;margin-bottom:8px;">所持レリック: ${state.relics.length}個</p>`;
    state.relics.forEach(id => {
      const def = RELIC_DEFS[id];
      if (!def) return;
      const color = { common: '#6aff6a', uncommon: '#6af', rare: '#fa0', boss: '#f6f', frame: '#fa0' }[def.rarity] || '#fff';
      const tag = def.rarity === 'frame' ? 'PASSIVE' : def.rarity.toUpperCase();
      html += `<div class="relic-view-item">
        <span class="relic-name" style="color:${color};">${def.name}</span>
        <span style="color:#666;font-size:9px;">[${tag}]</span>
        <div style="color:#888;font-size:11px;">${def.desc}</div>
      </div>`;
    });
    container.innerHTML = html;
  }
  document.getElementById('relic-modal').style.display = 'flex';
}

function addLog(text, type) {
  state.logs.push({ text, type: type || 'info' });
  if (state.logs.length > 100) state.logs.shift();
}

// ============================================================
// UTILITIES
// ============================================================
const SPEED_DURATION = 5;

function addSpeedEffect(unit, value, turns) {
  if (!unit.speedEffects) unit.speedEffects = [];
  unit.speedEffects.push({ value, turns: turns || SPEED_DURATION });
  recalcSpeed(unit);
}

function recalcSpeed(unit) {
  if (!unit.speedEffects) unit.speedEffects = [];
  unit.speed = unit.speedEffects.reduce((sum, e) => sum + e.value, 0);
}

function tickSpeedEffects(unit) {
  if (!unit.speedEffects) { unit.speedEffects = []; unit.speed = 0; return; }
  unit.speedEffects.forEach(e => e.turns--);
  unit.speedEffects = unit.speedEffects.filter(e => e.turns > 0);
  recalcSpeed(unit);
}

function clearSpeedEffects(unit) {
  unit.speedEffects = [];
  unit.speed = 0;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Reset hidden sections when showing reward screen
  if (id === 'reward-screen') {
    document.getElementById('reward-relic-section').style.display = '';
  }
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Title & Help
document.getElementById('btn-to-setup').onclick = () => {
  showScreen('setup-screen');
  initSetup();
};
document.getElementById('btn-how-to-play').onclick = () => {
  document.getElementById('help-modal').style.display = 'flex';
};
document.getElementById('btn-show-help').onclick = () => {
  document.getElementById('help-modal').style.display = 'flex';
};
document.getElementById('btn-close-help').onclick = () => {
  document.getElementById('help-modal').style.display = 'none';
};
// Help tab switching
document.querySelectorAll('.help-tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.help-content').forEach(c => c.style.display = 'none');
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).style.display = 'block';
  };
});

// Game
document.getElementById('btn-start').onclick = () => {
  startRun();
};
document.getElementById('btn-end-turn').onclick = endTurn;
document.getElementById('btn-abandon-run').onclick = () => {
  if (confirm('Run を放棄しますか?')) {
    showScreen('title-screen');
  }
};
document.getElementById('btn-next-battle').onclick = () => {
  advanceToBattle();
};
document.getElementById('btn-continue-run').onclick = continueRun;
document.getElementById('btn-skip-card').onclick = () => {
  state.rewardCardChosen = true;
  document.getElementById('reward-card-list').querySelectorAll('.reward-card-option').forEach(el => el.style.opacity = '0.3');
  updateContinueBtn();
};
document.getElementById('btn-new-run').onclick = () => {
  showScreen('title-screen');
};

// Init: Load frames from JSON then start
async function init() {
  try {
    const resp = await fetch('frames.json');
    FRAMES = await resp.json();
    // Show title screen on load (no initSetup yet)
  } catch (e) {
    console.error('Failed to load frames.json:', e);
    document.body.innerHTML = '<h1 style="color:red;">Error: Could not load frames.json</h1>';
  }
}
init();
