/* ─────────────────────────────────────────────────────────
   VRINK 지점 관리자 페이지 — 단계별 스포트라이트 가이드 투어
   사용: <script src="admin-tour.js"></script>
   - 첫 방문 시 자동 시작 (localStorage로 1회 제한)
   - 상단바 [가이드] 버튼으로 언제든 다시 보기
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var PRIMARY = '#0095FF';

  var STEPS = [
    {
      target: null,
      title: '지점 관리자 페이지에 오신 걸 환영해요 👋',
      desc: '이 페이지는 브링크 기기를 도입한 지점 전용 관리자 화면이에요.\n빌드업 성수점 데이터 기준으로 운영 현황을 관리할 수 있습니다.\n\n주요 영역을 하나씩 안내해드릴게요. (약 1분)'
    },
    {
      target: '.sidebar-nav',
      title: '① 지점 관리자 메뉴',
      desc: '지점 운영에 필요한 9개 메뉴만 모았어요.\n홈 · 자사몰 · 재고 관리 · 주문 내역 · 종합 매출 · 메뉴 · 회원 · 공지사항 · 알림.\n\n키오스크 설정, 정책, 프로모션 같은 기능은 본사(총관리자)에서 관리합니다.',
      pos: 'right'
    },
    {
      target: '.topbar-branch',
      title: '② 내 지점 표시',
      desc: '이 계정은 빌드업 성수점 전용이에요.\n총관리자와 달리 지점 전환이 불가능하며, 모든 데이터가 내 지점 기준으로 표시됩니다.',
      pos: 'bottom'
    },
    {
      target: '.notif-btn',
      title: '③ 알림',
      desc: '재고 부족, 기기 오류 등 내 지점에서 발생한 알림이 모입니다.\n숫자 배지가 뜨면 꼭 확인해주세요.',
      pos: 'bottom'
    },
    {
      target: '.perm-banner',
      title: '④ 권한 안내',
      desc: '지점 관리자 계정의 권한 범위를 알려주는 배너예요.\n지점 추가/삭제, 전체 지점 통계 등은 본사 권한이라 이 화면에는 나오지 않습니다.',
      pos: 'bottom'
    },
    {
      target: '.stat-grid',
      title: '⑤ 오늘의 핵심 지표',
      desc: '오늘 주문 · 오늘 매출 · 재고 부족 품목 · 키오스크 상태를 한눈에 확인해요.\n재고 부족이 뜨면 [재고 관리] 메뉴에서 입고를 등록해주세요.',
      pos: 'bottom'
    },
    {
      target: '.card-grid .panel:first-child',
      title: '⑥ 지점 정보',
      desc: '내 지점의 기본 정보입니다.\n주소 · 연락처 · 운영 시간은 [지점 정보 수정] 버튼으로 직접 바꿀 수 있고,\n🔒 표시된 지점 코드 · 지점명은 본사에 요청해야 변경됩니다.',
      pos: 'top'
    },
    {
      target: '.card-grid .panel:last-child',
      title: '⑦ 내 계정',
      desc: '로그인한 지점 관리자 계정 정보예요.\n비밀번호 변경도 여기서 바로 할 수 있습니다.',
      pos: 'left'
    },
    {
      target: '.page-content > .panel',
      title: '⑧ 오늘 주문',
      desc: '오늘 들어온 최근 주문 5건이 표시됩니다.\nN잔권 차감 · 현장 결제 · 무료 이벤트 차감 등 결제 수단별로 확인할 수 있고,\n[전체 보기]를 누르면 주문 내역 페이지로 이동해요.',
      pos: 'top'
    },
    {
      target: null,
      title: '가이드 끝! 🎉',
      desc: '이제 사이드바에서 각 메뉴를 눌러 직접 둘러보세요.\n\n이 가이드는 상단의 [📖 가이드] 버튼으로 언제든 다시 볼 수 있습니다.'
    }
  ];

  /* ── 스타일 ── */
  var css = [
    '#vt-spot{position:fixed;z-index:100000;border-radius:12px;box-shadow:0 0 0 9999px rgba(17,24,39,.62);pointer-events:none;transition:all .3s ease;border:2px solid ' + PRIMARY + ';}',
    '#vt-tip{position:fixed;z-index:100001;width:340px;max-width:88vw;background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(17,24,39,.28);padding:20px;font-family:Pretendard,-apple-system,"Noto Sans KR",sans-serif;transition:all .3s ease;}',
    '#vt-tip.vt-center{left:50% !important;top:50% !important;transform:translate(-50%,-50%);width:400px;}',
    '.vt-step{font-size:11px;font-weight:700;color:' + PRIMARY + ';letter-spacing:.5px;margin-bottom:8px;}',
    '.vt-title{font-size:17px;font-weight:700;color:#111;margin:0 0 8px;line-height:1.4;}',
    '.vt-desc{font-size:13.5px;color:#505050;line-height:1.65;margin:0 0 16px;white-space:pre-line;}',
    '.vt-foot{display:flex;align-items:center;justify-content:space-between;}',
    '.vt-skip{background:none;border:none;color:#A098AE;font-size:12.5px;cursor:pointer;padding:6px 4px;}',
    '.vt-btns{display:flex;gap:8px;}',
    '.vt-prev{background:#fff;border:1px solid #EDF2F6;color:#505050;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;}',
    '.vt-next{background:' + PRIMARY + ';border:none;color:#fff;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;}',
    '.vt-dots{display:flex;gap:5px;justify-content:center;margin-bottom:14px;}',
    '.vt-dot{width:6px;height:6px;border-radius:50%;background:#E5E8EB;}',
    '.vt-dot.on{background:' + PRIMARY + ';width:16px;border-radius:999px;}',
    '#vt-guide-btn{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #EDF2F6;border-radius:8px;padding:7px 12px;font-size:13px;font-weight:500;color:#505050;cursor:pointer;font-family:inherit;}',
    '#vt-guide-btn:hover{background:#F6F6F6;}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var spot = null, tip = null, idx = 0;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function destroy() {
    if (spot) { spot.remove(); spot = null; }
    if (tip) { tip.remove(); tip = null; }
    window.removeEventListener('resize', position);
    localStorage.setItem('vrinkTourDone', '1');
  }

  function position() {
    var s = STEPS[idx];
    var target = s.target ? document.querySelector(s.target) : null;

    if (!target) {
      // 중앙 모달형 단계
      spot.style.cssText = 'position:fixed;z-index:100000;left:50%;top:50%;width:0;height:0;border:none;border-radius:12px;box-shadow:0 0 0 9999px rgba(17,24,39,.62);pointer-events:none;';
      tip.classList.add('vt-center');
      tip.style.left = '';
      tip.style.top = '';
      return;
    }
    tip.classList.remove('vt-center');
    tip.style.transform = '';

    target.scrollIntoView({ block: 'center', behavior: 'instant' });
    var r = target.getBoundingClientRect();
    var pad = 8;
    spot.style.cssText = '';
    spot.style.position = 'fixed';
    spot.style.zIndex = '100000';
    spot.style.left = (r.left - pad) + 'px';
    spot.style.top = (r.top - pad) + 'px';
    spot.style.width = (r.width + pad * 2) + 'px';
    spot.style.height = (r.height + pad * 2) + 'px';

    // 툴팁 위치: pos 힌트 + 화면 경계 보정
    var tw = 340, th = tip.offsetHeight || 220, gap = 14;
    var pos = s.pos || 'bottom';
    var left, top;
    if (pos === 'right') { left = r.right + gap; top = r.top + r.height / 2 - th / 2; }
    else if (pos === 'left') { left = r.left - tw - gap; top = r.top + r.height / 2 - th / 2; }
    else if (pos === 'top') { left = r.left + r.width / 2 - tw / 2; top = r.top - th - gap; }
    else { left = r.left + r.width / 2 - tw / 2; top = r.bottom + gap; }
    left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - th - 12));
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function render() {
    var s = STEPS[idx];
    var dots = STEPS.map(function (_, i) {
      return '<span class="vt-dot' + (i === idx ? ' on' : '') + '"></span>';
    }).join('');
    tip.innerHTML =
      '<div class="vt-dots">' + dots + '</div>' +
      '<div class="vt-step">STEP ' + (idx + 1) + ' / ' + STEPS.length + '</div>' +
      '<h3 class="vt-title">' + s.title + '</h3>' +
      '<p class="vt-desc">' + s.desc + '</p>' +
      '<div class="vt-foot">' +
        '<button class="vt-skip">건너뛰기</button>' +
        '<div class="vt-btns">' +
          (idx > 0 ? '<button class="vt-prev">이전</button>' : '') +
          '<button class="vt-next">' + (idx === STEPS.length - 1 ? '시작하기 🚀' : '다음') + '</button>' +
        '</div>' +
      '</div>';
    tip.querySelector('.vt-skip').onclick = destroy;
    var prev = tip.querySelector('.vt-prev');
    if (prev) prev.onclick = function () { idx--; render(); requestAnimationFrame(position); };
    tip.querySelector('.vt-next').onclick = function () {
      if (idx === STEPS.length - 1) { destroy(); return; }
      idx++; render(); requestAnimationFrame(position);
    };
    requestAnimationFrame(position);
  }

  function start() {
    if (spot) destroy();
    idx = 0;
    spot = el('div'); spot.id = 'vt-spot';
    tip = el('div'); tip.id = 'vt-tip';
    document.body.appendChild(spot);
    document.body.appendChild(tip);
    window.addEventListener('resize', position);
    render();
  }

  /* 상단바에 [가이드] 다시 보기 버튼 추가 */
  function addGuideButton() {
    var topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('vt-guide-btn')) return;
    var btn = el('button', '', '📖 가이드');
    btn.id = 'vt-guide-btn';
    btn.onclick = start;
    topbar.insertBefore(btn, topbar.firstChild);
  }

  window.vrinkTour = { start: start };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  function init() {
    addGuideButton();
    if (!localStorage.getItem('vrinkTourDone')) {
      setTimeout(start, 600);
    }
  }
})();
