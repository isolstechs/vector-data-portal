export interface ICountryGraph {
  id: number;
  name: string;
  code: string;
  total: number;
  trmType: {
    cli: number;
    noCli: number;
    cc: number;
  };
  // percentage: string;
}
