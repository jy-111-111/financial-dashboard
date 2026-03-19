/* ============================================================
   SK하이닉스 연결재무제표 대시보드 — JavaScript
   의존성: Chart.js 4.4.1 (CDN)
   ============================================================ */

'use strict';

// ============================================================
// 1. 데이터 (연결재무제표 / IFRS 기준 / 단위: 백만원)
// ============================================================
const DATA = [
  {
    year: 2016,
    // 재무상태표
    assets: 32_216_026,  liab: 8_192_496,   equity: 24_023_530,
    // 손익계산서
    rev: 17_197_975,     cogs: 10_787_139,  grossP: 6_410_836,
    sga: 3_134_090,      opInc: 3_276_746,  netInc: 2_960_483,
    // 현금흐름표
    cashFromOps: 6_486_781,  ppeAcq: 5_956_354,
    opCF: 5_548_922,         invCF: -6_230_451,
  },
  {
    year: 2017,
    assets: 45_418_464,  liab: 11_597_545,  equity: 33_820_919,
    rev: 30_109_434,     cogs: 12_701_843,  grossP: 17_407_591,
    sga: 3_686_265,      opInc: 13_721_326, netInc: 10_642_219,
    cashFromOps: 15_373_261, ppeAcq: 9_128_303,
    opCF: 14_690_614,        invCF: -11_919_162,
  },
  {
    year: 2018,
    assets: 63_658_335,  liab: 16_806_004,  equity: 46_852_331,
    rev: 40_445_066,     cogs: 15_180_838,  grossP: 25_264_228,
    sga: 4_420_478,      opInc: 20_843_750, netInc: 15_539_984,
    cashFromOps: 25_825_017, ppeAcq: 16_036_146,
    opCF: 22_227_199,        invCF: -21_428_749,
  },
  {
    year: 2019,
    assets: 64_789_494,  liab: 16_846_299,  equity: 47_943_195,
    rev: 26_990_733,     cogs: 18_818_814,  grossP: 8_171_919,
    sga: 5_452_740,      opInc: 2_719_179,  netInc: 2_009_078,
    cashFromOps: 11_822_354, ppeAcq: 13_920_244,
    opCF: 6_483_188,         invCF: -10_450_936,
  },
  {
    year: 2020,
    assets: 71_173_853,  liab: 19_264_756,  equity: 51_909_097,
    rev: 31_900_418,     cogs: 21_089_789,  grossP: 10_810_629,
    sga: 5_798_005,      opInc: 5_012_624,  netInc: 4_758_914,
    cashFromOps: 12_916_771, ppeAcq: 10_068_662,
    opCF: 12_314_571,        invCF: -11_840_393,
  },
  {
    year: 2021,
    assets: 96_386_474,  liab: 34_195_416,  equity: 62_191_058,
    rev: 42_997_792,     cogs: 24_045_600,  grossP: 18_952_192,
    sga: 6_541_852,      opInc: 12_410_340, netInc: 9_616_188,
    cashFromOps: 20_951_478, ppeAcq: 12_486_635,
    opCF: 19_797_648,        invCF: -22_392_277,
  },
  {
    year: 2022,
    assets: 103_871_512, liab: 40_580_970,  equity: 63_290_542,
    rev: 44_621_568,     cogs: 28_993_713,  grossP: 15_627_855,
    sga: 8_818_438,      opInc: 6_809_417,  netInc: 2_241_669,
    cashFromOps: 19_083_888, ppeAcq: 19_010_261,
    opCF: 14_780_517,        invCF: -17_883_746,
  },
  {
    year: 2023,
    assets: 100_330_165, liab: 46_826_413,  equity: 53_503_752,
    rev: 32_765_719,     cogs: 33_299_167,  grossP: -533_448,
    sga: 7_196_865,      opInc: -7_730_313, netInc: -9_137_547,
    cashFromOps: 6_688_866,  ppeAcq: 8_325_138,
    opCF: 4_278_191,         invCF: -7_334_727,
  },
  {
    year: 2024,
    assets: 119_855_209, liab: 45_939_505,  equity: 73_915_704,
    rev: 66_192_960,     cogs: 34_364_814,  grossP: 31_828_146,
    sga: 8_360_827,      opInc: 23_467_319, netInc: 19_796_902,
    cashFromOps: 31_250_846, ppeAcq: 15_945_534,
    opCF: 29_795_885,        invCF: -18_004_637,
  },
  {
    year: 2025,
    assets: 176_107_659, liab: 55_440_908,  equity: 120_666_751,
    rev: 97_146_675,     cogs: 38_455_885,  grossP: 58_690_790,
    sga: 11_484_471,     opInc: 47_206_319, netInc: 42_947_902,
    cashFromOps: 58_904_432, ppeAcq: 27_518_924,
    opCF: 53_373_126,        invCF: -48_054_251,
  },
];

