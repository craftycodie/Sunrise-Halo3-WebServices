import FileShare from '../aggregates/FileShare';
import UserID from '../value-objects/UserId';

export default interface IFileShareRepository {
  save: (target: FileShare) => Promise<FileShare>;
  findByOwner: (ownerId: UserID) => Promise<FileShare | null>;
}

export const IFileShareRepositorySymbol = Symbol('IFileShareRepository');
