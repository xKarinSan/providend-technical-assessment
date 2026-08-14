import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { NoteAccessMiddleware } from './note-access.middleware';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Only the single-note route is guarded; `notes/u/:userId` is a two-segment
    // path and therefore does not match.
    consumer
      .apply(NoteAccessMiddleware)
      .forRoutes({ path: 'notes/:id', method: RequestMethod.GET });
  }
}
