/* eslint-disable no-unused-vars */

import cors from 'cors';
import morgan from 'morgan';
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import { Helper, genericErrors, constants, ModuleError } from '@src/utils';
import client from './twitter';
import trendMiddleware from '@src/middleware';

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
    '/trends/:location',
    trendMiddleware.getGoeCode,
    trendMiddleware.getCountryWoeid,
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        const { countryWoeid } = req;
        const trends = await client.get('trends/place', { id: countryWoeid });
        return successResponse(res, {
          message: 'trends',
          data: trends,
        });
      } catch (e) {
        const status = e.response ? e.response.status : 500;
        const error = new ModuleError({ message: e.message, status });
        moduleErrLogMessager(error);
        return next(error);
      }
    }
  );
  app.use((req, res, next) => next(notFoundApi));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => errorResponse(req, res, err));
};

export default expressConfig;
