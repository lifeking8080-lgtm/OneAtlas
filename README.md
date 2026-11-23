🌐 OneAtlas — AI Model Intelligence Platform

Discover. Compare. Research. Understand AI.

OneAtlas is an AI Model Intelligence Platform designed to bring the growing Artificial Intelligence ecosystem into one centralized place.

It helps users discover AI models, explore providers, understand pricing, compare model capabilities and access benchmark information through a structured and user-friendly interface.

The platform also aims to simplify AI research through an administrative research assistant that can investigate newly released AI models and organize relevant information for review and management.

Live Website: https://oneatlas-hnho.onrender.com/

---

📌 Table of Contents

- "Overview" (#-overview)
- "Key Features" (#-key-features)
- "AI Research Assistant" (#-ai-research-assistant)
- "Platform Modules" (#-platform-modules)
- "Technology Stack" (#-technology-stack)
- "Project Architecture" (#-project-architecture)
- "Getting Started" (#-getting-started)
- "Environment Configuration" (#-environment-configuration)
- "Database Setup" (#-database-setup)
- "API Documentation" (#-api-documentation)
- "Deployment" (#-deployment)
- "Security" (#-security)
- "Future Improvements" (#-future-improvements)
- "Project Links" (#-project-links)
- "Project Team" (#-project-team)

---

🚀 Overview

The AI industry is evolving rapidly, with new models, providers and technologies being introduced frequently.

Finding reliable information about these models can be challenging because their specifications, pricing, capabilities and benchmarks are distributed across different platforms.

OneAtlas addresses this challenge by providing a centralized AI intelligence platform.

The platform is designed to help users:

- Discover different AI models.
- Explore AI companies and providers.
- Compare model capabilities.
- Review available pricing information.
- Explore benchmark and ranking information.
- Research newly introduced AI models.
- Manage platform information through administrative functionality.

Our vision is to make AI information more accessible, organized and understandable.

---

✨ Key Features

1. AI Model Discovery

- Centralized AI model catalogue.
- Search and explore available models.
- View model specifications and capabilities.
- Explore model categories and supported modalities.

2. AI Provider Directory

- Explore AI companies and providers.
- Associate models with their respective providers.
- Organize information about the AI ecosystem.

3. Model Pricing

- Explore available AI model pricing information.
- Compare pricing information where available.
- Distinguish demonstration data from verified information.

4. Model Comparison

- Compare multiple AI models.
- Review available technical specifications.
- Understand differences between model capabilities.

5. Benchmarks and Rankings

- Organize benchmark information.
- Support sourced benchmark results.
- Provide a foundation for model evaluation and rankings.

Rankings depend on benchmark records being available in the database.

6. Administrative Dashboard

The administrative area is designed for authorized management of platform information.

Depending on the implemented modules, administrative capabilities include:

- AI model management.
- Provider management.
- Pricing information management.
- Benchmark management.
- Admin user management.
- Permissions management.

---

🤖 AI Research Assistant

OneAtlas is designed to include an Advanced AI Research Assistant to simplify the process of researching newly released AI models.

The intended workflow is:

1. An administrator enters a new AI model name.
2. The assistant researches available information.
3. Relevant model information is organized.
4. Provider and pricing information is extracted where available.
5. Benchmark information and supporting sources are presented.
6. The administrator reviews the research results.
7. Approved information can be added to the platform.

Research Categories

Category| Information
AI Models| Model name, description and capabilities
Providers| Developer, company and provider information
Pricing| Available input and output pricing
Benchmarks| Available benchmark results and sources

Important: Research results should be verified against their original sources before being saved. The availability of automated web search, Groq integration and approval workflows depends on the deployed implementation.

---

🧩 Platform Modules

Module| Purpose
AI Models| Discover and explore AI models
Providers| Explore AI providers and companies
Pricing| Review model pricing
Benchmarks| Organize model performance information
Rankings| Present available benchmark-based rankings
Admin Users| Manage authorized administrators
Permissions| Control administrative access
AI Research Assistant| Support AI model research

---

🛠 Technology Stack

Technology| Purpose
Next.js 14| Full-stack web framework
React| Frontend interface
TypeScript| Type-safe development
Tailwind CSS| UI styling
Prisma ORM| Database management
Supabase PostgreSQL| Database hosting
Zod| Data validation
Node.js| JavaScript runtime
GitHub| Version control
Render| Application deployment

AI and research integrations: Groq and external search services are intended integrations; verify the current repository configuration before assuming they are enabled.

---

🏗 Project Architecture

OneAtlas follows a full-stack web application architecture.

                 ONEATLAS PLATFORM
                         |
          +--------------+--------------+
          |                             |
      FRONTEND                       BACKEND
          |                             |
       Next.js                     API Routes
       React                       TypeScript
       Tailwind CSS                Zod Validation
          |                             |
          +--------------+--------------+
                         |
                    DATABASE
                         |
                   Prisma ORM
                         |
                Supabase PostgreSQL
                         |
          +--------------+--------------+
          |                             |
      AI SERVICES                  RESEARCH SERVICES
          |                             |
       Groq API                 External Search API

The AI and research service connections shown above represent the intended integration architecture and should be confirmed against the deployed code.

---

💻 Getting Started

Follow these steps to run OneAtlas locally.

Prerequisites

- Node.js 20 LTS or newer.
- npm.
- Git.
- Supabase account.
- PostgreSQL database.

Step 1: Clone the repository

git clone https://github.com/lifeking8080-lgtm/OneAtlas.git

Step 2: Open the project

cd OneAtlas

Step 3: Install dependencies

npm ci

Step 4: Configure environment variables

Create a ".env" file using the example configuration:

cp .env.example .env

Step 5: Generate Prisma Client

npx prisma generate

Step 6: Synchronize the database

npm run db:push

Step 7: Seed demonstration data

npm run db:seed

Step 8: Start the development server

npm run dev

Open:

http://localhost:3000

---

🔐 Environment Configuration

Create a ".env" file in the project root.

The original database configuration requires:

DATABASE_URL=
DIRECT_URL=

Additional variables may be required by the current deployment, depending on the enabled integrations.

Examples of integration-specific configuration names:

GROQ_API_KEY=
GROQ_MODEL=
LANGSEARCH_API_KEY=
SUPER_ADMIN_USER_ID=

Only add variables that are actually referenced by the application.

Important Security Rules

- Never publish real API keys.
- Never commit ".env".
- Keep secret credentials on the server.
- Use environment variables in Render.
- Do not expose privileged database credentials in frontend code.

---

🗄 Database Setup

OneAtlas uses Prisma ORM with Supabase PostgreSQL in the documented project architecture.

Main Database Operations

npm run db:push

Synchronizes the Prisma schema with the database.

npm run db:seed

Loads the configured seed data.

npx prisma generate

Generates Prisma Client.

Data Accuracy Notice

The original seed dataset contains demonstration data.

Model names, pricing, release dates and context windows from that dataset must not automatically be considered verified real-world information.

The "isSample" field is used to distinguish sample records.

No benchmark scores are seeded in the original dataset. Rankings require sourced benchmark records.

---

🔌 API Documentation

The documented API endpoints include:

Endpoint| Description
"GET /api/models"| Retrieve AI models
"GET /api/models/:slug"| Retrieve individual model details
"GET /api/search?q="| Search models
"GET /api/providers"| Retrieve providers
"GET /api/companies"| Retrieve companies
"GET /api/benchmarks"| Retrieve benchmarks
"GET /api/rankings"| Retrieve rankings
"GET /api/compare"| Compare AI models

Supported Model Filters

- Search query
- Company
- Provider
- Capability
- Category
- Sorting
- Pagination

API inputs are validated using Zod.

Documented error responses include:

- "400" — Invalid request.
- "404" — Resource not found.
- "500" — Internal server error.

---

☁️ Deployment

GitHub Repository

OneAtlas source code is maintained on GitHub.

git add .
git commit -m "Update OneAtlas"
git push origin main

Render Deployment

OneAtlas is deployed at:

https://oneatlas-hnho.onrender.com/

Deployment configuration should include:

1. GitHub repository connection.
2. Production environment variables.
3. Database connection configuration.
4. Production build.
5. Deployment and application health verification.

The production application should be tested after every deployment.

---

🔒 Security

Security is an important part of the OneAtlas architecture.

Recommended practices:

- Environment-based secret management.
- Secure administrator authentication.
- Role-based authorization.
- Server-side API key handling.
- Input validation.
- Database access restrictions.
- HTTPS deployment.
- Secure database connection management.

Never store passwords, private tokens or API keys in public source files.

---

🔮 Future Improvements

OneAtlas can continue evolving through:

- Automated AI model discovery.
- Advanced AI research capabilities.
- More provider integrations.
- Regularly verified pricing information.
- Expanded benchmark datasets.
- Advanced model analytics.
- Improved comparison features.
- More detailed research reports.
- Enhanced administrative permissions.
- Better mobile responsiveness.

---

🌍 Project Links

Resource| Link
🌐 Live Website| "Open OneAtlas" (https://oneatlas-hnho.onrender.com/)
💻 GitHub Repository| "View Source Code" (https://github.com/lifeking8080-lgtm/OneAtlas)
🎥 Project Videos & Reports| "Open Google Drive Folder" (https://drive.google.com/drive/folders/1-2GIVN8G77tSuub0YCga9iPISpjToBQY)

---

👥 Project Team

TEAM ARJUNAA

- Shivraj Shivaji Patil
- Sanika Madhukar Jadhav
- Anushka Jitendra Dhale
- Vaishnavi Vitthal Shivankar

---

🎯 Our Vision

OneAtlas aims to make the AI ecosystem easier to discover, understand and compare.

By bringing AI models, providers, pricing, benchmarks and research workflows into one platform, we aim to create a useful information hub for the next generation of AI users.

ONEATLAS — ONE PLATFORM. A WORLD OF AI INTELLIGENCE.

---

<p align="center">
  <b>Built with ❤️ by Team ARJUNAA</b>
  <br/>
  <i>Exploring the Future of Artificial Intelligence.</i>
</p>