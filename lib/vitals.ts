export interface VitalRecord {
  id: string
  userId: string
  date: string
  type: "weight" | "blood_pressure" | "glucose" | "breastfeeding" | "mood"
  value: string | number
  systolic?: number
  diastolic?: number
  notes?: string
  source: "manual" | "clinic"
  clinicName?: string
  clinicVisitDate?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "alert"
  read: boolean
  createdAt: string
}

const VITALS_KEY = "maternal_care_vitals"
const NOTIFICATIONS_KEY = "maternal_care_notifications"

export function getVitals(userId: string): VitalRecord[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(VITALS_KEY)
  const allVitals: VitalRecord[] = stored ? JSON.parse(stored) : []

  return allVitals
    .filter((v) => v.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function saveVital(vital: VitalRecord) {
  const stored = localStorage.getItem(VITALS_KEY)
  const allVitals: VitalRecord[] = stored ? JSON.parse(stored) : []

  allVitals.push(vital)
  localStorage.setItem(VITALS_KEY, JSON.stringify(allVitals))
}

export function getNotifications(userId: string): Notification[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(NOTIFICATIONS_KEY)
  const allNotifications: Notification[] = stored ? JSON.parse(stored) : []

  return allNotifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function markNotificationRead(notificationId: string) {
  const stored = localStorage.getItem(NOTIFICATIONS_KEY)
  const allNotifications: Notification[] = stored ? JSON.parse(stored) : []

  const notification = allNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications))
  }
}

export function createNotification(userId: string, title: string, message: string, type: "info" | "warning" | "alert") {
  const notification: Notification = {
    id: crypto.randomUUID(),
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  }

  const stored = localStorage.getItem(NOTIFICATIONS_KEY)
  const allNotifications: Notification[] = stored ? JSON.parse(stored) : []
  allNotifications.push(notification)
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications))
}

export function analyzeRisk(vitals: VitalRecord[]): { level: "low" | "medium" | "high"; reasons: string[] } {
  const reasons: string[] = []
  let riskScore = 0

  // Check blood pressure
  const recentBP = vitals.filter((v) => v.type === "blood_pressure").slice(0, 3)
  const highBP = recentBP.filter((v) => v.systolic && v.systolic > 140)
  if (highBP.length >= 2) {
    reasons.push("Elevated blood pressure readings")
    riskScore += 2
  }

  // Check glucose
  const recentGlucose = vitals.filter((v) => v.type === "glucose").slice(0, 3)
  const highGlucose = recentGlucose.filter((v) => typeof v.value === "number" && v.value > 140)
  if (highGlucose.length >= 2) {
    reasons.push("Elevated glucose levels")
    riskScore += 2
  }

  // Check mood
  const recentMood = vitals.filter((v) => v.type === "mood").slice(0, 5)
  const lowMood = recentMood.filter((v) => typeof v.value === "number" && v.value <= 2)
  if (lowMood.length >= 3) {
    reasons.push("Consistently low mood scores")
    riskScore += 1
  }

  if (riskScore >= 3) return { level: "high", reasons }
  if (riskScore >= 1) return { level: "medium", reasons }
  return { level: "low", reasons: ["All vitals within normal range"] }
}
