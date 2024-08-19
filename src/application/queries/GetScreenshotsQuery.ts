import UserID from 'src/domain/value-objects/UserId';

export class GetScreenshotsQuery {
  constructor(public readonly pageSize: number, public readonly pageNumber: number) {}
}
