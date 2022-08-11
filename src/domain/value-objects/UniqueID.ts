import { TinyTypeOf } from 'tiny-types';

export default class UniqueID extends TinyTypeOf<string>() {
  public static isValidValue(value: string): boolean {
    return true;
  }

  public static create(value: string): UniqueID {
    const isValidValue = UniqueID.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid unique ID string ${value}.`);
    }

    return new UniqueID(value);
  }
}
