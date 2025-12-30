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
    type DocumentData
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
    createdAt?: any
}

const COLLECTION_NAME = "projects"

export const getProjects = async (): Promise<Project[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
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
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...project,
            createdAt: serverTimestamp(),
        })
        return docRef.id
    } catch (error) {
        console.error("Error adding project: ", error)
        throw error
    }
}

export const updateProject = async (id: string, project: Partial<Project>) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id)
        await updateDoc(docRef, project)
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
