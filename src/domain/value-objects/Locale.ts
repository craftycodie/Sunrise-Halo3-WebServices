import { TinyTypeOf } from 'tiny-types';

export default class Locale extends TinyTypeOf<string>() {
  public static isValidValue(value: string): boolean {
    return true;
  }

  public static create(value: string): Locale {
    const isValidValue = Locale.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid locale string ${value}.`);
    }

    return new Locale(value);
  }
}
