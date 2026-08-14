import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { DataModule } from './data/data.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DataModule, NotesModule, ClientsModule, UsersModule],
})
export class AppModule {}
