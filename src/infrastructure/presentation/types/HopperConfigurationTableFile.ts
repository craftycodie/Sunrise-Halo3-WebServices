export default interface HopperConfigurationTableFile {
  mhcf: mhcf;
}

interface mhcf {
  categories: HopperCategory[];
  configurations: HopperConfiguration[];
}

interface HopperCategory {
  identifier: number;
  name: string;
}

interface HopperConfiguration {
  identifier: number;
  name: string;
  category: number;
}
