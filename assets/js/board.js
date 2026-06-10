/* ---- Board list logic ---- */
(function () {
  const PAGE_SIZE = 10
  let currentPage = 1
  let totalCount = 0
  let currentUser = null
  let userIsAdmin = false

  const params = new URLSearchParams(location.search)
  const boardType = params.get('type') || 'general'

  const BOARDS = {
    notice:  { label: '📢 공지사항', adminOnly: true,  empty: '등록된 공지사항이 없습니다.' },
    qna:     { label: '💬 Q&A',     adminOnly: false, empty: '아직 질문이 없습니다. 첫 질문을 남겨보세요!' },
    general: { label: '📋 게시판',   adminOnly: false, empty: '아직 게시글이 없습니다. 첫 글을 작성해보세요!' }
  }
  const board = BOARDS[boardType] || BOARDS.general

  // 헤더 타이틀 설정
  document.getElementById('boardTitle').textContent = board.label
  document.title = board.label.replace(/^\S+\s/, '') + ' | AI EDU'

  // 현재 활성 nav 하이라이트
  const activeNav = document.getElementById('nav-' + boardType)
  if (activeNav) activeNav.classList.add('nav-board-active')

  const listEl = document.getElementById('postList')
  const paginationEl = document.getElementById('pagination')
  const writeBtnWrap = document.getElementById('writeBtnWrap')
  const userInfoEl = document.getElementById('userInfo')
  const emptyEl = document.getElementById('emptyMsg')

  async function checkAdmin(userId) {
    const { data } = await window.sb
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    return data?.is_admin === true
  }

  async function init() {
    const { data: { session } } = await window.sb.auth.getSession()
    currentUser = session?.user ?? null

    if (currentUser) {
      userIsAdmin = await checkAdmin(currentUser.id)
      userInfoEl.innerHTML = `
        <span class="user-email">${currentUser.email}</span>
        <button class="btn btn-sm btn-ghost" id="logoutBtn">로그아웃</button>
      `
      document.getElementById('logoutBtn').addEventListener('click', async () => {
        await window.sb.auth.signOut()
        location.reload()
      })

      const canWrite = board.adminOnly ? userIsAdmin : true
      if (canWrite) {
        writeBtnWrap.innerHTML = `<a href="board-write.html?type=${boardType}" class="btn btn-primary btn-sm">✏ 글쓰기</a>`
      } else {
        writeBtnWrap.innerHTML = `<span class="admin-only-badge">🔒 관리자만 작성 가능</span>`
      }
    } else {
      userInfoEl.innerHTML = `<a href="login.html" class="btn btn-sm btn-outline">로그인</a>`
      if (!board.adminOnly) {
        writeBtnWrap.innerHTML = `<a href="login.html" class="btn btn-sm btn-ghost">로그인 후 작성 가능</a>`
      } else {
        writeBtnWrap.innerHTML = `<span class="admin-only-badge">🔒 관리자만 작성 가능</span>`
      }
    }

    await loadPosts()
  }

  async function loadPosts() {
    listEl.innerHTML = '<tr><td colspan="4" class="loading-row">불러오는 중...</td></tr>'

    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await window.sb
      .from('posts')
      .select('id, title, author_email, created_at', { count: 'exact' })
      .eq('board_type', boardType)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      listEl.innerHTML = `<tr><td colspan="4" class="loading-row">오류: ${error.message}</td></tr>`
      return
    }

    totalCount = count ?? 0

    if (!data.length) {
      listEl.innerHTML = ''
      emptyEl.querySelector('p:last-child').textContent = board.empty
      emptyEl.classList.remove('hidden')
      paginationEl.innerHTML = ''
      return
    }

    emptyEl.classList.add('hidden')
    listEl.innerHTML = data.map((post, idx) => {
      const num = totalCount - from - idx
      const date = new Date(post.created_at).toLocaleDateString('ko-KR')
      return `
        <tr class="post-row">
          <td class="td-num">${num}</td>
          <td class="td-title">
            <a href="board-detail.html?id=${post.id}&type=${boardType}">${escHtml(post.title)}</a>
          </td>
          <td class="td-author">${escHtml(post.author_email.split('@')[0])}</td>
          <td class="td-date">${date}</td>
        </tr>
      `
    }).join('')

    renderPagination()
  }

  function renderPagination() {
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return }

    let html = ''
    if (currentPage > 1) html += `<button class="page-btn" data-page="${currentPage - 1}">‹</button>`
    for (let p = 1; p <= totalPages; p++) {
      html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`
    }
    if (currentPage < totalPages) html += `<button class="page-btn" data-page="${currentPage + 1}">›</button>`

    paginationEl.innerHTML = html
    paginationEl.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page)
        loadPosts()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  }

  init()
})()
