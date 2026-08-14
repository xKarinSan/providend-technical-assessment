import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
});

/** Stands in for the JWT bearer token a production build would send. */
export const USER_ID_HEADER = 'x-user-id';

export interface User {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
}

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

export const listUsers = () => api.get<User[]>('/users').then((r) => r.data);

export const listClients = (userId: string) =>
  api.get<Client[]>(`/clients/u/${userId}`).then((r) => r.data);

export const listNotes = (userId: string, pageNo: number, pageSize: number) =>
  api
    .get<PaginatedNotes>(`/notes/u/${userId}`, {
      params: { page_no: pageNo, page_size: pageSize },
    })
    .then((r) => r.data);

export const getNote = (noteId: string, userId: string) =>
  api
    .get<NoteDetail>(`/notes/${noteId}`, {
      headers: { [USER_ID_HEADER]: userId },
    })
    .then((r) => r.data);

export const createNote = (input: {
  authorId: string;
  clientId: string;
  content: string;
}) => api.post<NoteDetail>('/notes', input).then((r) => r.data);
