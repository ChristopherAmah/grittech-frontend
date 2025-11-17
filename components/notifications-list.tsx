"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { markNotificationRead, type Notification } from "@/lib/vitals"
import { AlertCircle, Info, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface NotificationsListProps {
  notifications: Notification[]
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const handleMarkRead = (id: string) => {
    markNotificationRead(id)
    window.location.reload()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No notifications yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <CardTitle className="text-base">{notification.title}</CardTitle>
                  <CardDescription className="mt-1">{notification.message}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(notification.createdAt), "PPp")}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <Button size="sm" variant="outline" onClick={() => handleMarkRead(notification.id)}>
                  Mark Read
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
