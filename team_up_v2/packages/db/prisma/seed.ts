import { PrismaClient, ProjectRole, TaskStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create demo user
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@teamup.example.com' },
        update: {},
        create: {
            email: 'demo@teamup.example.com',
            name: 'Demo User',
            emailVerified: new Date(),
        },
    })

    console.log('✅ Created demo user:', demoUser.email)

    // Create demo project
    const demoProject = await prisma.project.upsert({
        where: { id: 'demo-project-1' },
        update: {},
        create: {
            id: 'demo-project-1',
            title: 'Team-Up V2 Development',
            description: '# Welcome to Team-Up V2!\n\nThis is a demo project to showcase the platform capabilities.',
            ownerId: demoUser.id,
            members: {
                create: {
                    userId: demoUser.id,
                    role: ProjectRole.OWNER,
                },
            },
        },
    })

    console.log('✅ Created demo project:', demoProject.title)

    // Create demo tasks
    const demoTask = await prisma.task.create({
        data: {
            description: '## Setup Development Environment\n\nInstall all dependencies and configure the development environment.',
            status: TaskStatus.COMPLETED,
            projectId: demoProject.id,
            creatorId: demoUser.id,
            assignees: {
                create: {
                    userId: demoUser.id,
                },
            },
        },
    })

    console.log('✅ Created demo task:', demoTask.id)

    console.log('🎉 Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
