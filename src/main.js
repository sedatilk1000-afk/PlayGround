import { CASES, SENTENCE_META } from './cases.js';
import { CourtroomScene, drawPortrait } from './scene.js';
import { CourtAudio } from './audio.js';

/* ------------------------------------------------------------------
   Pixel evidence icons (12x12 maps -> crisp SVG rectangles)
------------------------------------------------------------------ */
const PALETTE = {
  '#': '#3a2b1b',
  '+': '#b49155',
  r: '#8c352c',
  b: '#4d6470',
  g: '#4d6a58',
  w: '#f7efdb',
  f: '#b86632',
  o: '#cf9d4e',
};

const ICONS = {
  receipt: [
    '............',
    '.##########.',
    '.#++++++++#.',
    '.#+......+#.',
    '.#+######+#.',
    '.#+......+#.',
    '.#+######+#.',
    '.#+......+#.',
    '.#+++++####.',
    '.##########.',
    '............',
    '............',
  ],
  ledger: [
    '............',
    '.##########.',
    '.#++++++++#.',
    '.#+......+#.',
    '.#+.####.+#.',
    '.#+......+#.',
    '.#+.####.+#.',
    '.#+......+#.',
    '.#++++++++#.',
    '.##########.',
    '....rr......',
    '............',
  ],
  photo: [
    '............',
    '.##########.',
    '.#++++++++#.',
    '.#+bbbbbb+#.',
    '.#+b####b+#.',
    '.#+b#ww#b+#.',
    '.#+b####b+#.',
    '.#+bbbbbb+#.',
    '.#++++++++#.',
    '.##########.',
    '............',
    '............',
  ],
  spray: [
    '............',
    '.....###..r.',
    '.....#+#....',
    '....#####...',
    '...######...',
    '...#rrrr#...',
    '...#rrrr#...',
    '...#rrrr#...',
    '...######...',
    '....####....',
    '............',
    '............',
  ],
  fire: [
    '............',
    '......f.....',
    '.....fff....',
    '....ffff....',
    '...ffffff...',
    '..fffffff...',
    '..ffff.ff...',
    '.fff....ff..',
    '.ff......ff.',
    'ff........f.',
    '............',
    '............',
  ],
  key: [
    '............',
    '...####.....',
    '..#++++#....',
    '..#+..+#....',
    '..#++++#....',
    '...####.....',
    '....##......',
    '....##......',
    '....##......',
    '...####.....',
    '..##..##....',
    '............',
  ],
  vial: [
    '............',
    '....####....',
    '....#gg#....',
    '....#gg#....',
    '....#gg#....',
    '...######...',
    '...#gggg#...',
    '...#gggg#...',
    '...#gggg#...',
    '...######...',
    '............',
    '............',
  ],
  plates: [
    '............',
    '.##########.',
    '.#++++++++#.',
    '.#+######+#.',
    '.#+######+#.',
    '.#++++++++#.',
    '.#+######+#.',
    '.#+######+#.',
    '.#++++++++#.',
    '.##########.',
    '............',
    '............',
  ],
  baseball: [
    '............',
    '....####....',
    '..########..',
    '.##########.',
    '.##rrrrrr##.',
    '##rr####rr##',
    '##r######r##',
    '##rr####rr##',
    '.##rrrrrr##.',
    '..########..',
    '....####....',
    '............',
  ],
  envelope: [
    '............',
    '............',
    '.##########.',
    '.#++++++++#.',
    '.#++####++#.',
    '.#+#++++#+#.',
    '.#++++++++#.',
    '.#+#++++#+#.',
    '.#++++++++#.',
    '.##########.',
    '............',
    '............',
  ],
};

function iconSvg(name) {
  const rows = ICONS[name] || ICONS.receipt;
  let out = '';
  rows.forEach((row, y) => {
    let runStart = -1;
    let runColor = null;
    const flush = (endX) => {
      if (runStart >= 0 && runColor) {
        out += `<rect x="${runStart}" y="${y}" width="${endX - runStart}" height="1" fill="${runColor}"/>`;
      }
    };
    [...row].forEach((ch, x) => {
      const color = PALETTE[ch] || null;
      if (color !== runColor) {
        flush(x);
        runStart = color ? x : -1;
        runColor = color;
      }
    });
    flush(row.length);
  });
  return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">${out}</svg>`;
}

