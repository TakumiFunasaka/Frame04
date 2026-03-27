#!/usr/bin/env node
// ============================================================
// FRAME:04 - AUTO-BATTLE SIMULATION
// Usage: node simulate.js [runs_per_combo] [--verbose]
// ============================================================

const RUNS_PER_COMBO = parseInt(process.argv[2]) || 20;
const VERBOSE = process.argv.includes('--verbose');
const SMART_AI = process.argv.includes('--smart');
const COMPARE_MODE = process.argv.includes('--compare');
const MAX_TURNS = 30;

// ============================================================
// DATA - loaded from frames.json
// ============================================================
const fs = require('fs');
const path = require('path');
const FRAMES = JSON.parse(fs.readFileSync(path.join(__dirname, 'frames.json'), 'utf8'));

const FRAME_PRESETS = {
  striker:    { OUT: 0.7, SHL: 0.2, CTRL: 0.1 },
  gunner:     { OUT: 0.6, SHL: 0.1, CTRL: 0.3 },
  blaster:    { OUT: 0.7, SHL: 0.1, CTRL: 0.2 },
  shielder:   { OUT: 0, SHL: 0.7, CTRL: 0.3 },
  medic:      { OUT: 0, SHL: 0.2, CTRL: 0.8 },
  jammer:     { OUT: 0, SHL: 0.2, CTRL: 0.8 },
  cracker:    { OUT: 0.3, SHL: 0.1, CTRL: 0.6 },
  booster:    { OUT: 0.2, SHL: 0.4, CTRL: 0.4 },
  phantom:    { OUT: 0.7, SHL: 0.1, CTRL: 0.2 },
  overload:   { OUT: 0.7, SHL: 0.1, CTRL: 0.2 },
  // Expansion
  fortress:   { OUT: 0.3, SHL: 0.5, CTRL: 0.2 },
  // PROTOCOL:EX
  converter:  { OUT: 0.6, SHL: 0.2, CTRL: 0.2 },
  linker:     { OUT: 0, SHL: 0.4, CTRL: 0.6 },
  decoy:      { OUT: 0, SHL: 0.8, CTRL: 0.2 },
  scavenger:  { OUT: 0.5, SHL: 0.3, CTRL: 0.2 },
  oracle:     { OUT: 0.4, SHL: 0.2, CTRL: 0.4 },
  // PROTOCOL:HV
  seeker:     { OUT: 0.6, SHL: 0.1, CTRL: 0.3 },
  launcher:   { OUT: 0.6, SHL: 0.2, CTRL: 0.2 },
  bulk:       { OUT: 0.3, SHL: 0.5, CTRL: 0.2 },
  drone:      { OUT: 0.6, SHL: 0.2, CTRL: 0.2 },
  carrier:    { OUT: 0, SHL: 0.4, CTRL: 0.6 },
};

// ============================================================
// ENEMY PRESETS FOR SIMULATION
// ============================================================
const ENEMY_PRESETS = {
  '3_weak': {
    label: '3 Weak (Act1 Drones)',
    enemies: [
      { name: 'ドローン-A', hp: 20, atk: 4, speed: 0, patterns: ['attack','attack','barrier'] },
      { name: 'ドローン-B', hp: 20, atk: 4, speed: 0, patterns: ['attack','attack','barrier'] },
      { name: 'ドローン-C', hp: 18, atk: 4, speed: 0, patterns: ['attack','barrier','attack'] },
    ]
  },
  '1_elite': {
    label: '1 Elite (Heavy Guard)',
    enemies: [
      { name: 'ヘビーガード', hp: 65, atk: 8, speed: 0, patterns: ['attack','attack','attack_heavy','barrier','attack_all'] },
    ]
  },
  'elite_pair': {
    label: 'Elite + Support',
    enemies: [
      { name: 'エヴェイダー', hp: 45, atk: 8, speed: 0, patterns: ['attack','attack','buff_self','attack','attack_heavy'] },
      { name: 'サポートビット', hp: 18, atk: 4, speed: 0, patterns: ['barrier','attack','barrier'] },
    ]
  },
  '1_boss': {
    label: '1 Boss (Mk-I)',
    enemies: [
      { name: 'コマンダー Mk-I', hp: 100, atk: 10, speed: 0, patterns: ['barrier','attack','attack_heavy','attack_all','attack','buff_self','attack_heavy'] },
    ]
  },
  'boss_adds': {
    label: 'Boss + Adds (Mk-I)',
    enemies: [
      { name: 'コマンダー Mk-I', hp: 100, atk: 10, speed: 0, patterns: ['barrier','attack','attack_heavy','attack_all','attack','buff_self','attack_heavy'] },
      { name: 'ビット-L', hp: 18, atk: 4, speed: 0, patterns: ['attack','attack','barrier'] },
      { name: 'ビット-R', hp: 18, atk: 4, speed: 0, patterns: ['attack','barrier','attack'] },
    ]
  },
  'act2_boss': {
    label: 'Act2 Boss (Mk-II + Guards)',
    enemies: [
      { name: 'コア・ユニット Mk-II', hp: 140, atk: 12, speed: 0, patterns: ['barrier','attack_heavy','attack','attack_all','buff_self','attack_heavy','attack_all'] },
      { name: 'ガードビット-L', hp: 25, atk: 6, speed: 0, patterns: ['attack','barrier','attack'] },
      { name: 'ガードビット-R', hp: 25, atk: 6, speed: 0, patterns: ['barrier','attack','attack'] },
    ]
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================
// STAT ALLOCATION (replicates game.js applyPreset logic)
// ============================================================
function allocateStats(frameKeys) {
  const totalSP = 24;
  const perSlot = Math.floor(totalSP / 4); // 6 per frame
  const allStats = [];
  let spRemaining = totalSP;

  for (const fk of frameKeys) {
    const weights = FRAME_PRESETS[fk];
    const points = Math.min(perSlot, spRemaining);
    const stats = { OUT: 0, SHL: 0, CTRL: 0 };
    let assigned = 0;
    for (const s of Object.keys(stats)) {
      stats[s] = Math.floor(points * weights[s]);
      assigned += stats[s];
    }
    // Distribute remainder to highest weight stat
    const topStat = Object.entries(weights).sort((a, b) => b[1] - a[1])[0][0];
    stats[topStat] += points - assigned;
    spRemaining -= points;
    allStats.push(stats);
  }
  return allStats;
}

// ============================================================
// BATTLE STATE CREATION
// ============================================================
function createBattleState(frameKeys, enemyDefs) {
  const statsArr = allocateStats(frameKeys);

  const allies = frameKeys.map((fk, i) => {
    const frame = FRAMES[fk];
    const allocatedPts = statsArr[i];
    const base = frame.baseStats || { OUT: 0, SHL: 0, CTRL: 0 };
    const stats = {};
    for (const s of ['OUT','SHL','CTRL']) {
      stats[s] = (base[s] || 0) + (allocatedPts[s] || 0);
    }
    const maxHP = Math.round(frame.baseHP * (1 + stats.SHL * 0.03));
    return {
      id: i, frameKey: fk, name: frame.name + (i > 0 ? `#${i}` : ''),
      stats, hp: maxHP, maxHP, barrier: 0, dead: false, speed: 0,
      cards: frame.cards.map((c, ci) => ({
        ...c, id: `${fk}_${i}_${ci}`, ownerIdx: i, ownerFrame: fk, playable: true, upgraded: false
      })),
      buffs: {}, persistentBarrier: 0, attackLocked: false, counterDmg: 0, reactive: false, siegeBuff: 0, spikeReflect: 0,
      fullDriveActive: false,
      _reactiveBarrierRemaining: 0,
      // Expansion persistent state
      elementCoat: null, absorbField: false, elementStacks: 0,
      linkedTo: -1, linkMode: null,
      bombCounter: 0, phoenixCore: false,
      ironBody: false, ironBodyRate: 0, dmgTakenThisTurn: 0, damageCounter: 0,
      lastStand: false, berserkerBonus: 0,
      loadCounter: 0,
      drones: [], droneGuardMode: false, droneFocusTarget: -1, droneFocusMultiplier: 1,
      partsSalvageActive: false, junkShieldActive: false, junkShieldBonus: 0,
    };
  });

  const enemies = enemyDefs.map((e, i) => ({
    id: i, name: e.name,
    hp: e.hp, maxHP: e.hp,
    barrier: 0, dead: false,
    atk: e.atk, speed: 0,
    patterns: [...e.patterns], patternIdx: 0,
    intent: null, targetIdx: 0,
    statuses: { overheat: 0, vulnerability: 0, shock: 0 },
    debuffs: {},
    marked: false, markBonus: 0,
    scanned: false, weakPointBonus: 0,
  }));

  // Build deck (20 cards, 5 per frame)
  const deck = [];
  allies.forEach(a => {
    a.cards.forEach(c => deck.push({ ...c }));
  });
  shuffle(deck);

  return {
    allies, enemies, deck, discard: [], hand: [],
    en: 3, maxEN: 3, enCap: 5, turn: 0, battleOver: false,
  };
}

// ============================================================
// CORE BATTLE ENGINE (headless, no UI)
// ============================================================

function dealDmgToEnemy(state, ally, enemy, baseDmg, card) {
  let dmg = baseDmg;

  // Seeker scan bonus (expansion)
  if (enemy.scanned) dmg = Math.floor(dmg * 1.2);

  // Speed-based hit/dodge checks
  if (!card.unavoidable) {
    // Attacker (ally) negative speed: MISS
    if (ally.speed < 0 && Math.random() * 100 < Math.abs(ally.speed)) {
      return; // miss
    }
    // Defender (enemy) positive speed: DODGE
    if (enemy.speed > 0 && Math.random() * 100 < enemy.speed) {
      return; // dodged
    }
  }

  // Shock: damage taken x1.2
  if (enemy.statuses.shock > 0) {
    dmg = Math.floor(dmg * 1.2);
  }

  // Vulnerability: add N to damage, then consume
  if (enemy.statuses.vulnerability > 0) {
    dmg += enemy.statuses.vulnerability;
    enemy.statuses.vulnerability = 0;
  }

  // Barrier removal
  if (card.removeBarrier) {
    enemy.barrier = 0;
  }

  // Barrier absorption
  let remaining = dmg;
  if (enemy.barrier > 0 && !card.removeBarrier) {
    const absorbed = Math.min(enemy.barrier, remaining);
    enemy.barrier -= absorbed;
    remaining -= absorbed;
  }
  if (remaining > 0) {
    enemy.hp -= remaining;
  }

  // Element coat (expansion)
  if (ally.elementCoat) {
    if (ally.elementCoat === 'heat') {
      enemy.statuses.overheat = (enemy.statuses.overheat || 0) + 1;
    } else if (ally.elementCoat === 'shock') {
      enemy.statuses.shock = (enemy.statuses.shock || 0) + 1;
    }
  }

  // Apply statuses from attack card (AFTER damage)
  simApplyCardStatuses(ally, enemy, card);

  // Apply speed effects from card
  if (card.applySpeed) {
    enemy.speed += card.applySpeed;
  }
  if (card.applySelfSpeed) {
    ally.speed += card.applySelfSpeed;
  }

  // Legacy debuffs (expansion)
  if (card.debuffAGI) {
    enemy.debuffs.agiReduction = { val: card.debuffAGI, dur: card.debuffDur || 1 };
  }
  if (card.debuffATK) {
    enemy.debuffs.atkReduction = (enemy.debuffs.atkReduction || 0) + card.debuffATK;
  }

  if (enemy.hp <= 0) {
    enemy.hp = 0; enemy.dead = true;
    state.allies.forEach(a => {
      if (!a.dead && a.partsSalvageActive) {
        state.en = Math.min(state.en + 1, state.enCap);
        ally.hp = Math.min(ally.maxHP, ally.hp + 3);
      }
      if (!a.dead && a.junkShieldActive) {
        a.barrier += a.junkShieldBonus;
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
        if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; }
      }
    }
  }
}

// Apply status effects from a card (simulate.js version - no logging)
function simApplyCardStatuses(ally, enemy, card) {
  if (!card.applyStatus) return;
  const statuses = Array.isArray(card.applyStatus) ? card.applyStatus : [card.applyStatus];
  const ctrlMultiplier = 1 + (ally.stats.CTRL || 0) * 0.04;
  const upgraded = card.upgraded && card.upgrade;

  for (const st of statuses) {
    if (st.type === 'overheat') {
      let stacks = st.stacks + (upgraded && card.upgrade.stacks ? card.upgrade.stacks : 0);
      stacks = Math.floor(stacks * ctrlMultiplier);
      enemy.statuses.overheat = (enemy.statuses.overheat || 0) + stacks;
    } else if (st.type === 'vulnerability') {
      let stacks = st.stacks + (upgraded && card.upgrade.stacks ? card.upgrade.stacks : 0);
      stacks = Math.floor(stacks * ctrlMultiplier);
      enemy.statuses.vulnerability = (enemy.statuses.vulnerability || 0) + stacks;
    } else if (st.type === 'shock') {
      let turns = st.turns + (upgraded && card.upgrade.turns ? card.upgrade.turns : 0);
      enemy.statuses.shock = (enemy.statuses.shock || 0) + turns;
    }
  }
}

// Scavenger on-kill effects
function handleOnKill(state, ally, onKill) {
  switch (onKill.type) {
    case 'en_recover': state.en = Math.min(state.en + onKill.amount, state.enCap); break;
    case 'draw': for (let i = 0; i < onKill.amount; i++) drawCard(state); break;
    case 'permanent_buff':
      state.allies.filter(a => !a.dead).forEach(a => {
        a.stats.OUT += onKill.amount;
      });
      break;
  }
}

function dealDmgToAlly(enemy, ally) {
  // Speed-based miss/dodge checks
  if (enemy.speed < 0 && Math.random() * 100 < Math.abs(enemy.speed)) {
    return; // miss
  }
  if (ally.speed > 0 && Math.random() * 100 < ally.speed) {
    return; // dodged
  }

  let atkPower = enemy._currentAtk;

  let remaining = atkPower;
  if (ally.barrier > 0) {
    const absorbed = Math.min(ally.barrier, remaining);
    ally.barrier -= absorbed;
    remaining -= absorbed;
    // Counter damage
    if (ally.counterDmg > 0) {
      enemy.hp -= ally.counterDmg;
      if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; }
    }
  }
  if (remaining > 0) {
    ally.hp -= remaining;
  }
  if (ally.hp <= 0) { killAlly(ally, state); }
}

function dealDmgToAllyFromEnemy(state, enemy, ally, dmg) {
  // Speed-based miss/dodge checks
  if (enemy.speed < 0 && Math.random() * 100 < Math.abs(enemy.speed)) {
    return; // miss
  }
  if (ally.speed > 0 && Math.random() * 100 < ally.speed) {
    return; // dodged
  }

  // Linker damage share
  if (ally.linkedTo >= 0 && ally.linkMode === 'damage_share') {
    const partner = state.allies[ally.linkedTo];
    if (partner && !partner.dead) {
      const shared = Math.floor(dmg * 0.25);
      dmg -= shared;
      partner.hp -= shared;
      if (partner.hp <= 0) { killAlly(partner, state); }
    }
  }

  let remaining = dmg;
  if (ally.barrier > 0) {
    const absorbed = Math.min(ally.barrier, remaining);
    ally.barrier -= absorbed;
    remaining -= absorbed;
    if (ally.counterDmg > 0) {
      enemy.hp -= ally.counterDmg;
      if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; }
    }
    // Spike armor reflect
    if (ally.spikeReflect > 0 && absorbed > 0) {
      const reflectDmg = Math.floor(absorbed * ally.spikeReflect);
      if (reflectDmg > 0) {
        enemy.hp -= reflectDmg;
        if (enemy.hp <= 0) { enemy.hp = 0; enemy.dead = true; }
      }
    }
    // Converter absorb field
    if (ally.absorbField && absorbed > 0) {
      ally.elementStacks += 1;
    }
  }
  if (remaining > 0) {
    ally.hp -= remaining;
    // Bulk iron body
    if (ally.ironBody) {
      const counterGain = Math.floor(remaining * ally.ironBodyRate);
      ally.damageCounter += counterGain;
    }
  }
  if (ally.hp <= 0) { killAlly(ally, state); }
}

