import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Note } from '../data/entities';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDetail, NoteSummary, PaginatedNotes } from './notes.types';

@Injectable()
export class NotesService {
  constructor(private readonly data: DataService) {}

  private toSummary(note: Note): NoteSummary {
    return {
      id: note.id,
      clientId: note.clientId,
      clientName: this.data.findClient(note.clientId)?.name ?? 'Unknown client',
      authorId: note.authorId,
      authorName: this.data.findUser(note.authorId)?.name ?? 'Unknown user',
      createdAt: note.createdAt,
    };
  }

  private toDetail(note: Note): NoteDetail {
    return { ...this.toSummary(note), content: note.content };
  }

  /**
   * Notes the user is authorised to see, paginated. An unknown user yields an
   * empty page rather than an error, per the spec ("not valid, return 0").
   */
  listForUser(
    userId: string,
    pageNo: number,
    pageSize: number,
  ): PaginatedNotes {
    const emptyPage: PaginatedNotes = {
      data: [],
      page_no: pageNo,
      page_size: pageSize,
      total_pages: 0,
      total_records: 0,
    };

    if (!this.data.findUser(userId)) {
      return emptyPage;
    }

    const notes = this.data.notesForUser(userId);
    const start = pageNo * pageSize;
    const page = notes.slice(start, start + pageSize);

    return {
      data: page.map((note) => this.toSummary(note)),
      page_no: pageNo,
      page_size: pageSize,
      total_pages: Math.ceil(notes.length / pageSize),
      total_records: notes.length,
    };
  }

  /**
   * Fetch a single note. Authorisation is handled upstream by
   * NoteAccessMiddleware, so reaching here means the caller may read it.
   */
  findOne(noteId: string): NoteDetail {
    const note = this.data.findNote(noteId);
    if (!note) {
      throw new NotFoundException(`Note ${noteId} not found`);
    }
    return this.toDetail(note);
  }

  create(dto: CreateNoteDto): NoteDetail {
    if (!this.data.findUser(dto.authorId)) {
      throw new NotFoundException(`User ${dto.authorId} not found`);
    }
    if (!this.data.findClient(dto.clientId)) {
      throw new NotFoundException(`Client ${dto.clientId} not found`);
    }
    // Follows from the assumption that a user only ever works on clients they
    // are assigned to.
    if (!this.data.isAssignedToClient(dto.authorId, dto.clientId)) {
      throw new ForbiddenException(
        `User ${dto.authorId} is not assigned to client ${dto.clientId}`,
      );
    }

    const note = this.data.createNote({
      authorId: dto.authorId,
      clientId: dto.clientId,
      content: dto.content ?? '',
    });

    return this.toDetail(note);
  }
}
