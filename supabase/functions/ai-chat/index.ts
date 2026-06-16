import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const { model, messages } = await req.json()

    // Supabase에서 API 키 읽기 (service role 권한)
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { data: settings } = await sb
      .from('app_settings')
      .select('key, value')
      .in('key', ['solar_api_key', 'openai_api_key'])

    const keys: Record<string, string> = {}
    settings?.forEach((r: { key: string; value: string }) => { keys[r.key] = r.value })

    let upstream: Response

    if (model === 'solar') {
      upstream = await fetch('https://api.upstage.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keys.solar_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'solar-pro', messages, max_tokens: 700 }),
      })
    } else {
      upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keys.openai_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: 700 }),
      })
    }

    const data = await upstream.json()

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
