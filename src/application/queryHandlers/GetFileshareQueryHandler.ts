import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetFileshareQuery } from '../queries/GetFileshareQuery';

@QueryHandler(GetFileshareQuery)
export class GetFileshareQueryHandler
  implements IQueryHandler<GetFileshareQuery>
{
  // constructor(
  //    @Inject(IFileShareRepositorySymbol) private repository: IFileShareRepository,
  // ) {}

  async execute(query: GetFileshareQuery) {
    // return await this.repository.findById(query.albumId);

    return {
      quotaBytes: 500000,
      quotaSlots: 20,
      slotCount: 0,
      visibleSlots: 20,
      subscriptionHash: 0,
      message:
        'Pardon our dust, File Share will be available in the near future!',
    };
  }
}
