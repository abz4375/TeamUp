import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">Team-Up V2</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Modern collaborative project management
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Built with Next.js 15, TypeScript, Prisma, and NextAuth v5
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>✅ Open Source • ✅ Self-Hosted • ✅ Privacy-First</p>
        </div>
      </div>
    </div>
  )
}