function killAlly(ally, state) {
  // Phoenix core
  if (ally.phoenixCore) {
    ally.phoenixCore = false;
    ally.hp = 1;
    return;
  }
  // Last stand
  if (ally.lastStand) {
    ally.lastStand = false;
    ally.hp = 1;
    ally.damageCounter += 5;
    return;
  }

  ally.hp = 0;
  ally.dead = true;

  // Decoy bomb explosion on death
  if (ally.bombCounter > 0) {
    const bombDmg = ally.bombCounter * 3;
    state.enemies.filter(e => !e.dead).forEach(e => {
      e.hp -= bombDmg;
      if (e.hp <= 0) { e.hp = 0; e.dead = true; }
    });
    ally.bombCounter = 0;
  }

  const ownerIdx = ally.id;
  [...state.deck, ...state.discard, ...state.hand].forEach(c => {
    if (c.ownerIdx === ownerIdx) c.playable = false;
  });
}

function drawCard(state) {
  if (state.deck.length === 0) {
    if (state.discard.length === 0) return;
    state.deck = [...state.discard];
    state.discard = [];
    shuffle(state.deck);
  }
  state.hand.push(state.deck.pop());
}

function executeCardHeadless(state, card, handIdx, targetId) {
  const ally = state.allies[card.ownerIdx];

  // Full Drive: reduce cost by 1 if active
  let actualCost = card.cost;
  if (state.allies.some(a => a.fullDriveActive) && card.effect !== 'full_drive') {
    actualCost = Math.max(0, actualCost - 1);
    state.allies.forEach(a => { a.fullDriveActive = false; });
  }
  state.en -= actualCost;

  let bonusDmg = (ally.buffs.dmgBonus || 0) + (ally.buffs.warcryBonus || 0);

  switch (card.type) {
    case 'attack': {
      const statVal = card.stat === 'OUT' ? ally.stats.OUT : 0;
      let cardBaseDmg = card.baseDmg + (card.upgraded && card.upgrade && card.upgrade.baseDmg ? card.upgrade.baseDmg : 0);
      let baseDmg = Math.round(cardBaseDmg * (1 + statVal * 0.04)) + bonusDmg;
      const hits = card.hits || 1;

      // Expansion attack effects
      if (card.effect === 'reverse_charge') {
        const stacks = ally.elementStacks;
        const rawDmg = stacks > 0 ? stacks * card.accumMultiplier + card.baseDmg : card.baseDmg;
        baseDmg = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04));
        ally.elementStacks = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) dealDmgToEnemy(state, ally, enemy, baseDmg, card);
      } else if (card.effect === 'fusion_burst') {
        const stacks = ally.elementStacks;
        const rawDmg = stacks * card.accumMultiplier + card.baseDmg;
        baseDmg = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04));
        ally.elementStacks = 0;
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          dealDmgToEnemy(state, ally, enemy, baseDmg, card);
          if (stacks >= card.accumThreshold && !enemy.dead) {
            enemy.statuses.overheat = (enemy.statuses.overheat || 0) + 2;
            enemy.statuses.shock = (enemy.statuses.shock || 0) + 1;
            enemy.speed -= 10; // deceleration from fusion burst
          }
        });
      } else if (card.effect === 'rail_cannon') {
        baseDmg = Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) + bonusDmg;
        ally.loadCounter = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) dealDmgToEnemy(state, ally, enemy, baseDmg, card);
      } else if (card.effect === 'satellite_cannon') {
        baseDmg = Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) + bonusDmg;
        ally.loadCounter = 0;
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          dealDmgToEnemy(state, ally, enemy, baseDmg, card);
        });
      } else if (card.effect === 'counter_blow') {
        baseDmg = Math.round((ally.damageCounter * card.counterMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) + bonusDmg;
        ally.damageCounter = 0;
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) dealDmgToEnemy(state, ally, enemy, baseDmg, card);
      } else if (card.effect === 'exploit') {
        const enemy = state.enemies[targetId];
        if (enemy && !enemy.dead) {
          let statusCount = 0;
          for (const s in enemy.statuses) { if (enemy.statuses[s]) statusCount++; }
          if (enemy.scanned) baseDmg += statusCount * card.perStatusBonus;
          dealDmgToEnemy(state, ally, enemy, baseDmg, card);
        }
      } else if (card.target === 'enemy_single') {
        const enemy = state.enemies[targetId];
        if (!enemy || enemy.dead) break;
        for (let h = 0; h < hits; h++) {
          let dmg = baseDmg;
          if (card.backstabBonus && enemy.targetIdx !== ally.id) {
            let bonus = card.backstabBonus + (card.upgraded && card.upgrade && card.upgrade.backstabBonus ? card.upgrade.backstabBonus : 0);
            dmg += bonus;
          }
          if (card.overheatBonus && enemy.statuses.overheat > 0) {
            let bonus = card.overheatBonus + (card.upgraded && card.upgrade && card.upgrade.overheatBonus ? card.upgrade.overheatBonus : 0);
            dmg += bonus;
          }
          if (card.vulnerabilityBonus && enemy.statuses.vulnerability > 0) {
            let bonus = card.vulnerabilityBonus + (card.upgraded && card.upgrade && card.upgrade.vulnerabilityBonus ? card.upgrade.vulnerabilityBonus : 0);
            dmg += bonus;
          }
          if (enemy.marked) dmg += enemy.markBonus;
          if (enemy.weakPointBonus) dmg += enemy.weakPointBonus;
          dealDmgToEnemy(state, ally, enemy, dmg, card);
          if (enemy.dead) break;
        }
        if (enemy.dead && card.onKill) handleOnKill(state, ally, card.onKill);
      } else if (card.target === 'enemy_all') {
        state.enemies.filter(e => !e.dead).forEach(enemy => {
          let dmg = baseDmg;
          if (card.overheatBonus && enemy.statuses.overheat > 0) {
            let bonus = card.overheatBonus + (card.upgraded && card.upgrade && card.upgrade.overheatBonus ? card.upgrade.overheatBonus : 0);
            dmg += bonus;
          }
          if (enemy.marked) dmg += enemy.markBonus;
          if (enemy.weakPointBonus) dmg += enemy.weakPointBonus;
          dealDmgToEnemy(state, ally, enemy, dmg, card);
          if (enemy.dead && card.onKill) handleOnKill(state, ally, card.onKill);
        });
      } else if (card.target === 'enemy_random') {
        for (let h = 0; h < hits; h++) {
          const alive = state.enemies.filter(e => !e.dead);
          if (alive.length === 0) break;
          const enemy = alive[Math.floor(Math.random() * alive.length)];
          dealDmgToEnemy(state, ally, enemy, baseDmg, card);
          if (enemy.dead && card.onKill) handleOnKill(state, ally, card.onKill);
        }
      }

      // Self field (Shielder Shield Bash)
      if (card.selfField) {
        let fieldAmt = card.selfField + (card.upgraded && card.upgrade && card.upgrade.selfField ? card.upgrade.selfField : 0);
        fieldAmt = Math.round(fieldAmt * (1 + ally.stats.SHL * 0.04));
        ally.barrier += fieldAmt;
      }
      // Self heal (Medic Drain Lance, Overload Drain Shot)
      if (card.selfHeal) {
        let healAmt = card.selfHeal + (card.upgraded && card.upgrade && card.upgrade.selfHeal ? card.upgrade.selfHeal : 0);
        healAmt = Math.round(healAmt * (1 + ally.stats.CTRL * 0.04));
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
      }
      // Self damage (Overload)
      if (card.selfDmg && !card.effect) {
        let selfDmg = card.selfDmg + (card.upgraded && card.upgrade && card.upgrade.selfDmg ? card.upgrade.selfDmg : 0);
        ally.hp -= selfDmg;
        if (ally.hp <= 0) killAlly(ally, state);
      }
      if (card.selfRemoveBarrier) ally.barrier = 0;
      if (card.selfBuffAGI) ally.speed += card.selfBuffAGI;

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
        if (card.counterDmg) ally.counterDmg = card.counterDmg;
        if (card.reactive) ally.reactive = true;
        if (card.lockAttack) ally.attackLocked = true;
        if (card.siegeBuff) ally.siegeBuff = card.siegeBuff;
        if (card.spikeReflect) ally.spikeReflect = card.spikeReflect;
        if (card.effect === 'absorb_field') ally.absorbField = true;
        if (card.effect === 'junk_shield') { ally.junkShieldActive = true; ally.junkShieldBonus = card.killBarrierBonus; }

        if (card.target === 'provoke' && targetId != null) {
          const enemy = state.enemies[targetId];
          if (enemy) enemy.targetIdx = ally.id;
        }
        if (card.target === 'provoke_all') {
          state.enemies.filter(e => !e.dead).forEach(e => { e.targetIdx = ally.id; });
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
        }
      } else if (card.target === 'ally_all') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.barrier += barrierAmt;
        });
      }
      break;
    }
    case 'heal': {
      const statVal = card.stat === 'CTRL' ? ally.stats.CTRL : 0;
      const healAmt = Math.round(card.baseHeal * (1 + statVal * 0.04));

      if (card.target === 'self') {
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
      } else if (card.target === 'ally_single') {
        const target = state.allies[targetId];
        if (target) target.hp = Math.min(target.maxHP, target.hp + healAmt);
      } else if (card.target === 'ally_all') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.hp = Math.min(a.maxHP, a.hp + healAmt);
        });
      }
      break;
    }
    case 'buff': {
      if (card.effect === 'accel') {
        const target = state.allies[targetId];
        if (target) target.speed += card.amount;
      } else if (card.effect === 'smoke') {
        state.allies.filter(a => !a.dead).forEach(a => {
          a.speed += card.amount;
        });
      // Expansion buffs
      } else if (card.effect === 'element_coat_heat') {
        const target = state.allies[targetId];
        if (target) target.elementCoat = 'heat';
      } else if (card.effect === 'element_coat_shock') {
        const target = state.allies[targetId];
        if (target) target.elementCoat = 'shock';
      } else if (card.effect === 'link_boost') {
        state.allies.filter(a => !a.dead && a.linkedTo >= 0).forEach(a => {
          a.buffs.outBonus = (a.buffs.outBonus || 0) + card.amount;
          a.buffs.outBonus = (a.buffs.outBonus || 0) + card.amount;
        });
      } else if (card.effect === 'resonance') {
        state.allies.filter(a => !a.dead && a.linkedTo >= 0).forEach(a => {
          a.buffs.powerlink = (a.buffs.powerlink || 0) + card.amount;
        });
      } else if (card.effect === 'berserker') {
        const hpPct = ally.hp / ally.maxHP;
        const bonus = hpPct <= 0.5 ? card.lowBonus : card.highBonus;
        ally.buffs.dmgBonus = (ally.buffs.dmgBonus || 0) + bonus;
      } else if (card.effect === 'data_link') {
        const scannedCount = state.enemies.filter(e => !e.dead && e.scanned).length;
        const totalBuff = card.baseAmount + scannedCount * card.perScanBonus;
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.outBonus = (a.buffs.outBonus || 0) + totalBuff;
          a.buffs.outBonus = (a.buffs.outBonus || 0) + totalBuff;
        });
      } else if (card.effect === 'warcry') {
        const bonus = card.warcryBonus || 3;
        state.allies.filter(a => !a.dead).forEach(a => {
          a.buffs.warcryBonus = (a.buffs.warcryBonus || 0) + bonus;
        });
        ally.barrier += card.selfBarrier || 3;
      }
      // Apply ally speed (e.g. Booster's アクセルフィールド)
      if (card.applyAllySpeed) {
        if (card.target === 'ally_all') {
          state.allies.filter(a => !a.dead).forEach(a => {
            a.speed += card.applyAllySpeed;
          });
        } else if (card.target === 'ally_single') {
          const target = state.allies[targetId];
          if (target) target.speed += card.applyAllySpeed;
        }
      }
      break;
    }
    case 'debuff': {
      if (card.target === 'enemy_single') {
        const enemy = state.enemies[targetId];
        if (!enemy || enemy.dead) break;
        if (card.applyStatus) {
          simApplyCardStatuses(ally, enemy, card);
        }
        if (card.applySpeed) {
          enemy.speed += card.applySpeed;
        }
        // Expansion effects
        if (card.effect === 'mark') { enemy.marked = true; enemy.markBonus = card.amount; }
        if (card.effect === 'scan') enemy.scanned = true;
        if (card.effect === 'weak_point') {
          const bonus = enemy.scanned ? card.scannedBonus : card.unscannedBonus;
          enemy.weakPointBonus = (enemy.weakPointBonus || 0) + bonus;
        }
        if (card.debuffATK) {
          enemy.debuffs.atkReduction = (enemy.debuffs.atkReduction || 0) + card.debuffATK;
        }
      } else if (card.target === 'enemy_all') {
        if (card.applyStatus) {
          state.enemies.filter(e => !e.dead).forEach(e => {
            simApplyCardStatuses(ally, e, card);
          });
        }
        if (card.applySpeed) {
          state.enemies.filter(e => !e.dead).forEach(e => {
            e.speed += card.applySpeed;
          });
        }
        // Expansion effects
        if (card.effect === 'analyze_field') {
          state.enemies.filter(e => !e.dead).forEach(e => { e.scanned = true; });
        }
      }
      break;
    }
    case 'special': {
      if (card.effect === 'encharge') {
        state.en = Math.min(state.en + card.amount, state.enCap);
      } else if (card.effect === 'full_drive') {
        state.allies.forEach(a => { a.fullDriveActive = true; });
      } else if (card.effect === 'reboot') {
        const target = state.allies[targetId];
        if (target) {
          target.dead = false;
          target.hp = 1;
          [...state.deck, ...state.discard, ...state.hand].forEach(c => {
            if (c.ownerIdx === target.id) c.playable = true;
          });
        }
      // Expansion specials
      } else if (card.effect === 'neural_link') {
        const candidates = state.allies.filter(a => !a.dead && a.id !== ally.id);
        if (candidates.length >= 2) {
          candidates[0].linkedTo = candidates[1].id; candidates[1].linkedTo = candidates[0].id;
          candidates[0].linkMode = 'barrier_share'; candidates[1].linkMode = 'barrier_share';
        } else if (candidates.length === 1) {
          candidates[0].linkedTo = ally.id; ally.linkedTo = candidates[0].id;
          candidates[0].linkMode = 'barrier_share'; ally.linkMode = 'barrier_share';
        }
      } else if (card.effect === 'synchro_attack') {
        state.allies.filter(a => !a.dead && a.linkedTo >= 0).forEach(a => { a.linkMode = 'attack_sync'; });
      } else if (card.effect === 'shared_pain') {
        state.allies.filter(a => !a.dead && a.linkedTo >= 0).forEach(a => { a.linkMode = 'damage_share'; });
      } else if (card.effect === 'overcharge') {
        ally.bombCounter += card.bombAmount;
      } else if (card.effect === 'self_destruct') {
        const bombDmg = ally.bombCounter > 0 ? ally.bombCounter * card.bombMultiplier : card.baseBombDmg;
        state.enemies.filter(e => !e.dead).forEach(e => {
          e.hp -= bombDmg;
          if (e.hp <= 0) { e.hp = 0; e.dead = true; }
        });
        ally.bombCounter = 0;
        killAlly(ally, state);
      } else if (card.effect === 'phoenix_core') {
        ally.phoenixCore = true;
      } else if (card.effect === 'parts_salvage') {
        ally.partsSalvageActive = true;
      } else if (card.effect === 'precog') {
        if (state.discard.length > 0) {
          const best = state.discard.reduce((b, c) => (!b || c.cost > 0) ? c : b, null);
          const idx = state.discard.indexOf(best);
          if (idx >= 0) { state.discard.splice(idx, 1); state.deck.push(best); }
        }
      } else if (card.effect === 'recall' || card.effect === 'resupply') {
        if (state.discard.length > 0) {
          const best = state.discard.reduce((b, c) => (!b || c.cost > 0) ? c : b, null);
          const idx = state.discard.indexOf(best);
          if (idx >= 0) { state.discard.splice(idx, 1); state.hand.push(best); }
        }
      } else if (card.effect === 'full_restock') {
        const pickCount = card.pickCount || 3;
        for (let i = 0; i < pickCount; i++) {
          if (state.discard.length > 0) {
            const best = state.discard.reduce((b, c) => (!b || c.cost > 0) ? c : b, null);
            const idx = state.discard.indexOf(best);
            if (idx >= 0) { state.discard.splice(idx, 1); state.hand.push(best); }
          }
        }
      } else if (card.effect === 'accelerate' || card.effect === 'supply_drop') {
        for (let i = 0; i < (card.drawAmount || 2); i++) drawCard(state);
        if (card.enGain) state.en = Math.min(state.en + card.enGain, state.enCap);
      } else if (card.effect === 'karma_reset') {
        const others = state.hand.filter((c, i) => i !== handIdx);
        if (others.length > 0) {
          const worst = others[others.length - 1];
          const wIdx = state.hand.indexOf(worst);
          if (wIdx >= 0) { state.hand.splice(wIdx, 1); state.deck.unshift(worst); }
        }
        state.en = Math.min(state.en + card.enGain || 1, state.enCap);
      } else if (card.effect === 'time_leap') {
        state.deck = [...state.deck, ...state.discard];
        state.discard = [];
        shuffle(state.deck);
        for (let i = 0; i < (card.drawAmount || 3); i++) drawCard(state);
      } else if (card.effect === 'load') {
        ally.loadCounter += card.loadAmount;
      } else if (card.effect === 'quick_load') {
        ally.loadCounter += card.loadAmount;
        ally.hp -= card.selfDmg;
        if (ally.hp <= 0) killAlly(ally, state);
      } else if (card.effect === 'iron_body') {
        ally.ironBody = true;
        ally.ironBodyRate = card.absorbRate;
      } else if (card.effect === 'endurance') {
        const healAmt = Math.floor(ally.maxHP * card.healPct);
        ally.hp = Math.min(ally.maxHP, ally.hp + healAmt);
        ally.damageCounter += card.counterAdd;
      } else if (card.effect === 'last_stand') {
        ally.lastStand = true;
        ally.damageCounter += card.counterAdd;
      } else if (card.effect === 'drone_deploy') {
        if (ally.drones.length < (card.maxDrones || 2)) {
          ally.drones.push({ hp: card.droneHP, maxHP: card.droneHP, atk: Math.round(card.droneATK * (1 + ally.stats.OUT * 0.04)), mode: 'attack' });
        }
      } else if (card.effect === 'drone_mode_change') {
        ally.droneGuardMode = !ally.droneGuardMode;
        ally.drones.forEach(d => { d.mode = ally.droneGuardMode ? 'guard' : 'attack'; });
      } else if (card.effect === 'command_focus') {
        ally.droneFocusTarget = targetId;
        ally.droneFocusMultiplier = card.focusMultiplier;
      } else if (card.effect === 'drone_self_destruct') {
        if (ally.drones.length > 0) {
          const drone = ally.drones.pop();
          const dmg = drone.hp + card.bonusDmg;
          state.enemies.filter(e => !e.dead).forEach(e => {
            e.hp -= dmg;
            if (e.hp <= 0) { e.hp = 0; e.dead = true; }
          });
        }
      } else if (card.effect === 'emergency_repair') {
        const deadDraws = state.hand.filter(c => !c.playable);
        if (deadDraws.length > 0) {
          deadDraws[0].playable = true;
          deadDraws[0]._tempPlayable = true;
        }
      }
      break;
    }
  }

  // Move card from hand to discard
  state.hand.splice(handIdx, 1);
  state.discard.push(card);
}

