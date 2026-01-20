## Lity

Lity is a small blog platform project. The goal is simple: log in, write posts in Markdown, publish them, and let people read and comment. I built it as a practical “full stack” reference app using the tools I like working with.

![Lity screenshot](/public/lity-project.png)

### What you can do
- **Auth**: sign up / sign in (credentials)
- **Posts**: create, edit, delete, publish/draft
- **Tags**: add tags (shown as hashtags) + filter on the home feed
- **Search**: search posts by title
- **Profiles**: view and edit your own profile (bio/avatar/social link)
- **Comments**: add and delete your own comments
- **Theme**: light/dark mode toggle

### Tech stack
- **Next.js** (App Router) + **React** + **TypeScript**
- **Material UI (MUI)** + Emotion styling
- **NextAuth** (Credentials provider)
- **Prisma** + **SQLite**

## Getting Started

Install dependencies and run the dev server:

```bash
cd /Users/zeynep/Downloads/files/lity
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo login (local dev)

After running the demo seed script (`scripts/seed-demo-user.mjs`), you can sign in at `http://localhost:3000/signin` with:

- **Email**: `demo@lity.local`
- **Password**: `DemoPass123!`

> Note: This is **for local development only**. Don’t use these credentials in production.

To regenerate/change the demo user, run:

```bash
cd /Users/zeynep/Downloads/files/lity
node scripts/seed-demo-user.mjs
```

### Notes
- Posts use **Markdown**.
- Tags are stored without the `#` but displayed as `#tag`.


