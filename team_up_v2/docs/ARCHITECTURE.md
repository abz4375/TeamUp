# Team-Up V2 - Architecture Document

## Document Information

**Version:** 2.0.0  
**Last Updated:** January 22, 2026  
**Status:** Architecture Design  
**Authors:** Development Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Principles](#2-architecture-principles)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Architecture](#7-database-architecture)
8. [Security Architecture](#8-security-architecture)
9. [Scalability & Performance](#9-scalability--performance)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Migration Strategy](#12-migration-strategy)

---

## 1. Executive Summary

Team-Up V2 represents a complete architectural overhaul, leveraging cutting-edge technologies and industry best practices to create a highly scalable, maintainable, and performant collaboration platform. The architecture is designed around modern principles: microservices-inspired modularity, serverless-first approach, real-time capabilities, and type-safe development.

### Key Architectural Decisions

- **Framework:** Next.js 15 with App Router (React Server Components)
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS v4)
- **Backend:** Next.js API Routes + tRPC for type-safe APIs
- **Database:** PostgreSQL with Prisma ORM
- **Real-Time:** Socket.io (self-hosted WebSockets)
- **Authentication:** NextAuth v5 (Auth.js) with Google OAuth
- **State Management:** Zustand + React Query (TanStack Query)
- **File Storage:** MinIO (self-hosted, S3-compatible)
- **Deployment:** Coolify (self-hosted PaaS) or Docker Compose + Caddy

---

## 2. Architecture Principles

### 2.1 Core Principles

```mermaid
graph LR
    A[Type Safety] --> B[Developer Experience]
    C[Modularity] --> B
    D[Scalability] --> E[User Experience]
    F[Performance] --> E
    G[Security] --> H[Reliability]
    I[Observability] --> H
```

#### 2.1.1 Type Safety First
- **End-to-end TypeScript:** 100% TypeScript codebase
- **Type-safe APIs:** tRPC for full-stack type safety
- **Schema validation:** Zod for runtime validation
- **Database type safety:** Prisma Client with generated types

#### 2.1.2 Developer Experience (DX)
- **Fast feedback loops:** Hot Module Replacement (HMR) <100ms
- **Comprehensive tooling:** ESLint, Prettier, Husky, lint-staged
- **Component documentation:** Storybook for UI components
- **API documentation:** Auto-generated from tRPC schemas

#### 2.1.3 Performance by Default
- **React Server Components:** Reduce client-side JavaScript
- **Streaming SSR:** Progressive page rendering
- **Image optimization:** Next.js Image with WebP/AVIF
- **Code splitting:** Automatic route-based splitting
- **Edge computing:** Deploy static/edge functions globally

#### 2.1.4 Scalability & Modularity
- **Monorepo structure:** Clear separation of concerns
- **Feature-based organization:** Colocate related code
- **Dependency injection:** Testable, swappable services
- **Horizontal scaling:** Stateless application design

#### 2.1.5 Security & Compliance
- **Zero-trust architecture:** Verify all requests
- **Principle of least privilege:** Role-based access control
- **Data encryption:** At-rest and in-transit
- **Regular audits:** Automated security scanning

---

## 3. Technology Stack

### 3.1 Frontend Stack

```typescript
// Modern Frontend Stack
{
  "framework": "Next.js 15.x",
  "language": "TypeScript 5.x",
  "ui": {
    "components": "shadcn/ui + Radix UI",
    "styling": "Tailwind CSS v4",
    "icons": "Lucide React",
    "animations": "Framer Motion"
  },
  "state": {
    "client": "Zustand",
    "server": "TanStack Query (React Query)",
    "forms": "React Hook Form + Zod"
  },
  "realtime": "Socket.io-client (self-hosted)",
  "markdown": "MDX + remark/rehype plugins"
}
```

#### Why shadcn/ui?
- ✅ **Copy-paste architecture:** Components live in your codebase
- ✅ **Full customization:** Modify components as needed
- ✅ **Accessibility:** Built on Radix UI primitives (WCAG AA)
- ✅ **Type-safe:** Full TypeScript support
- ✅ **Beautiful defaults:** Production-ready designs
- ✅ **Tailwind v4 ready:** Latest CSS features

### 3.2 Backend Stack

```typescript
// Modern Backend Stack
{
  "framework": "Next.js 15 API Routes",
  "api": {
    "protocol": "tRPC v11",
    "validation": "Zod",
    "authentication": "NextAuth v5 (Auth.js)",
    "authorization": "CASL (isomorphic)"
  },
  "database": {
    "primary": "PostgreSQL 16",
    "orm": "Prisma 6.x",
    "migrations": "Prisma Migrate",
    "caching": "Redis 7 (self-hosted) or Dragonfly"
  },
  "storage": {
    "files": "MinIO (self-hosted, S3-compatible)",
    "cdn": "Caddy server with caching"
  },
  "email": "Postal (self-hosted) or Nodemailer",
  "jobs": "BullMQ (open source)"
}
```

#### Why tRPC?
- ✅ **End-to-end type safety:** Frontend knows backend types
- ✅ **No code generation:** Direct TypeScript inference
- ✅ **Auto-completion:** Full IDE support
- ✅ **Reduced boilerplate:** No REST/GraphQL schema definitions
- ✅ **Lightweight:** Minimal runtime overhead

#### Why PostgreSQL + Prisma?
- ✅ **Relational data model:** Perfect for project/task relationships
- ✅ **Type-safe queries:** Prisma Client auto-generated
- ✅ **Migration system:** Version-controlled schema changes
- ✅ **Performance:** Optimized query engine
- ✅ **Ecosystem:** Rich extension support (PostGIS, full-text search)

### 3.3 DevOps & Infrastructure

```yaml
# Modern DevOps Stack
ci_cd:
  platform: "GitHub Actions"
  checks:
    - "TypeScript type checking"
    - "ESLint + Prettier"
    - "Unit tests (Vitest)"
    - "Integration tests (Playwright)"
    - "E2E tests (Playwright)"
    - "Bundle size analysis"

deployment:
  platform: "Coolify (self-hosted PaaS) or Docker Compose"
  web_server: "Caddy (auto HTTPS, HTTP/3)"
  database: "PostgreSQL 16 (self-hosted)"
  cache: "Redis 7 (self-hosted)"
  storage: "MinIO (self-hosted, S3-compatible)"
  monitoring: "GlitchTip + Umami + Grafana"
  logs: "Grafana Loki"

infrastructure_as_code:
  tool: "Docker Compose / Terraform"
  secrets: "Docker Secrets / Vault (optional)"
```

---

## 4. System Architecture

### 4.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser] --> B[Next.js Frontend]
        B --> C[shadcn/ui Components]
        B --> D[TanStack Query Cache]
    end
    
    subgraph "Web Server Layer - Caddy"
        E[Reverse Proxy]
        F[Static Assets CDN]
        G[Auto HTTPS]
    end
    
    subgraph "Application Layer"
        H[Next.js App Router]
        I[React Server Components]
        J[tRPC API Routes]
        K[NextAuth v5]
    end
    
    subgraph "Service Layer"
        L[Project Service]
        M[Task Service]
        N[User Service]
        O[File Service]
        P[Notification Service]
    end
    
    subgraph "Data Layer (Self-Hosted)"
        Q[(PostgreSQL 16)]
        R[(Redis 7)]
        S[MinIO Storage]
        T[Socket.io Server]
    end
    
    B --> E
    E --> H
    H --> J
    J --> L & M & N & O & P
    L & M & N --> Q
    L & M & N --> R
    O --> S
    P --> T
    T --> B
```

### 4.2 Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (Browser)
    participant W as Caddy (Web Server)
    participant A as App Server
    participant T as tRPC Router
    participant S as Service Layer
    participant D as PostgreSQL
    participant R as Redis
    participant WS as Socket.io

    U->>C: Interact with UI
    C->>W: HTTP/2 Request
    W->>W: Reverse Proxy + TLS
    W->>A: Forward to App Router
    A->>T: tRPC Procedure Call
    T->>T: Zod Validation
    T->>S: Service Method
    
    alt Cache Hit
        S->>R: Check Cache
        R->>S: Return Cached Data
    else Cache Miss
        S->>D: Query Database
        D->>S: Return Data
        S->>R: Update Cache
    end
    
    S->>T: Return Result
    T->>A: Type-safe Response
    A->>C: Stream Response
    C->>U: Update UI
    
    opt Real-time Update
        S->>WS: Emit Event
        WS->>C: Push Update
        C->>U: Live Update
    end
```

---

## 5. Frontend Architecture

### 5.1 Project Structure

```
team-up-v2/
├── apps/
│   └── web/                          # Next.js application
│       ├── app/                      # App Router
│       │   ├── (auth)/              # Auth routes group
│       │   │   ├── login/           
│       │   │   └── signup/          
│       │   ├── (dashboard)/         # Dashboard routes group
│       │   │   ├── layout.tsx       # Shared dashboard layout
│       │   │   ├── page.tsx         # Dashboard home
│       │   │   ├── projects/        
│       │   │   │   ├── page.tsx     # Projects list
│       │   │   │   └── [id]/        # Project detail
│       │   │   │       ├── page.tsx
│       │   │   │       └── tasks/   
│       │   │   └── settings/        
│       │   ├── api/                 # API routes
│       │   │   ├── trpc/[trpc]/route.ts
│       │   │   └── auth/[...nextauth]/route.ts
│       │   ├── layout.tsx           # Root layout
│       │   └── page.tsx             # Landing page
│       ├── components/              # React components
│       │   ├── ui/                  # shadcn/ui components
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── dialog.tsx
│       │   │   └── ...
│       │   ├── features/            # Feature-specific components
│       │   │   ├── project/
│       │   │   │   ├── ProjectCard.tsx
│       │   │   │   ├── ProjectForm.tsx
│       │   │   │   └── ProjectDashboard.tsx
│       │   │   ├── task/
│       │   │   └── team/
│       │   └── layouts/             # Layout components
│       ├── lib/                     # Utilities & configs
│       │   ├── trpc/                # tRPC client
│       │   │   ├── client.ts
│       │   │   └── react.tsx
│       │   ├── auth.ts              # NextAuth config
│       │   ├── db.ts                # Prisma client
│       │   └── utils.ts             # Utility functions
│       └── styles/
│           └── globals.css          # Global styles
├── packages/
│   ├── api/                         # tRPC API (shared)
│   │   ├── routers/
│   │   │   ├── project.ts
│   │   │   ├── task.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   ├── services/                # Business logic
│   │   │   ├── ProjectService.ts
│   │   │   ├── TaskService.ts
│   │   │   └── UserService.ts
│   │   └── middleware/
│   │       ├── auth.ts
│   │       └── logger.ts
│   ├── db/                          # Database (Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── seed.ts
│   ├── validation/                  # Zod schemas
│   │   ├── project.ts
│   │   ├── task.ts
│   │   └── user.ts
│   ├── config/                      # Shared configs
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── tailwind/
│   └── types/                       # Shared TypeScript types
│       └── index.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json                     # Workspace root
├── pnpm-workspace.yaml             # pnpm workspaces
└── turbo.json                      # Turborepo config
```

### 5.2 Component Architecture (shadcn/ui)

Team-Up V2 uses **shadcn/ui** for a modern, composable component architecture:

```typescript
// Example: Button component (apps/web/components/ui/button.tsx)
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### shadcn/ui Component Organization

```
components/ui/               # Base UI primitives (shadcn/ui)
├── button.tsx              # Button component
├── card.tsx                # Card layout
├── dialog.tsx              # Modal dialogs
├── dropdown-menu.tsx       # Dropdown menus
├── form.tsx                # Form components
├── input.tsx               # Input field
├── select.tsx              # Select dropdown
├── table.tsx               # Data tables
├── tabs.tsx                # Tab navigation
└── toast.tsx               # Toast notifications

components/features/         # Composed feature components
├── project/
│   ├── ProjectCard.tsx     # Uses: Card, Button, Badge
│   ├── ProjectForm.tsx     # Uses: Form, Input, Select
│   └── TeamMemberList.tsx  # Uses: Table, Avatar, DropdownMenu
└── task/
    ├── TaskCard.tsx        # Uses: Card, Checkbox, Badge
    └── TaskForm.tsx        # Uses: Form, Input, Textarea
```

### 5.3 State Management Strategy

```typescript
// Global state: Zustand
// File: lib/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  theme: 'light' | 'dark' | 'system'
  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'system',
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'auth-storage' }
  )
)