// ============================================================
// TURN MANAGEMENT (headless)
// ============================================================

function startTurn(state) {
  state.turn++;
  state.en = Math.min(state.en + state.maxEN, state.enCap);

  // Reset per-turn ally states
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
      // Reset per-turn expansion state
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
      // Reset speed at turn start
      a.speed = 0;
    }
    a.buffs = a.buffs.dmgBonus ? { dmgBonus: a.buffs.dmgBonus } : {};
  });

  // Reset full drive at turn start
  state.allies.forEach(a => { a.fullDriveActive = false; });

  // Reset enemy barrier, speed, and process statuses
  state.enemies.forEach(e => {
    if (e.dead) return;
    e.barrier = 0;
    e.speed = 0; // Reset speed at turn start
    // Overheat: deal N damage, N decreases by 1
    if (e.statuses.overheat > 0) {
      const dmg = e.statuses.overheat;
      e.hp -= dmg;
      e.statuses.overheat--;
      if (e.hp <= 0) { e.hp = 0; e.dead = true; }
    }
    // Vulnerability persists (consumed on hit)
    // Shock: decrement turns
    if (e.statuses.shock > 0) { e.statuses.shock--; }
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
    e.weakPointBonus = 0;
  });

  // Reactive armor damage from last turn
  state.allies.forEach(a => {
    if (a._reactiveBarrierRemaining && a._reactiveBarrierRemaining > 0) {
      const rdmg = a._reactiveBarrierRemaining;
      state.enemies.forEach(e => {
        if (!e.dead) {
          e.hp -= rdmg;
          if (e.hp <= 0) { e.hp = 0; e.dead = true; }
        }
      });
    }
    a._reactiveBarrierRemaining = 0;
  });

  // Check win after status damage
  if (state.enemies.every(e => e.dead)) return 'win';

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
  for (let i = 0; i < 5; i++) drawCard(state);

  return 'continue';
}

