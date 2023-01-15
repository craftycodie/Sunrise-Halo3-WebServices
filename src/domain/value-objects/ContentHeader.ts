export default interface ContentHeader {
  buildNumber: number;
  mapVersion: number;
  uniqueId: string;
  filename: string;
  description: string;
  author: string;
  filetype: number;
  authorXuidIsOnline: boolean;
  authorXuid: string;
  size: number;
  date: string;
  lengthSeconds: number;
  campaignId: number;
  mapId: number;
  gameEngineType: number;
  campaignDifficulty: number;
  hopperId: number;
  gameId: number;
  //ODST
  campaignInsertionPoint: number;
  campaignSurvivalEnabled: boolean;
}