/* ------------------------------------------------------------------
   Shortcuts / DOM
------------------------------------------------------------------ */
const $ = (sel) => document.querySelector(sel);
const el = {
  intro: $('#intro'),
  startBtn: $('#startBtn'),
  bestLine: $('#bestLine'),
  gameover: $('#gameover'),
  againBtn: $('#againBtn'),
  finalRank: $('#finalRank'),
  finalBlurb: $('#finalBlurb'),
  finalSeal: $('#finalSeal'),
  finalJustice: $('#finalJustice'),
  finalReputation: $('#finalReputation'),
  finalFair: $('#finalFair'),
  finalCorrect: $('#finalCorrect'),
  finalBest: $('#finalBest'),

  justiceFill: $('#justiceFill'),
  justiceVal: $('#justiceVal'),
  reputationFill: $('#reputationFill'),
  reputationVal: $('#reputationVal'),
  caseCounter: $('#caseCounter'),
  soundBtn: $('#soundBtn'),

  scene: $('#scene'),
  portrait: $('#portrait'),
  docketNo: $('#docketNo'),
  sceneStatus: $('#sceneStatus'),
  stamp: $('#stamp'),
  stampText: $('#stampText'),
  stampSentence: $('#stampSentence'),
  sceneToast: $('#sceneToast'),

  trackItems: $('#trackItems'),
  trackProgress: $('#trackProgress'),
  recordList: $('#recordList'),
  recordCount: $('#recordCount'),
  caseNo: $('#caseNo'),
  caseStampNo: $('#caseStampNo'),
  caseTitle: $('#caseTitle'),
  caseCharge: $('#caseCharge'),
  casePlea: $('#casePlea'),
  defName: $('#defName'),
  defMeta: $('#defMeta'),
  caseSummary: $('#caseSummary'),
  caseClaim: $('#caseClaim'),
  witnessName: $('#witnessName'),
  witnessRole: $('#witnessRole'),
  witnessStatement: $('#witnessStatement'),
  evidenceCard: $('#evidenceCard'),
  exhibitNo: $('#exhibitNo'),
  evidenceIcon: $('#evidenceIcon'),
  evidenceTitle: $('#evidenceTitle'),
  evidenceSub: $('#evidenceSub'),
  evidenceDetail: $('#evidenceDetail'),

  docketScroll: $('#docketScroll'),
  actionDock: $('#actionDock'),
  sentenceRow: $('#sentenceRow'),
  sentenceBtns: [...document.querySelectorAll('.sentence-btn')],
  guiltyBtn: $('#guiltyBtn'),
  innocentBtn: $('#innocentBtn'),
  verdictHint: $('#verdictHint'),
  confirmBtn: $('#confirmBtn'),

  resultPanel: $('#resultPanel'),
  resultTag: $('#resultTag'),
  resultCase: $('#resultCase'),
  resultTitle: $('#resultTitle'),
  resultExplanation: $('#resultExplanation'),
  sentenceNote: $('#sentenceNote'),
  deltaRow: $('#deltaRow'),
  nextBtn: $('#nextBtn'),

  modal: $('#evidenceModal'),
  modalClose: $('#modalClose'),
  modalReturn: $('#modalReturn'),
  modalExhibit: $('#modalExhibit'),
  modalTitle: $('#modalTitle'),
  modalSub: $('#modalSub'),
  modalIcon: $('#modalIcon'),
  modalDetail: $('#modalDetail'),
};

const scene = new CourtroomScene(el.scene);
scene.start();
const audio = new CourtAudio();

const RECORD_KEY = 'justiceChamberRecord.v1';
const SOUND_KEY = 'justiceChamberSound';
const START = { justice: 40, reputation: 70 };

const state = {
  index: 0,
  justice: START.justice,
  reputation: START.reputation,
  fairRulings: 0,
  correctVerdicts: 0,
  fairStreak: 0,
  results: [],
  history: [],
  verdict: null,
  sentence: null,
  locked: false,
  ended: false,
  started: false,
  removed: false,
  runId: 0,
};

let toastTimer = null;
let lastFocus = null;
let resultTimers = [];

