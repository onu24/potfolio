"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Menu, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getResumeSettings } from "@/lib/firestore"

const navLinks = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
]

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [resumeUrl, setResumeUrl] = useState<string | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)

        const fetchResume = async () => {
            try {
                const res = await fetch("/api/resume")
                if (res.ok) {
                    const settings = await res.json()
                    if (settings?.url) setResumeUrl(settings.url)
                }
            } catch (error) {
                console.error("Failed to fetch resume:", error)
            }
        }
        fetchResume()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 w-full max-w-4xl",
                    scrolled
                        ? "bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
                        : "bg-transparent border-transparent"
                )}
            >
                {/* Logo */}
                <a href="#" className="text-xl font-bold tracking-tighter text-white">
                    MC<span className="text-purple-500">.</span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <a
                        href={resumeUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" /> Resume
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-4 right-4 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:hidden z-[101] shadow-2xl"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-slate-300 hover:text-white"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="w-full h-px bg-white/5 my-2" />
                            <Button
                                asChild
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 text-base font-bold"
                            >
                                <a href={resumeUrl || "#"} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4 mr-2" /> Download Resume
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
