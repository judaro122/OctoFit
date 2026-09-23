import mongoose, { connectToDatabase } from '../config/database.js';
import { sampleData } from '../data/sampleData.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/resourceModels.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await connectToDatabase();

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    await User.insertMany(sampleData.users);
    await Team.insertMany(sampleData.teams);
    await Activity.insertMany(sampleData.activities);
    await LeaderboardEntry.insertMany(sampleData.leaderboard);
    await Workout.insertMany(sampleData.workouts);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

void seedDatabase();
