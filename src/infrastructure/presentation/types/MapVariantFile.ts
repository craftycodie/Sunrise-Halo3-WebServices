import VariantMetadata from './VariantMetadata';

export default interface MapVariantFile {
  mvar: mvar;
}

interface mvar {
  metadata: VariantMetadata;
}
