"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getResumeSettings } from "@/lib/firestore"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export function HeroSection() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch("/api/resume")
        if (res.ok) {
          const settings = await res.json()
          if (settings?.url) setResumeUrl(settings.url)
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchResume()
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-24 md:py-32 px-6 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[#01030d] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.12)_0%,_transparent_65%)] pointer-events-none" />

      <motion.div
        initial="initial"
        animate="animate"
        transition={{ duration: 1, staggerChildren: 0.15, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 max-w-screen-xl mx-auto text-center flex flex-col items-center mt-[-4vh]"
      >
        <motion.span
          variants={fadeUp}
          className="text-[11px] font-medium tracking-[0.4em] uppercase text-slate-500 mb-8"
        >
          FULL STACK DEVELOPER
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-[-0.04em] bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent mb-8 leading-[0.95]"
        >
          Mayank Chauhan
        </motion.h1>

        <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-medium tracking-[0.05em] text-slate-300 mb-12">
          Building reliable web experiences
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-slate-400 leading-relaxed text-pretty max-w-2xl mb-16 px-4"
        >
          I build web applications from scratch—clean UIs, Firebase backends, and deployments that work. Currently focused on e-commerce learning platforms.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-black hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-500 px-12 py-8 text-lg font-semibold shadow-[0_20px_60px_-15px_rgba(255,255,255,0.2)]"
          >
            <a href="#projects">View Projects</a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-purple-500/30 bg-purple-500/10 text-white hover:bg-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-500 px-10 py-8 text-lg font-semibold shadow-[0_0_40px_-15px_rgba(168,85,247,0.4)] backdrop-blur-sm group"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <a href={resumeUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                Download Resume
              </a>
            )}
          </Button>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] hover:border-white/20 hover:scale-110 active:scale-90 transition-all duration-500 text-slate-300 hover:text-white group"
            >
              <Github className="h-[24px] w-[24px]" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.08] hover:border-white/20 hover:scale-110 active:scale-90 transition-all duration-500 text-slate-300 hover:text-white group"
            >
              <Linkedin className="h-[24px] w-[24px]" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
