import User from '../aggregates/User';
import UserID from '../value-objects/UserId';

export default interface IUserRepository {
  save: (target: User) => Promise<User>;
  findByXuid: (xuid: UserID) => Promise<User | null>;
  findByGamertag: (gamertag: string) => Promise<User | null>;
  list: (pageSize: number, pageNumber: number) => Promise<User[]>;
}

export const IUserRepositorySymbol = Symbol('IUserRepository');
