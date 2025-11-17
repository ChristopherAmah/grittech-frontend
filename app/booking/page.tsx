import { Navbar } from "@/components/navbar"
import { CategorySelection } from "@/components/category-selection"
import { Footer } from "@/components/footer"

export default function BookingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CategorySelection />
      <Footer />
    </main>
  )
}
