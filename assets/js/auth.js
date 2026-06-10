/* ---- Auth page logic ---- */
(function () {
  const tabLogin  = document.getElementById('tabLogin')
  const tabSignup = document.getElementById('tabSignup')
  const formLogin = document.getElementById('formLogin')
  const formSignup = document.getElementById('formSignup')
  const msgLogin  = document.getElementById('msgLogin')
  const msgSignup = document.getElementById('msgSignup')

  function switchTab(tab) {
    const isLogin = tab === 'login'
    tabLogin.classList.toggle('active', isLogin)
    tabSignup.classList.toggle('active', !isLogin)
    formLogin.classList.toggle('hidden', !isLogin)
    formSignup.classList.toggle('hidden', isLogin)
  }

  tabLogin.addEventListener('click',  () => switchTab('login'))
  tabSignup.addEventListener('click', () => switchTab('signup'))

  function showMsg(el, msg, isError = true) {
    el.textContent = msg
    el.className = 'auth-msg ' + (isError ? 'error' : 'success')
  }

  // ── 이메일 로그인 ──────────────────────────────
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email    = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPassword').value
    const btn = formLogin.querySelector('button[type=submit]')
    btn.disabled = true
    btn.textContent = '로그인 중...'

    const { error } = await window.sb.auth.signInWithPassword({ email, password })
    btn.disabled = false
    btn.textContent = '로그인'

    if (error) {
      showMsg(msgLogin, error.message === 'Invalid login credentials'
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : error.message)
    } else {
      location.href = 'board.html'
    }
  })

  // ── 카카오 로그인 ──────────────────────────────
  const kakaoBtn = document.getElementById('kakaoLoginBtn')
  const msgSocial = document.getElementById('msgSocial')

  kakaoBtn.addEventListener('click', async () => {
    kakaoBtn.disabled = true
    kakaoBtn.textContent = '카카오 연결 중...'

    const { error } = await window.sb.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'https://jeongwoo-pjw.github.io/start04/board.html'
      }
    })

    // 성공 시 즉시 리다이렉트 → 아래는 오류일 때만 실행됨
    kakaoBtn.disabled = false
    kakaoBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.12 1.3 3.98 3.27 5.09L4 15l3.35-1.8C7.75 13.4 8.37 13.5 9 13.5c4.14 0 7.5-2.69 7.5-6S13.14 1.5 9 1.5z" fill="#191919"/>
    </svg> 카카오로 로그인`

    if (error) {
      const isDisabled = error.message?.toLowerCase().includes('provider') || error.status === 400
      showMsg(msgSocial,
        isDisabled
          ? '카카오 로그인이 비활성화 상태입니다. Supabase → Providers → Kakao 설정을 확인해주세요.'
          : `카카오 오류: ${error.message}`
      )
    }
  })

  // ── 회원가입 ───────────────────────────────────
  formSignup.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email    = document.getElementById('signupEmail').value.trim()
    const password = document.getElementById('signupPassword').value
    const confirm  = document.getElementById('signupConfirm').value
    const btn = formSignup.querySelector('button[type=submit]')

    if (password !== confirm) return showMsg(msgSignup, '비밀번호가 일치하지 않습니다.')
    if (password.length < 6)  return showMsg(msgSignup, '비밀번호는 6자 이상이어야 합니다.')

    btn.disabled = true
    btn.textContent = '가입 중...'

    const { error } = await window.sb.auth.signUp({ email, password })
    btn.disabled = false
    btn.textContent = '회원가입'

    if (error) {
      showMsg(msgSignup, error.message)
    } else {
      showMsg(msgSignup, '가입 완료! 이메일을 확인하거나 바로 로그인하세요.', false)
      setTimeout(() => switchTab('login'), 2000)
    }
  })

  // ── 이미 로그인된 경우 ─────────────────────────
  window.sb.auth.getSession().then(({ data: { session } }) => {
    if (session) location.href = 'board.html'
  })
})()
