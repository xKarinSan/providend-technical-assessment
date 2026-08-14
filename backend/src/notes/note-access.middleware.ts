import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DataService } from '../data/data.service';

/** Header standing in for the JWT bearer token that would carry the subject. */
export const USER_ID_HEADER = 'x-user-id';

/**
 * Guards `[GET] /notes/:id`. Authentication is out of scope, so the caller's
 * identity arrives in a header instead of a verified JWT — a missing or
 * unknown user is therefore an authentication failure (401), while a known
 * user reaching for a client they are not assigned to is a 403.
 */
@Injectable()
export class NoteAccessMiddleware implements NestMiddleware {
  constructor(private readonly data: DataService) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    const userId = req.header(USER_ID_HEADER);

    if (!userId || !this.data.findUser(userId)) {
      throw new UnauthorizedException('Unknown or missing user');
    }

    const noteId = String(req.params.id);
    const note = this.data.findNote(noteId);
    if (!note) {
      throw new NotFoundException(`Note ${noteId} not found`);
    }

    if (!this.data.isAssignedToClient(userId, note.clientId)) {
      throw new ForbiddenException('You are not assigned to this client');
    }

    next();
  }
}