// Server state: TanStack Query
// File: components/features/project/ProjectList.tsx
'use client'

import { trpc } from '@/lib/trpc/client'

export function ProjectList() {
  const { data: projects, isLoading } = trpc.project.list.useQuery()
  
  // Optimistic update on mutation
  const utils = trpc.useContext()
  const createProject = trpc.project.create.useMutation({
    onMutate: async (newProject) => {
      // Cancel outgoing refetches
      await utils.project.list.cancel()
      
      // Snapshot previous value
      const previousProjects = utils.project.list.getData()
      
      // Optimistically update
      utils.project.list.setData(undefined, (old) => 
        old ? [...old, newProject as any] : [newProject as any]
      )
      
      return { previousProjects }
    },
    onError: (err, newProject, context) => {
      // Rollback on error
      utils.project.list.setData(undefined, context?.previousProjects)
    },
    onSettled: () => {
      // Refetch after mutation
      utils.project.list.invalidate()
    },
  })
  
  return (
    <div>
      {isLoading && <Skeleton />}
      {projects?.map(project => <ProjectCard key={project.id} {...project} />)}
    </div>
  )
}
```

### 5.4 Styling System (Tailwind CSS v4)

```css
/* apps/web/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Color palette with CSS variables */
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  
  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;
  
  --color-primary: 221.2 83.2% 53.3%;
  --color-primary-foreground: 210 40% 98%;
  
  --color-secondary: 210 40% 96.1%;
  --color-secondary-foreground: 222.2 47.4% 11.2%;
  
  --color-muted: 210 40% 96.1%;
  --color-muted-foreground: 215.4 16.3% 46.9%;
  
  --color-accent: 210 40% 96.1%;
  --color-accent-foreground: 222.2 47.4% 11.2%;
  
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 222.2 84% 4.9%;
    --color-foreground: 210 40% 98%;
    /* ... dark theme colors */
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 6. Backend Architecture

