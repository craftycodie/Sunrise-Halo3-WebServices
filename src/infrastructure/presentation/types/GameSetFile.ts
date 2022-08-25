export default interface GameSetFile {
  gset: gset;
}

interface gset {
  gameEntries: GameEntry[];
}

interface GameEntry {
  gameVariantFileName: string;
  mapVariantFileName: string;
}
