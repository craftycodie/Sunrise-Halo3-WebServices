import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import IScreenshotRepository, {
  IScreenshotRepositorySymbol,
} from 'src/domain/repositories/IScreenshotRepository';
import { GetPlayerScreenshotsQuery } from '../queries/GetPlayerScreenshotsQuery';

@QueryHandler(GetPlayerScreenshotsQuery)
export class GetPlayerScreenshotsQueryHandler
  implements IQueryHandler<GetPlayerScreenshotsQuery>
{
  constructor(
    @Inject(IScreenshotRepositorySymbol)
    private repository: IScreenshotRepository,
  ) {}

  async execute(query: GetPlayerScreenshotsQuery) {
    return this.repository.findByOwner(query.userID);
  }
}
