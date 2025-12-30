"use client"

import { motion } from "framer-motion"

const techStack = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand", "Redux"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Prisma", "REST APIs", "GraphQL"],
  },
  {
    category: "Tools & Infra",
    items: ["Git", "Docker", "AWS", "Vercel", "CI/CD", "Postman", "Linux"],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export function TechStackSection() {
  return (
    <section id="tech" className="relative py-32 md:py-48 bg-background">
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
            TOOLS & TECH
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Things I work with
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
              className="group relative p-10 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-500"
            >
              <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">{stack.category}</h3>
              <div className="flex flex-wrap gap-3">
                {stack.items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 text-sm font-medium hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
