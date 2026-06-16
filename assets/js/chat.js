;(function () {
  'use strict'

  // OpenAI 는 CORS 문제로 Edge Function 프록시 경유
  const EDGE_URL = 'https://poudbyqhmmdqrxoandhf.supabase.co/functions/v1/ai-chat'
  const ANON_KEY = 'sb_publishable_mrcFpEOLM6s0BlaBaB9CoA_cE_xrrKE'

  const SYSTEM_PROMPT =
    'You are the AI learning assistant for AI EDU platform. ' +
    'Answer questions about AI education, machine learning, deep learning, and AI literacy in Korean. ' +
    'Keep answers concise and friendly.'

  let solarKey    = null
  let activeModel = 'solar'
  let messages    = []
  let isLoading   = false

  const fab        = document.getElementById('chatFab')
  const popup      = document.getElementById('chatPopup')
  const msgList    = document.getElementById('chatMessages')
  const input      = document.getElementById('chatInput')
  const sendBtn    = document.getElementById('chatSendBtn')
  const typing     = document.getElementById('chatTyping')
  const errorEl    = document.getElementById('chatError')
  const switchWrap = document.getElementById('chatModelSwitch')
  const tooltip    = document.getElementById('chatTooltip')

  // ── Solar API 키 로드 (Supabase) ──────────────────────────
  async function loadSolarKey () {
    try {
      const { data } = await window.sb
        .from('app_settings')
        .select('value')
        .eq('key', 'solar_api_key')
        .single()
      if (data?.value) solarKey = data.value
    } catch (e) {
      console.warn('[Chat] Solar 키 로드 실패:', e)
    }
  }

  // ── 모델 전환 ─────────────────────────────────────────────
  function setModel (model) {
    activeModel = model
    switchWrap.querySelectorAll('.cms-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.model === model)
    })
  }

  switchWrap.addEventListener('click', e => {
    const btn = e.target.closest('.cms-btn')
    if (!btn || btn.disabled) return
    setModel(btn.dataset.model)
  })

  // ── 유틸 ─────────────────────────────────────────────────
  function escHtml (str) {
    return str
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/\n/g, '<br>')
  }

  function appendMsg (role, text) {
    messages.push({ role, content: text })
    const div = document.createElement('div')
    div.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot')
    div.innerHTML = role === 'user'
      ? `<div class="chat-bubble">${escHtml(text)}</div>`
      : `<div class="chat-avatar">🤖</div><div class="chat-bubble">${escHtml(text)}</div>`
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
    tooltip.classList.toggle('hidden', opened)
    if (opened) {
      if (messages.length === 0) {
        appendMsg('assistant', '안녕하세요! AI EDU AI 도우미입니다. AI 학습에 관해 무엇이든 질문해 주세요 😊')
      }
      setTimeout(() => input.focus(), 50)
    }
  }

  // ── Solar: 브라우저에서 직접 호출 ────────────────────────
  async function callSolar (history) {
    if (!solarKey) throw new Error('Solar API 키를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.')
    const res = await fetch('https://api.upstage.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${solarKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'solar-pro',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        max_tokens: 700
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || `Solar HTTP ${res.status}`)
    return data.choices?.[0]?.message?.content?.trim()
  }

  // ── OpenAI: Edge Function 프록시 경유 ────────────────────
  async function callOpenAI (history) {
    const res = await fetch(EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history]
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`)
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('[Debug] ' + JSON.stringify(data).slice(0, 200))
    return reply
  }

  // ── 전송 ─────────────────────────────────────────────────
  async function send () {
    const text = input.value.trim()
    if (!text || isLoading) return

    errorEl.textContent = ''
    input.value = ''
    input.style.height = '2.75rem'
    appendMsg('user', text)
    isLoading = true
    sendBtn.disabled = true
    setTyping(true)

    try {
      const history = messages.slice(-12)
      const reply = activeModel === 'solar'
        ? await callSolar(history)
        : await callOpenAI(history)
      setTyping(false)
      appendMsg('assistant', reply || '답변을 생성할 수 없습니다. 다시 시도해 주세요.')
    } catch (e) {
      setTyping(false)
      errorEl.textContent = e.message || '오류가 발생했습니다.'
      console.error('[Chat]', e)
    } finally {
      isLoading = false
      sendBtn.disabled = false
      input.focus()
    }
  }

  // ── 이벤트 ────────────────────────────────────────────────
  fab.addEventListener('click', togglePopup)
  tooltip.addEventListener('click', togglePopup)
  sendBtn.addEventListener('click', send)

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  })

  input.addEventListener('input', () => {
    input.style.height = '2.75rem'
    input.style.height = Math.min(input.scrollHeight, 96) + 'px'
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('open')) togglePopup()
  })

  loadSolarKey()
})()
