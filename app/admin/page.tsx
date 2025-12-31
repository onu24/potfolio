"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FolderKanban, MessageSquare, ArrowUpRight, Plus, Eye, Zap, AlertCircle } from "lucide-react"
import { getProjects, getAllMessages, resetAndSeedProjects, type Project, type ContactMessage } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminDashboard() {
    const [projectsCount, setProjectsCount] = useState(0)
    const [messagesCount, setMessagesCount] = useState(0)
    const [unreadCount, setUnreadCount] = useState(0)
    const [recentProjects, setRecentProjects] = useState<Project[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projects, messages] = await Promise.all([getProjects(), getAllMessages()])
                setProjectsCount(projects.length)
                setMessagesCount(messages.length)
                setUnreadCount(messages.filter(m => !m.read).length)
                setRecentProjects(projects.slice(0, 3))
            } catch (error) {
                console.error("Failed to fetch dashboard stat", error)
            }
        }
        fetchData()
    }, [])

    const handleReset = async () => {
        if (!confirm("DANGER: This will delete ALL current projects and reset to defaults. Are you sure?")) return
        try {
            await resetAndSeedProjects()
            toast.success("Database reset to defaults")
            window.location.reload()
        } catch (error) {
            toast.error("Failed to reset database")
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={item} className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FolderKanban className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Projects</p>
                        <h3 className="text-4xl font-bold text-white mb-2">{projectsCount}</h3>
                        <Link href="/admin/projects" className="text-purple-400 text-xs font-bold flex items-center gap-1 hover:underline">
                            Manage Projects <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Messages</p>
                        <h3 className="text-4xl font-bold text-white mb-2">{messagesCount}</h3>
                        <Link href="/admin/messages" className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                            View Inbox <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-purple-600 p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Zap className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-purple-200 text-sm font-medium uppercase tracking-wider mb-1">New Messages</p>
                        <h3 className="text-4xl font-bold text-white mb-2">{unreadCount}</h3>
                        <p className="text-purple-100 text-xs opacity-80">Requiring attention</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 flex flex-col justify-center gap-3">
                    <Button onClick={handleReset} variant="outline" className="w-full justify-start text-red-400 border-red-500/20 hover:bg-red-500/10">
                        <AlertCircle className="w-4 h-4 mr-2" /> Reset Database
                    </Button>
                    <Button asChild className="w-full justify-start bg-white/5 hover:bg-white/10 text-slate-300">
                        <Link href="/" target="_blank">
                            <Eye className="w-4 h-4 mr-2" /> View Live Site
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Recent Projects Section */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recent Projects</h2>
                        <Link href="/admin/projects" className="text-sm text-purple-400 hover:text-purple-300">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {recentProjects.map((project) => (
                            <div key={project.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
                                <div className="w-16 h-12 bg-slate-800 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><FolderKanban className="w-5 h-5" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-200 truncate">{project.title}</h4>
                                    <p className="text-xs text-slate-500 truncate">{project.category} • {project.techStack[0]}</p>
                                </div>
                                {project.featured && <div className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase">Featured</div>}
                            </div>
                        ))}
                        {recentProjects.length === 0 && (
                            <p className="text-slate-500 text-sm italic">No recent projects found.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="bg-gradient-to-b from-purple-900/20 to-slate-900/50 border border-purple-500/20 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Tips</h3>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                            <span>Keep your project images optimized (under 2MB) for faster loading.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                            <span>Marking a project as "Featured" puts it at the top of your portfolio.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                            <span>Check messages daily to respond to potential leads quickly.</span>
                        </li>
                    </ul>

                    <Button asChild className="w-full mt-8 bg-purple-600 hover:bg-purple-700">
                        <Link href="/admin/projects"><Plus className="w-4 h-4 mr-2" /> Add New Project</Link>
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    )
}
