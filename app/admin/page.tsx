"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, LogOut, ExternalLink, ShieldCheck, Loader2, Image as ImageIcon, X, Inbox, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { getProjects, addProject, updateProject, deleteProject, type Project, type Milestone } from "@/lib/firestore"

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState("")
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    // Form states
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [techStack, setTechStack] = useState("")
    const [link, setLink] = useState("")
    const [category, setCategory] = useState("")
    const [featured, setFeatured] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [milestones, setMilestones] = useState<Project["milestones"]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth")
        if (auth === "true") {
            setIsAuthenticated(true)
            fetchProjects()
        }
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

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

        console.log("Login attempt - Input:", password)
        console.log("Expected Password:", expectedPassword)

        if (password === expectedPassword) {
            setIsAuthenticated(true)
            localStorage.setItem("admin_auth", "true")
            toast.success("Welcome back, Admin!")
            fetchProjects()
        } else {
            toast.error("Invalid password")
            console.error("Auth Failed: Passwords do not match")
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("admin_auth")
        toast.success("Logged out successfully")
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
            setMilestones(project.milestones || [])
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
            setMilestones([])
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
                milestones,
            }

            console.log("Admin: Submitting project data to Firestore:", projectData)

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

    const addMilestone = () => {
        const newMilestone = {
            id: Math.random().toString(36).substr(2, 9),
            year: new Date().getFullYear().toString(),
            title: "",
            description: ""
        }
        setMilestones([...(milestones || []), newMilestone])
    }

    const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
        setMilestones(
            milestones?.map((m) => (m.id === id ? { ...m, [field]: value } : m))
        )
    }

    const removeMilestone = (id: string) => {
        setMilestones(milestones?.filter((m) => m.id !== id))
    }

    const moveMilestone = (index: number, direction: 'up' | 'down') => {
        if (!milestones) return
        const newMilestones = [...milestones]
        if (direction === 'up' && index > 0) {
            [newMilestones[index], newMilestones[index - 1]] = [newMilestones[index - 1], newMilestones[index]]
        } else if (direction === 'down' && index < milestones.length - 1) {
            [newMilestones[index], newMilestones[index + 1]] = [newMilestones[index + 1], newMilestones[index]]
        }
        setMilestones(newMilestones)
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
                    <p className="text-slate-400 text-center mb-8">Please enter your password to continue.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 text-white h-12"
                        />
                        <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-slate-200 transition-colors">
                            Login
                        </Button>
                    </form>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Project Manager</h1>
                        <p className="text-slate-400 mt-2">Manage your portfolio projects dynamically.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button asChild variant="secondary" className="bg-white/5 hover:bg-white/10 text-white border-white/10">
                            <Link href="/admin/messages">
                                <Inbox className="w-4 h-4 mr-2" /> Messages
                            </Link>
                        </Button>
                        <Button
                            onClick={() => openForm()}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Project
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {projects.length === 0 ? (
                            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                                <p className="text-slate-500">No projects found. Add your first one!</p>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-colors"
                                >
                                    <div className="flex-shrink-0 w-24 h-16 rounded-xl bg-slate-800 overflow-hidden border border-white/5">
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-purple-500/40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold">{project.title}</h3>
                                            {project.featured && (
                                                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-sm line-clamp-2 max-w-2xl">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {project.techStack.map((tech) => (
                                                <span key={tech} className="text-[10px] text-slate-500 border border-white/5 px-2 py-0.5 rounded-md">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openForm(project)}
                                            className="border-white/10 hover:bg-white/5 h-10 w-10 ring-0 outline-0"
                                        >
                                            <Pencil className="w-4 h-4 text-blue-400" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(project.id!)}
                                            className="border-white/10 hover:bg-white/5 h-10 w-10 text-red-400 ring-0 outline-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        {project.link && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="icon"
                                                className="border-white/10 hover:bg-white/5 h-10 w-10 ring-0 outline-0"
                                            >
                                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-950/20">
                                <h2 className="text-2xl font-bold">{editingProject ? "Edit Project" : "Add New Project"}</h2>
                                <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white ring-0 outline-0">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Title*</label>
                                            <Input
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Learnsphere"
                                                className="bg-white/5 border-white/10 text-white h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category*</label>
                                            <Input
                                                required
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                placeholder="SaaS / Personal"
                                                className="bg-white/5 border-white/10 text-white h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description*</label>
                                        <Textarea
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Project overview..."
                                            className="bg-white/5 border-white/10 text-white min-h-[100px] py-4"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tech Stack (comma separated)</label>
                                        <Input
                                            value={techStack}
                                            onChange={(e) => setTechStack(e.target.value)}
                                            placeholder="Next.js, Tailwind, Firebase"
                                            className="bg-white/5 border-white/10 text-white h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Link</label>
                                        <Input
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            placeholder="https://..."
                                            className="bg-white/5 border-white/10 text-white h-12"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Project Image URL</label>
                                        <Input
                                            value={imageUrl}
                                            onChange={(e) => {
                                                setImageUrl(e.target.value)
                                                setImagePreview(e.target.value)
                                            }}
                                            placeholder="https://example.com/image.jpg"
                                            className="bg-white/5 border-white/10 text-white h-12"
                                        />
                                        {imagePreview && (
                                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-800">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setImagePreview(null)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 py-2 border-b border-white/5 pb-8">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={featured}
                                            onChange={(e) => setFeatured(e.target.checked)}
                                            className="w-5 h-5 rounded bg-white/5 border-white/10 text-purple-600 focus:ring-purple-500"
                                        />
                                        <label htmlFor="featured" className="text-sm text-slate-400 cursor-pointer font-medium">
                                            Mark as Featured Project
                                        </label>
                                    </div>

                                    {/* Milestones Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                Project Milestones
                                                <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded-full font-bold">{milestones?.length || 0}</span>
                                            </h3>
                                            <Button
                                                type="button"
                                                onClick={addMilestone}
                                                size="sm"
                                                variant="outline"
                                                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8"
                                            >
                                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Milestone
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {milestones?.map((milestone, idx) => (
                                                <motion.div
                                                    key={milestone.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative group"
                                                >
                                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            disabled={idx === 0}
                                                            onClick={() => moveMilestone(idx, 'up')}
                                                            className="p-1 bg-slate-800 border border-white/10 rounded-full text-slate-400 hover:text-white disabled:opacity-30"
                                                        >
                                                            <ArrowUpRight className="w-3 h-3 -rotate-45" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={idx === milestones.length - 1}
                                                            onClick={() => moveMilestone(idx, 'down')}
                                                            className="p-1 bg-slate-800 border border-white/10 rounded-full text-slate-400 hover:text-white disabled:opacity-30"
                                                        >
                                                            <ArrowUpRight className="w-3 h-3 rotate-[135deg]" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                        <div className="sm:col-span-1">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Year</label>
                                                            <Input
                                                                value={milestone.year}
                                                                onChange={(e) => updateMilestone(milestone.id, 'year', e.target.value)}
                                                                placeholder="2025"
                                                                className="bg-white/5 border-white/10 h-10"
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Title</label>
                                                            <Input
                                                                value={milestone.title}
                                                                onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                                                                placeholder="e.g. Beta Launch"
                                                                className="bg-white/5 border-white/10 h-10"
                                                            />
                                                        </div>
                                                        <div className="flex items-end justify-end">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                onClick={() => removeMilestone(milestone.id)}
                                                                className="text-red-400 hover:bg-red-500/10 h-10 w-10 p-0 ring-0 outline-0"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="sm:col-span-4 space-y-1">
                                                            <div className="flex justify-between">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Description</label>
                                                                <span className="text-[10px] text-slate-600">{milestone.description.length} chars</span>
                                                            </div>
                                                            <Textarea
                                                                value={milestone.description}
                                                                onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                                                                placeholder="Add milestone details here..."
                                                                className="bg-white/5 border-white/10 min-h-[60px] text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {(!milestones || milestones.length === 0) && (
                                                <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl">
                                                    <p className="text-slate-500 text-xs italic">No milestones added yet. Add some to build a timeline!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        editingProject ? "Update Project" : "Add Project"
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
