import { TinyTypeOf } from 'tiny-types';

export default class UserID extends TinyTypeOf<string>() {
  public static isValidValue(value: string): boolean {
    return true;
  }

  constructor(value: string) {
    const isValidValue = UserID.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid user ID string ${value}.`);
    }

    super(value.toUpperCase());
  }
}
