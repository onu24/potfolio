"use client"

import { motion } from "framer-motion"
import { Code2, Cpu, Layout } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

const services = [
  {
    title: "Frontend interactions",
    description:
      "Responsive layouts, smooth animations, and component systems that work across devices.",
    icon: Layout,
  },
  {
    title: "Backend APIs",
    description:
      "REST APIs, Firebase integration, and server logic that handles auth and data without breaking.",
    icon: Code2,
  },
  {
    title: "Systems & data",
    description:
      "Organized databases, deployment pipelines, and monitoring so projects stay live and reliable.",
    icon: Cpu,
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="relative py-16 md:py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.05)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6">
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
            WHAT I DO
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            From UI to systems
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            I work across frontend, backend, and systems to ship production-ready products.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-10 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-500 shadow-2xl backdrop-blur-sm"
            >
              <div className="mb-10 relative">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500">
                  <service.icon className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{service.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed text-balance">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
