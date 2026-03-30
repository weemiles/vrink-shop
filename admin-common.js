/**
 * VRINK Admin Common — Topbar dropdowns & Modal utilities
 */
(function () {
  /* ─── Shared CSS ─────────────────────────────────────── */
  const css = `
  /* ── Topbar dropdown base ── */
  .tb-drop-wrap { position: relative; display: inline-flex; align-items: center; }
  .tb-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    background: #fff; border: 1px solid #EDF2F6;
    border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,.13);
    z-index: 600; opacity: 0; pointer-events: none;
    transform: translateY(-6px);
    transition: opacity .18s, transform .18s;
  }
  .tb-dropdown.show { opacity: 1; pointer-events: auto; transform: translateY(0); }

  /* ── Notification dropdown ── */
  .notif-drop { width: 340px; }
  .notif-drop-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 12px; border-bottom: 1px solid #EDF2F6; }
  .notif-drop-title { font-size: 15px; font-weight: 500; color: #111; }
  .notif-read-all { background: none; border: none; font-size: 12px; color: #0095FF; font-weight: 500; cursor: pointer; }
  .notif-list { max-height: 320px; overflow-y: auto; }
  .notif-item { display: flex; gap: 12px; padding: 13px 18px; cursor: pointer; transition: background .12s; }
  .notif-item:hover { background: #F8F8FA; }
  .notif-item.unread { background: #F0F7FF; }
  .notif-item.unread:hover { background: #E6F3FF; }
  .notif-icon-wrap { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .notif-icon-wrap.warn { background: #FEF6E6; color: #E0A830; }
  .notif-icon-wrap.info { background: #E6F4FF; color: #0095FF; }
  .notif-icon-wrap.err  { background: #FDE8E8; color: #EC3D3D; }
  .notif-body { flex: 1; min-width: 0; }
  .notif-msg { font-size: 13px; color: #111; line-height: 1.4; font-weight: 500; }
  .notif-time { font-size: 11px; color: #A0A8B3; margin-top: 3px; }
  .notif-dot { width: 6px; height: 6px; border-radius: 50%; background: #0095FF; margin-top: 6px; flex-shrink: 0; }
  .notif-drop-footer { padding: 10px 18px; border-top: 1px solid #EDF2F6; text-align: center; }
  .notif-drop-footer a { font-size: 13px; color: #0095FF; font-weight: 500; text-decoration: none; }

  /* ── Branch dropdown ── */
  .branch-drop { width: 220px; padding: 8px; }
  .branch-drop-label { font-size: 11px; font-weight: 500; color: #A0A8B3; letter-spacing: .7px; text-transform: uppercase; padding: 4px 8px 8px; }
  .branch-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #505050; transition: background .12s; }
  .branch-item:hover { background: #F6F6F6; }
  .branch-item.selected { background: #EFF6FF; color: #0095FF; font-weight: 500; }
  .branch-check { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #D0D6DF; flex-shrink: 0; }
  .branch-item.selected .branch-check { border-color: #0095FF; background: #0095FF; }

  /* ── User dropdown ── */
  .user-drop { width: 200px; padding: 8px; }
  .user-drop-header { display: flex; align-items: center; gap: 10px; padding: 8px 10px 10px; }
  .user-drop-avatar { width: 36px; height: 36px; background: #0095FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500; color: #fff; flex-shrink: 0; }
  .user-drop-name { font-size: 13px; font-weight: 500; color: #111; }
  .user-drop-role { font-size: 11px; color: #767676; }
  .user-drop-divider { height: 1px; background: #EDF2F6; margin: 4px 0; }
  .user-drop-item { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #505050; transition: background .12s; }
  .user-drop-item:hover { background: #F6F6F6; }
  .user-drop-item.danger { color: #EC3D3D; }

  /* ── Modal overlay & box ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.45);
    display: none; align-items: center; justify-content: center;
    z-index: 800; padding: 20px;
  }
  .modal-overlay.open { display: flex; }
  .modal {
    background: #fff; border-radius: 20px; padding: 28px 28px 24px;
    width: 540px; max-width: 100%; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,.18);
    animation: modalIn .18s ease;
  }
  @keyframes modalIn { from { opacity:0; transform: scale(.96) translateY(8px); } to { opacity:1; transform: none; } }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
  .modal-title { font-size: 18px; font-weight: 500; color: #111; }
  .modal-close {
    background: #F4F5F7; border: none; cursor: pointer; color: #505050;
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 16px; line-height: 1;
  }
  .modal-close:hover { background: #EAEAEA; }
  .modal-body { display: flex; flex-direction: column; gap: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 500; color: #505050; }
  .form-input, .form-select {
    padding: 0 12px; height: 42px; box-sizing: border-box;
    border: 1.5px solid #E2E8F0; border-radius: 8px;
    font-size: 13px; color: #111; outline: none; font-family: inherit;
    background: #fff; transition: border-color .15s;
  }
  .form-textarea {
    padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px;
    font-size: 13px; color: #111; outline: none; font-family: inherit;
    background: #fff; transition: border-color .15s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #0095FF; }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-hint { font-size: 11px; color: #A0A8B3; }
  .modal-divider { height: 1px; background: #EDF2F6; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
  .modal-section-title { font-size: 13px; font-weight: 500; color: #505050; margin-bottom: -4px; }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F6F6F6; }
  .toggle-label { font-size: 13px; color: #111; }
  .toggle-sub  { font-size: 11px; color: #A0A8B3; margin-top: 1px; }
  .toggle-switch { position: relative; width: 38px; height: 22px; flex-shrink:0; }
  .toggle-switch input { opacity:0; width:0; height:0; }
  .toggle-slider { position:absolute; inset:0; background:#D0D6DF; border-radius:99px; cursor:pointer; transition:background .2s; }
  .toggle-slider:before { content:''; position:absolute; left:3px; top:3px; width:16px; height:16px; background:#fff; border-radius:50%; transition:transform .2s; }
  .toggle-switch input:checked + .toggle-slider { background:#0095FF; }
  .toggle-switch input:checked + .toggle-slider:before { transform:translateX(16px); }

  /* ── Typography: Regular(400) + Medium(500) only ── */
  b, strong { font-weight: 500 !important; }
  th { font-weight: 500; }
  `;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ─── Notification data ──────────────────────────────── */
  const notifications = [
    { type: 'warn', icon: '⚠️', msg: '강남점 디스펜서 #3 재고 부족 (잔여 12%)', time: '5분 전', unread: true },
    { type: 'info', icon: '📦', msg: '성수빌드업 재고 입고 완료 (단백질 파우더 외 3종)', time: '23분 전', unread: true },
    { type: 'err',  icon: '🔴', msg: '홍대점 키오스크 K-02 연결 끊김', time: '1시간 전', unread: false },
    { type: 'info', icon: '🛒', msg: '자사몰 신규 주문 7건 접수', time: '2시간 전', unread: false },
    { type: 'warn', icon: '🔔', msg: '사전예약 오픈 D-1 알림', time: '어제', unread: false },
  ];

  const branches = [
    '성수빌드업', '강남점', '홍대점', '잠실점', '분당점', '인천점',
  ];

  /* ─── Build notification dropdown HTML ─────────────── */
  function buildNotifDrop() {
    const items = notifications.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-icon-wrap ${n.type}">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-msg">${n.msg}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="notif-dot"></div>' : ''}
      </div>`).join('');
    return `<div class="tb-dropdown notif-drop" id="notifDrop">
      <div class="notif-drop-header">
        <span class="notif-drop-title">알림</span>
        <button class="notif-read-all" onclick="markAllRead()">모두 읽음</button>
      </div>
      <div class="notif-list">${items}</div>
      <div class="notif-drop-footer"><a href="admin-notification.html">전체 알림 보기 →</a></div>
    </div>`;
  }

  function buildBranchDrop() {
    const current = document.querySelector('.topbar-branch')?.textContent?.replace('▾','').trim() || '성수빌드업';
    const items = branches.map(b => `
      <div class="branch-item ${b === current ? 'selected' : ''}" onclick="selectBranch(this,'${b}')">
        <div class="branch-check"></div>${b}
      </div>`).join('');
    return `<div class="tb-dropdown branch-drop" id="branchDrop">
      <div class="branch-drop-label">지점 선택</div>
      ${items}
    </div>`;
  }

  function buildUserDrop() {
    return `<div class="tb-dropdown user-drop" id="userDrop">
      <div class="user-drop-header">
        <div class="user-drop-avatar">A</div>
        <div>
          <div class="user-drop-name">admin</div>
          <div class="user-drop-role">관리자</div>
        </div>
      </div>
      <div class="user-drop-divider"></div>
      <div class="user-drop-item" onclick="openProfileModal()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        프로필 설정
      </div>
      <div class="user-drop-item" onclick="openPasswordModal()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        비밀번호 변경
      </div>
      <div class="user-drop-divider"></div>
      <div class="user-drop-item danger" onclick="if(confirm('로그아웃 하시겠습니까?')) location.href='admin-index.html'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        로그아웃
      </div>
    </div>`;
  }

  /* ─── Wire topbar on DOMContentLoaded ──────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const notifBtn = document.querySelector('.topbar-btn.notif-btn, .notif-btn');
    const branchBtn = document.querySelector('.topbar-branch');
    const userDiv = document.querySelector('.topbar-user');

    function wrapAndInject(el, html) {
      if (!el) return null;
      const wrap = document.createElement('div');
      wrap.className = 'tb-drop-wrap';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      wrap.insertAdjacentHTML('beforeend', html);
      return wrap.querySelector('.tb-dropdown');
    }

    const notifDrop  = wrapAndInject(notifBtn,  buildNotifDrop());
    const branchDrop = wrapAndInject(branchBtn, buildBranchDrop());
    const userDrop   = wrapAndInject(userDiv,   buildUserDrop());

    function toggleDrop(drop, others) {
      const isOpen = drop.classList.contains('show');
      others.forEach(d => d && d.classList.remove('show'));
      drop.classList.toggle('show', !isOpen);
    }

    if (notifBtn)  notifBtn.addEventListener('click',  e => { e.stopPropagation(); toggleDrop(notifDrop,  [branchDrop, userDrop]); });
    if (branchBtn) branchBtn.addEventListener('click', e => { e.stopPropagation(); toggleDrop(branchDrop, [notifDrop, userDrop]); });
    if (userDiv)   userDiv.addEventListener('click',   e => { e.stopPropagation(); toggleDrop(userDrop,   [notifDrop, branchDrop]); });

    document.addEventListener('click', function () {
      [notifDrop, branchDrop, userDrop].forEach(d => d && d.classList.remove('show'));
    });

    // ── modal overlay close ──
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
        [notifDrop, branchDrop, userDrop].forEach(d => d && d.classList.remove('show'));
      }
    });

    // ── Inject profile & password modals ──
    const modalCSS = `
    .cm-modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:1000;padding:20px; }
    .cm-modal-overlay.open { display:flex; }
    .cm-modal { background:#fff;border-radius:20px;padding:28px;width:440px;max-width:100%;box-shadow:0 24px 64px rgba(0,0,0,.18);animation:modalIn .18s ease; }
    .cm-modal-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:22px; }
    .cm-modal-title { font-size:18px;font-weight:500;color:#111; }
    .cm-modal-close { background:#F4F5F7;border:none;cursor:pointer;color:#505050;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px; }
    .cm-modal-close:hover { background:#EAEAEA; }
    .cm-form-group { display:flex;flex-direction:column;gap:6px;margin-bottom:14px; }
    .cm-form-label { font-size:12px;font-weight:500;color:#505050; }
    .cm-form-input { padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;color:#111;outline:none;font-family:inherit;transition:border-color .15s; }
    .cm-form-input:focus { border-color:#0095FF; }
    .cm-form-hint { font-size:11px;color:#A0A8B3; }
    .cm-avatar-row { display:flex;align-items:center;gap:16px;margin-bottom:18px; }
    .cm-avatar-big { width:64px;height:64px;background:#0095FF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:500;color:#fff;flex-shrink:0; }
    .cm-modal-footer { display:flex;justify-content:flex-end;gap:8px;margin-top:20px; }
    .cm-btn { display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:inherit; }
    .cm-btn-primary { background:#0095FF;color:#fff; }
    .cm-btn-outline { background:#fff;color:#505050;border:1px solid #EDF2F6; }
    `;
    const st2 = document.createElement('style');
    st2.textContent = modalCSS;
    document.head.appendChild(st2);

    const profileModalHTML = `
    <div class="cm-modal-overlay" id="cmProfileModal">
      <div class="cm-modal">
        <div class="cm-modal-header">
          <span class="cm-modal-title">프로필 설정</span>
          <button class="cm-modal-close" onclick="document.getElementById('cmProfileModal').classList.remove('open')">✕</button>
        </div>
        <div class="cm-avatar-row">
          <div class="cm-avatar-big" id="cmAvatarPreview">A</div>
          <div>
            <button class="cm-btn cm-btn-outline" style="font-size:12px;padding:7px 14px;" onclick="document.getElementById('cmAvatarInput').click()">사진 변경</button>
            <input id="cmAvatarInput" type="file" accept="image/*" style="display:none" onchange="previewCmAvatar(this)">
            <div style="font-size:11px;color:#A0A8B3;margin-top:5px;">JPG, PNG · 최대 2MB</div>
          </div>
        </div>
        <div class="cm-form-group">
          <label class="cm-form-label">이름</label>
          <input class="cm-form-input" id="cmProfileName" value="admin" />
        </div>
        <div class="cm-form-group">
          <label class="cm-form-label">이메일</label>
          <input class="cm-form-input" id="cmProfileEmail" value="admin@vrink.com" type="email" />
        </div>
        <div class="cm-form-group">
          <label class="cm-form-label">역할</label>
          <input class="cm-form-input" value="관리자" readonly style="background:#F8F8FA;color:#767676;" />
        </div>
        <div class="cm-modal-footer">
          <button class="cm-btn cm-btn-outline" onclick="document.getElementById('cmProfileModal').classList.remove('open')">취소</button>
          <button class="cm-btn cm-btn-primary" onclick="saveCmProfile()">저장</button>
        </div>
      </div>
    </div>`;

    const pwModalHTML = `
    <div class="cm-modal-overlay" id="cmPasswordModal">
      <div class="cm-modal">
        <div class="cm-modal-header">
          <span class="cm-modal-title">비밀번호 변경</span>
          <button class="cm-modal-close" onclick="document.getElementById('cmPasswordModal').classList.remove('open')">✕</button>
        </div>
        <div class="cm-form-group">
          <label class="cm-form-label">현재 비밀번호</label>
          <input class="cm-form-input" id="cmPwCurrent" type="password" placeholder="현재 비밀번호 입력" />
        </div>
        <div class="cm-form-group">
          <label class="cm-form-label">새 비밀번호</label>
          <input class="cm-form-input" id="cmPwNew" type="password" placeholder="8자 이상 영문+숫자" />
        </div>
        <div class="cm-form-group">
          <label class="cm-form-label">새 비밀번호 확인</label>
          <input class="cm-form-input" id="cmPwConfirm" type="password" placeholder="새 비밀번호 재입력" />
          <span class="cm-form-hint" id="cmPwHint"></span>
        </div>
        <div class="cm-modal-footer">
          <button class="cm-btn cm-btn-outline" onclick="document.getElementById('cmPasswordModal').classList.remove('open')">취소</button>
          <button class="cm-btn cm-btn-primary" onclick="saveCmPassword()">변경</button>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', profileModalHTML + pwModalHTML);
  });

  /* ─── Global helpers ────────────────────────────────── */
  window.openModal  = function (id) { document.getElementById(id).classList.add('open'); };
  window.closeModal = function (id) { document.getElementById(id).classList.remove('open'); };

  window.markAllRead = function () {
    document.querySelectorAll('.notif-item.unread').forEach(function(el) { el.classList.remove('unread'); });
    document.querySelectorAll('.notif-dot').forEach(function(el) { el.remove(); });
    const badge = document.querySelector('.notif-badge');
    if (badge) badge.style.display = 'none';
  };

  window.selectBranch = function (el, name) {
    document.querySelectorAll('.branch-item').forEach(function(b) { b.classList.remove('selected'); });
    el.classList.add('selected');
    const btn = document.querySelector('.topbar-branch');
    if (btn) btn.textContent = name + ' ▾';
    setTimeout(function() { document.getElementById('branchDrop').classList.remove('show'); }, 150);
  };

  window.openProfileModal = function () {
    document.getElementById('cmProfileModal').classList.add('open');
    document.getElementById('userDrop').classList.remove('show');
  };

  window.openPasswordModal = function () {
    document.getElementById('cmPasswordModal').classList.add('open');
    document.getElementById('userDrop').classList.remove('show');
  };

  window.previewCmAvatar = function (inp) {
    if (!inp.files[0]) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var el = document.getElementById('cmAvatarPreview');
      el.style.background = 'transparent';
      el.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
      document.querySelectorAll('.user-drop-avatar, .user-avatar').forEach(function(av) {
        av.style.background = 'transparent';
        av.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
      });
    };
    reader.readAsDataURL(inp.files[0]);
  };

  window.saveCmProfile = function () {
    var name = document.getElementById('cmProfileName').value.trim() || 'admin';
    document.querySelectorAll('.user-drop-name, .user-name').forEach(function(el) { el.textContent = name; });
    document.querySelectorAll('.user-drop-avatar, .user-avatar').forEach(function(el) {
      if (!el.querySelector('img')) el.textContent = name.charAt(0).toUpperCase();
    });
    document.getElementById('cmAvatarPreview').innerHTML = name.charAt(0).toUpperCase();
    document.getElementById('cmProfileModal').classList.remove('open');
  };

  window.saveCmPassword = function () {
    var current = document.getElementById('cmPwCurrent').value;
    var newPw = document.getElementById('cmPwNew').value;
    var confirm = document.getElementById('cmPwConfirm').value;
    var hint = document.getElementById('cmPwHint');
    if (!current) { hint.textContent = '현재 비밀번호를 입력해주세요.'; hint.style.color = '#EC3D3D'; return; }
    if (newPw.length < 8) { hint.textContent = '비밀번호는 8자 이상이어야 합니다.'; hint.style.color = '#EC3D3D'; return; }
    if (newPw !== confirm) { hint.textContent = '새 비밀번호가 일치하지 않습니다.'; hint.style.color = '#EC3D3D'; return; }
    hint.textContent = '비밀번호가 변경되었습니다.'; hint.style.color = '#00B377';
    document.getElementById('cmPwCurrent').value = '';
    document.getElementById('cmPwNew').value = '';
    document.getElementById('cmPwConfirm').value = '';
    setTimeout(function() { document.getElementById('cmPasswordModal').classList.remove('open'); hint.textContent = ''; }, 1200);
  };

})();
