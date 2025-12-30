import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { ExperienceSection } from "@/components/experience-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-purple-500/30 bg-background">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <ExperienceSection />
      <TechStackSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
