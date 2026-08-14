import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  /** The user that wrote the note. */
  @IsString()
  @IsNotEmpty()
  authorId!: string;

  /** The client the note belongs to. */
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  /** Markdown content. Allowed to be empty for now, per the spec. */
  @IsString()
  content!: string;
}
