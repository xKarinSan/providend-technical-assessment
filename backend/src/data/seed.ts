import { Client, ClientAssignment, Note, User } from './entities';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Tan' },
  { id: 'u2', name: 'Benjamin Lim' },
  { id: 'u3', name: 'Chloe Ng' },
];

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Aurora Holdings' },
  { id: 'c2', name: 'Bedok Family Office' },
  { id: 'c3', name: 'Changi Ventures' },
  { id: 'c4', name: 'Dover Capital' },
  { id: 'c5', name: 'Eunos Trust' },
  { id: 'c6', name: 'Farrer Wealth' },
];

/** Many-to-many: a user may be assigned to several clients and vice versa. */
export const CLIENT_ASSIGNMENTS: ClientAssignment[] = [
  { userId: 'u1', clientId: 'c1' },
  { userId: 'u1', clientId: 'c2' },
  { userId: 'u1', clientId: 'c3' },
  { userId: 'u2', clientId: 'c3' },
  { userId: 'u2', clientId: 'c4' },
  { userId: 'u3', clientId: 'c5' },
  { userId: 'u3', clientId: 'c6' },
];

const TOPICS = [
  'Quarterly portfolio review',
  'Retirement readiness check-in',
  'Insurance gap analysis',
  'Estate planning discussion',
  'Rebalancing recommendation',
  'Cash flow review',
  'Education funding plan',
  'Risk profile reassessment',
];

const buildContent = (index: number, clientName: string): string => {
  const topic = TOPICS[index % TOPICS.length];
  return [
    `## ${topic}`,
    '',
    `Met with **${clientName}** to walk through the ${topic.toLowerCase()}.`,
    '',
    '- Reviewed current allocation against the target glide path',
    '- Flagged one concentrated position for follow-up',
    '- Agreed to revisit in the next scheduled review',
    '',
    '> Client is comfortable with the current level of risk.',
  ].join('\n');
};

/**
 * Deterministic seed notes — enough rows that pagination is exercised.
 * Timestamps step backwards one day at a time from a fixed date so the data
 * is stable across restarts.
 */
const SEED_EPOCH = Date.parse('2026-08-01T09:00:00.000Z');

const buildNotes = (): Note[] => {
  const notes: Note[] = [];
  let counter = 0;

  for (const assignment of CLIENT_ASSIGNMENTS) {
    const client = CLIENTS.find((c) => c.id === assignment.clientId)!;
    // 16 notes per assignment keeps every user above one page of 30.
    for (let i = 0; i < 16; i += 1) {
      counter += 1;
      notes.push({
        id: `n${counter}`,
        clientId: assignment.clientId,
        authorId: assignment.userId,
        content: buildContent(counter, client.name),
        createdAt: new Date(
          SEED_EPOCH - counter * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
    }
  }

  return notes;
};

export const NOTES: Note[] = buildNotes();