/* ------------------------------------------------------------------
   Boot
------------------------------------------------------------------ */
function boot() {
  document.body.classList.add('overlay-open');
  buildTrack();
  updateHUD(false);
  updateTrack();
  const saved = loadRecord();
  if (saved) {
    el.bestLine.hidden = false;
    el.bestLine.textContent = `Best on record: ${saved.rank} · Justice ${saved.justice} · Reputation ${saved.reputation} · ${saved.fair} fair rulings`;
  }
  const soundPref = localStorage.getItem(SOUND_KEY);
  const soundOn = soundPref !== 'off';
  audio.enabled = soundOn;
  el.soundBtn.setAttribute('aria-pressed', String(soundOn));

  el.startBtn.addEventListener('click', startGame);
  el.againBtn.addEventListener('click', startGame);
  el.soundBtn.addEventListener('click', toggleSound);
  el.guiltyBtn.addEventListener('click', () => chooseVerdict('guilty'));
  el.innocentBtn.addEventListener('click', () => chooseVerdict('innocent'));
  el.sentenceBtns.forEach((btn) =>
    btn.addEventListener('click', () => chooseSentence(btn.dataset.sentence))
  );
  el.confirmBtn.addEventListener('click', attemptConfirm);
  el.nextBtn.addEventListener('click', nextCase);
  el.evidenceCard.addEventListener('click', openEvidence);
  el.evidenceCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEvidence();
    }
  });
  el.modalClose.addEventListener('click', closeEvidence);
  el.modalReturn.addEventListener('click', closeEvidence);
  el.modal.addEventListener('click', (e) => {
    if (e.target === el.modal) closeEvidence();
  });
  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('beforeunload', () => {});
}

function toggleSound() {
  audio.init();
  const on = !audio.enabled;
  audio.setEnabled(on);
  el.soundBtn.setAttribute('aria-pressed', String(on));
  localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  if (on) audio.select();
}

/* ------------------------------------------------------------------
   Game flow
------------------------------------------------------------------ */
function startGame() {
  audio.init();
  audio.setEnabled(audio.enabled);
  audio.gavel();
  state.index = 0;
  state.justice = START.justice;
  state.reputation = START.reputation;
  state.fairRulings = 0;
  state.correctVerdicts = 0;
  state.fairStreak = 0;
  state.results = [];
  state.history = [];
  state.ended = false;
  state.removed = false;
  state.started = true;
  state.runId += 1;
  clearTimers();

  hideOverlay(el.intro);
  hideOverlay(el.gameover);
  document.body.classList.remove('overlay-open');
  updateHUD(false);
  updateTrack();
  renderRecord();
  loadCase(0);
  setTimeout(() => showToast(`Case 01 · ${CASES[0].title}`, 2800), 500);
}

function loadCase(index) {
  const c = CASES[index];
  state.index = index;
  state.verdict = null;
  state.sentence = null;
  state.locked = false;
  state.runId += 1;

  clearTimers();
  clearStamp();
  el.resultPanel.hidden = true;
  el.actionDock.hidden = false;
  el.sentenceNote.hidden = true;
  el.sentenceNote.textContent = '';
  el.deltaRow.innerHTML = '';
  el.resultPanel.className = 'result-panel';
  el.docketScroll.scrollTop = 0;
  if (isCompactLayout()) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  el.docketNo.textContent = c.docket;
  el.caseNo.textContent = pad(index + 1);
  el.caseStampNo.textContent = pad(index + 1);
  el.caseCounter.innerHTML = `${pad(index + 1)}<i>/${pad(CASES.length)}</i>`;
  el.caseTitle.textContent = c.title;
  el.caseCharge.textContent = c.charge;
  el.casePlea.textContent = 'Plea · Not guilty';
  el.defName.textContent = c.defendant.name;
  el.defMeta.textContent = `${c.defendant.age} · ${c.defendant.occupation}`;
  el.caseSummary.textContent = c.summary;
  el.caseClaim.textContent = c.claim;
  el.witnessName.textContent = c.witness.name;
  el.witnessRole.textContent = c.witness.role;
  el.witnessStatement.textContent = c.witness.statement;
  el.exhibitNo.textContent = c.evidence.exhibit;
  el.evidenceTitle.textContent = c.evidence.title;
  el.evidenceSub.textContent = c.evidence.subtitle;
  el.evidenceDetail.textContent = c.evidence.detail;
  el.evidenceIcon.innerHTML = iconSvg(c.evidence.icon);
  el.evidenceCard.setAttribute('aria-label', `Inspect exhibit ${c.evidence.exhibit}: ${c.evidence.title}`);

  drawPortrait(el.portrait, c.defendant.look);
  scene.setCase(c);
  scene.resetGavel();
  el.sceneStatus.innerHTML = '<i class="caption-dot"></i> Defendant at the stand';

  resetControls();
  updateTrack();
  updateNextLabel();
}