const YEARS = DATA.map(d => d.year);

// 상태
let selectedYear = 2025;
let activeView   = 'overview';

// ============================================================
// 2. 유틸리티
// ============================================================

/** 백만원 → 조원 문자열 (소수점 1자리) */
const T   = n => (n / 1_000_000).toFixed(1);

/** 숫자 → 한국식 천단위 콤마 */
const fmt = n => n?.toLocaleString('ko-KR') ?? '-';

/** 숫자 → 퍼센트 문자열 */
const pct = n => n != null ? n.toFixed(1) + '%' : '-';

function yearData(y)     { return DATA.find(d => d.year === y); }
function prevYearData(y) { return DATA.find(d => d.year === y - 1); }

/** 전년 대비 등락률 뱃지 텍스트 */
function deltaLabel(cur, prev) {
  if (prev == null || cur == null) return '';
  const chg   = ((cur - prev) / Math.abs(prev)) * 100;
  const arrow = chg >= 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(chg).toFixed(1)}%`;
}

// ============================================================
// 3. Chart.js 기본 설정
// ============================================================
Chart.defaults.color       = '#666677';
Chart.defaults.font.family = "'DM Mono', sans-serif";
Chart.defaults.font.size   = 11;

const GRID = { color: 'rgba(255,255,255,0.05)', drawBorder: false };
const TICK = { color: '#555566', font: { size: 10 } };

/**
 * 공용 차트 옵션 팩토리
 * @param {string} yUnit - y축 단위 접미어 (예: '조', '%')
 */
function baseOpts(yUnit = '') {
  return {
    responsive:           true,
    maintainAspectRatio:  false,
    animation:            { duration: 600, easing: 'easeInOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181E',
        borderColor:     'rgba(232,0,29,0.3)',
        borderWidth:     1,
        titleColor:      '#fff',
        bodyColor:       '#aaa',
        padding:         10,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}${yUnit}`,
        },
      },
    },
    scales: {
      x: { grid: GRID, ticks: TICK, border: { display: false } },
      y: { grid: GRID, ticks: TICK, border: { display: false } },
    },
  };
}

// 차트 인스턴스 레지스트리 (재생성 전 destroy 용)
const charts = {};

/**
 * 차트 생성 헬퍼 — 동일 ID 존재 시 파괴 후 재생성
 */
function mkChart(id, config) {
  if (charts[id]) charts[id].destroy();
  const canvas = document.getElementById(id);
  if (!canvas) return;
  charts[id] = new Chart(canvas, config);
  return charts[id];
}

// ============================================================
// 4. 히어로 메트릭 카드 렌더링
// ============================================================
function renderHero(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = items.map(it => `
    <div class="metric-card ${it.hl ? 'highlight' : ''} animate-in">
      <div class="metric-label">${it.label}</div>
      <div class="metric-value ${it.cls || ''}">${it.value}</div>
      ${it.sub   ? `<div class="metric-sub">${it.sub}</div>`                       : ''}
      ${it.delta ? `<div class="metric-delta ${it.deltaDir}">${it.delta}</div>`    : ''}
    </div>
  `).join('');
}

