let cachedToken: { access_token: string; expires_at: number } | null = null

async function refreshAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    grant_type: 'refresh_token',
  })

  const resp = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: params,
  })
  const data = await resp.json()

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  }

  return cachedToken.access_token
}

async function getAccessToken(): Promise<string> {
  if (!cachedToken || Date.now() > cachedToken.expires_at) {
    return await refreshAccessToken()
  }
  return cachedToken.access_token
}

async function myFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await getAccessToken()
  const url = `${process.env.ZOHO_API_DOMAIN}/crm/v8${endpoint}`
  return await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  })
    .then(async (response) => {
      if (response.status === 204) return {} as T
      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `HTTP error! status: ${response.status}, statusText: ${response.statusText}`
        )
      }
      return response.json() as Promise<T>
    })
    .catch((error) => {
      throw error
    })
}

export async function getRecordById<T = unknown>({
  module,
  id,
}: {
  module: string
  id: string
}) {
  return await myFetch<T>(`/${module}/${id}`)
}