function chooseVerdict(verdict) {
  if (state.locked || state.ended || !state.started) return;
  if (state.verdict === verdict) return;
  state.verdict = verdict;
  if (verdict === 'innocent') state.sentence = null;
  audio.select();
  updateControls();
}

function chooseSentence(sentence) {
  if (state.locked || state.ended) return;
  if (state.verdict !== 'guilty') {
    warn('Choose a guilty verdict before setting a sentence.');
    return;
  }
  if (!SENTENCE_META[sentence]) return;
  state.sentence = sentence;
  audio.select();
  updateControls();
}

function resetControls() {
  el.guiltyBtn.disabled = false;
  el.innocentBtn.disabled = false;
  el.guiltyBtn.setAttribute('aria-pressed', 'false');
  el.innocentBtn.setAttribute('aria-pressed', 'false');
  el.sentenceRow.classList.remove('shake');
  el.sentenceRow.classList.add('sentence-hidden');
  el.sentenceBtns.forEach((btn) => {
    btn.classList.remove('active', 'shake');
    btn.disabled = true;
    btn.setAttribute('aria-pressed', 'false');
  });
  el.confirmBtn.disabled = true;
  el.verdictHint.className = 'verdict-hint';
  el.verdictHint.textContent = 'Weigh the testimony, then choose a verdict.';
  el.actionDock.hidden = false;
  el.resultPanel.hidden = true;
}

