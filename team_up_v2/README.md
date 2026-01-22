# Team-Up V2 🚀

Modern, open-source collaborative project management platform built with cutting-edge technologies.

## Overview

Team-Up V2 is a complete rewrite of Team-Up, featuring:
- ✅ **100% Open Source Stack** - No vendor lock-in
- ✅ **85% Cost Reduction** - Self-hosted infrastructure (~$15-20/month)
- ✅ **Type-Safe Full-Stack** - End-to-end TypeScript with tRPC
- ✅ **Modern UI** - shadcn/ui components with Tailwind CSS v4
- ✅ **Scalable Architecture** - Monorepo with Turborepo
- ✅ **Real-Time Collaboration** - Socket.io for live updates
- ✅ **Production-Ready** - Self-hosted PostgreSQL, Redis, MinIO

## Tech Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS v4)
- **State Management:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod

### Backend
- **API:** tRPC v11 (type-safe APIs)
- **Database:** PostgreSQL 16 + Prisma ORM
- **Cache:** Redis 7 or Dragonfly
- **Storage:** MinIO (S3-compatible)
- **Auth:** NextAuth v5 with Google OAuth
- **Real-Time:** Socket.io

### Infrastructure (Self-Hosted)
- **Platform:** Coolify or Docker Compose
- **Web Server:** Caddy (auto HTTPS)
- **Monitoring:** GlitchTip, Umami, Grafana, Prometheus
- **Logs:** Grafana Loki
- **Uptime:** Uptime Kuma

## Documentation

- 📋 [Product Requirements Document](./docs/PRD.md)
- 🏗️ [Architecture Document](./docs/ARCHITECTURE.md)
- 🗺️ [Implementation Roadmap](./docs/ROADMAP.md)

## Project Structure

```
team-up-v2/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── api/              # tRPC API
│   ├── db/               # Prisma database
│   ├── validation/       # Zod schemas
│   ├── config/           # Shared configs
│   └── types/            # TypeScript types
├── docs/                 # Documentation
└── docker/               # Docker configurations
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose (for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/team-up-v2.git
cd team-up-v2

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start infrastructure (PostgreSQL, Redis, MinIO)
docker-compose up -d

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Deployment

See [ROADMAP.md](./docs/ROADMAP.md) for detailed deployment instructions using:
- **Option 1:** Coolify (recommended) - Self-hosted PaaS
- **Option 2:** Docker Compose - Manual deployment
- **Option 3:** Traditional VPS setup

## Cost Comparison

| Service | V1 (Paid) | V2 (Open Source) | Savings |
|---------|-----------|------------------|---------|
| Hosting | Vercel Pro $20 | VPS $15 | $5 |
| Database | Neon $25 | Self-hosted | $25 |
| Cache | Upstash $10 | Self-hosted | $10 |
| Storage | R2 $10 | Self-hosted | $10 |
| Monitoring | Sentry $26 | Self-hosted | $26 |
| **Total** | **$91/mo** | **$15/mo** | **$76/mo (83%)** |

## Features

### Core Features
- ✅ Google OAuth Authentication
- ✅ Project Management with Role-Based Access (Owner, Maintainer, Contributor)
- ✅ Advanced Task Management with Approval Workflows
- ✅ File Upload & Management (S3-compatible)
- ✅ Real-Time Updates via WebSockets
- ✅ Dark/Light Theme Support
- ✅ Markdown Support for Rich Text
- ✅ Responsive Design (Mobile/Tablet/Desktop)

### Under Development
- 🚧 Team Comments & Discussions
- 🚧 Advanced Notifications
- 🚧 Activity Feed & Audit Logs
- 🚧 Enhanced Search & Filtering

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- 📧 Email: support@teamup.example.com
- 💬 Discord: [Join our community](https://discord.gg/teamup)
- 📖 Docs: [docs.teamup.example.com](https://docs.teamup.example.com)

---

**Built with ❤️ using open source technologies**