### 6.1 tRPC API Structure

```typescript
// packages/api/routers/project.ts
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { ProjectService } from '../services/ProjectService'
import { createProjectSchema, updateProjectSchema } from '@team-up/validation'

export const projectRouter = router({
  // List all projects for authenticated user
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return ProjectService.getUserProjects(ctx.user.id)
    }),
  
  // Get project by ID
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ProjectService.getById(input.id)
      // Authorization check
      if (!ProjectService.canView(project, ctx.user.id)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return project
    }),
  
  // Create new project
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      return ProjectService.create({
        ...input,
        ownerId: ctx.user.id
      })
    }),
  
  // Update project
  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const project = await ProjectService.getById(input.id)
      // Authorization check
      if (!ProjectService.canEdit(project, ctx.user.id)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return ProjectService.update(input.id, input)
    }),
  
  // Delete project
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const project = await ProjectService.getById(input.id)
      // Only owner can delete
      if (project.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return ProjectService.delete(input.id)
    }),
  
  // Add team member
  addMember: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      userId: z.string(),
      role: z.enum(['MAINTAINER', 'CONTRIBUTOR'])
    }))
    .mutation(async ({ input, ctx }) => {
      const project = await ProjectService.getById(input.projectId)
      // Only owner and maintainers can add members
      if (!ProjectService.canManageTeam(project, ctx.user.id)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return ProjectService.addMember(input.projectId, input.userId, input.role)
    }),
})
```