function endTurn(state) {
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
        dealDmgToAllyFromEnemy(state, e, target, atkPower);
        break;
      case 'attack_heavy':
        dealDmgToAllyFromEnemy(state, e, target, Math.floor(atkPower * 1.8));
        break;
      case 'attack_all':
        aliveAllies.forEach(a => dealDmgToAllyFromEnemy(state, e, a, Math.floor(atkPower * 0.7)));
        break;
      case 'barrier':
        e.barrier += 10;
        break;
      case 'buff_self':
        e.atk += 2;
        break;
    }
  });

  // Process ally overheat
  state.allies.forEach(a => {
    if (a.dead) return;
    if (a.buffs.overheat && a.buffs.overheat > 0) {
      a.hp -= a.buffs.overheat;
      a.buffs.overheat--;
      if (a.hp <= 0) killAlly(a, state);
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
            if (target.hp <= 0) { target.hp = 0; target.dead = true; }
          }
        } else if (drone.mode === 'guard') {
          const aliveAllies = state.allies.filter(al => !al.dead);
          if (aliveAllies.length > 0) {
            const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
            target.barrier += Math.round(5 * (1 + a.stats.OUT * 0.04));
          }
        }
      });
    }
  });

  // Check game over
  if (state.allies.every(a => a.dead)) return 'lose';
  if (state.enemies.every(e => e.dead)) return 'win';
  return 'continue';
}

// ============================================================
// AI LOGIC
// ============================================================

function aiSelectTarget(state, card) {
  // For attack cards: target lowest HP alive enemy
  if (card.target === 'enemy_single' || card.target === 'provoke') {
    const alive = state.enemies.filter(e => !e.dead);
    if (alive.length === 0) return 0;

    // If enemy has barrier and card removes barrier, prefer that enemy
    if (card.removeBarrier) {
      const withBarrier = alive.filter(e => e.barrier > 0);
      if (withBarrier.length > 0) return withBarrier[0].id;
    }

    // For mark, prefer highest HP enemy
    if (card.effect === 'mark') {
      alive.sort((a, b) => b.hp - a.hp);
      return alive[0].id;
    }

    // For provoke, target enemy attacking an ally with low HP
    if (card.target === 'provoke') {
      const attacking = alive.filter(e => e.intent === 'attack' || e.intent === 'attack_heavy');
      if (attacking.length > 0) {
        attacking.sort((a, b) => {
          const tA = state.allies[a.targetIdx];
          const tB = state.allies[b.targetIdx];
          const hpA = tA && !tA.dead ? tA.hp : 9999;
          const hpB = tB && !tB.dead ? tB.hp : 9999;
          return hpA - hpB;
        });
        return attacking[0].id;
      }
    }

    // For vulnerability bonus cards, prefer vulnerable enemy
    if (card.vulnerabilityBonus) {
      const vulnerable = alive.filter(e => e.statuses.vulnerability > 0);
      if (vulnerable.length > 0) {
        vulnerable.sort((a, b) => a.hp - b.hp);
        return vulnerable[0].id;
      }
    }

    // For overheat bonus cards, prefer overheated enemy
    if (card.overheatBonus) {
      const overheated = alive.filter(e => e.statuses.overheat > 0);
      if (overheated.length > 0) {
        overheated.sort((a, b) => a.hp - b.hp);
        return overheated[0].id;
      }
    }

    // Default: lowest HP
    alive.sort((a, b) => a.hp - b.hp);
    return alive[0].id;
  }

  // For heal: target lowest HP% ally
  if (card.target === 'ally_single') {
    const alive = state.allies.filter(a => !a.dead);
    if (alive.length === 0) return 0;

    if (card.type === 'heal') {
      alive.sort((a, b) => (a.hp / a.maxHP) - (b.hp / b.maxHP));
      return alive[0].id;
    }
    if (card.type === 'defend') {
      // Barrier: put on the enemy's target (most threatened ally)
      const threatened = findMostThreatenedAlly(state);
      return threatened ? threatened.id : alive[0].id;
    }
    if (card.effect === 'accel') {
      // Boost the most threatened ally
      const threatened = findMostThreatenedAlly(state);
      return threatened ? threatened.id : alive[0].id;
    }
    return alive[0].id;
  }

  // For reboot: target dead ally
  if (card.target === 'ally_dead') {
    const dead = state.allies.filter(a => a.dead);
    if (dead.length === 0) return -1; // can't use
    return dead[0].id;
  }

  // For provoke_all and ally_pair: no target needed (auto-handled)
  if (card.target === 'provoke_all' || card.target === 'ally_pair') {
    return null;
  }

  return null; // no target needed
}

function findMostThreatenedAlly(state) {
  const alive = state.allies.filter(a => !a.dead);
  if (alive.length === 0) return null;

  // Count how many enemies are targeting each ally, weighted by damage
  const threats = {};
  alive.forEach(a => threats[a.id] = 0);

  state.enemies.forEach(e => {
    if (e.dead) return;
    const atk = e.atk - (e.debuffs.atkReduction || 0);
    let dmg = 0;
    switch (e.intent) {
      case 'attack': dmg = atk; break;
      case 'attack_heavy': dmg = Math.floor(atk * 1.8); break;
      case 'attack_all': alive.forEach(a => threats[a.id] += Math.floor(atk * 0.7)); return;
      default: return;
    }
    if (threats[e.targetIdx] !== undefined) threats[e.targetIdx] += dmg;
  });

  alive.sort((a, b) => threats[b.id] - threats[a.id]);
  return alive[0];
}

