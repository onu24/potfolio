"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, CheckCircle2, Mail, Clock, Loader2, Inbox, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getAllMessages, markMessageAsRead, deleteMessage, type ContactMessage } from "@/lib/firestore"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<"all" | "unread">("all")

    useEffect(() => {
        fetchMessages()
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

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filter === "all" || (filter === "unread" && !msg.read)
        return matchesSearch && matchesFilter
    })

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 shrink-0">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search inbox..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-white/10 text-white"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant={filter === "all" ? "secondary" : "ghost"}
                        onClick={() => setFilter("all")}
                        className="flex-1 md:flex-none"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "unread" ? "secondary" : "ghost"}
                        onClick={() => setFilter("unread")}
                        className="flex-1 md:flex-none"
                    >
                        Unread Only
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">

                    {/* Messages List Column */}
                    <div className={cn(
                        "lg:col-span-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar",
                        selectedMessage ? "hidden lg:flex" : "flex"
                    )}>
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-slate-500 text-sm">No messages found.</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    onClick={() => setSelectedMessage(msg)}
                                    className={cn(
                                        "p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group text-left",
                                        selectedMessage?.id === msg.id
                                            ? 'bg-purple-500/10 border-purple-500/50'
                                            : msg.read
                                                ? 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/[0.04]'
                                                : 'bg-white/[0.05] border-white/10 hover:border-white/20'
                                    )}
                                >
                                    {!msg.read && (
                                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                                    )}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 border border-white/5">
                                            {msg.name[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-sm truncate text-slate-200">{msg.name}</h4>
                                                <span className="text-[10px] text-slate-500 tabular-nums">{formatDate(msg.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pl-11">
                                        {msg.message}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Message Detail Column */}
                    <div className={cn(
                        "lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full",
                        !selectedMessage ? "hidden lg:flex" : "flex"
                    )}>
                        <AnimatePresence mode="wait">
                            {selectedMessage ? (
                                <motion.div
                                    key={selectedMessage.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Mobile Header: Back Button */}
                                    <div className="lg:hidden p-4 border-b border-white/10 flex items-center gap-2 text-slate-400" onClick={() => setSelectedMessage(null)}>
                                        <ArrowLeft className="w-4 h-4" /> Back to Inbox
                                    </div>

                                    {/* Message Header */}
                                    <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-xl md:text-2xl font-bold text-white uppercase">
                                                {selectedMessage.name[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-bold text-white">{selectedMessage.name}</h2>
                                                <a href={`mailto:${selectedMessage.email}`} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> {selectedMessage.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            {!selectedMessage.read && (
                                                <Button onClick={() => handleMarkAsRead(selectedMessage.id!)} variant="outline" size="sm" className="flex-1 md:flex-none border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Read
                                                </Button>
                                            )}
                                            <Button onClick={() => handleDelete(selectedMessage.id!)} variant="outline" size="icon" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="w-3 h-3" /> {formatDate(selectedMessage.createdAt)}
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                            {selectedMessage.message}
                                        </div>
                                    </div>

                                    {/* Reply Action */}
                                    <div className="p-6 border-t border-white/5 bg-black/20">
                                        <Button className="w-full bg-white text-black hover:bg-slate-200" asChild>
                                            <a href={`mailto:${selectedMessage.email}?subject=Reply: Portfolio Contact`}>Reply via Email</a>
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                        <Inbox className="w-8 h-8 opacity-40" />
                                    </div>
                                    <p>Select a message to view details</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    )
}
