"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, Loader2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [password, setPassword] = useState("")
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth")
        if (auth === "true") {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            localStorage.setItem("admin_auth", "true")
            toast.success("Welcome back, Admin!")
        } else {
            toast.error("Invalid password")
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("admin_auth")
        toast.success("Logged out successfully")
        router.push("/admin")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
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
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <AdminSidebar onLogout={handleLogout} />
            <div className="ml-0 md:ml-64 min-h-screen flex flex-col transition-all duration-300">
                <AdminHeader />
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
