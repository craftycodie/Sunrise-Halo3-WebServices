import ServiceRecord from 'src/domain/entities/ServiceRecord';
import UserID from 'src/domain/value-objects/UserId';

export class UpdateServiceRecordCommand {
  constructor(
    public readonly xuid: UserID,
    public readonly serviceRecord: Partial<ServiceRecord>,
  ) {}
}
