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

const MIGRATION_PROJECTS: Omit<Project, "id" | "createdAt">[] = [
    {
        title: "Learnsphere – e-commerce learning platform",
        description: "A clean e-commerce interface for browsing and purchasing courses. Built with modern full-stack tools.",
        techStack: ["Next.js", "Firebase", "Tailwind CSS", "Vercel", "Google AI Studio", "Antigravity"],
        link: "https://learnsphere-v1.vercel.app",
        category: "SaaS",
        featured: true,
        imageUrl: "/projects/learnsphere.jpg",
    },
    {
        title: "Personal Portfolio – Full Stack Developer",
        description: "A minimal, dark-themed portfolio showcasing my work and skills. Built with Next.js and Tailwind CSS.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Firebase"],
        link: "https://potfolio-pearl.vercel.app",
        category: "Portfolio",
        featured: true,
        imageUrl: "",
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
        const q = collection(db, COLLECTION_NAME)
        const snapshot = await getDocs(q)

        // Delete all existing documents
        const deletePromises = snapshot.docs.map(doc => deleteProject(doc.id))
        await Promise.all(deletePromises)

        console.log("Old data cleared. Seeding new data...")
        // Seed with migration data
        for (const project of MIGRATION_PROJECTS) {
            await addProject(project)
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
