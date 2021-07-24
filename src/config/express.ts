/* eslint-disable no-unused-vars */
import googleTrends from 'google-trends-api';
import cors from 'cors';
import morgan from 'morgan';
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import { Helper, genericErrors, constants, ModuleError } from '@src/utils';
import client from './twitter';
import middleware from '@src/middleware';

const { successResponse, errorResponse, moduleErrLogMessager } = Helper;
const { notFoundApi } = genericErrors;

const { WELCOME } = constants;

const expressConfig = (app: Application): void => {
  app.use(cors());
  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(json());
  app.use(morgan('dev'));

  app.get('/', (req: Request, res: Response) => successResponse(res, { message: WELCOME }));

  app.get(
    '/twitter/:location',
    middleware.getGoeCode,
    middleware.getCountryWoeid,
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      try {
        const { countryWoeid, location } = req;
        const data = await client.get('trends/place', { id: countryWoeid });
        const newData = data[0].trends.map((el: Record<string, string>) => {
          return el.name;
        });

        return successResponse(res, {
          message: `${location} trends`,
          data: newData,
        });
      } catch (e) {
        const status = e.response ? e.response.status : 500;
        const error = new ModuleError({ message: e.message, status });
        moduleErrLogMessager(error);
        return next(error);
      }
    }
  );

  app.get(
    '/news/:location',
    middleware.getLocationAlpha2Code,
    middleware.getTopHeadlines,
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      try {
        const { news, location } = req;
        return successResponse(res, {
          message: `${location} news`,
          data: news,
        });
      } catch (error) {
        return next(error);
      }
    }
  );
  app.get(
    '/google/:location',
    middleware.getGoeCode,
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      try {
        const { alpha2Code, location } = req;
        const data = await googleTrends.dailyTrends({
          geo: alpha2Code,
        });
        const {
          default: { trendingSearchesDays },
        } = JSON.parse(data);
        const [{ trendingSearches }] = trendingSearchesDays;
        const trends: Array<string> = [];
        trendingSearches.reduce((acc: Record<string, string>, cur: Record<string, Record<string, string>>) => {
          trends.push(cur.title.query);
          return acc;
        }, {});

        return successResponse(res, {
          message: `${location} google trends`,
          data: trends,
        });
      } catch (error) {
        return next(error);
      }
    }
  );
  app.use((req, res, next) => next(notFoundApi));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => errorResponse(req, res, err));
};

export default expressConfig;
