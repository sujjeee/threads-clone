# [Threads clone](https://threads.codebustar.com)

This is an open source **threads-clone** build with ***`create-t3-app`*** and  everything new in Next.js 13 and 14.

| ![Image1](./public/screenshots/feed-page.png) | ![Image4](./public/screenshots/search-page.png)|
|:--:|:--:|
| ![Image3](./public/screenshots/reply-card.png) | ![Image4](./public/screenshots/notification-page.png)|  
| ![Image5](./public/screenshots/post-info-page.png) | ![Image6](./public/screenshots/profile-page.png)|


## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **User Management:** [Clerk](https://clerk.com)
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **File Uploads:** [uploadthing](https://uploadthing.com)
- **Typesafe APIs:** [tRPC](https://trpc.io)

## Key Features

- Authentication with **Clerk**
- File uploads with **uploadthing**
- Advance **Prisma ORM** concepts
- Database on **Neon**
- Validation with **Zod**

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/sujjeee/threads-clone.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

4. Start the development server

   ```bash
   pnpm run dev
   ```

5. Push the database schema

   ```bash
   pnpm run db:push
   ```
