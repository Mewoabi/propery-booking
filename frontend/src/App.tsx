import { useCallback, useMemo, useState } from 'react'
import { apiRequest, getApiBase, type ApiResult } from './api/client'
import './App.css'

type Tab = 'root' | 'user' | 'property' | 'booking'

function formatJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

function useRunRequest() {
  const [loading, setLoading] = useState(false)
  const [last, setLast] = useState<ApiResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (fn: () => Promise<ApiResult>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      setLast(result)
    } catch (e) {
      setLast(null)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, last, error, run }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('root')
  const { loading, last, error, run } = useRunRequest()

  const base = useMemo(() => getApiBase(), [])

  const [userId, setUserId] = useState('1')
  const [propertyId, setPropertyId] = useState('1')
  const [bookingId, setBookingId] = useState('1')

  const [userCreateJson, setUserCreateJson] = useState(
    '{\n  "name": "Jane Doe",\n  "email": "jane@example.com",\n  "phone_number": "+1 555 0100"\n}',
  )
  const [userPatchJson, setUserPatchJson] = useState(
    '{\n  "name": "Jane D."\n}',
  )

  const [propertyCreateJson, setPropertyCreateJson] = useState(
    '{\n  "title": "Seaside cabin",\n  "location": "Coast",\n  "price_per_night": 120,\n  "availability": "year-round"\n}',
  )
  const [propertyPatchJson, setPropertyPatchJson] = useState(
    '{\n  "price_per_night": 99\n}',
  )

  const [availabilityStart, setAvailabilityStart] = useState('2026-06-01')
  const [availabilityEnd, setAvailabilityEnd] = useState('2026-06-07')

  const [bookingCreateJson, setBookingCreateJson] = useState(
    '{\n  "user_id": 1,\n  "property_id": 1,\n  "start_date": "2026-07-01",\n  "end_date": "2026-07-05"\n}',
  )
  const [bookingPatchJson, setBookingPatchJson] = useState(
    '{\n  "start_date": "2026-07-02"\n}',
  )

  const parseBody = (raw: string): unknown => {
    const t = raw.trim()
    if (!t) return undefined
    try {
      return JSON.parse(t) as unknown
    } catch {
      throw new Error('Invalid JSON in request body')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Booking API explorer</h1>
        <p className="muted">
          Base URL: <code>{base}</code>
          {base === '/api' ? (
            <span>
              {' '}
              (Vite proxies <code>/api</code> →{' '}
              <code>http://localhost:3000</code>)
            </span>
          ) : null}
        </p>
        <p className="muted small">
          Override with <code>VITE_API_URL</code> (e.g.{' '}
          <code>http://localhost:3000</code>) — CORS is enabled on the Nest app.
        </p>
      </header>

      <nav className="tabs" aria-label="API sections">
        {(
          [
            ['root', 'GET /'],
            ['user', 'Users'],
            ['property', 'Properties'],
            ['booking', 'Bookings'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'tab active' : 'tab'}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="layout">
        <main className="panel">
          {tab === 'root' && (
            <section className="section">
              <h2>App root</h2>
              <button
                type="button"
                className="btn primary"
                disabled={loading}
                onClick={() => run(() => apiRequest('GET', '/'))}
              >
                GET /
              </button>
            </section>
          )}

          {tab === 'user' && (
            <section className="section">
              <h2>Users</h2>
              <div className="actions">
                <button
                  type="button"
                  className="btn primary"
                  disabled={loading}
                  onClick={() => run(() => apiRequest('GET', '/user'))}
                >
                  GET /user
                </button>
                <div className="row">
                  <label>
                    id{' '}
                    <input
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      inputMode="numeric"
                    />
                  </label>
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() => apiRequest('GET', `/user/${userId}`))
                    }
                  >
                    GET /user/:id
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    disabled={loading}
                    onClick={() =>
                      run(() => apiRequest('DELETE', `/user/${userId}`))
                    }
                  >
                    DELETE /user/:id
                  </button>
                </div>
                <div className="field">
                  <label>POST /user body (JSON)</label>
                  <textarea
                    rows={6}
                    value={userCreateJson}
                    onChange={(e) => setUserCreateJson(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('POST', '/user', {
                          body: parseBody(userCreateJson),
                        }),
                      )
                    }
                  >
                    POST /user
                  </button>
                </div>
                <div className="field">
                  <label>PATCH /user/:id body (JSON)</label>
                  <textarea
                    rows={4}
                    value={userPatchJson}
                    onChange={(e) => setUserPatchJson(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('PATCH', `/user/${userId}`, {
                          body: parseBody(userPatchJson),
                        }),
                      )
                    }
                  >
                    PATCH /user/:id
                  </button>
                </div>
              </div>
            </section>
          )}

          {tab === 'property' && (
            <section className="section">
              <h2>Properties</h2>
              <div className="actions">
                <button
                  type="button"
                  className="btn primary"
                  disabled={loading}
                  onClick={() => run(() => apiRequest('GET', '/property'))}
                >
                  GET /property
                </button>
                <div className="row">
                  <label>
                    id{' '}
                    <input
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      inputMode="numeric"
                    />
                  </label>
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() => apiRequest('GET', `/property/${propertyId}`))
                    }
                  >
                    GET /property/:id
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('DELETE', `/property/${propertyId}`),
                      )
                    }
                  >
                    DELETE /property/:id
                  </button>
                </div>
                <div className="field">
                  <label>
                    Availability —{' '}
                    <code>
                      GET /property/availiability/:id?startDate&amp;endDate
                    </code>{' '}
                    (matches backend path spelling)
                  </label>
                  <div className="row wrap">
                    <label>
                      startDate{' '}
                      <input
                        type="date"
                        value={availabilityStart}
                        onChange={(e) => setAvailabilityStart(e.target.value)}
                      />
                    </label>
                    <label>
                      endDate{' '}
                      <input
                        type="date"
                        value={availabilityEnd}
                        onChange={(e) => setAvailabilityEnd(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn"
                      disabled={loading}
                      onClick={() =>
                        run(() =>
                          apiRequest(
                            'GET',
                            `/property/availiability/${propertyId}`,
                            {
                              query: {
                                startDate: availabilityStart,
                                endDate: availabilityEnd,
                              },
                            },
                          ),
                        )
                      }
                    >
                      Run
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label>POST /property body (JSON)</label>
                  <textarea
                    rows={6}
                    value={propertyCreateJson}
                    onChange={(e) => setPropertyCreateJson(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('POST', '/property', {
                          body: parseBody(propertyCreateJson),
                        }),
                      )
                    }
                  >
                    POST /property
                  </button>
                </div>
                <div className="field">
                  <label>PATCH /property/:id body (JSON)</label>
                  <textarea
                    rows={4}
                    value={propertyPatchJson}
                    onChange={(e) => setPropertyPatchJson(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('PATCH', `/property/${propertyId}`, {
                          body: parseBody(propertyPatchJson),
                        }),
                      )
                    }
                  >
                    PATCH /property/:id
                  </button>
                </div>
              </div>
            </section>
          )}

          {tab === 'booking' && (
            <section className="section">
              <h2>Bookings</h2>
              <div className="actions">
                <button
                  type="button"
                  className="btn primary"
                  disabled={loading}
                  onClick={() => run(() => apiRequest('GET', '/booking'))}
                >
                  GET /booking
                </button>
                <div className="row">
                  <label>
                    id{' '}
                    <input
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      inputMode="numeric"
                    />
                  </label>
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() => apiRequest('GET', `/booking/${bookingId}`))
                    }
                  >
                    GET /booking/:id
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('DELETE', `/booking/${bookingId}`),
                      )
                    }
                  >
                    DELETE /booking/:id
                  </button>
                </div>
                <div className="field">
                  <label>POST /booking body (JSON)</label>
                  <textarea
                    rows={6}
                    value={bookingCreateJson}
                    onChange={(e) => setBookingCreateJson(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('POST', '/booking', {
                          body: parseBody(bookingCreateJson),
                        }),
                      )
                    }
                  >
                    POST /booking
                  </button>
                </div>
                <div className="field">
                  <label>PATCH /booking/:id body (JSON)</label>
                  <textarea
                    rows={4}
                    value={bookingPatchJson}
                    onChange={(e) => setBookingPatchJson(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn"
                    disabled={loading}
                    onClick={() =>
                      run(() =>
                        apiRequest('PATCH', `/booking/${bookingId}`, {
                          body: parseBody(bookingPatchJson),
                        }),
                      )
                    }
                  >
                    PATCH /booking/:id
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className="response" aria-live="polite">
          <h2>Response</h2>
          {loading && <p className="muted">Loading…</p>}
          {error && (
            <pre className="pre error">{error}</pre>
          )}
          {!loading && !error && last && (
            <>
              <p className={`status ${last.ok ? 'ok' : 'bad'}`}>
                HTTP {last.status} {last.ok ? 'OK' : ''}
              </p>
              <pre className="pre">{formatJson(last.data)}</pre>
            </>
          )}
          {!loading && !error && !last && (
            <p className="muted">Run a request to see the response here.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
