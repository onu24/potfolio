"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Pencil, Trash2, ExternalLink, Loader2,
    Image as ImageIcon, X, Search, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { getProjects, addProject, updateProject, deleteProject, type Project } from "@/lib/firestore"

// --- Validation ---
interface FormErrors {
    title?: string
    category?: string
    description?: string
    link?: string
    imageUrl?: string
}

function validateForm(values: {
    title: string
    category: string
    description: string
    link: string
    imageUrl: string
}): FormErrors {
    const errors: FormErrors = {}
    if (!values.title.trim()) errors.title = "Title is required"
    if (!values.category.trim()) errors.category = "Category is required"
    if (!values.description.trim()) errors.description = "Description is required"
    if (values.link && !/^https?:\/\/.+/.test(values.link))
        errors.link = "Must be a valid URL starting with http:// or https://"
    if (values.imageUrl && !/^https?:\/\/.+/.test(values.imageUrl))
        errors.imageUrl = "Must be a valid image URL"
    return errors
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [mounted, setMounted] = useState(false)

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
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        setMounted(true)
        fetchProjects()
    }, [])

    // Close modal on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isFormOpen) closeForm()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isFormOpen])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const data = await getProjects()
            setProjects(data)
        } catch {
            toast.error("Failed to fetch projects")
        } finally {
            setLoading(false)
        }
    }

    const openForm = (project: Project | null = null) => {
        setErrors({})
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

    const closeForm = useCallback(() => {
        if (!isSubmitting) setIsFormOpen(false)
    }, [isSubmitting])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validateForm({ title, category, description, link, imageUrl })
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            toast.error("Please fix the errors before submitting")
            return
        }
        setErrors({})
        setIsSubmitting(true)

        const projectData = {
            title: title.trim(),
            description: description.trim(),
            techStack: techStack.split(",").map(s => s.trim()).filter(Boolean),
            link: link.trim(),
            category: category.trim(),
            featured,
            imageUrl: imageUrl.trim(),
        }

        try {
            if (editingProject?.id) {
                await updateProject(editingProject.id, projectData)
                toast.success("Project updated successfully! ✨")
            } else {
                await addProject(projectData)
                toast.success("Project created successfully! ✨")
            }
            setIsFormOpen(false)
            fetchProjects()
        } catch (err) {
            console.error("Failed to save project:", err)
            toast.error("Failed to save project. Please try again.")
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
        } catch {
            toast.error("Failed to delete project")
        }
    }

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // --- Modal JSX ---
    const modal = (
        <AnimatePresence>
            {isFormOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeForm}
                        className="absolute inset-0 bg-black/60"
                        style={{ backdropFilter: "blur(4px)" }}
                    />
                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="relative bg-slate-950 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                            <h2 className="text-base font-bold text-white">
                                {editingProject ? "Edit Project" : "Add New Project"}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeForm}
                                className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full h-7 w-7"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        {/* Form body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: undefined })) }}
                                        placeholder="Project Name"
                                        disabled={isSubmitting}
                                        className={`bg-white/5 border-white/10 h-10 text-sm ${errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    />
                                    {errors.title && <p className="text-[10px] text-red-400">{errors.title}</p>}
                                </div>

                                {/* Category */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Category <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        value={category}
                                        onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: undefined })) }}
                                        placeholder="SaaS, Portfolio..."
                                        disabled={isSubmitting}
                                        className={`bg-white/5 border-white/10 h-10 text-sm ${errors.category ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    />
                                    {errors.category && <p className="text-[10px] text-red-400">{errors.category}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })) }}
                                    placeholder="Describe your project..."
                                    disabled={isSubmitting}
                                    className={`bg-white/5 border-white/10 min-h-[80px] text-sm ${errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {errors.description && <p className="text-[10px] text-red-400">{errors.description}</p>}
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tech Stack</label>
                                <Input
                                    value={techStack}
                                    onChange={e => setTechStack(e.target.value)}
                                    placeholder="React, Next.js, TypeScript..."
                                    disabled={isSubmitting}
                                    className="bg-white/5 border-white/10 h-10 text-sm"
                                />
                                <p className="text-[10px] text-slate-500">Comma-separated (e.g. React, Firebase)</p>
                            </div>

                            {/* External Link */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">External Link</label>
                                <Input
                                    value={link}
                                    onChange={e => { setLink(e.target.value); setErrors(p => ({ ...p, link: undefined })) }}
                                    placeholder="https://..."
                                    disabled={isSubmitting}
                                    className={`bg-white/5 border-white/10 h-10 text-sm ${errors.link ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                />
                                {errors.link && <p className="text-[10px] text-red-400">{errors.link}</p>}
                            </div>

                            {/* Image URL */}
                            <div className="p-3 rounded-xl bg-purple-900/10 border border-purple-500/20 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-purple-300">Project Image</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            value={imageUrl}
                                            onChange={e => {
                                                setImageUrl(e.target.value)
                                                setImagePreview(e.target.value)
                                                setErrors(p => ({ ...p, imageUrl: undefined }))
                                            }}
                                            placeholder="https://example.com/image.jpg"
                                            disabled={isSubmitting}
                                            className={`bg-slate-900 border-purple-500/30 h-10 text-sm ${errors.imageUrl ? "border-red-500" : ""}`}
                                        />
                                        {errors.imageUrl
                                            ? <p className="text-[10px] text-red-400">{errors.imageUrl}</p>
                                            : <p className="text-[10px] text-slate-400">Enter a direct URL for the cover image.</p>
                                        }
                                    </div>
                                    {imagePreview && (
                                        <div className="w-16 h-11 rounded-lg bg-slate-800 overflow-hidden border border-white/10 flex-shrink-0">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={() => setImagePreview(null)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Featured toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={featured}
                                    onChange={e => setFeatured(e.target.checked)}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 accent-purple-500"
                                />
                                <label htmlFor="featured" className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                                    Featured Project (shown prominently on homepage)
                                </label>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-slate-900/50 rounded-b-2xl flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={closeForm}
                                disabled={isSubmitting}
                                className="text-slate-400 hover:text-white h-9 text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px] h-9 text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    editingProject ? "Update Project" : "Save Project"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-xs h-9 rounded-xl focus:ring-purple-500/50"
                    />
                </div>
                <Button
                    onClick={() => openForm()}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-9 rounded-xl px-4 text-xs font-bold transition-all shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> New Project
                </Button>
            </div>

            {/* Project Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                            <p className="text-slate-500">No projects found.</p>
                        </div>
                    ) : (
                        filteredProjects.map(project => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-32 relative bg-slate-800 overflow-hidden">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
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
                                            title="Edit project"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => project.id && handleDelete(project.id)}
                                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                            title="Delete project"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <div className="ml-auto">
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-slate-500 hover:text-purple-400 transition-colors"
                                                    title="View live"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Modal rendered via portal to escape stacking contexts */}
            {mounted && createPortal(modal, document.body)}
        </div>
    )
}
