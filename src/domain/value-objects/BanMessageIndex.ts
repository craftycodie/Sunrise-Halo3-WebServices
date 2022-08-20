import { TinyTypeOf } from 'tiny-types';

export default class BanMessageIndex extends TinyTypeOf<number>() {
  public static isValidValue(value: number): boolean {
    return value < 32;
  }

  public static create(value: number): BanMessageIndex {
    const isValidValue = BanMessageIndex.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid ban message index ${value}.`);
    }

    return new BanMessageIndex(value);
  }
}
