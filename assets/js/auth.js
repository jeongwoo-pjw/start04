/* ---- Auth page logic ---- */
(function () {
  const tabLogin = document.getElementById('tabLogin')
  const tabSignup = document.getElementById('tabSignup')
  const formLogin = document.getElementById('formLogin')
  const formSignup = document.getElementById('formSignup')
  const msgLogin = document.getElementById('msgLogin')
  const msgSignup = document.getElementById('msgSignup')

  function switchTab(tab) {
    const isLogin = tab === 'login'
    tabLogin.classList.toggle('active', isLogin)
    tabSignup.classList.toggle('active', !isLogin)
    formLogin.classList.toggle('hidden', !isLogin)
    formSignup.classList.toggle('hidden', isLogin)
  }

  tabLogin.addEventListener('click', () => switchTab('login'))
  tabSignup.addEventListener('click', () => switchTab('signup'))

  function showMsg(el, msg, isError = true) {
    el.textContent = msg
    el.className = 'auth-msg ' + (isError ? 'error' : 'success')
  }

  // 로그인
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value.trim()
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

  // 회원가입
  formSignup.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('signupEmail').value.trim()
    const password = document.getElementById('signupPassword').value
    const confirm = document.getElementById('signupConfirm').value
    const btn = formSignup.querySelector('button[type=submit]')

    if (password !== confirm) {
      return showMsg(msgSignup, '비밀번호가 일치하지 않습니다.')
    }
    if (password.length < 6) {
      return showMsg(msgSignup, '비밀번호는 6자 이상이어야 합니다.')
    }

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

  // 이미 로그인된 경우
  window.sb.auth.getSession().then(({ data: { session } }) => {
    if (session) location.href = 'board.html'
  })
})()
