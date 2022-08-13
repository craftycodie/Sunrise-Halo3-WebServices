import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import IScreenshotRepository, {
  IScreenshotRepositorySymbol,
} from 'src/domain/repositories/IScreenshotRepository';
import { GetScreenshotQuery } from '../queries/GetScreenshotQuery';

@QueryHandler(GetScreenshotQuery)
export class GetScreenshotQueryHandler
  implements IQueryHandler<GetScreenshotQuery>
{
  constructor(
    @Inject(IScreenshotRepositorySymbol)
    private repository: IScreenshotRepository,
  ) {}

  async execute(query: GetScreenshotQuery) {
    return this.repository.find(query.id);
  }
}
