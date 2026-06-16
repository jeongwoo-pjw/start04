;(function () {
  'use strict'

  const SYSTEM_PROMPT =
    'You are the AI learning assistant for AI EDU platform. ' +
    'Answer questions about AI education, machine learning, deep learning, and AI literacy in Korean. ' +
    'Keep answers concise and friendly.'

  let apiKey = null
  let messages = []
  let isLoading = false

  const fab       = document.getElementById('chatFab')
  const popup     = document.getElementById('chatPopup')
  const msgList   = document.getElementById('chatMessages')
  const input     = document.getElementById('chatInput')
  const sendBtn   = document.getElementById('chatSendBtn')
  const typing    = document.getElementById('chatTyping')
  const errorEl   = document.getElementById('chatError')

  async function loadApiKey () {
    try {
      const { data, error } = await window.sb
        .from('app_settings')
        .select('value')
        .eq('key', 'solar_api_key')
        .single()
      if (error || !data?.value) throw error || new Error('key empty')
      apiKey = data.value
    } catch (e) {
      console.warn('[Chat] API 키 로드 실패:', e)
    }
  }

  function escHtml (str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  }

  function appendMsg (role, text) {
    messages.push({ role, content: text })

    const div = document.createElement('div')
    div.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot')

    if (role === 'user') {
      div.innerHTML = `<div class="chat-bubble">${escHtml(text)}</div>`
    } else {
      div.innerHTML = `
        <div class="chat-avatar">🤖</div>
        <div class="chat-bubble">${escHtml(text)}</div>`
    }

    msgList.insertBefore(div, typing)
    msgList.scrollTop = msgList.scrollHeight
  }

  function setTyping (on) {
    typing.classList.toggle('visible', on)
    msgList.scrollTop = msgList.scrollHeight
  }

  function togglePopup () {
    const opened = popup.classList.toggle('open')
    fab.classList.toggle('open', opened)
    fab.setAttribute('aria-expanded', String(opened))
    if (opened) {
      if (messages.length === 0) {
        appendMsg('assistant', '안녕하세요! AI EDU AI 도우미입니다. AI 학습에 관해 무엇이든 질문해 주세요 😊')
      }
      setTimeout(() => input.focus(), 50)
    }
  }

  async function send () {
    const text = input.value.trim()
    if (!text || isLoading) return

    if (!apiKey) {
      errorEl.textContent = 'AI 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.'
      return
    }

    errorEl.textContent = ''
    input.value = ''
    input.style.height = '2.5rem'
    appendMsg('user', text)
    isLoading = true
    sendBtn.disabled = true
    setTyping(true)

    try {
      const res = await fetch('https://api.upstage.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'solar-pro',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-12)
          ],
          max_tokens: 700
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `HTTP ${res.status}`)
      }

      const data  = await res.json()
      const reply = data.choices?.[0]?.message?.content?.trim()
        || '답변을 생성할 수 없습니다. 다시 시도해 주세요.'

      setTyping(false)
      appendMsg('assistant', reply)
    } catch (e) {
      setTyping(false)
      errorEl.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      console.error('[Chat]', e)
    } finally {
      isLoading = false
      sendBtn.disabled = false
      input.focus()
    }
  }

  // ── 이벤트 ────────────────────────────────────────────────
  fab.addEventListener('click', togglePopup)

  sendBtn.addEventListener('click', send)

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  })

  input.addEventListener('input', () => {
    input.style.height = '2.5rem'
    input.style.height = Math.min(input.scrollHeight, 96) + 'px'
  })

  // Esc 키로 팝업 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('open')) togglePopup()
  })

  loadApiKey()
})()