// ============================================================
// 5. 개요 뷰 (Overview)
// ============================================================
function renderOverview(d, prev) {
  const opMargin  = d.opInc  / d.rev * 100;
  const debtRatio = d.liab   / d.equity * 100;

  renderHero('heroGrid', [
    {
      label: '매출액', value: T(d.rev) + '조', sub: '단위: 원', hl: true,
      delta: prev ? deltaLabel(d.rev, prev.rev) : '',
      deltaDir: d.rev >= (prev?.rev || 0) ? 'up' : 'down',
    },
    {
      label: '영업이익', value: T(d.opInc) + '조', sub: '단위: 원',
      cls: d.opInc >= 0 ? 'green' : 'red',
      delta: prev ? deltaLabel(d.opInc, prev.opInc) : '',
      deltaDir: d.opInc >= (prev?.opInc || 0) ? 'up' : 'down',
    },
    { label: '당기순이익', value: T(d.netInc) + '조', sub: '단위: 원', cls: d.netInc >= 0 ? '' : 'red' },
    { label: '영업이익률',  value: pct(opMargin),  cls: opMargin  >= 0 ? 'green' : 'red' },
    { label: '자산총계',    value: T(d.assets) + '조', sub: '단위: 원' },
    { label: '부채비율',    value: pct(debtRatio), cls: debtRatio > 100 ? 'amber' : '' },
  ]);

  // Spotlight 큰 숫자
  document.getElementById('sp-rev-val').textContent  = T(d.rev);
  document.getElementById('sp-rev-unit').textContent = `조원 (백만원: ${fmt(d.rev)})`;

  const opEl = document.getElementById('sp-op-val');
  opEl.textContent  = T(d.opInc);
  opEl.style.color  = d.opInc >= 0 ? '#00C46A' : '#E8001D';
  document.getElementById('sp-op-unit').textContent = `조원 / 이익률 ${pct(opMargin)}`;
}

function buildRevOpChart() {
  const opts = baseOpts('조');
  opts.scales.y.ticks.callback = v => v + '조';

  mkChart('revOpChart', {
    type: 'bar',
    data: {
      labels: YEARS,
      datasets: [
        {
          label: '매출액',
          data: DATA.map(d => +T(d.rev)),
          backgroundColor: 'rgba(232,0,29,0.7)',
          borderRadius: 3,
        },
        {
          label: '영업이익',
          data: DATA.map(d => +T(d.opInc)),
          backgroundColor: DATA.map(d => d.opInc >= 0 ? 'rgba(58,143,255,0.8)' : 'rgba(232,0,29,0.5)'),
          borderRadius: 3,
        },
      ],
    },
    options: {
      ...opts,
      plugins: {
        ...opts.plugins,
        tooltip: {
          ...opts.plugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}조원` },
        },
      },
    },
  });
}

function buildBsChart() {
  const opts = baseOpts('조');
  opts.scales.y.ticks.callback = v => v + '조';

  mkChart('bsChart', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [
        { label: '자산총계', data: DATA.map(d => +T(d.assets)), borderColor: '#3A8FFF', backgroundColor: 'rgba(58,143,255,0.05)', borderWidth: 2, pointRadius: 3, tension: 0.3, fill: true },
        { label: '자본합계', data: DATA.map(d => +T(d.equity)), borderColor: '#00C46A', backgroundColor: 'transparent',            borderWidth: 2, pointRadius: 3, tension: 0.3 },
        { label: '부채총계', data: DATA.map(d => +T(d.liab)),   borderColor: '#E8001D', backgroundColor: 'transparent',            borderWidth: 2, pointRadius: 3, tension: 0.3, borderDash: [4, 3] },
      ],
    },
    options: {
      ...opts,
      plugins: {
        ...opts.plugins,
        tooltip: { ...opts.plugins.tooltip, callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}조원` } },
      },
    },
  });
}

