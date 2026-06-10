/* ---- Board list logic ---- */
(function () {
  const PAGE_SIZE = 10
  let currentPage = 1
  let totalCount = 0
  let currentUser = null

  const listEl = document.getElementById('postList')
  const paginationEl = document.getElementById('pagination')
  const writeBtnWrap = document.getElementById('writeBtnWrap')
  const userInfoEl = document.getElementById('userInfo')
  const emptyEl = document.getElementById('emptyMsg')

  async function init() {
    const { data: { session } } = await window.sb.auth.getSession()
    currentUser = session?.user ?? null

    if (currentUser) {
      writeBtnWrap.classList.remove('hidden')
      userInfoEl.innerHTML = `
        <span class="user-email">${currentUser.email}</span>
        <button class="btn btn-sm btn-ghost" id="logoutBtn">로그아웃</button>
      `
      document.getElementById('logoutBtn').addEventListener('click', async () => {
        await window.sb.auth.signOut()
        location.reload()
      })
    } else {
      userInfoEl.innerHTML = `<a href="login.html" class="btn btn-sm btn-outline">로그인</a>`
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
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      listEl.innerHTML = `<tr><td colspan="4" class="loading-row">오류: ${error.message}</td></tr>`
      return
    }

    totalCount = count ?? 0

    if (!data.length) {
      listEl.innerHTML = ''
      emptyEl.classList.remove('hidden')
      paginationEl.innerHTML = ''
      return
    }

    emptyEl.classList.add('hidden')
    listEl.innerHTML = data.map((post, idx) => {
      const num = totalCount - from - idx
      const date = new Date(post.created_at).toLocaleDateString('ko-KR')
      return `
        <tr class="post-row" data-id="${post.id}">
          <td class="td-num">${num}</td>
          <td class="td-title"><a href="board-detail.html?id=${post.id}">${escHtml(post.title)}</a></td>
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
