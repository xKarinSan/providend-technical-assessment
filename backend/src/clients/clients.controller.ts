import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from '../data/data.service';
import type { Client } from '../data/entities';

@Controller('clients')
export class ClientsController {
  constructor(private readonly data: DataService) {}

  /**
   * Clients the user is assigned to — the options for the add-note dropdown.
   * An unknown user simply has no assigned clients.
   */
  @Get('u/:userId')
  listForUser(@Param('userId') userId: string): Client[] {
    const assigned = new Set(this.data.assignedClientIds(userId));
    return this.data.listClients().filter((client) => assigned.has(client.id));
  }
}
