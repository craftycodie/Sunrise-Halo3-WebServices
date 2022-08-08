export interface PresentationSettingsProps {
  port: number;
}

export default interface IPresentationSettings {
  get(): PresentationSettingsProps;
}
