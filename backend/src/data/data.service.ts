import { Injectable } from '@nestjs/common';
import { Client, ClientAssignment, Note, User } from './entities';
import { CLIENTS, CLIENT_ASSIGNMENTS, NOTES, USERS } from './seed';

/**
 * In-memory store standing in for a database. Everything is hardcoded, as per
 * the spec; swapping this for a real repository is the only change needed.
 */
@Injectable()
export class DataService {
  private readonly users: User[] = [...USERS];
  private readonly clients: Client[] = [...CLIENTS];
  private readonly assignments: ClientAssignment[] = [...CLIENT_ASSIGNMENTS];
  private readonly notes: Note[] = [...NOTES];

  private nextNoteId = this.notes.length + 1;

  findUser(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  listUsers(): User[] {
    return [...this.users];
  }

  findClient(clientId: string): Client | undefined {
    return this.clients.find((client) => client.id === clientId);
  }

  listClients(): Client[] {
    return [...this.clients];
  }

  /** Client ids the user is assigned to. */
  assignedClientIds(userId: string): string[] {
    return this.assignments
      .filter((assignment) => assignment.userId === userId)
      .map((assignment) => assignment.clientId);
  }

  isAssignedToClient(userId: string, clientId: string): boolean {
    return this.assignments.some(
      (assignment) =>
        assignment.userId === userId && assignment.clientId === clientId,
    );
  }

  findNote(noteId: string): Note | undefined {
    return this.notes.find((note) => note.id === noteId);
  }

  /** Notes for every client the user is assigned to, newest first. */
  notesForUser(userId: string): Note[] {
    const clientIds = new Set(this.assignedClientIds(userId));
    return this.notes
      .filter((note) => clientIds.has(note.clientId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  createNote(input: {
    clientId: string;
    authorId: string;
    content: string;
  }): Note {
    const note: Note = {
      id: `n${this.nextNoteId++}`,
      clientId: input.clientId,
      authorId: input.authorId,
      content: input.content,
      createdAt: new Date().toISOString(),
    };
    this.notes.push(note);
    return note;
  }
}
