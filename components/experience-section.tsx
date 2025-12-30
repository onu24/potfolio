"use client"

import { motion } from "framer-motion"

const experiences = [
  {
    role: "Learnsphere – e-commerce learning platform",
    company: "Solo full-stack project",
    period: "2025",
    points: [
      "Built a clean e-commerce style UI for browsing and purchasing courses, handling everything from design to implementation.",
      "Used Google AI Studio and Antigravity to iterate faster on frontend logic and backend workflows.",
      "Implemented Firebase for auth and database, keeping the architecture simple but reliable.",
      "Deployed on Vercel so it behaves like a real product, not just a local demo.",
    ],
  },
  {
    role: "Next up – SaaS dashboard",
    company: "Planned project",
    period: "Coming soon",
    points: [
      "Building a dashboard to practice payments, charts, and admin workflows.",
    ],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-16 md:py-24 bg-background">
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
            PROJECT MILESTONE
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            The product I'm proud of
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            A closer look at the e-commerce project where I handled everything from UI to deployment.
          </motion.p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-white/10 to-transparent md:left-1/2 md:-ml-px" />

          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company + exp.period}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="relative flex flex-col md:flex-row md:items-start group"
              >
                {/* Node */}
                <div className="absolute left-[-5px] top-2 w-[11px] h-[11px] rounded-full bg-white border-4 border-[#01030d] z-10 md:left-1/2 md:ml-[-5.5px]" />

                <div className="md:w-1/2 md:pr-16 mb-6 md:mb-0 md:text-right">
                  <span className="text-sm font-bold tracking-widest uppercase text-slate-500 group-hover:text-purple-400 transition-colors duration-300">
                    {exp.period}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2">{exp.role}</h3>
                  <p className="text-lg text-slate-400 font-medium">{exp.company}</p>
                </div>

                <div className="md:w-1/2 md:pl-16">
                  <ul className="space-y-4">
                    {exp.points.map((point, i) => (
                      <li key={i} className="text-slate-400 leading-relaxed text-pretty relative pl-6">
                        <span className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-purple-500/40" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
