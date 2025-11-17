"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { getPatientById } from "@/lib/provider"
import { getNotifications } from "@/lib/vitals"
import { Heart, ArrowLeft, Mail, Phone, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { VitalsChart } from "@/components/vitals-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [patientSummary, setPatientSummary] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "provider") {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)

    const patientId = params.id as string
    const summary = getPatientById(patientId)

    if (!summary) {
      router.push("/provider/dashboard")
      return
    }

    setPatientSummary(summary)
    setNotifications(getNotifications(patientId))
  }, [router, params.id])

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>
      case "medium":
        return <Badge variant="default">Medium Risk</Badge>
      default:
        return <Badge variant="secondary">Low Risk</Badge>
    }
  }

  if (!user || !patientSummary) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <span className="text-xl font-semibold">MaternalCare</span>
              <p className="text-xs text-muted-foreground">Provider Portal</p>
            </div>
          </div>

          <Button variant="ghost" asChild>
            <Link href="/provider/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 py-8 space-y-6">
        {/* Patient Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{patientSummary.patient.name}</CardTitle>
                  {getRiskBadge(patientSummary.riskLevel)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {patientSummary.patient.email}
                  </div>
                  {patientSummary.patient.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {patientSummary.patient.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-lg font-semibold">
                  {patientSummary.profile?.category === "pregnancy" ? "Pregnant" : "Nursing"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                <p className="text-lg font-semibold">{format(new Date(patientSummary.lastVisit), "MMM dd, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vitals</p>
                <p className="text-lg font-semibold">{patientSummary.totalVitals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        {patientSummary.riskLevel !== "low" && (
          <Card className="border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patientSummary.riskReasons.map((reason: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vitals">Vitals & Trends</TabsTrigger>
            <TabsTrigger value="profile">Medical Profile</TabsTrigger>
            <TabsTrigger value="history">Activity History</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals">
            <VitalsChart vitals={patientSummary.vitals} />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientSummary.profile?.emergencyContact && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                    <p className="text-base">
                      {patientSummary.profile.emergencyContact} - {patientSummary.profile.emergencyPhone}
                    </p>
                  </div>
                )}

                {patientSummary.profile?.medicalHistory && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical History</p>
                    <p className="text-base">{patientSummary.profile.medicalHistory}</p>
                  </div>
                )}

                {patientSummary.profile?.allergies && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                    <p className="text-base">{patientSummary.profile.allergies}</p>
                  </div>
                )}

                {patientSummary.profile?.currentMedications && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Medications</p>
                    <p className="text-base">{patientSummary.profile.currentMedications}</p>
                  </div>
                )}

                {patientSummary.profile?.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expected Due Date</p>
                    <p className="text-base">{format(new Date(patientSummary.profile.dueDate), "PPP")}</p>
                  </div>
                )}

                {patientSummary.profile?.birthDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Baby's Birth Date</p>
                    <p className="text-base">{format(new Date(patientSummary.profile.birthDate), "PPP")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Vitals and notifications history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientSummary.vitals.slice(0, 10).map((vital: any) => (
                    <div key={vital.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium capitalize">{vital.type.replace("_", " ")}</p>
                        <p className="text-sm text-muted-foreground">
                          {vital.type === "blood_pressure"
                            ? `${vital.systolic}/${vital.diastolic}`
                            : typeof vital.value === "number"
                              ? vital.value
                              : vital.value}
                          {vital.notes && ` - ${vital.notes}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{format(new Date(vital.date), "MMM dd, yyyy")}</p>
                        <Badge variant="outline" className="mt-1">
                          {vital.source}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {patientSummary.vitals.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
