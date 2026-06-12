/* ─────────────────────────────────────────────────────────
   VRINK 지점 관리자 — 멀티 페이지 스포트라이트 가이드 투어
   흐름: 홈(메뉴·상단) → 재고 관리 → 메뉴(가격 수정) → 회원 관리
   - 첫 방문 시 홈에서 자동 시작 (localStorage 1회)
   - 상단바 [📖 가이드] 버튼으로 어디서든 재실행
   - 페이지 이동은 sessionStorage로 단계를 이어받음
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var PRIMARY = '#0095FF';
  var HOME = 'admin-branch-manager.html';

  function file() {
    var f = location.pathname.split('/').pop();
    return f || HOME;
  }

  var STEPS = [
    /* ── 홈 ── */
    {
      page: HOME, target: null,
      title: '지점 관리자 페이지 가이드 👋',
      desc: '브링크 기기를 도입한 지점 전용 관리자 화면이에요.\n자주 쓰는 기능 위주로 안내해드릴게요. (약 1분)\n\n중간에 페이지가 자동으로 이동하니 그대로 따라와주세요!'
    },
    {
      page: HOME, target: '.sidebar-nav',
      title: '① 메뉴',
      desc: '지점 운영에 필요한 9개 메뉴예요.\n\n· 자사몰 — 원액·소모품 주문\n· 재고 관리 — 원료 재고 확인·주문\n· 주문 내역 / 종합 매출 — 우리 지점 주문·매출\n· 메뉴 — 판매 메뉴와 가격 관리\n· 회원 — 우리 지점 회원 관리\n· 공지사항 / 알림 — 안내·알림 발송\n\n키오스크 설정·정책·프로모션은 본사에서 관리합니다.',
      pos: 'right'
    },
    {
      page: HOME, target: '.topbar',
      title: '② 오른쪽 상단',
      desc: '🔔 알림 — 재고 부족, 기기 오류 등 지점 알림이 모여요. 배지 숫자가 뜨면 확인!\n\n🏷 빌드업 성수점 — 내 지점 표시예요. 지점 관리자 계정은 지점 전환이 불가능합니다.\n\n👤 김성수 — 내 계정 정보와 로그아웃.',
      pos: 'bottom'
    },

    /* ── 재고 관리 ── */
    {
      page: 'bm-inventory.html', target: '.filter-bar',
      title: '③ 재고 관리 — 필터',
      desc: '지점은 빌드업 성수점으로 고정되어 있어요.\n[재고 상태] 필터로 부족·위험 품목만 골라볼 수 있습니다.',
      pos: 'bottom'
    },
    {
      page: 'bm-inventory.html', target: '.table-wrap',
      title: '④ 재고 현황 읽는 법',
      desc: '현재 재고가 안전 재고 아래로 내려가면 상태가 바뀌어요.\n\n🟢 양호 — 충분해요\n🟡 부족 — 주문 일정을 잡아주세요\n🔴 위험 — [긴급 주문] 버튼이 떠요. 바로 주문 필요!',
      pos: 'top'
    },
    {
      page: 'bm-inventory.html', target: '.btn-primary',
      title: '⑤ 원액 주문하기',
      desc: '재고가 부족하면 [원액 주문] 버튼을 누르세요.\n자사몰로 이동해 부족한 원액을 바로 주문할 수 있어요.\n\n수량을 직접 보정해야 할 땐 [재고 조정]을 사용합니다.',
      pos: 'bottom'
    },

    /* ── 자사몰 (원액 주문) ── */
    {
      page: 'bm-storefront.html', target: '.storefront-wrap',
      title: '⑥ 자사몰에서 주문',
      desc: '[원액 주문]을 누르면 이 자사몰로 이동해요.\n\n필요한 원액의 수량을 담아 주문하면 끝!\n배송이 완료되면 재고 관리에 자동으로 반영되고,\n[마지막 입고일]도 함께 갱신됩니다.',
      pos: 'right'
    },

    /* ── 메뉴 (가격 수정) ── */
    {
      page: 'bm-menu.html', target: '.table-wrap',
      title: '⑦ 메뉴 관리',
      desc: '키오스크에 노출되는 메뉴 목록이에요.\n상단 탭으로 기능샷/맛을 구분해 볼 수 있고,\n각 메뉴의 기본가격 · 판매상태 · 주문수를 확인할 수 있습니다.',
      pos: 'top'
    },
    {
      page: 'bm-menu.html', target: '#menuEditModal .modal',
      title: '⑧ 가격 수정하기',
      desc: '메뉴 행의 [수정] 버튼을 누르면 이 팝업이 열려요.\n\n[기본 가격] 칸에 새 가격을 입력하고 저장하면\n키오스크에 바로 반영됩니다.\n판매 상태(판매중/품절/숨김)와 메뉴 설명,\n아이콘 이미지도 여기서 바꿔요.',
      pos: 'right',
      onEnter: function () { if (window.openMenuEdit) window.openMenuEdit(0); },
      onLeave: function () { if (window.closeModal) window.closeModal('menuEditModal'); }
    },

    /* ── 회원 관리 ── */
    {
      page: 'bm-members.html', target: '.filter-bar',
      title: '⑨ 회원 관리 — 검색·필터',
      desc: '이름 정렬, 보유 멤버십, 상태별로 회원을 추려볼 수 있어요.\n오른쪽 날짜로 가입 기간을 좁혀서 검색할 수도 있습니다.',
      pos: 'bottom'
    },
    {
      page: 'bm-members.html', target: '.table-wrap',
      title: '⑩ 회원 목록',
      desc: '우리 지점 회원의 보유 멤버십(N잔권 잔여), 상태,\n마지막 사용 시간을 확인할 수 있어요.\n\n연락처는 개인정보 보호를 위해 일부 마스킹(010****)됩니다.',
      pos: 'top'
    },
    {
      page: 'bm-members.html', target: 'button[onclick="openMembershipModal()"]',
      title: '⑪ 멤버십 적용하기',
      desc: '회원을 선택하고 [멤버십 적용하기]를 누르면\n현장에서 N잔권을 직접 충전해줄 수 있어요.\n현금 결제 손님이나 CS 보상 지급에 활용하세요.',
      pos: 'bottom'
    },
    {
      page: 'bm-members.html', target: null,
      title: '가이드 끝! 🎉',
      desc: '핵심 흐름을 모두 둘러봤어요.\n\n· 매일 아침: 홈에서 핵심 지표 + 재고 부족 확인\n· 재고 부족 시: 재고 관리 → [원액 주문] → 자사몰 주문\n· 배송 완료되면 재고는 자동 반영\n· 가격 변경: 메뉴 → 수정\n· 고객 응대: 회원 → 검색 → 멤버십 적용\n\n[📖 가이드] 버튼으로 언제든 다시 볼 수 있습니다.',
      finishLabel: '홈으로 가기 🏠', finishHref: HOME
    }
  ];

  /* ── 스타일 ── */
  var css = [
    '#vt-spot{position:fixed;z-index:100000;border-radius:12px;box-shadow:0 0 0 9999px rgba(17,24,39,.62);pointer-events:none;transition:all .3s ease;border:2px solid ' + PRIMARY + ';}',
    '#vt-tip{position:fixed;z-index:100002;width:340px;max-width:88vw;background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(17,24,39,.28);padding:20px;font-family:Pretendard,-apple-system,"Noto Sans KR",sans-serif;transition:all .3s ease;}',
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

  function destroy(markDone) {
    var s = STEPS[idx];
    if (s && s.onLeave) try { s.onLeave(); } catch (e) {}
    if (spot) { spot.remove(); spot = null; }
    if (tip) { tip.remove(); tip = null; }
    window.removeEventListener('resize', position);
    if (markDone !== false) localStorage.setItem('vrinkTourDone', '1');
    sessionStorage.removeItem('vrinkTourStep');
  }

  function position() {
    var s = STEPS[idx];
    var target = s.target ? document.querySelector(s.target) : null;

    if (!target) {
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

  function goto(i) {
    var cur = STEPS[idx];
    if (cur && cur.onLeave && i !== idx) try { cur.onLeave(); } catch (e) {}
    var s = STEPS[i];
    if (s.page !== file()) {
      sessionStorage.setItem('vrinkTourStep', String(i));
      location.href = s.page;
      return;
    }
    idx = i;
    if (s.onEnter) try { s.onEnter(); } catch (e) {}
    render();
  }

  function render() {
    var s = STEPS[idx];
    var dots = STEPS.map(function (_, i) {
      return '<span class="vt-dot' + (i === idx ? ' on' : '') + '"></span>';
    }).join('');
    var lastLabel = s.finishLabel || '투어 마치기 ✅';
    tip.innerHTML =
      '<div class="vt-dots">' + dots + '</div>' +
      '<div class="vt-step">STEP ' + (idx + 1) + ' / ' + STEPS.length + '</div>' +
      '<h3 class="vt-title">' + s.title + '</h3>' +
      '<p class="vt-desc">' + s.desc + '</p>' +
      '<div class="vt-foot">' +
        '<button class="vt-skip">건너뛰기</button>' +
        '<div class="vt-btns">' +
          (idx > 0 ? '<button class="vt-prev">이전</button>' : '') +
          '<button class="vt-next">' + (idx === STEPS.length - 1 ? lastLabel : '다음') + '</button>' +
        '</div>' +
      '</div>';
    tip.querySelector('.vt-skip').onclick = function () { destroy(); };
    var prev = tip.querySelector('.vt-prev');
    if (prev) prev.onclick = function () { goto(idx - 1); requestAnimationFrame(position); };
    tip.querySelector('.vt-next').onclick = function () {
      if (idx === STEPS.length - 1) {
        destroy();
        if (s.finishHref && file() !== s.finishHref) location.href = s.finishHref;
        return;
      }
      goto(idx + 1);
      requestAnimationFrame(position);
    };
    requestAnimationFrame(position);
  }

  function mount() {
    if (!spot) {
      spot = document.createElement('div'); spot.id = 'vt-spot';
      tip = document.createElement('div'); tip.id = 'vt-tip';
      document.body.appendChild(spot);
      document.body.appendChild(tip);
      window.addEventListener('resize', position);
    }
  }

  function startAt(i) {
    mount();
    var s = STEPS[i];
    if (s.page !== file()) {
      sessionStorage.setItem('vrinkTourStep', String(i));
      location.href = s.page;
      return;
    }
    idx = i;
    if (s.onEnter) try { s.onEnter(); } catch (e) {}
    render();
  }

  function start() {
    if (file() !== HOME) {
      sessionStorage.setItem('vrinkTourStep', '0');
      location.href = HOME;
      return;
    }
    startAt(0);
  }

  function addGuideButton() {
    var topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('vt-guide-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'vt-guide-btn';
    btn.innerHTML = '📖 가이드';
    btn.onclick = start;
    topbar.insertBefore(btn, topbar.firstChild);
  }

  window.vrinkTour = { start: start };

  function init() {
    addGuideButton();
    var resume = sessionStorage.getItem('vrinkTourStep');
    if (resume !== null) {
      sessionStorage.removeItem('vrinkTourStep');
      var i = parseInt(resume, 10);
      if (!isNaN(i) && STEPS[i]) { setTimeout(function () { startAt(i); }, 350); return; }
    }
    if (file() === HOME && !localStorage.getItem('vrinkTourDone')) {
      setTimeout(start, 600);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
