import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { ListNotesQueryDto } from './dto/list-notes-query.dto';
import { NotesService } from './notes.service';
import type { NoteDetail, PaginatedNotes } from './notes.types';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /** List the notes a user is authorised to see. */
  @Get('u/:userId')
  listForUser(
    @Param('userId') userId: string,
    @Query() query: ListNotesQueryDto,
  ): PaginatedNotes {
    return this.notesService.listForUser(
      userId,
      query.page_no,
      query.page_size,
    );
  }

  /** Read one note. Access is checked by NoteAccessMiddleware. */
  @Get(':id')
  findOne(@Param('id') id: string): NoteDetail {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNoteDto): NoteDetail {
    return this.notesService.create(dto);
  }
}
