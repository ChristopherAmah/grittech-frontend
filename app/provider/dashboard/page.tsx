"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, signOut } from "@/lib/auth"
import { getAllPatients, getHighRiskPatients, getAnalytics } from "@/lib/provider"
import { Heart, LogOut, Users, AlertTriangle, TrendingUp, Search } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function ProviderDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "provider") {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)
    const allPatients = getAllPatients()
    const highRiskPatients = getHighRiskPatients()
    const stats = getAnalytics()

    setPatients(allPatients)
    setFilteredPatients(allPatients)
    setAlerts(highRiskPatients)
    setAnalytics(stats)
  }, [router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(
        (p) =>
          p.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.patient.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredPatients(filtered)
    }
  }, [searchQuery, patients])

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

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

  if (!user) return null

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

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Dr. {user.name}</span>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 py-8 space-y-6">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.pregnant} pregnant, {analytics.nursing} nursing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.highRisk}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.mediumRisk}</div>
                <p className="text-xs text-muted-foreground">Monitor closely</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vitals</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalVitals}</div>
                <p className="text-xs text-muted-foreground">Avg {analytics.avgVitalsPerPatient} per patient</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="patients">All Patients</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {alerts.length > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  {alerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
                <CardDescription>View and manage all patients</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patientSummary) => (
                    <Card key={patientSummary.patient.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{patientSummary.patient.name}</h3>
                              {getRiskBadge(patientSummary.riskLevel)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{patientSummary.patient.email}</p>
                            {patientSummary.profile && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Category: {patientSummary.profile.category === "pregnancy" ? "Pregnant" : "Nursing"}
                              </p>
                            )}
                            <div className="flex gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Last Visit: {format(new Date(patientSummary.lastVisit), "MMM dd, yyyy")}
                              </span>
                              <span className="text-muted-foreground">Total Vitals: {patientSummary.totalVitals}</span>
                            </div>
                          </div>
                          <Button asChild>
                            <Link href={`/provider/patient/${patientSummary.patient.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredPatients.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchQuery ? "No patients found matching your search" : "No patients yet"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>High Priority Alerts</CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((patientSummary) => (
                    <Card key={patientSummary.patient.id} className="border-l-4 border-l-destructive">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{patientSummary.patient.name}</h3>
                              {getRiskBadge(patientSummary.riskLevel)}
                            </div>
                            <div className="space-y-1 mb-3">
                              {patientSummary.riskReasons.map((reason: string, index: number) => (
                                <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                  {reason}
                                </p>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Last Visit: {format(new Date(patientSummary.lastVisit), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Button asChild>
                            <Link href={`/provider/patient/${patientSummary.patient.id}`}>Review</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {alerts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">No high-priority alerts</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">High Risk</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-destructive"
                              style={{
                                width: `${(analytics.highRisk / analytics.totalPatients) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.highRisk}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medium Risk</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-600"
                              style={{
                                width: `${(analytics.mediumRisk / analytics.totalPatients) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.mediumRisk}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Low Risk</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600"
                              style={{
                                width: `${(analytics.lowRisk / analytics.totalPatients) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.lowRisk}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pregnant</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(analytics.pregnant / analytics.totalPatients) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.pregnant}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nursing</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(analytics.nursing / analytics.totalPatients) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.nursing}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