function buildSparklineMargin() {
  const margins = DATA.map(d => +(d.opInc / d.rev * 100).toFixed(1));

  mkChart('sparklineMargin', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [{
        data: margins,
        borderColor:          '#E8001D',
        backgroundColor:      'rgba(232,0,29,0.08)',
        borderWidth:          2,
        pointRadius:          DATA.map(d => d.year === selectedYear ? 5 : 2),
        pointBackgroundColor: DATA.map(d => d.year === selectedYear ? '#E8001D' : 'rgba(232,0,29,0.4)'),
        tension:              0.4,
        fill:                 true,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation:  { duration: 400 },
      plugins: {
        legend:  { display: false },
        tooltip: {
          backgroundColor: '#18181E', borderColor: 'rgba(232,0,29,0.3)', borderWidth: 1,
          callbacks: { label: ctx => ` 영업이익률: ${ctx.raw}%` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#444455' }, border: { display: false } },
        y: { grid: { display: false }, ticks: { callback: v => v + '%', font: { size: 9 }, color: '#444455' }, border: { display: false } },
      },
    },
  });
}

// ============================================================
// 6. 손익계산서 뷰
// ============================================================
function renderIncome(d, prev) {
  const opM    = d.opInc  / d.rev * 100;
  const grossM = d.grossP / d.rev * 100;

  renderHero('incomeHeroGrid', [
    {
      label: '매출액', value: T(d.rev) + '조', hl: true,
      delta: prev ? deltaLabel(d.rev, prev.rev) : '',
      deltaDir: d.rev >= (prev?.rev || 0) ? 'up' : 'down',
    },
    { label: '매출총이익',   value: T(d.grossP) + '조', cls: d.grossP >= 0 ? '' : 'red' },
    { label: '영업이익',     value: T(d.opInc)  + '조', cls: d.opInc  >= 0 ? 'green' : 'red' },
    { label: '당기순이익',   value: T(d.netInc) + '조', cls: d.netInc >= 0 ? '' : 'red' },
    { label: '영업이익률',   value: pct(opM),    cls: opM    >= 20 ? 'green' : opM    < 0 ? 'red' : '' },
    { label: '매출총이익률', value: pct(grossM), cls: grossM >= 0  ? ''      : 'red' },
  ]);

  // 전체 연도 테이블
  const tbl = document.getElementById('incomeTable');
  tbl.innerHTML = `
    <thead><tr>
      <th>연도</th><th>매출액</th><th>매출원가</th><th>매출총이익</th>
      <th>판관비</th><th>영업이익</th><th>당기순이익</th><th>영업이익률</th>
    </tr></thead>
    <tbody>
      ${DATA.map(r => {
        const m        = (r.opInc / r.rev * 100).toFixed(1);
        const isActive = r.year === selectedYear;
        return `<tr class="${isActive ? 'active-row' : ''}">
          <td>${r.year}</td>
          <td>${fmt(r.rev)}</td>
          <td>${fmt(r.cogs)}</td>
          <td class="${r.grossP < 0 ? 'num-red' : ''}">${fmt(r.grossP)}</td>
          <td>${fmt(r.sga)}</td>
          <td class="${r.opInc < 0 ? 'num-red' : r.opInc > 10_000_000 ? 'num-green' : ''}">${fmt(r.opInc)}</td>
          <td class="${r.netInc < 0 ? 'num-red' : ''}">${fmt(r.netInc)}</td>
          <td class="${parseFloat(m) < 0 ? 'num-red' : parseFloat(m) > 20 ? 'num-green' : ''}">${m}%</td>
        </tr>`;
      }).join('')}
    </tbody>`;
}

function buildIncomeCharts() {
  // 매출 구성 (적층 막대)
  const stackOpts = baseOpts('조');
  stackOpts.scales.x = { stacked: true, ...stackOpts.scales.x };
  stackOpts.scales.y = { stacked: true, ...stackOpts.scales.y, ticks: { ...TICK, callback: v => v + '조' } };

  mkChart('revenueStackChart', {
    type: 'bar',
    data: {
      labels: YEARS,
      datasets: [
        { label: '매출원가',   data: DATA.map(d => +T(d.cogs)),                   backgroundColor: 'rgba(80,80,100,0.7)', borderRadius: 3, stack: 'a' },
        { label: '매출총이익', data: DATA.map(d => Math.max(0, +T(d.grossP))),    backgroundColor: 'rgba(232,0,29,0.7)', borderRadius: 3, stack: 'a' },
      ],
    },
    options: stackOpts,
  });

  // 이익률 3종 라인
  const marginOpts = baseOpts('%');
  marginOpts.scales.y.ticks.callback = v => v + '%';

  mkChart('marginChart', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [
        { label: '영업이익률',   data: DATA.map(d => +(d.opInc  / d.rev * 100).toFixed(1)), borderColor: '#E8001D', borderWidth: 2, pointRadius: 3, tension: 0.3, backgroundColor: 'transparent' },
        { label: '순이익률',     data: DATA.map(d => +(d.netInc / d.rev * 100).toFixed(1)), borderColor: '#3A8FFF', borderWidth: 2, pointRadius: 3, tension: 0.3, backgroundColor: 'transparent' },
        { label: '매출총이익률', data: DATA.map(d => +(d.grossP / d.rev * 100).toFixed(1)), borderColor: '#FFB800', borderWidth: 2, pointRadius: 3, tension: 0.3, backgroundColor: 'transparent', borderDash: [4, 3] },
      ],
    },
    options: marginOpts,
  });
}

