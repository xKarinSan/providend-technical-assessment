export interface User {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface ClientAssignment {
  clientId: string;
  userId: string;
}

export interface Note {
  id: string;
  clientId: string;
  authorId: string;
  /** Markdown. In production the content would not be assumed to be markdown. */
  content: string;
  createdAt: string;
}
