import { TinyTypeOf } from 'tiny-types';

export default class UserID extends TinyTypeOf<string>() {
  public static isValidValue(value: string): boolean {
    return true;
  }

  public static create(value: string): UserID {
    const isValidValue = UserID.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid user ID string ${value}.`);
    }

    return new UserID(value);
  }
}
