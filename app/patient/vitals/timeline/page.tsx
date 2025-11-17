"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { getVitals, type VitalRecord } from "@/lib/vitals"
import { ArrowLeft, Activity, Heart, Droplet, Baby, Smile, Building2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function VitalsTimelinePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [vitals, setVitals] = useState<VitalRecord[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "patient") {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setVitals(getVitals(currentUser.id))
  }, [router])

  const getVitalIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Activity className="h-5 w-5" />
      case "blood_pressure":
        return <Heart className="h-5 w-5" />
      case "glucose":
        return <Droplet className="h-5 w-5" />
      case "breastfeeding":
        return <Baby className="h-5 w-5" />
      case "mood":
        return <Smile className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getVitalLabel = (type: string) => {
    switch (type) {
      case "weight":
        return "Weight"
      case "blood_pressure":
        return "Blood Pressure"
      case "glucose":
        return "Glucose"
      case "breastfeeding":
        return "Breastfeeding"
      case "mood":
        return "Mood"
      default:
        return type
    }
  }

  const formatValue = (vital: VitalRecord) => {
    switch (vital.type) {
      case "weight":
        return `${vital.value} lbs`
      case "blood_pressure":
        return `${vital.systolic}/${vital.diastolic} mmHg`
      case "glucose":
        return `${vital.value} mg/dL`
      case "breastfeeding":
        return `${vital.value} sessions`
      case "mood":
        return `${vital.value}/5`
      default:
        return vital.value
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/patient/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Health Timeline</CardTitle>
            <CardDescription>Complete history of your vital measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {vitals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No vitals recorded yet</p>
                <Button asChild>
                  <Link href="/patient/vitals/add">Add Your First Measurement</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {vitals.map((vital) => (
                  <div
                    key={vital.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      {getVitalIcon(vital.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{getVitalLabel(vital.type)}</h3>
                        <Badge variant={vital.source === "clinic" ? "default" : "secondary"} className="text-xs">
                          {vital.source === "clinic" ? "Clinic" : "Manual"}
                        </Badge>
                      </div>
                      <p className="text-2xl font-semibold text-purple-600 mb-1">{formatValue(vital)}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(vital.date), "MMMM dd, yyyy")}</span>
                        {vital.source === "clinic" && vital.clinicName && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>{vital.clinicName}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {vital.notes && <p className="text-sm text-muted-foreground mt-2 italic">{vital.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
