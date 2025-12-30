"use client"

import { motion } from "framer-motion"

const techStack = [
  {
    category: "Frontend",
    description: "Building responsive interfaces for e-commerce learning platforms",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
  },
  {
    category: "Backend",
    description: "Handling auth, data storage, and API logic",
    items: ["Node.js", "Firebase", "REST APIs", "Express", "MongoDB"],
    exploring: "Exploring: Prisma, GraphQL",
  },
  {
    category: "Tools & Infra",
    description: "Deploying projects and iterating with AI assistance",
    items: ["Git", "Vercel", "Google AI Studio", "Antigravity", "Postman"],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export function TechStackSection() {
  return (
    <section id="tech" className="relative py-20 md:py-24 bg-background">
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
            TOOLS & TECH
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Things I work with
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            The stack I use to build and ship products like Learnsphere, from UI components to deployment.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
              className="group relative px-6 py-6 md:px-8 md:py-8 rounded-3xl bg-slate-950/60 border border-white/10 hover:bg-slate-900/80 hover:border-white/20 transition-all duration-500 shadow-lg space-y-4"
            >
              <h3 className="text-2xl font-bold text-white tracking-tight">{stack.category}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{stack.description}</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {stack.items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 text-sm font-medium hover:text-white hover:bg-white/[0.08] hover:border-white/20 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
              {stack.exploring && (
                <p className="text-slate-600 text-xs italic pt-2">{stack.exploring}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
