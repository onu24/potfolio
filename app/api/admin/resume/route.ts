import { NextResponse } from "next/server"
import { updateResumeSettings } from "@/lib/firestore"

export async function POST(req: Request) {
    try {
        const { url, password } = await req.json()

        // Basic security check since the admin panel uses this password
        if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 })
        }

        await updateResumeSettings(url)
        return NextResponse.json({ message: "Resume updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 })
    }
}