### 6.2 Service Layer Design

```typescript
// packages/api/services/ProjectService.ts
import { db } from '@team-up/db'
import { Prisma } from '@prisma/client'
import { redis } from '../lib/redis'
import { EventEmitter } from '../lib/events'

export class ProjectService {
  // Cache TTL: 5 minutes
  private static CACHE_TTL = 300
  
  static async getUserProjects(userId: string) {
    // Check cache first
    const cacheKey = `user:${userId}:projects`
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
    
    // Query database
    const projects = await db.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } }
          }
        },
        _count: { select: { tasks: true } }
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    // Cache result
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(projects))
    
    return projects
  }
  
  static async getById(id: string) {
    const cacheKey = `project:${id}`
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
    
    const project = await db.project.findUniqueOrThrow({
      where: { id },
      include: {
        owner: true,
        members: {
          include: { user: true }
        },
        tasks: {
          include: {
            assignees: { include: { user: true } }
          }
        }
      }
    })
    
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(project))
    return project
  }
  
  static async create(data: Prisma.ProjectCreateInput) {
    const project = await db.project.create({
      data: {
        ...data,
        members: {
          create: {
            userId: data.ownerId,
            role: 'OWNER'
          }
        }
      },
      include: {
        owner: true,
        members: { include: { user: true } }
      }
    })
    
    // Invalidate user's project list cache
    await this.invalidateUserCache(data.ownerId)
    
    // Emit event for real-time updates
    EventEmitter.emit('project.created', { project })
    
    return project
  }
  
  static async update(id: string, data: Prisma.ProjectUpdateInput) {
    const project = await db.project.update({
      where: { id },
      data,
      include: {
        owner: true,
        members: { include: { user: true } }
      }
    })
    
    // Invalidate caches
    await this.invalidateProjectCache(id)
    await this.invalidateUserCache(project.ownerId)
    
    // Emit event
    EventEmitter.emit('project.updated', { project })
    
    return project
  }
  
  static async delete(id: string) {
    const project = await db.project.delete({
      where: { id }
    })
    
    // Invalidate caches
    await this.invalidateProjectCache(id)
    await this.invalidateUserCache(project.ownerId)
    
    // Emit event
    EventEmitter.emit('project.deleted', { projectId: id })
    
    return project
  }
  
  // Authorization helpers
  static canView(project: any, userId: string): boolean {
    return project.ownerId === userId || 
           project.members.some((m: any) => m.userId === userId)
  }
  
  static canEdit(project: any, userId: string): boolean {
    return project.ownerId === userId ||
           project.members.some((m: any) => 
             m.userId === userId && m.role === 'MAINTAINER'
           )
  }
  
  static canManageTeam(project: any, userId: string): boolean {
    return this.canEdit(project, userId)
  }
  
  // Cache invalidation
  private static async invalidateProjectCache(id: string) {
    await redis.del(`project:${id}`)
  }
  
  private static async invalidateUserCache(userId: string) {
    await redis.del(`user:${userId}:projects`)
  }
}
```

