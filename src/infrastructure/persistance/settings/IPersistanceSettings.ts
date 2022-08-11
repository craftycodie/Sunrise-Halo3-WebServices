export interface PersistanceSettingsProps {
  mongoURI: string;
}

export default interface IPersistanceSettings {
  get(): PersistanceSettingsProps;
}
