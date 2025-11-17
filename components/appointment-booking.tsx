"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, Clock, CalendarIcon, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppointmentBookingProps {
  category: string
  onBack: () => void
}

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

export function AppointmentBooking({ category, onBack }: AppointmentBookingProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ category, date, time: selectedTime, ...formData })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground">Appointment Confirmed!</h2>
            <p className="mb-6 text-muted-foreground">
              We've received your appointment request. You'll receive a confirmation email shortly with all the details.
            </p>
            <div className="space-y-2 rounded-lg bg-muted p-4 text-left">
              <p className="text-sm">
                <span className="font-semibold">Date:</span> {date?.toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Time:</span> {selectedTime}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Category:</span> {category}
              </p>
            </div>
            <Button onClick={onBack} className="mt-6">
              Book Another Appointment
            </Button>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Book Your Appointment</h1>
          <p className="mb-8 text-muted-foreground">
            Category: <span className="font-semibold capitalize">{category.replace("-", " ")}</span>
          </p>

          <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Select Date</h3>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Select Time</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn("w-full", selectedTime === time && "bg-primary text-primary-foreground")}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Your Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any specific concerns or questions?"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!date || !selectedTime}
              >
                Confirm Appointment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
