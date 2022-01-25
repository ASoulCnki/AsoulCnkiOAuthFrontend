import axios from 'axios'

const devAPI = 'https://api.asoulcnki.asia/oauth/v1'

const instance = axios.create({
  baseURL: devAPI,
  timeout: 10000,
})

export async function getToken() {
  try {
    const { data, status } = await instance.get('/verify')
    if (status !== 200) return null
    return data.toString() || null
  } catch {
    return null
  }
}

export async function verifyToken(token) {
  if (!token) return false
  try {
    return await instance.get(`/verify`, {
      headers: {
        Authorization: token,
      },
    })
  } catch {
    return { code: 401 }
  }
}

export async function revokeToken(token) {
  if (!token) return false
  try {
    return await instance.delete(`/verify`, {
      headers: {
        Authorization: token,
      },
    })
  } catch {
    return { code: 401 }
  }
}

export async function getTempToken(token) {
  if (!token) return false
  try {
    return await instance.get(`/code`, {
      headers: {
        Authorization: token,
      },
    })
  } catch {
    return { code: 401 }
  }
}

export async function getBotUID() {
  let uid = sessionStorage.getItem('botUID')

  if (!uid) {
    const { data, status } = await instance.get('/uid')
    if (status !== 200) return null

    if (data.uid) {
      uid = data.uid
      sessionStorage.setItem('botUID', uid)
    }
  }

  return uid
}
