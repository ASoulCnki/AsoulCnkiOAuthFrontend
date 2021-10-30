import axios from 'axios'

const devAPI = 'https://oauth.yllhwa.com/'

const instance = axios.create({
  baseURL: devAPI,
  timeout: 10000,
})

export async function getToken() {
  const { data, status } = await instance.post('/verify')
  if (status !== 200) return null
  return data.toString() || null
}

export async function verifyToken(token) {
  if (!token) return false
  const { data, status } = await instance.get(`/verify/${token}`)
  if (status !== 200) return false
  return data.isAuthed || false
}