---

## 7. Database Architecture

### 7.1 PostgreSQL Schema (Prisma)

```prisma
// packages/db/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  ownedProjects Project[] @relation("ProjectOwner")
  memberships   ProjectMember[]
  assignedTasks TaskAssignee[]
  createdTasks  Task[]     @relation("TaskCreator")
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

// NextAuth Account model
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

// NextAuth Session model
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// Project model
model Project {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  
  // Owner relation
  ownerId     String
  owner       User     @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  
  // Relations
  members     ProjectMember[]
  tasks       Task[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([ownerId])
  @@index([title])
  @@index([createdAt])
}

// Project membership with roles
model ProjectMember {
  id        String      @id @default(cuid())
  role      ProjectRole @default(CONTRIBUTOR)
  
  // Relations
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  joinedAt  DateTime @default(now())
  
  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
}

enum ProjectRole {
  OWNER
  MAINTAINER
  CONTRIBUTOR
}

// Task model
model Task {
  id          String      @id @default(cuid())
  description String      @db.Text
  status      TaskStatus  @default(NOT_STARTED)
  submitted   Boolean     @default(false)
  
  // Relations
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  creatorId   String
  creator     User        @relation("TaskCreator", fields: [creatorId], references: [id])
  
  assignees   TaskAssignee[]
  attachments TaskAttachment[]
  approvals   TaskApproval[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  submittedAt DateTime?
  
  @@index([projectId])
  @@index([status])
  @@index([createdAt])
}

enum TaskStatus {
  NOT_STARTED
  IN_PROGRESS
  SUBMITTED
  COMPLETED
}

// Task assignees (many-to-many)
model TaskAssignee {
  id        String   @id @default(cuid())
  
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  assignedAt DateTime @default(now())
  
  @@unique([taskId, userId])
  @@index([taskId])
  @@index([userId])
}

// Task approvals by maintainers
model TaskApproval {
  id         String   @id @default(cuid())
  
  taskId     String
  task       Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  approverId String
  // Note: Not FK to User to preserve approval history if user deleted
  
  approvedAt DateTime @default(now())
  
  @@unique([taskId, approverId])
  @@index([taskId])
}

// Task file attachments
model TaskAttachment {
  id          String   @id @default(cuid())
  filename    String
  fileUrl     String
  fileSize    Int
  mimeType    String
  
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  uploadedById String
  uploadedAt   DateTime @default(now())
  
  @@index([taskId])
}
```

