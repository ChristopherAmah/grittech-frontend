"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser } from "@/lib/auth"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

type OnboardingStep = "consent" | "profile" | "medical" | "complete"

interface PatientProfile {
  userId: string
  category: "pregnancy" | "nursing"
  dueDate?: Date
  birthDate?: Date
  emergencyContact: string
  emergencyPhone: string
  medicalHistory: string
  allergies: string
  currentMedications: string
  consentGiven: boolean
  consentDate: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("consent")
  const [loading, setLoading] = useState(false)

  // Consent step
  const [consentChecked, setConsentChecked] = useState(false)

  // Profile step
  const [category, setCategory] = useState<"pregnancy" | "nursing">("pregnancy")
  const [dueDate, setDueDate] = useState<Date>()
  const [birthDate, setBirthDate] = useState<Date>()
  const [emergencyContact, setEmergencyContact] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")

  // Medical step
  const [medicalHistory, setMedicalHistory] = useState("")
  const [allergies, setAllergies] = useState("")
  const [currentMedications, setCurrentMedications] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "patient") {
      router.push("/auth/login")
    }
  }, [router])

  const progress = {
    consent: 25,
    profile: 50,
    medical: 75,
    complete: 100,
  }[step]

  const handleConsentNext = () => {
    if (consentChecked) {
      setStep("profile")
    }
  }

  const handleProfileNext = () => {
    if (emergencyContact && emergencyPhone) {
      if (category === "pregnancy" && !dueDate) return
      if (category === "nursing" && !birthDate) return
      setStep("medical")
    }
  }

  const handleComplete = () => {
    setLoading(true)

    const user = getCurrentUser()
    if (!user) return

    const profile: PatientProfile = {
      userId: user.id,
      category,
      dueDate,
      birthDate,
      emergencyContact,
      emergencyPhone,
      medicalHistory,
      allergies,
      currentMedications,
      consentGiven: consentChecked,
      consentDate: new Date().toISOString(),
    }

    // Save to local storage
    const profiles = JSON.parse(localStorage.getItem("maternal_care_profiles") || "{}")
    profiles[user.id] = profile
    localStorage.setItem("maternal_care_profiles", JSON.stringify(profiles))

    setStep("complete")
    setLoading(false)
  }

  const handleGoToDashboard = () => {
    router.push("/patient/dashboard")
  }

  if (step === "consent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <Progress value={progress} className="mb-8" />

          <Card>
            <CardHeader>
              <CardTitle>Welcome to MaternalCare</CardTitle>
              <CardDescription>Please review and accept our terms to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/50 p-6 space-y-4 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-lg">Consent & Privacy Agreement</h3>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    By using MaternalCare, you consent to the collection, storage, and processing of your health
                    information for the purpose of providing maternal healthcare services.
                  </p>

                  <h4 className="font-medium text-foreground mt-4">Data Collection</h4>
                  <p>
                    We collect personal health information including vital signs, medical history, and pregnancy/nursing
                    data to provide personalized care and monitoring.
                  </p>

                  <h4 className="font-medium text-foreground mt-4">Data Usage</h4>
                  <p>
                    Your data will be used to monitor your health, provide risk assessments, and enable communication
                    with your healthcare providers. We may use anonymized data for research and service improvement.
                  </p>

                  <h4 className="font-medium text-foreground mt-4">Data Security</h4>
                  <p>
                    We implement industry-standard security measures to protect your information. Your data is encrypted
                    and access is restricted to authorized healthcare providers.
                  </p>

                  <h4 className="font-medium text-foreground mt-4">Your Rights</h4>
                  <p>
                    You have the right to access, modify, or delete your data at any time. You may withdraw consent,
                    though this may limit our ability to provide services.
                  </p>

                  <h4 className="font-medium text-foreground mt-4">Emergency Situations</h4>
                  <p>
                    In case of medical emergencies, we may share your information with emergency services and healthcare
                    providers to ensure your safety.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                  I have read and agree to the terms above. I consent to the collection and processing of my health
                  information for maternal healthcare services.
                </Label>
              </div>

              <Button onClick={handleConsentNext} disabled={!consentChecked} className="w-full">
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "profile") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <Progress value={progress} className="mb-8" />

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Tell us about yourself and your care needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>I am currently</Label>
                <RadioGroup value={category} onValueChange={(value) => setCategory(value as "pregnancy" | "nursing")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pregnancy" id="pregnancy" />
                    <Label htmlFor="pregnancy" className="font-normal cursor-pointer">
                      Pregnant
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nursing" id="nursing" />
                    <Label htmlFor="nursing" className="font-normal cursor-pointer">
                      Nursing/Postpartum
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {category === "pregnancy" && (
                <div className="space-y-2">
                  <Label>Expected Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {category === "nursing" && (
                <div className="space-y-2">
                  <Label>Baby's Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? format(birthDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Full name"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("consent")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleProfileNext} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "medical") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <Progress value={progress} className="mb-8" />

          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>Help us provide better care with your medical history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Previous pregnancies, surgeries, chronic conditions, etc."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="Medications, foods, environmental allergies, etc."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  placeholder="List all medications, vitamins, and supplements"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("profile")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} disabled={loading} className="flex-1">
                  {loading ? "Completing..." : "Complete Setup"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome to MaternalCare!</CardTitle>
            <CardDescription className="text-center">Your profile has been set up successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                You can now access your health dashboard, track vitals, and connect with healthcare providers.
              </p>
            </div>

            <Button onClick={handleGoToDashboard} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
