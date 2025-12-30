"use client"

import { motion } from "framer-motion"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export function ContactSection() {
  return (
    <section id="contact" className="relative py-16 md:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.4em] uppercase text-slate-500 mb-8 block"
          >
            CONTACT
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Let’s build something
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Have a project in mind? Reach out and let's discuss how we can bring it to life.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white tracking-tight">Get in touch</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                I'm currently available for freelance projects and full-time opportunities.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-black hover:bg-slate-100 hover:scale-105 transition-all duration-500 px-10 py-7 text-lg font-bold shadow-2xl"
            >
              <a href="mailto:hello@mayank.dev" className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                Email me
              </a>
            </Button>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-6 bg-white/[0.02] border border-white/[0.06] p-8 md:p-12 rounded-3xl backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Name</label>
                <Input
                  placeholder="Your name"
                  className="bg-white/[0.03] border-white/10 rounded-xl h-14 focus:border-purple-500/50 transition-all duration-300 px-5 text-white placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Email</label>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/[0.03] border-white/10 rounded-xl h-14 focus:border-purple-500/50 transition-all duration-300 px-5 text-white placeholder:text-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Message</label>
              <Textarea
                placeholder="How can I help you?"
                className="bg-white/[0.03] border-white/10 rounded-2xl min-h-[160px] focus:border-purple-500/50 transition-all duration-300 p-5 text-white placeholder:text-slate-600 resize-none"
              />
            </div>
            <Button className="w-full rounded-2xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] h-16 text-lg font-bold transition-all duration-500 flex items-center justify-center gap-3 group">
              Send Message
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
