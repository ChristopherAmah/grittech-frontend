"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Baby, Stethoscope, Users, ArrowRight } from "lucide-react"
import { AppointmentBooking } from "@/components/appointment-booking"

const categories = [
  {
    id: "prenatal",
    title: "Prenatal Care",
    description: "Comprehensive care throughout your pregnancy journey",
    icon: Heart,
    color: "bg-accent/10 text-accent",
  },
  {
    id: "postnatal",
    title: "Postnatal Care",
    description: "Support and guidance for new mothers after delivery",
    icon: Baby,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "consultation",
    title: "General Consultation",
    description: "Expert advice on maternal health and wellness",
    icon: Stethoscope,
    color: "bg-secondary/20 text-secondary-foreground",
  },
  {
    id: "group",
    title: "Group Sessions",
    description: "Connect with other mothers in supportive group settings",
    icon: Users,
    color: "bg-muted text-muted-foreground",
  },
]

export function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (selectedCategory) {
    return <AppointmentBooking category={selectedCategory} onBack={() => setSelectedCategory(null)} />
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Choose Your Care Category
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Select the type of consultation that best fits your needs. Our expert team is here to support you every step
            of the way.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className="group cursor-pointer border-2 p-6 transition-all hover:border-primary hover:shadow-lg"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${category.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{category.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{category.description}</p>
                    <Button
                      variant="ghost"
                      className="group-hover:text-primary -ml-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCategory(category.id)
                      }}
                    >
                      Select Category
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