function estimateCardValue(state, card) {
  const ally = state.allies[card.ownerIdx];
  if (!ally || ally.dead) return -100;
  if (!card.playable) return -100;
  if (card.cost > state.en) return -100;
  if (ally.attackLocked && card.type === 'attack') return -100;

  const aliveAllies = state.allies.filter(a => !a.dead);
  const aliveEnemies = state.enemies.filter(e => !e.dead);
  if (aliveEnemies.length === 0) return -100;

  let value = 0;
  const statVal = card.stat === 'OUT' ? ally.stats.OUT : 0;

  switch (card.type) {
    case 'attack': {
      const baseDmg = Math.round(card.baseDmg * (1 + statVal * 0.04)) + (ally.buffs.dmgBonus || 0) + (ally.buffs.warcryBonus || 0);
      const hits = card.hits || 1;
      value = baseDmg * hits;

      if (card.target === 'enemy_all') value *= aliveEnemies.length * 0.8;
      if (card.target === 'enemy_random') value *= 0.9;
      if (card.overheatBonus) {
        const overheated = aliveEnemies.filter(e => e.statuses.overheat > 0);
        if (overheated.length > 0) value += card.overheatBonus * (card.target === 'enemy_all' ? overheated.length : 1);
      }
      if (card.vulnerabilityBonus) {
        const vulnerable = aliveEnemies.filter(e => e.statuses.vulnerability > 0);
        if (vulnerable.length > 0) value += card.vulnerabilityBonus;
      }
      if (card.backstabBonus) value += card.backstabBonus * 0.5; // rough estimate, 50% chance
      if (card.selfHeal) value += card.selfHeal * 0.5;
      if (card.selfField) value += card.selfField * 0.5;
      if (card.selfDmg) value -= card.selfDmg * 0.8;
      if (card.applyStatus) {
        const statuses = Array.isArray(card.applyStatus) ? card.applyStatus : [card.applyStatus];
        for (const st of statuses) {
          if (st.type === 'overheat') value += st.stacks * 3;
          if (st.type === 'vulnerability') value += st.stacks * 2;
          if (st.type === 'shock') value += st.turns * 4;
        }
      }
      if (card.removeBarrier) value += 5;
      if (card.unavoidable) value += 3;
      if (card.applySpeed) value += Math.abs(card.applySpeed) * 0.3;
      if (card.applySelfSpeed) value += card.applySelfSpeed * 0.2;
      // Expansion attacks
      if (card.effect === 'reverse_charge') {
        const rawDmg = ally.elementStacks > 0 ? ally.elementStacks * card.accumMultiplier + card.baseDmg : card.baseDmg;
        value = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04));
      }
      if (card.effect === 'fusion_burst') {
        const rawDmg = ally.elementStacks * card.accumMultiplier + card.baseDmg;
        value = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04)) * aliveEnemies.length * 0.8;
      }
      if (card.effect === 'rail_cannon') {
        value = ally.loadCounter > 0 ? Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) : -5;
      }
      if (card.effect === 'satellite_cannon') {
        value = ally.loadCounter > 0 ? Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) * aliveEnemies.length * 0.7 : -5;
      }
      if (card.effect === 'counter_blow') {
        value = ally.damageCounter > 0 ? Math.round((ally.damageCounter * card.counterMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) : -5;
      }
      if (card.effect === 'exploit') {
        const bestTarget = aliveEnemies.reduce((best, e) => {
          const count = Object.values(e.statuses).filter(v => v).length;
          return count > best ? count : best;
        }, 0);
        value = Math.round(card.baseDmg * (1 + ally.stats.OUT * 0.04)) + bestTarget * (card.perStatusBonus || 5);
      }
      if (card.onKill) value += 3; // bonus for having kill effects
      break;
    }
    case 'defend': {
      const barrierVal = card.stat === 'SHL' ? ally.stats.SHL : (card.stat === 'CTRL' ? ally.stats.CTRL : 0);
      const barrierAmt = Math.round(card.baseBarrier * (1 + barrierVal * 0.04));
      value = barrierAmt * 0.8;

      // Higher priority if enemies are attacking
      const incomingDmg = estimateIncomingDamage(state);
      if (incomingDmg > 0) value = barrierAmt * 1.2;

      if (card.target === 'ally_all') value *= aliveAllies.length * 0.7;
      if (card.target === 'provoke') value += 5; // redirect is very valuable
      if (card.counterDmg) value += card.counterDmg * 0.5;
      if (card.spikeReflect) value += barrierAmt * card.spikeReflect * 0.5;
      if (card.reactive) value += 4;
      if (card.siegeBuff) value += card.siegeBuff * 0.7;
      if (card.lockAttack) value -= 3;
      if (card.persistent) value += 3;
      break;
    }
    case 'heal': {
      const healVal = card.stat === 'CTRL' ? ally.stats.CTRL : 0;
      const healAmt = Math.round(card.baseHeal * (1 + healVal * 0.04));

      // Value depends on how hurt the team is
      const mostHurt = aliveAllies.reduce((min, a) => Math.min(min, a.hp / a.maxHP), 1);
      if (mostHurt < 0.4) {
        value = healAmt * 1.5;
      } else if (mostHurt < 0.7) {
        value = healAmt * 0.8;
      } else {
        value = healAmt * 0.2; // not urgent
      }
      if (card.target === 'ally_all') value *= Math.min(aliveAllies.length * 0.6, 2);
      break;
    }
    case 'buff': {
      if (card.effect === 'overdrive') {
        // Very high value if there are attack cards remaining in hand
        const attacksInHand = state.hand.filter(c => c.type === 'attack' && c.ownerIdx === ally.id && c.playable);
        value = attacksInHand.length > 0 ? 20 : 8;
      } else if (card.effect === 'chargeshot') {
        value = card.chargeAmount * 1.5;
      } else if (card.effect === 'limiter') {
        if (ally.hp > ally.maxHP * 0.4) {
          value = card.amount * 2;
        } else {
          value = -5; // too risky
        }
      } else if (card.effect === 'powerlink') {
        value = card.amount * 1.5;
      } else if (card.effect === 'accel') {
        value = 6;
      } else if (card.effect === 'fullboost') {
        value = card.amount * aliveAllies.length + 3; // EN+1 is valuable
      } else if (card.effect === 'smoke') {
        value = 5 + estimateIncomingDamage(state) * 0.1;
      // Expansion buffs
      } else if (card.effect === 'element_coat_heat' || card.effect === 'element_coat_shock') {
        const hasCoat = state.allies.some(a => !a.dead && a.elementCoat);
        value = hasCoat ? 2 : 10;
      } else if (card.effect === 'link_boost') {
        const linked = state.allies.filter(a => !a.dead && a.linkedTo >= 0);
        value = linked.length > 0 ? card.amount * linked.length : -5;
      } else if (card.effect === 'resonance') {
        const linked = state.allies.filter(a => !a.dead && a.linkedTo >= 0);
        value = linked.length > 0 ? card.amount * 1.5 : -5;
      } else if (card.effect === 'berserker') {
        const hpPct = ally.hp / ally.maxHP;
        value = hpPct <= 0.5 ? card.lowBonus * 1.5 : card.highBonus;
      } else if (card.effect === 'data_link') {
        const scannedCount = state.enemies.filter(e => !e.dead && e.scanned).length;
        value = (card.baseAmount + scannedCount * card.perScanBonus) * aliveAllies.length;
      } else if (card.effect === 'warcry') {
        value = (card.warcryBonus || 3) * aliveAllies.length + (card.selfBarrier || 3);
      }
      // Ally speed buffs
      if (card.applyAllySpeed) {
        const targets = card.target === 'ally_all' ? aliveAllies.length : 1;
        value += card.applyAllySpeed * 0.3 * targets;
      }
      break;
    }
    case 'debuff': {
      if (card.applyStatus) {
        const statuses = Array.isArray(card.applyStatus) ? card.applyStatus : [card.applyStatus];
        const targetCount = card.target === 'enemy_all' ? aliveEnemies.length : 1;
        for (const st of statuses) {
          if (st.type === 'overheat') value += st.stacks * 3 * targetCount;
          if (st.type === 'vulnerability') value += st.stacks * 2 * targetCount;
          if (st.type === 'shock') value += st.turns * 4 * targetCount;
        }
      }
      // Speed debuffs
      if (card.applySpeed) {
        const targetCount = card.target === 'enemy_all' ? aliveEnemies.length : 1;
        value += Math.abs(card.applySpeed) * 0.3 * targetCount;
      }
      // Expansion debuffs
      if (card.effect === 'mark') value = card.amount + 3;
      if (card.debuffATK) value += card.debuffATK * 2;
      if (card.effect === 'scan') {
        const unscanned = aliveEnemies.filter(e => !e.scanned);
        value = unscanned.length > 0 ? 10 : -5;
      }
      if (card.effect === 'weak_point') { value = 6; }
      if (card.effect === 'analyze_field') {
        const unscanned = aliveEnemies.filter(e => !e.scanned);
        value = unscanned.length > 1 ? 12 : unscanned.length === 1 ? 6 : -5;
      }
      break;
    }
    case 'special': {
      if (card.effect === 'encharge') {
        const unplayable = state.hand.filter(c => c.playable && c.cost > state.en && c.cost <= state.en + card.amount);
        value = unplayable.length > 0 ? 8 : 3;
      } else if (card.effect === 'full_drive') {
        // Value = the EN saved on next card
        const playable = state.hand.filter(c => c.playable && c.cost > 0 && c !== card);
        value = playable.length > 0 ? 7 : 2;
      } else if (card.effect === 'reboot') {
        const deadAllies = state.allies.filter(a => a.dead);
        value = deadAllies.length > 0 ? 15 : -100;
      // Expansion specials
      } else if (card.effect === 'neural_link') {
        const linked = state.allies.filter(a => a.linkedTo >= 0);
        value = linked.length === 0 ? 12 : -5; // only link once
      } else if (card.effect === 'synchro_attack') {
        const linked = state.allies.filter(a => a.linkedTo >= 0 && a.linkMode !== 'attack_sync');
        value = linked.length > 0 ? 10 : -5;
      } else if (card.effect === 'shared_pain') {
        const linked = state.allies.filter(a => a.linkedTo >= 0 && a.linkMode !== 'damage_share');
        value = linked.length > 0 ? 8 : -5;
      } else if (card.effect === 'overcharge') {
        value = 8 + ally.bombCounter * 0.5; // more value as we accumulate
      } else if (card.effect === 'self_destruct') {
        value = ally.bombCounter > 0 ? ally.bombCounter * 3 + 5 : 3;
      } else if (card.effect === 'phoenix_core') {
        value = ally.phoenixCore ? -5 : 10;
      } else if (card.effect === 'parts_salvage') {
        value = aliveEnemies.length > 1 ? 8 : 3;
      } else if (card.effect === 'precog' || card.effect === 'recall' || card.effect === 'resupply') {
        value = state.discard.length > 0 ? 7 : -5;
      } else if (card.effect === 'full_restock') {
        value = state.discard.length >= 2 ? 10 : state.discard.length > 0 ? 5 : -5;
      } else if (card.effect === 'accelerate') { value = 7; }
      else if (card.effect === 'supply_drop') { value = 8; }
      else if (card.effect === 'karma_reset') { value = 4; }
      else if (card.effect === 'time_leap') { value = state.discard.length > 5 ? 10 : 5; }
      else if (card.effect === 'load') { value = 8; }
      else if (card.effect === 'quick_load') { value = ally.hp > 5 ? 5 : -5; }
      else if (card.effect === 'iron_body') { value = estimateIncomingDamage(state) > 5 ? 10 : 4; }
      else if (card.effect === 'endurance') { value = 7; }
      else if (card.effect === 'last_stand') { value = ally.hp / ally.maxHP < 0.4 ? 12 : 6; }
      else if (card.effect === 'drone_deploy') {
        value = ally.drones.length < (card.maxDrones || 2) ? 10 : -100;
      }
      else if (card.effect === 'drone_mode_change') { value = 3; }
      else if (card.effect === 'command_focus') { value = ally.drones.length > 0 ? 6 : -100; }
      else if (card.effect === 'drone_self_destruct') { value = ally.drones.length > 0 ? 7 : -100; }
      else if (card.effect === 'emergency_repair') {
        const deadDraws = state.hand.filter(c => !c.playable);
        value = deadDraws.length > 0 ? 8 : -100;
      }
      break;
    }
  }

  // Cost efficiency bonus for 0-cost cards
  if (card.cost === 0 && value > 0) value += 2;

  return value;
}

function estimateIncomingDamage(state) {
  let totalDmg = 0;
  state.enemies.forEach(e => {
    if (e.dead) return;
    const atk = Math.max(0, e.atk - (e.debuffs.atkReduction || 0));
    switch (e.intent) {
      case 'attack': totalDmg += atk; break;
      case 'attack_heavy': totalDmg += Math.floor(atk * 1.8); break;
      case 'attack_all': totalDmg += Math.floor(atk * 0.7) * state.allies.filter(a => !a.dead).length; break;
    }
  });
  return totalDmg;
}

// ============================================================
// SMART AI HELPERS
// ============================================================

function estimateRemainingTurns(state) {
  const aliveEnemies = state.enemies.filter(e => !e.dead);
  const totalEnemyHP = aliveEnemies.reduce((s, e) => s + e.hp, 0);
  const aliveAllies = state.allies.filter(a => !a.dead);
  let partyDPS = 0;
  aliveAllies.forEach(a => {
    a.cards.forEach(c => {
      if (c.type === 'attack' && c.playable) {
        const statVal = c.stat === 'OUT' ? a.stats.OUT : 0;
        partyDPS += Math.round(c.baseDmg * (1 + statVal * 0.04)) * (c.hits || 1);
      }
    });
  });
  partyDPS = partyDPS / 5; // avg per turn (draw 5 of 20 cards)
  if (partyDPS <= 0) partyDPS = 5;
  return Math.min(10, Math.ceil(totalEnemyHP / partyDPS));
}

function estimatePartyDPS(state) {
  const aliveAllies = state.allies.filter(a => !a.dead);
  let partyDPS = 0;
  aliveAllies.forEach(a => {
    a.cards.forEach(c => {
      if (c.type === 'attack' && c.playable) {
        const statVal = c.stat === 'OUT' ? a.stats.OUT : 0;
        partyDPS += Math.round(c.baseDmg * (1 + statVal * 0.04)) * (c.hits || 1);
      }
    });
  });
  partyDPS = partyDPS / 5;
  if (partyDPS <= 0) partyDPS = 5;
  return partyDPS;
}

function estimateAllyDPS(ally) {
  let dps = 0;
  ally.cards.forEach(c => {
    if (c.type === 'attack' && c.playable) {
      const statVal = c.stat === 'OUT' ? ally.stats.OUT : 0;
      dps += Math.round(c.baseDmg * (1 + statVal * 0.04)) * (c.hits || 1);
    }
  });
  return dps / 5;
}

function estimateCardValueInDiscard(state, c) {
  // Quick estimate for a card in discard pile
  const ally = state.allies[c.ownerIdx];
  if (!ally || ally.dead || !c.playable) return 0;
  const statVal = c.stat === 'OUT' ? ally.stats.OUT : 0;
  if (c.type === 'attack') return Math.round(c.baseDmg * (1 + statVal * 0.04)) * (c.hits || 1);
  if (c.type === 'defend') return Math.round((c.baseBarrier || 0) * (1 + (c.stat === 'SHL' ? ally.stats.SHL : (c.stat === 'CTRL' ? ally.stats.CTRL : 0)) * 0.04));
  if (c.type === 'heal') return Math.round((c.baseHeal || 0) * (1 + (ally.stats.CTRL || 0) * 0.04));
  if (c.type === 'buff') return 8;
  return 5;
}

// ============================================================
// SMART AI - values persistent/setup effects properly
// ============================================================

