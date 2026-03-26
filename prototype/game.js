// ============================================================
// FRAME:04 - ROGUELIKE PROTOTYPE
// ============================================================

// ============================================================
// DATA - loaded from frames.json
// ============================================================
let FRAMES = {};

const STAT_NAMES = { STR: '出力', VIT: '装甲', INT: '演算', MND: '耐性', AGI: '機動', DEX: '照準' };

// ============================================================
// ENEMY POOLS PER ACT
// ============================================================
const ENEMY_POOLS = {
  1: {
    normal: [
      [
        { name: 'ドローン-A', hp: 20, atk: 4, agi: 0, dex: 0, patterns: ['attack','attack','barrier'] },
        { name: 'ドローン-B', hp: 20, atk: 5, agi: 0, dex: 0, patterns: ['attack','attack','barrier'] },
      ],
      [
        { name: 'ドローン-A', hp: 20, atk: 4, agi: 0, dex: 0, patterns: ['attack','attack','barrier'] },
        { name: 'ドローン-B', hp: 22, atk: 5, agi: 0, dex: 0, patterns: ['attack','attack_all','attack'] },
        { name: 'ドローン-C', hp: 18, atk: 4, agi: 0, dex: 0, patterns: ['attack','barrier','attack'] },
      ],
      [
        { name: 'スカウト', hp: 18, atk: 5, agi: 15, dex: 0, patterns: ['attack','attack','attack'] },
        { name: 'ガード', hp: 22, atk: 4, agi: 0, dex: 0, patterns: ['barrier','attack','attack'] },
      ],
      [
        { name: 'ガード-A', hp: 20, atk: 5, agi: 0, dex: 0, patterns: ['attack','barrier','attack'] },
        { name: 'ガード-B', hp: 20, atk: 5, agi: 0, dex: 0, patterns: ['attack','attack','barrier'] },
      ],
    ],
    elite: [
      [
        { name: 'ヘビーガード', hp: 60, atk: 9, agi: 5, dex: 5, patterns: ['attack','attack','attack_heavy','barrier','attack_all'] },
      ],
      [
        { name: 'エヴェイダー', hp: 55, atk: 8, agi: 25, dex: 5, patterns: ['attack','attack','buff_self','attack','attack_heavy'] },
        { name: 'サポートビット', hp: 18, atk: 4, agi: 0, dex: 0, patterns: ['barrier','attack','barrier'] },
      ],
    ],
    boss: [
      { name: 'コマンダー Mk-I', hp: 100, atk: 10, agi: 6, dex: 6, patterns: ['barrier','attack','attack_heavy','attack_all','attack','buff_self','attack_heavy'] },
      { name: 'ビット-L', hp: 18, atk: 4, agi: 6, dex: 0, patterns: ['attack','attack','barrier'] },
      { name: 'ビット-R', hp: 18, atk: 4, agi: 6, dex: 0, patterns: ['attack','barrier','attack'] },
    ],
  },
  2: {
    normal: [
      [
        { name: '重装ドローン-A', hp: 28, atk: 6, agi: 0, dex: 3, patterns: ['attack','attack','barrier','attack_all'] },
        { name: '重装ドローン-B', hp: 28, atk: 7, agi: 0, dex: 3, patterns: ['attack','barrier','attack','attack'] },
      ],
      [
        { name: 'アサルト-A', hp: 25, atk: 7, agi: 5, dex: 5, patterns: ['attack','attack','attack_heavy'] },
        { name: 'アサルト-B', hp: 25, atk: 7, agi: 5, dex: 5, patterns: ['attack','attack_heavy','attack'] },
        { name: 'リペアビット', hp: 18, atk: 3, agi: 0, dex: 0, patterns: ['barrier','barrier','attack'] },
      ],
      [
        { name: 'スナイパー', hp: 25, atk: 7, agi: 20, dex: 10, patterns: ['attack','attack','attack_heavy'] },
        { name: 'シールダー', hp: 30, atk: 6, agi: 0, dex: 0, patterns: ['barrier','barrier','attack','attack_all'] },
      ],
      [
        { name: 'ストーム', hp: 28, atk: 6, agi: 0, dex: 0, patterns: ['attack_all','attack_all','barrier'] },
        { name: 'ガード', hp: 30, atk: 6, agi: 0, dex: 3, patterns: ['attack','barrier','attack'] },
        { name: 'ガード', hp: 30, atk: 6, agi: 0, dex: 3, patterns: ['barrier','attack','attack'] },
      ],
    ],
    elite: [
      [
        { name: 'ジャガーノート', hp: 75, atk: 11, agi: 5, dex: 8, patterns: ['attack_heavy','attack','barrier','attack_all','buff_self','attack_heavy'] },
      ],
      [
        { name: 'デュアルブレード', hp: 70, atk: 10, agi: 20, dex: 10, patterns: ['attack','attack','attack_heavy','attack','attack_heavy'] },
        { name: 'サポートコア', hp: 25, atk: 5, agi: 0, dex: 0, patterns: ['barrier','buff_self','attack'] },
      ],
    ],
    boss: [
      { name: 'コア・ユニット Mk-II', hp: 130, atk: 12, agi: 8, dex: 8, patterns: ['barrier','attack_heavy','attack','attack_all','buff_self','attack_heavy','attack_all'] },
      { name: 'ガードビット-L', hp: 25, atk: 6, agi: 8, dex: 3, patterns: ['attack','barrier','attack'] },
      { name: 'ガードビット-R', hp: 25, atk: 6, agi: 8, dex: 3, patterns: ['barrier','attack','attack'] },
    ],
  },
  3: {
    normal: [
      [
        { name: 'エリート兵-A', hp: 32, atk: 8, agi: 8, dex: 8, patterns: ['attack','attack_heavy','barrier','attack_all'] },
        { name: 'エリート兵-B', hp: 32, atk: 9, agi: 8, dex: 8, patterns: ['attack','barrier','attack_heavy','attack'] },
      ],
      [
        { name: 'ハンター', hp: 30, atk: 9, agi: 25, dex: 12, patterns: ['attack','attack','attack_heavy','attack'] },
        { name: 'メディック', hp: 30, atk: 6, agi: 5, dex: 0, patterns: ['barrier','barrier','attack','attack_all'] },
        { name: 'アサルト', hp: 35, atk: 8, agi: 5, dex: 5, patterns: ['attack','attack','attack_heavy'] },
      ],
      [
        { name: 'バーサーカー', hp: 35, atk: 9, agi: 10, dex: 5, patterns: ['attack_heavy','attack','buff_self','attack_heavy'] },
        { name: 'バーサーカー', hp: 35, atk: 9, agi: 10, dex: 5, patterns: ['attack','attack_heavy','attack','buff_self'] },
      ],
    ],
    elite: [
      [
        { name: 'デストロイヤー', hp: 90, atk: 12, agi: 10, dex: 12, patterns: ['attack_heavy','attack_all','buff_self','attack_heavy','barrier','attack_all','attack_heavy'] },
      ],
      [
        { name: 'ツインファング-A', hp: 85, atk: 12, agi: 18, dex: 10, patterns: ['attack','attack_heavy','attack','attack'] },
        { name: 'ツインファング-B', hp: 85, atk: 12, agi: 18, dex: 10, patterns: ['attack','attack','attack_heavy','attack'] },
      ],
    ],
    boss: [
      { name: 'アーキテクト', hp: 150, atk: 14, agi: 12, dex: 12, patterns: ['barrier','attack_heavy','attack_all','buff_self','attack','attack_heavy','attack_all','buff_self','attack_heavy'] },
    ],
  }
};

// ============================================================
// UNKNOWN EVENTS
// ============================================================
const UNKNOWN_EVENTS = [
  {
    title: '漂流する補給コンテナ',
    desc: '損傷した補給コンテナが漂流している。開けるか?',
    choices: [
      { label: '開ける', desc: 'ランダムアイテム入手 / 10%で爆発(全機-8HP)', action: 'supply_gamble' },
      { label: '無視する', desc: '何も起きない', action: 'nothing' },
    ]
  },
  {
    title: '放棄されたラボ',
    desc: '無人のラボが見つかった。まだ電源が入っている。',
    choices: [
      { label: '調査する', desc: 'ランダムなカード1枚をアップグレード', action: 'free_upgrade' },
      { label: 'データを回収', desc: 'SP+2を獲得', action: 'gain_sp' },
      { label: '立ち去る', desc: '何も起きない', action: 'nothing' },
    ]
  },
  {
    title: '謎のビーコン',
    desc: '強い電波を発するビーコンを検知。近づくと...',
    choices: [
      { label: '接近する', desc: '全機HP15回復 / 20%で敵の罠(全機-12HP)', action: 'beacon_gamble' },
      { label: '迂回する', desc: '何も起きない', action: 'nothing' },
    ]
  },
  {
    title: '友軍の残骸',
    desc: '先行部隊の残骸が見つかった。まだ使えるパーツがある。',
    choices: [
      { label: 'パーツ回収', desc: 'HP最低の味方を20HP回復', action: 'heal_lowest' },
      { label: 'データ回収', desc: 'SP+3を獲得', action: 'gain_sp3' },
    ]
  },
];

// ============================================================
// CONSUMABLE ITEMS
// ============================================================
const ITEM_DEFS = {
  hp_potion: { name: 'HPポーション', desc: '味方1機HP15回復', needsTarget: true, targetType: 'ally_alive' },
  barrier_pack: { name: 'バリアパック', desc: '全機バリア+8', needsTarget: false },
  en_cell: { name: 'ENセル', desc: '今ターンEN+2', needsTarget: false },
};

const ITEM_DROP_POOL = ['hp_potion', 'hp_potion', 'barrier_pack', 'barrier_pack', 'en_cell'];

// ============================================================
// GAME STATE
// ============================================================
let state = {
  // Setup
  selectedFrames: [],
  statPoints: {},
  totalSP: 24,
  remainingSP: 24,
  // Run state
  run: null, // will hold the run object
  // Battle state
  allies: [],
  enemies: [],
  deck: [],
  discard: [],
  hand: [],
  en: 3,
  maxEN: 3,
  turn: 0,
  turnBuffs: {},
  logs: [],
  battleOver: false,
  // Items
  items: [], // max 3
  // Reward
  rewardSPGained: 0,
  rewardSPRemaining: 0,
  rewardUpgradeChosen: false,
  rewardItemChosen: false,
};

