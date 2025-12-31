"use client"

import { usePathname } from "next/navigation"

export function AdminHeader() {
    const pathname = usePathname()

    const getPageTitle = (path: string) => {
        if (path === "/admin") return "Dashboard Overview"
        if (path.startsWith("/admin/projects")) return "Projects Manager"
        if (path.startsWith("/admin/messages")) return "Inbox"
        return "Admin Panel"
    }

    return (
        <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/5 ml-0 md:ml-64 transition-all duration-300">
            <div className="h-12 px-3 md:px-4 flex items-center justify-between">
                <div className="flex items-center gap-4 ml-10 md:ml-0">
                    <h1 className="text-sm font-semibold text-slate-200">
                        {getPageTitle(pathname)}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-white">Mayank Chauhan</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Super Admin</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                        MC
                    </div>
                </div>
            </div>
        </header>
    )
}