function estimateCardValueSmart(state, card) {
  const ally = state.allies[card.ownerIdx];
  if (!ally || ally.dead) return -100;
  if (!card.playable) return -100;
  if (card.cost > state.en) return -100;
  if (ally.attackLocked && card.type === 'attack') return -100;

  const aliveAllies = state.allies.filter(a => !a.dead);
  const aliveEnemies = state.enemies.filter(e => !e.dead);
  if (aliveEnemies.length === 0) return -100;

  const remainingTurns = estimateRemainingTurns(state);
  const totalPartyDPS = estimatePartyDPS(state);
  const incomingDmg = estimateIncomingDamage(state);
  const isEarlyTurn = state.turn <= 2;

  let value = 0;
  const statVal = card.stat === 'OUT' ? ally.stats.OUT : 0;

  switch (card.type) {
    case 'attack': {
      const baseDmg = Math.round(card.baseDmg * (1 + statVal * 0.04)) + (ally.buffs.dmgBonus || 0) + (ally.buffs.warcryBonus || 0);
      const hits = card.hits || 1;
      value = baseDmg * hits;

      if (card.target === 'enemy_all') value *= aliveEnemies.length * 0.8;
      if (card.target === 'enemy_random') value *= 0.9;
      if (card.overheatBonus) {
        const overheated = aliveEnemies.filter(e => e.statuses.overheat > 0);
        if (overheated.length > 0) value += card.overheatBonus * (card.target === 'enemy_all' ? overheated.length : 1);
      }
      if (card.vulnerabilityBonus) {
        const vulnerable = aliveEnemies.filter(e => e.statuses.vulnerability > 0);
        if (vulnerable.length > 0) value += card.vulnerabilityBonus;
      }
      if (card.backstabBonus) value += card.backstabBonus * 0.5;
      if (card.selfHeal) value += card.selfHeal * 0.5;
      if (card.selfField) value += card.selfField * 0.5;
      if (card.selfDmg) value -= card.selfDmg * 0.8;
      if (card.applyStatus) {
        const statuses = Array.isArray(card.applyStatus) ? card.applyStatus : [card.applyStatus];
        for (const st of statuses) {
          if (st.type === 'overheat') value += st.stacks * 3;
          if (st.type === 'vulnerability') value += st.stacks * 2;
          if (st.type === 'shock') value += st.turns * 4;
        }
      }
      if (card.removeBarrier) value += 5;
      if (card.unavoidable) value += 3;
      if (card.applySpeed) value += Math.abs(card.applySpeed) * 0.3;
      if (card.applySelfSpeed) value += card.applySelfSpeed * 0.2;

      // Expansion attacks (same as basic AI)
      if (card.effect === 'reverse_charge') {
        const rawDmg = ally.elementStacks > 0 ? ally.elementStacks * card.accumMultiplier + card.baseDmg : card.baseDmg;
        value = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04));
      }
      if (card.effect === 'fusion_burst') {
        const rawDmg = ally.elementStacks * card.accumMultiplier + card.baseDmg;
        value = Math.round(rawDmg * (1 + ally.stats.OUT * 0.04)) * aliveEnemies.length * 0.8;
      }
      if (card.effect === 'rail_cannon') {
        value = ally.loadCounter > 0 ? Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) : -5;
      }
      if (card.effect === 'satellite_cannon') {
        value = ally.loadCounter > 0 ? Math.round((ally.loadCounter * card.loadMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) * aliveEnemies.length * 0.7 : -5;
      }
      if (card.effect === 'counter_blow') {
        value = ally.damageCounter > 0 ? Math.round((ally.damageCounter * card.counterMultiplier + card.baseDmg) * (1 + ally.stats.OUT * 0.04)) : -5;
      }
      if (card.effect === 'exploit') {
        const bestTarget = aliveEnemies.reduce((best, e) => {
          const count = Object.values(e.statuses).filter(v => v).length;
          return count > best ? count : best;
        }, 0);
        value = Math.round(card.baseDmg * (1 + ally.stats.OUT * 0.04)) + bestTarget * (card.perStatusBonus || 5);
      }
      if (card.onKill) value += 3;
      break;
    }
    case 'defend': {
      const barrierVal = card.stat === 'SHL' ? ally.stats.SHL : (card.stat === 'CTRL' ? ally.stats.CTRL : 0);
      const barrierAmt = Math.round(card.baseBarrier * (1 + barrierVal * 0.04));
      value = barrierAmt * 0.8;

      // Smart: value barrier higher when enemies are about to attack
      if (incomingDmg > 0) value = barrierAmt * 1.3;

      // Smart: check enemy intents - if attack_all incoming, ally_all barrier is very valuable
      const hasAttackAll = state.enemies.some(e => !e.dead && e.intent === 'attack_all');
      if (card.target === 'ally_all') {
        value *= aliveAllies.length * 0.7;
        if (hasAttackAll) value *= 1.5;
      }

      if (card.target === 'provoke') {
        value += 5;
        // Smart: provoke is very valuable when enemy targets low-HP ally
        const aliveTargeted = state.enemies.filter(e => !e.dead && (e.intent === 'attack' || e.intent === 'attack_heavy'));
        for (const e of aliveTargeted) {
          const target = state.allies[e.targetIdx];
          if (target && !target.dead && target.hp / target.maxHP < 0.4 && target.id !== ally.id) {
            value += 8; // high value: protecting a weak ally
            break;
          }
        }
      }

      if (card.counterDmg) value += card.counterDmg * 0.5;
      if (card.spikeReflect) value += barrierAmt * card.spikeReflect * 0.5;
      if (card.reactive) value += 4;
      if (card.siegeBuff) value += card.siegeBuff * 0.8;
      if (card.lockAttack) value -= 3;
      if (card.persistent) value += 3;

      // Smart: barrier BEFORE enemy attacks is proactive
      if (incomingDmg > barrierAmt * 0.5) value += 3;
      break;
    }
    case 'heal': {
      const healVal = card.stat === 'CTRL' ? ally.stats.CTRL : 0;
      const healAmt = Math.round(card.baseHeal * (1 + healVal * 0.04));

      const mostHurt = aliveAllies.reduce((min, a) => Math.min(min, a.hp / a.maxHP), 1);

      // Smart: heal priority based on value of the ally (losing attacker's cards = Dead Draw)
      let allyValueMultiplier = 1.0;
      if (card.target === 'ally_single') {
        // Find the most hurt ally that has the most valuable cards
        const hurtAllies = aliveAllies.filter(a => a.hp / a.maxHP < 0.7);
        const highValueHurt = hurtAllies.find(a => estimateAllyDPS(a) > totalPartyDPS * 0.3);
        if (highValueHurt) allyValueMultiplier = 1.3;
      }

      if (mostHurt < 0.3) {
        value = healAmt * 2.0 * allyValueMultiplier;
      } else if (mostHurt < 0.5) {
        value = healAmt * 1.5 * allyValueMultiplier;
      } else if (mostHurt < 0.7) {
        value = healAmt * 0.8;
      } else {
        value = healAmt * 0.2;
      }
      if (card.target === 'ally_all') value *= Math.min(aliveAllies.length * 0.6, 2);
      break;
    }
    case 'buff': {
      if (card.effect === 'accel') {
        value = 6;
      } else if (card.effect === 'smoke') {
        value = 5 + incomingDmg * 0.1;
      } else if (card.effect === 'element_coat_heat' || card.effect === 'element_coat_shock') {
        // Smart: persistent buff, value = per-turn-benefit * remaining turns
        const hasCoat = state.allies.some(a => !a.dead && a.elementCoat);
        if (hasCoat) {
          value = 2; // already have one
        } else {
          value = 8 * remainingTurns; // status effects compound over turns
          if (isEarlyTurn) value *= 2;
        }
      } else if (card.effect === 'link_boost') {
        const linked = state.allies.filter(a => !a.dead && a.linkedTo >= 0);
        value = linked.length > 0 ? card.amount * linked.length : -5;
      } else if (card.effect === 'resonance') {
        const linked = state.allies.filter(a => !a.dead && a.linkedTo >= 0);
        value = linked.length > 0 ? card.amount * 1.5 : -5;
      } else if (card.effect === 'berserker') {
        const hpPct = ally.hp / ally.maxHP;
        value = hpPct <= 0.5 ? card.lowBonus * 1.5 : card.highBonus;
      } else if (card.effect === 'data_link') {
        const scannedCount = state.enemies.filter(e => !e.dead && e.scanned).length;
        value = (card.baseAmount + scannedCount * card.perScanBonus) * aliveAllies.length;
      } else if (card.effect === 'warcry') {
        // Smart: value = bonus * alive allies + selfBarrier
        value = (card.warcryBonus || 3) * aliveAllies.length + (card.selfBarrier || 3);
      }
      if (card.applyAllySpeed) {
        const targets = card.target === 'ally_all' ? aliveAllies.length : 1;
        value += card.applyAllySpeed * 0.3 * targets;
      }
      break;
    }
    case 'debuff': {
      if (card.applyStatus) {
        const statuses = Array.isArray(card.applyStatus) ? card.applyStatus : [card.applyStatus];
        const targetCount = card.target === 'enemy_all' ? aliveEnemies.length : 1;
        for (const st of statuses) {
          if (st.type === 'overheat') value += st.stacks * 3 * targetCount;
          if (st.type === 'vulnerability') value += st.stacks * 2.5 * targetCount;
          if (st.type === 'shock') value += st.turns * 5 * targetCount;
        }
      }
      if (card.applySpeed) {
        const targetCount = card.target === 'enemy_all' ? aliveEnemies.length : 1;
        value += Math.abs(card.applySpeed) * 0.3 * targetCount;
      }
      if (card.effect === 'mark') value = card.amount + 3;
      if (card.debuffATK) value += card.debuffATK * 2;

      // Smart: Scan is a persistent debuff, value = DPS * 0.2 * remainingTurns
      if (card.effect === 'scan') {
        const unscanned = aliveEnemies.filter(e => !e.scanned);
        if (unscanned.length > 0) {
          value = totalPartyDPS * 0.2 * remainingTurns;
          if (isEarlyTurn) value *= 2; // setup early
        } else {
          value = -5;
        }
      }
      if (card.effect === 'weak_point') { value = 6; }
      if (card.effect === 'analyze_field') {
        const unscanned = aliveEnemies.filter(e => !e.scanned);
        if (unscanned.length > 1) {
          value = totalPartyDPS * 0.2 * remainingTurns * 0.8;
          if (isEarlyTurn) value *= 2;
        } else if (unscanned.length === 1) {
          value = 6;
        } else {
          value = -5;
        }
      }
      break;
    }
    case 'special': {
      if (card.effect === 'encharge') {
        // Smart: value = value of the best card in hand that you can't afford but could with +EN
        const unplayable = state.hand.filter(c => c.playable && c.cost > state.en && c.cost <= state.en + card.amount);
        if (unplayable.length > 0) {
          const bestUnplayable = unplayable.reduce((best, c) => {
            const v = estimateCardValue(state, { ...c, cost: 0 }); // pretend it's free for value est
            return v > best ? v : best;
          }, 0);
          value = bestUnplayable * 0.8;
        } else {
          value = 3;
        }
      } else if (card.effect === 'full_drive') {
        const playable = state.hand.filter(c => c.playable && c.cost > 0 && c !== card);
        value = playable.length > 0 ? 8 : 2;
      } else if (card.effect === 'reboot') {
        const deadAllies = state.allies.filter(a => a.dead);
        value = deadAllies.length > 0 ? 15 : -100;
      } else if (card.effect === 'neural_link') {
        // Smart: persistent link, value over remaining turns
        const linked = state.allies.filter(a => a.linkedTo >= 0);
        if (linked.length === 0) {
          // Find the best ally to link with (highest DPS)
          const candidates = aliveAllies.filter(a => a.id !== ally.id);
          if (candidates.length >= 2) {
            const bestDPS = Math.max(...candidates.map(a => estimateAllyDPS(a)));
            value = bestDPS * 0.3 * remainingTurns; // attack sync potential
            if (isEarlyTurn) value *= 2;
          } else {
            value = 8;
          }
        } else {
          value = -5;
        }
      } else if (card.effect === 'synchro_attack') {
        // Smart: attack sync = linkedAllyDPS * 0.3 * remainingTurns
        const linked = state.allies.filter(a => a.linkedTo >= 0 && a.linkMode !== 'attack_sync');
        if (linked.length > 0) {
          const linkedDPS = linked.reduce((s, a) => s + estimateAllyDPS(a), 0);
          value = linkedDPS * 0.3 * remainingTurns;
          if (isEarlyTurn) value *= 2;
        } else {
          value = -5;
        }
      } else if (card.effect === 'shared_pain') {
        const linked = state.allies.filter(a => a.linkedTo >= 0 && a.linkMode !== 'damage_share');
        value = linked.length > 0 ? 8 : -5;
      } else if (card.effect === 'overcharge') {
        value = 8 + ally.bombCounter * 0.5;
      } else if (card.effect === 'self_destruct') {
        value = ally.bombCounter > 0 ? ally.bombCounter * 3 + 5 : 3;
      } else if (card.effect === 'phoenix_core') {
        value = ally.phoenixCore ? -5 : 10;
      } else if (card.effect === 'parts_salvage') {
        value = aliveEnemies.length > 1 ? 8 : 3;
      } else if (card.effect === 'precog') {
        // Smart: value = value of best card in discard
        if (state.discard.length > 0) {
          const bestVal = state.discard.reduce((best, c) => {
            const v = estimateCardValueInDiscard(state, c);
            return v > best ? v : best;
          }, 0);
          value = bestVal;
        } else {
          value = -5;
        }
      } else if (card.effect === 'recall' || card.effect === 'resupply') {
        // Smart: value = best card in discard * 0.9
        if (state.discard.length > 0) {
          const bestVal = state.discard.reduce((best, c) => {
            const v = estimateCardValueInDiscard(state, c);
            return v > best ? v : best;
          }, 0);
          value = bestVal * 0.9;
        } else {
          value = -5;
        }
      } else if (card.effect === 'full_restock') {
        if (state.discard.length >= 2) {
          const vals = state.discard.map(c => estimateCardValueInDiscard(state, c)).sort((a, b) => b - a);
          value = vals.slice(0, 3).reduce((s, v) => s + v, 0) * 0.8;
        } else {
          value = state.discard.length > 0 ? 5 : -5;
        }
      } else if (card.effect === 'accelerate') { value = 7; }
      else if (card.effect === 'supply_drop') { value = 8; }
      else if (card.effect === 'karma_reset') { value = 4; }
      else if (card.effect === 'time_leap') { value = state.discard.length > 5 ? 10 : 5; }
      else if (card.effect === 'load') {
        // Smart: setup card, prioritize early
        value = 8;
        if (isEarlyTurn) value *= 2;
        // If already loaded, less value
        if (ally.loadCounter >= 4) value *= 0.5;
      }
      else if (card.effect === 'quick_load') {
        value = ally.hp > 5 ? 5 : -5;
        if (isEarlyTurn) value *= 1.5;
      }
      else if (card.effect === 'iron_body') { value = incomingDmg > 5 ? 10 : 4; }
      else if (card.effect === 'endurance') { value = 7; }
      else if (card.effect === 'last_stand') { value = ally.hp / ally.maxHP < 0.4 ? 12 : 6; }
      else if (card.effect === 'drone_deploy') {
        // Smart: persistent summon, prioritize early
        if (ally.drones.length < (card.maxDrones || 2)) {
          value = 10;
          if (isEarlyTurn) value *= 2;
        } else {
          value = -100;
        }
      }
      else if (card.effect === 'drone_mode_change') { value = 3; }
      else if (card.effect === 'command_focus') { value = ally.drones.length > 0 ? 6 : -100; }
      else if (card.effect === 'drone_self_destruct') { value = ally.drones.length > 0 ? 7 : -100; }
      else if (card.effect === 'emergency_repair') {
        const deadDraws = state.hand.filter(c => !c.playable);
        value = deadDraws.length > 0 ? 8 : -100;
      }
      break;
    }
  }

  // 0-EN cards should almost always be played (free value)
  if (card.cost === 0 && value > 0) value += 4;

  // Dead Draw risk: factor in protecting high-value frames
  // (this is mostly handled via heal/barrier targeting above)

  return value;
}

