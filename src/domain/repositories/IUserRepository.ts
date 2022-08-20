import User from '../aggregates/User';
import UserID from '../value-objects/UserId';

export default interface IUserRepository {
  save: (target: User) => Promise<User>;
  findByXuid: (xuid: UserID) => Promise<User | null>;
}

export const IUserRepositorySymbol = Symbol('IUserRepository');
