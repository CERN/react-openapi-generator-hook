import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  http.get('/data', async ({ request }) => {
    // optional dynamic delay, e.g. from query ?delay=1500
    const url = new URL(request.url)
    const ms = Number(url.searchParams.get('delay') ?? 1500)
    await delay(ms); // simulates a slow network
    return HttpResponse.json({ items: ['a', 'b', 'c'] }, { status: 200 })
  }),
]