### 7.2 Database Optimization Strategies

#### Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_project_member_lookup ON "ProjectMember" ("userId", "projectId");
CREATE INDEX idx_task_project_status ON "Task" ("projectId", "status");
CREATE INDEX idx_task_assignee_lookup ON "TaskAssignee" ("userId", "taskId");

-- Partial indexes for filtered queries
CREATE INDEX idx_submitted_tasks ON "Task" ("projectId") WHERE "submitted" = true;
CREATE INDEX idx_active_projects ON "Project" ("ownerId", "updatedAt" DESC);
```

#### Query Optimization
- **Eager loading:** Use Prisma `include` for related data
- **Select specific fields:** Avoid `SELECT *` with Prisma `select`
- **Pagination:** Cursor-based pagination for large datasets
- **Connection pooling:** PgBouncer for connection management

---

## 8. Security Architecture

### 8.1 Authentication Flow (NextAuth v5)

```typescript
// apps/web/lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@team-up/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
})
```

### 8.2 Authorization (CASL)

```typescript
// packages/api/lib/abilities.ts
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { ProjectRole } from '@prisma/client'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'
export type Subjects = 'Project' | 'Task' | 'User' | 'all'

export type AppAbility = PureAbility<[Actions, Subjects]>

export function defineAbilitiesFor(user: User, project: Project) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility)
  
  // Find user's role in project
  const member = project.members.find(m => m.userId === user.id)
  
  if (!member) {
    // Non-member: no permissions
    cannot('read', 'Project')
    cannot('read', 'Task')
    return build()
  }
  
  switch (member.role) {
    case 'OWNER':
      can('manage', 'all') // Full access
      break
      
    case 'MAINTAINER':
      can('read', 'Project')
      can('update', 'Project')
      can('create', 'Task')
      can('read', 'Task')
      can('update', 'Task')
      can('delete', 'Task')
      can('create', 'User') // Add members
      cannot('delete', 'Project')
      cannot('update', 'User') // Cannot change owner
      break
      
    case 'CONTRIBUTOR':
      can('read', 'Project')
      can('read', 'Task')
      can('update', 'Task', { assignees: { some: { userId: user.id } } }) // Own tasks only
      cannot('create', 'Task')
      cannot('delete', 'Task')
      cannot('manage', 'User')
      break
  }
  
  return build()
}
```

### 8.3 Security Best Practices

```typescript
// Rate limiting (middleware)
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
})

