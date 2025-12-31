"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Clock, Trash2, CheckCircle2, Search, X, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getAllMessages, markMessageAsRead, deleteMessage, type ContactMessage } from "@/lib/firestore"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const data = await getAllMessages()
            setMessages(data)
        } catch (error) {
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    const handleRead = async (id: string) => {
        try {
            await markMessageAsRead(id)
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, read: true })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message?")) return
        try {
            await deleteMessage(id)
            setMessages(messages.filter(m => m.id !== id))
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

    const filteredMessages = messages.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.message.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filter === 'all' || !m.read
        return matchesSearch && matchesFilter
    })

    return (
        <div className="h-[calc(screen-12rem)] flex flex-col">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5 w-fit">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", filter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white')}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", filter === 'unread' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white')}
                    >
                        Unread
                    </button>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search inbox..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-sm h-10 rounded-xl focus:ring-purple-500/50"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-0">

                    {/* Messages List Column */}
                    <div className={cn(
                        "lg:col-span-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar",
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
                                    onClick={() => {
                                        setSelectedMessage(msg)
                                        if (!msg.read && msg.id) handleRead(msg.id)
                                    }}
                                    className={cn(
                                        "p-3 rounded-xl border cursor-pointer transition-all duration-200 relative group text-left",
                                        selectedMessage?.id === msg.id
                                            ? 'bg-purple-500/10 border-purple-500/50'
                                            : msg.read
                                                ? 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/[0.04]'
                                                : 'bg-white/[0.05] border-white/10 hover:border-white/20'
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-200 text-sm">{msg.name}</h4>
                                        <span className="text-[10px] text-slate-500">{formatDate(msg.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                                    {!msg.read && (
                                        <div className="absolute top-3 right-[-4px] w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Message Details Column */}
                    <div className={cn(
                        "lg:col-span-2 bg-slate-900/30 border border-white/5 rounded-3xl overflow-hidden flex flex-col",
                        !selectedMessage ? "hidden lg:flex items-center justify-center italic text-slate-600" : "flex"
                    )}>
                        {!selectedMessage ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-6 rounded-full bg-white/5">
                                    <Mail className="w-12 h-12 text-slate-700" />
                                </div>
                                <p>Select a message to read</p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                {/* Mobile Headers */}
                                <div className="lg:hidden p-4 border-b border-white/5">
                                    <button onClick={() => setSelectedMessage(null)} className="flex items-center gap-2 text-purple-400 text-sm font-bold">
                                        <ArrowLeft className="w-4 h-4" /> Back to Inbox
                                    </button>
                                </div>

                                {/* Message Header */}
                                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-lg md:text-xl font-bold text-white uppercase">
                                            {selectedMessage.name[0]}
                                        </div>
                                        <div>
                                            <h2 className="text-lg md:text-xl font-bold text-white">{selectedMessage.name}</h2>
                                            <a href={`mailto:${selectedMessage.email}`} className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> {selectedMessage.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => selectedMessage.id && handleDelete(selectedMessage.id)}
                                            className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex-1 md:flex-none"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div className="p-4 md:p-6 flex-1 overflow-y-auto space-y-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" /> {formatDate(selectedMessage.createdAt)}
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-sm">
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                {/* Reply Action */}
                                <div className="p-4 border-t border-white/5 bg-black/20">
                                    <Button className="w-full bg-white text-black hover:bg-slate-200" asChild>
                                        <a href={`mailto:${selectedMessage.email}?subject=Reply: Portfolio Contact`}>Reply via Email</a>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
