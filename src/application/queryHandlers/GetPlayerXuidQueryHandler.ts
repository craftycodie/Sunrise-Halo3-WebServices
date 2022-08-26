import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import IUserRepository, {
  IUserRepositorySymbol,
} from 'src/domain/repositories/IUserRepository';
import { GetPlayerXuidQuery } from '../queries/GetPlayerXuidQuery';

@QueryHandler(GetPlayerXuidQuery)
export class GetPlayerXuidQueryHandler
  implements IQueryHandler<GetPlayerXuidQuery>
{
  constructor(
    @Inject(IUserRepositorySymbol)
    private repository: IUserRepository,
  ) {}

  async execute(query: GetPlayerXuidQuery) {
    return (await this.repository.findByGamertag(query.gamertag)).xuid;
  }
}