// ============================================================
// 7. 재무상태표 뷰
// ============================================================
function renderBalance(d, prev) {
  const dr = d.liab   / d.equity * 100;
  const er = d.equity / d.assets * 100;

  renderHero('bsHeroGrid', [
    {
      label: '자산총계', value: T(d.assets) + '조', hl: true,
      delta: prev ? deltaLabel(d.assets, prev.assets) : '', deltaDir: 'up',
    },
    { label: '부채총계',     value: T(d.liab)   + '조', cls: 'amber' },
    { label: '자본합계',     value: T(d.equity) + '조', cls: 'green' },
    { label: '부채비율',     value: pct(dr), cls: dr > 100 ? 'amber' : '' },
    { label: '자기자본비율', value: pct(er), cls: er > 50  ? 'green' : '' },
    { label: '유형자산',     value: '-', sub: '주석 기준' },
  ]);

  // 연도 태그
  document.getElementById('bsYearTag').textContent = selectedYear + '년';

  // 수평 바 차트 (자산/자본/부채 비교)
  const maxAssets = Math.max(...DATA.map(r => r.assets));
  const wrap = document.getElementById('bsBarWrap');
  const rows = [
    { label: '자산총계', val: d.assets, cls: 'bar-assets' },
    { label: '자본합계', val: d.equity, cls: 'bar-equity' },
    { label: '부채총계', val: d.liab,   cls: 'bar-liab'   },
  ];

  wrap.innerHTML = rows.map(r => `
    <div class="bs-bar-row">
      <div class="bs-bar-label">${r.label}</div>
      <div class="bs-bar-track">
        <div class="bs-bar-fill ${r.cls}" style="width:${(r.val / maxAssets * 95).toFixed(1)}%">
          ${T(r.val)}조
        </div>
      </div>
    </div>
  `).join('');
}

function buildBalanceCharts() {
  const opts = baseOpts('조');
  opts.scales.y.ticks.callback = v => v + '조';

  // 자산 / 자본 / 부채 추이
  mkChart('bsFullChart', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [
        { label: '자산총계', data: DATA.map(d => +T(d.assets)), borderColor: '#3A8FFF', backgroundColor: 'rgba(58,143,255,0.07)', borderWidth: 2, fill: true, tension: 0.3, pointRadius: 3 },
        { label: '자본합계', data: DATA.map(d => +T(d.equity)), borderColor: '#00C46A', backgroundColor: 'transparent',            borderWidth: 2, tension: 0.3, pointRadius: 3 },
        { label: '부채총계', data: DATA.map(d => +T(d.liab)),   borderColor: '#E8001D', backgroundColor: 'transparent',            borderWidth: 2, tension: 0.3, pointRadius: 3, borderDash: [4, 3] },
      ],
    },
    options: opts,
  });

  // 부채비율 / 자기자본비율
  const ratioOpts = baseOpts('%');
  ratioOpts.scales.y.ticks.callback = v => v + '%';

  mkChart('debtRatioChart', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [
        { label: '부채비율',     data: DATA.map(d => +(d.liab   / d.equity * 100).toFixed(1)), borderColor: '#E8001D', backgroundColor: 'rgba(232,0,29,0.07)', borderWidth: 2, fill: true, tension: 0.3, pointRadius: 3 },
        { label: '자기자본비율', data: DATA.map(d => +(d.equity / d.assets * 100).toFixed(1)), borderColor: '#3A8FFF', backgroundColor: 'transparent',            borderWidth: 2,             tension: 0.3, pointRadius: 3 },
      ],
    },
    options: ratioOpts,
  });
}

// ============================================================
// 8. 현금흐름표 뷰
// ============================================================
function renderCashflow(d, prev) {
  const ratio = d.ppeAcq / d.cashFromOps * 100;
  const fcf   = d.opCF - d.ppeAcq;

  renderHero('cfHeroGrid', [
    {
      label: '영업창출현금', value: T(d.cashFromOps) + '조', hl: true, cls: 'green',
      delta: prev ? deltaLabel(d.cashFromOps, prev.cashFromOps) : '',
      deltaDir: d.cashFromOps >= (prev?.cashFromOps || 0) ? 'up' : 'down',
    },
    { label: '영업활동 CF',  value: T(d.opCF)  + '조', cls: d.opCF  >= 0 ? '' : 'red' },
    { label: '유형자산 취득', value: T(d.ppeAcq) + '조', cls: 'red' },
    { label: 'CAPEX 집중도', value: pct(ratio), cls: ratio > 100 ? 'red' : ratio > 80 ? 'amber' : 'green' },
    { label: '투자활동 CF',  value: T(d.invCF)  + '조', cls: 'red' },
    { label: '잉여현금흐름', value: T(fcf)       + '조', cls: fcf >= 0 ? 'green' : 'red' },
  ]);
}

