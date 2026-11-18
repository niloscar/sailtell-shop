import api from './apiClient'

export type Issue = {
  number: number
  title: string
  url: string
  author: string
}

export async function getIssues() {
  const response = await api.get<Issue[]>('/issues')
  return response.data
}

export async function createIssue(title: string, description: string) {
  const response = await api.post('/issues', { title, description })
  return response.data
}
