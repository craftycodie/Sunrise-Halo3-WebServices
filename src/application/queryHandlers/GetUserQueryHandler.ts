import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import IUserRepository, {
  IUserRepositorySymbol,
} from 'src/domain/repositories/IUserRepository';
import { GetUserQuery } from '../queries/GetUserQuery';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(IUserRepositorySymbol)
    private repository: IUserRepository,
  ) {}

  async execute(query: GetUserQuery) {
    return this.repository.findByXuid(query.xuid);
  }
}