export async function middleware(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response("Too Many Requests", { status: 429 })
  }
  
  return NextResponse.next()
}

// Input sanitization (Zod)
import { z } from 'zod'

export const sanitizeString = z.string()
  .trim()
  .min(1)
  .max(1000)
  .transform(str => str.replace(/<[^>]*>/g, '')) // Strip HTML

// CSRF protection (built into NextAuth v5)
// XSS protection (React escapes by default)
// SQL injection protection (Prisma parameterized queries)
```

---

## 9. Scalability & Performance

### 9.1 Caching Strategy

```mermaid
graph TB
    A[Client Request] --> B{Edge Cache?}
    B -->|HIT| C[Return from Edge]
    B -->|MISS| D{Redis Cache?}
    D -->|HIT| E[Return from Redis]
    D -->|MISS| F[Query Database]
    F --> G[Store in Redis]
    G --> E
    E --> H[Store in Edge]
    H --> C
```

#### Cache Layers

1. **Edge Cache (CDN):** 
   - Static assets (images, fonts, CSS, JS)
   - Public pages (landing, pricing)
   - TTL: 1 year for assets, 1 hour for pages

2. **Redis Cache:**
   - User sessions
   - API responses (projects, tasks)
   - Aggregated data (counts, stats)
   - TTL: 5-15 minutes

3. **Browser Cache:**
   - TanStack Query cache (5 minutes default)
   - LocalStorage (theme, preferences)

### 9.2 Performance Optimizations

#### React Server Components (RSC)
```typescript
// Server Component (no client-side JS)
// app/projects/page.tsx
import { db } from '@/lib/db'
import { ProjectCard } from '@/components/features/project/ProjectCard'

export default async function ProjectsPage() {
  // Fetch on server
  const projects = await db.project.findMany({
    include: { owner: true, _count: { select: { tasks: true } } }
  })
  
  return (
    <div className="grid gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  )
}

// Client Component (for interactivity)
// components/features/project/ProjectCard.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProjectCard({ id, title, description, taskCount }) {
  return (
    <Card>
      <h3>{title}</h3>
      <p>{description}</p>
      <Button onClick={() => console.log('Clicked', id)}>
        View Project ({taskCount} tasks)
      </Button>
    </Card>
  )
}
```

#### Code Splitting & Lazy Loading
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const MarkdownEditor = dynamic(
  () => import('@/components/features/MarkdownEditor'),
  { loading: () => <Skeleton className="h-96" /> }
)

// Route-based code splitting (automatic with App Router)
// Each page.tsx is a separate bundle
```

#### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Team collaboration"
  width={1200}
  height={600}
  priority={true} // Preload above-the-fold images
  placeholder="blur" // Low-quality placeholder
  blurDataURL="data:image/..." // Base64 blur
/>
```

---

## 10. Deployment Architecture

### 10.1 Deployment Diagram

```mermaid
graph TB
    subgraph "Client"
        A[Users]
    end
    
    subgraph "Cloudflare"
        B[DNS]
        C[CDN / Edge Cache]
    end
    
    subgraph "Vercel Edge Network"
        D[Edge Middleware]
        E[Edge Functions]
        F[Static Assets]
    end
    
    subgraph "Vercel Serverless"
        G[Next.js App]
        H[API Routes]
        I[tRPC Server]
    end
    
    subgraph "External Services"
        J[(Neon PostgreSQL)]
        K[(Upstash Redis)]
        L[Cloudflare R2]
        M[Resend Email]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> G
    G --> H
    H --> I
    I --> J
    I --> K
    I --> L
    I --> M
    F --> C
