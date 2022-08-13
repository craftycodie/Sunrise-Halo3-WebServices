import { TinyTypeOf } from 'tiny-types';
import { v4, validate } from 'uuid';

export default class Uuid extends TinyTypeOf<string>() {
  public static isValidValue(value: string): boolean {
    return validate(value);
  }

  public static create(value?: string): Uuid {
    if (value == undefined) value = v4();

    const isValidValue = Uuid.isValidValue(value);

    if (!isValidValue) {
      throw new Error(`Invalid uuid ${value}.`);
    }

    return new Uuid(value);
  }
}
