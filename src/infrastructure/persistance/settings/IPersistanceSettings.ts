export interface PersistanceSettingsProps {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export default interface IPersistanceSettings {
  get(): PersistanceSettingsProps;
}
