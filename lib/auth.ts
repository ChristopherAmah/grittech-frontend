export type UserRole = "patient" | "provider"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  twoFactorEnabled?: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Local storage keys
const AUTH_KEY = "maternal_care_auth"
const USERS_KEY = "maternal_care_users"
const TWO_FACTOR_KEY = "maternal_care_2fa"

export function getAuthState(): AuthState {
  if (typeof window === "undefined") return { user: null, isAuthenticated: false }

  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return { user: null, isAuthenticated: false }

  return JSON.parse(stored)
}

export function setAuthState(state: AuthState) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state))
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveUser(user: User) {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.email === user.email)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  phone?: string,
): { success: boolean; error?: string; user?: User } {
  const existingUser = findUserByEmail(email)

  if (existingUser) {
    return { success: false, error: "Email already registered" }
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    role,
    phone,
    twoFactorEnabled: role === "provider",
    createdAt: new Date().toISOString(),
  }

  saveUser(user)

  // Store password (in production, this would be hashed)
  const passwords = JSON.parse(localStorage.getItem("maternal_care_passwords") || "{}")
  passwords[email] = password
  localStorage.setItem("maternal_care_passwords", JSON.stringify(passwords))

  return { success: true, user }
}

export function signIn(
  email: string,
  password: string,
): { success: boolean; error?: string; user?: User; requires2FA?: boolean } {
  const user = findUserByEmail(email)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  const passwords = JSON.parse(localStorage.getItem("maternal_care_passwords") || "{}")

  if (passwords[email] !== password) {
    return { success: false, error: "Invalid email or password" }
  }

  if (user.twoFactorEnabled) {
    return { success: true, user, requires2FA: true }
  }

  setAuthState({ user, isAuthenticated: true })
  return { success: true, user }
}

export function verify2FA(code: string, user: User): { success: boolean; error?: string } {
  // In production, this would verify against a TOTP or SMS code
  // For demo purposes, accept "123456"
  if (code === "123456") {
    setAuthState({ user, isAuthenticated: true })
    return { success: true }
  }

  return { success: false, error: "Invalid verification code" }
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY)
}

export function getCurrentUser(): User | null {
  const state = getAuthState()
  return state.user
}

export function isAuthenticated(): boolean {
  const state = getAuthState()
  return state.isAuthenticated
}
