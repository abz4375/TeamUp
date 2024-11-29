# TeamUp - A Modern Collaborative Project Management Platform 🚀

TeamUp is a full-stack web application built with Next.js 13+ that transforms project management and team collaboration. With real-time updates, task approval workflows, and comprehensive project management features, TeamUp helps teams work more efficiently together.

## Core Features 

### 1. Enhanced User Authentication
- **Google OAuth Integration:** Secure authentication using Google credentials 🔐
- **Profile Management:** User profiles with customizable avatars and email verification
- **Role-Based Access:** Granular permission system for project access

### 2. Comprehensive Project Management
- **Project Creation:** Initialize projects with Markdown-rich descriptions 📝
- **Team Management:** 
  - Invite team members through email search
  - Assign roles (owner 👑, maintainer 🔧, contributor 👷)
  - Remove members with automatic task reassignment
- **Project Deletion:** Safely remove projects with cleanup of associated tasks and user references

### 3. Advanced Task Management
- **Task Creation:** 
  - Create detailed tasks with rich descriptions
  - Upload and attach files to tasks 📎
  - Assign multiple team members to tasks
- **Task Workflow:**
  - Submit completed tasks for review
  - Multi-stage approval process by project maintainers ✅
  - Progress tracking with visual indicators
- **Task Status:** Real-time progress bars showing approval status

### 4. User Experience
- **Dark/Light Mode:** Toggle between dark and light themes for comfortable viewing 🌓
- **Responsive Design:** Fully responsive interface across devices
- **Real-time Updates:** Instant reflection of project and task changes
- **Markdown Support:** Rich text formatting for project and task descriptions

### 5. File Management
- **File Attachments:** Upload and manage files associated with tasks
- **Secure Storage:** Safe file storage and access control

## Technical Stack

- **Frontend:** Next.js 13+, React, Material-UI
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js with Google Provider
- **Storage:** File upload capabilities with form handling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/abz4375/TeamUp.git
```

2. Install dependencies:
```bash
cd TeamUp
npm install
```

3. Configure environment variables:
```env
MONGODB_URI=your_mongodb_uri
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
team-up/
├── src/
│   ├── app/            # Next.js 13+ app directory
│   ├── components/     # Reusable React components
│   └── models/         # MongoDB schemas
├── public/            # Static assets
└── config/           # Configuration files
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with 💻 by the TeamUp team
