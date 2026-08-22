# Creator Business OS & Talent Marketplace

> **One-Line Vision:** Build the professional infrastructure where creators find, hire, build, and manage the teams behind their content businesses.

---

## Architecture Overview

This project is a fully dockerized multi-container application featuring:

1. **Backend (`server/`)**: FastAPI (Python 3.11) with SQLAlchemy, Pydantic v2, and PostgreSQL. Features automated data seeding on startup for the initial wedge roles.
2. **Frontend (`client/`)**: React Native with Expo Web / React Native Web providing a responsive cross-platform web interface.
3. **Database (`db`)**: PostgreSQL 16 container with health check and persistent volumes.

---

## Initial Wedge Focus

To build liquidity and trust, the platform launches narrowly with three high-frequency roles:
- 🎬 **Video Editors**: YouTube retention editing, Reels, Shorts & Motion Graphics.
- 📱 **Social Media Managers**: Content strategy, channel growth, posting schedules & analytics.
- 👑 **Creator Managers**: Brand sponsorship negotiations, team coordination, logistics & ops.

---

## Quickstart with Docker

To build and launch all containers with a single command:

```bash
docker compose up --build
```

Once running:
- **Frontend App**: [http://localhost:8081](http://localhost:8081)
- **FastAPI OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) ##change the port in case the port is occupied using docker-compose.yml file
- **API Base URL**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

---

## Project Structure

```
build_creator_team/
├── docker-compose.yml       # Docker Compose service orchestration
├── .env                     # Shared environment configuration
├── server/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # FastAPI application entry point
│       ├── seed.py          # Automatic DB seeder (Creators, Talents, Jobs, Apps)
│       ├── core/            # Database & settings config
│       ├── models/          # User, Profile, Job, Application models
│       ├── schemas/         # Pydantic request/response schemas
│       └── api/             # API endpoints (/auth, /profiles, /jobs, /applications)
└── client/
    ├── Dockerfile
    ├── package.json
    ├── App.js               # React Native App entry point
    └── src/
        ├── components/      # Header, JobCard, TalentCard, StatCard, RoleFilter
        ├── screens/         # HomeScreen, JobsScreen, TalentScreen, PostJobScreen, DashboardScreen
        ├── services/        # API client layer
        └── theme/           # Dark mode styling tokens
```

---

## Key Features

- **Explore Creator Jobs**: Search and filter job listings by category (Video Editor, SMM, Creator Manager) and engagement type (Retainer, Project, Full-time).
- **Find Verified Talent**: Discover talent profiles with creator-specific experience, portfolio links, rating metrics, and rate ranges.
- **Post a Job**: Interactive form for content creators to post new role requirements.
- **Operations Dashboard**: Candidate evaluation, cover note review, and shortlisting/hiring pipeline.
