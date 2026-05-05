# Ai-Life-Assistant

This repository contains the frontend and backend for the AI Life Admin Assistant. Follow the instructions below to get the project running locally on your computer.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/dhruvmore12oo/Ai-Life-Assistant.git
cd Ai-Life-Assistant
```

### 2. Install Dependencies

The project is split into a frontend and a backend (`server` folder). You need to install dependencies for both.

**Frontend Dependencies:**
```bash
# From the root directory (Ai-Life-Assistant)
npm install
```

**Backend Dependencies:**
```bash
# Navigate to the server directory
cd server
npm install
# Go back to the root directory
cd ..
```

### 3. Environment Variables

The backend requires several environment variables to function properly (e.g., Supabase, OpenAI, Resend, etc.).

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Copy the example `.env` file to create your own `.env` file:
   ```bash
   # On Windows (Command Prompt / PowerShell)
   copy .env.example .env

   # On Mac / Linux
   cp .env.example .env
   ```
3. Open the newly created `server/.env` file in your code editor and fill in all the required credentials.

### 4. Running the Application Locally

You will need to run the frontend and backend servers simultaneously. Open two separate terminal windows.

**Terminal 1 (Backend Server):**
```bash
cd server
node server.js
```
*(The backend server will start, typically on port 5000 or the port specified in your `.env` file).*

**Terminal 2 (Frontend Server):**
```bash
# From the root directory
npm run dev
```
*(The React frontend will start, typically on http://localhost:5173).*

Now you can open your browser and navigate to the frontend URL to use the application locally!
