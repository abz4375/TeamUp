# TeamUp

A team collaboration platform built with Next.js, with task approval workflows and role-based project access.

## Why

Most lightweight project trackers treat every member the same and let tasks be marked "done" unilaterally. TeamUp adds a review step: a contributor submits a task, and a project maintainer has to approve it before it counts as complete, with role-based permissions (owner / maintainer / contributor) controlling who can do what.

## Features

- Google OAuth authentication with role-based access control per project
- Project creation with Markdown-rich descriptions
- Team management — invite by email, assign roles, remove members with automatic task reassignment
- Task creation with file attachments and multi-member assignment
- Multi-stage task approval workflow with progress tracking
- Dark/light theme, responsive layout

## Tech Stack

Next.js 13+, React, Material-UI, MongoDB, Mongoose, NextAuth.js

## Local Setup

The app lives in `teamup_next_js/team-up`.

```bash
git clone https://github.com/abz4375/TeamUp.git
cd TeamUp/teamup_next_js/team-up
npm install
```

Set environment variables:

```env
MONGODB_URI=your_mongodb_uri
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

```bash
npm run dev
```

## Future Improvements

- Real-time updates via WebSockets instead of polling/refetch
- Notification system for task approvals and assignments
