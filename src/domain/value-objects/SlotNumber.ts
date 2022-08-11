import { TinyTypeOf } from 'tiny-types';

export default class SlotNumber extends TinyTypeOf<number>() {
  public static isValidValue(value: number): boolean {
    return value <= 32;
  }

  public static create(value: number): SlotNumber {
    const isValidValue = SlotNumber.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid slot number ${value}.`);
    }

    return new SlotNumber(value);
  }
}
