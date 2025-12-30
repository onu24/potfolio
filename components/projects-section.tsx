"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Loader2, Image as ImageIcon } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore"
import { type Project } from "@/lib/firestore"
import Image from "next/image"

function SkeletonProjectCard() {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden h-full flex flex-col">
      <div className="aspect-video bg-white/5 animate-pulse" />
      <div className="p-8 flex-grow space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
        </div>
        <div className="h-8 w-3/4 bg-white/5 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-5/6 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-4/6 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc"),
      limit(10)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[]
      setProjects(projectsData)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching projects: ", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  }

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonProjectCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500">No projects to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col rounded-3xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-900 border-b border-white/5">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50" />
                      <h4 className="text-2xl font-bold text-white/20">{project.title}</h4>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#01030d] to-transparent opacity-40 pointer-events-none" />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    {project.techStack.map((tag) => (
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
                      target="_blank"
                      rel="noopener noreferrer"
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
        )}
      </div>
    </section>
  )
}
