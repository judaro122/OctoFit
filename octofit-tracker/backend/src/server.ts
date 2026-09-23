import express from 'express';
import { pathToFileURL } from 'node:url';

import { getApiBaseUrl } from './config/api.js';
import { connectToDatabase } from './config/database.js';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
} from './models/resourceModels.js';

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());

const resourceModels = {
  users: User,
  teams: Team,
  activities: Activity,
  leaderboard: LeaderboardEntry,
  workouts: Workout,
} as const;

const inMemoryStore = {
  users: [
    { id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com', fitnessLevel: 'advanced' },
    { id: 'user-2', name: 'Grace Hopper', email: 'grace@example.com', fitnessLevel: 'intermediate' },
  ],
  teams: [
    { id: 'team-1', name: 'Blue Falcons', captain: 'Ada Lovelace', points: 1280 },
    { id: 'team-2', name: 'Green Runners', captain: 'Grace Hopper', points: 1150 },
  ],
  activities: [
    { id: 'activity-1', userId: 'user-1', type: 'Run', durationMinutes: 35, calories: 420 },
    { id: 'activity-2', userId: 'user-2', type: 'Strength', durationMinutes: 45, calories: 380 },
  ],
  leaderboard: [
    { id: 'leaderboard-1', userId: 'user-1', name: 'Ada Lovelace', points: 1280, rank: 1 },
    { id: 'leaderboard-2', userId: 'user-2', name: 'Grace Hopper', points: 1150, rank: 2 },
  ],
  workouts: [
    { id: 'workout-1', title: 'Cardio Blast', difficulty: 'intermediate', durationMinutes: 30 },
    { id: 'workout-2', title: 'Core & Mobility', difficulty: 'beginner', durationMinutes: 20 },
  ],
} as const;

const getResourceEndpoint = (resource: keyof typeof inMemoryStore) => `/api/${resource}/`;

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/config', (_request, response) => {
  response.json({
    apiBaseUrl: getApiBaseUrl(),
    port,
    codespaceName: process.env.CODESPACE_NAME ?? null,
  });
});

const attachResourceRoutes = (resource: keyof typeof inMemoryStore) => {
  const route = getResourceEndpoint(resource);

  app.get(route, async (_request, response) => {
    try {
      if (process.env.MONGODB_URI || process.env.NODE_ENV === 'production') {
        const items = await resourceModels[resource].find({}).lean();
        response.json(items);
        return;
      }

      response.json(inMemoryStore[resource]);
    } catch (error) {
      console.error(`Unable to fetch ${resource}:`, error);
      response.status(500).json({ message: `Unable to fetch ${resource}` });
    }
  });

  app.get(`${route}:id`, async (request, response) => {
    try {
      if (process.env.MONGODB_URI || process.env.NODE_ENV === 'production') {
        const item = await resourceModels[resource].findById(request.params.id).lean();

        if (!item) {
          response.status(404).json({ message: `${resource} not found` });
          return;
        }

        response.json(item);
        return;
      }

      const item = inMemoryStore[resource].find((entry) => String((entry as any).id) === request.params.id);
      if (!item) {
        response.status(404).json({ message: `${resource} not found` });
        return;
      }

      response.json(item);
    } catch (error) {
      console.error(`Unable to fetch single ${resource}:`, error);
      response.status(500).json({ message: `Unable to fetch ${resource}` });
    }
  });
};

(['users', 'teams', 'activities', 'leaderboard', 'workouts'] as const).forEach(attachResourceRoutes);

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('Connected to octofit_db');
  } catch (error) {
    console.warn('MongoDB unavailable, using in-memory API data.', error);
  }

  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
    console.log(`API base URL: ${getApiBaseUrl()}`);
  });
};

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  void startServer();
}

export { app, getApiBaseUrl, port };
