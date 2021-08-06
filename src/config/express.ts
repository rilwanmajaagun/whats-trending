/* eslint-disable no-unused-vars */
import cors from 'cors';
import morgan from 'morgan';
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import { Helper, genericErrors, constants } from '@src/utils';
import middleware from '@src/middleware';
import controller from '@src/controller';

const { successResponse, errorResponse } = Helper;
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
  app.get('/twitter/:location', middleware.getGoeCode, middleware.getCountryWoeid, controller.twitterTrends);
  app.get('/news/:location', middleware.getLocationAlpha2Code, middleware.getTopHeadlines, controller.news);
  app.get('/google/:location', middleware.getGoeCode, controller.googleTrends);
  app.use((req, res, next) => next(notFoundApi));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => errorResponse(req, res, err));
};

export default expressConfig;
