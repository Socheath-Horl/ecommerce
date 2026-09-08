const REFRESH_KEY = 'refreshToken'

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_KEY, token)
  } catch {
    /* storage unavailable */
  }
}

export function clearRefreshToken(): void {
  try {
    localStorage.removeItem(REFRESH_KEY)
  } catch {
    /* storage unavailable */
  }
}