// ============================================================
// MAP GENERATION
// ============================================================
function generateMap(actNum) {
  // Layers: 0=start, 1-4=middle layers, 5=pre-boss, 6=boss
  const layerCount = 5; // middle layers
  const nodesPerLayer = [1, 3, 4, 3, 4, 3, 1]; // start, middles..., pre-boss, boss
  const layers = [];

  // Layer 0: starting node (always enemy)
  layers.push([{ id: '0-0', type: 'enemy', layer: 0, pos: 0, connections: [], visited: false }]);

  // Middle layers
  for (let l = 1; l <= layerCount; l++) {
    const count = 2 + Math.floor(Math.random() * 2); // 2-3 nodes per layer
    const layer = [];
    for (let n = 0; n < count; n++) {
      const type = pickNodeType(l, layerCount);
      layer.push({ id: `${l}-${n}`, type, layer: l, pos: n, connections: [], visited: false });
    }
    layers.push(layer);
  }

  // Pre-boss layer (layer layerCount+1): always 1 rest or enemy
  const preBossType = Math.random() < 0.5 ? 'rest' : 'enemy';
  layers.push([{ id: `${layerCount+1}-0`, type: preBossType, layer: layerCount+1, pos: 0, connections: [], visited: false }]);

  // Boss layer
  layers.push([{ id: `${layerCount+2}-0`, type: 'boss', layer: layerCount+2, pos: 0, connections: [], visited: false }]);

  // Generate connections (each node connects to 1-2 nodes in next layer)
  for (let l = 0; l < layers.length - 1; l++) {
    const current = layers[l];
    const next = layers[l + 1];

    // Ensure every node in current has at least 1 forward connection
    current.forEach(node => {
      const connCount = Math.min(next.length, 1 + Math.floor(Math.random() * 2));
      const indices = [];
      // Pick random indices in next layer
      while (indices.length < connCount) {
        const idx = Math.floor(Math.random() * next.length);
        if (!indices.includes(idx)) indices.push(idx);
      }
      indices.forEach(idx => {
        if (!node.connections.includes(next[idx].id)) {
          node.connections.push(next[idx].id);
        }
      });
    });

    // Ensure every node in next is reachable from at least one node in current
    next.forEach(nextNode => {
      const isReachable = current.some(n => n.connections.includes(nextNode.id));
      if (!isReachable) {
        const randomParent = current[Math.floor(Math.random() * current.length)];
        randomParent.connections.push(nextNode.id);
      }
    });
  }

  return layers;
}

function pickNodeType(layer, totalMiddleLayers) {
  const r = Math.random();
  if (layer === 1) {
    // Early: mostly enemies
    if (r < 0.7) return 'enemy';
    if (r < 0.85) return 'unknown';
    return 'rest';
  }
  // Middle-late layers
  if (r < 0.40) return 'enemy';
  if (r < 0.60) return 'elite';
  if (r < 0.80) return 'unknown';
  return 'rest';
}

