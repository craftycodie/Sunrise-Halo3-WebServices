export default interface HopperDescriptionsFile {
  mhdf: mhdf;
}

interface mhdf {
  descriptions: HopperDescription[];
}

interface HopperDescription {
  identifier: number;
  description: string;
}
