import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import IFileShareRepository, {
  IFileShareRepositorySymbol,
} from 'src/domain/repositories/IFileShareRepository';
import { GetFileshareQuery } from '../queries/GetFileshareQuery';

@QueryHandler(GetFileshareQuery)
export class GetFileshareQueryHandler
  implements IQueryHandler<GetFileshareQuery>
{
  constructor(
    @Inject(IFileShareRepositorySymbol)
    private repository: IFileShareRepository,
  ) {}

  async execute(query: GetFileshareQuery) {
    return this.repository.find(query.shareID);
  }
}