function aiPlayTurn(state, valueFn) {
  const evalFn = valueFn || (SMART_AI ? estimateCardValueSmart : estimateCardValue);
  // Keep playing cards until we can't or don't want to
  let safety = 20; // prevent infinite loops
  while (safety-- > 0) {
    // Score all playable cards in hand
    const scored = state.hand.map((card, idx) => ({
      card, idx, value: evalFn(state, card)
    })).filter(s => s.value > -50).sort((a, b) => b.value - a.value);

    if (scored.length === 0) break;
    if (scored[0].value <= 0 && state.en < 2) break; // no good plays left

    const best = scored[0];
    const card = best.card;

    if (card.cost > state.en) break;
    if (!card.playable) break;

    const ally = state.allies[card.ownerIdx];
    if (!ally || (ally.dead && card.type !== 'special')) break;
    if (ally.attackLocked && card.type === 'attack') {
      // Skip this card, try next
      const nextBest = scored.find(s => {
        const a = state.allies[s.card.ownerIdx];
        return a && !a.dead && !(a.attackLocked && s.card.type === 'attack') && s.card.playable && s.card.cost <= state.en;
      });
      if (!nextBest || nextBest.value <= 0) break;
      const target = aiSelectTarget(state, nextBest.card);
      if (target === -1) break;
      executeCardHeadless(state, nextBest.card, nextBest.idx, target);
    } else {
      const target = aiSelectTarget(state, card);
      if (target === -1) break; // can't find valid target
      executeCardHeadless(state, card, best.idx, target);
    }

    // Check if battle ended
    if (state.enemies.every(e => e.dead)) return 'win';
    if (state.allies.every(a => a.dead)) return 'lose';
  }
  return 'continue';
}

// ============================================================
// SINGLE BATTLE SIMULATION
// ============================================================

function simulateBattle(frameKeys, enemyDefs, valueFn) {
  const state = createBattleState(frameKeys, deepClone(enemyDefs));

  for (let t = 0; t < MAX_TURNS; t++) {
    const turnResult = startTurn(state);
    if (turnResult === 'win') {
      return { win: true, turns: state.turn, remainingHP: calcRemainingHP(state) };
    }

    const playResult = aiPlayTurn(state, valueFn);
    if (playResult === 'win') {
      return { win: true, turns: state.turn, remainingHP: calcRemainingHP(state) };
    }
    if (playResult === 'lose') {
      return { win: false, turns: state.turn, remainingHP: 0 };
    }

    const endResult = endTurn(state);
    if (endResult === 'win') {
      return { win: true, turns: state.turn, remainingHP: calcRemainingHP(state) };
    }
    if (endResult === 'lose') {
      return { win: false, turns: state.turn, remainingHP: 0 };
    }
  }

  // Exceeded max turns = loss
  return { win: false, turns: MAX_TURNS, remainingHP: calcRemainingHP(state) };
}

function calcRemainingHP(state) {
  let total = 0, max = 0;
  state.allies.forEach(a => {
    max += a.maxHP;
    if (!a.dead) total += a.hp;
  });
  return { total, max, pct: max > 0 ? total / max : 0 };
}

// ============================================================
// COMBINATION GENERATOR
// ============================================================

function getAllCombinations(frameKeysList, choose) {
  const combos = [];
  function recurse(start, current) {
    if (current.length === choose) {
      combos.push([...current]);
      return;
    }
    for (let i = start; i < frameKeysList.length; i++) {
      current.push(frameKeysList[i]);
      recurse(i + 1, current);
      current.pop();
    }
  }
  recurse(0, []);
  return combos;
}

// ============================================================
// COMPARE MODE: Run both AIs side-by-side per frame
// ============================================================

function runCompare() {
  const COMPARE_RUNS = 5;
  const COMPARE_PRESETS = ['3_weak', '1_elite', 'act2_boss'];
  const frameKeys = Object.keys(FRAMES);

  console.log('============================================================');
  console.log('FRAME:04 AI COMPARISON: Basic AI vs Smart AI');
  console.log('============================================================');
  console.log(`Runs per frame per preset: ${COMPARE_RUNS}`);
  console.log(`Enemy presets: ${COMPARE_PRESETS.join(', ')}`);
  console.log('============================================================\n');

  // For each frame, build a 4-frame team (fill with medic+shielder+booster as default teammates)
  const defaultTeammates = ['shielder', 'medic', 'booster'];

  const results = [];

  for (const fk of frameKeys) {
    const team = [fk, ...defaultTeammates.slice(0, 3)];

    let basicWins = 0, smartWins = 0, totalRuns = 0;

    for (const pk of COMPARE_PRESETS) {
      const preset = ENEMY_PRESETS[pk];
      if (!preset) continue;

      for (let r = 0; r < COMPARE_RUNS; r++) {
        const basicResult = simulateBattle(team, preset.enemies, estimateCardValue);
        if (basicResult.win) basicWins++;

        const smartResult = simulateBattle(team, preset.enemies, estimateCardValueSmart);
        if (smartResult.win) smartWins++;

        totalRuns++;
      }
    }

    const basicWR = (basicWins / totalRuns * 100).toFixed(1);
    const smartWR = (smartWins / totalRuns * 100).toFixed(1);
    const gap = (smartWins / totalRuns * 100 - basicWins / totalRuns * 100).toFixed(1);

    results.push({ frame: fk, name: FRAMES[fk].name, basicWR, smartWR, gap: parseFloat(gap), totalRuns });
  }

  // Sort by gap descending
  results.sort((a, b) => b.gap - a.gap);

  // Output table
  const nameWidth = 16;
  console.log(`${'FRAME'.padEnd(nameWidth)} | ${'Basic AI WR'.padEnd(12)} | ${'Smart AI WR'.padEnd(12)} | Gap (skill ceiling)`);
  console.log('-'.repeat(nameWidth + 50));

  for (const r of results) {
    const gapStr = r.gap >= 0 ? `+${r.gap}%` : `${r.gap}%`;
    const note = r.gap >= 10 ? ' (high skill ceiling)' : r.gap >= 5 ? ' (moderate)' : '';
    console.log(`${r.name.padEnd(nameWidth)} | ${(r.basicWR + '%').padEnd(12)} | ${(r.smartWR + '%').padEnd(12)} | ${gapStr}${note}`);
  }

  console.log('\n============================================================');
  console.log('Done.');
}

// ============================================================
// MAIN SIMULATION
// ============================================================

