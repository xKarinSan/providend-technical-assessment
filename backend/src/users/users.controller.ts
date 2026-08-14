import { Controller, Get } from '@nestjs/common';
import { DataService } from '../data/data.service';
import type { User } from '../data/entities';

@Controller('users')
export class UsersController {
  constructor(private readonly data: DataService) {}

  /**
   * Lets the UI offer a "acting as" picker. With real authentication the
   * current user would come from the token instead.
   */
  @Get()
  list(): User[] {
    return this.data.listUsers();
  }
}
