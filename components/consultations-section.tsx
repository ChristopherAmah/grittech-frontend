import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Baby, Milk, Stethoscope, HeartPulse } from "lucide-react"
import Link from "next/link"

const consultations = [
  {
    icon: Baby,
    title: "Prenatal Care",
    description:
      "Comprehensive checkups and monitoring throughout your pregnancy to ensure the health of you and your baby.",
    features: ["Regular ultrasounds", "Nutritional guidance", "Risk assessment", "Birth planning"],
  },
  {
    icon: Milk,
    title: "Postpartum Support",
    description: "Expert care and guidance for new mothers during the critical weeks and months after childbirth.",
    features: ["Breastfeeding support", "Recovery monitoring", "Mental health screening", "Newborn care advice"],
  },
  {
    icon: Stethoscope,
    title: "High-Risk Pregnancy",
    description: "Specialized care for mothers with complex medical conditions or pregnancy complications.",
    features: ["Advanced monitoring", "Specialist coordination", "Personalized care plans", "24/7 support"],
  },
  {
    icon: HeartPulse,
    title: "Wellness Consultations",
    description: "Holistic health assessments focusing on nutrition, exercise, and emotional wellbeing.",
    features: ["Fitness guidance", "Dietary planning", "Stress management", "Sleep optimization"],
  },
]

export function ConsultationsSection() {
  return (
    <section id="consultations" className="bg-muted/50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Our Consultation Services
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Tailored healthcare services designed to meet the unique needs of expectant and nursing mothers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {consultations.map((consultation, index) => (
            <Card key={index} className="border-border bg-card">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                  <consultation.icon className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="text-2xl text-card-foreground">{consultation.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{consultation.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {consultation.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/booking">Schedule Consultation</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
