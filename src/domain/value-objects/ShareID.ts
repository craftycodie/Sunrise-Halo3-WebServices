import { TinyTypeOf } from 'tiny-types';

export default class ShareID extends TinyTypeOf<string>() {
  public static isValidValue(value: string): boolean {
    return true;
  }

  public static create(value: string): ShareID {
    const isValidValue = ShareID.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid share ID string ${value}.`);
    }

    return new ShareID(value);
  }
}
