import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import IScreenshotRepository, {
  IScreenshotRepositorySymbol,
} from 'src/domain/repositories/IScreenshotRepository';
import { GetScreenshotsQuery } from '../queries/GetScreenshotsQuery';

@QueryHandler(GetScreenshotsQuery)
export class GetScreenshotsQueryHandler
  implements IQueryHandler<GetScreenshotsQuery>
{
  constructor(
    @Inject(IScreenshotRepositorySymbol)
    private repository: IScreenshotRepository,
  ) {}

  async execute(query: GetScreenshotsQuery) {
    return this.repository.list(query.pageSize, query.pageNumber);
  }
}
