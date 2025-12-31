import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    type DocumentData,
    writeBatch
} from "firebase/firestore"
import { db } from "./firebase"

export interface Project {
    id?: string
    title: string
    description: string
    techStack: string[]
    link: string
    category: string
    featured: boolean
    imageUrl: string
    imageId?: string // Reference to project_images document
    createdAt?: any
}

export interface ProjectImage {
    id?: string
    url: string
    alt: string
    createdAt?: any
}

export interface ContactMessage {
    id?: string
    name: string
    email: string
    message: string
    read: boolean
    createdAt?: any
}

const COLLECTION_NAME = "projects"
const MESSAGES_COLLECTION = "messages"
const IMAGES_COLLECTION_NAME = "project_images"

const MIGRATION_IMAGES: Omit<ProjectImage, "id" | "createdAt">[] = [
    {
        url: "/projects/learnsphere.jpg",
        alt: "Learnsphere Project Screenshot"
    },
    {
        url: "https://iili.io/fXGDISV.jpg",
        alt: "Portfolio Project Screenshot"
    }
]

const MIGRATION_PROJECTS: Omit<Project, "id" | "createdAt">[] = [
    {
        title: "Learnsphere – e-commerce learning platform",
        description: "A clean e-commerce interface for browsing and purchasing courses. Built with modern full-stack tools.",
        techStack: ["Next.js", "Firebase", "Tailwind CSS", "Vercel", "Google AI Studio", "Antigravity"],
        link: "https://learnsphere-v1.vercel.app",
        category: "SaaS",
        featured: true,
        imageUrl: "", // Will be populated from reference
        // imageId will be added dynamically during seed
    },
    {
        title: "Personal Portfolio – Full Stack Developer",
        description: "A minimal, dark-themed portfolio showcasing my work and skills. Built with Next.js and Tailwind CSS.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Firebase"],
        link: "https://potfolio-pearl.vercel.app",
        category: "Portfolio",
        featured: true,
        imageUrl: "", // Will be populated from reference
    },
]

export const migrateProjects = async () => {
    try {
        const q = collection(db, COLLECTION_NAME)
        const snapshot = await getDocs(q)
        if (snapshot.empty) {
            console.log("Migrating initial projects...")
            for (const project of MIGRATION_PROJECTS) {
                await addProject(project)
            }
        }
    } catch (error) {
        console.error("Migration failed: ", error)
    }
}

export const resetAndSeedProjects = async () => {
    try {
        console.log("Resetting database...")

        // Clear Projects
        const qProjects = collection(db, COLLECTION_NAME)
        const snapshotProjects = await getDocs(qProjects)
        const deleteProjectsPromises = snapshotProjects.docs.map(doc => deleteProject(doc.id))

        // Clear Images
        const qImages = collection(db, IMAGES_COLLECTION_NAME)
        const snapshotImages = await getDocs(qImages)
        const deleteImagesPromises = snapshotImages.docs.map(doc => deleteDoc(doc.ref))

        await Promise.all([...deleteProjectsPromises, ...deleteImagesPromises])

        console.log("Old data cleared. Seeding new data...")

        // 1. Seed Images and capture their IDs
        const imageIds: Record<string, string> = {} // url -> firestore_id

        for (const image of MIGRATION_IMAGES) {
            const docRef = await addDoc(collection(db, IMAGES_COLLECTION_NAME), {
                ...image,
                createdAt: serverTimestamp(),
            })
            imageIds[image.url] = docRef.id
            console.log(`Seeded image: ${image.url} -> ID: ${docRef.id}`)
        }

        // 2. Seed Projects with references
        for (const project of MIGRATION_PROJECTS) {
            // Determine which image belongs to which project
            let targetImageId: string | undefined
            let targetImageUrl = ""

            // Simple logic to match project to image based on known data
            if (project.title.includes("Learnsphere")) {
                targetImageUrl = "/projects/learnsphere.jpg"
            } else if (project.title.includes("Portfolio")) {
                targetImageUrl = "https://iili.io/fXGDISV.jpg"
            }

            if (targetImageUrl && imageIds[targetImageUrl]) {
                targetImageId = imageIds[targetImageUrl]
            }

            await addProject({
                ...project,
                imageUrl: targetImageUrl, // Denormalized for easy display
                imageId: targetImageId,   // Reference for structure
            })
        }
        console.log("Database seeded successfully.")
    } catch (error) {
        console.error("Reset failed: ", error)
        throw error
    }
}

export const getProjects = async (): Promise<Project[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            await migrateProjects()
            // Re-fetch after migration
            const newSnapshot = await getDocs(q)
            return newSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Project[]
        }

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Project[]
    } catch (error) {
        console.error("Error fetching projects: ", error)
        throw error
    }
}

export const addProject = async (project: Omit<Project, "id" | "createdAt">) => {
    try {
        console.log("Firestore: Adding new project with data:", project)
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...project,
            createdAt: serverTimestamp(),
        })
        console.log("Firestore: Project added successfully with ID:", docRef.id)
        return docRef.id
    } catch (error) {
        console.error("Error adding project: ", error)
        throw error
    }
}

export const updateProject = async (id: string, project: Partial<Project>) => {
    try {
        console.log(`Firestore: Updating project ${id} with data:`, project)
        const docRef = doc(db, COLLECTION_NAME, id)
        await updateDoc(docRef, project)
        console.log(`Firestore: Project ${id} updated successfully`)
    } catch (error) {
        console.error("Error updating project: ", error)
        throw error
    }
}

export const deleteProject = async (id: string) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id)
        await deleteDoc(docRef)
    } catch (error) {
        console.error("Error deleting project: ", error)
        throw error
    }
}

// Message Operations
export const addMessage = async (message: Omit<ContactMessage, "id" | "createdAt" | "read">) => {
    try {
        const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
            ...message,
            read: false,
            createdAt: serverTimestamp(),
        })
        return docRef.id
    } catch (error) {
        console.error("Error adding message: ", error)
        throw error
    }
}

export const getAllMessages = async (): Promise<ContactMessage[]> => {
    try {
        const q = query(collection(db, MESSAGES_COLLECTION), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ContactMessage[]
    } catch (error) {
        console.error("Error fetching messages: ", error)
        throw error
    }
}

export const markMessageAsRead = async (id: string) => {
    try {
        const docRef = doc(db, MESSAGES_COLLECTION, id)
        await updateDoc(docRef, { read: true })
    } catch (error) {
        console.error("Error marking message as read: ", error)
        throw error
    }
}

export const deleteMessage = async (id: string) => {
    try {
        const docRef = doc(db, MESSAGES_COLLECTION, id)
        await deleteDoc(docRef)
    } catch (error) {
        console.error("Error deleting message: ", error)
        throw error
    }
}
