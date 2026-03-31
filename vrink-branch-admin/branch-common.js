/**
 * VRINK Branch Admin Common — Auth guard, logout, modal utilities
 */
(function () {
  /* ─── 0. Pretendard 폰트 + 공통 스타일 ───────────────── */
  var _pf = document.createElement('link');
  _pf.rel = 'stylesheet'; _pf.crossOrigin = '';
  _pf.href = 'https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/static/pretendard.css';
  document.head.insertBefore(_pf, document.head.firstChild);
  var _s = document.createElement('style');
  _s.textContent = "body,input,select,textarea,button{font-family:'Pretendard',sans-serif!important;}" +
    "input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range']),select{height:42px!important;box-sizing:border-box;}";
  document.head.appendChild(_s);

  /* ─── 1. 인증 가드 ───────────────────────────────────── */
  window.branchAuthGuard = function () {
    if (!sessionStorage.getItem('branchAuth')) {
      location.href = 'branch-login.html';
    }
  };

  /* ─── 2. 로그아웃 ────────────────────────────────────── */
  window.branchLogout = function () {
    if (confirm('로그아웃 하시겠습니까?')) {
      sessionStorage.removeItem('branchAuth');
      location.href = 'branch-login.html';
    }
  };

  /* ─── 3. 모달 열기/닫기 (전역) ──────────────────────── */
  window.openModal = function (id) {
    document.getElementById(id).classList.add('open');
  };
  window.closeModal = function (id) {
    document.getElementById(id).classList.remove('open');
  };

  /* ─── 4. 프로필/비밀번호 모달 전역 함수 ─────────────── */
  window.openProfileModal = function () {
    document.getElementById('cmProfileModal').classList.add('open');
  };

  window.openPasswordModal = function () {
    document.getElementById('cmPasswordModal').classList.add('open');
  };

  window.saveCmProfile = function () {
    var name  = document.getElementById('cmProfileName').value.trim() || '박지영';
    var email = document.getElementById('cmProfileEmail').value.trim();
    localStorage.setItem('branchProfileName', name);
    localStorage.setItem('branchProfileEmail', email);
    document.querySelectorAll('.user-drop-name, .user-name').forEach(function (el) {
      el.textContent = name;
    });
    document.getElementById('cmProfileModal').classList.remove('open');
  };

  window.saveCmPassword = function () {
    var current = document.getElementById('cmPwCurrent').value;
    var newPw   = document.getElementById('cmPwNew').value;
    var confirm = document.getElementById('cmPwConfirm').value;
    var hint    = document.getElementById('cmPwHint');

    if (!current) {
      hint.textContent = '현재 비밀번호를 입력해주세요.';
      hint.style.color = '#EC3D3D';
      return;
    }
    if (current !== '1234') {
      hint.textContent = '현재 비밀번호가 올바르지 않습니다.';
      hint.style.color = '#EC3D3D';
      return;
    }
    if (newPw.length < 4) {
      hint.textContent = '새 비밀번호를 입력해주세요.';
      hint.style.color = '#EC3D3D';
      return;
    }
    if (newPw !== confirm) {
      hint.textContent = '새 비밀번호가 일치하지 않습니다.';
      hint.style.color = '#EC3D3D';
      return;
    }
    hint.textContent = '비밀번호가 변경되었습니다.';
    hint.style.color = '#00B377';
    document.getElementById('cmPwCurrent').value = '';
    document.getElementById('cmPwNew').value     = '';
    document.getElementById('cmPwConfirm').value = '';
    setTimeout(function () {
      document.getElementById('cmPasswordModal').classList.remove('open');
      hint.textContent = '';
    }, 1200);
  };

  /* ─── 5. 토스트 알림 ──────────────────────────────────── */
  window.showBranchToast = function (msg, type) {
    var t = document.getElementById('branchToast');
    if (!t) return;
    t.textContent = msg;
    t.style.background = (type === 'error') ? '#EC3D3D' : '#111';
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(function () { t.classList.remove('show'); }, 2200);
  };

  /* ─── 6. DOMContentLoaded — 모달 HTML inject + 이벤트 ─ */
  document.addEventListener('DOMContentLoaded', function () {

    // 토스트 요소 생성
    var toastEl = document.createElement('div');
    toastEl.id = 'branchToast';
    toastEl.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(10px);background:#111;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;z-index:9999;white-space:nowrap;';
    var toastStyle = document.createElement('style');
    toastStyle.textContent = '#branchToast.show{opacity:1;transform:translateX(-50%) translateY(0);}';
    document.head.appendChild(toastStyle);
    document.body.appendChild(toastEl);

    // 저장된 이름 적용
    var savedName = localStorage.getItem('branchProfileName') || '박지영';
    document.querySelectorAll('.user-name').forEach(function (el) {
      el.textContent = savedName;
    });

    var modalCSS = `
      .cm-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,.5);
        z-index: 1000; display: none;
        align-items: center; justify-content: center;
      }
      .cm-modal-overlay.open { display: flex; }
      .cm-modal-box {
        background: #fff; border-radius: 20px; padding: 28px;
        width: 440px; max-width: 90vw;
        box-shadow: 0 24px 64px rgba(0,0,0,.18);
        animation: cmModalIn .18s ease;
      }
      @keyframes cmModalIn {
        from { opacity: 0; transform: scale(.96) translateY(8px); }
        to   { opacity: 1; transform: none; }
      }
      .cm-modal-title {
        font-size: 18px; font-weight: 500; color: #111; margin-bottom: 20px;
      }
      .cm-form-group { margin-bottom: 16px; }
      .cm-form-label {
        font-size: 12px; font-weight: 500; color: #505050;
        display: block; margin-bottom: 6px;
      }
      .cm-form-input {
        width: 100%; height: 42px;
        border: 1px solid #EDF2F6; border-radius: 8px;
        padding: 0 12px; font-size: 13px; font-family: inherit;
        color: #111; outline: none; box-sizing: border-box;
        transition: border-color .15s;
      }
      .cm-form-input:focus { border-color: #0095FF; }
      .cm-form-input:disabled { background: #F8F8FA; color: #767676; }
      .cm-form-hint { font-size: 11px; display: block; margin-top: 4px; }
      .cm-btn {
        display: inline-flex; align-items: center;
        padding: 8px 16px; border-radius: 6px;
        font-size: 13px; font-weight: 500; font-family: inherit;
        cursor: pointer; border: none;
      }
      .cm-btn-primary { background: #0095FF; color: #fff; }
      .cm-btn-primary:hover { background: #007DE0; }
      .cm-btn-outline { background: #fff; border: 1px solid #EDF2F6; color: #505050; }
      .cm-btn-outline:hover { background: #F8F8FA; }
      .cm-modal-footer {
        display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;
      }
      .cm-modal-close {
        float: right; background: none; border: none;
        font-size: 18px; cursor: pointer; color: #767676; line-height: 1;
      }
      .cm-modal-close:hover { color: #111; }
    `;

    var st = document.createElement('style');
    st.textContent = modalCSS;
    document.head.appendChild(st);

    var savedEmail = localStorage.getItem('branchProfileEmail') || 'seongsu@vrink.kr';

    var profileModalHTML = `
      <div class="cm-modal-overlay" id="cmProfileModal">
        <div class="cm-modal-box">
          <button class="cm-modal-close" onclick="document.getElementById('cmProfileModal').classList.remove('open')">&#x2715;</button>
          <div class="cm-modal-title">프로필 설정</div>
          <div class="cm-form-group">
            <label class="cm-form-label">이름</label>
            <input class="cm-form-input" id="cmProfileName" type="text" value="${savedName}">
          </div>
          <div class="cm-form-group">
            <label class="cm-form-label">지점명</label>
            <input class="cm-form-input" type="text" value="성수점" disabled>
          </div>
          <div class="cm-form-group">
            <label class="cm-form-label">이메일</label>
            <input class="cm-form-input" id="cmProfileEmail" type="email" value="${savedEmail}">
          </div>
          <div class="cm-modal-footer">
            <button class="cm-btn cm-btn-outline" onclick="document.getElementById('cmProfileModal').classList.remove('open')">취소</button>
            <button class="cm-btn cm-btn-primary" onclick="saveCmProfile()">저장</button>
          </div>
        </div>
      </div>`;

    var pwModalHTML = `
      <div class="cm-modal-overlay" id="cmPasswordModal">
        <div class="cm-modal-box">
          <button class="cm-modal-close" onclick="document.getElementById('cmPasswordModal').classList.remove('open')">&#x2715;</button>
          <div class="cm-modal-title">비밀번호 변경</div>
          <div class="cm-form-group">
            <label class="cm-form-label">현재 비밀번호</label>
            <input class="cm-form-input" id="cmPwCurrent" type="password" placeholder="현재 비밀번호 입력">
          </div>
          <div class="cm-form-group">
            <label class="cm-form-label">새 비밀번호</label>
            <input class="cm-form-input" id="cmPwNew" type="password" placeholder="새 비밀번호 입력">
          </div>
          <div class="cm-form-group">
            <label class="cm-form-label">새 비밀번호 확인</label>
            <input class="cm-form-input" id="cmPwConfirm" type="password" placeholder="새 비밀번호 재입력">
            <span class="cm-form-hint" id="cmPwHint"></span>
          </div>
          <div class="cm-modal-footer">
            <button class="cm-btn cm-btn-outline" onclick="document.getElementById('cmPasswordModal').classList.remove('open')">취소</button>
            <button class="cm-btn cm-btn-primary" onclick="saveCmPassword()">변경</button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', profileModalHTML + pwModalHTML);

    // overlay 클릭 시 모달 닫기
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('cm-modal-overlay')) {
        e.target.classList.remove('open');
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.cm-modal-overlay.open').forEach(function (m) {
          m.classList.remove('open');
        });
      }
    });
  });

})();