function buildCashflowCharts() {
  const opts = baseOpts('조');
  opts.scales.y.ticks.callback = v => v + '조';

  // 영업창출현금 vs 유형자산 취득
  mkChart('cfOpPpeChart', {
    type: 'bar',
    data: {
      labels: YEARS,
      datasets: [
        { label: '영업창출현금',  data: DATA.map(d => +T(d.cashFromOps)), backgroundColor: 'rgba(58,143,255,0.7)', borderRadius: 3 },
        { label: '유형자산 취득', data: DATA.map(d => +T(d.ppeAcq)),      backgroundColor: 'rgba(232,0,29,0.7)',   borderRadius: 3 },
      ],
    },
    options: opts,
  });

  // CAPEX 집중도
  const ratios    = DATA.map(d => +(d.ppeAcq / d.cashFromOps * 100).toFixed(1));
  const capexOpts = baseOpts('%');
  capexOpts.scales.y = {
    ...capexOpts.scales.y,
    min: 0, max: 150,
    ticks: { ...TICK, callback: v => v + '%' },
  };
  capexOpts.plugins.tooltip = {
    ...capexOpts.plugins.tooltip,
    callbacks: { label: ctx => ` 비중: ${ctx.raw}%` },
  };

  mkChart('capexRatioChart', {
    type: 'bar',
    data: {
      labels: YEARS,
      datasets: [{
        label: 'CAPEX 집중도',
        data: ratios,
        backgroundColor: ratios.map(r => r > 100 ? 'rgba(232,0,29,0.75)' : r > 80 ? 'rgba(255,184,0,0.7)' : 'rgba(0,196,106,0.7)'),
        borderRadius: 3,
      }],
    },
    options: capexOpts,
  });

  // 영업 / 투자 현금흐름 비교
  const cfOpts = baseOpts('조');
  cfOpts.scales.y.ticks.callback = v => v + '조';

  mkChart('cfThreeChart', {
    type: 'bar',
    data: {
      labels: YEARS,
      datasets: [
        { label: '영업활동 CF', data: DATA.map(d => +T(d.opCF)),  backgroundColor: 'rgba(0,196,106,0.7)', borderRadius: 3 },
        { label: '투자활동 CF', data: DATA.map(d => +T(d.invCF)), backgroundColor: 'rgba(232,0,29,0.6)',  borderRadius: 3 },
      ],
    },
    options: cfOpts,
  });
}