// ============================================================
// RUN MANAGEMENT
// ============================================================
function startRun() {
  state.run = {
    act: 1,
    maps: {}, // act -> layers
    currentNode: null,
    visitedNodes: new Set(),
    totalTurns: 0,
    battlesWon: 0,
    elitesKilled: 0,
    bossesKilled: 0,
    depth: 0,
  };

  // Build initial allies from setup (slot-based, supports duplicate frames)
  state.allies = state.selectedFrames.filter(fk => fk !== null).map((fk, i) => {
    const frame = FRAMES[fk];
    const slotKey = `slot${i}`;
    const allocatedPts = { ...state.statPoints[slotKey] };
    const base = frame.baseStats || { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
    const stats = {};
    for (const s of ['STR','VIT','INT','MND','AGI','DEX']) {
      stats[s] = (base[s] || 0) + (allocatedPts[s] || 0);
    }
    const maxHP = Math.round(frame.baseHP * (1 + stats.VIT * 0.03));
    const dupeCount = state.selectedFrames.slice(0, i + 1).filter(f => f === fk).length;
    const totalDupes = state.selectedFrames.filter(f => f === fk).length;
    const displayName = totalDupes > 1 ? `${frame.name} #${dupeCount}` : frame.name;
    return {
      id: i, frameKey: fk, name: displayName, stats,
      hp: maxHP, maxHP, barrier: 0, dead: false,
      cards: frame.cards.map((c, ci) => ({ ...c, id: `${fk}_${i}_${ci}`, ownerIdx: i, ownerFrame: fk, playable: true, upgraded: false })),
      buffs: {}, persistentBarrier: 0, attackLocked: false, counterDmg: 0, reactive: false, siegeBuff: 0, spikeReflect: 0,
      // Expansion persistent state
      elementCoat: null,      // 'heat' or 'shock' - converter coating
      absorbField: false,     // converter absorb field active
      elementStacks: 0,       // converter accumulated element stacks
      linkedTo: -1,           // linker: index of linked partner
      linkMode: null,         // 'barrier_share'|'attack_sync'|'damage_share'
      bombCounter: 0,         // decoy bomb counter
      phoenixCore: false,     // decoy undying
      ironBody: false,        // bulk iron body active this turn
      ironBodyRate: 0,        // bulk absorb rate
      dmgTakenThisTurn: 0,    // bulk tracking
      damageCounter: 0,       // bulk damage counter (persists)
      lastStand: false,       // bulk last stand active this turn
      berserkerBonus: 0,      // bulk berserker mode bonus this turn
      loadCounter: 0,         // launcher load counter (persists)
      drones: [],             // drone entities [{hp, atk, mode:'attack'|'guard'}]
      droneGuardMode: false,  // drone mode toggle
      droneFocusTarget: -1,   // drone focus target for this turn
      droneFocusMultiplier: 1,// drone focus damage multiplier
      partsSalvageActive: false, // scavenger parts salvage this turn
      junkShieldActive: false,   // scavenger junk shield this turn
      junkShieldBonus: 0,        // scavenger junk shield per-kill bonus
      scanned: false,            // seeker: is this unit scanned (for enemies)
    };
  });

  state.items = [];
  state.run.maps[1] = generateMap(1);
  state.run.maps[2] = generateMap(2);
  state.run.maps[3] = generateMap(3);

  // Mark first node as available
  enterAct(1);
}

function enterAct(actNum) {
  state.run.act = actNum;
  state.run.currentNode = null;
  state.run.visitedNodes = new Set();
  showScreen('map-screen');
  renderMap();
}

function getAvailableNodes() {
  const layers = state.run.maps[state.run.act];
  if (!state.run.currentNode) {
    // Only the start nodes
    return layers[0].map(n => n.id);
  }
  // Find current node and return its connections
  for (const layer of layers) {
    for (const node of layer) {
      if (node.id === state.run.currentNode) {
        return node.connections;
      }
    }
  }
  return [];
}

function findNode(nodeId) {
  const layers = state.run.maps[state.run.act];
  for (const layer of layers) {
    for (const node of layer) {
      if (node.id === nodeId) return node;
    }
  }
  return null;
}

function selectNode(nodeId) {
  const available = getAvailableNodes();
  if (!available.includes(nodeId)) return;

  const node = findNode(nodeId);
  if (!node || node.visited) return;

  node.visited = true;
  state.run.visitedNodes.add(nodeId);
  state.run.currentNode = nodeId;
  state.run.depth++;

  switch (node.type) {
    case 'enemy':
      startBattle('normal');
      break;
    case 'elite':
      startBattle('elite');
      break;
    case 'boss':
      startBattle('boss');
      break;
    case 'rest':
      showRestScreen();
      break;
    case 'unknown':
      showUnknownEvent();
      break;
  }
}

// ============================================================
// SETUP SCREEN
// ============================================================
function initSetup() {
  // Slot-based selection: 4 slots, each picks a frame (duplicates allowed)
  state.selectedFrames = [null, null, null, null]; // slot index -> frame key
  state.statPoints = {};
  state.remainingSP = state.totalSP;

  const grid = document.getElementById('frame-grid');
  grid.innerHTML = '';

  // Group frames by pack
  const packs = [
    { key: 'base', label: 'BASE' },
    { key: 'protocol_ex', label: 'PROTOCOL:EX' },
    { key: 'protocol_hv', label: 'PROTOCOL:HV' },
  ];

  for (const pack of packs) {
    const packFrames = Object.entries(FRAMES).filter(([k, f]) => f.pack === pack.key);
    if (packFrames.length === 0) continue;

    const header = document.createElement('div');
    header.className = 'pack-header';
    header.textContent = pack.label;
    header.style.cssText = 'grid-column: 1 / -1; color: #8af; font-size: 13px; font-weight: bold; margin: 8px 0 2px; border-bottom: 1px solid #333; padding-bottom: 2px;';
    grid.appendChild(header);

    for (const [key, frame] of packFrames) {
      const btn = document.createElement('button');
      btn.className = 'frame-btn';
      btn.innerHTML = `<span class="fname">${frame.name}</span><span class="frole">${frame.role}</span>`;
      btn.dataset.key = key;
      btn.onclick = () => pickFrameForSlot(key);
      grid.appendChild(btn);
    }
  }

  renderSlotIndicator();
  updateStatAlloc();
  updateStartBtn();
}

function getActiveSlot() {
  // Returns the first empty slot index, or -1 if all filled
  return state.selectedFrames.indexOf(null);
}

function pickFrameForSlot(key) {
  const slot = getActiveSlot();
  if (slot < 0) return; // all 4 slots filled
  state.selectedFrames[slot] = key;
  renderSlotIndicator();
  updateStatAlloc();
  updateStartBtn();
}

function removeSlot(slotIdx) {
  // Remove this slot and shift remaining slots left, clear its stat points
  state.selectedFrames[slotIdx] = null;
  // Compact: shift nulls to end
  const filled = state.selectedFrames.filter(f => f !== null);
  state.selectedFrames = [...filled, ...Array(4 - filled.length).fill(null)];
  // Rebuild stat points to match new slot indices
  const newPoints = {};
  state.selectedFrames.forEach((fk, i) => {
    if (fk !== null) {
      // Try to preserve old points if same frame at same or nearby slot
      newPoints[`slot${i}`] = state.statPoints[`slot${i}`] || { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
    }
  });
  state.statPoints = newPoints;
  recalcSP();
  renderSlotIndicator();
  updateStatAlloc();
  updateStartBtn();
}

function renderSlotIndicator() {
  const el = document.getElementById('select-count');
  const count = state.selectedFrames.filter(f => f !== null).length;
  const slots = state.selectedFrames.map((fk, i) => {
    const name = fk ? FRAMES[fk].name : '---';
    return `<span style="border:1px solid ${fk ? '#6aff6a' : '#333'};padding:2px 6px;font-size:11px;color:${fk ? '#6aff6a' : '#666'};">${name}</span>`;
  }).join('');
  el.innerHTML = `<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">${slots} <span style="color:#888;font-size:12px;">(${count}/4)</span>` +
    (count > 0 ? ` <button onclick="removeSlot(${state.selectedFrames.findLastIndex(f => f !== null)})" style="font-size:11px;padding:2px 6px;">取消</button>` : '') + '</div>';
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

// Recommended stat presets per frame (weights that sum to 1.0, used to distribute points)
const FRAME_PRESETS = {
  striker:    { STR: 0.5, VIT: 0.2, INT: 0, MND: 0, AGI: 0.1, DEX: 0.2 },
  gunner:     { STR: 0.4, VIT: 0.1, INT: 0, MND: 0, AGI: 0.1, DEX: 0.4 },
  blaster:    { STR: 0, VIT: 0.1, INT: 0.6, MND: 0.1, AGI: 0.1, DEX: 0.1 },
  shielder:   { STR: 0, VIT: 0.7, INT: 0, MND: 0.1, AGI: 0, DEX: 0.2 },
  medic:      { STR: 0, VIT: 0.2, INT: 0, MND: 0.6, AGI: 0.1, DEX: 0.1 },
  jammer:     { STR: 0, VIT: 0.1, INT: 0.5, MND: 0.1, AGI: 0.2, DEX: 0.1 },
  booster:    { STR: 0, VIT: 0.3, INT: 0, MND: 0.2, AGI: 0.3, DEX: 0.2 },
  phantom:    { STR: 0.3, VIT: 0.05, INT: 0, MND: 0, AGI: 0.4, DEX: 0.25 },
  fortress:   { STR: 0.3, VIT: 0.5, INT: 0, MND: 0, AGI: 0, DEX: 0.2 },
  overload:   { STR: 0, VIT: 0.2, INT: 0.6, MND: 0.1, AGI: 0.05, DEX: 0.05 },
  // PROTOCOL:EX
  converter:  { STR: 0, VIT: 0.15, INT: 0.6, MND: 0.1, AGI: 0.1, DEX: 0.05 },
  linker:     { STR: 0, VIT: 0.3, INT: 0.1, MND: 0.2, AGI: 0.2, DEX: 0.2 },
  decoy:      { STR: 0, VIT: 0.5, INT: 0, MND: 0.1, AGI: 0.2, DEX: 0.2 },
  scavenger:  { STR: 0.5, VIT: 0.2, INT: 0, MND: 0, AGI: 0.1, DEX: 0.2 },
  oracle:     { STR: 0, VIT: 0.2, INT: 0.3, MND: 0.2, AGI: 0.15, DEX: 0.15 },
  // PROTOCOL:HV
  seeker:     { STR: 0, VIT: 0.15, INT: 0.5, MND: 0.1, AGI: 0.15, DEX: 0.1 },
  launcher:   { STR: 0.5, VIT: 0.2, INT: 0, MND: 0, AGI: 0.1, DEX: 0.2 },
  bulk:       { STR: 0.3, VIT: 0.5, INT: 0, MND: 0, AGI: 0, DEX: 0.2 },
  drone:      { STR: 0, VIT: 0.15, INT: 0.5, MND: 0.1, AGI: 0.15, DEX: 0.1 },
  carrier:    { STR: 0, VIT: 0.3, INT: 0.1, MND: 0.2, AGI: 0.2, DEX: 0.2 },
};

function applyPreset(slotIdx) {
  const fk = state.selectedFrames[slotIdx];
  if (!fk) return;
  const slotKey = `slot${slotIdx}`;
  // Clear current points for this slot
  const oldUsed = Object.values(state.statPoints[slotKey]).reduce((a, b) => a + b, 0);
  state.remainingSP += oldUsed;
  // Distribute available SP for this slot based on weights
  const perSlot = Math.floor(state.totalSP / 4);
  const points = Math.min(perSlot, state.remainingSP);
  const weights = FRAME_PRESETS[fk];
  const newStats = { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
  let assigned = 0;
  for (const stat of Object.keys(newStats)) {
    newStats[stat] = Math.floor(points * weights[stat]);
    assigned += newStats[stat];
  }
  // Distribute remainder to highest weight stat
  const topStat = Object.entries(weights).sort((a, b) => b[1] - a[1])[0][0];
  newStats[topStat] += points - assigned;
  state.statPoints[slotKey] = newStats;
  state.remainingSP -= points;
  document.getElementById('sp-remaining').textContent = state.remainingSP;
  updateStatAlloc();
  updateStartBtn();
}

function autoAllocAll() {
  // Reset all points
  state.selectedFrames.forEach((fk, i) => {
    if (fk === null) return;
    state.statPoints[`slot${i}`] = { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
  });
  state.remainingSP = state.totalSP;
  // Apply presets sequentially
  state.selectedFrames.forEach((fk, i) => {
    if (fk !== null) applyPreset(i);
  });
  updateStatAlloc();
  updateStartBtn();
}

function resetAllStats() {
  state.selectedFrames.forEach((fk, i) => {
    if (fk === null) return;
    state.statPoints[`slot${i}`] = { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
  });
  state.remainingSP = state.totalSP;
  document.getElementById('sp-remaining').textContent = state.remainingSP;
  updateStatAlloc();
  updateStartBtn();
}

function updateStatAlloc() {
  const container = document.getElementById('stat-alloc');
  container.innerHTML = '';
  const newPoints = {};
  state.selectedFrames.forEach((fk, i) => {
    if (fk === null) return;
    const slotKey = `slot${i}`;
    newPoints[slotKey] = state.statPoints[slotKey] || { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
  });
  state.statPoints = newPoints;
  recalcSP();

  state.selectedFrames.forEach((fk, i) => {
    if (fk === null) return;
    const slotKey = `slot${i}`;
    const frame = FRAMES[fk];
    const div = document.createElement('div');
    div.className = 'unit-stats';
    const dupeCount = state.selectedFrames.filter(f => f === fk).length;
    const label = dupeCount > 1 ? `${frame.name} #${state.selectedFrames.slice(0, i + 1).filter(f => f === fk).length}` : frame.name;
    div.innerHTML = `<div class="uname">${label}</div>`;
    // Preset button
    const presetBtn = document.createElement('button');
    presetBtn.textContent = '推奨ビルド';
    presetBtn.style.cssText = 'font-size:10px;padding:2px 6px;margin-bottom:6px;border-color:#4a4adf;color:#8a8aff;width:100%;';
    presetBtn.onclick = () => applyPreset(i);
    div.appendChild(presetBtn);

    const base = frame.baseStats || { STR: 0, VIT: 0, INT: 0, MND: 0, AGI: 0, DEX: 0 };
    for (const stat of Object.keys(STAT_NAMES)) {
      const alloc = state.statPoints[slotKey][stat];
      const baseVal = base[stat] || 0;
      const total = baseVal + alloc;
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <span class="stat-label">${stat}</span>
        <span class="stat-controls">
          <button onclick="changeStat('${slotKey}','${stat}',-5)">-5</button>
          <button onclick="changeStat('${slotKey}','${stat}',-1)">-</button>
          <span style="display:inline-block;width:14px;text-align:center;color:#6a6a9a;font-size:10px;">${baseVal}</span>
          <span style="color:#555;font-size:9px;">+</span>
          <span style="display:inline-block;width:14px;text-align:center;color:#8af;" id="stat-${slotKey}-${stat}">${alloc}</span>
          <span style="color:#555;font-size:9px;">=</span>
          <span style="display:inline-block;width:16px;text-align:center;font-weight:bold;" id="stat-total-${slotKey}-${stat}">${total}</span>
          <button onclick="changeStat('${slotKey}','${stat}',1)">+</button>
          <button onclick="changeStat('${slotKey}','${stat}',5)">+5</button>
        </span>
      `;
      div.appendChild(row);
    }
    container.appendChild(div);
  });

  // Global buttons
  if (state.selectedFrames.filter(f => f !== null).length > 0) {
    const globalDiv = document.createElement('div');
    globalDiv.style.cssText = 'grid-column: 1 / -1; display: flex; gap: 8px; margin-top: 4px;';
    globalDiv.innerHTML = `
      <button onclick="autoAllocAll()" style="padding:6px 16px;border-color:#4a4adf;color:#8a8aff;">全機おまかせ配分</button>
      <button onclick="resetAllStats()" style="padding:6px 16px;border-color:#666;color:#888;">全リセット</button>
    `;
    container.appendChild(globalDiv);
  }
}

function changeStat(slotKey, stat, delta) {
  const cur = state.statPoints[slotKey][stat];
  const actualDelta = delta > 0 ? Math.min(delta, state.remainingSP) : Math.max(delta, -cur);
  if (actualDelta === 0) return;
  state.statPoints[slotKey][stat] = cur + actualDelta;
  state.remainingSP -= actualDelta;
  const newAlloc = cur + actualDelta;
  document.getElementById(`stat-${slotKey}-${stat}`).textContent = newAlloc;
  // Update total display (base + alloc)
  const slotIdx = parseInt(slotKey.replace('slot', ''));
  const fk = state.selectedFrames[slotIdx];
  if (fk) {
    const base = (FRAMES[fk].baseStats || {})[stat] || 0;
    const totalEl = document.getElementById(`stat-total-${slotKey}-${stat}`);
    if (totalEl) totalEl.textContent = base + newAlloc;
  }
  document.getElementById('sp-remaining').textContent = state.remainingSP;
  updateStartBtn();
}

function recalcSP() {
  let used = 0;
  for (const fk in state.statPoints) {
    for (const s in state.statPoints[fk]) used += state.statPoints[fk][s];
  }
  state.remainingSP = state.totalSP - used;
  document.getElementById('sp-remaining').textContent = state.remainingSP;
}

function updateStartBtn() {
  document.getElementById('btn-start').disabled = state.selectedFrames.filter(f => f !== null).length !== 4;
}

// ============================================================
// BATTLE INITIALIZATION
// ============================================================
function startBattle(encounterType) {
  const act = state.run.act;
  const pool = ENEMY_POOLS[act];
  let enemyDefs;

  if (encounterType === 'boss') {
    enemyDefs = pool.boss;
  } else if (encounterType === 'elite') {
    const options = pool.elite;
    enemyDefs = options[Math.floor(Math.random() * options.length)];
  } else {
    const options = pool.normal;
    enemyDefs = options[Math.floor(Math.random() * options.length)];
  }

  // Scale enemies slightly by depth
  const depthScale = 1 + (state.run.depth - 1) * 0.03;

  state.enemies = enemyDefs.map((e, i) => ({
    id: i, name: e.name,
    hp: Math.floor(e.hp * depthScale), maxHP: Math.floor(e.hp * depthScale),
    barrier: 0, dead: false,
    atk: Math.floor(e.atk * depthScale), agi: e.agi, dex: e.dex,
    patterns: e.patterns, patternIdx: 0,
    intent: null, targetIdx: 0,
    statuses: {}, debuffs: {},
    marked: false, markBonus: 0,
    scanned: false, weakPointBonus: 0,
  }));

  // Prepare allies for battle (preserve HP, dead status carries over)
  state.allies.forEach(a => {
    a.barrier = 0;
    a.buffs = {};
    a.persistentBarrier = 0;
    a.attackLocked = false;
    a.counterDmg = 0;
    a.reactive = false;
    a.siegeBuff = 0;
    a.spikeReflect = 0;
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
  state.turn = 0;
  state.logs = [];
  state.battleOver = false;
  state.turnBuffs = {};
  state._encounterType = encounterType;

  showScreen('battle-screen');
  renderBattleHUD();
  nextTurn();
}

// ============================================================
// TURN MANAGEMENT
// ============================================================
function nextTurn() {
  state.turn++;
  state.en = state.maxEN;

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
    }
    a.buffs = a.buffs.dmgBonus ? { dmgBonus: a.buffs.dmgBonus } : {};
  });

  // Reset enemy barrier, process statuses
  state.enemies.forEach(e => {
    if (e.dead) return;
    e.barrier = 0;
    if (e.statuses.overheat && e.statuses.overheat > 0) {
      const dmg = e.statuses.overheat;
      e.hp -= dmg;
      addLog(`${e.name}: 過熱ダメージ ${dmg}`, 'dmg');
      e.statuses.overheat--;
      if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
    }
    if (e.statuses.poison && e.statuses.poison > 0) {
      const dmg = e.statuses.poison;
      e.hp -= dmg;
      addLog(`${e.name}: 汚染ダメージ ${dmg}`, 'dmg');
      e.statuses.poison--;
      if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
    }
    if (e.statuses.frozen) { e.statuses.frozen = false; }
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
    if (e.dead || e.statuses.frozen) {
      if (e.statuses.frozen) { addLog(`${e.name}: 凍結で行動不能`, 'status'); }
      return;
    }
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
        addLog(`${e.name}: バリア +10`, 'barrier');
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
            const barrierAmt = Math.round(5 * (1 + a.stats.INT * 0.04));
            target.barrier += barrierAmt;
            addLog(`ドローン → ${target.name}: バリア+${barrierAmt}`, 'barrier');
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
  const effectiveAGI = ally.stats.AGI + (ally.buffs.agiBonus || 0);
  const evadeChance = Math.min(40, Math.max(0, effectiveAGI * 1.2 - enemy.dex * 1.2));
  if (Math.random() * 100 < evadeChance) {
    addLog(`${enemy.name} → ${ally.name}: 回避!`, 'info');
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
    addLog(`${enemy.name} → ${ally.name}: ${dmg}ダメージ (バリア${absorbed}吸収)`, 'barrier');
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

  // Check if this was the final boss
  if (state._encounterType === 'boss' && state.run.act === 3) {
    showRunEnd(true);
    return;
  }

  // Show reward screen
  showRewardScreen();
}

// ============================================================
// CARD PLAY LOGIC
// ============================================================
let pendingCard = null;

function playCard(handIdx) {
  const card = state.hand[handIdx];
  if (!card || !card.playable || state.battleOver) return;
  if (card.cost > state.en) return;

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

  state.en -= card.cost;

  let bonusDmg = (ally.buffs.dmgBonus || 0) + (ally.buffs.chargeshot || 0) + (ally.buffs.powerlink || 0) + (ally.buffs.warcryBonus || 0);

  switch (card.type) {
    case 'attack': {
      const statVal = card.stat === 'STR' ? ally.stats.STR : (card.stat === 'INT' ? ally.stats.INT : 0);
      let baseDmg = Math.round(card.baseDmg * (1 + statVal * 0.04)) + bonusDmg;
      const hits = card.hits || 1;

      // --- Expansion: Converter reverse_charge / fusion_burst ---
      if (card.effect === 'reverse_charge') {
        const stacks = ally.elementStacks;
        const rawDmg = stacks > 0 ? stacks * card.accumMultiplier + card.baseDmg : card.baseDmg;
        baseDmg = Math.round(rawDmg * (1 + ally.stats.INT * 0.04));
        ally.elementStacks = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: リバースチャージ ${baseDmg}ダメ (蓄積${stacks}消費)`, 'dmg');
        }
      } else if (card.effect === 'fusion_burst') {
        const stacks = ally.elementStacks;
        const rawDmg = stacks * card.accumMultiplier + card.baseDmg;
        baseDmg = Math.round(rawDmg * (1 + ally.stats.INT * 0.04));
        ally.elementStacks = 0;
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          if (stacks >= card.accumThreshold && !enemy.dead) {
            enemy.statuses.overheat = (enemy.statuses.overheat || 0) + 2;
            enemy.statuses.shocked = true;
            enemy.debuffs.agiReduction = { val: 5, dur: 1 };
          }
        });
        addLog(`${ally.name}: フュージョンバースト ${baseDmg}全体ダメ (蓄積${stacks}消費)`, 'dmg');
      // --- Expansion: Launcher rail/satellite cannon ---
      } else if (card.effect === 'rail_cannon') {
        baseDmg = Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.STR * 0.04)) + bonusDmg;
        ally.loadCounter = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: レールキャノン ${baseDmg}ダメ!`, 'dmg');
        }
      } else if (card.effect === 'satellite_cannon') {
        baseDmg = Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.STR * 0.04)) + bonusDmg;
        ally.loadCounter = 0;
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
        });
        addLog(`${ally.name}: サテライトキャノン ${baseDmg}全体ダメ!`, 'dmg');
      // --- Expansion: Bulk counter blow ---
      } else if (card.effect === 'counter_blow') {
        baseDmg = Math.round((ally.damageCounter * card.counterMultiplier + card.baseDmg) * (1 + ally.stats.STR * 0.04)) + bonusDmg;
        ally.damageCounter = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: カウンターブロー ${baseDmg}ダメ!`, 'dmg');
        }
      // --- Expansion: Seeker exploit ---
      } else if (card.effect === 'exploit') {
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          let statusCount = 0;
          for (const s in enemy.statuses) { if (enemy.statuses[s]) statusCount++; }
          if (enemy.scanned) {
            baseDmg += statusCount * card.perStatusBonus;
          }
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          addLog(`${ally.name}: エクスプロイト ${baseDmg}ダメ (状態異常${statusCount}種)`, 'dmg');
        }
      // --- Standard attack logic ---
      } else if (card.target === 'enemy_single') {
        const enemy = state.enemies[targetId];
        if (!enemy || enemy.dead) { /* skip */ } else {
          for (let h = 0; h < hits; h++) {
            let dmg = baseDmg;
            if (card.backstab && enemy.targetIdx !== ally.id) dmg *= 2;
            if (card.doubleOnOverheat && enemy.statuses.overheat) dmg *= 2;
            if (enemy.marked) dmg += enemy.markBonus;
            if (enemy.weakPointBonus) { dmg += enemy.weakPointBonus; }
            if (ally.buffs.overdrive) dmg = baseDmg;
            dealDmgToEnemy(ally, enemy, dmg, card);
            if (enemy.dead) break;
          }
          if (ally.buffs.overdrive) {
            for (let h = 0; h < hits; h++) {
              if (enemy.dead) break;
              dealDmgToEnemy(ally, enemy, baseDmg, card);
            }
          }
          // Check on-kill effects (scavenger)
          if (enemy.dead && card.onKill) {
            handleOnKill(ally, card.onKill);
          }
        }
      } else if (card.target === 'enemy_all') {
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          let dmg = baseDmg;
          if (card.doubleOnOverheat && enemy.statuses.overheat) dmg *= 2;
          if (enemy.marked) dmg += enemy.markBonus;
          if (enemy.weakPointBonus) { dmg += enemy.weakPointBonus; }
          dealDmgToEnemy(ally, enemy, dmg, card);
          if (enemy.dead && card.onKill) {
            handleOnKill(ally, card.onKill);
          }
        });
      } else if (card.target === 'enemy_random') {
        for (let h = 0; h < hits; h++) {
          const alive = state.enemies.filter(e => !e.dead);
          if (alive.length === 0) break;
          const enemy = alive[Math.floor(Math.random() * alive.length)];
          dealDmgToEnemy(ally, enemy, baseDmg, card);
          if (enemy.dead && card.onKill) {
            handleOnKill(ally, card.onKill);
          }
        }
      }

      if (card.selfBuffAGI) ally.buffs.agiBonus = (ally.buffs.agiBonus || 0) + card.selfBuffAGI;
      if (card.selfRemoveBarrier) ally.barrier = 0;
      if (card.selfDmg && !card.effect) {
        ally.hp -= card.selfDmg;
        addLog(`${ally.name}: 自傷 ${card.selfDmg}`, 'dmg');
        if (ally.hp <= 0) killAlly(ally);
      }
      if (card.selfStatus) {
        ally.buffs[card.selfStatus.type] = (ally.buffs[card.selfStatus.type] || 0) + card.selfStatus.stacks;
      }
      if (card.drain && !state.enemies[targetId]?.dead) {
        const healAmt = Math.floor(baseDmg * card.drain);
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
        addLog(`${ally.name}: HP吸収 +${healAmt}`, 'heal');
      }

      if (ally.buffs.chargeshot) delete ally.buffs.chargeshot;
      if (ally.buffs.powerlink) delete ally.buffs.powerlink;
      if (ally.buffs.warcryBonus) delete ally.buffs.warcryBonus;
      break;
    }
    case 'defend': {
      const statVal = card.stat === 'VIT' ? ally.stats.VIT : (card.stat === 'INT' ? ally.stats.INT : (card.stat === 'MND' ? ally.stats.MND : 0));
      const barrierAmt = Math.round(card.baseBarrier * (1 + statVal * 0.04));

      if (card.target === 'self' || card.target === 'provoke' || card.target === 'provoke_all') {
        if (card.persistent) {
          ally.persistentBarrier += barrierAmt;
          ally.barrier += barrierAmt;
        } else {
          ally.barrier += barrierAmt;
        }
        addLog(`${ally.name}: バリア +${barrierAmt}`, 'barrier');
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
          addLog(`${target.name}: バリア +${barrierAmt}`, 'barrier');
        }
      } else if (card.target === 'ally_all') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.barrier += barrierAmt;
        });
        addLog(`全機: バリア +${barrierAmt}`, 'barrier');
      }
      break;
    }
    case 'heal': {
      const statVal = card.stat === 'MND' ? ally.stats.MND : 0;
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
        ally.buffs.overdrive = true;
        ally.buffs.strBonus = (ally.buffs.strBonus || 0) + 3;
        addLog(`${ally.name}: オーバードライブ! STR+3, 2回ヒット`, 'status');
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
        target.buffs.agiBonus = (target.buffs.agiBonus || 0) + card.amount;
        addLog(`${target.name}: AGI +${card.amount}`, 'status');
      } else if (card.effect === 'fullboost') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.strBonus = (a.buffs.strBonus || 0) + card.amount;
          a.buffs.intBonus = (a.buffs.intBonus || 0) + card.amount;
        });
        state.en += 1;
        addLog(`全機: STR/INT +${card.amount}, EN +1`, 'status');
      } else if (card.effect === 'smoke') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.agiBonus = (a.buffs.agiBonus || 0) + card.amount;
        });
        addLog(`全機: AGI +${card.amount}`, 'status');
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
          a.buffs.strBonus = (a.buffs.strBonus || 0) + card.amount;
          a.buffs.intBonus = (a.buffs.intBonus || 0) + card.amount;
        });
        addLog(`リンク中の味方: STR/INT +${card.amount}`, 'status');
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
          a.buffs.strBonus = (a.buffs.strBonus || 0) + totalBuff;
          a.buffs.intBonus = (a.buffs.intBonus || 0) + totalBuff;
        });
        addLog(`全機: STR/INT +${totalBuff} (スキャン${scannedCount}体)`, 'status');
      } else if (card.effect === 'warcry') {
        // Warcry: all allies get +warcryBonus to next attack, self gets barrier
        const bonus = card.warcryBonus || 3;
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.warcryBonus = (a.buffs.warcryBonus || 0) + bonus;
        });
        ally.barrier += card.selfBarrier || 3;
        addLog(`全機: 次攻撃+${bonus}, ${ally.name}バリア+${card.selfBarrier || 3}`, 'status');
      }
      break;
    }
    case 'debuff': {
      if (card.target === 'enemy_single') {
        const enemy = state.enemies[targetId];
        if (!enemy || enemy.dead) break;
        if (card.effect === 'mark') {
          enemy.marked = true;
          enemy.markBonus = card.amount;
          addLog(`${enemy.name}: マーク! 次攻撃 +${card.amount}`, 'status');
        }
        if (card.effect === 'systemcrash') {
          let statusCount = 0;
          for (const s in enemy.statuses) { if (enemy.statuses[s]) { enemy.statuses[s] += 2; statusCount++; } }
          const dmg = statusCount * card.crashDmg;
          if (dmg > 0) {
            enemy.hp -= dmg;
            addLog(`${enemy.name}: システムクラッシュ ${dmg}ダメージ (${statusCount}種)`, 'dmg');
            if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; addLog(`${enemy.name} 撃破!`, 'info'); }
          } else {
            addLog(`${enemy.name}: 状態異常なし、効果なし`, 'info');
          }
        }
        // Seeker: scan
        if (card.effect === 'scan') {
          enemy.scanned = true;
          addLog(`${enemy.name}: スキャン(持続)。被ダメ+20%`, 'status');
        }
        // Seeker: weak point
        if (card.effect === 'weak_point') {
          const bonus = enemy.scanned ? card.scannedBonus : card.unscannedBonus;
          enemy.weakPointBonus = (enemy.weakPointBonus || 0) + bonus;
          addLog(`${enemy.name}: ウィークポイント +${bonus}`, 'status');
        }
        if (card.applyStatus) {
          const st = card.applyStatus;
          if (st.type === 'poison') {
            enemy.statuses.poison = (enemy.statuses.poison || 0) + st.stacks;
            addLog(`${enemy.name}: 汚染 ${st.stacks}`, 'status');
          }
        }
        if (card.debuffATK) {
          enemy.debuffs.atkReduction = (enemy.debuffs.atkReduction || 0) + card.debuffATK;
          addLog(`${enemy.name}: 攻撃力 -${card.debuffATK}`, 'status');
        }
      } else if (card.target === 'enemy_all') {
        if (card.effect === 'slowAll') {
          state.enemies.filter(e => !e.dead).forEach(e => {
            e.debuffs.agiReduction = { val: card.amount, dur: 1 };
          });
          addLog(`敵全体: AGI/DEX -${card.amount}`, 'status');
        }
        if (card.effect === 'emp') {
          state.enemies.filter(e => !e.dead).forEach(e => {
            if (e.statuses.shocked) {
              e.hp -= card.empDmg;
              addLog(`${e.name}: EMP追撃 ${card.empDmg}`, 'dmg');
              if (e.hp <= 0) { e.hp = 0; e.dead = true; addLog(`${e.name} 撃破!`, 'info'); }
            }
            e.statuses.shocked = true;
            addLog(`${e.name}: 感電`, 'status');
          });
        }
        // Seeker: analyze field (scan all)
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
        state.en += card.amount;
        addLog(`EN +${card.amount}`, 'info');
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
          addLog(`${a1.name} ↔ ${a2.name}: ニューラルリンク(バリア共有40%)`, 'status');
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
        state.en += card.enGain;
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
          const droneATK = Math.round(card.droneATK * (1 + ally.stats.INT * 0.04));
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
        state.en += card.enGain;
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
  if (ally.buffs.strBonus && card.stat === 'STR') dmg += ally.buffs.strBonus;
  if (ally.buffs.intBonus && card.stat === 'INT') dmg += ally.buffs.intBonus;

  // Seeker scan bonus: +20% damage to scanned enemies
  if (enemy.scanned) {
    dmg = Math.floor(dmg * 1.2);
  }

  if (!card.unavoidable) {
    let effectiveAGI = enemy.agi;
    if (enemy.debuffs.agiReduction) effectiveAGI -= enemy.debuffs.agiReduction.val;
    const attackerDEX = ally.stats.DEX + (card.bonusDEX || 0);
    const evadeChance = Math.min(40, Math.max(0, effectiveAGI * 1.2 - attackerDEX * 1.2));
    if (Math.random() * 100 < evadeChance) {
      addLog(`${ally.name} → ${enemy.name}: 回避された!`, 'info');
      return;
    }
  }

  if (card.dmgType === 'electromagnetic' && enemy.statuses.shocked) {
    dmg = Math.floor(dmg * 1.5);
    enemy.statuses.shocked = false;
    addLog(`感電ボーナス! x1.5`, 'status');
  }

  if (card.removeBarrier) {
    if (enemy.barrier > 0) addLog(`${enemy.name}: バリア除去!`, 'barrier');
    enemy.barrier = 0;
  }

  let remaining = dmg;
  if (enemy.barrier > 0 && !card.removeBarrier) {
    const absorbed = Math.min(enemy.barrier, remaining);
    enemy.barrier -= absorbed;
    remaining -= absorbed;
    if (absorbed > 0) addLog(`${ally.name} → ${enemy.name}: ${dmg}ダメージ (バリア${absorbed}吸収)`, 'barrier');
  }
  if (remaining > 0) {
    enemy.hp -= remaining;
    addLog(`${ally.name} → ${enemy.name}: ${remaining}ダメージ`, 'dmg');
  }

  // Element coat: add status effects from physical attacks
  if (card.dmgType === 'physical' && ally.elementCoat) {
    if (ally.elementCoat === 'heat') {
      enemy.statuses.overheat = (enemy.statuses.overheat || 0) + 1;
      addLog(`${enemy.name}: 熱量付与 → 過熱+1`, 'status');
    } else if (ally.elementCoat === 'shock') {
      enemy.statuses.shocked = true;
      addLog(`${enemy.name}: 電磁付与 → 感電`, 'status');
    }
  }

  if (card.applyStatus) {
    const st = card.applyStatus;
    if (st.type === 'overheat') {
      enemy.statuses.overheat = (enemy.statuses.overheat || 0) + st.stacks;
      addLog(`${enemy.name}: 過熱 ${st.stacks}`, 'status');
    }
    if (st.type === 'frozen') {
      if (!st.chance || Math.random() * 100 < st.chance) {
        enemy.statuses.frozen = true;
        addLog(`${enemy.name}: 凍結!`, 'status');
      }
    }
  }

  if (card.debuffAGI) {
    enemy.debuffs.agiReduction = { val: card.debuffAGI, dur: card.debuffDur || 1 };
    addLog(`${enemy.name}: AGI -${card.debuffAGI}`, 'status');
  }
  if (card.debuffATK) {
    enemy.debuffs.atkReduction = (enemy.debuffs.atkReduction || 0) + card.debuffATK;
  }

  if (enemy.hp <= 0) {
    enemy.hp = 0; enemy.dead = true;
    addLog(`${enemy.name} 撃破!`, 'info');
    // Parts salvage: on any kill, check if any ally has parts_salvage active
    state.allies.forEach(a => {
      if (!a.dead && a.partsSalvageActive) {
        state.en += 1;
        ally.hp = Math.min(ally.maxHP, ally.hp + 3);
        addLog(`パーツ回収: EN+1, ${ally.name} HP+3`, 'info');
      }
      // Junk shield bonus on kill
      if (!a.dead && a.junkShieldActive) {
        a.barrier += a.junkShieldBonus;
        addLog(`${a.name}: ジャンクシールド +${a.junkShieldBonus}バリア`, 'barrier');
      }
    });
  }

  // Linker attack sync: when a linked ally attacks, partner deals 30% damage
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

// Scavenger on-kill effects
function handleOnKill(ally, onKill) {
  switch (onKill.type) {
    case 'en_recover':
      state.en += onKill.amount;
      addLog(`${ally.name}: 撃破ボーナス EN+${onKill.amount}`, 'info');
      break;
    case 'draw':
      for (let i = 0; i < onKill.amount; i++) drawCard();
      addLog(`${ally.name}: 撃破ボーナス ${onKill.amount}枚ドロー`, 'info');
      break;
    case 'permanent_buff':
      state.allies.filter(a => !a.dead).forEach(a => {
        a.stats.STR += onKill.amount;
        a.stats.INT += onKill.amount;
      });
      addLog(`フィールドストリップ: 全機STR/INT+${onKill.amount}(永続)`, 'status');
      break;
  }
}

// ============================================================
// CONSUMABLE ITEMS
// ============================================================
let pendingItem = null;

function useItem(slotIdx) {
  if (state.battleOver) return;
  if (slotIdx >= state.items.length) return;
  const itemKey = state.items[slotIdx];
  if (!itemKey) return;
  const def = ITEM_DEFS[itemKey];

  if (def.needsTarget) {
    pendingItem = slotIdx;
    const targets = state.allies.filter(a => !a.dead);
    showItemTargetModal('対象を選択', targets);
  } else {
    applyItem(slotIdx, null);
  }
}

function applyItem(slotIdx, targetId) {
  const itemKey = state.items[slotIdx];
  if (!itemKey) return;

  switch (itemKey) {
    case 'hp_potion': {
      const target = state.allies[targetId];
      if (target && !target.dead) {
        const heal = 15;
        target.hp = Math.min(target.maxHP, target.hp + heal);
        addLog(`${target.name}: HPポーション +${heal}`, 'heal');
      }
      break;
    }
    case 'barrier_pack': {
      state.allies.filter(a => !a.dead).forEach(a => {
        a.barrier += 8;
      });
      addLog('全機: バリアパック +8', 'barrier');
      break;
    }
    case 'en_cell': {
      state.en += 2;
      addLog('ENセル: EN +2', 'info');
      break;
    }
  }

  state.items.splice(slotIdx, 1);
  pendingItem = null;
  renderBattle();
}

function showItemTargetModal(title, units) {
  document.getElementById('item-target-title').textContent = title;
  const container = document.getElementById('item-target-buttons');
  container.innerHTML = '';
  units.forEach(u => {
    const btn = document.createElement('button');
    btn.className = 'target-btn';
    btn.textContent = `${u.name} (HP: ${u.hp}/${u.maxHP})`;
    btn.onclick = () => {
      document.getElementById('item-target-modal').style.display = 'none';
      applyItem(pendingItem, u.id);
    };
    container.appendChild(btn);
  });
  document.getElementById('item-target-modal').style.display = 'flex';
}

function closeItemTargetModal() {
  document.getElementById('item-target-modal').style.display = 'none';
  pendingItem = null;
}

// ============================================================
// CARD UPGRADE SYSTEM
// ============================================================
function getUpgradedCard(card) {
  const u = { ...card };
  u.upgraded = true;
  u.name = card.name + '+';

  // Upgrade logic based on card type
  if (u.type === 'attack') {
    u.baseDmg = Math.ceil(card.baseDmg * 1.3);
    u.desc = card.desc.replace(/(\d+)\+/, u.baseDmg + '+');
    // Rebuild desc to show upgraded values
    u.desc = buildUpgradedAttackDesc(u, card);
  } else if (u.type === 'defend') {
    u.baseBarrier = Math.ceil(card.baseBarrier * 1.3);
    u.desc = buildUpgradedDefendDesc(u, card);
  } else if (u.type === 'heal') {
    if (u.baseHeal) {
      u.baseHeal = Math.ceil(card.baseHeal * 1.4);
      u.desc = buildUpgradedHealDesc(u, card);
    }
  } else if (u.type === 'buff') {
    if (u.amount) u.amount = card.amount + 2;
    if (u.chargeAmount) u.chargeAmount = card.chargeAmount + 3;
    u.desc = card.desc + ' [強化]';
  } else if (u.type === 'debuff') {
    if (u.amount) u.amount = card.amount + 2;
    if (u.crashDmg) u.crashDmg = card.crashDmg + 2;
    if (u.empDmg) u.empDmg = card.empDmg + 4;
    u.desc = card.desc + ' [強化]';
  } else if (u.type === 'special') {
    if (u.effect === 'encharge') u.amount = card.amount + 1;
    u.desc = card.desc + ' [強化]';
  }

  return u;
}

function buildUpgradedAttackDesc(u, orig) {
  let d = `敵`;
  if (u.target === 'enemy_single') d += '1体に';
  else if (u.target === 'enemy_all') d += '全体に';
  else if (u.target === 'enemy_random') d += 'ランダムに';
  d += `${u.baseDmg}+${u.stat}`;
  if (u.dmgType === 'physical') d += '物理';
  else if (u.dmgType === 'electromagnetic') d += '電磁';
  else if (u.dmgType === 'heat') d += '熱量';
  else if (u.dmgType === 'cold') d += '冷却';
  if (u.hits && u.hits > 1) d += ` x${u.hits}`;
  if (u.unavoidable) d += ' 回避不可';
  if (u.removeBarrier) d += ' バリア除去';
  if (u.doubleOnOverheat) d += ' 過熱2倍';
  if (u.drain) d += ` ${Math.floor(u.drain*100)}%吸収`;
  if (u.backstab) d += ' 背面2倍';
  d += ' [+]';
  return d;
}

function buildUpgradedDefendDesc(u, orig) {
  let d = '';
  if (u.target === 'self' || u.target === 'provoke') d += '自機';
  else if (u.target === 'ally_single') d += '味方1機';
  else if (u.target === 'ally_all') d += '全機';
  d += `バリア${u.baseBarrier}+${u.stat}`;
  if (u.persistent) d += '(持続)';
  if (u.counterDmg) d += ` 反撃${u.counterDmg}`;
  if (u.reactive) d += ' 残バリア反撃';
  if (u.lockAttack) d += ' 攻撃不可';
  if (u.siegeBuff) d += ` 次T攻撃+${u.siegeBuff}`;
  if (u.target === 'provoke') d = '挑発+' + d;
  d += ' [+]';
  return d;
}

function buildUpgradedHealDesc(u, orig) {
  let d = '';
  if (u.target === 'self') d += '自機';
  else if (u.target === 'ally_single') d += '味方1機';
  else if (u.target === 'ally_all') d += '全機';
  d += `HP${u.baseHeal}+${u.stat}回復`;
  d += ' [+]';
  return d;
}

// ============================================================
// REWARD SCREEN
// ============================================================
function showRewardScreen() {
  const encounterType = state._encounterType;
  let spGain = 3;
  if (encounterType === 'elite') spGain = 5;
  if (encounterType === 'boss') spGain = 8;

  state.rewardSPGained = spGain;
  state.rewardSPRemaining = spGain;
  state.rewardUpgradeChosen = false;
  state.rewardItemChosen = false;

  showScreen('reward-screen');

  // SP section
  document.getElementById('reward-sp-amount').textContent = `+${spGain} SP`;
  document.getElementById('reward-sp-remaining').textContent = state.rewardSPRemaining;
  renderRewardStatAlloc();

  // Card upgrade section
  renderRewardCardUpgrade();

  // Item drop section
  renderRewardItemDrop();

  updateContinueBtn();
}

function renderRewardStatAlloc() {
  const container = document.getElementById('reward-stat-alloc');
  container.innerHTML = '';

  state.allies.forEach(a => {
    if (a.dead) return;
    const div = document.createElement('div');
    div.className = 'unit-stats';
    div.innerHTML = `<div class="uname">${a.name}</div>`;
    for (const stat of Object.keys(STAT_NAMES)) {
      const val = a.stats[stat];
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <span>${stat}</span>
        <span>
          <button onclick="rewardChangeStat(${a.id},'${stat}',-1)">-</button>
          <span style="display:inline-block;width:24px;text-align:center;" id="rstat-${a.id}-${stat}">${val}</span>
          <button onclick="rewardChangeStat(${a.id},'${stat}',1)">+</button>
        </span>
      `;
      div.appendChild(row);
    }
    container.appendChild(div);
  });
}

function rewardChangeStat(allyId, stat, delta) {
  const ally = state.allies[allyId];
  if (!ally) return;
  const cur = ally.stats[stat];
  const newVal = cur + delta;
  if (newVal < 0) return;
  if (delta > 0 && state.rewardSPRemaining <= 0) return;
  // Don't allow removing below the initial setup value
  ally.stats[stat] = newVal;
  state.rewardSPRemaining -= delta;

  // Recalc maxHP if VIT changed
  if (stat === 'VIT') {
    const frame = FRAMES[ally.frameKey];
    const oldMax = ally.maxHP;
    ally.maxHP = Math.round(frame.baseHP * (1 + ally.stats.VIT * 0.03));
    // Adjust current HP proportionally if max increased
    if (ally.maxHP > oldMax) {
      ally.hp += (ally.maxHP - oldMax);
    }
    if (ally.hp > ally.maxHP) ally.hp = ally.maxHP;
  }

  const el = document.getElementById(`rstat-${allyId}-${stat}`);
  if (el) el.textContent = newVal;
  document.getElementById('reward-sp-remaining').textContent = state.rewardSPRemaining;
  updateContinueBtn();
}

function renderRewardCardUpgrade() {
  const container = document.getElementById('reward-card-list');
  container.innerHTML = '';

  // Pick 3 random non-upgraded cards from alive allies
  const allCards = [];
  state.allies.forEach(a => {
    if (a.dead) return;
    a.cards.forEach((c, ci) => {
      if (!c.upgraded) {
        allCards.push({ allyId: a.id, cardIdx: ci, card: c });
      }
    });
  });

  shuffle(allCards);
  const choices = allCards.slice(0, 3);

  if (choices.length === 0) {
    container.innerHTML = '<p style="color:#888;">アップグレード可能なカードがありません</p>';
    state.rewardUpgradeChosen = true;
    updateContinueBtn();
    return;
  }

  choices.forEach(({ allyId, cardIdx, card }) => {
    const upgraded = getUpgradedCard(card);
    const div = document.createElement('div');
    div.className = 'reward-card-option';
    div.innerHTML = `
      <div class="card-current">${card.name} (EN${card.cost}) - ${card.desc}</div>
      <div style="color:#666; margin:2px 0;">--></div>
      <div class="card-upgraded">${upgraded.name} (EN${upgraded.cost}) - ${upgraded.desc}</div>
    `;
    div.onclick = () => {
      if (state.rewardUpgradeChosen) return;
      // Apply upgrade
      const ally = state.allies[allyId];
      ally.cards[cardIdx] = { ...upgraded, ownerIdx: allyId, ownerFrame: ally.frameKey, playable: true, id: card.id };
      state.rewardUpgradeChosen = true;
      container.querySelectorAll('.reward-card-option').forEach(el => el.style.opacity = '0.3');
      div.style.opacity = '1';
      div.style.borderColor = '#6aff6a';
      updateContinueBtn();
    };
    container.appendChild(div);
  });
}

function renderRewardItemDrop() {
  const container = document.getElementById('reward-item-list');
  container.innerHTML = '';

  if (state.items.length >= 3) {
    container.innerHTML = '<p style="color:#888;">アイテム枠が満杯です</p>';
    state.rewardItemChosen = true;
    document.getElementById('btn-skip-item').style.display = 'none';
    updateContinueBtn();
    return;
  }

  document.getElementById('btn-skip-item').style.display = '';

  // Offer 2 random items
  const pool = [...ITEM_DROP_POOL];
  shuffle(pool);
  const offers = pool.slice(0, 2);

  offers.forEach(itemKey => {
    const def = ITEM_DEFS[itemKey];
    const div = document.createElement('div');
    div.className = 'reward-item';
    div.innerHTML = `
      <div class="item-name">${def.name}</div>
      <div class="item-desc">${def.desc}</div>
    `;
    div.onclick = () => {
      if (state.rewardItemChosen) return;
      if (state.items.length >= 3) return;
      state.items.push(itemKey);
      state.rewardItemChosen = true;
      container.querySelectorAll('.reward-item').forEach(el => el.style.opacity = '0.3');
      div.style.opacity = '1';
      div.style.borderColor = '#6aff6a';
      updateContinueBtn();
    };
    container.appendChild(div);
  });
}

function updateContinueBtn() {
  const allDone = state.rewardSPRemaining === 0 && state.rewardUpgradeChosen && state.rewardItemChosen;
  document.getElementById('btn-continue-run').disabled = !allDone;
}

function continueRun() {
  const node = findNode(state.run.currentNode);
  // If boss beaten, go to next act
  if (node && node.type === 'boss') {
    const nextAct = state.run.act + 1;
    if (nextAct > 3) {
      showRunEnd(true);
      return;
    }
    enterAct(nextAct);
  } else {
    showScreen('map-screen');
    renderMap();
  }
}

// ============================================================
// REST SCREEN
// ============================================================
function showRestScreen() {
  showScreen('rest-screen');
  let html = '<pre style="color:#4af; font-size:16px; margin:16px 0;">';
  html += '    ~~ DOCK ~~\n';
  html += '  All units recovering...\n\n';

  state.allies.forEach(a => {
    if (a.dead) {
      html += `  ${a.name}: [DESTROYED] - no recovery\n`;
    } else {
      const heal = Math.floor(a.maxHP * 0.3);
      const oldHP = a.hp;
      a.hp = Math.min(a.maxHP, a.hp + heal);
      const actual = a.hp - oldHP;
      html += `  ${a.name}: HP ${oldHP} -> ${a.hp}/${a.maxHP} (+${actual})\n`;
    }
  });

  html += '</pre>';
  document.getElementById('rest-visual').innerHTML = html;
}

function leaveRest() {
  showScreen('map-screen');
  renderMap();
}

// ============================================================
// UNKNOWN EVENT SCREEN
// ============================================================
function showUnknownEvent() {
  const event = UNKNOWN_EVENTS[Math.floor(Math.random() * UNKNOWN_EVENTS.length)];
  showScreen('event-screen');

  document.getElementById('event-description').innerHTML = `<p style="margin-bottom:8px; color:#fff;">${event.title}</p><p>${event.desc}</p>`;

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
    case 'supply_gamble':
      if (Math.random() < 0.1) {
        state.allies.filter(a => !a.dead).forEach(a => { a.hp = Math.max(1, a.hp - 8); });
        resultMsg = '爆発! 全機 -8 HP!';
      } else {
        const item = ITEM_DROP_POOL[Math.floor(Math.random() * ITEM_DROP_POOL.length)];
        if (state.items.length < 3) {
          state.items.push(item);
          resultMsg = `${ITEM_DEFS[item].name} を入手!`;
        } else {
          resultMsg = 'アイテムを見つけたが、枠が満杯だ。';
        }
      }
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
        resultMsg = `${pick.ally.name}の${upgraded.name} にアップグレード!`;
      } else {
        resultMsg = 'アップグレード可能なカードがなかった。';
      }
      break;
    }
    case 'gain_sp':
      state.rewardSPGained = 2;
      state.rewardSPRemaining = 2;
      showQuickSP(2);
      return;
    case 'gain_sp3':
      state.rewardSPGained = 3;
      state.rewardSPRemaining = 3;
      showQuickSP(3);
      return;
    case 'beacon_gamble':
      if (Math.random() < 0.2) {
        state.allies.filter(a => !a.dead).forEach(a => { a.hp = Math.max(1, a.hp - 12); });
        resultMsg = '罠だった! 全機 -12 HP!';
      } else {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.hp = Math.min(a.maxHP, a.hp + 15);
        });
        resultMsg = '修復フィールド! 全機 +15 HP!';
      }
      break;
    case 'heal_lowest': {
      const alive = state.allies.filter(a => !a.dead);
      if (alive.length > 0) {
        alive.sort((a, b) => (a.hp / a.maxHP) - (b.hp / b.maxHP));
        const target = alive[0];
        target.hp = Math.min(target.maxHP, target.hp + 20);
        resultMsg = `${target.name} を 20 HP 回復!`;
      } else {
        resultMsg = '味方がいない...';
      }
      break;
    }
  }

  // Show result and continue
  const container = document.getElementById('event-choices');
  container.innerHTML = `
    <p style="color:#6aff6a; margin:12px 0;">${resultMsg}</p>
    <button class="btn-primary" onclick="showScreen('map-screen'); renderMap();">CONTINUE</button>
  `;
}

function showQuickSP(amount) {
  // Redirect to a mini SP allocation then back to map
  state.rewardSPGained = amount;
  state.rewardSPRemaining = amount;
  state.rewardUpgradeChosen = true;
  state.rewardItemChosen = true;

  showScreen('reward-screen');
  document.getElementById('reward-sp-amount').textContent = `+${amount} SP`;
  document.getElementById('reward-sp-remaining').textContent = state.rewardSPRemaining;
  renderRewardStatAlloc();
  document.getElementById('reward-upgrade-section').style.display = 'none';
  document.getElementById('reward-item-section').style.display = 'none';
  updateContinueBtn();
}

// ============================================================
// RUN END SCREEN
// ============================================================
function showRunEnd(victory) {
  showScreen('runend-screen');
  const title = document.getElementById('runend-title');
  title.textContent = victory ? '[ MISSION COMPLETE ]' : '[ MISSION FAILED ]';
  title.style.color = victory ? '#6aff6a' : '#ff6a6a';

  let html = '<div class="run-stats">';
  html += `<p><span class="stat-label">Act: </span><span class="stat-value">${state.run.act}</span></p>`;
  html += `<p><span class="stat-label">Depth: </span><span class="stat-value">${state.run.depth}</span></p>`;
  html += `<p><span class="stat-label">Battles Won: </span><span class="stat-value">${state.run.battlesWon}</span></p>`;
  html += `<p><span class="stat-label">Elites Killed: </span><span class="stat-value">${state.run.elitesKilled}</span></p>`;
  html += `<p><span class="stat-label">Bosses Killed: </span><span class="stat-value">${state.run.bossesKilled}</span></p>`;
  html += `<p><span class="stat-label">Total Turns: </span><span class="stat-value">${state.run.totalTurns}</span></p>`;

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
// MAP RENDERING
// ============================================================
function renderMap() {
  const act = state.run.act;
  const layers = state.run.maps[act];
  const available = getAvailableNodes();

  document.getElementById('map-act-title').textContent = `-- ACT ${act} --`;

  // Render HUD
  renderMapHUD();

  const container = document.getElementById('map-container');
  container.innerHTML = '';

  // We use SVG for connections + divs for nodes
  const mapWidth = 700;
  const layerHeight = 52;
  const totalHeight = layers.length * layerHeight + 20;

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = mapWidth + 'px';
  wrapper.style.margin = '0 auto';
  wrapper.style.height = totalHeight + 'px';

  // SVG for lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', mapWidth);
  svg.setAttribute('height', totalHeight);
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.pointerEvents = 'none';
  wrapper.appendChild(svg);

  // Calculate node positions
  const nodePositions = {};
  layers.forEach((layer, li) => {
    const count = layer.length;
    const layerWidth = count * 80;
    const startX = (mapWidth - layerWidth) / 2 + 40;
    const y = li * layerHeight + 18;

    layer.forEach((node, ni) => {
      const x = startX + ni * 80;
      nodePositions[node.id] = { x, y };
    });
  });

  // Draw connections
  layers.forEach(layer => {
    layer.forEach(node => {
      const from = nodePositions[node.id];
      node.connections.forEach(connId => {
        const to = nodePositions[connId];
        if (from && to) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', from.x);
          line.setAttribute('y1', from.y + 18);
          line.setAttribute('x2', to.x);
          line.setAttribute('y2', to.y - 2);

          // Color based on visited path
          if (node.visited && findNode(connId)?.visited) {
            line.setAttribute('stroke', '#333');
            line.setAttribute('stroke-width', '1');
          } else if (node.id === state.run.currentNode && available.includes(connId)) {
            line.setAttribute('stroke', '#6aff6a');
            line.setAttribute('stroke-width', '2');
          } else if (!state.run.currentNode && node.layer === 0 && available.includes(node.id)) {
            // Starting connections
            line.setAttribute('stroke', '#444');
            line.setAttribute('stroke-width', '1');
          } else {
            line.setAttribute('stroke', '#333');
            line.setAttribute('stroke-width', '1');
          }
          svg.appendChild(line);
        }
      });
    });
  });

  // Draw nodes
  layers.forEach(layer => {
    layer.forEach(node => {
      const pos = nodePositions[node.id];
      const div = document.createElement('div');
      div.className = 'map-node';
      div.style.position = 'absolute';
      div.style.left = (pos.x - 24) + 'px';
      div.style.top = (pos.y - 2) + 'px';

      // Node appearance
      const typeLabels = { enemy: 'E', elite: 'EL', rest: 'R', unknown: '?', boss: 'BOSS' };
      div.textContent = typeLabels[node.type] || '?';

      // CSS classes
      if (node.type === 'boss') div.classList.add('boss-node');
      else if (node.type === 'elite') div.classList.add('elite-node');
      else if (node.type === 'rest') div.classList.add('rest-node');
      else if (node.type === 'unknown') div.classList.add('unknown-node');
      else div.classList.add('enemy-node');

      if (node.visited) {
        div.classList.add('visited');
      } else if (node.id === state.run.currentNode) {
        div.classList.add('current');
      } else if (available.includes(node.id)) {
        div.classList.add('available');
        div.onclick = () => selectNode(node.id);
      } else {
        div.classList.add('locked');
      }

      wrapper.appendChild(div);
    });
  });

  container.appendChild(wrapper);
}

function renderMapHUD() {
  const hud = document.getElementById('map-hud');
  let html = '';
  html += `<div class="run-hud-item"><span class="label">ACT</span> <span class="value">${state.run.act}/3</span></div>`;
  html += `<div class="run-hud-item"><span class="label">DEPTH</span> <span class="value">${state.run.depth}</span></div>`;
  html += `<div class="run-hud-item"><span class="label">ITEMS</span> <span class="value">${state.items.length}/3</span></div>`;

  // Squad HP summary
  state.allies.forEach(a => {
    const color = a.dead ? '#f44' : (a.hp / a.maxHP < 0.3 ? '#fa0' : '#6aff6a');
    html += `<div class="run-hud-item"><span class="label">${a.name}</span> <span class="value" style="color:${color};">${a.dead ? 'DEAD' : `${a.hp}/${a.maxHP}`}</span></div>`;
  });

  hud.innerHTML = html;
}

function renderBattleHUD() {
  const hud = document.getElementById('battle-hud');
  if (!state.run) { hud.innerHTML = ''; return; }
  const node = findNode(state.run.currentNode);
  let nodeLabel = '';
  if (node) {
    const labels = { enemy: 'ENEMY', elite: 'ELITE', boss: 'BOSS' };
    nodeLabel = labels[node.type] || '';
  }
  let html = '';
  html += `<div class="run-hud-item"><span class="label">ACT</span> <span class="value">${state.run.act}</span></div>`;
  html += `<div class="run-hud-item"><span class="label">DEPTH</span> <span class="value">${state.run.depth}</span></div>`;
  if (nodeLabel) html += `<div class="run-hud-item"><span class="label">TYPE</span> <span class="value" style="color:#f88;">${nodeLabel}</span></div>`;
  html += `<div class="run-hud-item"><span class="label">ITEMS</span> <span class="value">${state.items.length}/3</span></div>`;
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
    const canPlay = c.playable && c.cost <= state.en && !state.battleOver;
    const owner = state.allies[c.ownerIdx];
    const isLocked = owner && owner.attackLocked && c.type === 'attack';
    const upgradedClass = c.upgraded ? 'upgraded' : '';
    handDiv.innerHTML += `
      <div class="card ${(!canPlay || isLocked) ? 'unplayable' : ''} ${upgradedClass}" onclick="${canPlay && !isLocked ? `playCard(${i})` : ''}">
        <span class="ccost">EN${c.cost}</span>
        <span class="cname">${c.name}</span>
        <span class="cframe">${owner ? owner.name : '?'}</span>
        <div class="cdesc">${c.desc}</div>
        ${!c.playable ? '<div style="color:#f44;font-size:10px;">DEAD DRAW</div>' : ''}
      </div>
    `;
  });

  // Items bar
  renderItemsBar();

  // EN & Turn
  document.getElementById('en-display').textContent = state.en;
  document.getElementById('turn-info').textContent = `TURN ${state.turn}`;
  document.getElementById('deck-info').textContent = `(山: ${state.deck.length} / 捨: ${state.discard.length})`;

  // Log
  const logDiv = document.getElementById('log-area');
  logDiv.innerHTML = state.logs.map(l => `<div class="log-${l.type}">${l.text}</div>`).join('');
  logDiv.scrollTop = logDiv.scrollHeight;
}

function renderItemsBar() {
  const bar = document.getElementById('items-bar');
  let html = '<span style="color:#888; font-size:11px;">ITEMS:</span>';
  for (let i = 0; i < 3; i++) {
    if (i < state.items.length) {
      const def = ITEM_DEFS[state.items[i]];
      html += `<div class="item-slot" onclick="useItem(${i})" title="${def.desc}">${def.name}</div>`;
    } else {
      html += `<div class="item-slot empty">---</div>`;
    }
  }
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
    case 'barrier': return '>> バリア展開';
    case 'buff_self': return '>> 自己強化';
    default: return '>> ???';
  }
}

function getEnemyStatusText(e) {
  const parts = [];
  if (e.statuses.overheat) parts.push(`過熱(${e.statuses.overheat})`);
  if (e.statuses.frozen) parts.push('凍結');
  if (e.statuses.shocked) parts.push('感電');
  if (e.statuses.poison) parts.push(`汚染(${e.statuses.poison})`);
  if (e.debuffs.agiReduction) parts.push(`AGI-${e.debuffs.agiReduction.val}`);
  if (e.debuffs.atkReduction) parts.push(`ATK-${e.debuffs.atkReduction}`);
  if (e.marked) parts.push('マーク');
  if (e.scanned) parts.push('スキャン');
  if (e.weakPointBonus) parts.push(`WP+${e.weakPointBonus}`);
  return parts.join(' / ');
}

function getAllyBuffText(a) {
  const parts = [];
  if (a.buffs.overdrive) parts.push('OD');
  if (a.buffs.agiBonus) parts.push(`AGI+${a.buffs.agiBonus}`);
  if (a.buffs.dmgBonus) parts.push(`ATK+${a.buffs.dmgBonus}`);
  if (a.buffs.chargeshot) parts.push(`チャージ+${a.buffs.chargeshot}`);
  if (a.buffs.powerlink) parts.push(`PL+${a.buffs.powerlink}`);
  if (a.buffs.warcryBonus) parts.push(`WC+${a.buffs.warcryBonus}`);
  if (a.buffs.overheat) parts.push(`過熱(${a.buffs.overheat})`);
  if (a.attackLocked) parts.push('攻撃不可');
  if (a.reactive) parts.push('リアクティブ');
  if (a.siegeBuff) parts.push(`次T ATK+${a.siegeBuff}`);
  // Expansion states
  if (a.elementCoat) parts.push(a.elementCoat === 'heat' ? '熱量付与' : '電磁付与');
  if (a.elementStacks > 0) parts.push(`蓄積${a.elementStacks}`);
  if (a.linkedTo >= 0) parts.push(`リンク(${a.linkMode === 'attack_sync' ? '攻撃連動' : a.linkMode === 'damage_share' ? '被弾分散' : 'バリア共有'})`);
  if (a.bombCounter > 0) parts.push(`爆薬${a.bombCounter}`);
  if (a.phoenixCore) parts.push('不死');
  if (a.loadCounter > 0) parts.push(`装填${a.loadCounter}`);
  if (a.damageCounter > 0) parts.push(`被弾C${a.damageCounter}`);
  if (a.ironBody) parts.push('アイアンボディ');
  if (a.lastStand) parts.push('ラストスタンド');
  if (a.drones && a.drones.length > 0) parts.push(`ドローン×${a.drones.length}`);
  return parts.join(' / ');
}

function addLog(text, type) {
  state.logs.push({ text, type: type || 'info' });
  if (state.logs.length > 100) state.logs.shift();
}

// ============================================================
// UTILITIES
// ============================================================
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
    document.getElementById('reward-upgrade-section').style.display = '';
    document.getElementById('reward-item-section').style.display = '';
  }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.getElementById('btn-start').onclick = () => {
  startRun();
};
document.getElementById('btn-end-turn').onclick = endTurn;
document.getElementById('btn-abandon-run').onclick = () => {
  if (confirm('Run を放棄しますか?')) {
    showScreen('setup-screen');
    initSetup();
  }
};
document.getElementById('btn-continue-run').onclick = continueRun;
document.getElementById('btn-leave-rest').onclick = leaveRest;
document.getElementById('btn-skip-upgrade').onclick = () => {
  state.rewardUpgradeChosen = true;
  document.getElementById('reward-card-list').querySelectorAll('.reward-card-option').forEach(el => el.style.opacity = '0.3');
  updateContinueBtn();
};
document.getElementById('btn-skip-item').onclick = () => {
  state.rewardItemChosen = true;
  document.getElementById('reward-item-list').querySelectorAll('.reward-item').forEach(el => el.style.opacity = '0.3');
  updateContinueBtn();
};
document.getElementById('btn-new-run').onclick = () => {
  showScreen('setup-screen');
  initSetup();
};

// Init: Load frames from JSON then start
async function init() {
  try {
    const resp = await fetch('frames.json');
    FRAMES = await resp.json();
    initSetup();
  } catch (e) {
    console.error('Failed to load frames.json:', e);
    document.body.innerHTML = '<h1 style="color:red;">Error: Could not load frames.json</h1>';
  }
}
init();
