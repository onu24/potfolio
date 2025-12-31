import { NextResponse } from "next/server"
import { getResumeSettings } from "@/lib/firestore"

export async function GET() {
    try {
        const settings = await getResumeSettings()
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
    }
}
