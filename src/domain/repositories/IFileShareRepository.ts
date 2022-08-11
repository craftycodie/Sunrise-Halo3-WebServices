import FileShare from '../aggregates/FileShare';
import ShareID from '../value-objects/ShareId';

export default interface IFileShareRepository {
  save: (target: FileShare) => Promise<FileShare>;
  find: (id: ShareID) => Promise<FileShare | null>;
}

export const IFileShareRepositorySymbol = Symbol('IFileShareRepository');
