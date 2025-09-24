import { jwtDecode } from 'jwt-decode'

export const BASE_URL = 'http://localhost:5000/api/v1'
// export const BASE_URL = 'https://mad-rating-backend.vercel.app/api/v1'

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    const now = Date.now() / 1000
    return decoded.exp && decoded.exp < now
  } catch {
    return true
  }
}

export const getConfig = async (contentType = 'application/json') => {
  try {
    // ✅ Get token from localStorage
    let token = localStorage.getItem('accessToken')

    if (token && isTokenExpired(token)) {
      token = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/auth/sign-in'
    }

    const headers = {
      Accept: contentType,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (contentType !== 'multipart/form-data') {
      headers['Content-Type'] = contentType
    }

    return { headers }
  } catch {
    return {
      headers: {
        Accept: contentType,
        'Content-Type': contentType,
      },
    }
  }
}
