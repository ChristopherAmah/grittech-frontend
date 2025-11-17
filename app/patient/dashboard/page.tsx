"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, signOut } from "@/lib/auth"
import { getVitals, getNotifications, analyzeRisk } from "@/lib/vitals"
import { Heart, Activity, TrendingUp, Bell, BookOpen, LogOut, Plus, Clock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { VitalsChart } from "@/components/vitals-chart"
import { NotificationsList } from "@/components/notifications-list"

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [vitals, setVitals] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [riskAssessment, setRiskAssessment] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "patient") {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)
    const userVitals = getVitals(currentUser.id)
    const userNotifications = getNotifications(currentUser.id)
    const risk = analyzeRisk(userVitals)

    setVitals(userVitals)
    setNotifications(userNotifications)
    setRiskAssessment(risk)
  }, [router])

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
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
            <span className="text-xl font-semibold">MaternalCare</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/patient/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 py-8 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Here's your health overview</p>
        </div>

        {/* Risk Assessment Card */}
        {riskAssessment && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Risk Assessment</CardTitle>
                <Badge variant={getRiskColor(riskAssessment.level)}>{riskAssessment.level.toUpperCase()} RISK</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {riskAssessment.reasons.map((reason: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vitals</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vitals.length}</div>
              <p className="text-xs text-muted-foreground">Recorded measurements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  vitals.filter((v) => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return new Date(v.date) > weekAgo
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">New measurements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vitals">Vitals & Trends</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Health Trends</h2>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/patient/vitals/timeline">
                    <Clock className="mr-2 h-4 w-4" />
                    View Timeline
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/patient/vitals/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vitals
                  </Link>
                </Button>
              </div>
            </div>

            <VitalsChart vitals={vitals} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList notifications={notifications} />
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>Learn more about maternal health</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/patient/education">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Library
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
