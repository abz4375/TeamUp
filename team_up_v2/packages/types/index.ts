// Shared TypeScript types and interfaces

export type UserRole = 'OWNER' | 'MAINTAINER' | 'CONTRIBUTOR'

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED'

export interface User {
    id: string
    name: string
    email: string
    image?: string
    createdAt: Date
    updatedAt: Date
}

export interface Project {
    id: string
    title: string
    description?: string
    ownerId: string
    createdAt: Date
    updatedAt: Date
}

export interface Task {
    id: string
    description: string
    status: TaskStatus
    submitted: boolean
    projectId: string
    creatorId: string
    createdAt: Date
    updatedAt: Date
    submittedAt?: Date
}
