"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Image as ImageIcon, X, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { getProjects, addProject, updateProject, deleteProject, resetAndSeedProjects, type Project } from "@/lib/firestore"

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    // Form states
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [techStack, setTechStack] = useState("")
    const [link, setLink] = useState("")
    const [category, setCategory] = useState("")
    const [featured, setFeatured] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const data = await getProjects()
            setProjects(data)
        } catch (error) {
            toast.error("Failed to fetch projects")
        } finally {
            setLoading(false)
        }
    }

    const openForm = (project: Project | null = null) => {
        if (project) {
            setEditingProject(project)
            setTitle(project.title)
            setDescription(project.description)
            setTechStack(project.techStack.join(", "))
            setLink(project.link)
            setCategory(project.category)
            setFeatured(project.featured)
            setImageUrl(project.imageUrl || "")
            setImagePreview(project.imageUrl || null)
        } else {
            setEditingProject(null)
            setTitle("")
            setDescription("")
            setTechStack("")
            setLink("")
            setCategory("")
            setFeatured(false)
            setImageUrl("")
            setImagePreview(null)
        }
        setIsFormOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !description || !category) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        const projectData = {
            title,
            description,
            techStack: techStack.split(",").map(s => s.trim()).filter(s => s !== ""),
            link,
            category,
            featured,
            imageUrl
        }

        try {
            if (editingProject?.id) {
                await updateProject(editingProject.id, projectData)
                toast.success("Project updated successfully")
            } else {
                await addProject(projectData)
                toast.success("Project added successfully")
            }
            setIsFormOpen(false)
            fetchProjects()
        } catch (error) {
            toast.error("Failed to save project")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return

        try {
            await deleteProject(id)
            toast.success("Project deleted")
            fetchProjects()
        } catch (error) {
            toast.error("Failed to delete project")
        }
    }

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Optimization: Add a few skeleton or empty cards if needed
    const filledProjects = filteredProjects

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-xs h-9 rounded-xl focus:ring-purple-500/50"
                    />
                </div>
                <Button onClick={() => openForm()} className="bg-purple-600 hover:bg-purple-700 text-white h-9 rounded-xl px-4 text-xs font-bold transition-all shadow-lg shadow-purple-500/20">
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> New Project
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filledProjects.length === 0 ? (
                        <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                            <p className="text-slate-500">No projects found.</p>
                        </div>
                    ) : (
                        filledProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-32 relative bg-slate-800 overflow-hidden">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-slate-900 flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-purple-500/30" />
                                        </div>
                                    )}
                                    {project.featured && (
                                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-500 text-white text-[8px] font-bold uppercase tracking-wider rounded-md shadow-lg">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div>
                                            <p className="text-[8px] uppercase tracking-widest text-purple-400 font-bold mb-0.5">{project.category}</p>
                                            <h3 className="text-sm font-bold text-white line-clamp-1">{project.title}</h3>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-[11px] line-clamp-2 mb-3 flex-1 leading-normal">{project.description}</p>

                                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openForm(project)}
                                            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => project.id && handleDelete(project.id)}
                                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <div className="ml-auto">
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-500 hover:text-purple-400 transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Project Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-950 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                                <h2 className="text-base font-bold">{editingProject ? "Edit Project" : "Add New Project"}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full h-7 w-7">
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title</label>
                                        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Name" className="bg-white/5 border-white/10 h-10 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                                        <Input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="SaaS, Portfolio..." className="bg-white/5 border-white/10 h-10 text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                                    <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project..." className="bg-white/5 border-white/10 min-h-[80px] text-sm" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tech Stack</label>
                                    <Input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Next.js..." className="bg-white/5 border-white/10 h-10 text-sm" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">External Link</label>
                                    <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="bg-white/5 border-white/10 h-10 text-sm" />
                                </div>

                                <div className="p-3 rounded-xl bg-purple-900/10 border border-purple-500/20 space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-purple-300">Project Image</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1 space-y-1">
                                            <Input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value) }} placeholder="Image URL..." className="bg-slate-900 border-purple-500/30 h-10 text-sm" />
                                            <p className="text-[10px] text-slate-400">Enter a direct URL for the cover image.</p>
                                        </div>
                                        {imagePreview && (
                                            <div className="w-16 h-11 rounded-lg bg-slate-800 overflow-hidden border border-white/10 flex-shrink-0">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview(null)} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-purple-500" />
                                    <label htmlFor="featured" className="text-sm text-slate-300 font-medium">Featured Project (Showcase prominently)</label>
                                </div>
                            </form>

                            <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white h-9 text-sm">Cancel</Button>
                                <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px] h-9 text-sm">
                                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                                    {editingProject ? "Update" : "Save Project"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
