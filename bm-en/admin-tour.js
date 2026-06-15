/* ─────────────────────────────────────────────────────────
   VRINK Branch Admin — Multi-page spotlight guide tour
   Flow: Home (menu·topbar) → Inventory → Menu (Edit Price) → Members
   - Auto-starts on Home at first visit (localStorage once)
   - Re-run anytime via the topbar [📖 Guide] button
   - Page navigation carries the step over via sessionStorage
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
    /* ── Home ── */
    {
      page: HOME, target: null,
      title: 'Branch Admin Page Guide 👋',
      desc: 'This is the admin screen for branches that have installed a VRINK device.\nWe will walk you through the most-used features. (about 1 min)\n\nThe page will navigate automatically along the way, so just follow along!'
    },
    {
      page: HOME, target: '.sidebar-nav',
      title: '① Menu',
      desc: 'The 9 menus you need to run your branch.\n\n· Store — order concentrate·supplies\n· Inventory — check·order stock\n· Order History / Sales — your branch orders·revenue\n· Menu — manage menus on sale and prices\n· Members — manage your branch members\n· Notices / Notifications — send announcements·alerts\n\nKiosk settings, policies, and promotions are managed by HQ.',
      pos: 'right'
    },
    {
      page: HOME, target: '.topbar',
      title: '② Top right',
      desc: '🔔 Notifications — branch alerts like low stock and device errors collect here. Check when a badge number appears!\n\n🏷 BuildUp Seongsu — shows your branch. Branch Admin accounts cannot switch branches.\n\n👤 Seongsu Kim — your account info and log out.',
      pos: 'bottom'
    },

    /* ── Inventory ── */
    {
      page: 'bm-inventory.html', target: '.filter-bar',
      title: '③ Inventory — Filter',
      desc: 'The branch is fixed to BuildUp Seongsu.\nUse the [Stock Status] filter to view only low·critical items.',
      pos: 'bottom'
    },
    {
      page: 'bm-inventory.html', target: '.table-wrap',
      title: '④ How to read Stock Status',
      desc: 'When current stock drops below safety stock, the status changes.\n\n🟢 Good — plenty in stock\n🟡 Low — schedule an order\n🔴 Critical — an [Urgent Order] button appears. Order right away!',
      pos: 'top'
    },
    {
      page: 'bm-inventory.html', target: '.btn-primary',
      title: '⑤ Order Concentrate',
      desc: 'When stock runs low, press the [Order Concentrate] button.\nYou will be taken to the Store to order the concentrate you need right away.\n\nWhen you need to correct the quantity manually, use [Adjust Stock].',
      pos: 'bottom'
    },

    /* ── Store (Order Concentrate) ── */
    {
      page: 'bm-storefront.html', target: '.storefront-wrap',
      title: '⑥ Ordering from the Store',
      desc: 'Pressing [Order Concentrate] brings you to this Store.\n\nJust add the quantity of concentrate you need and place the order!\nOnce delivery is complete, it is reflected in Inventory automatically,\nand [Last Restock] is updated too.',
      pos: 'right'
    },

    /* ── Menu (Edit Price) ── */
    {
      page: 'bm-menu.html', target: '.table-wrap',
      title: '⑦ Menu Management',
      desc: 'The list of menus shown on the kiosk.\nUse the top tabs to view Functional Shot/Flavor separately,\nand check each menu’s Base Price · Status · Orders.',
      pos: 'top'
    },
    {
      page: 'bm-menu.html', target: '#menuEditModal .modal',
      title: '⑧ Edit Price',
      desc: 'Pressing the [Edit] button on a menu row opens this popup.\n\nEnter the new price in the [Base Price] field and save,\nand it is reflected on the kiosk right away.\nStatus (On Sale/Sold Out/Hidden), Description,\nand Icon Image can all be changed here too.',
      pos: 'right',
      onEnter: function () { if (window.openMenuEdit) window.openMenuEdit(0); },
      onLeave: function () { if (window.closeModal) window.closeModal('menuEditModal'); }
    },

    /* ── Members ── */
    {
      page: 'bm-members.html', target: '.filter-bar',
      title: '⑨ Members — Search·Filter',
      desc: 'Narrow down members by name sort, Membership, and Status.\nYou can also use the dates on the right to narrow by join period.',
      pos: 'bottom'
    },
    {
      page: 'bm-members.html', target: '.table-wrap',
      title: '⑩ Member List',
      desc: 'Check your branch members’ Membership (cup pass remaining), Status,\nand last used time.\n\nPhone numbers are partially masked (010****) to protect personal data.',
      pos: 'top'
    },
    {
      page: 'bm-members.html', target: 'button[onclick="openMembershipModal()"]',
      title: '⑪ Apply Membership',
      desc: 'Select a member and press [Apply Membership]\nto top up a cup pass on the spot.\nUse it for cash-paying customers or CS compensation.',
      pos: 'bottom'
    },
    {
      page: 'bm-members.html', target: null,
      title: 'Guide complete! 🎉',
      desc: 'You have toured all the key flows.\n\n· Every morning: check key metrics + low stock on Home\n· When stock is low: Inventory → [Order Concentrate] → order in the Store\n· Once delivery is done, stock updates automatically\n· Price changes: Menu → Edit\n· Customer service: Members → Search → Apply Membership\n\nYou can revisit this anytime via the [📖 Guide] button.',
      finishLabel: 'Go to Home 🏠', finishHref: HOME
    }
  ];

  /* ── Styles ── */
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
    var lastLabel = s.finishLabel || 'Finish tour ✅';
    tip.innerHTML =
      '<div class="vt-dots">' + dots + '</div>' +
      '<div class="vt-step">STEP ' + (idx + 1) + ' / ' + STEPS.length + '</div>' +
      '<h3 class="vt-title">' + s.title + '</h3>' +
      '<p class="vt-desc">' + s.desc + '</p>' +
      '<div class="vt-foot">' +
        '<button class="vt-skip">Skip</button>' +
        '<div class="vt-btns">' +
          (idx > 0 ? '<button class="vt-prev">Back</button>' : '') +
          '<button class="vt-next">' + (idx === STEPS.length - 1 ? lastLabel : 'Next') + '</button>' +
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
    btn.innerHTML = '📖 Guide';
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
