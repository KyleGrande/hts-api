export interface Config {
  environment: string;
  port: string;
  databaseUrl: string;

  // Other configuration properties...
}
export interface Location {
  lat: number;
  long: number;
}
