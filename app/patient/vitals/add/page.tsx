"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser } from "@/lib/auth"
import { saveVital, createNotification, type VitalRecord } from "@/lib/vitals"
import { ArrowLeft, Info, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddVitalsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [vitalType, setVitalType] = useState<"weight" | "blood_pressure" | "glucose" | "breastfeeding" | "mood">(
    "weight",
  )
  const [source, setSource] = useState<"manual" | "clinic">("manual")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [clinicName, setClinicName] = useState("")
  const [clinicVisitDate, setClinicVisitDate] = useState(new Date().toISOString().split("T")[0])
  const [showSuccess, setShowSuccess] = useState(false)

  // Weight
  const [weight, setWeight] = useState("")

  // Blood Pressure
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")

  // Glucose
  const [glucose, setGlucose] = useState("")

  // Breastfeeding
  const [breastfeedingFreq, setBreastfeedingFreq] = useState("")

  // Mood
  const [mood, setMood] = useState("3")

  // Notes
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "patient") {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push("/patient/dashboard")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const value: string | number = ""
    const vitalRecord: VitalRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      date,
      type: vitalType,
      value: "",
      source,
      notes,
      ...(source === "clinic" && (vitalType === "blood_pressure" || vitalType === "glucose")
        ? { clinicName, clinicVisitDate }
        : {}),
    }

    switch (vitalType) {
      case "weight":
        if (!weight || Number.parseFloat(weight) <= 0) {
          alert("Please enter a valid weight")
          return
        }
        vitalRecord.value = Number.parseFloat(weight)
        break
      case "blood_pressure":
        if (!systolic || !diastolic || Number.parseInt(systolic) <= 0 || Number.parseInt(diastolic) <= 0) {
          alert("Please enter valid blood pressure readings")
          return
        }
        vitalRecord.systolic = Number.parseInt(systolic)
        vitalRecord.diastolic = Number.parseInt(diastolic)
        vitalRecord.value = `${systolic}/${diastolic}`

        // Check for high BP and create notification
        if (Number.parseInt(systolic) > 140 || Number.parseInt(diastolic) > 90) {
          createNotification(
            user.id,
            "High Blood Pressure Detected",
            "Your recent blood pressure reading is elevated. Please consult with your healthcare provider.",
            "warning",
          )
        }
        break
      case "glucose":
        if (!glucose || Number.parseFloat(glucose) <= 0) {
          alert("Please enter a valid glucose level")
          return
        }
        vitalRecord.value = Number.parseFloat(glucose)

        // Check for high glucose and create notification
        if (Number.parseFloat(glucose) > 140) {
          createNotification(
            user.id,
            "Elevated Glucose Level",
            "Your glucose reading is higher than normal. Consider discussing this with your doctor.",
            "warning",
          )
        }
        break
      case "breastfeeding":
        if (!breastfeedingFreq || Number.parseInt(breastfeedingFreq) < 0) {
          alert("Please enter a valid number of breastfeeding sessions")
          return
        }
        vitalRecord.value = Number.parseInt(breastfeedingFreq)
        break
      case "mood":
        vitalRecord.value = Number.parseInt(mood)

        // Check for low mood and create notification
        if (Number.parseInt(mood) <= 2) {
          createNotification(
            user.id,
            "Low Mood Detected",
            "We noticed you're feeling down. Consider reaching out to your healthcare provider or support network.",
            "info",
          )
        }
        break
    }

    saveVital(vitalRecord)
    setShowSuccess(true)
  }

  if (!user) return null

  const requiresClinicDetails = source === "clinic" && (vitalType === "blood_pressure" || vitalType === "glucose")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/patient/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {showSuccess && (
          <Alert className="mb-4 border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Vital measurement saved successfully! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Add Vital Measurement</CardTitle>
            <CardDescription>Record your health data with easy-to-use forms</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Measurement Type</Label>
                <Select value={vitalType} onValueChange={(value: any) => setVitalType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                    <SelectItem value="glucose">Glucose</SelectItem>
                    <SelectItem value="breastfeeding">Breastfeeding Frequency</SelectItem>
                    <SelectItem value="mood">Mood/Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(vitalType === "blood_pressure" || vitalType === "glucose") && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {vitalType === "blood_pressure"
                      ? "Blood pressure must be measured at a clinic or hospital. Please select 'Clinic Measurement' and provide visit details."
                      : "Glucose levels should be measured at a clinic or hospital for accuracy. Please select 'Clinic Measurement' and provide visit details."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Source</Label>
                <RadioGroup value={source} onValueChange={(value: any) => setSource(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="font-normal cursor-pointer">
                      Manual Entry
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clinic" id="clinic" />
                    <Label htmlFor="clinic" className="font-normal cursor-pointer">
                      Clinic Measurement
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {requiresClinicDetails && (
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-sm text-purple-900">Clinic Visit Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                    <Input
                      id="clinicName"
                      type="text"
                      placeholder="e.g., City Medical Center"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinicVisitDate">Visit Date</Label>
                    <Input
                      id="clinicVisitDate"
                      type="date"
                      value={clinicVisitDate}
                      onChange={(e) => setClinicVisitDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Measurement Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {vitalType === "weight" && (
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="150.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter your current weight in pounds</p>
                </div>
              )}

              {vitalType === "blood_pressure" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic">Systolic</Label>
                    <Input
                      id="systolic"
                      type="number"
                      min="0"
                      placeholder="120"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Top number</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolic">Diastolic</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      min="0"
                      placeholder="80"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Bottom number</p>
                  </div>
                </div>
              )}

              {vitalType === "glucose" && (
                <div className="space-y-2">
                  <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    min="0"
                    placeholder="100"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Normal fasting range: 70-100 mg/dL</p>
                </div>
              )}

              {vitalType === "breastfeeding" && (
                <div className="space-y-2">
                  <Label htmlFor="breastfeeding">Breastfeeding Sessions (per day)</Label>
                  <Input
                    id="breastfeeding"
                    type="number"
                    min="0"
                    placeholder="8"
                    value={breastfeedingFreq}
                    onChange={(e) => setBreastfeedingFreq(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Typical range: 8-12 sessions per day</p>
                </div>
              )}

              {vitalType === "mood" && (
                <div className="space-y-2">
                  <Label>Mood/Recovery Score</Label>
                  <RadioGroup value={mood} onValueChange={setMood}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="mood1" />
                      <Label htmlFor="mood1" className="font-normal cursor-pointer">
                        1 - Very Poor
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="mood2" />
                      <Label htmlFor="mood2" className="font-normal cursor-pointer">
                        2 - Poor
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="mood3" />
                      <Label htmlFor="mood3" className="font-normal cursor-pointer">
                        3 - Fair
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="mood4" />
                      <Label htmlFor="mood4" className="font-normal cursor-pointer">
                        4 - Good
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="mood5" />
                      <Label htmlFor="mood5" className="font-normal cursor-pointer">
                        5 - Excellent
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">How are you feeling today?</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={showSuccess}>
                {showSuccess ? "Saving..." : "Save Measurement"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