// ============================================================
// 9. 전체 추이 뷰
// ============================================================
function renderTrend() {
  // 요약 테이블
  const tbl = document.getElementById('fullTrendTable');
  tbl.innerHTML = `
    <thead><tr>
      <th>연도</th><th>매출(조)</th><th>영업이익(조)</th><th>순이익(조)</th>
      <th>자산(조)</th><th>자본(조)</th><th>영업이익률</th><th>부채비율</th><th>ROE</th><th>CAPEX비중</th>
    </tr></thead>
    <tbody>
      ${DATA.map(r => {
        const om    = r.opInc  / r.rev    * 100;
        const dr    = r.liab   / r.equity * 100;
        const roe   = r.netInc / r.equity * 100;
        const capex = r.ppeAcq / r.cashFromOps * 100;
        const isActive = r.year === selectedYear;
        return `<tr class="${isActive ? 'active-row' : ''}">
          <td>${r.year}</td>
          <td>${T(r.rev)}</td>
          <td class="${r.opInc  < 0 ? 'num-red' : om  > 20 ? 'num-green' : ''}">${T(r.opInc)}</td>
          <td class="${r.netInc < 0 ? 'num-red' : ''}">${T(r.netInc)}</td>
          <td>${T(r.assets)}</td>
          <td>${T(r.equity)}</td>
          <td class="${om   < 0 ? 'num-red' : om   > 20 ? 'num-green' : ''}">${om.toFixed(1)}%</td>
          <td>${dr.toFixed(1)}%</td>
          <td class="${roe  < 0 ? 'num-red' : roe  > 20 ? 'num-green' : ''}">${roe.toFixed(1)}%</td>
          <td class="${capex > 100 ? 'num-red' : capex > 80 ? 'num-amber' : 'num-green'}">${capex.toFixed(1)}%</td>
        </tr>`;
      }).join('')}
    </tbody>`;

  // 미니 차트 공용 옵션
  const miniOpts = unit => ({
    responsive: true, maintainAspectRatio: false,
    animation:  { duration: 400 },
    plugins: {
      legend:  { display: false },
      tooltip: {
        backgroundColor: '#18181E', borderColor: 'rgba(232,0,29,0.3)', borderWidth: 1, bodyColor: '#aaa',
        callbacks: { label: ctx => ` ${ctx.raw}${unit}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#444455', maxRotation: 0 }, border: { display: false } },
      y: { grid: GRID,               ticks: { font: { size: 9 }, color: '#444455', callback: v => v + unit }, border: { display: false } },
    },
  });

  // ROE
  mkChart('roeChart', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [{
        label: 'ROE',
        data: DATA.map(d => +(d.netInc / d.equity * 100).toFixed(1)),
        borderColor: '#E8001D', backgroundColor: 'rgba(232,0,29,0.07)',
        borderWidth: 2, pointRadius: 2, tension: 0.3, fill: true,
      }],
    },
    options: miniOpts('%'),
  });

  // 영업이익률
  mkChart('opMarginChart2', {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [{
        label: '영업이익률',
        data: DATA.map(d => +(d.opInc / d.rev * 100).toFixed(1)),
        borderColor: '#3A8FFF', backgroundColor: 'rgba(58,143,255,0.07)',
        borderWidth: 2, pointRadius: 2, tension: 0.3, fill: true,
      }],
    },
    options: miniOpts('%'),
  });

  // 매출 성장률
  const growths = DATA.map((d, i) =>
    i === 0 ? 0 : +((d.rev - DATA[i - 1].rev) / DATA[i - 1].rev * 100).toFixed(1)
  );

  mkChart('revGrowthChart', {
    type: 'bar',
    data: {
      labels: YEARS,
      datasets: [{
        label: '매출성장률',
        data: growths,
        backgroundColor: growths.map(v => v >= 0 ? 'rgba(0,196,106,0.7)' : 'rgba(232,0,29,0.7)'),
        borderRadius: 2,
      }],
    },
    options: miniOpts('%'),
  });
}

// ============================================================
// 10. 연도 선택
// ============================================================
function selectYear(year) {
  selectedYear = year;
  document.querySelectorAll('.year-tab').forEach((t, i) => {
    t.classList.toggle('active', YEARS[i] === year);
  });
  updateView();
}

// ============================================================
// 11. 뷰 전환
// ============================================================

/** 뷰 이름 → 탭 텍스트 매핑 */
const VIEW_LABELS = {
  overview:  '개요',
  income:    '손익계산서',
  balance:   '재무상태표',
  cashflow:  '현금흐름표',
  trend:     '전체 추이',
};

function switchView(view) {
  activeView = view;

  // 탭 하이라이트
  document.querySelectorAll('.view-tab').forEach(t => {
    t.classList.toggle('active', t.textContent.trim() === VIEW_LABELS[view]);
  });

  // 패널 전환
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${view}`)?.classList.add('active');

  updateView();
}

// ============================================================
// 12. 통합 업데이트 (연도 / 뷰 변경 시 호출)
// ============================================================
function updateView() {
  const d    = yearData(selectedYear);
  const prev = prevYearData(selectedYear);

  switch (activeView) {
    case 'overview':
      renderOverview(d, prev);
      buildRevOpChart();
      buildBsChart();
      buildSparklineMargin();
      break;
    case 'income':
      renderIncome(d, prev);
      buildIncomeCharts();
      break;
    case 'balance':
      renderBalance(d, prev);
      buildBalanceCharts();
      break;
    case 'cashflow':
      renderCashflow(d, prev);
      buildCashflowCharts();
      break;
    case 'trend':
      renderTrend();
      break;
  }
}

// ============================================================
// 13. 초기화
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  selectYear(2025);
  switchView('overview');
});
