import { getUsers, type User } from "./auth"
import { getVitals, analyzeRisk, type VitalRecord } from "./vitals"

export interface PatientSummary {
  patient: User
  profile: any
  vitals: VitalRecord[]
  riskLevel: "low" | "medium" | "high"
  riskReasons: string[]
  lastVisit: string
  totalVitals: number
}

export function getAllPatients(): PatientSummary[] {
  const users = getUsers()
  const patients = users.filter((u) => u.role === "patient")

  const profiles = JSON.parse(localStorage.getItem("maternal_care_profiles") || "{}")

  return patients.map((patient) => {
    const vitals = getVitals(patient.id)
    const risk = analyzeRisk(vitals)
    const profile = profiles[patient.id]

    return {
      patient,
      profile,
      vitals,
      riskLevel: risk.level,
      riskReasons: risk.reasons,
      lastVisit: vitals.length > 0 ? vitals[0].date : "Never",
      totalVitals: vitals.length,
    }
  })
}

export function getPatientById(patientId: string): PatientSummary | null {
  const users = getUsers()
  const patient = users.find((u) => u.id === patientId && u.role === "patient")

  if (!patient) return null

  const profiles = JSON.parse(localStorage.getItem("maternal_care_profiles") || "{}")
  const vitals = getVitals(patient.id)
  const risk = analyzeRisk(vitals)
  const profile = profiles[patient.id]

  return {
    patient,
    profile,
    vitals,
    riskLevel: risk.level,
    riskReasons: risk.reasons,
    lastVisit: vitals.length > 0 ? vitals[0].date : "Never",
    totalVitals: vitals.length,
  }
}

export function getHighRiskPatients(): PatientSummary[] {
  return getAllPatients().filter((p) => p.riskLevel === "high" || p.riskLevel === "medium")
}

export function getAnalytics() {
  const patients = getAllPatients()

  const totalPatients = patients.length
  const highRisk = patients.filter((p) => p.riskLevel === "high").length
  const mediumRisk = patients.filter((p) => p.riskLevel === "medium").length
  const lowRisk = patients.filter((p) => p.riskLevel === "low").length

  const pregnant = patients.filter((p) => p.profile?.category === "pregnancy").length
  const nursing = patients.filter((p) => p.profile?.category === "nursing").length

  const totalVitals = patients.reduce((sum, p) => sum + p.totalVitals, 0)
  const avgVitalsPerPatient = totalPatients > 0 ? Math.round(totalVitals / totalPatients) : 0

  return {
    totalPatients,
    highRisk,
    mediumRisk,
    lowRisk,
    pregnant,
    nursing,
    totalVitals,
    avgVitalsPerPatient,
  }
}
