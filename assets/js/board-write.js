/* ---- Board write/edit logic ---- */
(function () {
  const params = new URLSearchParams(location.search)
  const editId = params.get('id')
  const isEdit = !!editId

  const pageTitle = document.getElementById('pageTitle')
  const form = document.getElementById('writeForm')
  const titleInput = document.getElementById('postTitle')
  const contentInput = document.getElementById('postContent')
  const submitBtn = document.getElementById('submitBtn')
  const msgEl = document.getElementById('writeMsg')

  let currentUser = null

  async function init() {
    const { data: { session } } = await window.sb.auth.getSession()
    currentUser = session?.user ?? null

    if (!currentUser) {
      location.href = 'login.html'
      return
    }

    if (isEdit) {
      pageTitle.textContent = '게시글 수정'
      submitBtn.textContent = '수정 완료'

      const { data: post, error } = await window.sb
        .from('posts')
        .select('*')
        .eq('id', editId)
        .single()

      if (error || !post) {
        msgEl.textContent = '게시글을 불러올 수 없습니다.'
        return
      }
      if (post.author_id !== currentUser.id) {
        msgEl.textContent = '수정 권한이 없습니다.'
        submitBtn.disabled = true
        return
      }

      titleInput.value = post.title
      contentInput.value = post.content
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const title = titleInput.value.trim()
    const content = contentInput.value.trim()

    if (!title) { showMsg('제목을 입력해주세요.'); return }
    if (!content) { showMsg('내용을 입력해주세요.'); return }

    submitBtn.disabled = true
    submitBtn.textContent = isEdit ? '수정 중...' : '등록 중...'

    let error

    if (isEdit) {
      ;({ error } = await window.sb.from('posts').update({
        title, content, updated_at: new Date().toISOString()
      }).eq('id', editId))
    } else {
      ;({ error } = await window.sb.from('posts').insert({
        title, content,
        author_id: currentUser.id,
        author_email: currentUser.email
      }))
    }

    if (error) {
      showMsg('저장 실패: ' + error.message)
      submitBtn.disabled = false
      submitBtn.textContent = isEdit ? '수정 완료' : '등록'
    } else {
      location.href = 'board.html'
    }
  })

  function showMsg(msg) {
    msgEl.textContent = msg
  }

  init()
})()
