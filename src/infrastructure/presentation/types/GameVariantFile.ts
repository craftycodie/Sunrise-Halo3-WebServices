import VariantMetadata from './VariantMetadata';

export default interface GameVariantFile {
  gvar: gvar;
}

interface gvar {
  [key: string]: Gametype;
}

interface Gametype {
  metadata: VariantMetadata;
}