```

### 10.2 Environment Configuration

```env
# apps/web/.env.production
NODE_ENV=production

# Database
DATABASE_URL="postgresql://user:pass@db.neon.tech:5432/teamup?sslmode=require"
DIRECT_URL="postgresql://user:pass@db-direct.neon.tech:5432/teamup"

# NextAuth
AUTH_SECRET="<generated-secret>"
AUTH_URL="https://teamup.app"

# OAuth
GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"

# Redis
REDIS_URL="redis://upstash.redis.io:6379"
REDIS_TOKEN="<upstash-token>"

# Storage
R2_ACCOUNT_ID="<cloudflare-account>"
R2_ACCESS_KEY_ID="<r2-key>"
R2_SECRET_ACCESS_KEY="<r2-secret>"
R2_BUCKET="teamup-files"

# Email
RESEND_API_KEY="<resend-key>"

# Monitoring
SENTRY_DSN="<sentry-dsn>"
```

---

## 11. Monitoring & Observability

### 11.1 Logging & Error Tracking

```typescript
// lib/logger.ts
import * as Sentry from "@sentry/nextjs"
import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

export function logError(error: Error, context?: Record<string, any>) {
  logger.error({ err: error, ...context })
  Sentry.captureException(error, { extra: context })
}

export function logInfo(message: string, data?: Record<string, any>) {
  logger.info({ msg: message, ...data })
}
```

### 11.2 Monitoring Stack

- **Application Monitoring:** Sentry (errors, performance)
- **Analytics:** Vercel Analytics + PostHog
- **Uptime Monitoring:** UptimeRobot / Better Uptime
- **Log Aggregation:** Axiom / Logflare
- **Database Monitoring:** Neon built-in metrics
- **APM:** OpenTelemetry (optional)

---

## 12. Migration Strategy (V1 → V2)

### 12.1 Data Migration Plan

```typescript
// scripts/migrate-v1-to-v2.ts
import { MongoClient } from 'mongodb'
import { PrismaClient } from '@prisma/client'

const mongo = new MongoClient(process.env.MONGODB_URI!)
const prisma = new PrismaClient()

async function migrateUsers() {
  const users = await mongo.db().collection('users').find({}).toArray()
  
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.emailId },
      update: {},
      create: {
        email: user.emailId,
        name: user.name,
        image: user.profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })
  }
  
  console.log(`Migrated ${users.length} users`)
}

async function migrateProjects() {
  // Similar migration logic for projects
  // Map MongoDB documents to Prisma schema
}

async function migrateTasks() {
  // Similar migration logic for tasks
}

async function main() {
  await migrateUsers()
  await migrateProjects()
  await migrateTasks()
}

main()
  .catch(console.error)
  .finally(() => {
    mongo.close()
    prisma.$disconnect()
  })
```

### 12.2 Migration Phases

1. **Phase 1:** Set up V2 infrastructure in parallel
2. **Phase 2:** Migrate read-only data (users, projects, tasks)
3. **Phase 3:** Dual-write period (write to both V1 and V2)
4. **Phase 4:** Validate data consistency
5. **Phase 5:** Switch read traffic to V2
6. **Phase 6:** Deprecate V1 after 30 days

---

## Conclusion

Team-Up V2 architecture leverages the latest web technologies to deliver a scalable, maintainable, and performant collaboration platform. The use of TypeScript, tRPC, Prisma, and shadcn/ui ensures type safety and excellent developer experience, while Next.js 15, Vercel Edge, and PostgreSQL provide the foundation for high performance and reliability.

**Key Takeaways:**
- ✅ **Type-safe full-stack:** TypeScript + tRPC + Prisma
- ✅ **Modern UI:** shadcn/ui + Tailwind CSS v4
- ✅ **Scalable infrastructure:** Serverless + Edge computing
- ✅ **Developer experience:** Fast iteration, excellent tooling
- ✅ **Production-ready:** Monitoring, caching, security built-in

---

*End of Architecture Document*
