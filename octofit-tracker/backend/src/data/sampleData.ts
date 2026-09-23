export const sampleData = {
  users: [
    {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      fitnessLevel: 'advanced',
      teamId: 'team-1',
    },
    {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      fitnessLevel: 'intermediate',
      teamId: 'team-2',
    },
  ],
  teams: [
    {
      name: 'Blue Falcons',
      captain: 'Ada Lovelace',
      points: 1280,
    },
    {
      name: 'Green Runners',
      captain: 'Grace Hopper',
      points: 1150,
    },
  ],
  activities: [
    {
      userId: 'user-1',
      type: 'Run',
      durationMinutes: 35,
      calories: 420,
      date: new Date('2026-09-23T08:00:00.000Z'),
    },
    {
      userId: 'user-2',
      type: 'Strength',
      durationMinutes: 45,
      calories: 380,
      date: new Date('2026-09-23T09:15:00.000Z'),
    },
  ],
  leaderboard: [
    {
      userId: 'user-1',
      name: 'Ada Lovelace',
      points: 1280,
      rank: 1,
    },
    {
      userId: 'user-2',
      name: 'Grace Hopper',
      points: 1150,
      rank: 2,
    },
  ],
  workouts: [
    {
      title: 'Cardio Blast',
      difficulty: 'intermediate',
      durationMinutes: 30,
      description: 'Short intervals with moderate pacing.',
    },
    {
      title: 'Core & Mobility',
      difficulty: 'beginner',
      durationMinutes: 20,
      description: 'A gentle strength session for recovery days.',
    },
  ],
};
