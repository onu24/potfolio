"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    title: "Learnsphere – e-commerce learning platform",
    category: "E-commerce Platform",
    tags: ["Next.js", "Firebase", "Tailwind", "Vercel", "Google AI Studio", "Antigravity"],
    description: "A clean e-commerce interface for browsing and purchasing courses. Built with modern full-stack tools, focusing on user experience and reliable deployments.",
    link: "https://learnsphere-v1.vercel.app",
    image: "/modern-saas-dashboard-ui.jpg",
  },
  {
    title: "Personal Portfolio – Full Stack Developer",
    category: "Portfolio",
    tags: ["Next.js", "Tailwind", "Vercel", "v0", "React"],
    description: "A minimal, dark-themed portfolio showcasing my work and skills. Built with Next.js, Tailwind, and deployed on Vercel. Focused on clean typography, spacing, and accessibility.",
    link: "https://potfolio-pearl.vercel.app",
    image: "/minimalist-portfolio-design.jpg",
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-16 md:py-24 bg-background">
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
            SELECTED PROJECTS
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Work I’m proud of
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Real projects I've built and deployed.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col rounded-3xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-900">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#01030d] to-transparent opacity-40" />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-400 group-hover:text-slate-200 group-hover:border-purple-500/30 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-slate-400 text-base leading-relaxed mb-8 flex-grow">{project.description}</p>

                {project.link && (
                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/60 group-hover:text-white transition-colors duration-300 mt-auto"
                  >
                    View project
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
