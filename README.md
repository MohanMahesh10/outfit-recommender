# Outfit Recommender App

An AI-powered outfit recommendation application built with Next.js, Google's Gemini AI for text recommendations, and NVIDIA's Consistory API for outfit image generation.

![Uploading Screenshot 2025-04-27 230439.jpg…]()


## Quick Start with Docker (3 Simple Steps)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/your-username/outfit-recommender.git
cd outfit-recommender
```

2. Create `.env.local` file from example and add your API keys:
```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

3. Build and start the application:
```bash
docker-compose up --build
```

That's it! Access the application at http://localhost:3000

## Development

If you want to run the application in development mode without Docker:

1. Install dependencies:
```bash
npm install
```

2. Create your `.env.local` file as described above

3. Start the development server:
```bash
npm run dev
```

## Environment Variables

The application requires two API keys:

1. **Google Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com/)
2. **NVIDIA Consistory API Key** - For image generation

Copy the `.env.example` file to `.env.local` and fill in your API keys:
```bash
cp .env.example .env.local
```

## GitHub Deployment

To upload this project to GitHub:

1. Create a repository on GitHub
2. Initialize git and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/outfit-recommender.git
git push -u origin main
```

## Features

- Personalized outfit recommendations based on occasion, weather, style preferences, and gender
- AI-generated outfit visualization
- Clean, responsive UI with dark mode support
- Simple, concise recommendations

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **AI**: 
  - Google Gemini AI (text recommendations)
  - NVIDIA Consistory API (image generation)
- **Deployment**: Docker containerization for easy setup

## License

This project is licensed under the MIT License.
