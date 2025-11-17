import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, Clock } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description:
      "Our team provides warm, personalized attention to every mother, ensuring you feel supported throughout your journey.",
  },
  {
    icon: Shield,
    title: "Expert Medical Team",
    description: "Board-certified doctors with years of experience in maternal health and prenatal care.",
  },
  {
    icon: Users,
    title: "Holistic Support",
    description:
      "Comprehensive care that addresses physical, emotional, and nutritional needs during pregnancy and nursing.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Convenient appointment times that work with your schedule, including evening and weekend availability.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            About MaternalCare
          </h2>
          <p className="mb-16 text-pretty text-lg text-muted-foreground">
            We are dedicated to providing exceptional healthcare services for mothers at every stage. Our mission is to
            ensure safe, healthy pregnancies and support new mothers with expert guidance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
