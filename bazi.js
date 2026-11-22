/* Bazi / Four Pillars Calculator - UI and English texts.
   Calendar math: manseryeok (MIT), loaded as window.Manseryeok. No network calls. */
(function () {
  'use strict';
  var M = window.Manseryeok;
  var $ = function (id) { return document.getElementById(id); };

  var STEM_PY = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
  var STEM_EL = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
  var BR_PY = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
  var BR_ANIMAL = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  var BR_EL = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];
  var ELS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  var GEN = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  var CTRL = { Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood' };

  // Original Day Master descriptions (written for this site). Tendencies, not fixed outcomes.
  var DM = [
    { name: 'Jia Wood (Yang Wood)', img: 'a tall tree',
      text: 'Jia Wood is often pictured as a tall tree that keeps growing toward the light. People with this Day Master tend to value steady progress, principles and a clear sense of direction. They may enjoy taking the lead and protecting others, though bending a little when conditions change can be a useful skill to practise. Think of this as a lens for reflection rather than a rule about who you are.' },
    { name: 'Yi Wood (Yin Wood)', img: 'a climbing vine or flower',
      text: 'Yi Wood is usually compared to a vine, grass or a flower that finds its way around obstacles. This Day Master is associated with flexibility, tact and a talent for building connections. People with Yi Wood may do well by cooperating rather than competing head-on. Some find it helpful to notice when adapting to others turns into forgetting their own needs.' },
    { name: 'Bing Fire (Yang Fire)', img: 'the sun',
      text: 'Bing Fire is the image of the sun: warm, visible and generous with its energy. Those born with this Day Master are often described as open, enthusiastic and easy to notice in a group. They may enjoy encouraging others and starting new things. Pacing that energy and leaving room for quiet time can help it last longer.' },
    { name: 'Ding Fire (Yin Fire)', img: 'a candle or lamp',
      text: 'Ding Fire is likened to a candle or lamp that lights a small space clearly. This Day Master is linked with focus, sensitivity and a caring attention to detail. People with Ding Fire may shine in one-to-one conversations, teaching or careful craft. It can be worth noticing what keeps your flame steady, such as supportive people and meaningful work.' },
    { name: 'Wu Earth (Yang Earth)', img: 'a mountain',
      text: 'Wu Earth is pictured as a mountain or a solid wall: stable, dependable and hard to move. People with this Day Master are often seen as reliable and calm under pressure. They may prefer to think things through before changing course. Staying open to new ideas can balance that natural steadiness.' },
    { name: 'Ji Earth (Yin Earth)', img: 'fertile garden soil',
      text: 'Ji Earth is compared to soft, fertile soil where things can grow. This Day Master is associated with nurturing, practical support and a talent for organising everyday life. People with Ji Earth may quietly help those around them develop. Setting gentle boundaries can keep that generosity sustainable.' },
    { name: 'Geng Metal (Yang Metal)', img: 'raw iron or an axe',
      text: 'Geng Metal is the image of raw ore or a strong blade: direct, resilient and decisive. People with this Day Master are often described as frank, loyal and willing to take on hard tasks. They may value fairness and clear rules. Softening the delivery of strong opinions can make their honesty easier for others to hear.' },
    { name: 'Xin Metal (Yin Metal)', img: 'polished jewellery',
      text: 'Xin Metal is likened to fine jewellery: refined, precise and quietly valuable. This Day Master is linked with good taste, attention to quality and a sensitive inner world. People with Xin Metal may care about how things look and feel. Allowing room for imperfection can bring more ease.' },
    { name: 'Ren Water (Yang Water)', img: 'a river or the ocean',
      text: 'Ren Water is pictured as a large river or the ocean: moving, wide and full of possibility. People with this Day Master are often curious, resourceful and drawn to new experiences. They may adapt quickly and think in big pictures. Having a few steady routines can help channel that flow.' },
    { name: 'Gui Water (Yin Water)', img: 'rain or morning dew',
      text: 'Gui Water is compared to rain, mist or dew: gentle, quiet and nourishing. This Day Master is associated with intuition, imagination and a thoughtful nature. People with Gui Water may notice feelings and details others overlook. Trusting those observations while checking them against the facts can be a helpful habit.' }
  ];

  var TEN = {
    Friend: 'Friend (Peer)', Rob: 'Rob Wealth (Competitor)', Eat: 'Eating God (Expression)', Hurt: 'Hurting Officer (Bold Expression)',
    IWealth: 'Indirect Wealth', DWealth: 'Direct Wealth', Seven: 'Seven Killings (Pressure)', Officer: 'Direct Officer (Structure)',
    IRes: 'Indirect Resource (Insight)', DRes: 'Direct Resource (Support)'
  };
  var TEN_NOTE = {
    Friend: 'a year that highlights peers, independence and standing on your own feet',
    Rob: 'a year that highlights teamwork, competition and sharing resources wisely',
    Eat: 'a year that highlights creativity, enjoyment and expressing yourself',
    Hurt: 'a year that highlights new ideas, speaking up and questioning old habits',
    IWealth: 'a year that highlights opportunities, side projects and flexible income',
    DWealth: 'a year that highlights steady effort, budgeting and practical results',
    Seven: 'a year that highlights challenges, discipline and taking decisive action',
    Officer: 'a year that highlights responsibility, rules and reputation',
    IRes: 'a year that highlights study, reflection and unusual skills',
    DRes: 'a year that highlights learning, support from others and rest'
  };

  function si(k) { return M.HEAVENLY_STEMS.indexOf(k); }
  function bi(k) { return M.EARTHLY_BRANCHES.indexOf(k); }
  function stemLabel(i) { return STEM_PY[i] + ' ' + STEM_EL[i] + ' ' + (i % 2 ? 'Yin' : 'Yang'); }
  function branchLabel(i) { return BR_PY[i] + ' ' + BR_ANIMAL[i]; }
  function hanja(p) { return M.HEAVENLY_STEMS_HANJA[si(p.heavenlyStem)] + M.EARTHLY_BRANCHES_HANJA[bi(p.earthlyBranch)]; }

  function tenGod(dm, other) {
    var a = STEM_EL[dm], b = STEM_EL[other], same = (dm % 2) === (other % 2);
    if (a === b) return same ? 'Friend' : 'Rob';
    if (GEN[a] === b) return same ? 'Eat' : 'Hurt';
    if (CTRL[a] === b) return same ? 'IWealth' : 'DWealth';
    if (CTRL[b] === a) return same ? 'Seven' : 'Officer';
    return same ? 'IRes' : 'DRes';
  }

  function buildInfo(o) {
    return {
      year: o.y, month: o.m, day: o.d,
      hour: o.unknown ? 12 : o.h, minute: o.unknown ? 0 : o.mi,
      isLunar: !!o.lunar, isLeapMonth: !!(o.lunar && o.leap), gender: o.gender
    };
  }

  function calc(o) { return M.calculateFourPillars(buildInfo(o)); }

  function readForm() {
    var dv = $('date').value;
    if (!dv) throw new Error('Please enter your date of birth.');
    var p = dv.split('-').map(Number);
    var unknown = $('unknown').checked;
    var t = ($('time').value || '').split(':').map(Number);
    if (!unknown && (t.length < 2 || isNaN(t[0]))) throw new Error('Please enter your birth time or tick "I don\'t know my birth time".');
    var lunar = document.querySelector('input[name=cal]:checked').value === 'lunar';
    return { y: p[0], m: p[1], d: p[2], h: t[0] || 0, mi: t[1] || 0, unknown: unknown, lunar: lunar, leap: $('leap').checked,
      gender: document.querySelector('input[name=gender]:checked').value };
  }

  function solarBirth(o) {
    if (!o.lunar) return { year: o.y, month: o.m, day: o.d };
    return M.lunarToSolar(o.y, o.m, o.d, !!o.leap);
  }

  function render(r, o) {
    var cols = [['hour', 'Hour'], ['day', 'Day'], ['month', 'Month'], ['year', 'Year']];
    var html = '';
    cols.forEach(function (c) {
      var p = r[c[0]];
      if (c[0] === 'hour' && o.unknown) {
        html += '<div class="pcol empty"><div class="t">Hour</div><div class="glyph">?<br>?</div><div class="en">Unknown</div><div class="en"></div></div>';
        return;
      }
      var s = si(p.heavenlyStem), b = bi(p.earthlyBranch);
      html += '<div class="pcol' + (c[0] === 'day' ? ' dm' : '') + '"><div class="t">' + c[1] + (c[0] === 'day' ? ' (You)' : '') + '</div>' +
        '<div class="glyph"><span class="' + STEM_EL[s] + '">' + M.HEAVENLY_STEMS_HANJA[s] + '</span><br><span class="' + BR_EL[b] + '">' + M.EARTHLY_BRANCHES_HANJA[b] + '</span></div>' +
        '<div class="en">' + stemLabel(s) + '</div><div class="en">' + branchLabel(b) + '<br>(' + BR_EL[b] + ')</div></div>';
    });
    $('pillars').innerHTML = html;
    var sb = solarBirth(o);
    $('pnote').textContent = 'Read right to left: Year, Month, Day, Hour. Top row = Heavenly Stems, bottom row = Earthly Branches. ' +
      (o.lunar ? 'Lunar date converted to ' + sb.year + '-' + pad(sb.month) + '-' + pad(sb.day) + ' (Gregorian). ' : '') +
      (o.unknown ? 'Birth time unknown, so the Hour pillar is not shown.' : '');

    // Five elements count (stems + branches)
    var cnt = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }, total = 0;
    ['year', 'month', 'day', 'hour'].forEach(function (k) {
      if (k === 'hour' && o.unknown) return;
      cnt[STEM_EL[si(r[k].heavenlyStem)]]++; cnt[BR_EL[bi(r[k].earthlyBranch)]]++; total += 2;
    });
    var max = Math.max.apply(null, ELS.map(function (e) { return cnt[e]; })) || 1;
    $('bars').innerHTML = ELS.map(function (e) {
      return '<div class="b"><span class="' + e + '" style="font-weight:700">' + e + '</span><div class="track"><div class="fill bg-' + e + '" style="width:' + (cnt[e] / max * 100) + '%"></div></div><span>' + cnt[e] + '</span></div>';
    }).join('');
    var missing = ELS.filter(function (e) { return !cnt[e]; });
    var strong = ELS.filter(function (e) { return cnt[e] === max; });
    $('barNote').textContent = 'Counted from ' + total + ' characters. Most present: ' + strong.join(', ') + '.' +
      (missing.length ? ' Not present: ' + missing.join(', ') + '. Many people use this as a hint about qualities to cultivate, not as a weakness.' : ' All five elements appear in your chart.');

    // Day Master
    var dm = si(r.day.heavenlyStem), d = DM[dm];
    $('dmTitle').textContent = 'Your Day Master: ' + M.HEAVENLY_STEMS_HANJA[dm] + ' ' + d.name;
    $('dmText').textContent = d.text;

    // Luck pillars
    var lp = r.luckPillars, now = new Date();
    if (lp && lp.pillars) {
      var start = new Date(sb.year + (lp.startYears || 0), sb.month - 1 + (lp.startMonths || 0), sb.day + (lp.startDays || 0));
      $('luckMeta').textContent = 'Direction: ' + (lp.forward ? 'forward' : 'backward') + '. First luck pillar begins at about age ' + lp.startAge +
        ' (around ' + start.getFullYear() + '). Each pillar covers roughly 10 years; the highlighted one is your current period.';
      $('luck').innerHTML = lp.pillars.slice(0, 9).map(function (p, i) {
        var s0 = new Date(start.getFullYear() + i * 10, start.getMonth(), start.getDate());
        var s1 = new Date(start.getFullYear() + (i + 1) * 10, start.getMonth(), start.getDate());
        var cur = now >= s0 && now < s1;
        var s = si(p.pillar.heavenlyStem), b = bi(p.pillar.earthlyBranch);
        return '<div class="lp' + (cur ? ' now' : '') + '">' + (cur ? '<div class="tag">NOW</div>' : '<div class="tag">&nbsp;</div>') +
          '<div class="g"><span class="' + STEM_EL[s] + '">' + M.HEAVENLY_STEMS_HANJA[s] + '</span><span class="' + BR_EL[b] + '">' + M.EARTHLY_BRANCHES_HANJA[b] + '</span></div>' +
          '<div class="a">' + STEM_PY[s] + ' ' + BR_PY[b] + '</div><div class="a">Age ' + (lp.startAge + i * 10) + '</div><div class="a">' + s0.getFullYear() + '</div></div>';
      }).join('');
      var nowEl = $('luck').querySelector('.now');
      if (nowEl) $('luck').scrollLeft = Math.max(0, nowEl.offsetLeft - $('luck').offsetLeft - 8);
    }

    // This year
    var ty = M.calculateFourPillars({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), hour: 12, minute: 0, gender: 'female' }).year;
    var ys = si(ty.heavenlyStem), yb = bi(ty.earthlyBranch), tg = tenGod(dm, ys);
    $('yearTitle').textContent = 'This year: ' + hanja(ty) + ' (' + STEM_PY[ys] + ' ' + BR_PY[yb] + ', ' + STEM_EL[ys] + ' ' + BR_ANIMAL[yb] + ')';
    $('yearText').textContent = 'The year stem ' + M.HEAVENLY_STEMS_HANJA[ys] + ' ' + stemLabel(ys) + ' is your ' + TEN[tg] + ' star: ' + TEN_NOTE[tg] + '.';

    $('out').classList.remove('hide');
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function run(o, scroll) {
    $('err').classList.add('hide');
    try {
      var r = calc(o);
      render(r, o);
      if (scroll) $('out').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return r;
    } catch (e) {
      $('err').textContent = (e && e.message) ? e.message : 'This date cannot be calculated.';
      $('err').classList.remove('hide');
      return null;
    }
  }

  $('f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    try { run(readForm(), true); } catch (e) { $('err').textContent = e.message; $('err').classList.remove('hide'); }
  });
  $('unknown').addEventListener('change', function () { $('time').disabled = this.checked; });
  Array.prototype.forEach.call(document.querySelectorAll('input[name=cal]'), function (el) {
    el.addEventListener('change', function () {
      $('leapWrap').classList.toggle('hide', document.querySelector('input[name=cal]:checked').value !== 'lunar');
    });
  });

  // Reference examples
  var EX = [
    { y: 1971, m: 3, d: 18, h: 20, mi: 0, gender: 'female', want: '辛亥 辛卯 壬寅 庚戌' },
    { y: 1982, m: 3, d: 18, h: 8, mi: 0, gender: 'male', want: '壬戌 癸卯 庚子 庚辰' },
    { y: 1977, m: 3, d: 20, h: 13, mi: 50, gender: 'female', want: '丁巳 癸卯 丙子 乙未' }
  ];
  var ckDone = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-ex]'), function (btn) {
    btn.addEventListener('click', function () {
      var i = +btn.getAttribute('data-ex'), e = EX[i];
      $('date').value = e.y + '-' + pad(e.m) + '-' + pad(e.d);
      $('time').value = pad(e.h) + ':' + pad(e.mi); $('time').disabled = false;
      $('unknown').checked = false;
      document.querySelector('input[name=cal][value=solar]').checked = true; $('leapWrap').classList.add('hide');
      document.querySelector('input[name=gender][value=' + e.gender + ']').checked = true;
      var o = { y: e.y, m: e.m, d: e.d, h: e.h, mi: e.mi, gender: e.gender, unknown: false, lunar: false };
      var r = run(o, false);
      var got = r ? ['year', 'month', 'day', 'hour'].map(function (k) { return hanja(r[k]); }).join(' ') : 'error';
      var ok = got === e.want;
      ckDone[i] = '<tr id="ck' + i + '"><td>' + String.fromCharCode(65 + i) + ': ' + e.y + '-' + pad(e.m) + '-' + pad(e.d) + ' ' + pad(e.h) + ':' + pad(e.mi) + ' ' + e.gender + '</td><td>' + e.want + '</td><td>' + got + '</td><td class="' + (ok ? 'ok' : 'ng') + '">' + (ok ? 'Match' : 'No match') + '</td></tr>';
      $('ck').querySelector('tbody').innerHTML = [0, 1, 2].filter(function (k) { return ckDone[k]; }).map(function (k) { return ckDone[k]; }).join('');
      $('ck').classList.remove('hide');
    });
  });
})();
