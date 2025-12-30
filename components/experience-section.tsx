"use client"

import { motion } from "framer-motion"

const experiences = [
  {
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2023 — Present",
    points: [
      "Architected and deployed custom SaaS solutions for early-stage startups using Next.js and Node.js.",
      "Optimized database performance and query efficiency for high-traffic content platforms.",
      "Collaborated with design teams to implement pixel-perfect, accessible user interfaces.",
    ],
  },
  {
    role: "Backend Engineer",
    company: "DevSystems Inc.",
    period: "2021 — 2023",
    points: [
      "Built and maintained core microservices responsible for high-volume data processing.",
      "Implemented automated monitoring and alerting systems reducing downtime by 30%.",
      "Led the migration of legacy REST APIs to modern GraphQL architecture.",
    ],
  },
  {
    role: "Junior Web Developer",
    company: "WebFlow Agency",
    period: "2019 — 2021",
    points: [
      "Developed responsive frontend components and landing pages for enterprise clients.",
      "Assisted in the maintenance of internal tooling and automated testing suites.",
      "Contributed to cross-browser compatibility and mobile-first optimization projects.",
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
    <section id="experience" className="relative py-32 md:py-48 bg-background">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-24"
        >
          <motion.span
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.4em] uppercase text-slate-500 mb-8 block"
          >
            EXPERIENCE
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Where I’ve been working
          </motion.h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-white/10 to-transparent md:left-1/2 md:-ml-px" />

          <div className="space-y-20">
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
