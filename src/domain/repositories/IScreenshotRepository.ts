import Screenshot from '../aggregates/Screenshot';
import UserID from '../value-objects/UserId';
import Uuid from '../value-objects/Uuid';

export default interface IScreenshotRepository {
  create: (target: Screenshot) => Promise<Screenshot>;
  find: (id: Uuid) => Promise<Screenshot>;
  findByOwner: (id: UserID) => Promise<Screenshot[]>;
  getRecent: () => Promise<Screenshot[]>;
  list: (pageSize: number, pageNumber: number) => Promise<Screenshot[]>;
}

export const IScreenshotRepositorySymbol = Symbol('IScreenshotRepository');
