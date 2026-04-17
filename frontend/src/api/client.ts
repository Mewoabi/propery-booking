export function getApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '')
  }
  return '/api'
}

export type ApiResult = {
  ok: boolean
  status: number
  data: unknown
  raw: string
}

export async function apiRequest(
  method: string,
  path: string,
  options?: { body?: unknown; query?: Record<string, string | undefined> },
): Promise<ApiResult> {
  const base = getApiBase()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  let url = `${base}${normalizedPath}`

  if (options?.query) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined && v !== '') params.set(k, v)
    }
    const q = params.toString()
    if (q) url += `?${q}`
  }

  const headers: HeadersInit = {}
  const hasBody =
    options?.body !== undefined &&
    method !== 'GET' &&
    method !== 'HEAD' &&
    method !== 'DELETE'

  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  })

  const raw = await res.text()
  let data: unknown = raw
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = raw
  }

  return { ok: res.ok, status: res.status, data, raw }
}
