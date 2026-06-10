/* ---- Board detail logic ---- */
(function () {
  const params = new URLSearchParams(location.search)
  const postId = params.get('id')
  if (!postId) { location.href = 'board.html'; return }

  const titleEl = document.getElementById('postTitle')
  const metaEl = document.getElementById('postMeta')
  const contentEl = document.getElementById('postContent')
  const actionsEl = document.getElementById('postActions')
  const deleteModal = document.getElementById('deleteModal')
  const confirmDelete = document.getElementById('confirmDelete')
  const cancelDelete = document.getElementById('cancelDelete')

  async function init() {
    const { data: { session } } = await window.sb.auth.getSession()
    const currentUser = session?.user ?? null

    const { data: post, error } = await window.sb
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (error || !post) {
      titleEl.textContent = '게시글을 찾을 수 없습니다.'
      return
    }

    titleEl.textContent = post.title
    metaEl.innerHTML = `
      <span>${post.author_email.split('@')[0]}</span>
      <span>${new Date(post.created_at).toLocaleString('ko-KR')}</span>
    `
    contentEl.innerHTML = nl2br(escHtml(post.content))

    if (currentUser && currentUser.id === post.author_id) {
      actionsEl.innerHTML = `
        <a href="board-write.html?id=${post.id}" class="btn btn-outline btn-sm">수정</a>
        <button class="btn btn-danger btn-sm" id="deleteBtn">삭제</button>
      `
      document.getElementById('deleteBtn').addEventListener('click', () => {
        deleteModal.classList.remove('hidden')
      })
    }
  }

  cancelDelete.addEventListener('click', () => deleteModal.classList.add('hidden'))

  confirmDelete.addEventListener('click', async () => {
    const { error } = await window.sb.from('posts').delete().eq('id', postId)
    if (error) { alert('삭제 실패: ' + error.message); return }
    location.href = 'board.html'
  })

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  }
  function nl2br(str) {
    return str.replace(/\n/g, '<br>')
  }

  init()
})()
