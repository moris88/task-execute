import dotenv from 'dotenv'
dotenv.config()

const FRESHSERVICE_DOMAIN = process.env.FRESHSERVICE_DOMAIN
const FRESHSERVICE_API_KEY = process.env.FRESHSERVICE_API_KEY

export async function myFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Normal behavior in production
  if (!FRESHSERVICE_DOMAIN || !FRESHSERVICE_API_KEY) {
    throw new Error(
      'FRESHSERVICE_DOMAIN and FRESHSERVICE_API_KEY must be set in environment variables'
    )
  }

  let url = endpoint
  if (!endpoint.startsWith('http')) {
    url = `https://${FRESHSERVICE_DOMAIN}.freshservice.com${endpoint}`
  }

  const credentials = `${FRESHSERVICE_API_KEY}:x`
  const encoded = Buffer.from(credentials).toString('base64')

  return await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encoded}`,
      ...options?.headers,
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

export async function getCustomObjectRecords({ id }: { id: number }): Promise<{
  records: Record<string, any>[]
  totalRecords: number
}> {
  let listRecords: Record<string, any>[] = []
  const perPage = 100
  let totalRecords: number
  let page = 0
  let hasMore = true
  do {
    const response = await myFetch<{
      records: any[]
      next_page_link: string
      meta: { total_records: number }
    }>(`/api/v2/objects/${id}/records?workspace_id=1&page=${page}&per_page=100`)
    const records = response.records || []
    totalRecords = response?.meta?.total_records ?? 0
    listRecords = [...listRecords, ...records]
    page++
    hasMore = records.length === perPage
  } while (hasMore)
  return {
    records: listRecords,
    totalRecords: totalRecords,
  }
}

export async function getCustomObjects() {
  return await myFetch<{
    custom_objects: any[]
    next_page_link: string
    meta: { count: number; page: number; per_page: number }
  }>('/api/v2/objects')
}

export async function deleteRecordCustomObject({
  id,
  recordId,
}: {
  id: number
  recordId: number
}) {
  if (!id || !recordId) {
    throw new Error('ID and record ID must be provided')
  }
  return await myFetch<boolean>(
    `/api/v2/objects/${id}/records/${recordId}?workspace_id=1`,
    {
      method: 'DELETE',
    }
  )
}

export async function getDepartments<T = unknown>({
  page = 1,
  perPage = 100,
}: {
  page?: number
  perPage?: number
}) {
  return await myFetch<{
    departments: T[]
  }>(`/api/v2/departments?page=${page}&per_page=${perPage}`)
}

export async function deleteDepartment({ id }: { id: number }) {
  return await myFetch<boolean>(`/api/v2/departments/${id}`, {
    method: 'DELETE',
  })
}

export async function getRequester({ id }: { id: number }) {
  if (!id) {
    throw new Error('ID and requester data must be provided')
  }
  if (typeof id !== 'number') {
    throw new Error('ID must be a number')
  }
  return await myFetch<{ requester: Record<string, any> }>(
    `/api/v2/requesters/${id}`,
    {
      method: 'GET',
    }
  )
}

export async function updateRequesters({
  id,
  requester,
}: {
  id: number
  requester: Record<string, any>
}) {
  if (!id || !requester) {
    throw new Error('ID and requester data must be provided')
  }
  if (typeof id !== 'number') {
    throw new Error('ID must be a number')
  }
  if (typeof requester !== 'object') {
    throw new Error('Requester data must be an object')
  }
  return await myFetch<boolean>(`/api/v2/requesters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requester),
  })
}
