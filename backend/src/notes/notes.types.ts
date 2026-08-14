import { Note } from '../data/entities';

/** A note enriched with the names needed by the notes table. */
export interface NoteSummary {
  id: string;
  clientId: string;
  clientName: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface NoteDetail extends NoteSummary {
  content: string;
}

export interface PaginatedNotes {
  data: NoteSummary[];
  page_no: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

export type NoteEntity = Note;
