/* eslint-disable camelcase */
export interface IncidentDto {
  client_id: number;
  incident_desc: string;
  city: string;
  country: string;
  date: string;
  weatherReport?: any;
}
