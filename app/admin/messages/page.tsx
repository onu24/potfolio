"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    Trash2,
    CheckCircle2,
    Mail,
    Clock,
    User,
    Loader2,
    ChevronRight,
    Inbox,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import {
    getAllMessages,
    markMessageAsRead,
    deleteMessage,
    type ContactMessage
} from "@/lib/firestore"

export default function MessagesPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth")
        if (auth === "true") {
            setIsAuthenticated(true)
            fetchMessages()
        } else {
            window.location.href = "/admin"
        }
    }, [])

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const data = await getAllMessages()
            setMessages(data)
        } catch (error) {
            toast.error("Failed to fetch messages")
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (id: string) => {
        try {
            await markMessageAsRead(id)
            setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg))
            if (selectedMessage?.id === id) {
                setSelectedMessage(prev => prev ? { ...prev, read: true } : null)
            }
            toast.success("Message marked as read")
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return

        try {
            await deleteMessage(id)
            setMessages(prev => prev.filter(msg => msg.id !== id))
            if (selectedMessage?.id === id) setSelectedMessage(null)
            toast.success("Message deleted")
        } catch (error) {
            toast.error("Failed to delete message")
        }
    }

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Just now"
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (!isAuthenticated) return null

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto font-sans">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-1">
                        <Link
                            href="/admin"
                            className="text-slate-500 hover:text-white flex items-center gap-2 text-sm transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold tracking-tight">Inbox</h1>
                        <p className="text-slate-400">View and manage messages from your portfolio.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                        <Inbox className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-bold">
                            {messages.filter(m => !m.read).length} Unread
                        </span>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-300px)]">
                        {/* Messages List */}
                        <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {messages.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-slate-500 text-sm">No messages yet.</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative group ${selectedMessage?.id === msg.id
                                                ? 'bg-purple-500/10 border-purple-500/50'
                                                : msg.read
                                                    ? 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:bg-white/[0.04]'
                                                    : 'bg-white/[0.05] border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {!msg.read && (
                                            <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                                        )}
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold shrink-0">
                                                {msg.name[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm truncate">{msg.name}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{formatDate(msg.createdAt)}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {msg.message}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Message Detail View */}
                        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                            <AnimatePresence mode="wait">
                                {selectedMessage ? (
                                    <motion.div
                                        key={selectedMessage.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="p-8 border-b border-white/5 flex justify-between items-start">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-2xl font-bold text-white uppercase">
                                                        {selectedMessage.name[0]}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-white">{selectedMessage.name}</h2>
                                                        <a href={`mailto:${selectedMessage.email}`} className="text-purple-400 hover:text-purple-300 text-sm transition-colors flex items-center gap-2">
                                                            <Mail className="w-4 h-4" />
                                                            {selectedMessage.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!selectedMessage.read && (
                                                    <Button
                                                        onClick={() => handleMarkAsRead(selectedMessage.id!)}
                                                        size="sm"
                                                        className="bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all rounded-xl h-10 px-4"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Read
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => handleDelete(selectedMessage.id!)}
                                                    size="icon"
                                                    className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded-xl h-10 w-10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-grow overflow-y-auto space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                                                    <Clock className="w-3 h-3" /> Sent On
                                                </div>
                                                <p className="text-sm text-slate-400">{formatDate(selectedMessage.createdAt)}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
                                                    <Mail className="w-3 h-3" /> Content
                                                </div>
                                                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl">
                                                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                        {selectedMessage.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 border-t border-white/5 bg-black/20">
                                            <Button
                                                className="w-full bg-white text-black hover:bg-slate-200 rounded-xl h-12 font-bold transition-all"
                                                asChild
                                            >
                                                <a href={`mailto:${selectedMessage.email}?subject=Reply: Portfolio Contact - ${selectedMessage.name}`}>
                                                    Reply via Email
                                                </a>
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                                        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 mb-2">
                                            <Mail className="w-8 h-8 opacity-20" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-400">Select a message</h3>
                                        <p className="text-sm text-slate-500 max-w-[240px]">
                                            Click on any message in the inbox to read the full content and reply.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    )
}
