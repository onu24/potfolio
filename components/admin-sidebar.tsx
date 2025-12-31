"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
    onLogout: () => void
}

const navItems = [
    {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Projects",
        href: "/admin/projects",
        icon: FolderKanban,
    },
    {
        title: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
    },
]

export function AdminSidebar({ onLogout }: SidebarProps) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-slate-900 border-white/10 text-white"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="mb-6 flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white">
                            M
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Admin<span className="text-purple-500">Panel</span></span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                                        isActive
                                            ? "bg-purple-500/10 text-purple-400"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-white")} />
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                        >
                            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    )
}
"
