"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    FolderKanban,
    MessageSquare,
    Plus,
    ArrowUpRight,
    Loader2,
    CheckCircle2,
    Clock,
    TrendingUp
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getProjects, getAllMessages, type Project, type ContactMessage } from "@/lib/firestore"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalMessages: 0,
        unreadMessages: 0
    })
    const [recentProjects, setRecentProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const [projects, messages] = await Promise.all([
                    getProjects(),
                    getAllMessages()
                ])

                setStats({
                    totalProjects: projects.length,
                    totalMessages: messages.length,
                    unreadMessages: messages.filter(m => !m.read).length
                })

                setRecentProjects(projects.slice(0, 3))
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
    }

    const cards = [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            link: "/admin/projects"
        },
        {
            title: "Total Messages",
            value: stats.totalMessages,
            icon: MessageSquare,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            link: "/admin/messages"
        },
        {
            title: "Unread Messages",
            value: stats.unreadMessages,
            icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-500/10",
            link: "/admin/messages"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.04] transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-2 rounded-xl", card.bg, card.color)}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <Link href={card.link} className="text-slate-500 hover:text-white transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-400">{card.title}</p>
                            <p className="text-3xl font-bold text-white">{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-500" /> Recent Projects
                        </h3>
                        <Button asChild variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
                            <Link href="/admin/projects">View All</Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {recentProjects.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No projects added yet.</p>
                        ) : (
                            recentProjects.map((project) => (
                                <div key={project.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                                            {project.imageUrl ? (
                                                <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-purple-500/10 text-purple-400 font-bold text-xs uppercase">
                                                    {project.title[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{project.title}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{project.category}</p>
                                        </div>
                                    </div>
                                    <Link href="/admin/projects" className="p-2 text-slate-500 hover:text-purple-400 transition-colors">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions & Tips */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Quick Start</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white h-10 rounded-xl px-4 font-bold transition-all shadow-lg shadow-purple-500/20">
                                <Link href="/admin/projects">
                                    <Plus className="w-4 h-4 mr-2" /> New Project
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 text-white h-10 rounded-xl">
                                <Link href="/admin/messages">
                                    <MessageSquare className="w-4 h-4 mr-2" /> View Inbox
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" /> Admin Tips
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-sm text-slate-400 flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                                Use direct image URLs for project thumbnails for best performance.
                            </li>
                            <li className="text-sm text-slate-400 flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                Mark your best work as "Featured" to highlight them on the home page.
                            </li>
                            <li className="text-sm text-slate-400 flex gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                Regularly check your inbox for new inquiries and collaboration requests.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
