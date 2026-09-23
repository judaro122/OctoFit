import express from 'express';
import mongoose from 'mongoose';
import { pathToFileURL } from 'node:url';

import { connectToDatabase } from './config/database.js';
import { getApiBaseUrl } from './config/api.js';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
} from './models/resourceModels.js';

type ResourceName = 'users' | 'teams' | 'activities' | 'leaderboard' | 'workouts';

type ResourceRecord = Record<string, unknown>;

type ResourceStore = Record<ResourceName, ResourceRecord[]>;

const app = express();
const port = Number(process.env.PORT) || 8000;

const resourceStore: ResourceStore = {
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
};

const modelMap = {
  users: User,
  teams: Team,
  activities: Activity,
  leaderboard: LeaderboardEntry,
  workouts: Workout,
} as const;

const createResourceItem = (resource: ResourceName, payload: ResourceRecord): ResourceRecord => ({
  id: `${resource}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  ...payload,
});

app.use(express.json());

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

const attachResourceRoutes = (resource: ResourceName) => {
  const route = `/api/${resource}`;

  app.get(route, async (_request, response) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const items = await modelMap[resource].find({}).lean();
        response.json(items);
        return;
      }

      response.json(resourceStore[resource]);
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      response.status(500).json({ message: `Unable to fetch ${resource}` });
    }
  });

  app.get(`${route}/`, async (_request, response) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const items = await modelMap[resource].find({}).lean();
        response.json(items);
        return;
      }

      response.json(resourceStore[resource]);
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      response.status(500).json({ message: `Unable to fetch ${resource}` });
    }
  });

  app.post(route, async (request, response) => {
    try {
      const payload = request.body ?? {};

      if (mongoose.connection.readyState === 1) {
        const item = await modelMap[resource].create(payload);
        response.status(201).json(item.toObject());
        return;
      }

      const item = createResourceItem(resource, payload);
      resourceStore[resource].push(item);
      response.status(201).json(item);
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      response.status(500).json({ message: `Unable to create ${resource}` });
    }
  });

  app.post(`${route}/`, async (request, response) => {
    try {
      const payload = request.body ?? {};

      if (mongoose.connection.readyState === 1) {
        const item = await modelMap[resource].create(payload);
        response.status(201).json(item.toObject());
        return;
      }

      const item = createResourceItem(resource, payload);
      resourceStore[resource].push(item);
      response.status(201).json(item);
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      response.status(500).json({ message: `Unable to create ${resource}` });
    }
  });

  app.get(`${route}/:id`, async (request, response) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const item = await modelMap[resource].findById(request.params.id).lean();

        if (!item) {
          response.status(404).json({ message: `${resource} not found` });
          return;
        }

        response.json(item);
        return;
      }

      const resourceItem = resourceStore[resource].find((item) => String(item.id) === request.params.id);

      if (!resourceItem) {
        response.status(404).json({ message: `${resource} not found` });
        return;
      }

      response.json(resourceItem);
    } catch (error) {
      console.error(`Error fetching ${resource} item:`, error);
      response.status(500).json({ message: `Unable to fetch ${resource}` });
    }
  });

  app.put(`${route}/:id`, async (request, response) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const item = await modelMap[resource].findByIdAndUpdate(request.params.id, request.body, {
          new: true,
          runValidators: true,
        }).lean();

        if (!item) {
          response.status(404).json({ message: `${resource} not found` });
          return;
        }

        response.json(item);
        return;
      }

      const resourceItemIndex = resourceStore[resource].findIndex(
        (item) => String(item.id) === request.params.id,
      );

      if (resourceItemIndex === -1) {
        response.status(404).json({ message: `${resource} not found` });
        return;
      }

      const updatedItem = { ...resourceStore[resource][resourceItemIndex], ...request.body };
      resourceStore[resource][resourceItemIndex] = updatedItem;
      response.json(updatedItem);
    } catch (error) {
      console.error(`Error updating ${resource}:`, error);
      response.status(500).json({ message: `Unable to update ${resource}` });
    }
  });

  app.delete(`${route}/:id`, async (request, response) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const deletedItem = await modelMap[resource].findByIdAndDelete(request.params.id).lean();

        if (!deletedItem) {
          response.status(404).json({ message: `${resource} not found` });
          return;
        }

        response.status(204).send();
        return;
      }

      const originalLength = resourceStore[resource].length;
      resourceStore[resource] = resourceStore[resource].filter(
        (item) => String(item.id) !== request.params.id,
      );

      if (resourceStore[resource].length === originalLength) {
        response.status(404).json({ message: `${resource} not found` });
        return;
      }

      response.status(204).send();
    } catch (error) {
      console.error(`Error deleting ${resource}:`, error);
      response.status(500).json({ message: `Unable to delete ${resource}` });
    }
  });
};

(['users', 'teams', 'activities', 'leaderboard', 'workouts'] as const).forEach(attachResourceRoutes);

const startServer = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.warn('MongoDB connection is unavailable; continuing with in-memory seed data.', error);
  }

  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
  });
};

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  void startServer();
}

export { app, port, getApiBaseUrl };