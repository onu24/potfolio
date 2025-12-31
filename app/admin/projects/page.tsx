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

        try {
            const projectData = {
                title,
                description,
                techStack: techStack.split(",").map((s) => s.trim()).filter((s) => s !== ""),
                link,
                category,
                featured,
                imageUrl,
            }

            if (editingProject?.id) {
                await updateProject(editingProject.id, projectData)
                toast.success("Project updated successfully")
            } else {
                await addProject(projectData)
                toast.success("Project added successfully")
            }
            setIsFormOpen(false)
            fetchProjects()
        } catch (error: any) {
            console.error("Firestore Operation failed:", error)
            toast.error(`Failed to save project: ${error.message}`)
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

    const filledProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-white/10 text-white"
                    />
                </div>
                <Button
                    onClick={() => openForm()}
                    className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Project
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filledProjects.length === 0 ? (
                        <div className="col-span-full text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                            <p className="text-slate-500">No projects found.</p>
                        </div>
                    ) : (
                        filledProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/20 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 relative bg-slate-800 overflow-hidden">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-slate-900 flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-purple-500/30" />
                                        </div>
                                    )}
                                    {project.featured && (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">{project.category}</p>
                                            <h3 className="text-xl font-bold text-white line-clamp-1">{project.title}</h3>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">{project.description}</p>

                                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openForm(project)}
                                            className="text-slate-400 hover:text-white hover:bg-white/5"
                                        >
                                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(project.id!)}
                                            className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 ml-auto"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-950 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                                <h2 className="text-xl font-bold">{editingProject ? "Edit Project" : "Add New Project"}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
                                        <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Name" className="bg-white/5 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                                        <Input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="SaaS, Portfolio..." className="bg-white/5 border-white/10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                                    <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project..." className="bg-white/5 border-white/10 min-h-[120px]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tech Stack</label>
                                    <Input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Next.js, Firebase..." className="bg-white/5 border-white/10" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">External Link</label>
                                    <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="bg-white/5 border-white/10" />
                                </div>

                                <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/20 space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-purple-300">Project Image</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1 space-y-2">
                                            <Input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value) }} placeholder="https://example.com/image.jpg" className="bg-slate-900 border-purple-500/30" />
                                            <p className="text-[10px] text-slate-400">Enter a direct URL for the cover image.</p>
                                        </div>
                                        {imagePreview && (
                                            <div className="w-24 h-16 rounded-lg bg-slate-800 overflow-hidden border border-white/10 flex-shrink-0">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview(null)} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded bg-white/5 border-white/10 text-purple-600 focus:ring-purple-500" />
                                    <label htmlFor="featured" className="text-sm font-medium text-slate-300 cursor-pointer">Mark as Featured Project</label>
                                </div>
                            </form>

                            <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                                <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {editingProject ? "Update Project" : "Create Project"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
