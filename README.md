# GearForge

GearForge is an innovative full-stack application designed to leverage AI for generating 3D models and video content using Blender. It allows users to prompt an AI model to generate Blender code, assemble components, and render videos seamlessly in the cloud.

## Features

- **AI-Powered 3D Generation:** Uses Anthropic's Claude via OpenRouter to convert user prompts into executable Blender code.
- **Automated Rendering Pipeline:** Automatically runs the generated code in a Blender environment to produce 3D assets and video renders.
- **Progress Verification:** Utilizes Gemini's vision models to verify the progress and accuracy of assembly steps from image snapshots.
- **Subscription & Payment System:** Integrates Razorpay for seamless payment processing. Users are allowed 1 free generation prompt before a subscription is required.
- **Monorepo Architecture:** Structured as a Turborepo to efficiently manage the Next.js frontend, Express backend, and Prisma database packages.

## Tech Stack

### Frontend (`apps/web`)
- **Next.js:** React framework for building a fast, SEO-friendly user interface.
- **Tailwind CSS:** For highly responsive and modern styling.

### Backend (`apps/backend`)
- **Express.js:** Robust Node.js web server.
- **OpenRouter SDK:** Interacting with cutting-edge LLMs (Claude 3.5 Sonnet, Gemini 1.5 Flash).
- **Razorpay API:** Handling secure payment processing and subscription gating.
- **Multer:** Handling file and image uploads for progress verification.

### Database (`packages/db`)
- **Prisma ORM:** Type-safe database interactions.
- **PostgreSQL:** Reliable relational database for storing users, projects, generations, and billing records.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (Package manager)
- PostgreSQL database
- API Keys: OpenRouter, Razorpay, etc.
- Blender (installed or available on the server environment)

## Getting Started

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup Environment Variables:**
   Create a `.env` file in `apps/backend` and `apps/web` with the necessary keys (Database URL, OpenRouter API Key, Razorpay Keys, etc.).

3. **Database Migration:**
   ```bash
   cd packages/db
   pnpm run db:migrate
   pnpm run db:generate
   ```

4. **Run the Development Server:**
   ```bash
   pnpm dev
   ```

## License
MIT
