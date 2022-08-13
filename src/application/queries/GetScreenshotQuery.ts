import Uuid from 'src/domain/value-objects/Uuid';

export class GetScreenshotQuery {
  constructor(public readonly id: Uuid) {}
}
