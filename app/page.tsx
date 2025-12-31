"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { ExperienceSection } from "@/components/experience-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/ui/scroll-progress"

export default function Home() {
  useEffect(() => {
    // Force scroll to top on page load
    window.scrollTo(0, 0)
  }, [])

  return (
    <main id="main-content" className="min-h-screen selection:bg-purple-500/30 bg-background">
      <Navbar />
      <ScrollProgress />
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