function updateControls() {
  const guilty = state.verdict === 'guilty';
  el.guiltyBtn.setAttribute('aria-pressed', String(guilty));
  el.innocentBtn.setAttribute('aria-pressed', String(state.verdict === 'innocent'));
  el.sentenceRow.classList.toggle('sentence-hidden', !guilty);
  el.sentenceBtns.forEach((btn) => {
    const active = state.sentence === btn.dataset.sentence;
    btn.disabled = !guilty || state.locked;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  let hint = 'Weigh the testimony, then choose a verdict.';
  if (guilty && !state.sentence) hint = 'Guilty. Now set a sentence for the accused.';
  else if (guilty && state.sentence) hint = `Guilty · ${SENTENCE_META[state.sentence].label}. Ready to rule.`;
  else if (state.verdict === 'innocent') hint = 'Not guilty — the accused walks free. Ready to rule.';

  el.verdictHint.className = 'verdict-hint';
  el.verdictHint.textContent = hint;
  el.confirmBtn.disabled = state.locked || !state.verdict || (guilty && !state.sentence);
}

function attemptConfirm() {
  if (state.locked || state.ended) return;
  if (!state.verdict) {
    warn('First, choose a verdict: Guilty or Not Guilty.');
    return;
  }
  if (state.verdict === 'guilty' && !state.sentence) {
    warn('A guilty verdict requires a sentence. Choose Fine, 1 Year, or 10 Years.');
    el.sentenceRow.classList.remove('shake');
    void el.sentenceRow.offsetWidth;
    el.sentenceRow.classList.add('shake');
    el.sentenceBtns.forEach((b) => {
      b.classList.remove('shake');
      void b.offsetWidth;
      b.classList.add('shake');
    });
    return;
  }
  deliverVerdict();
}

function warn(message) {
  audio.deny();
  el.verdictHint.textContent = message;
  el.verdictHint.className = 'verdict-hint warn';
  clearTimeout(warn.timer);
  warn.timer = setTimeout(() => {
    el.verdictHint.className = 'verdict-hint';
    if (!state.locked) updateControls();
  }, 2600);
}

function deliverVerdict() {
  const c = CASES[state.index];
  const caseIndex = state.index;
  const runId = state.runId;
  state.locked = true;
  updateControls();
  el.confirmBtn.disabled = true;
  el.guiltyBtn.disabled = true;
  el.innocentBtn.disabled = true;
  el.sentenceBtns.forEach((b) => (b.disabled = true));
  el.sceneStatus.innerHTML = '<i class="caption-dot"></i> The court is ruling…';
  el.verdictHint.textContent = 'The gavel is raised…';

  const verdict = state.verdict;
  const sentence = state.sentence;
  const truth = c.truth;
  const verdictCorrect = verdict === truth;
  const sentenceCorrect = truth === 'innocent' ? true : sentence === c.sentence;

  scene.strikeGavel(verdict, () => {
    if (runId !== state.runId || state.index !== caseIndex || !state.locked) return;
    audio.gavel();
    showStamp(verdict, sentence);
    audio.stamp();
    const timer = setTimeout(() => {
      if (runId !== state.runId || state.index !== caseIndex || !state.locked) return;
      showResult({ verdict, sentence, verdictCorrect, sentenceCorrect, caseData: c });
    }, 700);
    resultTimers.push(timer);
  });
}

function showStamp(verdict, sentence) {
  el.stamp.classList.remove('guilty', 'innocent', 'show');
  el.stamp.classList.add(verdict);
  el.stampText.textContent = verdict === 'guilty' ? 'Guilty' : 'Not Guilty';
  el.stampSentence.textContent =
    verdict === 'guilty' && sentence ? `Sentence · ${SENTENCE_META[sentence].label}` : 'Acquitted of all charges';
  void el.stamp.offsetWidth;
  el.stamp.classList.add('show');
}

function clearStamp() {
  el.stamp.classList.remove('show', 'guilty', 'innocent');
}

function isCompactLayout() {
  return window.matchMedia('(max-width: 980px)').matches;
}

function revealResult() {
  if (!isCompactLayout()) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => {
    el.resultPanel.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  });
}

function showResult({ verdict, sentence, verdictCorrect, sentenceCorrect, caseData }) {
  const c = caseData || CASES[state.index];
  const fair = verdictCorrect && sentenceCorrect;
  let category;
  let tag;
  let sentenceNote = '';
  let justiceGain;
  let reputationGain;

  if (fair) {
    category = 'fair';
    tag = 'Fair ruling';
    state.fairStreak += 1;
    justiceGain = 5 + Math.min(state.fairStreak - 1, 2);
    reputationGain = 4;
    state.fairRulings += 1;
  } else if (verdictCorrect) {
    category = 'partial';
    tag = 'Just verdict · unjust sentence';
    state.fairStreak = 0;
    justiceGain = 2;
    reputationGain = -3;
    const order = { fine: 0, year1: 1, year10: 2 };
    const tooHarsh = order[sentence] > order[c.sentence];
    const properSentence = { fine: 'a fine', year1: 'one year', year10: 'ten years' }[c.sentence];
    sentenceNote = tooHarsh
      ? `The verdict was right, but the sentence was heavier than the guidelines allow. Justice is not served by excess. The court record calls for ${properSentence}.`
      : `The verdict was right, but the sentence was too lenient for the harm done. The court record calls for ${properSentence}.`;
  } else {
    category = 'wrong';
    tag = c.truth === 'guilty' ? 'Wrongful acquittal' : 'Wrongful conviction';
    state.fairStreak = 0;
    justiceGain = -4;
    reputationGain = -12;
  }
  if (verdictCorrect) state.correctVerdicts += 1;

  const beforeJ = state.justice;
  const beforeR = state.reputation;
  state.justice = clamp(state.justice + justiceGain, 0, 100);
  state.reputation = clamp(state.reputation + reputationGain, 0, 100);
  const appliedJ = state.justice - beforeJ;
  const appliedR = state.reputation - beforeR;

  state.results[state.index] = category;
  state.history.push({ title: c.title, verdict, sentence, category });
  updateHUD(true, appliedJ, appliedR);
  updateTrack();
  renderRecord();
  updateNextLabel();

  el.resultTag.textContent = tag;
  el.resultCase.textContent = `Case ${pad(state.index + 1)}`;
  const verdictLabel = verdict === 'guilty' ? 'Guilty' : 'Not Guilty';
  const sentenceLabel = verdict === 'guilty' && sentence ? ` · ${SENTENCE_META[sentence].label}` : '';
  el.resultTitle.textContent = `${verdictLabel}${sentenceLabel}`;
  el.resultExplanation.textContent = c.explanation;

  if (sentenceNote) {
    el.sentenceNote.hidden = false;
    el.sentenceNote.textContent = sentenceNote;
  } else {
    el.sentenceNote.hidden = true;
  }

  el.deltaRow.innerHTML = '';
  addDelta(appliedJ, 'justice');
  addDelta(appliedR, 'reputation');
  if (category === 'fair' && state.fairStreak > 1) {
    addDeltaText(`Fair streak ×${state.fairStreak}`, 'neutral');
  }
  if (category === 'wrong') {
    addDeltaText(c.truth === 'guilty' ? 'Guilty party set free' : 'Innocent party convicted', 'down');
  }
  if (category === 'partial') {
    addDeltaText('Sentence out of guidelines', 'neutral');
  }
  if (state.reputation <= 0) {
    addDeltaText('Reputation collapsed', 'down');
  }

  el.resultPanel.className = `result-panel ${category === 'fair' ? 'good' : category === 'wrong' ? 'bad' : 'partial'}`;
  el.resultPanel.hidden = false;
  el.actionDock.hidden = true;
  revealResult();

  el.sceneStatus.innerHTML = `<i class="caption-dot"></i> ${verdictLabel}${sentenceLabel} · case closed`;
  showToast('Case closed · the record is sealed', 2400);
  if (category === 'fair') audio.correct();
  else audio.wrong();
}

function addDelta(amount, type) {
  if (amount === 0) {
    addDeltaText(`${type} unchanged`, 'neutral');
    return;
  }
  const label = `${amount > 0 ? '+' : '−'}${Math.abs(amount)} ${type}`;
  addDeltaText(label, amount > 0 ? 'up' : 'down');
}

function addDeltaText(text, kind) {
  const span = document.createElement('span');
  span.className = `delta ${kind}`;
  span.textContent = text;
  el.deltaRow.appendChild(span);
}

function nextCase() {
  if (!state.locked) return;
  audio.click();
  if (state.reputation <= 0) {
    state.removed = true;
    endGame();
    return;
  }
  if (state.index >= CASES.length - 1) {
    endGame();
    return;
  }
  const next = state.index + 1;
  loadCase(next);
  showToast(`Case ${pad(next + 1)} · ${CASES[next].title}`, 2800);
}

function updateNextLabel() {
  if (state.reputation <= 0) {
    el.nextBtn.querySelector('span').textContent = 'Face the inquiry';
  } else if (state.index >= CASES.length - 1) {
    el.nextBtn.querySelector('span').textContent = 'Seal the record';
  } else {
    el.nextBtn.querySelector('span').textContent = 'Next case';
  }
}

/* ------------------------------------------------------------------
   HUD, track, final judgment
------------------------------------------------------------------ */
function updateHUD(animate, justiceDelta = 0, reputationDelta = 0) {
  el.justiceVal.textContent = Math.round(state.justice);
  el.reputationVal.textContent = Math.round(state.reputation);
  el.justiceFill.style.width = `${state.justice}%`;
  el.reputationFill.style.width = `${state.reputation}%`;
  if (animate) {
    bump(el.justiceVal, justiceDelta >= 0 ? 'up' : 'down');
    bump(el.reputationVal, reputationDelta >= 0 ? 'up' : 'down');
  }
}

function bump(node, direction) {
  node.classList.remove('bump-up', 'bump-down');
  void node.offsetWidth;
  node.classList.add(direction === 'up' ? 'bump-up' : 'bump-down');
  setTimeout(() => node.classList.remove('bump-up', 'bump-down'), 600);
}

function buildTrack() {
  el.trackItems.innerHTML = '';
  CASES.forEach((c, i) => {
    const item = document.createElement('span');
    item.className = 'track-item';
    item.textContent = pad(i + 1);
    item.title = `Case ${pad(i + 1)} · ${c.title}`;
    item.setAttribute('aria-label', `Case ${i + 1}: ${c.title}`);
    el.trackItems.appendChild(item);
  });
}

function updateTrack() {
  const items = [...el.trackItems.children];
  let done = 0;
  items.forEach((item, i) => {
    item.classList.remove('current', 'done-fair', 'done-wrong', 'done-partial');
    const result = state.results[i];
    item.textContent = pad(i + 1);
    if (result === 'fair') {
      item.classList.add('done-fair');
      done++;
    } else if (result === 'partial') {
      item.classList.add('done-partial');
      done++;
    } else if (result === 'wrong') {
      item.classList.add('done-wrong');
      done++;
    } else if (i === state.index && state.started) {
      item.classList.add('current');
    }
    const c = CASES[i];
    const label = result === 'fair' ? 'fair ruling' : result === 'partial' ? 'unjust sentence' : result === 'wrong' ? 'wrong ruling' : 'not yet heard';
    item.title = `Case ${pad(i + 1)} · ${c.title} · ${label}`;
  });
  el.trackProgress.textContent = `${done} / ${CASES.length} ruled`;
}

function renderRecord() {
  if (!state.history.length) {
    el.recordList.innerHTML = '<p class="record-empty">The docket awaits its first judgment.</p>';
    el.recordCount.textContent = 'No rulings yet';
    return;
  }
  el.recordCount.textContent = `${state.history.length} of ${CASES.length} ruled`;
  el.recordList.innerHTML = '';
  const recent = [...state.history].reverse().slice(0, 3);
  recent.forEach((entry, i) => {
    const index = state.history.length - 1 - i;
    const row = document.createElement('article');
    row.className = `record-entry ${entry.category}`;
    const verdictLabel =
      entry.verdict === 'guilty'
        ? `Guilty · ${SENTENCE_META[entry.sentence]?.short || '—'}`
        : 'Not guilty';
    const statusLabel = entry.category === 'fair' ? 'Fair' : entry.category === 'partial' ? 'Sentence' : 'Wrong';
    row.innerHTML = `
      <span class="record-no">${pad(index + 1)}</span>
      <span class="record-body"><strong></strong><span>${verdictLabel}</span></span>
      <b class="record-verdict">${statusLabel}</b>`;
    row.querySelector('strong').textContent = entry.title;
    el.recordList.appendChild(row);
  });
}

function endGame() {
  state.ended = true;
  state.locked = false;
  const removed = state.reputation <= 0;
  const rank = getRank(removed);
  el.finalRank.textContent = rank.title;
  el.finalBlurb.textContent = rank.blurb;
  el.finalSeal.style.color = rank.color;
  el.finalJustice.textContent = Math.round(state.justice);
  el.finalReputation.textContent = Math.round(state.reputation);
  el.finalFair.innerHTML = `${state.fairRulings}<small>/${CASES.length}</small>`;
  el.finalCorrect.innerHTML = `${state.correctVerdicts}<small>/${CASES.length}</small>`;

  let bestText = '';
  if (!removed) {
    const saved = loadRecord();
    const score = recordScore();
    if (!saved || score > saved.score) {
      const record = {
        score,
        rank: rank.title,
        justice: Math.round(state.justice),
        reputation: Math.round(state.reputation),
        fair: state.fairRulings,
        correct: state.correctVerdicts,
      };
      saveRecord(record);
      bestText = '✦ A new record for this court.';
    } else {
      bestText = `Best on record: ${saved.rank} · Justice ${saved.justice} · Reputation ${saved.reputation}`;
    }
  }
  el.finalBest.textContent = bestText;
  el.gameover.hidden = false;
  document.body.classList.add('overlay-open');
  if (rank.tier >= 3) audio.fanfare();
  else audio.wrong();
}

function getRank(removed) {
  if (removed) {
    return {
      title: 'Removed from the Bench',
      blurb: 'The city has lost faith in your judgment. The governor signs the order; the gavel is taken from your hand.',
      color: '#8c3128',
      tier: 0,
    };
  }
  const fair = state.fairRulings;
  const rep = state.reputation;
  if (fair >= 9 && rep >= 80) {
    return {
      title: 'Supreme Justice',
      blurb: 'Your rulings will be studied for a century. The scales never wavered, and mercy never blinded you to the truth.',
      color: '#b08b3f',
      tier: 4,
    };
  }
  if (fair >= 7) {
    return {
      title: 'Honorable Judge',
      blurb: 'The city trusts your gavel. You weighed evidence above appetite, and mercy above haste.',
      color: '#9c743b',
      tier: 3,
    };
  }
  if (fair >= 5) {
    return {
      title: 'Circuit Judge',
      blurb: 'A steady hand, though the record shows moments of doubt. The bench endures — for now.',
      color: '#7e6a4a',
      tier: 2,
    };
  }
  if (fair >= 3) {
    return {
      title: 'Magistrate',
      blurb: 'You kept order, but not always justice. The docket remembers every hurried ruling.',
      color: '#6e5a3e',
      tier: 1,
    };
  }
  return {
    title: 'Disgraced Jurist',
    blurb: 'The gavel fell on the innocent and spared the guilty. The city has lost faith in your court.',
    color: '#8c3128',
    tier: 0,
  };
}

function recordScore() {
  return Math.round(state.justice + state.reputation + state.fairRulings * 5);
}

function loadRecord() {
  try {
    const raw = localStorage.getItem(RECORD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveRecord(record) {
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify(record));
  } catch {
    /* storage may be unavailable */
  }
}

/* ------------------------------------------------------------------
   Evidence inspector
------------------------------------------------------------------ */
function openEvidence() {
  if (!state.started) return;
  const c = CASES[state.index];
  lastFocus = document.activeElement;
  el.modalExhibit.textContent = c.evidence.exhibit;
  el.modalTitle.textContent = c.evidence.title;
  el.modalSub.textContent = c.evidence.subtitle;
  el.modalDetail.textContent = c.evidence.detail;
  el.modalIcon.innerHTML = iconSvg(c.evidence.icon);
  el.modal.hidden = false;
  document.body.classList.add('overlay-open');
  audio.click();
  setTimeout(() => el.modalClose.focus(), 30);
}

function closeEvidence() {
  if (el.modal.hidden) return;
  el.modal.hidden = true;
  if (el.gameover.hidden && el.intro.hidden) document.body.classList.remove('overlay-open');
  audio.click();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* ------------------------------------------------------------------
   Toast + helpers
------------------------------------------------------------------ */
function showToast(text, duration = 2400) {
  clearTimeout(toastTimer);
  el.sceneToast.textContent = text;
  el.sceneToast.classList.remove('show');
  void el.sceneToast.offsetWidth;
  el.sceneToast.classList.add('show');
  toastTimer = setTimeout(() => el.sceneToast.classList.remove('show'), duration);
}

function hideOverlay(overlay) {
  if (overlay.hidden) return;
  overlay.classList.add('leaving');
  setTimeout(() => {
    overlay.hidden = true;
    overlay.classList.remove('leaving');
  }, 460);
}

function clearTimers() {
  resultTimers.forEach((t) => clearTimeout(t));
  resultTimers = [];
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* ------------------------------------------------------------------
   Keyboard
------------------------------------------------------------------ */
function onKeyDown(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (!el.modal.hidden) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeEvidence();
    }
    return;
  }

  if (!el.intro.hidden) {
    if (e.key === 'Enter') {
      e.preventDefault();
      startGame();
    }
    return;
  }

  if (!el.gameover.hidden) {
    if (e.key === 'Enter') {
      e.preventDefault();
      startGame();
    }
    return;
  }

  if (!state.started || state.ended) return;

  if (state.locked) {
    if (e.key === 'Enter' && !el.resultPanel.hidden) {
      e.preventDefault();
      nextCase();
    }
    return;
  }

  const key = e.key.toLowerCase();
  if (key === 'g') {
    e.preventDefault();
    chooseVerdict('guilty');
  } else if (key === 'n') {
    e.preventDefault();
    chooseVerdict('innocent');
  } else if (['1', '2', '3'].includes(e.key)) {
    e.preventDefault();
    const map = { 1: 'fine', 2: 'year1', 3: 'year10' };
    chooseSentence(map[e.key]);
  } else if (e.key === 'Enter') {
    if (!el.resultPanel.hidden) {
      e.preventDefault();
      nextCase();
    } else {
      e.preventDefault();
      attemptConfirm();
    }
  } else if (e.key === 'Escape') {
    el.guidelines.open = false;
  }
}

/* ------------------------------------------------------------------
   Start
------------------------------------------------------------------ */
boot();
