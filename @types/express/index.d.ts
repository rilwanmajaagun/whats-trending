declare namespace Express {
  export interface Request {
    long: string;
    lat: string;
    countryWoeid: string;
    location: string;
    alpha2Code: string;
    news: any;
  }
}

declare module 'google-trends-api';
