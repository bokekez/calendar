The **Calendar App** is a simple monorepo application built with concurrency and Docker.

- **Frontend:** React, Vite, TypeScript  
- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL, using Sequelize as the ORM  

### Prerequisites

Before running the app, make sure you have:

- Node.js v20 or higher  
- npm v8 or higher  
- Docker
  
### Setup & Running

**Clone the repository locally:**

```bash
git clone git@github.com:bokekez/calendar.git
```

**Open the app in the termial:**

```bash
cd calendar
```

Add your .env file to the backend folder. The folder structure should look like this:

calendar/

├─ backend/

│  ├─ Dockerfile

│  ├─ package.json

│  └─ .env

Start the application using Docker Compose:

```bash
docker-compose up --build
```

This command will install all dependencies and start both the backend and frontend services.

Visit the frontend: Open your browser and go to http://localhost:5173/