function main() {
  if (COMPARE_MODE) {
    runCompare();
    return;
  }
  // Only simulate base frame combinations
  const frameKeys = Object.keys(FRAMES).filter(k => FRAMES[k].pack === 'base');
  const combos = getAllCombinations(frameKeys, 4);

  // Add duplicate frame combos: 4x of each frame
  frameKeys.forEach(fk => {
    combos.push([fk, fk, fk, fk]);
  });

  // Add popular mixed duplicate combos
  const dupeMixes = [
    ['striker', 'striker', 'shielder', 'medic'],
    ['striker', 'striker', 'booster', 'medic'],
    ['blaster', 'blaster', 'shielder', 'medic'],
    ['overload', 'overload', 'medic', 'shielder'],
    ['launcher', 'launcher', 'shielder', 'medic'],
    ['scavenger', 'scavenger', 'blaster', 'medic'],
    ['drone', 'drone', 'shielder', 'medic'],
    ['bulk', 'bulk', 'medic', 'booster'],
    ['converter', 'striker', 'striker', 'medic'],
    ['seeker', 'seeker', 'blaster', 'shielder'],
  ];
  dupeMixes.forEach(c => combos.push(c));

  console.log('============================================================');
  console.log('FRAME:04 AUTO-BATTLE SIMULATION');
  console.log('============================================================');
  console.log(`Frames: ${frameKeys.length}`);
  console.log(`Combinations (C(${frameKeys.length},4)): ${combos.length}`);
  console.log(`Enemy presets: ${Object.keys(ENEMY_PRESETS).length}`);
  console.log(`Runs per combo per preset: ${RUNS_PER_COMBO}`);
  console.log(`Total simulations: ${combos.length * Object.keys(ENEMY_PRESETS).length * RUNS_PER_COMBO}`);
  console.log('============================================================\n');

  const allResults = {};
  const presetKeys = Object.keys(ENEMY_PRESETS);
  const totalWork = combos.length * presetKeys.length;
  let done = 0;
  const startTime = Date.now();

  for (const combo of combos) {
    const comboKey = combo.join('+');
    allResults[comboKey] = {};

    for (const presetKey of presetKeys) {
      const preset = ENEMY_PRESETS[presetKey];
      let wins = 0;
      let totalTurns = 0;
      let totalRemainingHPPct = 0;

      for (let r = 0; r < RUNS_PER_COMBO; r++) {
        const result = simulateBattle(combo, preset.enemies);
        if (result.win) {
          wins++;
          totalRemainingHPPct += result.remainingHP.pct;
        }
        totalTurns += result.turns;
      }

      allResults[comboKey][presetKey] = {
        winRate: wins / RUNS_PER_COMBO,
        avgTurns: totalTurns / RUNS_PER_COMBO,
        avgRemainingHPPct: wins > 0 ? totalRemainingHPPct / wins : 0,
        wins,
        total: RUNS_PER_COMBO,
      };

      done++;
      if (done % 50 === 0 || done === totalWork) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = done / elapsed;
        const eta = (totalWork - done) / rate;
        process.stdout.write(`\r  Progress: ${done}/${totalWork} (${(done/totalWork*100).toFixed(1)}%) | ${elapsed.toFixed(1)}s elapsed | ETA: ${eta.toFixed(0)}s   `);
      }
    }
  }

  console.log('\n');

  // ============================================================
  // ANALYSIS
  // ============================================================

  // Per-combo aggregated win rate across all presets
  const comboSummaries = [];
  for (const comboKey of Object.keys(allResults)) {
    const presetResults = allResults[comboKey];
    let totalWinRate = 0;
    let totalTurns = 0;
    let totalHPPct = 0;
    let presetCount = 0;
    const perPreset = {};

    for (const pk of presetKeys) {
      const r = presetResults[pk];
      perPreset[pk] = r;
      totalWinRate += r.winRate;
      totalTurns += r.avgTurns;
      totalHPPct += r.avgRemainingHPPct;
      presetCount++;
    }

    comboSummaries.push({
      combo: comboKey,
      frames: comboKey.split('+'),
      avgWinRate: totalWinRate / presetCount,
      avgTurns: totalTurns / presetCount,
      avgHPPct: totalHPPct / presetCount,
      perPreset,
    });
  }

  comboSummaries.sort((a, b) => b.avgWinRate - a.avgWinRate);

  // ---- TOP 15 COMBOS ----
  console.log('============================================================');
  console.log('TOP 15 FRAME COMBINATIONS (by average win rate)');
  console.log('============================================================');
  for (let i = 0; i < Math.min(15, comboSummaries.length); i++) {
    const s = comboSummaries[i];
    const names = s.frames.map(f => FRAMES[f].name).join(' / ');
    console.log(`  #${i+1} [${s.combo}] ${names}`);
    console.log(`      Avg Win: ${(s.avgWinRate*100).toFixed(1)}% | Avg Turns: ${s.avgTurns.toFixed(1)} | Avg HP%: ${(s.avgHPPct*100).toFixed(1)}%`);
    for (const pk of presetKeys) {
      const r = s.perPreset[pk];
      console.log(`        ${ENEMY_PRESETS[pk].label}: ${(r.winRate*100).toFixed(0)}% (${r.wins}/${r.total})`);
    }
  }

  // ---- BOTTOM 15 COMBOS ----
  console.log('\n============================================================');
  console.log('BOTTOM 15 FRAME COMBINATIONS (by average win rate)');
  console.log('============================================================');
  for (let i = Math.max(0, comboSummaries.length - 15); i < comboSummaries.length; i++) {
    const s = comboSummaries[i];
    const names = s.frames.map(f => FRAMES[f].name).join(' / ');
    console.log(`  #${i+1} [${s.combo}] ${names}`);
    console.log(`      Avg Win: ${(s.avgWinRate*100).toFixed(1)}% | Avg Turns: ${s.avgTurns.toFixed(1)} | Avg HP%: ${(s.avgHPPct*100).toFixed(1)}%`);
    for (const pk of presetKeys) {
      const r = s.perPreset[pk];
      console.log(`        ${ENEMY_PRESETS[pk].label}: ${(r.winRate*100).toFixed(0)}% (${r.wins}/${r.total})`);
    }
  }

  // ---- FRAME FREQUENCY IN TOP/BOTTOM ----
  console.log('\n============================================================');
  console.log('FRAME FREQUENCY ANALYSIS');
  console.log('============================================================');

  const topN = Math.min(30, Math.floor(comboSummaries.length * 0.15));
  const botN = Math.min(30, Math.floor(comboSummaries.length * 0.15));

  const topFreq = {};
  const botFreq = {};
  frameKeys.forEach(k => { topFreq[k] = 0; botFreq[k] = 0; });

  for (let i = 0; i < topN; i++) {
    comboSummaries[i].frames.forEach(f => topFreq[f]++);
  }
  for (let i = comboSummaries.length - botN; i < comboSummaries.length; i++) {
    comboSummaries[i].frames.forEach(f => botFreq[f]++);
  }

  console.log(`\n  Frame appearances in TOP ${topN} vs BOTTOM ${botN} combos:`);
  console.log('  ' + '-'.repeat(60));
  console.log(`  ${'Frame'.padEnd(20)} ${'Top'.padEnd(8)} ${'Bottom'.padEnd(8)} ${'Delta'.padEnd(8)}`);
  console.log('  ' + '-'.repeat(60));

  const frameAnalysis = frameKeys.map(k => ({
    key: k,
    name: FRAMES[k].name,
    top: topFreq[k],
    bot: botFreq[k],
    delta: topFreq[k] - botFreq[k],
  })).sort((a, b) => b.delta - a.delta);

  for (const fa of frameAnalysis) {
    console.log(`  ${(fa.name + ' (' + fa.key + ')').padEnd(20)} ${String(fa.top).padEnd(8)} ${String(fa.bot).padEnd(8)} ${(fa.delta >= 0 ? '+' : '') + fa.delta}`);
  }

  // ---- FRAMES NEVER IN WINNING COMBOS ----
  console.log('\n============================================================');
  console.log('FRAMES THAT NEVER APPEAR IN 100%-WINRATE COMBOS');
  console.log('============================================================');

  const perfectCombos = comboSummaries.filter(s => {
    return presetKeys.every(pk => s.perPreset[pk].winRate === 1.0);
  });

  const appearsInPerfect = new Set();
  perfectCombos.forEach(s => s.frames.forEach(f => appearsInPerfect.add(f)));

  const neverPerfect = frameKeys.filter(k => !appearsInPerfect.has(k));
  if (neverPerfect.length === 0) {
    console.log('  All frames appear in at least one 100%-win combo.');
  } else {
    neverPerfect.forEach(k => {
      console.log(`  - ${FRAMES[k].name} (${k})`);
    });
  }
  console.log(`  (${perfectCombos.length} combos have 100% win rate across all presets)`);

  // ---- BALANCE OUTLIERS ----
  console.log('\n============================================================');
  console.log('BALANCE OUTLIERS');
  console.log('============================================================');

  // 100% win rate combos per preset
  for (const pk of presetKeys) {
    const perfect = comboSummaries.filter(s => s.perPreset[pk].winRate === 1.0);
    const zeroes = comboSummaries.filter(s => s.perPreset[pk].winRate === 0);
    console.log(`\n  ${ENEMY_PRESETS[pk].label}:`);
    console.log(`    100% WR: ${perfect.length} combos, 0% WR: ${zeroes.length} combos`);
  }

  // ---- BROKEN COMBOS (100% WR AND <3 avg turns) ----
  console.log('\n============================================================');
  console.log('BROKEN COMBOS (100% WR in any preset AND avg <3 turns)');
  console.log('============================================================');

  let brokenCount = 0;
  for (const s of comboSummaries) {
    for (const pk of presetKeys) {
      const r = s.perPreset[pk];
      if (r.winRate === 1.0 && r.avgTurns < 3) {
        const names = s.frames.map(f => FRAMES[f].name).join(' / ');
        console.log(`  [${s.combo}] ${names} vs ${ENEMY_PRESETS[pk].label}: 100% WR, ${r.avgTurns.toFixed(1)} turns avg`);
        brokenCount++;
      }
    }
  }
  if (brokenCount === 0) {
    console.log('  No broken combos found.');
  }

  // ---- PER-FRAME OVERALL WIN RATE ----
  console.log('\n============================================================');
  console.log('PER-FRAME AVERAGE WIN RATE (across all combos containing it)');
  console.log('============================================================');

  const frameWinRates = {};
  frameKeys.forEach(k => { frameWinRates[k] = { totalWR: 0, count: 0 }; });

  for (const s of comboSummaries) {
    s.frames.forEach(f => {
      if (!frameWinRates[f]) return;
      frameWinRates[f].totalWR += s.avgWinRate;
      frameWinRates[f].count++;
    });
  }

  const frameRanking = frameKeys.map(k => ({
    key: k, name: FRAMES[k].name,
    avgWR: frameWinRates[k].count > 0 ? frameWinRates[k].totalWR / frameWinRates[k].count : 0,
    combos: frameWinRates[k].count,
  })).sort((a, b) => b.avgWR - a.avgWR);

  for (const fr of frameRanking) {
    const bar = '#'.repeat(Math.round(fr.avgWR * 30));
    console.log(`  ${(fr.name + ' (' + fr.key + ')').padEnd(28)} ${(fr.avgWR * 100).toFixed(1).padStart(5)}% ${bar}  (${fr.combos} combos)`);
  }

  // ---- SAVE FULL RESULTS ----
  const output = {
    meta: {
      date: new Date().toISOString(),
      runsPerCombo: RUNS_PER_COMBO,
      maxTurns: MAX_TURNS,
      totalCombos: combos.length,
      enemyPresets: Object.fromEntries(presetKeys.map(pk => [pk, ENEMY_PRESETS[pk].label])),
      framePresets: FRAME_PRESETS,
    },
    comboRankings: comboSummaries.map(s => ({
      combo: s.combo,
      frames: s.frames,
      frameNames: s.frames.map(f => FRAMES[f].name),
      avgWinRate: s.avgWinRate,
      avgTurns: s.avgTurns,
      avgHPPct: s.avgHPPct,
      perPreset: s.perPreset,
    })),
    frameRankings: frameRanking,
    frameAnalysis,
    brokenCombos: comboSummaries.flatMap(s =>
      presetKeys.filter(pk => s.perPreset[pk].winRate === 1.0 && s.perPreset[pk].avgTurns < 3)
        .map(pk => ({ combo: s.combo, preset: pk, avgTurns: s.perPreset[pk].avgTurns }))
    ),
  };

  const fs = require('fs');
  const outPath = require('path').join(__dirname, 'simulation-results.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n============================================================`);
  console.log(`Full results saved to: ${outPath}`);
  console.log(`============================================================`);
}

main();
